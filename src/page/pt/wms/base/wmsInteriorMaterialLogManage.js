import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";

export default {
	name: 'wmsInteriorMaterialLogManage',
	data()
	{
		return {
			head: [
				{"name": "内材名称", "code": "name", "width": "200", "type": "text"},
				{"name": "到货厂商", "code": "tenantName", "width": "120", "type": "text"},
				{"name": "登记数量", "code": "nums", "width": "120", "type": "text"},
				{"name": "登记类型", "code": "opTypeName", "width": "120", "type": "text"},
				{"name": "实际时间", "code": "realDate", "width": "200", "type": "text"},
				{"name": "登记人", "code": "createUserName", "width": "180", "type": "text"},
				{"name": "登记时间", "code": "createDate", "width": "180", "type": "text"},
			],
			query: this.initQuery(this.$route.query.name),
			pickerOptions: enumData.DATE_RANGE_SHORTCUT_OPTIONS,
		}
	},
	/**
	 * 初始化
	 */
	async mounted()
	{
		await this.initData();
		await this.doQuery();
	},
	/**
	 * 组件
	 */
	components: {
		tableCommon,
		enumData,
	},
	/**
	 * 绑定函数
	 */
	methods: {
		/**
		 * 列表查询
		 */
		async doQuery(query = this.query)
		{
			if(this.common.isNotBlank(this.query.date) && this.query.date.length === 2){
				query.beginDate = this.query.date[0];
				query.endDate = this.query.date[1];
			}else{
				query.beginDate = '';
				query.endDate = '';
			}
			await this.$refs.table.load("wmsInteriorMaterialTF", "queryInteriorMaterialLogPage", query);
		},
		/**
		 * 初始化静态数据
		 */
		async initData()
		{
		},
		/**
		 * 初始化查询条件
		 * @returns
		 */
		initQuery(name)
		{
			this.query = {
				name: name,
				tenantName: '',
				date: '',
			};
			return this.query;
		},
	},
}
