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
			equipmentFocus:false,    //订单号是否获取焦点
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
		/** 设备号获取/失去焦点 */
		setEquipmentFocus(){
			this.equipmentFocus = this.equipmentFocus?false:true;
		},
	},

}
