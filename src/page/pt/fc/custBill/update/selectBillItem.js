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
		initData(data,tabId)
		{
			if (tabId === enumData.FC_CUST_BILL_ITEM_TYPE.ORDER)
			{
				this.$refs.orderListTable.setRightData(data);//
			}
			else if (tabId === enumData.FC_CUST_BILL_ITEM_TYPE.STOREHOUSE)
			{
				this.$refs.storehouseListTable.setRightData(data);
			}
			else if (tabId === enumData.FC_CUST_BILL_ITEM_TYPE.PROJECTSUNDRY)
			{
				this.$refs.projectsundryListTable.setRightData(data);
			}
			else if (tabId === enumData.FC_CUST_BILL_ITEM_TYPE.PACKLEASE)
			{
				this.$refs.packLeaseListTable.setRightData(data);
			}
			// else if (tabId === enumData.FC_CUST_BILL_ITEM_TYPE.BILLSUPPLEMENT)
			// {
			// 	this.$refs.billSupplementListTable.setRightData(data);
			// }
		},
	},

}
