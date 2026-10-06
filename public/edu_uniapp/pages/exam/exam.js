
import {
	util,
	common
} from '/common/commonImport';
import {
	onLoad,
	onUnload,
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
			info: {
				id: '',
				testId: '',
				relId: '',
				testName: '在线考试',
				testDuration: 0,
				totalDuration: 7200000,
				beginTime: 0,
				questions: [],
				totalScore: 0
			}
		})
		
		// 考试信息
		let examInfo = reactive({
			elapsedTime: 0,
			switchCount: 0,
			isSubmitting: false,
			timer: null,
			hiddenTime: null
		})
		
		// 监听页面加载
		onLoad((options) => {
			bindData.info.testId = options.testId || '';
			bindData.info.relId = options.relId || '';
			bindData.info.testName = decodeURIComponent(options.testName || '在线考试');
			bindData.info.totalDuration = parseInt(options.totalDuration) || 7200000;
			beginExam();
		})
		
		// 监听页面显示
		onShow(() => {
			addVisibilityListener();
		})
		
		// 监听页面卸载
		onUnload(() => {
			clearExam();
		})
		
		// 开始考试
		function beginExam() {
			bindData.info.beginTime = new Date().getTime();
			examInfo.elapsedTime = 0;
			examInfo.switchCount = 0;
			doQuery();
			startTimer();
		}
		
		// 启动计时器
		function startTimer() {
			if (examInfo.timer) {
				clearInterval(examInfo.timer);
			}
			examInfo.timer = setInterval(() => {
				examInfo.elapsedTime += 1000;
				bindData.info.testDuration = examInfo.elapsedTime;
			}, 1000);
		}
		
		// 清除计时器
		function clearExam() {
			if (examInfo.timer) {
				clearInterval(examInfo.timer);
				examInfo.timer = null;
			}
			removeVisibilityListener();
		}
		
		// 添加页面可见性监听
		function addVisibilityListener() {
			document.addEventListener('visibilitychange', handleVisibilityChange);
		}
		
		// 移除页面可见性监听
		function removeVisibilityListener() {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		}
		
		// 处理页面切换
		function handleVisibilityChange() {
			if (document.hidden) {
				handlePageHidden();
			} else {
				handlePageVisible();
			}
		}
		
		// 页面切出时
		function handlePageHidden() {
			examInfo.hiddenTime = new Date().getTime();
		}
		
		// 页面恢复时
		function handlePageVisible() {
			if (examInfo.hiddenTime && !examInfo.isSubmitting) {
				const hiddenDuration = new Date().getTime() - examInfo.hiddenTime;
				examInfo.switchCount++;
				
				if (examInfo.switchCount >= 3) {
					uni.showModal({
						title: '考试提醒',
						content: `检测到频繁切换页面，为保证考试公平，系统将直接提交您的试卷！`,
						showCancel: false,
						success: () => {
							submitExam();
						}
					});
				} else {
					uni.showModal({
						title: '考试提醒',
						content: `检测到您已离开考试页面 ${examInfo.switchCount} 次，超过3次将自动提交试卷！\n\n离开时长：${formatDuration(hiddenDuration)}\n请确认是否继续考试？`,
						confirmText: '继续考试',
						cancelText: '提交试卷',
						success: (res) => {
							if (!res.confirm) {
								submitExam();
							}
						}
					});
				}
			}
			examInfo.hiddenTime = null;
		}
		
		// 获取考试信息
		async function doQuery() {
			try {
				const result = await util.postByBeanName('eduCourseService', 'getEduTestInfo', {
					testId: bindData.info.testId,
					relId: bindData.info.relId,
					answerFlag: 1
				});
				if (result) {
					Object.assign(bindData.info, result);
					calculateTotalScore();
				}
			} catch (error) {
				uni.showToast({ title: '获取试卷信息失败', icon: 'none' });
			}
		}
		
		// 计算总分
		function calculateTotalScore() {
			if (bindData.info.questions && bindData.info.questions.length > 0) {
				bindData.info.totalScore = bindData.info.questions.reduce((sum, q) => sum + (q.score || 0), 0);
			}
		}
		
		// 强制更新
		function forceUpdate() {
			// uni-app 不需要强制更新
		}
		
		// 提交试卷
		async function submitExam() {
			if (examInfo.isSubmitting) return;
			
			examInfo.isSubmitting = true;
			clearExam();
			
			let info = bindData.info;
			info.testDuration = examInfo.elapsedTime;

			if (common.isBlank(info.id)) {
				uni.showToast({ title: "试卷不存在，请刷新试试！", icon: 'none' });
				examInfo.isSubmitting = false;
				return false;
			}
			if (common.isBlank(info.questions) || info.questions.length === 0) {
				uni.showToast({ title: "试卷题目为空！", icon: 'none' });
				examInfo.isSubmitting = false;
				return false;
			}
			
			// for (let i = 0; i < info.questions.length; i++) {
			// 	let question = info.questions[i];
			// 	if (common.isBlank(question.id)) {
			// 		uni.showToast({ title: "试卷第" + (i + 1) + "条题目不存在！", icon: 'none' });
			// 		examInfo.isSubmitting = false;
			// 		return false;
			// 	}
			// 	if (question.type == 4) {
			// 		if (common.isBlank(question.answerContent)) {
			// 			uni.showToast({ title: "试卷第" + (i + 1) + "条题目答案为空！", icon: 'none' });
			// 			examInfo.isSubmitting = false;
			// 			return false;
			// 		}
			// 	} else if (question.type == 3) {
			// 		if (common.isBlank(question.selectAnswer) || question.selectAnswer < 0) {
			// 			uni.showToast({ title: "试卷第" + (i + 1) + "条题目答案为空！", icon: 'none' });
			// 			examInfo.isSubmitting = false;
			// 			return false;
			// 		}
			// 	} else {
			// 		let answerCount = 0;
			// 		for (let j = 0; j < question.questionOptions.length; j++) {
			// 			let option = question.questionOptions[j];
			// 			if (option.selectAnswer == "1") {
			// 				answerCount++;
			// 			}
			// 		}
			// 		if (answerCount === 0) {
			// 			uni.showToast({ title: "试卷第" + (i + 1) + "条题目还没有选择答案！", icon: 'none' });
			// 			examInfo.isSubmitting = false;
			// 			return false;
			// 		}
			// 	}
			// }

			try {
				await util.postByBeanName('eduTestService', 'exam', info);
				uni.showToast({ title: "提交成功！", icon: 'success' });
				const timer = setTimeout(() => {
					uni.navigateTo({
                        url: `/pages/home/home`
                    })
					clearTimeout(timer);
				}, 1500);
			} catch (error) {
				uni.showToast({ title: "提交失败，请重试！", icon: 'none' });
				examInfo.isSubmitting = false;
			}
		}
		
		// 切换答案
		function changeAnswer(item, answer) {
			item.questionOptions.forEach(el => {
				el.selectAnswer = "0";
			});
			answer.selectAnswer = "1";
		}
		
		// 多选切换
		function toggleMultiAnswer(option) {
			option.selectAnswer = option.selectAnswer == "1" ? "0" : "1";
		}
		
		// 格式化时长
		function formatDuration(ms) {
			if (!ms) return '0秒';
			const seconds = Math.floor(ms / 1000);
			const minutes = Math.floor(seconds / 60);
			const hours = Math.floor(minutes / 60);
			
			if (hours > 0) {
				return `${hours}小时${minutes % 60}分${seconds % 60}秒`;
			} else if (minutes > 0) {
				return `${minutes}分${seconds % 60}秒`;
			} else {
				return `${seconds}秒`;
			}
		}
		
		// 获取已用时间格式化
		function getElapsedTime() {
			return formatDuration(examInfo.elapsedTime);
		}
		
		// 关闭当前页面
		function closePage() {
			uni.navigateBack();
		}
		
		// 点击返回按钮
		function handleBack() {
			uni.showModal({
				title: '提示',
				content: '确定要返回吗？返回后本次考试进度将不会保存。',
				confirmText: '确定返回',
				cancelText: '继续考试',
				success: (res) => {
					if (res.confirm) {
						clearExam();
						closePage();
					}
				}
			});
		}
		
		// 点击提交按钮
		function handleSubmit() {
			uni.showModal({
				title: '确认提交',
				content: '确定要提交试卷吗？\n\n已用时：' + getElapsedTime() + '\n题目总数：' + bindData.info.questions.length + ' 题\n\n提交后将无法修改答案！',
				confirmText: '确定提交',
				cancelText: '取消',
				success: (res) => {
					if (res.confirm) {
						submitExam();
					}
				}
			});
		}
		
		return {
			...toRefs(bindData),
			examInfo,
			initData: beginExam,
			startTimer,
			clearExam,
			handleVisibilityChange,
			handlePageHidden,
			handlePageVisible,
			forceUpdate,
			submitExam,
			changeAnswer,
			toggleMultiAnswer,
			formatDuration,
			getElapsedTime,
			closePage,
			handleBack,
			handleSubmit,
		}
	}
};
