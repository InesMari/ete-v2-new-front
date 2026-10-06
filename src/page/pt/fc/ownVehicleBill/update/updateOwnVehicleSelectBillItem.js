import innerTab from "@/components/innerTab/innerTab.vue";
import dbTable from "@/components/dbTable/dbTable.vue"
import enumData from "@/page/pt/enum.js"
import commonOwnVehicleSelectBillItem from "../commonOwnVehicleSelectBillItem.js"

export default {
	name: 'updateOwnVehicleSelectBillItem',
	mixins: [commonOwnVehicleSelectBillItem],
	data()
	{
		return {
			query: this.initQuery(),
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
		/**
		 * 初始化查询条件
		 */
		initQuery()
		{
			return this.query = {
				billId: this.$route.query.billId,
				waybillNum: '',
				tenantName: this.common.isBlank(this.tenantName) ? '' : this.tenantName,
				endCarDate: '',
				driverName: '',
				plateNumber: '',
				tenantId: this.common.isBlank(this.tenantId) ? '' : this.tenantId,
				flag: 2
			};
		},
	},

}
