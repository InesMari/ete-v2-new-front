import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
	name: 'overdueFeeDetailReport',
	data()
	{
		return {
			head:this.initBaseHead(),
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
		initBaseHead() {
			return [
				{"name": "客户名称", "code": "tenantName", "width": "200", "type": "text","isFix":true},
				{"name": "结算主体", "code": "settleBodyName", "width": "200", "type": "text","isFix":true},
				{"name": "销售经理", "code": "custManageUserName", "width": "150", "type": "text","isFix":true},
				{"name": "总计", "code": "overdueFee", "width": "90", "type": "text","currencyFlag":true,"isFix":true},
			];
		},
		async doQuery(query = this.query) {
			this.query = query;
			let headList = await this.common.postUrl("rptFeeReportTF", "getHeader", this.query);
			let head = this.initBaseHead();
			headList.forEach(item => {
				head.push({"name": item.name, "code": item.code, "width": "90", "type": "text","currencyFlag":true})
			})
			this.head = head;
			this.$refs.table.load("rptFeeReportTF", "queryOverdueFeeDetailReportPage", this.query);
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
			this.$refs.table.downloadExcelFile('逾期明细汇总表');
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
