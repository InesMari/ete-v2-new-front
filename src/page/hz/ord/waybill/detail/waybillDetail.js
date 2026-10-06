import waybillLog from "@/page/hz/ord/waybill/detail/subpage/waybillLog.vue";
import mapTrack from "@/components/mapTrack/mapTrack.vue";

export default {
	name: 'waybillDetail',
	data()
	{
		return {
			data:{
				opLogList:[],
			}
		}
	},
	mounted()
	{
		this.queryWaybillInfo();
	},
	components: {
		waybillLog,
		mapTrack
	},
	methods:{
		async queryWaybillInfo(){
			let data = await this.common.postUrl("ordWaybillTF", "queryOpLogList", this.$route.query);
			//基础数据
			this.data = data;
			this.$forceUpdate();
		},

		async doQuery()
		{
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
