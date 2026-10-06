import commonOrder from "@/page/pt/ord/order/commonOrder.js"
import fileViewer from '@/components/myFile/file-viewer.vue';
import enumData from "@/page/pt/enum.js"

export default {
	name: 'orderDetail',
	mixins: [commonOrder],
	data()
	{
		return {
			cost: {
				freight:'',//运费
				pickupFee:'',//提货费
				deliveryFee:'',//送货费
				loadingFee:'',//装货费
				dischargeFee:'',//卸货费
				otherFee:'',//其他费
				totalPointFee:'',//点位费合计
				transitFee:'',//中转运费
				transitOtherFee:'',//中转其他费
				totalFee:'',//费用合计
				statementFee:'',//异动费用合计
				makeupFee:'',//补录费用合计
				amount:'',//费用
			},
			receiptsList: [],
			dispatchList: [],
			dispatchSum: {
				totalPointFeeSum: 0,
				freightSum: 0,
				pickupFeeSum: 0,
				deliveryFeeSum: 0,
				loadingFeeSum: 0,
				dischargeFeeSum: 0,
				otherFeeSum: 0,
				transitFeeSum: 0,
				transitOtherFeeSum: 0,
				totalFeeSum: 0,
				fluctuationCostFeeSum: 0,
				billShareCostFeeSum: 0,
				waybillTotalFeeSum: 0,
			},
			changeList: [],//异动费用记录
			changeSum: {
				premiumFeeSum: 0,
				loadingFeeSum: 0,
				dischargeFeeSum: 0,
				otherFeeSum: 0,
				totalFeeSum: 0,
			},
			makeupList: [],//补费记录
			makeupSum: {
				premiumFeeSum: 0,
				loadingFeeSum: 0,
				dischargeFeeSum: 0,
				otherFeeSum: 0,
				totalFeeSum: 0,
			},
			showViewer:false,
			srcList: [],
			enumData: enumData,
		}
	},
	async mounted()
	{
		this.loadOrderInfo();
	},
	/**
	 * 组件
	 */
	components: {
		fileViewer,
	},
	methods: {
		/**
		 * 加载订单数据
		 */
		async loadOrderInfo()
		{
			let data = await this.common.postUrl("orderTF", "queryOrderInfo",
				{orderId: this.$route.query.orderId, isLoadDispatchList : true, isLoadCost : true, isLoadchangeList: true, isLoadMakeupList: true},
				null, null, null, true);
			/** 订单信息 **/
			this.order = data.order;
			this.farthestDistanceShow = this.common.isNotBlank(this.order.farthestDistanceInfo);
			await this.loadCustomerDataByTenantId(this.order.tenantId);
			/** 订单作业点信息 **/
			this.workList = data.workList;
			/** 订单货物信息 **/
			this.goodsList = data.goodsList;
			/** 订单收入费用信息 **/
			this.fee = data.fee;
			/** 订单派车单成本信息 **/
			this.cost = data.cost;
			/** 订单票据信息 **/
			this.receiptsList = data.receiptsList;
			/** 订单费用异动记录 **/
			this.changeList = data.changeList;
			this.changeList.forEach(item => {
				this.changeSum.premiumFeeSum = this.common.accAdd(item.premiumFee, this.changeSum.premiumFeeSum);
				this.changeSum.loadingFeeSum = this.common.accAdd(item.loadingFee, this.changeSum.loadingFeeSum);
				this.changeSum.dischargeFeeSum = this.common.accAdd(item.dischargeFee, this.changeSum.dischargeFeeSum);
				this.changeSum.otherFeeSum = this.common.accAdd(item.otherFee, this.changeSum.otherFeeSum);
				this.changeSum.totalFeeSum = this.common.accAdd(item.totalFee, this.changeSum.totalFeeSum);
			});

			/** 订单补费记录 **/
			this.makeupList = data.makeupList;
			this.makeupList.forEach(item => {
				this.makeupSum.premiumFeeSum = this.common.accAdd(item.premiumFee, this.makeupSum.premiumFeeSum);
				this.makeupSum.loadingFeeSum = this.common.accAdd(item.loadingFee, this.makeupSum.loadingFeeSum);
				this.makeupSum.dischargeFeeSum = this.common.accAdd(item.dischargeFee, this.makeupSum.dischargeFeeSum);
				this.makeupSum.otherFeeSum = this.common.accAdd(item.otherFee, this.makeupSum.otherFeeSum);
				this.makeupSum.totalFeeSum = this.common.accAdd(item.totalFee, this.makeupSum.totalFeeSum);
			});

			/** 订单派车明细信息 **/
			this.dispatchList = data.dispatchList;
			this.dispatchList.forEach(item => {
				this.dispatchSum.totalPointFeeSum = this.common.accAdd(item.totalPointFee, this.dispatchSum.totalPointFeeSum);
				this.dispatchSum.freightSum = this.common.accAdd(item.freight, this.dispatchSum.freightSum);
				this.dispatchSum.pickupFeeSum = this.common.accAdd(item.pickupFee, this.dispatchSum.pickupFeeSum);
				this.dispatchSum.deliveryFeeSum = this.common.accAdd(item.deliveryFee, this.dispatchSum.deliveryFeeSum);
				this.dispatchSum.loadingFeeSum = this.common.accAdd(item.loadingFee, this.dispatchSum.loadingFeeSum);
				this.dispatchSum.dischargeFeeSum = this.common.accAdd(item.dischargeFee, this.dispatchSum.dischargeFeeSum);
				this.dispatchSum.otherFeeSum = this.common.accAdd(item.otherFee, this.dispatchSum.otherFeeSum);
				this.dispatchSum.transitFeeSum = this.common.accAdd(item.transitFee, this.dispatchSum.transitFeeSum);
				this.dispatchSum.transitOtherFeeSum = this.common.accAdd(item.transitOtherFee, this.dispatchSum.transitOtherFeeSum);
				this.dispatchSum.totalFeeSum = this.common.accAdd(item.totalFee, this.dispatchSum.totalFeeSum);
				this.dispatchSum.fluctuationCostFeeSum = this.common.accAdd(item.fluctuationCostFee, this.dispatchSum.fluctuationCostFeeSum);
				this.dispatchSum.billShareCostFeeSum = this.common.accAdd(item.billShareCostFee, this.dispatchSum.billShareCostFeeSum);
				this.dispatchSum.waybillTotalFeeSum = this.common.accAdd(item.waybillTotalFee, this.dispatchSum.waybillTotalFeeSum);
			});
			/** 作业点变更更新级联数据 **/
			for (let i = 0; i < this.workList.length; i++)
			{
				this.changeWork(this.workList[i], i, true);
			}
			/** 作业点变更更新级联数据 **/
			for (let i = 0; i < this.goodsList.length; i++)
			{
				this.changeGoods(this.goodsList[i], i);
			}
		},
		/**
		 * 显示大图
		 * @param data
		 */
		showBigImg(data)
		{
			this.srcList=[];
			this.srcList.push(data.imgPathUrl);
      		this.$refs.viewer.show();
		},
		/**
		 * 运单详情
		 * @returns {boolean}
		 */
		toWaybillDetail(item)
		{
			this.$emit("openTab",{
				urlId: 'waybillDetail' + item.waybillId,
				query: {waybillId: item.waybillId},
				urlName: "派车单详情",
				urlPathName: "/detail",
				urlPath: "/hz/ord/waybill/detail/waybillDetail.vue"});
		},
		/**
		 * 关闭当前页面
		 */
		closePage()
		{
			this.$parent.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId);
		},
	},
}
