import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";
import commonOrder from "@/page/pt/ord/order/commonOrder";
import searchList from "@/components/searchList/searchList.vue";


export default {
	name: 'incomeFeeStatementManage',
	mixins: [commonOrder],
	data()
	{
		return {
			head: [
				{"name": "客户", "code": "tenantName", "width": "200", "type": "text"},
				{"name": "线路名称", "code": "routeName", "width": "200", "type": "text"},
				{"name": "订单号", "code": "orderNum", "width": "180", "type": "diy"},
				{"name": "客户单号", "code": "custOrderNum", "width": "150", "type": "text"},
				{"name": "客户下单时间", "code": "customerOrderDate", "width": "150", "type": "text"},
				{"name": "要求运作时间", "code": "workDate", "width": "150", "type": "text"},
				{"name": "完成时间", "code": "finishDate", "width": "150", "type": "text"},
				{"name": "下单金额合计", "code": "totalFee", "width": "100", "type": "text"},
				{"name": "已异动金额合计", "code": "statementTotalFFee", "width": "120", "type": "text"},
				{"name": "本次异动金额", "code": "statementFee", "width": "100", "type": "text"},
				{"name": "订单收入合计", "code": "amount", "width": "100", "type": "text"},
				{"name": "审核状态", "code": "verifyStateName", "width": "110", "type": "text"},
				{"name": "审核人", "code": "verifyUserName", "width": "80", "type": "text"},
				{"name": "审核时间", "code": "verifyDate", "width": "140", "type": "text"},
				{"name": "货物下单件数/件", "code": "goodsCountSum", "width": "100", "type": "text"},
				{"name": "货物下单重量/kg", "code": "goodsWeightSum", "width": "100", "type": "text"},
				{"name": "货物下单体积/m³", "code": "goodsVolumeSum", "width": "100", "type": "text"},
				{"name": "计费方式", "code": "billingTypeName", "width": "80", "type": "text"},
				{"name": "车型", "code": "vehicleTypeName", "width": "100", "type": "text"},
				{"name": "车长", "code": "vehicleLengthName", "width": "60", "type": "text"},
				{"name": "结算净重/kg", "code": "netWeight", "width": "90", "type": "text"},
				{"name": "结算毛重/kg", "code": "grossWeight", "width": "90", "type": "text"},
				{"name": "结算体积/m³", "code": "volume", "width": "90", "type": "text"},
				{"name": "计费单价", "code": "freightPrice", "width": "90", "type": "text"},
				{"name": "备注", "code": "remark", "width": "150", "type": "text"},
				{"name": "申请人", "code": "createUserName", "width": "100", "type": "text"},
				{"name": "申请时间", "code": "createDate", "width": "150", "type": "text"},
			],
			query: this.initQuery(),
			verifyStateData: [],//审核状态
			title: "查看本次费用异动",
			isShow: false,
			isOnlySee: false,

			change:{
				totalPointFee : 0,
				totalFee : 0,
			},
			changeList: [],
			changeSum: this.initChangeSum(),
			pickerOptions: enumData.DATE_RANGE_SHORTCUT_OPTIONS,

		}
	},
	/**
	 * 初始化
	 */
	async mounted()
	{
		this.initData();
		await this.doQuery();
	},
	/**
	 * 组件
	 */
	components: {
		tableCommon,
		searchList
	},
	/**
	 * 绑定函数
	 */
	methods: {
		/**
		 * 列表查询
		 */
		async doQuery(query=this.query)
		{
			this.query = query;
			if(this.common.isNotBlank(this.query.customerOrderDate) && this.query.customerOrderDate.length === 2){
				this.query.startCustomerOrderDate = this.query.customerOrderDate[0];
				this.query.endCustomerOrderDate = this.query.customerOrderDate[1];
			}else{
				this.query.startCustomerOrderDate = '';
				this.query.endCustomerOrderDate = '';
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
			await this.$refs.table.load("incomeTF", "loadIncomeFeeStatementPage", this.query);
		},
		/**
		 * 初始化静态数据
		 */
		initData()
		{
			let that = this;
			//审核状态
			that.common.postUrl("commonTF", "getSysStaticData", {codeType: "VERIFY_STATE"}, function (data)
			{
				that.verifyStateData = data;
			});
		},
		/**
		 * 初始化查询条件
		 */
		initQuery()
		{
			this.query = {
				tenantName: this.$route.query.tenantName,//客户详情异动管理跳转
				routeName: '',
				orderNum: '',
				custOrderNum: '',
				verifyState: this.$route.query.verifyState,
				finishDate: '',
				workDate: '',
			};
			return this.query;
		},
		/**
		 * 清空
		 */
		clear()
		{
			this.query = {};
		},
		/**
		 * 初始化
		 * @returns {*}
		 */
		initChangeSum()
		{
			this.changeSum = {
				premiumFeeSum: 0,
				pickupFeeSum: 0,
				deliveryFeeSum: 0,
				loadingFeeSum: 0,
				dischargeFeeSum: 0,
				emptyDrivingFeeSum: 0,
				standbyFeeSum: 0,
				otherFeeSum: 0,
				totalFeeSum: 0,
			};
			return this.changeSum;
		},
		dblclickItem(data)
		{
			this.toSeeIncomeChange(data)
		},
		/**
		 * 查看异动
		 * @returns {boolean}
		 */
		async toSeeIncomeChange(data)
		{
			let selectData = this.$refs.table.getSelectItem();
			if (this.common.isNotBlank(data))
				selectData[0] = data;
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要查看的费用异动数据！");
				return false;
			}
			this.isOnlySee = true;
			await this.loadData(selectData[0]);
			this.title = "查看本次费用异动";
			this.closePage(true);
		},
		/**
		 * 加载异动数据
		 * @param data
		 */
		async loadData(data)
		{
			this.change = await this.common.postUrl("incomeTF", "loadIncomeFeeStatementInfo",{iId: data.iId});
			this.change.orderNum = data.orderNum;
			this.changeList = await this.common.postUrl("incomeTF", "loadOrderIncomeStatementData",{orderId: data.orderId});
			this.initChangeSum();
			this.changeList.forEach(item => {
				this.changeSum.premiumFeeSum = this.common.accAdd(item.premiumFee, this.changeSum.premiumFeeSum);
				this.changeSum.pickupFeeSum = this.common.accAdd(item.pickupFee, this.changeSum.pickupFeeSum);
				this.changeSum.deliveryFeeSum = this.common.accAdd(item.deliveryFee, this.changeSum.deliveryFeeSum);
				this.changeSum.loadingFeeSum = this.common.accAdd(item.loadingFee, this.changeSum.loadingFeeSum);
				this.changeSum.dischargeFeeSum = this.common.accAdd(item.dischargeFee, this.changeSum.dischargeFeeSum);
                this.changeSum.emptyDrivingFeeSum = this.common.accAdd(item.emptyDrivingFee, this.changeSum.emptyDrivingFeeSum);
				this.changeSum.standbyFeeSum = this.common.accAdd(item.standbyFee, this.changeSum.standbyFeeSum);
				this.changeSum.otherFeeSum = this.common.accAdd(item.otherFee, this.changeSum.otherFeeSum);
				this.changeSum.totalFeeSum = this.common.accAdd(item.totalFee, this.changeSum.totalFeeSum);
			});
		},
		/**
		 * 修改费用异动
		 * @returns {boolean}
		 */
		async toUpdateIncomeChange()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要修改的费用异动数据！");
				return false;
			}
			let data = selectData[0];
			if (data.orderState == 3)
			{
				this.$message.error("订单: " + data.orderNum + "已经取消，不允许修改费用异动！");
				return false;
			}
			if (data.entryBillFlag == 1)
			{
				this.$message.error("已经进入账单的订单无法修改费用异动，需要修改费用可以进行费用补录！");
				return false;
			}
			if (data.verifyState == enumData.verifyState.approved)
			{
				this.$message.error("已经审核通过的费用异动，不允许修改！");
				return false;
			}
			//有回单未进报表，回单没有确认不能异动
			if (data.haveReceipt == 1 && data.receiptState == 0 && data.generateReportFlag == 0)
			{
				// this.$message.error("订单: " + data.orderNum + "有回单,需要回单确认或者是进入报表才能做费用异动！");
				// return false;
			}
			this.isOnlySee = false;
			await this.loadData(selectData[0]);
			this.closePage(true);
			this.title = "修改本次费用异动";
		},
		/**
		 * 撤销费用异动
		 */
		cancelStatement()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要撤销的费用异动数据！");
				return false;
			}
			if (selectData[0].verifyState == enumData.verifyState.approved)
			{
				this.$message.error("已经审核通过的费用异动，不允许撤销！");
				return false;
			}
			let that = this;
			that.$confirm("确认撤销本次费用异动？", "确认撤销").then(() =>
			{
				that.common.postUrl("incomeTF", "cancelStatement", selectData[0], function (data)
				{
					that.doQuery();
					that.$message.success("撤销成功!");
				},null,'',true);
			}).catch(() => {});
		},

		/**
		 * 审核通过
		 */
		verifyPass()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要审核的费用异动数据！");
				return false;
			}
			if (selectData[0].verifyState == enumData.verifyState.approved)
			{
				this.$message.error("已经审核通过的费用异动，不需要重新审核！");
				return false;
			}
			if (selectData[0].verifyState == enumData.verifyState.noApproved)
			{
				this.$message.error("审核不通过的费用异动，不允许重新审核,请修改再重新审核！");
				return false;
			}
			let that = this;
			that.$confirm("确认审核通过后不可回退，该笔费用会记入下个月报表，是否确认？", "确认审核通过").then(() =>
			{
				that.common.postUrl("incomeTF", "verifyPass", selectData[0], function (data)
				{
					that.doQuery();
					that.$message.success("审核成功！");
					that.$parent.loadTodoData();
				},null,'',true);
			}).catch(() => {});
		},
		/**
		 * 审核不通过
		 */
		verifyNoPass()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要审核不通过的费用异动数据！");
				return false;
			}
			if (selectData[0].verifyState == enumData.verifyState.approved)
			{
				this.$message.error("审核通过的费用异动，不允许重新审核！");
				return false;
			}
			if (selectData[0].verifyState == enumData.verifyState.noApproved)
			{
				this.$message.error("已经审核不通过的费用异动，不需要重新审核！");
				return false;
			}
			let that = this;
			that.$confirm("确认审核不通过后不可回退，是否确认？", "确认审核不通过").then(() =>
			{
				that.common.postUrl("incomeTF", "verifyNoPass", selectData[0], function (data)
				{
					that.doQuery();
					that.$message.success("处理成功！");
					that.$parent.loadTodoData();
				},null,'',true);

			}).catch(() => {});
		},
		/**
		 * 计算异动费用合计
		 */
		calcChangeTotalFee()
		{
			this.change.totalFee = 0;
			this.change.totalFee = this.common.accAdd(this.change.totalFee, this.dealValue(this.change.premiumFee));
			this.change.totalFee = this.common.accAdd(this.change.totalFee, this.dealValue(this.change.pickupFee));
			this.change.totalFee = this.common.accAdd(this.change.totalFee, this.dealValue(this.change.deliveryFee));
			this.change.totalFee = this.common.accAdd(this.change.totalFee, this.dealValue(this.change.loadingFee));
			this.change.totalFee = this.common.accAdd(this.change.totalFee, this.dealValue(this.change.dischargeFee));
            this.change.totalFee = this.common.accAdd(this.change.totalFee, this.dealValue(this.change.emptyDrivingFee));
			this.change.totalFee = this.common.accAdd(this.change.totalFee, this.dealValue(this.change.standbyFee));
			this.change.totalFee = this.common.accAdd(this.change.totalFee, this.dealValue(this.change.otherFee));
			this.forceUpdate();
		},
		/**
		 * 确认保存异动收入
		 */
		sureChange()
		{
			if (this.common.isNotBlank(this.change.premiumFee) && isNaN(this.change.premiumFee))
			{
				this.$message.error("请输入有效的保险费！");
				return false;
			}
			if (this.common.isNotBlank(this.change.pickupFee) && isNaN(this.change.pickupFee))
			{
				this.$message.error("请输入有效的提货费！");
				return false;
			}
			if (this.common.isNotBlank(this.change.deliveryFee) && isNaN(this.change.deliveryFee))
			{
				this.$message.error("请输入有效的送货费！");
				return false;
			}
			if (this.common.isNotBlank(this.change.loadingFee) && isNaN(this.change.loadingFee))
			{
				this.$message.error("请输入有效的装货费！");
				return false;
			}
			if (this.common.isNotBlank(this.change.dischargeFee) && isNaN(this.change.dischargeFee))
			{
				this.$message.error("请输入有效的卸货费！");
				return false;
			}
			if (this.common.isNotBlank(this.change.otherFee) && isNaN(this.change.otherFee))
			{
				this.$message.error("请输入有效的其他费！");
				return false;
			}

			let sum = 0;
			sum = this.common.accAdd(sum, this.dealValue(this.change.premiumFee));
			sum = this.common.accAdd(sum, this.dealValue(this.change.pickupFee));
			sum = this.common.accAdd(sum, this.dealValue(this.change.deliveryFee));
			sum = this.common.accAdd(sum, this.dealValue(this.change.loadingFee));
			sum = this.common.accAdd(sum, this.dealValue(this.change.dischargeFee));
            sum = this.common.accAdd(sum, this.dealValue(this.change.emptyDrivingFee));
			sum = this.common.accAdd(sum, this.dealValue(this.change.standbyFee));
			sum = this.common.accAdd(sum, this.dealValue(this.change.otherFee));
			if (sum != this.change.totalFee)
			{
				this.$message.error("(保险费 + 提货费 + 送货费 + 装货费 + 卸货费 + 放空费 + 压夜费 + 其他费)不等于费用合计，请确认！");
				return false;
			}
			if (sum == 0)
			{
				this.$message.error("异动总费用合计不能为0！");
				return false;
			}
			let that = this;
			that.$confirm("确认修改异动费用？", "提示").then(() =>{
				that.common.postUrl("incomeTF", "updateOrdOrderFeeIncomeStatement", that.change, function (data)
				{
					that.$message.success("修改成功！");
					that.doQuery();
					that.closePage(false);
				},null,'',true);
			}).catch(() =>{
				//取消新增确认
			});
		},
		/**
		 * 控制弹窗
		 * @param flag
		 */
		closePage(flag)
		{
			this.isShow = flag;
		},
		openDetail(data)
		{
			this.$emit("openTab",{
				urlId: 'orderDetail' + data.orderId,
				query: {orderId: data.orderId,pId: 1001070},
				urlName: "订单详情",
				urlPathName: "/order",
				urlPath: "/pt/ord/order/orderDetail/orderDetailMain.vue"});
		}
	},
	computed:{
		formData(){
			return [
				{"name":"客户","model":"tenantName","type":"input","placeholder":"客户","isshow":true},
				{"name":"线路名称","model":"routeName","type":"input","placeholder":"线路名称","isshow":true},
				{"name":"订单号","model":"orderNum","type":"input","placeholder":"订单号","isshow":true},
				{"name":"客户单号","model":"custOrderNum","type":"input","placeholder":"客户单号","isshow":true},
				{"name":"审核状态","model":"verifyState","type":"select","options":this.verifyStateData,"label":"codeName","value":"codeValue","placeholder":"审核状态","method":"doQuery","isshow":true},
				{"name":"客户下单时间","model":"customerOrderDate","type":"daterange","isshow":true},
				{"name":"要求运作时间","model":"workDate","type":"daterange","isshow":true},
				{"name":"完成时间","model":"finishDate","type":"daterange","isshow":true},
			]
		}
	},
}
