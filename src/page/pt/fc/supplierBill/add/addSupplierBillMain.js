import enumData from "@/page/pt/enum.js"
import addBillDetail from "./addBillDetail.vue"
import selectBillItem from "./selectBillItem.vue"

export default {
	name: 'addSupplierBillMain',
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
			let supplierTenantId = '';
			let supplierName = '';
			let totalFee = 0;//账单金额
			let waybillFee = 0;//运输费用合计
			let storehouseFee = 0;//仓库费用合计
			let packCostFee = 0;//包装采购费用合计

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
			this.billDetailShow = true;
			this.showSelectBillItem = false;
			this.$nextTick(() => {
				this.$refs.addBillDetail.bill =
					{
						supplierTenantId:supplierTenantId,
						supplierName: supplierName,
						totalFee: totalFee,
						waybillFee: waybillFee,
						storehouseFee: storehouseFee,
						packCostFee:packCostFee,
					}
				this.$refs.addBillDetail.listArray = [waybillList, storehouseList,packCostList];
			})
		},
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
			if (this.common.isBlank(addBillDetail.bill.billMonth))
			{
				this.$message.error("请选择账单月份！");
				return false;
			}
			if (this.common.isBlank(addBillDetail.bill.settleBody))
			{
				this.$message.error("请选择结算主体！");
				return false;
			}
			addBillDetail.initImageData();
			let totalFee = this.common.accAdd(addBillDetail.bill.waybillFee, addBillDetail.bill.storehouseFee);
			totalFee = this.common.accAdd(totalFee, addBillDetail.bill.packCostFee);
			if (addBillDetail.bill.totalFee !== totalFee)
			{
				this.$message.error("账单金额不等于运输金额+仓储金额+器具采购费用+补录金额！");
				return false;
			}
			/********	数据校验完毕,开始封装数据	********/
			for (let i = 0; i < addBillDetail.listArray.length; i++)
			{
				let data = addBillDetail.listArray[i];
				if (i === 0)//运输订单
				{
					addBillDetail.bill.waybillList=[];
					data.forEach(item=>{
						addBillDetail.bill.waybillList.push(item.id);
					});
				}
				else if (i === 1)//仓储费用
				{
					addBillDetail.bill.storehouseList=[];
					for (let j = 0; j < data.length; j++) {
						let item = data[j];
						if(item.billMonth!=addBillDetail.bill.billMonth){
							this.$message.error("仓储费用月份与账单月份只能在一个月份内，请重新选择！");
							return false;
						}
						addBillDetail.bill.storehouseList.push(item.id);
					}
				}
				else if (i === 2)//包装采购费用
				{
					addBillDetail.bill.packCostList=[];
					data.forEach(item=>{
						addBillDetail.bill.packCostList.push(item.id);
					});
				}
			}
			if (this.saveFlag)
			{
				this.$message.error("当前页面数据已经生成账单，请勿重复生成！");
				return false;
			}
			let that = this;
			that.saveFlag = true;
			that.common.postUrl("fcSupplierBillTF", "addFcSupplierBillInfo", addBillDetail.bill, function (data) {
				that.$message.success("账单:" + data.billNum + "生成成功!");
				// setTimeout(() => {
					that.saveFlag = false;
					that.closePage();
				// }, 3000);
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
