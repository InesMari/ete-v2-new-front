import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";

export default {
	name: 'orderManage',
	data()
	{
		return {
			head: [
				{"name": "订单号", "code": "orderNum", "width": "150", "type": "diy"},
				{"name": "我的单号", "code": "custOrderNum", "width": "150", "type": "text"},
				{"name": "线路名称", "code": "routeName", "width": "200", "type": "text"},
				{"name": "订单状态", "code": "orderStateName", "width": "100", "type": "diyColorTd"},
				{"name": "完成时间", "code": "finishDate", "width": "150", "type": "text"},
				{"name": "要求运作时间", "code": "workDate", "width": "150", "type": "text"},
				{"name": "是否加急", "code": "isUrgentName", "width": "100", "type": "text"},
				{"name": "订单类型", "code": "orderTypeName", "width": "100", "type": "text"},

				{"name": "货物名称", "code": "goodsName", "width": "200", "type": "text"},
				{"name": "货物下单件数", "code": "goodsCountSum", "width": "100", "type": "text"},
				{"name": "货物下单重量/kg", "code": "goodsWeightSum", "width": "100", "type": "text"},
				{"name": "货物下单体积/m³", "code": "goodsVolumeSum", "width": "100", "type": "text"},
				{"name": "计费方式", "code": "billingTypeName", "width": "80", "type": "text"},
				{"name": "车型", "code": "vehicleTypeName", "width": "100", "type": "text"},
				{"name": "车长", "code": "vehicleLengthName", "width": "60", "type": "text"},
				{"name": "结算方式", "code": "payModeName", "width": "80", "type": "text"},
				{"name": "结算净重/kg", "code": "netWeight", "width": "90", "type": "text"},
				{"name": "结算毛重/kg", "code": "grossWeight", "width": "90", "type": "text"},
				{"name": "结算体积/m³", "code": "volume", "width": "90", "type": "text"},

				{"name": "计费单价", "code": "freightPrice", "width": "90", "type": "text"},
				{"name": "中途点数", "code": "midwayPointCount", "width": "90", "type": "text"},
				{"name": "点位费", "code": "pointFee", "width": "90", "type": "text"},
				{"name": "点位费合计", "code": "totalPointFee", "width": "90", "type": "text"},
				{"name": "运费", "code": "freight", "width": "90", "type": "text"},
				{"name": "保险费", "code": "premiumFee", "width": "90", "type": "text"},
				{"name": "装货费", "code": "loadingFee", "width": "90", "type": "text"},
				{"name": "卸货费", "code": "dischargeFee", "width": "90", "type": "text"},
				{"name": "其他费", "code": "otherFee", "width": "90", "type": "text"},
				{"name": "下单金额合计", "code": "totalFee", "width": "80", "type": "text"},
				{"name": "异动金额合计", "code": "statementFee", "width": "80", "type": "text"},
				{"name": "补费金额合计", "code": "makeupFee", "width": "80", "type": "text"},
				{"name": "订单费用合计", "code": "income", "width": "100", "type": "text"},
				{"name": "派车单数", "code": "waybillNums", "width": "90", "type": "text"},
				{"name": "下单人", "code": "createUserName", "width": "100", "type": "text"},
				{"name": "订单备注", "code": "orderRemark", "width": "200", "type": "text"},
				// {"name": "系统录单时间", "code": "createDate", "width": "150", "type": "text"},
			],
			query: this.initQuery(),
			pickerOptions: enumData.DATE_RANGE_SHORTCUT_OPTIONS,
			orderTypeData: [],
			orderStateData: [],
		}
	},
	/**
	 * 初始化
	 */
	mounted()
	{
		this.initData();
		this.doQuery();
	},
	/**
	 * 组件
	 */
	components: {
		tableCommon,
	},
	/**
	 * 绑定函数
	 */
	methods: {
		/**
		 *
		 */
		async doQuery()
		{
			if(this.common.isNotBlank(this.query.createDate) && this.query.createDate.length === 2){
				this.query.startCreateDate = this.query.createDate[0];
				this.query.endCreateDate = this.query.createDate[1];
			}else{
				this.query.startCreateDate = '';
				this.query.endCreateDate = '';
			}
			if(this.common.isNotBlank(this.query.finishDate) && this.query.finishDate.length === 2){
				this.query.startFinishDate = this.query.finishDate[0];
				this.query.endFinishDate = this.query.finishDate[1];
			}else{
				this.query.startFinishDate = '';
				this.query.endFinishDate = '';
			}
			if(this.common.isNotBlank(this.query.workDate) && this.query.workDate.length === 2){
				this.query.startWorkDate = this.query.workDate[0];
				this.query.endWorkDate = this.query.workDate[1];
			}else{
				this.query.startWorkDate = '';
				this.query.endWorkDate = '';
			}

			let {items} = await this.$refs.table.load("orderTF", "queryConsignorOrderInfoList", this.query);
			items.forEach((el)=>{
				if(el.orderState == enumData.orderState.CANCELLED){
					el.disabled = true;
				}
			});
			this.$refs.table.resetData(items);
			this.$forceUpdate();
		},
		/**
		 * 初始化静态数据
		 */
		async initData()
		{
			this.orderTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ORDER_TYPE"});
			this.orderStateData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "ORDER_STATE"});
		},
		/**
		 * 初始化查询条件
		 */
		initQuery()
		{
			this.query = {
				orderNum: '',
				routeName: '',
				goodsName: '',
				orderType: '',
				orderState: '',
				createDate: '',
				finishDate: '',
				workDate: '',
			};
			return this.query;
		},
		/**
		 * 打开详情
		 * @param data
		 */
		openDetail(item, code)
		{
			this.$emit("openTab",{
				urlId: 'hzOrderDetail' + item.orderId,
				query: {orderId: item.orderId},
				urlName: "订单详情",
				urlPathName: "/order",
				urlPath: "/hz/ord/order/orderDetail/orderDetailMain.vue"});
		},
		/**
		 * 订单详情
		 */
		toOrderDetail()
		{
			let selectData = this.$refs.table.getSelectItem();
			if(selectData.length !== 1)
			{
				this.$message.error("请选择一个需要查看的订单！");
				return false;
			}
			this.openDetail(selectData[0]);
		},
		/**
		 * 双击查看详情
		 * @param data
		 */
		dblclickItem(data)
		{
			this.openDetail(data);
		},
		/**
		 * 打印托运单
		 */
		toOrderPrint()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要打印的订单！");
				return false;
			}
			this.$emit("openTab",{
				urlId: 'orderPrint' + selectData[0].orderId,
				query: {orderId: selectData[0].orderId},
				urlName: "打印托运单",
				urlPathName: "/order",
				urlPath: "/hz/ord/order/orderPrint.vue"});
		},
		/**
		 * 新增订单
		 */
		toAddOrder()
		{
			this.$emit("openTab",{
				urlId: '114',
				query: {},
				urlName: "新增订单",
				urlPathName: "/order",
				urlPath: "/hz/ord/order/addOrderHZ.vue"});
		},
		/**
		 * 复制下单
		 */
		toCopyNewOrder()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要复制的订单！");
				return false;
			}
			this.$emit("openTab",{
				urlId: 'copyOrderHZ' + selectData[0].orderId,
				query: {orderId: selectData[0].orderId},
				urlName: "复制订单",
				urlPathName: "/order",
				urlPath: "/hz/ord/order/copyOrderHZ.vue"});
		},
		/**
		 * 修改订单
		 * @returns {boolean}
		 */
		toUpdateOrder()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要修改的订单！");
				return false;
			}
			if (selectData[0].orderState == enumData.orderState.CANCELLED)
			{
				this.$message.error("订单: " + selectData[0].orderNum + "已经取消，不允许修改！");
				return false;
			}
			if (!(selectData[0].orderState == enumData.orderState.REFUSE
				|| selectData[0].orderState == enumData.orderState.PREP_RECEIVE))
			{
				this.$message.error("只有待接单/拒单的订单才可以修改！");
				return false;
			}
			this.$emit("openTab",{
				urlId: 'updateOrderHZ' + selectData[0].orderId,
				query: {orderId: selectData[0].orderId},
				urlName: "修改订单",
				urlPathName: "/order",
				urlPath: "/hz/ord/order/updateOrderHZ.vue"});
		},
		/**
		 * 取消订单
		 */
		toCancelOrder()
		{
			let selectData = this.$refs.table.getSelectItem();
			if(selectData.length < 1)
			{
				this.$message.error("请至少选择一个需要取消的订单！");
				return false;
			}
			for (let i = 0; i < selectData.length; i++)
			{
				if (!(selectData[i].orderState == enumData.orderState.PREP_RECEIVE || selectData[i].orderState == enumData.orderState.REFUSE))
				{
					this.$message.error("订单: " + selectData[i].orderNum + "不是待接单/拒单状态,不可取消！");
					return false;
				}
			}
			let orderIds = [];
			selectData.forEach(item => {
				if (this.common.isNotBlank(item.orderId)){ orderIds.push(item.orderId); }
			});
			let that = this;
			this.$confirm("确认需要取消这些订单？", "提示").then(() =>{
				this.common.postUrl("orderTF", "cancelOrder", {orderIds: orderIds,tenantType: enumData.TENANT_TYPE.HZ}, function (data)
				{
					that.doQuery();
					that.$message.success("取消成功！");
				});
			}).catch(() =>{});
		},

	},
}
