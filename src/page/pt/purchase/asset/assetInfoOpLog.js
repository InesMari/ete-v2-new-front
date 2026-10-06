
export default {
	name: 'assetInfoOpLog',
	data()
	{
		return {
			opLogData: [],
		}
	},
	async mounted()
	{
		await this.loadOpLog();
	},
	components: {
	},
	methods: {
		/**
		 * 加载操作日志
		 */
		async loadOpLog()
		{
			this.opLogData = await this.common.postUrl("assetTF", "loadOpLog", this.$route.query);
		},

	},
}
