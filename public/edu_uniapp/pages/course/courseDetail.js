import {
	util,
	common
} from '/common/commonImport';
import {
	onLoad,
	onShow
} from '@dcloudio/uni-app'
import {
	reactive,
	toRefs
} from "vue";
export default {
	setup() {
		// 绑定数据
		let bindData = reactive({
			course: {
				baseInfo: {
					files: [],
					imgUrl: '',
					courseName: '',
					durationStr: '',
					lecturerNames: '',
					credit: '',
					studyNums: 0,
					studyState: 0,
					introduction: '',
					testId: ''
				},
				chapters: []
			},
			showType: 2,
			routeOptions: {}
		})

		// 获取页面参数
		onLoad((options) => {
			bindData.routeOptions = options
			doQuery();
		})

		// 页面显示时刷新数据（从子页面返回时触发）
		onShow(() => {
			if (bindData.routeOptions.courseId) {
				doQuery();
			}
		})

		async function doQuery() {
			let res = await util.postByBeanName('eduCourseService', 'getEduCourseInfo', {
				id: bindData.routeOptions.courseId
			});
			res.baseInfo.durationStr = formatDuration(res.baseInfo.duration);
			bindData.course = res;
			// 如果是继续学习，自动跳转到章节详情
			// if (common.isNotBlank(bindData.routeOptions.lastStudyExtId) && bindData.routeOptions.state != '1') {
			// 	continueStudy();
			// }
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

		// 继续学习 - 跳转到章节详情页
		function continueStudy() {
			let {
				lastStudyExtId,
				chapterId
			} = bindData.routeOptions;
			// 找到对应的章节和文件
			for (let chapter of bindData.course.chapters) {
				if (chapter.id == chapterId) {
					for (let file of chapter.files) {
						if (file.id == lastStudyExtId) {
							toChapterDetail(chapter, file);
							return;
						}
					}
				}
			}
			// 如果没找到，默认进入章节列表
			bindData.showType = 2;
		}

		// 开始学习
		function learn() {
			if (common.isNotBlank(bindData.routeOptions.lastStudyExtId)) {
				continueStudy();
			} else {
				bindData.showType = 2;
			}
		}

		// 切换Tab
		function changeTab(type) {
			bindData.showType = type;
		}

		// 选择课程章节 - 跳转到章节详情页
		function chooseChapter(chapter, file) {
			toChapterDetail(chapter, file);
		}

		// 跳转到章节详情页
		function toChapterDetail(chapter, file) {
			uni.navigateTo({
				url: `/pages/course/chapterDetail?chapterInfo=${encodeURIComponent(JSON.stringify(chapter))}&fileInfo=${encodeURIComponent(JSON.stringify(file))}`
			});
		}

		// 去考试
		function toExam(testId) {
			if (common.isBlank(testId)) {
				uni.showToast({
					title: '课程还没有发布试卷，无法考试！',
					icon: 'none'
				});
				return false;
			}
			uni.navigateTo({
				url: '/pages/exam/exam?testId=' + testId
			})
		}

		// 下载文件
		function downloadFile(url) {
			// #ifdef H5
			window.open(url);
			// #endif
			// #ifndef H5
			uni.downloadFile({
				url: url,
				success: (res) => {
					if (res.statusCode === 200) {
						uni.saveFile({
							tempFilePath: res.tempFilePath,
							success: () => {
								uni.showToast({
									title: '下载成功',
									icon: 'success'
								});
							}
						});
					}
				},
				fail: () => {
					uni.showToast({
						title: '下载失败',
						icon: 'none'
					});
				}
			});
			// #endif
		}

		function visitFile(url){
			uni.navigateTo({
				url: `/pages/pdfViewer/pdfViewer?url=${encodeURIComponent(url)}`
			});
		}

		return {
			...toRefs(bindData),
			doQuery,
			learn,
			changeTab,
			chooseChapter,
			toExam,
			downloadFile,
			visitFile
		}
	}
};
