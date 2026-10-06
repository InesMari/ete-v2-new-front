import enumData from "@/page/pt/enum.js"
import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
	name: 'commonBillDetail',
	data()
	{
		return {
			tabs: [
				{name: '运输订单', active: true, id: enumData.FC_CUST_BILL_ITEM_TYPE.ORDER,show:true},
				{name: '仓储费用', active: false, id: enumData.FC_CUST_BILL_ITEM_TYPE.STOREHOUSE,show:true},
				{name: '其他费用', active: false, id: enumData.FC_CUST_BILL_ITEM_TYPE.PROJECTSUNDRY,show:true},
				{name: '器具费用', active: false, id: enumData.FC_CUST_BILL_ITEM_TYPE.PACKLEASE,show:true},
				{name: '补录费用', active: false, id: enumData.FC_CUST_BILL_ITEM_TYPE.BILLSUPPLEMENT,show:true},
			],
			tabId: enumData.FC_CUST_BILL_ITEM_TYPE.ORDER,//默认选择订单
			head: [
				{"name": "订单号", "code": "orderNum", "width": "160", "type": "text"},
				{"name": "客户名称", "code": "tenantName", "width": "180", "type": "text"},
				{"name": "线路名称", "code": "routeName", "width": "200", "type": "text"},
				{"name": "起始地省市区", "code": "PCDName", "width": "250", "type": "text"},
				{"name": "目的地省市区", "code": "ePCDName", "width": "250", "type": "text"},
				{"name": "车辆信息", "code": "plateNumber", "width": "250", "type": "text"},
				{"name": "客户单号", "code": "custOrderNum", "width": "120", "type": "text"},
				{"name": "订单类型", "code": "orderTypeName", "width": "80", "type": "text"},
				{"name": "费用合计", "code": "amount", "width": "80", "type": "text", "issum": "true"},
				{"name": "系统录单时间", "code": "createDate", "width": "130", "type": "text"},
				{"name": "完成时间", "code": "finishDate", "width": "130", "type": "text"},
				{"name": "订单备注", "code": "orderRemark", "width": "200", "type": "text"},
			],
			orderHead: [
				{"name": "订单号", "code": "orderNum", "width": "160", "type": "text"},
				{"name": "客户名称", "code": "tenantName", "width": "180", "type": "text"},
				{"name": "线路名称", "code": "routeName", "width": "200", "type": "text"},
				{"name": "起始地省市区", "code": "PCDName", "width": "250", "type": "text"},
				{"name": "目的地省市区", "code": "ePCDName", "width": "250", "type": "text"},
				{"name": "车辆信息", "code": "plateNumber", "width": "250", "type": "text"},
				{"name": "客户单号", "code": "custOrderNum", "width": "120", "type": "text"},
				{"name": "订单类型", "code": "orderTypeName", "width": "80", "type": "text"},
				{"name": "费用合计", "code": "amount", "width": "80", "type": "text", "issum": "true"},
				{"name": "系统录单时间", "code": "createDate", "width": "130", "type": "text"},
				{"name": "完成时间", "code": "finishDate", "width": "130", "type": "text"},
				{"name": "订单备注", "code": "orderRemark", "width": "200", "type": "text"},
			],
			storehouseHead: [
				{"name": "仓库名称", "code": "workName", "width": "200", "type": "text"},
				{"name": "仓库地址", "code": "workAddressStr", "width": "250", "type": "text"},
				{"name": "费用产生月份", "code": "billMonth", "width": "120", "type": "text"},
				{"name": "费用类型", "code": "itemTypeName", "width": "80", "type": "text", "issum": "true"},
				{"name": "费用合计", "code": "amount", "width": "80", "type": "text", "issum": "true"},
				{"name": "创建人", "code": "createUserName", "width": "130", "type": "text"},
				{"name": "创建时间", "code": "createDate", "width": "130", "type": "text"},
			],
			projectsundryHead: [
				{"name": "费用类型", "code": "feeTypeName", "width": "80", "type": "text"},
				{"name": "费用产生月份", "code": "billMonth", "width": "120", "type": "text"},
				{"name": "费用", "code": "amount", "width": "80", "type": "text", "issum": "true"},
				{"name": "备注", "code": "remark", "width": "100", "type": "text"},
				{"name": "附件", "code": "fileName", "width": "200", "type": "diy"},
				{"name": "创建人", "code": "createUserName", "width": "130", "type": "text"},
				{"name": "创建时间", "code": "createDate", "width": "130", "type": "text"},
			],
			packLeaseHead: [
				{"name": "费用类型", "code": "feeTypeName", "width": "80", "type": "text"},
				{"name": "费用日期", "code": "billDate", "width": "120", "type": "text"},
				{"name": "器具名称", "code": "packName", "width": "120", "type": "text"},
				{"name": "器具数量", "code": "chargeNums", "width": "120", "type": "text"},
				{"name": "超期单价", "code": "price", "width": "120", "type": "text"},
				{"name": "含税价", "code": "amount", "width": "80", "type": "text"},
			],
			billSupplementHead: [
				{"name": "收入类型", "code": "feeTypeName", "width": "80", "type": "text"},
				{"name": "税点", "code": "taxRate", "width": "120", "type": "text"},
				{"name": "补录金额", "code": "makeupFee", "width": "120", "type": "text"},
				{"name": "备注", "code": "remark", "width": "120", "type": "text"},
				{"name": "审核状态", "code": "stsName", "width": "120", "type": "text"},
				{"name": "创建人", "code": "createUserName", "width": "130", "type": "text"},
				{"name": "创建时间", "code": "createDate", "width": "130", "type": "text"},
			],
			//确认账单
			billOpHead: [
				{"name": "操作人", "code": "createUserName", "width": "90", "type": "text"},
				{"name": "操作时间", "code": "createDate", "width": "130", "type": "text"},
				{"name": "操作内容", "code": "logContent", "width": "80", "type": "text"},
				{"name": "账单月份", "code": "billMonth", "width": "80", "type": "text"},
				{"name": "账单金额", "code": "totalFee", "width": "80", "type": "text", "issum": "true"},
				{"name": "运输金额", "code": "waybillFee", "width": "80", "type": "text", "issum": "true"},
				{"name": "仓储金额", "code": "storehouseFee", "width": "80", "type": "text", "issum": "true"},
				{"name": "其他金额", "code": "otherFee", "width": "80", "type": "text", "issum": "true"},
				{"name": "补录金额", "code": "makeupFee", "width": "80", "type": "text", "issum": "true"},
				{"name": "备注", "code": "remark", "width": "200", "type": "text"},
			],
			applyInvoiceHead: [
				{"name": "操作人", "code": "createUserName", "width": "90", "type": "text"},
				{"name": "操作时间", "code": "createDate", "width": "130", "type": "text"},
				{"name": "操作内容", "code": "logContent", "width": "80", "type": "text"},
				{"name": "发票申请编号", "code": "applyInvoiceNum", "width": "160", "type": "text"},
				{"name": "发票类型", "code": "invoiceTypeName", "width": "120", "type": "text"},
				{"name": "发票申请金额", "code": "applyInvoiceFee", "width": "120", "type": "text", "issum": "true"},
				{"name": "购买方名称", "code": "tenantName", "width": "160", "type": "text"},
				{"name": "纳税人识别号", "code": "taxNumber", "width": "180", "type": "text"},
				{"name": "公司地址", "code": "address", "width": "250", "type": "text"},
				{"name": "公司电话", "code": "regPhone", "width": "180", "type": "text"},
				{"name": "开户行", "code": "regBank", "width": "180", "type": "text"},
				{"name": "账号", "code": "regAccount", "width": "180", "type": "text"},
				{"name": "客户要求票面备注", "code": "customerRequestRemark", "width": "200", "type": "text"},
				{"name": "客户其他要求", "code": "otherCustomerRequest", "width": "200", "type": "text"},
			],
			invoiceVerifyHead: [
				{"name": "操作人", "code": "createUserName", "width": "90", "type": "text"},
				{"name": "操作时间", "code": "createDate", "width": "130", "type": "text"},
				{"name": "操作内容", "code": "logContent", "width": "100", "type": "text"},
				{"name": "审核状态", "code": "verifyStateName", "width": "80", "type": "text"},
				{"name": "发票申请编号", "code": "applyInvoiceNum", "width": "130", "type": "text"},
				{"name": "发票类型", "code": "invoiceTypeName", "width": "120", "type": "text"},
				{"name": "发票申请金额", "code": "applyInvoiceFee", "width": "120", "type": "text", "issum": "true"},
				{"name": "购买方名称", "code": "tenantName", "width": "160", "type": "text"},
				{"name": "纳税人识别号", "code": "taxNumber", "width": "180", "type": "text"},
				{"name": "公司地址", "code": "address", "width": "250", "type": "text"},
				{"name": "公司电话", "code": "regPhone", "width": "180", "type": "text"},
				{"name": "开户行", "code": "regBank", "width": "180", "type": "text"},
				{"name": "账号", "code": "regAccount", "width": "180", "type": "text"},
				{"name": "备注", "code": "remark", "width": "200", "type": "text"},
			],
			invoiceIssueHead: [
				{"name": "操作人", "code": "createUserName", "width": "90", "type": "text"},
				{"name": "操作时间", "code": "createDate", "width": "130", "type": "text"},
				{"name": "操作内容", "code": "logContent", "width": "80", "type": "text"},
				{"name": "发票申请编号", "code": "applyInvoiceNum", "width": "130", "type": "text"},
				{"name": "发票类型", "code": "invoiceTypeName", "width": "120", "type": "text"},
				{"name": "发票申请金额", "code": "applyInvoiceFee", "width": "120", "type": "text", "issum": "true"},
				{"name": "发票号", "code": "invoiceNum", "width": "250", "type": "text"},
				{"name": "开票金额", "code": "applyInvoiceFee", "width": "80", "type": "text"},
				{"name": "开票日期", "code": "invoiceDate", "width": "130", "type": "text"},
				{"name": "账期", "code": "accountPeriod", "width": "80", "type": "text"},
				{"name": "最后收款日期", "code": "lastReceiveDate", "width": "130", "type": "text"},
				{"name": "备注", "code": "remark", "width": "200", "type": "text"},
			],
			receiveHead: [
				{"name": "操作人", "code": "createUserName", "width": "90", "type": "text"},
				{"name": "操作时间", "code": "createDate", "width": "130", "type": "text"},
				{"name": "操作内容", "code": "logContent", "width": "80", "type": "text"},
				{"name": "发票号", "code": "invoiceNum", "width": "250", "type": "text"},
				{"name": "发票类型", "code": "invoiceTypeName", "width": "120", "type": "text"},
				{"name": "发票申请编号", "code": "applyInvoiceNum", "width": "130", "type": "text"},
				{"name": "收款金额", "code": "applyInvoiceFee", "width": "80", "type": "text", "issum": "true"},
				{"name": "收款日期", "code": "receiveDate", "width": "130", "type": "text"},
				{"name": "备注", "code": "remark", "width": "200", "type": "text"},
			],
			tableData: [],//表格数据
			listArray: [],
			bill: this.initBill(),
			showGotoDetail: true,//展示跳转订单详情按钮
			settleBodyData:[],
			pickerOptions: {
				disabledDate(time)
				{
					// //当前日期小于等于5号时,可以选择上月和当月.
					// let now = new Date();
					// let date = now.getDate();
					// if (date <= 5)
					// {
					// 	let curDate = new Date().getTime();
					// 	let monthTime = 30 * 24 * 3600 * 1000;
					// 	let startDate = curDate - monthTime;
					// 	return time.getTime() < startDate;
					// }
					// else
					// {
					// 	return time.getTime() < new Date(now.toLocaleDateString()).getTime();
					// }
					return false;
				},
			},
		}
	},
	mounted()
	{
		this.init();
	},
	components: {
		myFileModel,
	},
	methods:
	{
		/**
		 * 初始化账单对象
		 */
		initBill()
		{
			return this.bill = {
				billNum:'',
				billMonth:'',
				remark:'',
				tenantName: '',
				tenantId: '',
				custTenantId: '',
				totalFee: 0,
				waybillFee: 0,
				storehouseFee: 0,
				otherFee: 0,
				makeupFee: 0,
				packLeaseFee: 0,
				custTenantName: '',//对账客户名称
				confirmStateName: '',//账单确认状态名称
			}
		},
		async init() {
			this.settleBodyData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "INVOICING_COMPANY"});
		},
		/**
		 * 改变tabHead
		 * @param tab
		 */
		changeTabHead(tab)
		{
			this.tabs.forEach(el => {el.active = false;});
			tab.active = true;

			if (tab.id === enumData.FC_CUST_BILL_ITEM_TYPE.ORDER)
			{
				this.head = this.orderHead;
			}
			else if (tab.id === enumData.FC_CUST_BILL_ITEM_TYPE.STOREHOUSE)
			{
				this.head = this.storehouseHead;
			}
			else if (tab.id === enumData.FC_CUST_BILL_ITEM_TYPE.PROJECTSUNDRY)
			{
				this.head = this.projectsundryHead;
			}
			else if (tab.id === enumData.FC_CUST_BILL_ITEM_TYPE.BILLSUPPLEMENT)
			{
				this.head = this.billSupplementHead;
			}
			else if (tab.id === enumData.FC_CUST_BILL_ITEM_TYPE.PACKLEASE)
			{
				this.head = this.packLeaseHead;
			}
			else if (tab.id === enumData.FC_CUST_BILL_ITEM_TYPE.BILL_OP_RECORD)
			{
				this.head = this.billOpHead;
			}
			else if (tab.id === enumData.FC_CUST_BILL_ITEM_TYPE.APPLY_INVOICE)
			{
				this.head = this.applyInvoiceHead;
			}
			else if (tab.id === enumData.FC_CUST_BILL_ITEM_TYPE.APPLY_VERIFY)
			{
				this.head = this.invoiceVerifyHead;
			}
			else if (tab.id === enumData.FC_CUST_BILL_ITEM_TYPE.INVOICE_ISSUE)
			{
				this.head = this.invoiceIssueHead;
			}
			else if (tab.id === enumData.FC_CUST_BILL_ITEM_TYPE.RECEIVE)
			{
				this.head = this.receiveHead;
			}
			this.tabId = tab.id;
			this.showGotoDetail = tab.id === enumData.FC_CUST_BILL_ITEM_TYPE.ORDER;
			this.$forceUpdate();
		},
		/**
		 * 改变tab
		 * @param tab
		 */
		changeTab(tab)
		{
			this.changeTabHead(tab);
			this.tableData = this.listArray[tab.id - 1];
		},
		/**
		 * 查看详情
		 */
		toOrderDetail(isClllParent)
		{
			let selectData = this.$refs.table.getSelectItem();
			if(selectData.length !== 1)
			{
				this.$message.error("请选择一个需要查看的订单！");
				return false;
			}
			this.openDetail(selectData[0], isClllParent);
		},
		/**
		 * 打开详情
		 * @param data
		 * @param isClllParent 是否调用父组件调用
		 */
		openDetail(data, isClllParent)
		{
			if ((this.tabId === enumData.FC_CUST_BILL_ITEM_TYPE.BILLSUPPLEMENT
				|| this.tabId === enumData.FC_CUST_BILL_ITEM_TYPE.ORDER))
			{
				let it = this;
				if (isClllParent) it = this.$parent;
				it.$emit("openTab",{
					urlId: 'orderDetail' + data.orderId,
					query: {orderId: data.orderId, pId: 1001070},
					urlName: "订单详情",
					urlPathName: "/order",
					urlPath: "/pt/ord/order/orderDetail/orderDetailMain.vue"});
			}
		},
		checkTip()
		{
			if (this.bill.billMonth)
			{
				let array = this.bill.billMonth.split("-");
				let billYear = array[0];
				let billMonth = Number(array[1]);
				let now = new Date();
				let nowYear = now.getFullYear();
				let nowMonth = now.getMonth();
				let tip = false;
				if (billYear == nowYear)//相同年份的
				{
					tip = Math.abs((nowMonth + 1) - billMonth) >= 3;
				}
				else//不同年份的
				{
					if (Math.abs(nowYear - billYear) > 1)//超过1年的
					{
						tip = true;
					}
					else//相邻的两年
					{
						if (
							!((billMonth == 10 && nowMonth == 0) || (billMonth == 11 && nowMonth <= 1) || (billMonth == 12 && nowMonth <= 2)
								|| (nowMonth == 9 && billMonth == 1) || (nowMonth == 10 && billMonth <= 2) || (nowMonth == 11 && billMonth <= 3)
								))
						{
							tip = true;
						}
					}
				}
				if (tip)
				{
					this.$message.warning("您选择的月份:" + this.bill.billMonth + "与当前月份相差超过3个月！");
				}
			}
		},
		/**
		 * 显示
		 * @param data
		 */
		showImg(data)
		{
			if(!data.imgPath){
				this.$message.error("没有数据~");
				return;
			}
			this.$refs.img.initDate(data.imgId);
		},
		successCallback()
		{
			this.$refs.img.visitFile();
		}
	}
}
