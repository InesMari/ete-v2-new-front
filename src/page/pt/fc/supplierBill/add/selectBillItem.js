import innerTab from "@/components/innerTab/innerTab.vue";
import dbTable from "@/components/dbTable/dbTable.vue"
import enumData from "@/page/pt/enum.js"
import commonSelectBillItem from "../commonSelectBillItem.js"

export default {
	name: 'selectBillItem',
	mixins: [commonSelectBillItem],
	data()
	{
		return {
			enumData: enumData,
		}
	},
	mounted()
	{

	},
	components: {
		innerTab,
		dbTable,
		enumData,
	},
	methods: {

	},

}
