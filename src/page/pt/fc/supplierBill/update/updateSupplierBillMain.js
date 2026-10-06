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
		this.loadBillData();
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
			let data = await this.common.postUrl("fcSupplierBillTF", "getAllFcSupplierBillInfo", this.$route.query);
			this.$refs.updateBillDetail.bill = data.maininfo;
			if(this.common.isNotBlank(this.$refs.updateBillDetail.bill.settleBody)) {
				this.$refs.updateBillDetail.bill.settleBody = this.$refs.updateBillDetail.bill.settleBody+'';
			}
			this.$refs.updateBillDetail.initAttach();
			this.$refs.updateBillDetail.listArray = data.details;
			this.billSupplementList = this.$refs.updateBillDetail.listArray[3];
			//上次保存数据回显右边表格
			for (let i = 0; i < this.$refs.updateBillDetail.listArray.length; i++)
			{
				let items = this.$refs.updateBillDetail.listArray[i];
				this.$refs.selectBillItem.initData(items, i + 1);
				if(items.length>0){
					for (let j = 0; j < items.length; j++){
						if(this.common.isNotBlank(items[j].supplierName)){
							this.$refs.updateBillDetail.bill.supplierName=items[j].supplierName;
							break;
						}
					}
				}
			}
			//处理选择的客户相关
			this.$refs.selectBillItem.dataChange();
			this.$refs.updateBillDetail.tableData = this.$refs.updateBillDetail.listArray[0];
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
			let supplierTenantId = '';
			let supplierName = '';
			let totalFee = 0;//账单金额
			let waybillFee = 0;//运输费用合计
			let storehouseFee = 0;//仓库费用合计
			let packCostFee = 0;//包装采购费用合计
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
				if (this.common.isNotBlank(item.supplierTenantId))
				{
					set.add(item.supplierTenantId);
				}
				supplierTenantId = item.supplierTenantId;
				supplierName = item.supplierName;
			})
			if (set.size > 1)
			{
				this.$message.error("不同供应商的数据无法生成账单,请重新选择");
				return false;
			}
			let waybillList = this.$refs.selectBillItem.getSelectItem(enumData.FC_SUPPLIER_BILL_ITEM_TYPE.WAYBILL);//选择的运输订单
			waybillList.forEach(item => {
				if (this.common.isNotBlank(item.amount))
				{
					waybillFee = this.common.accAdd(waybillFee, item.amount);
				}
			});
			let storehouseList = this.$refs.selectBillItem.getSelectItem(enumData.FC_SUPPLIER_BILL_ITEM_TYPE.STOREHOUSE);//选择的仓储费用
			storehouseList.forEach(item => {
				if (this.common.isNotBlank(item.amount))
				{
					storehouseFee = this.common.accAdd(storehouseFee, item.amount);
				}
			});
			let packCostList = this.$refs.selectBillItem.getSelectItem(enumData.FC_SUPPLIER_BILL_ITEM_TYPE.PACKCOST);//选择的包装采购费用
			packCostList.forEach(item => {
				if (this.common.isNotBlank(item.amount))
					packCostFee = this.common.accAdd(packCostFee, item.amount);
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
			this.$nextTick(() => {
				this.$refs.updateBillDetail.bill.supplierTenantId=supplierTenantId;
				this.$refs.updateBillDetail.bill.supplierName=supplierName;
				this.$refs.updateBillDetail.bill.totalFee=totalFee;
				this.$refs.updateBillDetail.bill.waybillFee=waybillFee;
				this.$refs.updateBillDetail.bill.storehouseFee=storehouseFee;
				this.$refs.updateBillDetail.bill.packCostFee=packCostFee,
				this.$refs.updateBillDetail.bill.makeupFee=makeupFee;
				this.$refs.updateBillDetail.listArray = [waybillList, storehouseList,packCostList, billSupplementList];
			})
		},
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
			totalFee = this.common.accAdd(totalFee, updateBillDetail.bill.packCostFee);
			// totalFee = this.common.accAdd(totalFee, updateBillDetail.bill.otherFee);
			totalFee = this.common.accAdd(totalFee, updateBillDetail.bill.makeupFee);
			if (updateBillDetail.bill.totalFee !== totalFee)
			{
				this.$message.error("账单金额不等于运输金额+仓储金额+器具采购费用+补录金额！");
				return false;
			}
			/********	数据校验完毕,开始封装数据	********/
			for (let i = 0; i < updateBillDetail.listArray.length; i++)
			{
				let data = updateBillDetail.listArray[i];
				if (i === 0)//运输订单
				{
					updateBillDetail.bill.waybillList=[];
					data.forEach(item=>{
						updateBillDetail.bill.waybillList.push(item.id);
					});
				}
				else if (i === 1)//仓储费用
				{
					updateBillDetail.bill.storehouseList=[];
					for (let j = 0; j < data.length; j++) {
						let item = data[j];
						if(item.billMonth!=updateBillDetail.bill.billMonth){
							this.$message.error("仓储费用月份与账单月份只能在一个月份内，请重新选择！");
							return false;
						}
						updateBillDetail.bill.storehouseList.push(item.id);
					}
				}
				else if (i === 2)//包装采购费用
				{
					updateBillDetail.bill.packCostList=[];
					data.forEach(item=>{
						updateBillDetail.bill.packCostList.push(item.id);
					});
				}
				// else if (i === 3)//客户其他费用
				// {
				// 	updateBillDetail.bill.projectsundryList=[];
				// 	data.forEach(item=>{
				// 		updateBillDetail.bill.projectsundryList.push(item.id);
				// 	});
				// }
				else if (i === 3)//账单补录费用
				{
					updateBillDetail.bill.billSupplementList=[];
					data.forEach(item=>{
						updateBillDetail.bill.billSupplementList.push(item.id);
					});
				}
			}
			if (this.saveFlag)
			{
				this.$message.error("当前页面数据已经修改成功，请勿重复修改！");
				return false;
			}
			updateBillDetail.bill.fcSupplierBillId = this.$route.query.fcSupplierBillId;
			let that = this;
			that.common.postUrl("fcSupplierBillTF", "updateFcSupplierBillInfo", updateBillDetail.bill, function (data) {
				that.$message.success("账单:" + updateBillDetail.bill.billNum + "修改成功!");
				that.saveFlag = true;
				// setTimeout(() => {
					that.saveFlag = false;
					that.closePage();
				// }, 3000);
			},null,'',true);
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
