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
			methodName: "queryOrdWaybillPageForBill",
			tableName: "派车单信息",
			tabs: [
				{name: '派车单信息', active: true, id: enumData.FC_SUPPLIER_BILL_ITEM_TYPE.WAYBILL,show:true},
				{name: '仓储费用', active: false, id: enumData.FC_SUPPLIER_BILL_ITEM_TYPE.STOREHOUSE,show:true},
				{name: '器具费用', active: false, id: enumData.FC_SUPPLIER_BILL_ITEM_TYPE.PACKCOST,show:true},
				// {name: '项目其他费用', active: false, id: enumData.FC_SUPPLIER_BILL_ITEM_TYPE.PROJECTSUNDRY,show:true},
				{name: '账单补录费用', active: false, id: enumData.FC_SUPPLIER_BILL_ITEM_TYPE.BILLSUPPLEMENT,show:true},
				{name: '账单操作记录', active: false, id: enumData.FC_SUPPLIER_BILL_ITEM_TYPE.BILL_OP_RECORD,show:true},
				{name: '发票提交记录', active: false, id: enumData.FC_SUPPLIER_BILL_ITEM_TYPE.SUBMIT_INVOICE,show:true},
				{name: '发票审核记录', active: false, id: enumData.FC_SUPPLIER_BILL_ITEM_TYPE.VERIFY_INVOICE,show:true},
				{name: '付款登记记录', active: false, id: enumData.FC_SUPPLIER_BILL_ITEM_TYPE.PAY,show:true},
			],
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
	},
	methods: {
		/**
		 * 加载账单数据
		 */
		async loadBillData() {
			let param = this.common.copyObj(this.$route.query);
			param.confirmed = 1;
			let data = await this.common.postUrl("fcSupplierBillTF", "getAllFcSupplierBillInfo", param);
			this.bill = data.maininfo;
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
			//初始加载所有数据 判断是否需要展示tab
			if (this.common.isNotBlank(this.$route.query.tabId))
			{
				let isFind = false;
				this.tabs.forEach(tab => {
					if (this.$route.query.tabId == tab.id)
					{
						this.$nextTick(() => {
							this.changeTab(tab);
						})
						isFind = true;
					}
				})
				if (!isFind)
				{
					for (let i = 0; i < this.tabs.length; i++) {
						if(this.tabs[i].show){
							this.changeTab(this.tabs[i]);
						}
					}
				}
			}
			else
			{
				for (let i = 0; i < this.tabs.length; i++) {
					if(this.tabs[i].show){
						this.changeTab(this.tabs[i]);
					}
				}
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
			else if (tab.id === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.BILL_OP_RECORD)
			{
				this.methodName = "queryFcSupplierBillInfoHisPage";
				this.tableName = "账单操作记录";
			}
			else if (tab.id === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.SUBMIT_INVOICE)
			{
				this.methodName = "queryFcSubmitInvoiceInfoHisPage";
				this.tableName = "发票提交记录";
			}
			else if (tab.id === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.VERIFY_INVOICE)
			{
				this.methodName = "queryFcSubmitInvoiceInfoVerifyHisPage";
				this.tableName = "发票审核记录";
			}
			else if (tab.id === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.PAY)
			{
				this.methodName = "queryFcPayInfoHisPage";
				this.tableName = "付款登记记录";
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
		downloadOrder(){
			let query = {
				wayBillId: this.$route.query.fcSupplierBillId,
				page: 1,
				rows: 50,
			}
			let head = [
				{"name": "客户", "code": "tenantName", "width": "200", "type": "text"},
				{"name": "线路名称", "code": "routeName", "width": "200", "type": "text"},
				{"name": "订单号", "code": "orderNum", "width": "180", "type": "text"},
				{"name": "派车单号", "code": "waybillNum", "width": "180", "type": "text"},
				{"name": "客户单号", "code": "custOrderNum", "width": "150", "type": "text"},
				{"name": "订单状态", "code": "orderStateName", "width": "100", "type": "diyColorTd"},
				{"name": "要求运作时间", "code": "workDate", "width": "150", "type": "text"},
				{"name": "客户下单时间", "code": "customerOrderDate", "width": "150", "type": "text"},
				{"name": "完成时间", "code": "finishDate", "width": "150", "type": "text"},
				{"name": "订单类型", "code": "orderTypeName", "width": "100", "type": "text"},
				{"name": "是否加急", "code": "isUrgentName", "width": "100", "type": "text"},
				{"name": "是否回单", "code": "haveReceiptName", "width": "100", "type": "text"},
				{"name": "派车单数", "code": "waybillNums", "width": "90", "type": "text"},
				{"name": "是否入账", "code": "entryBillFlagName", "width": "90", "type": "text"},
				{"name": "账单编号", "code": "billNum", "width": "120", "type": "text"},
				{"name": "回单状态", "code": "receiptStateName", "width": "90", "type": "text"},
				{"name": "是否生成报表", "code": "generateReportFlagName", "width": "120", "type": "text"},
				{"name": "计费方式", "code": "billingTypeName", "width": "80", "type": "text"},
				{"name": "货物件数", "code": "goodsCountSum", "width": "100", "type": "text",isSum:true},
				{"name": "货物重量/kg", "code": "goodsWeightSum", "width": "100", "type": "text",isSum:true},
				{"name": "货物体积/m³", "code": "goodsVolumeSum", "width": "100", "type": "text",isSum:true},
				{"name": "车型", "code": "vehicleTypeName", "width": "100", "type": "text"},
				{"name": "车长", "code": "vehicleLengthName", "width": "60", "type": "text"},
				{"name": "结算方式", "code": "payModeName", "width": "80", "type": "text"},
				{"name": "结算净重/kg", "code": "netWeight", "width": "90", "type": "text",isSum:true},
				{"name": "结算毛重/kg", "code": "grossWeight", "width": "90", "type": "text",isSum:true},
				{"name": "结算体积/m³", "code": "volume", "width": "90", "type": "text",isSum:true},
				{"name": "计费单价", "code": "freightPrice", "width": "90", "type": "text", "entityId": "1003029",},
				{"name": "中途点数", "code": "midwayPointCount", "width": "90", "type": "text", "entityId": "1003029",isSum:true},
				{"name": "点位费", "code": "pointFee", "width": "90", "type": "text", "entityId": "1003029"},
				{"name": "点位费合计", "code": "totalPointFee", "width": "90", "type": "text", "entityId": "1003029",isSum:true},
				{"name": "运费", "code": "freight", "width": "90", "type": "text", "entityId": "1003029",isSum:true},
				{"name": "保险费", "code": "premiumFee", "width": "90", "type": "text", "entityId": "1003029",isSum:true},
				{"name": "装货费", "code": "loadingFee", "width": "90", "type": "text", "entityId": "1003029",isSum:true},
				{"name": "卸货费", "code": "dischargeFee", "width": "90", "type": "text", "entityId": "1003029",isSum:true},
				{"name": "其他费", "code": "otherFee", "width": "90", "type": "text", "entityId": "1003029",isSum:true},
				{"name": "下单金额合计", "code": "totalFee", "width": "80", "type": "text", "entityId": "1003029",isSum:true},
				{"name": "异动金额合计", "code": "statementFee", "width": "80", "type": "text", "entityId": "1003029",isSum:true},
				{"name": "补费金额合计", "code": "makeupFee", "width": "80", "type": "text", "entityId": "1003029",isSum:true},
				{"name": "订单收入合计", "code": "income", "width": "100", "type": "text", "entityId": "1003029",isSum:true},
				{"name": "订单成本合计", "code": "pay", "width": "100", "type": "text", "entityId": "1003030",isSum:true},
				{"name": "下单人", "code": "createUserName", "width": "100", "type": "text"},
				{"name": "系统录单时间", "code": "createDate", "width": "150", "type": "text"},
				{"name": "订单备注", "code": "orderRemark", "width": "200", "type": "text"},
				{"name": "协同区域", "code": "cdtRegionName", "width": "90", "type": "text",},
				{"name": "协同费用", "code": "cdtFee", "width": "90", "type": "text",},
			];
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
			this.common.downloadExcelFile('orderTF|queryOrderInfoList',query,excelLables,excelKeys,"账单:" + this.bill.billNum + "-订单",'fcSupplierBillDetailTable');
		},
		toSubmitInvoice(item){
			this.$emit("openTab",{
				urlId: 'invoice' + item.id,
				query: {submitInvoiceNum: item.submitInvoiceNum},
				urlName: "供应商发票提交",
				urlPathName: "/invoice",
				urlPath: "/pt/fc/invoice/submitInvoiceManage.vue"});
		}

	},
}
