import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
	name: 'receivableTotalReport',
	data()
	{
		return {
			head: [
				{"name": "客户名称", "code": "tenantName", "width": "200", "type": "text"},
				{"name": "结算主体", "code": "settleBodyName", "width": "200", "type": "text"},
				{"name": "销售经理", "code": "custManageUserName", "width": "150", "type": "text"},
				{"name": "应收金额", "code": "applyInvoiceFee", "width": "90", "type": "text","currencyFlag":true},
				{"name": "已收金额", "code": "receivedFee", "width": "90", "type": "text","currencyFlag":true},
				{"name": "未收金额", "code": "noReceiveFee", "width": "90", "type": "text","currencyFlag":true},
				{"name": "未逾期", "width": "90", "type": "text",
					"children":[
						{"name": "账期内", "code": "noOverdueFee", "width": "90", "type": "text","currencyFlag":true},
					]
				},
				{
					"name": "逾期金额", "width": "560", "type": "text",
					"children": [
						{"name": "逾期合计", "code": "overdueFee", "width": "80", "type": "text","currencyFlag":true},
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
			this.common.postUrl("commonTF", "getSysStaticData", {codeType: "INVOICING_COMPANY"}, function (data) {
				that.settleBodyData = data;
			});
        },
		doQuery(query=this.query)
		{
			this.query=query;
			this.$refs.table.load("rptFeeReportTF", "queryReceivableTotalReportPage", this.query);
		},
		initQuery()
		{
			return this.query = {
				tenantName: '',
				settleBody:'',
				custManageUserName:'',
			};
		},
		download()
		{
			let queryUrl = 'rptFeeReportTF|queryReceivableTotalReportPage';
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
			param.templateName = "receivableTotalReport.xls";
			param.templateUrl = 'rptFeeReportTF|initReceivableTotalReportTableExcelHead';
			param.templateStartRow = 2;
			this.common.downloadExcelFile(queryUrl,param,excelLables,excelKeys,'应收汇总表','receivableTotalReportTable');
		},
	},
	computed:{
		formData(){
			return [
				{"name":"客户名称","placeholder":"客户名称","model":"tenantName","type":"input","isshow":true},
				{"name":"结算主体","model":"settleBody","type":"select","options":this.settleBodyData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
				{"name":"销售经理","model":"custManageUserName","type":"input","placeholder":"销售经理","isshow":true},
			]
		}
	},
}
