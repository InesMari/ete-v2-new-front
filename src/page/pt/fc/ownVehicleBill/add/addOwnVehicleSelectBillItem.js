import innerTab from "@/components/innerTab/innerTab.vue";
import dbTable from "@/components/dbTable/dbTable.vue"
import enumData from "@/page/pt/enum.js"
import commonOwnVehicleSelectBillItem from "../commonOwnVehicleSelectBillItem.js"

export default {
	name: 'addOwnVehicleSelectBillItem',
	mixins: [commonOwnVehicleSelectBillItem],
	data()
	{
		return {

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
