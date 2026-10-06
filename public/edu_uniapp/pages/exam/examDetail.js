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
			info: {
				testId: '',
				relId: '',
				testName: '考试详情',
				questions: [{}],
				totalScore: 0,
				userScore: 0,
				isPass: false,
				isPassName: ''
			},
			loading: true
		})

		// 获取页面参数
		onLoad((options) => {
			bindData.info.testId = options.testId || '';
			bindData.info.relId = options.relId || '';
			queryExamDetail();
		})

		// 查询考试详情
		async function queryExamDetail() {
			bindData.loading = true;
			try {
				const result = await util.postByBeanName('eduCourseService', 'getEduTestInfo', {
					testId: bindData.info.testId,
					relId: bindData.info.relId,
				});
				
				if (result) {
					bindData.info = {
						...bindData.info,
						...result
					};
					calculateScores();
				}
			} catch (error) {
				uni.showToast({ title: '获取考试详情失败', icon: 'none' });
			} finally {
				bindData.loading = false;
			}
		}

		// 计算总分和用户得分
		function calculateScores() {
			if (bindData.info.questions && bindData.info.questions.length > 0) {
				// 总分
				bindData.info.totalScore = bindData.info.questions.reduce((sum, q) => sum + (q.score || 0), 0);
				
				// 用户得分
				bindData.info.userScore = bindData.info.questions.reduce((sum, q) => sum + (q.userScore || 0), 0);
				
				// 是否通过（假设60分及格）
				bindData.info.isPass = bindData.info.userScore >= bindData.info.totalScore * 0.6;
				bindData.info.isPassName = bindData.info.isPass ? '通过' : '未通过';
			}
		}

		// 返回
		function goBack() {
			uni.navigateBack();
		}

		return {
			...toRefs(bindData),
			queryExamDetail,
			goBack
		}
	}
};
