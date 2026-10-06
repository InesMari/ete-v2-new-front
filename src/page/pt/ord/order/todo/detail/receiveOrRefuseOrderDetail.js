import commonOrder from "@/page/pt/ord/order/commonOrder.js"
import enumData from "@/page/pt/enum";

export default {
	name: 'receiveOrRefuseOrderDetail',
	mixins: [commonOrder],
	data()
	{
		return {
		
		}
	},
	async mounted()
	{
		await this.loadOrderInfo();
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
			let data = await this.common.postUrl("orderTF", "queryOrderInfo",
				{orderId: this.$route.query.orderId, isLoadDispatchList : false, isLoadCost : false, isLoadchangeList: false, isLoadMakeupList: false},
				null, null, null, true);
			/** 订单信息 **/
			this.order = data.order;
			this.farthestDistanceShow = this.common.isNotBlank(this.order.farthestDistanceInfo);
			await this.loadCustomerDataByTenantId(this.order.tenantId);
			/** 订单作业点信息 **/
			this.workList = data.workList;
			/** 订单货物信息 **/
			this.goodsList = data.goodsList;
			this.goodsList.forEach(item => {
				item.goodsVolumeCopy = item.goodsVolume;//vue监听到变更调用changeGoodsCount变成计算的数值，应该是系统带出来的
			})
			/** 订单收入费用信息 **/
			this.fee = data.fee;
			this.fee.billingType = '1';//货主端没有填写  这里默认
			this.fee.payMode = '1';//货主端没有填写  这里默认
			
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
			this.$nextTick(() =>
			{
				this.resetGoodsVolume();
				this.matchOrderFee();//匹配报价
			})
		},
		/**
		 * 关闭当前页面
		 */
		closePage()
		{
			this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true);
		},
		/**
		 * 接受订单
		 */
		toReceiveOrder()
		{
			if (this.order.orderState != enumData.orderState.PREP_RECEIVE)
			{
				this.$message.error("只有待接单状态的订单可以接单！");
				return false;
			}
			if (this.checkOrderFeeData())
			{
				this.order.workList = this.workList;
				this.order.goodsList = this.goodsList;
				this.order.fee = this.fee;
				
				let that = this;
				that.$confirm("接受订单后不可回退,是否确认接受订单？", "接受订单").then(() =>{
					that.common.postUrl("orderTF", "receiveOrder", that.order, function (data) {
						that.closePage();
						that.$parent.loadTodoData();
						that.$message.success("接单成功！");
					}, null, '', true).then(() => {});
				}).catch(() =>{})
			}
		},
		/**
		 * 拒接订单
		 */
		toRefuseOrder()
		{
			if (this.order.orderState != enumData.orderState.PREP_RECEIVE)
			{
				if (this.order.orderState == enumData.orderState.REFUSE)
					this.$message.error("订单已经拒接，请勿重复操作！");
				else
					this.$message.error("只有待接单状态的订单可以拒接！");
				return false;
			}
			let that = this;
			let param = this.common.copyObj(this.order);
			this.$prompt("<p style='color:red'>请谨慎操作,拒接订单后,客户可查看到拒单原因</p>", '拒接订单', {
				type: 'warning',
				center: true,
				dangerouslyUseHTMLString: true,
				inputPlaceholder: '请输入拒单原因',
				beforeClose: (action, instance, done) => {
					if (action === 'confirm')
					{
						if (this.common.isNotBlank(instance.inputValue))
							done();
						else
							this.$message.error("请输入拒单原因！");
					}
					else
						done();
				}
			}).then(({ value }) => {
				param.refuseRemark = value;
				this.common.postUrl("orderTF", "refuseOrder", param, function (data) {
					that.$message.success("拒单成功！");
					that.closePage();
					that.$parent.loadTodoData();
				}, null, '', true).then(() => {});
			}).catch(() => {
				this.$message.info("取消拒单");
			});
		}
	},
}
