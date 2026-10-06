import tableCommon from "@/components/table/tableCommon.vue"

export default {
	name: 'transitTrackRecord',
	data()
	{
		return {
			head: [
				{"name": "跟踪节点", "code": "TRANSIT_OP_NODE_NAME", "width": "200", "type": "text"},
				{"name": "实际时间", "code": "ACTUAL_TIME", "width": "200", "type": "text"},
				{"name": "跟踪内容", "code": "OP_CONTENT", "width": "200", "type": "text"},
				{"name": "定位", "code": "LOCATION", "width": "200", "type": "text"},
				{"name": "操作人", "code": "OP_USER_NAME", "width": "100", "type": "text"},
				{"name": "操作时间", "code": "OP_DATE", "width": "100", "type": "text"},
			],
		}
	},
	mounted()
	{
		this.refreshOrdWaybillTransitLog();
	},
	components: {
		tableCommon,
	},
	methods: {

		/**
		 * 获取中转日志列表数据
		 * @param wayBillId
		 * @param dispatchId
		 */
		refreshOrdWaybillTransitLog() {
			let waybillId = this.$route.query.tansitWaybillId;
			let param = {waybillId: waybillId, dispatchId: -1};
			this.$refs.table.load("ordWaybillTransitLogTF", "queryOrdWaybillTransitLogPage", param);
		},
	},
}
