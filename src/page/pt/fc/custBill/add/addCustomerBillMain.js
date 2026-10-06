import enumData from "@/page/pt/enum.js"
import addBillDetail from "./addBillDetail.vue"
import selectBillItem from "./selectBillItem.vue"

export default {
	name: 'addCustomerBillMain',
	data()
	{
		return {
			showSelectBillItem: true,//展示账单
			billDetailShow: false,//是否渲染账单明细
			saveFlag: false,//点击保存标志
		}
	},
	mounted()
	{

	},
	components: {
		addBillDetail,
		selectBillItem,
		enumData,
	},
	methods: {
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
			let projectsundryList = this.$refs.selectBillItem.getSelectItem(enumData.FC_CUST_BILL_ITEM_TYPE.PROJECTSUNDRY);//选择的项目其他费用
			projectsundryList.forEach(item => {
				if (this.common.isNotBlank(item.amount))
					otherFee = this.common.accAdd(otherFee, item.amount);
			});
			let packLeaseList = this.$refs.selectBillItem.getSelectItem(enumData.FC_CUST_BILL_ITEM_TYPE.PACKLEASE);//选择的包装租赁费用
			packLeaseList.forEach(item => {
				if (this.common.isNotBlank(item.amount))
					packLeaseFee = this.common.accAdd(packLeaseFee, item.amount);
			});
			this.billDetailShow = true;
			this.showSelectBillItem = false;
			let that =this;
			this.$nextTick(() => {
				this.$refs.addBillDetail.bill =
					{
						tenantId: this.$refs.selectBillItem.tenantId,//客户
						custTenantId: this.$refs.selectBillItem.tenantId,//对账客户
						tenantName: this.$refs.selectBillItem.tenantName,
						totalFee: totalFee,
						waybillFee: waybillFee,
						storehouseFee: storehouseFee,
						otherFee: otherFee,
						packLeaseFee: packLeaseFee,
					}
				//对账客户
				that.common.postUrl("customerTF", "queryCustomerData", {parentId:this.$refs.selectBillItem.tenantId}, function (data) {
					that.$refs.addBillDetail.customerAllData = data;
					that.$forceUpdate();
				});
				this.$refs.addBillDetail.listArray = [orderList, storehouseList,projectsundryList, packLeaseList];
			})
		},
		/**
		 * 重新勾选
		 */
		recheck()
		{
			this.showSelectBillItem = true;
			this.billDetailShow = false;
		},
		/**
		 * 保存账单
		 */
		sureSaveBill()
		{
			let addBillDetail = this.$refs.addBillDetail;
			addBillDetail.initImageData();
			addBillDetail.initReceiptData();

			let addBillDetailBill = this.$refs.addBillDetail.bill;
			if (this.common.isBlank(addBillDetailBill.tenantId))
			{
				this.$message.error("请选择账单客户！");
				return false;
			}
			if (this.common.isBlank(addBillDetailBill.custTenantId))
			{
				this.$message.error("请选择对账客户！");
				return false;
			}
			if (this.common.isBlank(addBillDetailBill.billMonth))
			{
				this.$message.error("请选择账单月份！");
				return false;
			}
			if (this.common.isBlank(addBillDetailBill.settleBody))
			{
				this.$message.error("请选择结算主体！");
				return false;
			}
			if (this.common.isBlank(addBillDetailBill.attachFileId))
			{
				this.$message.error("请上传对账单附件！");
				return false;
			}
			if (this.common.isBlank(addBillDetailBill.attachFileReceiptId))
			{
				this.$message.error("请上传回单附件！");
				return false;
			}
			let totalFee = this.common.accAdd(addBillDetailBill.waybillFee, addBillDetailBill.storehouseFee);
			totalFee = this.common.accAdd(totalFee, addBillDetailBill.otherFee);
			totalFee = this.common.accAdd(totalFee, addBillDetailBill.packLeaseFee);
			if (addBillDetailBill.totalFee !== totalFee)
			{
				this.$message.error("账单金额不等于运输金额+仓储金额+包装金额+其他金额+补录金额！");
				return false;
			}
			/********	数据校验完毕,开始封装数据	********/
			for (let i = 0; i < addBillDetail.listArray.length; i++)
			{
				let data = addBillDetail.listArray[i];
				if (i === 0)//运输订单
				{
					addBillDetailBill.orderList = data;
				}
				else if (i === 1)//仓储费用
				{
					addBillDetailBill.storehouseList = data;
				}
				else if (i === 2)//项目其他费用
				{
					addBillDetailBill.projectsundryList = data;
				}
				else if (i === 3)//包装租赁费用
				{
					addBillDetailBill.packLeaseList = data;
				}
			}
			if (this.saveFlag)
			{
				this.$message.error("当前页面数据已经生成账单，请勿重复生成！");
				return false;
			}
			let that = this;
			that.saveFlag = true;
			that.common.postUrl("fcCustBillTF", "saveOrUpdateCustBill", addBillDetailBill, function (data) {
				that.$message.success("账单:" + data.billNum + "生成成功!");
				setTimeout(() => {
					that.saveFlag = false;
					that.closePage();
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
