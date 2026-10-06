import commonOrder from "@/page/pt/ord/order/commonOrder.js"
import myElDatePicker from "@/components/myElDatePicker/index.js";
import enumData from "@/page/pt/enum";

export default {
	name: 'copyOrder',
	mixins: [commonOrder],
    /**
     * 组件
     */
    components: {
        myElDatePicker
    },
	data()
	{
		return {
			showSuccessDialog: false,//下单成功提示窗口窗口
			cdtRegionData: [],
		}
	},
	async mounted()
	{
		if (this.common.isNotBlank(this.order.tenantId)){
			this.routeData = await this.loadRouteDataByTenantId(this.order.tenantId);
			this.workData = await this.loadWorkDataByTenantId(this.order.tenantId);
			this.goodsGroupData[1].goodsData = await this.loadGoodsDataByTenantId(this.order.tenantId, enumData.GOODS_TYPE.CONVENTIONAL_GOODS);
			this.goodsGroupData[2].goodsData = await this.loadGoodsDataByTenantId(this.order.tenantId, enumData.GOODS_TYPE.PACK_GOODS);
		}
		this.cdtRegionArray = await this.loadCdtRegion();//加载协同区域
		await this.loadOrderInfo();
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
			this.order.isReturnTrip = this.order.isReturnTrip == 1;
			await this.loadCustomerData();
			await this.changeCdtRegionSelect(this.order.tenantId);
			this.farthestDistanceShow = this.common.isNotBlank(this.order.farthestDistanceInfo);
			await this.loadCustomerDataByTenantId(this.order.tenantId);
			
			/** 订单作业点信息 **/
			this.workList = data.workList;
			/** 订单货物信息 **/
			this.goodsList = data.goodsList;
			this.goodsList.forEach(item => {
				item.goodsVolumeCopy = item.goodsVolume;//vue监听到变更调用changeGoodsCount变成计算的数值，应该是系统带出来的
			})
			/** 订单费用信息 **/
			this.fee = data.fee;
			
			//阿涛说:复制下单费用清空不能输入的
			this.fee.freightPrice = '';//单价
			this.fee.pointFee = '';//点位费单价
			this.fee.totalPointFee = 0;//点位费合计
			this.fee.freight = '';//运费
			this.fee.premiumFee = '';//保险费
			this.fee.pickupFee = '';//提货费
			this.fee.deliveryFee = '';//送货费
			this.fee.loadingFee = '';//装货费
			this.fee.dischargeFee = '';//卸货费
			this.fee.otherFee = '';//其他费
			this.fee.totalFee = 0;//费用合计
			this.fee.statementFee = 0;//异动费用合计
			
			/** 线路常用货物数据 **/
			this.goodsGroupData[0].goodsData =  await this.loadGoodsListByRouteId(this.order.routeId);
			/** 作业点变更更新级联数据 **/
			for (let i = 0; i < this.workList.length; i++)
				this.changeWork(this.workList[i], i, true);
			
			/** 货物变更更新级联数据 **/
			for (let i = 0; i < this.goodsList.length; i++)
			{
				this.goodsList[i].piecePrice = "";//置空按件数的单价
				this.changeGoods(this.goodsList[i], i, true);
			}
			
			this.$nextTick(() => this.resetGoodsVolume())
		},
		/**
		 * 改变客户/租户
		 * 初始化页面的字段再加载客户相关的数据
		 * @param tenantId
		 */
		async changeTenant(tenantId)
		{
			await this.initOrder(tenantId, this.order.orderId, this.order.orderNum, this.order.orderState, this.order.orderStateName, this.order.createDate, this.order.createUserName,);
			this.initRoute();
			this.initWork();
			this.initGoodsGroupData();
			this.initOrderWork();
			this.initOrderGoods();
			this.initBeginWork();
			this.initEndWork();
			this.initFee();
			await this.loadCustomerDataByTenantId(tenantId);
			
			this.changeCdtRegionSelect(tenantId);
		},
		/**
		 * 复制订单
		 */
		copyOrder()
		{
			if (this.checkOrderData())//校验通过
			{
				this.order.workList = this.workList;
				this.order.goodsList = this.goodsList;
				this.order.fee = this.fee;
				this.order.orderId = '';
				this.order.copy = 1;
				let that = this;
				this.common.postUrl("orderTF", "saveOrUpdateOrder", this.order, function (data)
				{
					that.successData = data;
					that.changeSuccessDialog(true);
				},null,'',true);
			}
		},
		/**
		 * 订单详情
		 */
		toOrderDetail()
		{
			this.changeSuccessDialog(false);
			this.successData.pId = 1001070;
			this.$emit("openTab",{
				urlId: 'orderDetail' + this.successData.orderId,
				query: this.successData,
				urlName: "订单详情",
				urlPathName: "/order",
				urlPath: "/pt/ord/order/orderDetail/orderDetailMain.vue"});
		},
		/**
		 * @param flag
		 */
		changeSuccessDialog(flag)
		{
			this.showSuccessDialog = flag;
		},
		/**
		 * 关闭当前页面
		 */
		closePage()
		{
			this.changeSuccessDialog(false);
			this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
		},
	},
}
