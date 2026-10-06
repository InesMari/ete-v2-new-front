import {
	util,
	common
} from '/common/commonImport';
import {
	onLoad,
	onHide,
	onShow
} from '@dcloudio/uni-app'
import {
	reactive,
	toRefs,
	ref,
	computed
} from "vue";
export default {
	setup() {
		// 绑定数据
		let bindData = reactive({
			navActive: 1,
			currentTabs: 0,
			tabs: [{
				value: 1,
				name: "待处理"
			},{
				value: 2,
				name: "已完毕"
			}],
			courseList:[],
			// mine 页面数据
			userInfo: uni.getStorageSync('userInfo') || {},
			tabList: [],
		})
		let staticData = {
			stateStr:"0,1,2,3,4"
		}
		/**
		 * 生命周期函数--监听页面加载
		 */
		// onLoad(() => {
		// 	initData();
		// 	initMineData();
		// })
		onShow(()=>{
			initData();
			initMineData();
		})

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

		async function initData() {
			let {items} = await util.postByBeanName('eduCourseService', 'queryCoursePageForStudent', {"searchKey":"","stateStr":staticData.stateStr});
			// 转换时长字段
			if (items && items.length > 0) {
				items.forEach(item => {
					item.durationStr = formatDuration(item.duration);
					item.studyDurationStr = formatDuration(item.studyDuration);
				});
			}
			bindData.courseList = items;
		}

		// 初始化 mine 页面数据
		async function initMineData() {
			let res = await util.postByBeanName('eduUserService', 'loadStudentHomeData', {});
			if (res.tabList) {
				bindData.tabList = res.tabList;
			}
		}
		// 滚动加载
		function scrolltolowerHandler() {
			if (staticData.hasNext) {
				staticData.page++;
			}
		}
		// 上拉刷新
		function toupper() {
			bindData.isRefresh = true;
		}

		// 切换tabs			
		function changeTab(index) {
			bindData.dispatchState = bindData.tabs[index].id;
			if(index == 0){
				staticData.stateStr = "0,1,2,3,4";
			}else if(index == 1){
				staticData.stateStr = "9";
			}
			initData();
		}
        // 去学习
        function toLearn(item,state){
            item.state = state;
            let {lastStudyExtId,chapterId,studyDuration,courseId} = item;
			uni.navigateTo({
				url: `/pages/course/courseDetail?lastStudyExtId=${item.lastStudyExtId}&state=${item.state}&chapterId=${item.chapterId}&studyDuration=${item.studyDuration}&courseId=${item.courseId}`
			})
			
			this.$emit("openTab",{
                urlName: "查看课程",
                urlId: "courseDetail"+item.courseId,
                urlPath: "/edu/student/course/courseDetail.vue",
                urlPathName: "/courseDetail",
                query:{lastStudyExtId,state,chapterId,studyDuration,courseId}
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

		// 退出登录
		async function toLogout() {
			uni.showModal({
				title: '提示',
				content: '确定要退出登录吗？',
				success: async (res) => {
					if (res.confirm) {
						await util.postByBeanName('wxUserTF', 'logout', {});
						uni.clearStorageSync();
						uni.reLaunch({
							url: '/pages/login/login',
						})
					}
				}
			})
		}

		// 跳转到课程列表
		function toCourseList(tabItem) {
			uni.navigateTo({
				url: `/pages/course/courseList?stateStr=${tabItem.stateStr}`
			})
		}

		// 切换底部导航
		function changeNav(index) {
			bindData.navActive = index;
			if(index == 1){
				initData();
			}else if(index == 2){
				initMineData();
			}
		}

		// 格式化手机号
		function formatPhone(phone) {
			if (!phone) return '未绑定手机';
			return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
		}

		// 跳转到考试记录
		function toExamRecord() {
			uni.navigateTo({
				url: '/pages/exam/examRecord'
			})
		}

		return {
			...toRefs(bindData),
			changeTab,
			toupper,
			scrolltolowerHandler,
			changeNav,
			toLearn,
			toLogout,
			toCourseList,
			formatPhone,
			initMineData,
			toExam,
			toExamRecord,
		}

	}
};