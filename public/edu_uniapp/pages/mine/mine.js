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
			userInfo: {},
			tabList: [],
			headerImg: ''
		})

		// 获取页面参数
		onLoad(() => {
			initData();
		})

		async function initData() {
			// 获取用户信息
			bindData.userInfo = uni.getStorageSync('userInfo') || {};
			// 获取学习统计数据
			let res = await util.postByBeanName('eduUserService', 'loadStudentHomeData', {});
			if (res.tabList) {
				bindData.tabList = res.tabList;
			}
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

		// 跳转到考试记录
		function toExamRecord() {
			uni.navigateTo({
				url: '/pages/exam/examRecord'
			})
		}

		return {
			...toRefs(bindData),
			initData,
			toLogout,
			toCourseList,
			toExamRecord,
		}
	}
};
