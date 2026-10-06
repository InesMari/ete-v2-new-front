import innerTab from "@/components/innerTab/innerTab.vue"
import tableCommon from "@/components/table/tableCommon.vue";
import waybillLog from "@/page/pt/ord/waybill/detail/subpage/waybillLog.vue";
import orderStock from "@/page/pt/ord/waybill/detail/subpage/orderStock.vue";
import waybillInfo from "@/page/pt/ord/waybill/detail/subpage/waybillInfo.vue";
import feeInfo from "@/page/pt/ord/waybill/subpage/feeInfo.vue";
import workInfo from "@/page/pt/ord/waybill/detail/subpage/workInfo.vue";
import receipts from "@/page/pt/ord/waybill/detail/subpage/receipts.vue";
import modifyRecord from "@/page/pt/ord/waybill/detail/subpage/modifyRecord.vue";
import mapTrack from "@/components/mapTrack/mapTrack.vue";

export default {
	name: 'waybillDetail',
	data()
	{
		return {
			tabs: [
				{name: "派车单详情", active: true,type:1,},
				{name: "操作日志",type:2,},
				{name: "修改记录",type:3,},
				{name: "车辆轨迹",type:4,},
			],
			showType: 1,
			data:{
				waybillInfo:{},
				workInfoList:[],
				receiptList:[]
			},
		}
	},
	mounted()
	{
		this.queryWaybillInfo();
	},
	components: {
		innerTab,
		tableCommon,
		waybillLog,
		orderStock,
		waybillInfo,
		feeInfo,
		workInfo,
		receipts,
		modifyRecord,
		mapTrack
	},
	methods:{
		async queryWaybillInfo(){
			let data = await this.common.postUrl("ordWaybillTF", "queryWaybillInfo", this.$route.query);
			//基础数据
			this.data = data;
			this.$forceUpdate();
			this.$nextTick(() => {
				this.$refs.orderStock.init();
				this.$refs.waybillInfo.init();
			});
		},




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
