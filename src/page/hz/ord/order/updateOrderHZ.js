import commonOrder from "@/page/pt/ord/order/commonOrder.js"
import myElDatePicker from "@/components/myElDatePicker/index.js";
import myFileModel from '@/components/myFileModel/myFileModel.vue'
import enumData from "@/page/pt/enum";

export default {
	name: 'updateOrderHZ',
	mixins: [commonOrder],
    /**
     * 组件
     */
    components: {
		myFileModel,
        myElDatePicker
    },
	data()
	{
		return {
			editFee : false,
		}
	},
	async mounted()
	{
		if (this.common.isNotBlank(this.order.tenantId))
		{
			this.routeData = await this.loadRouteDataByTenantId(this.order.tenantId);
			this.workData = await this.loadWorkDataByTenantId(this.order.tenantId);
			this.goodsGroupData[1].goodsData = await this.loadGoodsDataByTenantId(this.order.tenantId, enumData.GOODS_TYPE.CONVENTIONAL_GOODS);
		}
		this.loadOrderInfo();
	},
	methods: {
		/**
		 * 加载订单数据
		 */
		async loadOrderInfo()
		{
			let data = await this.common.postUrl("orderTF", "queryOrderInfo", {orderId: this.$route.query.orderId},null,null,null,true);
			/** 订单信息 **/
			this.order = data.order;
			this.farthestDistanceShow = this.common.isNotBlank(this.order.farthestDistanceInfo);
			this.editFee = this.order.editFee;//是否可以修改费用
			this.isEdit = !(this.order.orderState == enumData.orderState.PREP_RECEIVE || this.order.orderState == enumData.orderState.REFUSE);//待接单/拒单的可编辑,其他不可编辑

			await this.loadCustomerDataByTenantId(this.order.tenantId);
			/** 订单作业点信息 **/
			this.workList = data.workList;

			/** 订单货物信息 **/
			this.goodsList = data.goodsList;

			/** 订单费用信息 **/
			this.fee = data.fee;
			if (this.common.isBlank(this.fee.billingType)) this.fee.billingType = '1';// 待接单拒单赋值默认通过校验 后台保存会置空
			if (this.common.isBlank(this.fee.payMode)) this.fee.payMode = '1';

			/** 线路常用货物数据 **/
			this.goodsGroupData[0].goodsData =  await this.loadGoodsListByRouteId(this.order.routeId);

			/** 作业点变更更新级联数据 **/
			for (let i = 0; i < this.workList.length; i++)
			{
				this.changeWork(this.workList[i], i, true);
			}
			/** 作业点变更更新级联数据 **/
			for (let i = 0; i < this.goodsList.length; i++)
			{
				this.changeGoods(this.goodsList[i], i, true);
			}
			/** 修改订单进来就匹配一次报价 **/
			this.$forceUpdate();
		},
		/**
		 * 订单修改
		 */
		updateOrder()
		{
			if (this.checkOrderData())//数据校验通过
			{
				this.order.workList = this.workList;
				this.order.goodsList = this.goodsList;
				this.fee.freightPrice = '';
				this.fee.pointFee = '';
				this.fee.totalPointFee = '';
				this.fee.premiumFee = '';
				this.fee.pickupFee = '';
				this.fee.deliveryFee = '';
				this.fee.loadingFee = '';
				this.fee.dischargeFee = '';
				this.fee.otherFee = '';
				this.fee.totalFee = '';
				this.order.fee = this.fee;
				this.order.tenantType = enumData.TENANT_TYPE.HZ;//货主下单
				let that = this;
				this.common.postUrl("orderTF", "saveOrUpdateOrder", this.order, function (data)
				{
					that.closePage();
					that.$message.success("修改成功！");
				},null,'',true);
			}
		},
		/**
		 * 关闭当前页面
		 */
		closePage()
		{
			this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
		},
	},
}
