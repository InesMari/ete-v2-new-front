import tableCommon from "@/components/table/tableCommon.vue"

export default {
	name: 'modifyRecord',
	data()
	{
		return {
			head: [
				{"name": "修改模块", "code": "modifyModel", "width": "100", "type": "text"},
				{"name": "修改内容", "code": "modifyField", "width": "100", "type": "text"},
				{"name": "旧值", "code": "beforeValue", "width": "200", "type": "text"},
				{"name": "新值", "code": "afterValue", "width": "200", "type": "text"},
				{"name": "操作时间", "code": "createDate", "width": "150", "type": "text"},
				{"name": "操作人", "code": "createUserName", "width": "100", "type": "text"},
			],
		}
	},
	mounted()
	{
		this.loadModifyRecordData();
	},
	components: {
		tableCommon,
	},
	methods: {
		/**
		 * 加载订单修改记录
		 */
		loadModifyRecordData()
		{
			this.$refs.table.load("modifyRecordTF", "loadWaybillModifyRecordData", {waybillId: this.$parent.$route.query.waybillId});
		},
	},
}
