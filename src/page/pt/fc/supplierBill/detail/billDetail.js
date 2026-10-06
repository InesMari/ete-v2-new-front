import tableCommon from "@/components/table/tableCommon.vue"
import simpleTable from "@/components/simpleTable/simpleTable.vue"
import commonBillDetail from "../commonBillDetail.js";
import enumData from "@/page/pt/enum";
import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
	name: 'billDetail',
	mixins: [commonBillDetail],
	data()
	{
		return {
			methodName: "queryOrdWaybillPageForBill",
			tableName: "派车单信息",
		}
	},
	mounted()
	{
		let that = this;
		//加载账单数据
		that.loadBillData();
	},
	components: {
		tableCommon,
		simpleTable,
		myFileModel
	},
	methods: {
		/**
		 * 加载账单数据
		 */
		async loadBillData() {
			let data = await this.common.postUrl("fcSupplierBillTF", "getAllFcSupplierBillInfo", this.$route.query);
			this.bill = data.maininfo;
			this.$refs.attach.initDate(this.bill.attachFileId);
			this.listArray = data.details;
			//上次保存数据回显右边表格
			for (let i = 0; i < this.listArray.length; i++) {
				let items = this.listArray[i];
				if(items.length>0){
					this.tabs[i].show=true;
				}else{
					this.tabs[i].show=false;
				}
				for (let j = 0; j < items.length; j++) {
					if (items[j].supplierName) {
						this.bill.supplierName = items[j].supplierName;
						break;
					}
				}
			}
			//处理选择的客户相关
			//初始加载所有数据 判断是否需要展示tab
			if (this.common.isNotBlank(this.$route.query.tabId))
			{
				let isFind = false;
				for (let i = 0; i < this.tabs.length; i++) {
					if (this.$route.query.tabId == this.tabs[i].id && !isFind)
					{
						this.$nextTick(() => {
							this.changeTab(this.tabs[i]);
						})
						isFind = true;
					}
				}
			}
			else
			{
				this.$nextTick(() => {
					for (let i = 0; i < this.tabs.length; i++) {
						if (this.tabs[i].show)
						{
							this.changeTab(this.tabs[i]);
							break;
						}
					}
				})
			}
		},
		/**
		 * 改变tab 重写commonBillDetail的
		 * @param tab
		 */
		changeTab(tab)
		{
			//设置表头
			this.changeTabHead(tab);
			//设置表格
			this.methodName = "queryOrdWaybillPageForBill";
			this.tableName = "派车单信息";
			if (tab.id === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.STOREHOUSE)
			{
				this.methodName = "queryStorehouseBillPageForBill";
				this.tableName = "仓储费用";
			}
			else if (tab.id === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.PACKCOST)
			{
				this.methodName = "queryPackCostPageForBill";
				this.tableName = "器具费用";
			}
			// else if (tab.id === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.PROJECTSUNDRY)
			// {
			// 	this.methodName = "queryProjectBillPageForBill";
			// 	this.tableName = "项目其他费用";
			// }
			else if (tab.id === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.BILLSUPPLEMENT)
			{
				this.methodName = "queryBillFeeChangePageForBill";
				this.tableName = "账单补录费用";
			}
			this.tableData = this.listArray[tab.id - 1];
			this.$forceUpdate();
		},
		/**
		 * 导出EXCEL
		 */
		download(){
			let query = {
				fcSupplierBillId: this.$route.query.fcSupplierBillId,
				page: 1,
				rows: 50,
			}
			this.$refs.table.downloadExcelFile("账单数据-" + this.tableName, "fcSupplierBillTF", this.methodName, query);
		},
		/**
		 * 双击查看详情
		 * @param data
		 */
		dblclickItem(data)
		{
			if(this.showGotoDetail){
				this.openDetail(data, false);
			}
		},
		/**
		 * 关闭当前页面
		 */
		closePage()
		{
			this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
		},
	},
}
