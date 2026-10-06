import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
	name: 'meetOverdueFeeDetailReport',
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
			this.common.postUrl("commonTF", "getSysStaticData", {codeType: "PAY_TITLE"}, function (data) {
				that.settleBodyData = data;
			});
        },
		initBaseHead() {
			return [
				{"name": "供应商名称", "code": "supplierName", "width": "200", "type": "text","isFix":true},
				{"name": "结算主体", "code": "settleBodyName", "width": "200", "type": "text","isFix":true},
				{"name": "总计", "code": "overdueFee", "width": "90", "type": "text","currencyFlag":true,"isFix":true},
			];
		},
		async doQuery(query = this.query) {
			this.query = query;
			let headList = await this.common.postUrl("rptFeeReportTF", "getMeetHeader", this.query);
			let head = this.initBaseHead();
			headList.forEach(item => {
				head.push({"name": item.name, "code": item.code, "width": "90", "type": "text","currencyFlag":true})
			})
			this.head = head;
			this.$refs.table.load("rptFeeReportTF", "queryMeetOverdueFeeDetailReportPage", this.query);
		},
		initQuery()
		{
			return this.query = {
				supplierName: '',
				settleBody:'',
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
				{"name":"供应商名称","placeholder":"供应商名称","model":"supplierName","type":"input","isshow":true},
				{"name":"结算主体","model":"settleBody","type":"select","options":this.settleBodyData,"label":"codeName","value":"codeValue","clearable":true,"method":"doQuery","isshow":true},
			]
		}
	},
}
