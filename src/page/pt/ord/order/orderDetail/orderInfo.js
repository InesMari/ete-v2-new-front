import commonOrder from "@/page/pt/ord/order/commonOrder.js"
import fileViewer from '@/components/myFile/file-viewer.vue';
import enumData from "@/page/pt/enum";

export default {
	name: 'orderInfo',
	mixins: [commonOrder],
	data()
	{
		return {
			type: this.$route.query.type,
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
			customerData: [],//客户
			srcList: [],
			show1: true,
			show2: true,
		}
	},
	mounted()
	{
		this.initData();
	},
	/**
	 * 组件
	 */
	components: {
		fileViewer,
	},
	methods: {
		async initData()
		{
			await this.loadCustomerData();
			await this.loadOrderInfo();
		},
		/**
		 * 加载订单数据
		 */
		async loadOrderInfo()
		{
			let data = await this.common.postUrl("orderService", "queryOrderInfo",
				{orderId: this.$route.query.orderId, isLoadDispatchList : true, isLoadCost : true, isLoadchangeList: true, isLoadMakeupList: true},
				null, null, null, true);
			/** 订单信息 **/
			this.order = data.order;
			this.order.tenantId = this.order.tenantId + "";
			this.farthestDistanceShow = this.common.isNotBlank(this.order.farthestDistanceInfo);
			await this.loadCustomerDataByTenantId(this.order.tenantId);
			/** 订单作业点信息 **/
			this.workList = data.workList;
			/** 订单货物信息 **/
			this.goodsList = data.goodsList;
			/** 订单收入费用信息 **/
			this.fee = data.fee;
			if (this.type == 0)
			{
				this.show1 = data.order.receiveUserId > 0;
				this.show2 = data.order.refuseUserId > 0;
			}
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
			this.$forceUpdate();
		},
		async loadCustomerData()
		{
			this.customerData = await this.common.postUrl("customerTF", "queryCustomerListNoPage", {sts: enumData.STS.VALID});
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
			if (item.isTransit == 1)
			{
				this.$emit('openTab', {
					urlName: '查看中转',
					urlId: 'transitManage',
					urlPathName: "/order",
					urlPath: "/pt/ord/transit/transitDetailMain",
					query:{t:3,waybillNum: item.waybillNum, tansitWaybillId: item.waybillId},
				});
			}
			else
			{
				this.$emit("openTab",{
					urlId: 'waybillDetail' + item.waybillId,
					query: {waybillId: item.waybillId},
					urlName: "派车单详情",
					urlPathName: "/detail",
					urlPath: "/pt/ord/waybill/detail/waybillDetail.vue"});
			}
		},
		async rceiveOrder()
		{
			if (this.common.isBlank(this.fee.totalFee))
			{
				this.$message.error("请填写实际金额！");
				return false;
			}
			let param = this.common.copyObj(this.order);
			param.totalFee = this.fee.totalFee;

			let that = this;
			this.$confirm("确认接收该回程单？", "提示").then(() =>{
				this.common.postUrl("orderService", "rceiveOrder", param, function (data)
				{
					that.$message.success("接单成功！");
					that.closePage();
				});
			}).catch(() =>{});
		},
		async refuseOrder()
		{
			let param = this.common.copyObj(this.order);
			let that = this;
			this.$confirm("确认拒绝该回程单？", "提示").then(() =>{
				this.common.postUrl("orderService", "refuseOrder", param, function (data)
				{
					that.$message.success("拒单成功！");
					that.closePage();
				});
			}).catch(() =>{});
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
