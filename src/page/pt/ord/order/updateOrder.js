import commonOrder from "@/page/pt/ord/order/commonOrder.js"
import myElDatePicker from "@/components/myElDatePicker/index.js";
import enumData from "@/page/pt/enum";

export default {
	name: 'updateOrder',
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
			editFee : false,
			cdtRegionData: [],
		}
	},
	async mounted()
	{
		if (this.common.isNotBlank(this.order.tenantId)){
			this.loadCustomerData();//加载客户数据
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
			this.editFee = this.order.editFee;//是否可以修改费用
			this.isEdit = this.order.orderState != enumData.orderState.PREP_DISPATCH;//待调度的可编辑，其他不可编辑

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
			this.$nextTick(() =>
			{
				this.resetGoodsVolume();
			})
		},
		/**
		 * 改变客户/租户
		 * 初始化页面的字段再加载客户相关的数据
		 * @param tenantId
		 */
		async changeTenant(tenantId)
		{
			this.initOrder(tenantId, this.order.orderId, this.order.orderNum, this.order.orderState, this.order.orderStateName, this.order.createDate, this.order.createUserName,);
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
		 * 订单修改
		 */
		updateOrder()
		{
			if (this.checkOrderData())//数据校验通过
			{
				this.order.workList = this.workList;
				this.order.goodsList = this.goodsList;
				this.order.fee = this.fee;
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
