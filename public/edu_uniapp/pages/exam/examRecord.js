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
			records: [],
			totalNum: 0,
			page: 1,
			loading: false,
			finished: false
		})

		// 获取页面参数
		onLoad((options) => {
			queryRecords();
		})

		// 查询考试记录
		async function queryRecords() {
			if (bindData.loading || bindData.finished) return;
			
			bindData.loading = true;
			try {
				const result = await util.postByBeanName('eduTestService', 'queryUserTestRecordPage',{
                    page: bindData.page,
					count: 10
                });
				
				if (result) {
					const records = result.items || [];
					bindData.totalNum = result.totalNum || 0;
					
					if (bindData.page === 1) {
						bindData.records = records;
					} else {
						bindData.records = [...bindData.records, ...records];
					}
					
					// 判断是否加载完成
					if (bindData.records.length >= bindData.totalNum) {
						bindData.finished = true;
					} else {
						bindData.page++;
					}
				}
			} catch (error) {
				uni.showToast({ title: '获取考试记录失败', icon: 'none' });
			} finally {
				bindData.loading = false;
			}
		}

		// 下拉刷新
		function onRefresh() {
			bindData.page = 1;
			bindData.finished = false;
			queryRecords();
		}

		// 上拉加载更多
		function onLoadMore() {
			queryRecords();
		}

		// 点击记录跳转到详情
		function goToDetail(record) {
			uni.navigateTo({
				url: `/pages/exam/examDetail?testId=${record.testId}&relId=${record.relId}`
			});
		}

		// 返回
		function goBack() {
			uni.navigateBack();
		}

		return {
			...toRefs(bindData),
			queryRecords,
			onRefresh,
			onLoadMore,
			goToDetail,
			goBack
		}
	}
};
