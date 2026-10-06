import enumData from "@/page/pt/enum.js"
import updateBillDetail from "./updateBillDetail.vue"
import selectBillItem from "./selectBillItem.vue"

export default {
	name: 'updateCustomerBillMain',
	data()
	{
		return {
			showSelectBillItem: false,//不展示账单
			billDetailShow: true,//是否渲染账单明细
			saveFlag: false,//点击保存标志
			billSupplementList:[],
		}
	},
	mounted()
	{
		this.loadBillData().then(r => {});
	},
	components: {
		updateBillDetail,
		selectBillItem,
		enumData,
	},
	methods: {
		/**
		 * 加载账单数据
		 * @returns {Promise<void>}
		 */
		async loadBillData()
		{
			let that = this;
			let {items} = await this.common.postUrl("fcCustBillTF", "queryCustomerBillPage", this.$route.query);
			this.$refs.updateBillDetail.bill = items[0];
			this.$refs.updateBillDetail.initAttach();
			this.$refs.updateBillDetail.initAttachReceipt();
			if(this.common.isNotBlank(this.$refs.updateBillDetail.bill.settleBody)) {
				this.$refs.updateBillDetail.bill.settleBody = this.$refs.updateBillDetail.bill.settleBody+'';
			}
			//对账客户
			that.common.postUrl("customerTF", "queryCustomerData", {parentId:items[0].tenantId}, function (data) {
				that.$refs.updateBillDetail.customerAllData = data;
			});
			await this.loadBillDetailDataList();
		},
		/**
		 * 加载账单明细数据
		 * @returns {Promise<void>}
		 */
		async loadBillDetailDataList()
		{
			this.$refs.updateBillDetail.listArray = await this.common.postUrl("fcCustBillTF", "queryCustomerBillDetailList", this.$route.query);
			//上次保存数据回显右边表格
			this.$nextTick(() => {
				for (let i = 0; i < this.$refs.updateBillDetail.listArray.length; i++) {
					if (this.$refs.updateBillDetail.listArray[i].length > 0) {
						this.$refs.selectBillItem.initData(this.$refs.updateBillDetail.listArray[i], i + 1);
					}

				}
				this.billSupplementList = this.$refs.updateBillDetail.listArray[3];
				//处理选择的客户相关
				this.$refs.selectBillItem.dataChange();
				this.$refs.updateBillDetail.tableData = this.$refs.updateBillDetail.listArray[0];
			});
		},
		/**
		 * 生成账单
		 */
		generateBill()
		{
			let selectItems = this.$refs.selectBillItem.getAllSelectItem();
			if (selectItems.length === 0)
			{
				this.$message.error("请选择生成账单的数据！");
				return false;
			}
			let totalFee = 0;//账单金额
			let waybillFee = 0;//运输费用合计
			let storehouseFee = 0;//仓库费用合计
			let otherFee = 0;//其他费用合计
			let packLeaseFee = 0;//包装租赁费用合计
			let makeupFee = 0;//补录费用合计

			selectItems.forEach(item => {
				if (this.common.isNotBlank(item.amount))
				{
					item.isSelect = false;
					totalFee = this.common.accAdd(totalFee, item.amount);
				}
			});

			let set = new Set;
			selectItems.forEach(item => {
				if (this.common.isNotBlank(item.tenantId))
					set.add(item.tenantId);
			})
			if (set.size > 1)
			{
				this.$message.error("不同客户的数据无法生成账单,请重新选择");
				return false;
			}
			let orderList = this.$refs.selectBillItem.getSelectItem(enumData.FC_CUST_BILL_ITEM_TYPE.ORDER);//选择的运输订单
			orderList.forEach(item => {
				if (this.common.isNotBlank(item.amount))
					waybillFee = this.common.accAdd(waybillFee, item.amount);
			});
			let storehouseList = this.$refs.selectBillItem.getSelectItem(enumData.FC_CUST_BILL_ITEM_TYPE.STOREHOUSE);//选择的仓储费用
			storehouseList.forEach(item => {
				if (this.common.isNotBlank(item.amount))
					storehouseFee = this.common.accAdd(storehouseFee, item.amount);
			});
			let packLeaseList = this.$refs.selectBillItem.getSelectItem(enumData.FC_CUST_BILL_ITEM_TYPE.PACKLEASE);//选择的包装租赁费用
			packLeaseList.forEach(item => {
				if (this.common.isNotBlank(item.amount))
					packLeaseFee = this.common.accAdd(packLeaseFee, item.amount);
			});
			let projectsundryList = this.$refs.selectBillItem.getSelectItem(enumData.FC_CUST_BILL_ITEM_TYPE.PROJECTSUNDRY);//选择的项目其他费用
			projectsundryList.forEach(item => {
				if (this.common.isNotBlank(item.amount))
					otherFee = this.common.accAdd(otherFee, item.amount);
			});
			let billSupplementList = this.billSupplementList;//选择的账单补录费用
			billSupplementList.forEach(item => {
				if (this.common.isNotBlank(item.makeupFee)){
					makeupFee = this.common.accAdd(makeupFee, item.makeupFee);
					totalFee = this.common.accAdd(totalFee, item.makeupFee);
				}
			});
			this.billDetailShow = true;
			this.showSelectBillItem = false;
			let that = this;
			this.$nextTick(() => {
				this.$refs.updateBillDetail.bill =
					{
						tenantId: this.$refs.selectBillItem.tenantId,//客户
						custTenantId: this.$refs.selectBillItem.tenantId,//对账客户
						tenantName: this.$refs.selectBillItem.tenantName,
						totalFee: totalFee,
						waybillFee: waybillFee,
						storehouseFee: storehouseFee,
						otherFee: otherFee,
						makeupFee: makeupFee,
						packLeaseFee: packLeaseFee,
						billNum: this.$refs.updateBillDetail.bill.billNum,
						billMonth: this.$refs.updateBillDetail.bill.billMonth,
						remark: this.$refs.updateBillDetail.bill.remark,
					}

				//对账客户
				that.common.postUrl("customerTF", "queryCustomerData", {parentId:this.$refs.selectBillItem.tenantId}, function (data) {
					that.$refs.updateBillDetail.customerAllData = data;
				});
				this.$refs.updateBillDetail.listArray = [orderList, storehouseList,projectsundryList,packLeaseList, billSupplementList];
			})
		},
		/**
		 * 重新勾选
		 */
		recheck()
		{
			this.showSelectBillItem = true;
		},
		/**
		 * 保存账单
		 */
		updateCustBill()
		{
			let updateBillDetail = this.$refs.updateBillDetail;
			updateBillDetail.initImageData();
			updateBillDetail.initReceiptData();
			if (this.common.isBlank(updateBillDetail.bill.tenantId))
			{
				this.$message.error("请选择账单客户！");
				return false;
			}
			if (this.common.isBlank(updateBillDetail.bill.custTenantId))
			{
				this.$message.error("请选择对账客户！");
				return false;
			}
			if (this.common.isBlank(updateBillDetail.bill.billMonth))
			{
				this.$message.error("请选择账单月份！");
				return false;
			}
			if (this.common.isBlank(updateBillDetail.bill.settleBody))
			{
				this.$message.error("请选择结算主体！");
				return false;
			}
			let totalFee = this.common.accAdd(updateBillDetail.bill.waybillFee, updateBillDetail.bill.storehouseFee);
			totalFee = this.common.accAdd(totalFee, updateBillDetail.bill.otherFee);
			totalFee = this.common.accAdd(totalFee, updateBillDetail.bill.makeupFee);
			totalFee = this.common.accAdd(totalFee, updateBillDetail.bill.packLeaseFee);
			if (updateBillDetail.bill.totalFee !== totalFee)
			{
				this.$message.error("账单金额不等于运输金额+仓储金额+包装金额+其他金额+补录金额！");
				return false;
			}
			/********	数据校验完毕,开始封装数据	********/
			for (let i = 0; i < updateBillDetail.listArray.length; i++)
			{
				let data = updateBillDetail.listArray[i];
				if (i === 0)//运输订单
				{
					updateBillDetail.bill.orderList = data;
				}
				else if (i === 1)//仓储费用
				{
					updateBillDetail.bill.storehouseList = data;
				}
				else if (i === 2)//项目其他费用
				{
					updateBillDetail.bill.projectsundryList = data;
				}
				else if (i === 3)//包装租赁费用
				{
					updateBillDetail.bill.packLeaseList = data;
				}
				else if (i === 4)//账单补录费用
				{
					updateBillDetail.bill.billSupplementList = data;
				}

			}
			if (this.saveFlag)
			{
				this.$message.error("账单已经修改，请勿重复操作！");
				return false;
			}
			updateBillDetail.bill.billId = this.$route.query.billId;
			let that = this;
			that.saveFlag = true;
			that.common.postUrl("fcCustBillTF", "saveOrUpdateCustBill", updateBillDetail.bill, function (data) {
				that.$message.success("账单:" + data.billNum + "修改成功,3秒后本页面自动关闭!");
				setTimeout(() => {
					that.closePage();
					that.saveFlag = false;
				}, 3000);
			},function (){
				that.saveFlag = false;
			},'',true);
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
