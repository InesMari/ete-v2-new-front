import tableCommon from "@/components/table/tableCommon.vue"
import simpleTable from "@/components/simpleTable/simpleTable.vue"
import commonBillDetail from "../commonBillDetail.js";
import enumData from "@/page/pt/enum";

export default {
	name: 'confirmBillDetail',
	mixins: [commonBillDetail],
	data()
	{
		return {
			methodName: "loadOrderFeeData",
			tableName: "运输订单",
			tabs: [
				{name: '运输订单', active: true, id: enumData.FC_CUST_BILL_ITEM_TYPE.ORDER,show:true},
				{name: '仓储费用', active: false, id: enumData.FC_CUST_BILL_ITEM_TYPE.STOREHOUSE,show:true},
				{name: '其他费用', active: false, id: enumData.FC_CUST_BILL_ITEM_TYPE.PROJECTSUNDRY,show:true},
				{name: '器具费用', active: false, id: enumData.FC_CUST_BILL_ITEM_TYPE.PACKLEASE,show:true},
				{name: '账单补录费用', active: false, id: enumData.FC_CUST_BILL_ITEM_TYPE.BILLSUPPLEMENT,show:true},
				{name: '账单操作记录', active: false, id: enumData.FC_CUST_BILL_ITEM_TYPE.BILL_OP_RECORD,show:true},
				{name: '开票申请记录', active: false, id: enumData.FC_CUST_BILL_ITEM_TYPE.APPLY_INVOICE,show:true},
				{name: '开票审核记录', active: false, id: enumData.FC_CUST_BILL_ITEM_TYPE.APPLY_VERIFY,show:true},
				{name: '发票开具记录', active: false, id: enumData.FC_CUST_BILL_ITEM_TYPE.INVOICE_ISSUE,show:true},
				{name: '收款登记记录', active: false, id: enumData.FC_CUST_BILL_ITEM_TYPE.RECEIVE,show:true},
			],
		}
	},
	async mounted()
	{
		await this.loadBillData();
	},
	components: {
		tableCommon,
		simpleTable,
	},
	methods: {
		/**
		 * 加载账单数据
		 */
		async loadBillData()
		{
			let billData = await this.common.postUrl("fcCustBillTF", "queryCustomerBillPage", this.$route.query);
			this.bill = billData.items[0];

			//是否展示tab
			for (let i = 0; i < this.tabs.length; i++) {
				await this.changeTab(this.tabs[i], true);
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

			this.$nextTick(() => {
				if (this.common.isNotBlank(this.bill.attachFileId))
					this.$refs.attach.initDate(this.bill.attachFileId);
				if (this.common.isNotBlank(this.bill.attachFileReceiptId))
					this.$refs.receipt.initDate(this.bill.attachFileReceiptId);
			})

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
			if (tab.id === enumData.FC_CUST_BILL_ITEM_TYPE.ORDER)
			{
				this.tableName = "运输订单";
			}
			else if (tab.id === enumData.FC_CUST_BILL_ITEM_TYPE.STOREHOUSE)
			{
				methodName = "loadStorehouseFeeList";
				this.tableName = "仓储费用";
			}
			else if (tab.id === enumData.FC_CUST_BILL_ITEM_TYPE.PACKLEASE)
			{
				methodName = "loadPackLeaseFeeList";
				this.tableName = "器具费用";
			}
			else if (tab.id === enumData.FC_CUST_BILL_ITEM_TYPE.PROJECTSUNDRY)
			{
				methodName = "loadProjectsundryFeeList";
				this.tableName = "其他费用";
			}
			else if (tab.id === enumData.FC_CUST_BILL_ITEM_TYPE.BILLSUPPLEMENT)
			{
				methodName = "loadOrderBillSupplementFeeList";
				this.tableName = "账单补录费用";
			}
			else if (tab.id === enumData.FC_CUST_BILL_ITEM_TYPE.BILL_OP_RECORD)
			{
				methodName = "loadBillOpRecordList";
				this.tableName = "账单操作记录";
			}
			else if (tab.id === enumData.FC_CUST_BILL_ITEM_TYPE.APPLY_INVOICE)
			{
				methodName = "loadApplyInvoiceRecordList";
				this.tableName = "开票申请记录";
			}
			else if (tab.id === enumData.FC_CUST_BILL_ITEM_TYPE.APPLY_VERIFY)
			{
				methodName = "loadInvoiceVerifyRecordList";
				this.tableName = "开票审核记录";
			}
			else if (tab.id === enumData.FC_CUST_BILL_ITEM_TYPE.INVOICE_ISSUE)
			{
				methodName = "loadInvoiceIssueRecordList";
				this.tableName = "发票开具记录";
			}
			else if (tab.id === enumData.FC_CUST_BILL_ITEM_TYPE.RECEIVE)
			{
				methodName = "loadReceiveRecordList";
				this.tableName = "收款登记记录";
			}
			this.methodName = methodName.substring(0, methodName.length - 4) + "Data";
			await this.loadBillDetailData(methodName);
			tab.show = this.tableData.length > 0;
		},
		/**
		 * 导出EXCEL
		 */
		download(){
			let query = {
				billId: this.$route.query.billId,
				page: 1,
				rows: 50,
				flag: 1,
			}
			this.$refs.table.downloadExcelFile("账单:" + this.bill.billNum + "-" + this.tableName, "fcCustBillTF", this.methodName, query);
		},
		downloadWaybill(){
			let query = {
				orderBillId: this.$route.query.billId,
				page: 1,
				rows: 50,
			}
            let head = [{"name": "派车单号", "code": "waybillNum", "width": "160", "type": "text"},
				{"name": "订单编号", "code": "orderNum", "width": "160", "type": "diy"},
				{"name": "客户", "code": "custName", "width": "160", "type": "text"},
				{"name": "调度类型", "code": "dispatchTypeName", "width": "90", "type": "text"},
				{"name": "派车状态", "code": "waybillStateName", "width": "80", "type": "text"},
				{"name": "回单状态", "code": "receiptStateName", "width": "90", "type": "text"},
				{"name": "线路名称", "code": "routeName", "width": "180", "type": "text"},
				{"name": "起始点", "code": "startWorkName", "width": "120", "type": "text"},
				{"name": "起始点详细地址", "code": "startWorkAddress", "width": "220", "type": "text"},
				{"name": "目的地", "code": "endWorkName", "width": "120", "type": "text"},
				{"name": "目的地详细地址", "code": "endWorkAddress", "width": "220", "type": "text"},
				{"name": "供应商", "code": "supplierName", "width": "180", "type": "text"},
				{"name": "车牌号码", "code": "plateNumber", "width": "80", "type": "text"},
				{"name": "司机", "code": "driverName", "width": "80", "type": "text"},
				{"name": "客户下单时间", "code": "customerOrderDate", "width": "150", "type": "text"},
				{"name": "要求运作时间", "code": "startWorkDate", "width": "140", "type": "text"},
				{"name": "是否入账", "code": "entryBillFlagName", "width": "90", "type": "text"},
				{"name": "账单编号", "code": "billNum", "width": "160", "type": "text"},
				{"name": "是否生成报表", "code": "generateReportFlagName", "width": "120", "type": "text"},
				{"name": "是否开票", "code": "isInvoiceName", "width": "90", "type": "text"},
				{"name": "车辆属性", "code": "vehicleAttributionName", "width": "120", "type": "text"},
				{"name": "出车时间", "code": "startCarDate", "width": "140", "type": "text"},
				{"name": "收车时间", "code": "endCarDate", "width": "140", "type": "text"},
				{"name": "货物名称", "code": "goodsName", "width": "120", "type": "text"},
				{"name": "货物件数/件", "code": "totalGoodsCount", "width": "80", "type": "text",isSum:true},
				{"name": "货物重量/kg", "code": "totalGoodsWeight", "width": "80", "type": "text",isSum:true},
				{"name": "货物体积/m³", "code": "totalGoodsVolume", "width": "80", "type": "text",isSum:true},
				{"name": "计费方式", "code": "billTypeName", "width": "100", "type": "text"},
				{"name": "下单金额合计", "code": "totalFee", "width": "80", "type": "text",isSum:true},
				{"name": "异动金额合计", "code": "statementFee", "width": "80", "type": "text",isSum:true},
				{"name": "补费金额合计", "code": "makeupFee", "width": "80", "type": "text",isSum:true},
				{"name": "费用合计", "code": "amount", "width": "80", "type": "text",isSum:true},
				{"name": "支付状态","code":"payStateName","width":"100", "type": "text"},
				{"name": "平台状态","code":"g7StateName","width":"80", "type": "text"},
				{"name": "平台反馈结果","code":"g7Msg","width":"240", "type": "text"},
				{"name": "平台基地","code":"g7NtoccGroundName","width":"120", "type": "text"},
				{"name": "调度人", "code": "createUserName", "width": "80", "type": "text"},
				{"name": "调度时间", "code": "createDate", "width": "140", "type": "text"}];
			let excelKeys='';
			let excelLables='';

			for(let el of head){
				excelKeys+=','+el.code;
				excelLables+=','+el.name;
			}
			if(excelKeys.length>0){
				excelKeys=excelKeys.substr(1);
				excelLables=excelLables.substr(1);
			}
			this.common.downloadExcelFile('ordWaybillTF|queryOrdWaybillPage',query,excelLables,excelKeys,"账单:" + this.bill.billNum + "-运单",'fcCustBillWaybillTable');
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
