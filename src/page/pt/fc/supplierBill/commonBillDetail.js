import enumData from "@/page/pt/enum.js"

export default {
	name: 'commonBillDetail',
	data()
	{
		return {
			tabs: [
				{name: '派车单信息', active: true, id: enumData.FC_SUPPLIER_BILL_ITEM_TYPE.WAYBILL,show:true},
				{name: '仓储费用', active: false, id: enumData.FC_SUPPLIER_BILL_ITEM_TYPE.STOREHOUSE,show:true},
				{name: '器具费用', active: false, id: enumData.FC_SUPPLIER_BILL_ITEM_TYPE.PACKCOST,show:true},
				{name: '账单补录费用', active: false, id: enumData.FC_SUPPLIER_BILL_ITEM_TYPE.BILLSUPPLEMENT,show:true},
			],
			head: [],
			waybillHead: [
				{"name": "派车单号", "code": "waybillNum", "width": "160", "type": "text"},
                {"name": "平台运单号", "code": "thrdWaybillNum", "width": "160", "type": "text"},
                {"name": "调度类型", "code": "dispatchTypeName", "width": "120", "type": "text"},
				{"name": "客户名称", "code": "custName", "width": "180", "type": "text"},
				{"name": "订单编号", "code": "orderNum", "width": "180", "type": "text"},
				{"name": "线路名称", "code": "routeName", "width": "180", "type": "text"},
				{"name": "起始点", "code": "startWorkName", "width": "120", "type": "text"},
				{"name": "起始点详细地址", "code": "startWorkAddress", "width": "220", "type": "text"},
				{"name": "目的地", "code": "endWorkName", "width": "120", "type": "text"},
				{"name": "目的地详细地址", "code": "endWorkAddress", "width": "220", "type": "text"},
				{"name": "供应商", "code": "supplierName", "width": "180", "type": "text"},
				{"name": "司机", "code": "driverName", "width": "120", "type": "text"},
				{"name": "车牌号码", "code": "plateNumber", "width": "120", "type": "text"},
				{"name": "车长", "code": "vehicleLengthName", "width": "120", "type": "text"},
				{"name": "要求运作时间", "code": "workDate", "width": "150", "type": "text"},
				{"name": "出车时间", "code": "startCarDate", "width": "150", "type": "text"},
				{"name": "收车时间", "code": "endCarDate", "width": "150", "type": "text"},
				{"name": "完成天数", "code": "endDays", "width": "80", "type": "text"},
				{"name": "调度件数/件", "code": "totalGoodsCount", "width": "100", "type": "text"},
				{"name": "调度重量/kg", "code": "totalGoodsWeight", "width": "100", "type": "text"},
				{"name": "调度体积/m³", "code": "totalGoodsVolume", "width": "100", "type": "text"},
				{"name": "费用合计", "code": "amount", "width": "80", "type": "text", "issum": "true"},
				{"name": "调度人", "code": "createUserName", "width": "130", "type": "text"},
				{"name": "调度时间", "code": "createDate", "width": "130", "type": "text"},
			],
			storehouseHead: [
				{"name": "仓库名称", "code": "workName", "width": "200", "type": "text"},
				{"name": "仓库地址", "code": "workAddressStr", "width": "250", "type": "text"},
				{"name": "费用产生月份", "code": "billMonth", "width": "120", "type": "text"},
				{"name": "费用类型", "code": "itemTypeName", "width": "100", "type": "text", "issum": "true"},
				{"name": "费用合计", "code": "amount", "width": "80", "type": "text", "issum": "true"},
				{"name": "创建人", "code": "createUserName", "width": "130", "type": "text"},
				{"name": "创建时间", "code": "createDate", "width": "130", "type": "text"},
			],
			packCostHead: [
				{"name": "采购单号", "code": "purchaseOrderNum", "width": "150", "type": "text"},
				{"name": "费用产生月份", "code": "billMonth", "width": "120", "type": "text"},
				{"name": "仓库名称", "code": "workName", "width": "180", "type": "text"},
				{"name": "业务模式", "code": "businessModeName", "width": "100", "type": "text"},
				{"name": "计费单位", "code": "unitName", "width": "100", "type": "text"},
				{"name": "供应商", "code": "supplierName", "width": "160", "type": "text"},
				{"name": "客户名称", "code": "custName", "width": "160", "type": "text"},
				{"name": "器具名称", "code": "packName", "width": "120", "type": "text"},
				{"name": "器具数量", "code": "purchaseNums", "width": "120", "type": "text"},
				{"name": "含税价", "code": "amount", "width": "80", "type": "text", "issum": "true"},
			],
			billSupplementHead: [
				{"name": "费用类型", "code": "feeTypeName", "width": "80", "type": "text"},
				{"name": "税点", "code": "taxRate", "width": "120", "type": "text"},
				{"name": "补录金额", "code": "makeupFee", "width": "120", "type": "text"},
				{"name": "备注", "code": "remark", "width": "120", "type": "text"},
				{"name": "审核状态", "code": "stsName", "width": "120", "type": "text"},
				{"name": "创建人", "code": "createUserName", "width": "130", "type": "text"},
				{"name": "创建时间", "code": "createDate", "width": "130", "type": "text"},
			],
			//确认账单
			billOpHead: [
				{"name": "操作人", "code": "createUserName", "width": "160", "type": "text"},
				{"name": "操作时间", "code": "createDate", "width": "180", "type": "text"},
				{"name": "操作内容", "code": "logContent", "width": "200", "type": "text"},
				{"name": "账单月份", "code": "billMonth", "width": "120", "type": "text"},
				{"name": "账单金额", "code": "totalFee", "width": "80", "type": "text", "issum": "true"},
				{"name": "运输金额", "code": "waybillFee", "width": "80", "type": "text", "issum": "true"},
				{"name": "仓储金额", "code": "storehouseFee", "width": "80", "type": "text", "issum": "true"},
				{"name": "器具采购金额", "code": "packCostFee", "width": "80", "type": "text", "issum": "true"},
				{"name": "其他金额", "code": "otherFee", "width": "80", "type": "text", "issum": "true"},
				{"name": "补录金额", "code": "makeupFee", "width": "80", "type": "text", "issum": "true"},
				{"name": "备注", "code": "remark", "width": "130", "type": "text"},
			],
			submitInvoiceHead: [
				{"name": "操作人", "code": "createUserName", "width": "160", "type": "text"},
				{"name": "操作时间", "code": "createDate", "width": "180", "type": "text"},
				{"name": "操作内容", "code": "logContent", "width": "200", "type": "text"},
				{"name": "发票提交编号", "code": "submitInvoiceNum", "width": "160", "type": "diy"},
				{"name": "发票号码", "code": "invoiceNum", "width": "160", "type": "text"},
				// {"name": "发票金额类型", "code": "submitInvoiceTypeName", "width": "90", "type": "text"},
				{"name": "发票类型", "code": "invoiceTypeName", "width": "90", "type": "text"},
				{"name": "发票税率", "code": "invoiceTax", "width": "90", "type": "text", "issum": "true"},
				{"name": "发票金额", "code": "invoiceFee", "width": "90", "type": "text", "issum": "true"},
				{"name": "收款人", "code": "bankAccountName", "width": "110", "type": "text"},
				{"name": "收款账户", "code": "bankCard", "width": "150", "type": "text"},
				{"name": "开户行", "code": "bankDepositName", "width": "150", "type": "text"},
				{"name": "支行名称", "code": "bankSubName", "width": "150", "type": "text"},
				{"name": "银行卡类型", "code": "bankTypeName", "width": "110", "type": "text"},
				{"name": "发票提交备注", "code": "remark", "width": "180", "type": "text"},
			],
			verifyInvoiceHead: [
				{"name": "操作人", "code": "createUserName", "width": "160", "type": "text"},
				{"name": "操作时间", "code": "createDate", "width": "180", "type": "text"},
				{"name": "操作内容", "code": "logContent", "width": "200", "type": "text"},
				{"name": "发票提交编号", "code": "submitInvoiceNum", "width": "160", "type": "diy"},
				{"name": "发票号码", "code": "invoiceNum", "width": "160", "type": "text"},
				// {"name": "发票金额类型", "code": "submitInvoiceTypeName", "width": "90", "type": "text"},
				{"name": "发票类型", "code": "invoiceTypeName", "width": "90", "type": "text"},
				{"name": "发票税率", "code": "invoiceTax", "width": "90", "type": "text", "issum": "true"},
				{"name": "发票金额", "code": "invoiceFee", "width": "90", "type": "text", "issum": "true"},
				{"name": "收款人", "code": "bankAccountName", "width": "110", "type": "text"},
				{"name": "收款账户", "code": "bankCard", "width": "150", "type": "text"},
				{"name": "开户行", "code": "bankDepositName", "width": "150", "type": "text"},
				{"name": "支行名称", "code": "bankSubName", "width": "150", "type": "text"},
				{"name": "银行卡类型", "code": "bankTypeName", "width": "110", "type": "text"},
				{"name": "审核备注", "code": "verifyRemark", "width": "180", "type": "text"},
			],
			payHead: [
				{"name": "操作人", "code": "createUserName", "width": "160", "type": "text"},
				{"name": "操作时间", "code": "createDate", "width": "180", "type": "text"},
				{"name": "操作内容", "code": "logContent", "width": "200", "type": "text"},
				{"name": "发票号", "code": "invoiceNum", "width": "160", "type": "text"},
				{"name": "发票提交编号", "code": "submitInvoiceNum", "width": "160", "type": "diy"},
				{"name": "付款金额", "code": "fee", "width": "180", "type": "text", "issum": "true"},
				{"name": "付款日期", "code": "payDate", "width": "200", "type": "text"},
				{"name": "备注", "code": "remark", "width": "120", "type": "text"},
			],
			bill: this.initBill(),
			tableData: [],//表格数据
			listArray: [],
			showGotoDetail: true,//展示跳转订单详情按钮
			tabId:enumData.FC_SUPPLIER_BILL_ITEM_TYPE.WAYBILL,
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
		this.head = this.waybillHead;
		this.init();
	},
	methods:
	{
		/**
		 * 初始化账单对象
		 */
		initBill()
		{
			return this.bill = {
				tenantName: '',
				tenantId: '',
				custTenantId: '',
				totalFee: 0,
				waybillFee: 0,
				storehouseFee: 0,
				packCostFee: 0,
				otherFee: 0,
				makeupFee: 0,
				custTenantName: '',//对账客户名称
				confirmStateName: '',//账单确认状态名称
			}
		},
		async init() {
			this.settleBodyData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "INVOICING_COMPANY"});
			let accrualMonthInfo = await this.common.postUrl("commonTF", "getAccrualMonth", {});
			this.pickerOptions = {
				disabledDate(time) {
					if(accrualMonthInfo.specialAuth==0){
						let month = parseInt(accrualMonthInfo.accrualMonth);
						let curDate = new Date().getTime();
						let monthTime = 30 * 24 * 3600 * 1000 * month;
						let startDate = curDate - monthTime;
						return time.getTime() < startDate;
					}else{
						return false;
					}
				},
			};
			this.$forceUpdate();
		},
		/**
		 * 改变tabHead
		 * @param tab
		 */
		changeTabHead(tab)
		{
			this.tabs.forEach(el =>
			{
				el.active = false;
			})
			tab.active = true;

			if (tab.id === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.WAYBILL)
			{
				this.head = this.waybillHead;
			}
			else if (tab.id === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.STOREHOUSE)
			{
				this.head = this.storehouseHead;
			}
			else if (tab.id === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.PACKCOST)
			{
				this.head = this.packCostHead;
			}
			else if (tab.id === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.BILLSUPPLEMENT)
			{
				this.head = this.billSupplementHead;
			}
			else if (tab.id === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.BILL_OP_RECORD)
			{
				this.head = this.billOpHead;
			}
			else if (tab.id === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.SUBMIT_INVOICE)
			{
				this.head = this.submitInvoiceHead;
			}
			else if (tab.id === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.VERIFY_INVOICE)
			{
				this.head = this.verifyInvoiceHead;
			}
			else if (tab.id === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.PAY)
			{
				this.head = this.payHead;
			}
			this.tabId = tab.id;
			this.showGotoDetail = (tab.id === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.WAYBILL||tab.id === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.STOREHOUSE);
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
		toDetail(isCallParent)
		{
			let selectData = this.$refs.table.getSelectItem();
			if(selectData.length !== 1)
			{
				this.$message.error("请选择一个需要查看的派车单！");
				return false;
			}
			this.openDetail(selectData[0], isCallParent);
		},
		/**
		 * 打开详情
		 * @param data
		 * @param isCallParent 是否调用父组件调用
		 */
		openDetail(data, isCallParent)
		{
			let it = this;
			if (isCallParent) it = this.$parent;
			if(this.tabId===enumData.FC_SUPPLIER_BILL_ITEM_TYPE.WAYBILL){
				if (data.isTransit == 1)
				{
					it.$emit('openTab', {
						urlName: '查看中转',
						urlId: 'transitManage' + data.id,
						urlPathName: "/order",
						urlPath: "/pt/ord/transit/transitDetailMain",
						query:{t:3,waybillNum: data.waybillNum, tansitWaybillId: data.id},
					});
				}
				else
				{
					it.$emit("openTab",{
						urlId: 'waybillDetail' + data.id,
						query: {waybillId: data.id},
						urlName: "派车单详情",
						urlPathName: "/detail",
						urlPath: "/pt/ord/waybill/detail/waybillDetail.vue"});
				}
			}else{
				it.$emit('openTab', {
					urlName: '查看月成本',
					urlId: 'storeHouseBillDetail' + new Date().getTime(),
					urlPathName: "/storeHouseBillDetail",
					urlPath: "/pt/fc/storehouse/storeHouseBillDetail.vue",
					query: {type:3,id:data.id},
				});
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
		}
	}
}
