import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum.js"
import searchList from "@/components/searchList/searchList.vue";

export default {
	name: 'scheduleTodoManage',
	data()
	{
		return {
			head: [
				{"name": "线路名称", "code": "routeName", "width": "180", "type": "text"},
				{"name": "出发地所属城市", "code": "beginCityName", "width": "200", "type": "text"},
				{"name": "目的地所属城市", "code": "endCityName", "width": "200", "type": "text"},
				{"name": "计划订单未匹配数", "code": "count", "width": "120", "type": "diy"},
				{"name": "状态", "code": "stateName", "width": "100", "type": "text"},
			],
			query: this.initQuery(),
		}
	},
	/**
	 * 初始化
	 */
	mounted()
	{
		this.$nextTick(() => {
			this.doQuery();//初始化查询条件再查询
		})
	},
	/**
	 * 组件
	 */
	components: {
		tableCommon,
		searchList,
	},
	/**
	 * 绑定函数
	 */
	methods: {
		/**
		 * 列表查询
		 */
		async doQuery(query=this.query)
		{
			this.query = query;
			await this.$refs.table.load("scheduleService", "queryUnMatchListGroupByRouteId", this.query);
		},
		initQuery()
		{
			this.query = {
				beginCityName: '',
				endCityName: '',
				routeName: '',
				fromHome: this.$route.query.fromHome,
			};
			return this.query;
		},
		/**
		 * 动态运力匹配
		 */
		gotoScheduleManage(item)
		{
			this.$emit('openTab', {
				urlId: '1003070',
				query: {isMatch: 0, routeName: item.routeName},
				urlName: "订单计划管理",
				urlPathName: "/scheduleManage",
				urlPath: "/pt/ord/scheduleManage.vue"});
		},
	},
	computed:{
		formData(){
			return [
				{"name":"起始地所属区域","model":"beginCityName","type":"input","placeholder":"请输入起始地所属区域","isshow":true},
				{"name":"目的地所属区域","model":"endCityName","type":"input","placeholder":"请输入目的地所属区域","isshow":true},
				{"name":"线路名称","model":"routeName","type":"input","placeholder":"线路名称","isshow":true},
			]
		}
	},
}