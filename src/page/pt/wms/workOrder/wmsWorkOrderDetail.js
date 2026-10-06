export default {
	name: 'wmsWorkOrderDetail',
	data()
	{
		return {
			order: {
				workName:null,
				tenantName:null,
				month:null,
				unit:null,
				itemTypeName:null,
				itemName:null,
				tax:null,
				price:null,
				priceWithTax:null,
				settleNumSum:null,
				settleFeeSum:null,
				settleFeeWithTaxSum:null,
			},
			total: {
				confirmNum: 0,
				settleNum: 0,
				settleFeeWithTax: 0,
				noSettleNum: 0,
			},
			monthList: [{}],
		}
	},
	mounted()
	{
		this.loadOrderInfo();
	},
	/**
	 * 组件
	 */
	components: {
	},
	methods: {
		/**
		 * 加载订单数据
		 */
		async loadOrderInfo()
		{
			let param = this.$route.query;
			param.isLoadMonthList = 1;
			let data = await this.common.postUrl("workOrderService", "loadWorkOrderMonthData", param);
			this.order = data.info;
			this.monthList = data.monthList;
			let confirmNum = 0;
			let settleNum = 0;
			let settleFeeWithTax = 0;
			let noSettleNum = 0;
			this.monthList.forEach(item => {
				confirmNum = this.common.accAdd(confirmNum, item.confirmNum);
				settleNum = this.common.accAdd(settleNum, item.settleNum);
				settleFeeWithTax = this.common.accAdd(settleFeeWithTax, item.settleFeeWithTax);
				noSettleNum = this.common.accAdd(noSettleNum, item.noSettleNum);
			});
			this.total.confirmNum = confirmNum;
			this.total.settleNum = settleNum;
			this.total.settleFeeWithTax = settleFeeWithTax;
			this.total.noSettleNum = noSettleNum;
			this.$forceUpdate();
		},
		/**
		 * 详情
		 * @returns {boolean}
		 */
		toOrderDetail(item)
		{
			let id = item.id;
			this.$emit('openTab', {
				urlName: '作业单详情',
				urlId: 'workOrderInfo-detail' + id,
				urlPathName: "/wms",
				urlPath: "/pt/wms/workOrder/workOrderInfo.vue",
				query: {id: id, type: 0}//0详情
			});
		},
		exportExcel()
		{
			let fileName = '外包作业月份详情表.xlsx';
			if (this.common.isBlank(this.$route.query.month))
			{
				this.$message.error("没有月份数据！");
				return;
			}
			if (this.common.isBlank(this.$route.query.workId))
			{
				this.$message.error("没有仓库数据！");
				return;
			}
			if (this.common.isBlank(this.$route.query.tenantId))
			{
				this.$message.error("没有供应商数据！");
				return;
			}
			if (this.common.isBlank(this.$route.query.itemId))
			{
				this.$message.error("没有费用类型数据！");
				return;
			}
			let param = {
				month: this.$route.query.month,
				workId: this.$route.query.workId,
				tenantId: this.$route.query.tenantId,
				itemId: this.$route.query.itemId,
			};
			param.selfCreateUrl = 'workOrderService|downloadExcel';
			this.common.downloadExcelFile('', param, '', '', fileName, 'wmsWorkOrderDetailTable');
		},
		/**
		 * 关闭当前页面
		 */
		closePage()
		{
			this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId);
		},
	},
}
