import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
	name: 'receivableDetailReport',
	data()
	{
		return {
			head: [
				{"name": "账单编号", "code": "billNum", "width": "120", "type": "text"},
				{"name": "结算主体", "code": "settleBodyName", "width": "200", "type": "text"},
				{"name": "销售经理", "code": "custManageUserName", "width": "150", "type": "text"},
				{"name": "账单月份", "code": "billMonth", "width": "120", "type": "text"},
				{"name": "发票申请编号", "code": "applyInvoiceNum", "width": "120", "type": "text"},
				{"name": "发票号", "code": "invoiceNum", "width": "220", "type": "text"},
				{"name": "开票日期", "code": "invoiceDate", "width": "110", "type": "text"},
				{"name": "合同客户名称", "code": "tenantName", "width": "200", "type": "text"},
				{"name": "购买方名称", "code": "custTenantName", "width": "200", "type": "text"},
				{"name": "应收金额", "code": "applyInvoiceFee", "width": "90", "type": "text","currencyFlag":true},
				{"name": "已收金额", "code": "receivedFee", "width": "90", "type": "text","currencyFlag":true},
				{"name": "未收金额", "code": "noReceiveFee", "width": "90", "type": "text","currencyFlag":true},
				{"name": "账期", "code": "accountPeriod", "width": "90", "type": "text"},
				{"name": "最后收款日期", "code": "lastReceiveDate", "width": "110", "type": "text"},
				{"name": "是否逾期", "code": "isOverdueName", "width": "90", "type": "text"},
				{"name": "逾期金额", "code": "overdueFee", "width": "90", "type": "text","currencyFlag":true},
				{
					"name": "超期应收账龄", "width": "480", "type": "text",
					"children": [
						{"name": "0-30天", "code": "fee30", "width": "80", "type": "text","currencyFlag":true},
						{"name": "31-60天", "code": "fee60", "width": "80", "type": "text","currencyFlag":true},
						{"name": "61-90天", "code": "fee90", "width": "80", "type": "text","currencyFlag":true},
						{"name": "91-180天", "code": "fee180", "width": "80", "type": "text","currencyFlag":true},
						{"name": "181-360天", "code": "fee360", "width": "80", "type": "text","currencyFlag":true},
						{"name": "360天以上", "code": "fee", "width": "80", "type": "text","currencyFlag":true},
					]
				},
			],
			query: this.initQuery(),
			overdueData: [],
			settleBodyData:[],
		}
	},
	/**
	 * 初始化
	 */
	mounted()
	{
        this.init();
		this.doQuery();
	},
	/**
	 * 组件
	 */
	components: {
		tableCommon,
		searchList
	},
	/**
	 * 绑定函数
	 */
	methods: {
        init()
        {
            let that = this;
            this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"}, function (data)
            {
                that.overdueData = data;
            });
			this.common.postUrl("commonTF", "getSysStaticData", {codeType: "INVOICING_COMPANY"}, function (data) {
				that.settleBodyData = data;
			});
        },
		doQuery(query=this.query)
		{
			this.query=query;
			if (this.common.isNotBlank(this.query.invoiceDate) && this.query.invoiceDate.length === 2)
			{
				this.query.beginInvoiceDate = this.query.invoiceDate[0];
				this.query.endInvoiceDate = this.query.invoiceDate[1];
			} else
			{
				this.query.beginInvoiceDate = '';
				this.query.endInvoiceDate = '';
			}
			if (this.common.isNotBlank(this.query.lastReceiveDate) && this.query.lastReceiveDate.length === 2)
			{
				this.query.beginLastReceiveDate = this.query.lastReceiveDate[0];
				this.query.endLastReceiveDate = this.query.lastReceiveDate[1];
			} else
			{
				this.query.beginLastReceiveDate = '';
				this.query.endLastReceiveDate = '';
			}
            if (this.common.isNotBlank(this.$route.query.isFromSystemData))
            {
                this.query.isFromSystemData = this.$route.query.isFromSystemData;
                this.query.systemDataParam = this.$route.query.systemDataParam;
            }
			this.$refs.table.load("rptFeeReportTF", "queryReceivableDetailReportPage", this.query);
		},
		initQuery()
		{
			return this.query = {
				billNum: '',
				billMonth: '',
				applyInvoiceNum: '',
				invoiceNum: '',
				invoiceDate: '',
				tenantName: '',
				isOverdue: '',
				lastReceiveDate:'',
			};
		},
		download()
		{
			let queryUrl = 'rptFeeReportTF|queryReceivableDetailReportPage';
			let excelKeys='';
			let excelLables = '';

			for(let el of this.head){
				excelLables+=','+el.name;
				if(el.code){
					excelKeys+=','+el.code;
				}else{
					el.children.forEach(m=>{
						excelKeys+=','+m.code;
					})
				}
			}

			if(excelKeys.length>0){
				excelKeys=excelKeys.substr(1);
			}
			if(excelLables.length>0){
				excelLables=excelLables.substr(1);
			}
			let param = this.query;
			param.templateName = "receivableDetailReport.xls";
			param.templateUrl = 'rptFeeReportTF|initReceivableDetailReportExcelHead';
			param.templateStartRow = 2;
			this.common.downloadExcelFile(queryUrl,param,excelLables,excelKeys,'应收明细列表','receivableDetailReportTable');
		},
		/**
		 * 确认账单的明细
		 */
		toCustomerConfirmedBillDetail(data)
		{
			this.$emit('openTab', {
				urlName: '账单明细',
				urlId: 'confirmBillDetail_' + data.fcBillId,
				urlPathName: "/fc",
				urlPath: "/pt/fc/custBill/detail/confirmBillDetail.vue",
				query: {billId: data.fcBillId, flag: 1,unShowCheck: 1,},
			});
		},
	},
	computed:{
		formData(){
			return [
				{"name":"账单编号","placeholder":"账单编号","model":"billNum","type":"input","isshow":true},
				{"name":"账单月份","placeholder":"账单月份","model":"billMonth","type":"month","isshow":true},
				{"name":"发票申请编号","placeholder":"发票申请编号","model":"applyInvoiceNum","type":"input","isshow":true},
				{"name":"发票号","placeholder":"发票号","model":"invoiceNum","type":"input","isshow":true},
				{"name":"开票日期","model":"invoiceDate","type":"daterange","isshow":true},
				{"name":"合同客户名称","placeholder":"合同客户名称","model":"tenantName","type":"input","isshow":true},
				{"name":"是否逾期","model":"isOverdue","type":"select","options":this.overdueData,"label":"codeName","value":"codeValue","clearable":true,"filterable":true,"method":"doQuery","isshow":true},
				{"name":"结算主体","model":"settleBody","type":"select","options":this.settleBodyData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
				{"name":"销售经理","model":"custManageUserName","type":"input","placeholder":"销售经理","isshow":true},
				{"name":"最后收款日期","model":"lastReceiveDate","type":"daterange","isshow":true},
			]
		}
	},
}
