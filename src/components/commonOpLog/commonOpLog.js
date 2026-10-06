export default {
	name: 'commonOpLog',
	props: [],
	data()
	{
		return {
			list: [],
			isshowDialog: false,
		}
	},
	mounted()
	{},
	methods: {
		hideDialog()
		{
			this.isshowDialog = false;
		},
		/**
		 * @param id 必传 操作的表主键
		 * @param type 必传 类型 1单据管理日志
		 * @returns {boolean}
		 */
		showDialog(id, type)
		{
			if (this.common.isBlank(id))
			{
				this.$message.error("请传入查询日志的id！");
				return false;
			}
			if (this.common.isBlank(type))
			{
				this.$message.error("请传入查询日志的类型！");
				return false;
			}
		    this.queryOpLogById(id, type);
		},
        /**
         * 通过id查询操作日志
         * @returns {*[]}
         */
        queryOpLogById(id, type)
        {
        	let that = this;
            this.common.postUrl("receiptsTF", "queryOpLogById", {id: id, type: type}, function (data)
			{
				that.list = data;
				that.isshowDialog = that.list.length !== 0;
				if (that.list.length === 0)
				{
					that.$message.error("选择的数据没有操作记录！");
					return false;
				}
			}).then(r =>{

			});
        },
	},
}
