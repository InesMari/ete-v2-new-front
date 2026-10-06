import fileViewer from "@/components/myFile/file-viewer.vue";

export default {
	name: 'payOrderOpLog',
	data()
	{
		return {
			opLogData: [],
			srcList: [],
		}
	},
	async mounted()
	{
		await this.loadOpLog();
	},
	components: {
		fileViewer,
	},
	methods: {
		/**
		 * 加载操作日志
		 */
		async loadOpLog()
		{
			this.opLogData = await this.common.postUrl("fcPayTF", "loadOpLog", this.$route.query);
		},
	},
}
