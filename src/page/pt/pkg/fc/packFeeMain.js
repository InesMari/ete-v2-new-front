import innerTab from "@/components/innerTab/innerTab.vue"
import packIncomeManage from "@/page/pt/pkg/fc/packIncomeManage.vue";
import packCostManage from "@/page/pt/pkg/fc/packCostManage.vue";

export default {
	name: 'packFeeMain',
	data()
	{
		return {
			tabs: [
				{name: "收入", active: true,type:1,},
				{name: "成本",type:2,},
			],
			showType: 1,
		}
	},
	mounted()
	{
		this.$refs.packIncomeManage.init();
		this.$refs.packCostManage.init();
		this.$refs.packIncomeManage.doQuery();
	},
	components: {
		innerTab,
		packIncomeManage,
		packCostManage
	},
	methods:{
		async doQuery()
		{
		},
		selectCallback(data)
		{
			this.tab = data;
			this.showType = data.type;
		},
		/**
		 * 关闭当前页面
		 */
		closePage()
		{
			this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId)
		},
	},

}
