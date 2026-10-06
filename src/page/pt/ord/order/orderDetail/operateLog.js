import fileViewer from "@/components/myFile/file-viewer.vue";

export default {
	name: 'operateLog',
	data()
	{
		return {
			opLogData: [],
			srcList: [],
		}
	},
	async mounted()
	{
		await this.loadOrderModifyRecordData();
	},
	components: {
		fileViewer,
	},
	methods: {
		/**
		 * 加载订单操作日志
		 */
		async loadOrderModifyRecordData()
		{
			this.opLogData = await this.common.postUrl("orderTF", "loadOrderOpLogData", {orderId: this.$route.query.orderId});
		},
		/**
		 * 跳转
		 * @param e
		 */
		toOrder(e)
		{
			if (e.target.nodeName === 'A')
			{
				let wId = e.currentTarget.dataset.id;
				let isTransit = e.currentTarget.dataset.type;
				let waybillNum = e.currentTarget.dataset.num;
				
				if (isTransit == 1)
				{
					this.$emit('openTab', {
						urlName: '查看中转',
						urlId: 'transitManage',
						urlPathName: "/order",
						urlPath: "/pt/ord/transit/transitDetailMain",
						query:{t:3,waybillNum: waybillNum, tansitWaybillId: wId},
					});
				}
				else
				{
					this.$emit("openTab",{
						urlId: 'waybillDetail' + wId,
						query: {waybillId: wId},
						urlName: "派车单详情",
						urlPathName: "/detail",
						urlPath: "/pt/ord/waybill/detail/waybillDetail.vue"});
				}
			}
			else if(e.target.nodeName === 'IMG')
			{
				if(this.common.isBlank(e.target.name))
				{
					this.$message.error("没有图片~");
					return;
				}
				if (!e.target.name.startsWith("http"))
				{
					this.$message.error("图片无法展示！");
					return false;
				}
				this.srcList=[];
				this.srcList.push(e.target.name);
				this.$refs.viewer.show();
			}
		},
	},
}
