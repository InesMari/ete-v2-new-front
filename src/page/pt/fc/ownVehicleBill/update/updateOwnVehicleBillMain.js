import enumData from "@/page/pt/enum.js"
import ownVehicleBillDetail from "./updateOwnVehicleBillDetail.vue"
import ownVehicleSelectBillItem from "./updateOwnVehicleSelectBillItem.vue"

export default {
	name: 'updateOwnVehicleBillMain',
	data()
	{
		return {
			showSelectBillItem: false,//展示账单
			billDetailShow: true,//是否渲染账单明细
			saveFlag: false,//点击保存标志
			billOldData: null,
		}
	},
	mounted() {
		this.loadBillData();
		this.loadBillWaybillData();
	},
	components: {
		ownVehicleBillDetail,
		ownVehicleSelectBillItem,
		enumData,
	},
	methods: {
		async loadBillData()
		{
			this.$refs.ownVehicleBillDetail.bill = await this.common.postUrl("ownVehicleBillTF", "queryOwnVehicleBillDetail", this.$route.query);
			this.billOldData = this.common.copyObj(this.$refs.ownVehicleBillDetail.bill);
			await this.$refs.ownVehicleBillDetail.init(this.$refs.ownVehicleBillDetail.bill.tenantId);
		},
		async loadBillWaybillData()
		{
			let that = this;
			await that.common.postUrl("ownVehicleBillTF", "queryWaybillPageForOwnVehicleBillList", this.$route.query, function (data) {
				that.$refs.ownVehicleSelectBillItem.$refs.table.setRightData(data);
				that.$refs.ownVehicleSelectBillItem.dataChange();
				that.$refs.ownVehicleBillDetail.tableData = data;

				that.generateBill();
			});
		},
		/**
		 * 生成账单
		 */
		generateBill()
		{
			let selectItems = this.$refs.ownVehicleSelectBillItem.$refs.table.getRightData();
			if (selectItems.length === 0)
			{
				this.$message.error("请选择生成账单的派车单！");
				return false;
			}
			let totalFee = 0;//账单金额
			let fee1 = 0;//账单科技自有车金额
			let fee2 = 0;//账单供应链自有车金额
			let invoiceTotalFee = 0;//记账总金额，有发票金额总计
			let invoiceFee1 = 0;//科技自有车记账费用
			let invoiceFee2 = 0;//供应链自有车记账费用
			selectItems.forEach(item => {
				if (this.common.isNotBlank(item.amount))
				{
					totalFee = this.common.accAdd(totalFee, item.amount);
				}
				if (item.vehicleAttribution === enumData.VEHICLE_ATTRIBUTION.TECHNOLOGY_OWN_CAR)//科技自有车
				{
					fee1 = this.common.accAdd(fee1, item.amount);
					if (this.common.isNotBlank(item.accountFee))//成本记账的
					{
						invoiceFee1 = this.common.accAdd(invoiceFee1, item.accountFee);
						invoiceTotalFee = this.common.accAdd(invoiceTotalFee, item.accountFee);
					}
				}
				if (item.vehicleAttribution === enumData.VEHICLE_ATTRIBUTION.SUPPLY_CHAIN_OWN_CAR)//供应链自有车
				{
					fee2 = this.common.accAdd(fee2, item.amount);
					if (this.common.isNotBlank(item.accountFee))//成本记账的
					{
						invoiceFee2 = this.common.accAdd(invoiceFee2, item.accountFee);
						invoiceTotalFee = this.common.accAdd(invoiceTotalFee, item.accountFee);
					}
				}
			});

			let set = new Set;
			selectItems.forEach(item => {
				if (this.common.isNotBlank(item.tenantId))
					set.add(item.tenantId);
			})
			if (set.size > 1)
			{
				this.$message.error("不同供应商的派车单无法生成账单,请重新选择");
				return false;
			}
			this.billDetailShow = true;
			this.showSelectBillItem = false;
			this.$nextTick(() => {
				this.$refs.ownVehicleBillDetail.bill.tenantId = this.$refs.ownVehicleSelectBillItem.tenantId;
				this.$refs.ownVehicleBillDetail.bill.tenantName = this.$refs.ownVehicleSelectBillItem.tenantName;
				this.$refs.ownVehicleBillDetail.bill.totalFee = totalFee;
				this.$refs.ownVehicleBillDetail.bill.fee1 = fee1;
				this.$refs.ownVehicleBillDetail.bill.fee2 = fee2;
				this.$refs.ownVehicleBillDetail.bill.invoiceTotalFee = invoiceTotalFee;
				this.$refs.ownVehicleBillDetail.bill.invoiceFee1 = invoiceFee1;
				this.$refs.ownVehicleBillDetail.bill.invoiceFee2 = invoiceFee2;
				this.$refs.ownVehicleBillDetail.bill.waybillNums = selectItems.length;
				this.$refs.ownVehicleBillDetail.bill.remark = this.billOldData.remark;
				this.$refs.ownVehicleBillDetail.bill.userId = this.billOldData.userId;
				this.$refs.ownVehicleBillDetail.bill.bankId = this.billOldData.bankId;
				this.$refs.ownVehicleBillDetail.bill.billMonth = this.billOldData.billMonth;
				this.$refs.ownVehicleBillDetail.bill.billNum = this.billOldData.billNum;
				this.$refs.ownVehicleBillDetail.tableData = selectItems;
				this.$refs.ownVehicleBillDetail.init(this.$refs.ownVehicleSelectBillItem.tenantId);
			})
		},
		/**
		 * 重新选择
		 */
		recheck()
		{
			this.showSelectBillItem = true;
			this.billDetailShow = false;
		},
		/**
		 * 保存账单
		 */
		sureUpdateBill()
		{
			let ownVehicleBillDetailBill = this.$refs.ownVehicleBillDetail.bill;
			if (this.common.isBlank(ownVehicleBillDetailBill.tenantId))
			{
				this.$message.error("请选择账单供应商！");
				return false;
			}
			if (this.common.isBlank(ownVehicleBillDetailBill.bankId))
			{
				this.$message.error("请选择账单银行卡信息！");
				return false;
			}
			if (this.common.isBlank(ownVehicleBillDetailBill.userId))
			{
				this.$message.error("请选择账单银行卡信息！");
				return false;
			}
			if (this.common.isBlank(ownVehicleBillDetailBill.billMonth))
			{
				this.$message.error("请选择账单月份！");
				return false;
			}
			if (this.saveFlag)
			{
				this.$message.error("当前页面数据已经生成账单，请勿重复生成！");
				return false;
			}
			ownVehicleBillDetailBill.billId = this.$route.query.billId;
			ownVehicleBillDetailBill.list = this.$refs.ownVehicleBillDetail.tableData;
			let that = this;
			that.common.postUrl("ownVehicleBillTF", "updateOwnVehicleBill", ownVehicleBillDetailBill, function (data) {
				that.saveFlag = true;
				that.$msgbox("自有车账单:" + data.billNum + "修改成功!",function (data){
					that.closePage();
				});
				setTimeout(() => {
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
