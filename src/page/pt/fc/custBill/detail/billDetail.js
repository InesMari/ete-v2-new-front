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
			methodName: "loadOrderFeeData",
			tableName: "运输订单",
		}
	},
	async mounted()
	{
		//加载账单数据
		await this.loadBillData();
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
		async loadBillData()
		{
			let billData = await this.common.postUrl("fcCustBillTF", "queryCustomerBillPage", this.$route.query);
			this.bill = billData.items[0];
			this.$refs.attach.initDate(this.bill.attachFileId);
			this.$refs.receipt.initDate(this.bill.attachFileReceiptId);

			//是否展示tab
			for (let i = 0; i < this.tabs.length; i++) {
				await this.changeTab(this.tabs[i], true);//不设置切换tab
			}
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
		 * 加载账单明细数据
		 * @param methodName
		 */
		async loadBillDetailData(methodName)
		{
			this.tableData = await this.common.postUrl("fcCustBillTF", methodName, this.$route.query,null,null, null, true);
			return this.tableData;
		},
		/**
		 * 改变tab 重写commonBillDetail的
		 * @param tab
		 * @param isChangeTabHead
		 */
		async changeTab(tab, isChangeTabHead)
		{
			//设置表头
			if (!isChangeTabHead)
				this.changeTabHead(tab);
			
			//设置表格
			let methodName = "loadOrderFeeList";
			this.tableName = "运输订单";
			if (tab.id === enumData.FC_CUST_BILL_ITEM_TYPE.STOREHOUSE)
			{
				methodName = "loadStorehouseFeeList";
				this.tableName = "仓储费用";
			}
			else if (tab.id === enumData.FC_CUST_BILL_ITEM_TYPE.PROJECTSUNDRY)
			{
				methodName = "loadProjectsundryFeeList";
				this.tableName = "项目其他费用";
			}
			else if (tab.id === enumData.FC_CUST_BILL_ITEM_TYPE.BILLSUPPLEMENT)
			{
				methodName = "loadOrderBillSupplementFeeList";
				this.tableName = "补录费用";
			}
			else if (tab.id === enumData.FC_CUST_BILL_ITEM_TYPE.PACKLEASE)
			{
				methodName = "loadPackLeaseFeeList";
				this.tableName = "器具费用";
			}
			this.methodName = methodName.substring(0, methodName.length - 4) + "Data";
			await this.loadBillDetailData(methodName);
			//有数据
			tab.show = this.tableData.length > 0;
		},
		/**
		 * 导出EXCEL
		 */
		download(){
			let query = {
				billId: this.$route.query.billId,
				flag: 1,
				page: 1,
				rows: 50,
			}
			this.$refs.table.downloadExcelFile("账单:" + this.bill.billNum + "-" + this.tableName, "fcCustBillTF", this.methodName, query);
		},
		/**
		 * 双击查看详情
		 * @param data
		 */
		dblclickItem(data)
		{
			this.openDetail(data, false);
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
