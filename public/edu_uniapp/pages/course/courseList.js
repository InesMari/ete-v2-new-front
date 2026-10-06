import {
	util,
	common
} from '/common/commonImport';
import {
	onLoad
} from '@dcloudio/uni-app'
import {
	reactive,
	toRefs
} from "vue";
export default {
	setup() {
		// 绑定数据
		let bindData = reactive({
			courseList: [],
			page: 1,
			pageSize: 20,
			hasMore: true,
			loading: false
		})

		let routeOptions = {}

		// 获取页面参数
		onLoad((options) => {
			routeOptions = options;
			// 根据 stateStr 设置页面标题
			if (options.title) {
				uni.setNavigationBarTitle({
					title: decodeURIComponent(options.title)
				})
			}
			initData();
		})

		async function initData() {
			bindData.loading = true;
			let {items} = await util.postByBeanName('eduCourseService', 'queryCoursePageForStudent', {
				searchKey: "",
				stateStr: routeOptions.stateStr || "",
				pageNum: bindData.page,
				pageSize: bindData.pageSize
			});
			bindData.loading = false;
			if (items) {
				// 转换时长字段
				items.forEach(item => {
					item.durationStr = formatDuration(item.duration);
					item.studyDurationStr = formatDuration(item.studyDuration);
				});
				if (bindData.page == 1) {
					bindData.courseList = items;
				} else {
					bindData.courseList = [...bindData.courseList, ...items];
				}
				bindData.hasMore = items.length >= bindData.pageSize;
			}
		}
		
		// 格式化时长（秒转为xx分xx秒，少于一分钟显示xx秒）
		function formatDuration(seconds) {
			if (!seconds || seconds <= 0) return '0秒';
			seconds = Math.floor(seconds);
			const minutes = Math.floor(seconds / 60);
			const secs = seconds % 60;
			if (minutes === 0) {
				return secs + '秒';
			}
			return minutes + '分' + secs + '秒';
		}

		// 加载更多
		function onReachBottom() {
			if (bindData.hasMore && !bindData.loading) {
				bindData.page++;
				initData();
			}
		}

		// 去学习
		function toLearn(item) {
			let { lastStudyExtId, chapterId, studyDuration, courseId } = item;
			let state = item.state || 0;
			uni.navigateTo({
				url: `/pages/course/courseDetail?lastStudyExtId=${lastStudyExtId || ''}&state=${state}&chapterId=${chapterId || ''}&studyDuration=${studyDuration || 0}&courseId=${courseId}`
			})
		}

		// 去考试
		function toExam(item) {
			let {testId, relId, testName, totalDuration} = item;
			if (common.isBlank(testId)) {
				uni.showToast({
					title: '课程还没有发布试卷，无法考试！',
					icon: 'none'
				});
				return false;
			}
			uni.navigateTo({
				url: `/pages/exam/exam?testId=${testId}&relId=${relId}&testName=${encodeURIComponent(testName || '')}&totalDuration=${totalDuration || 7200000}`
			})
		}   

		return {
			...toRefs(bindData),
			initData,
			onReachBottom,
			toLearn,
			toExam,
		}
	}
};
