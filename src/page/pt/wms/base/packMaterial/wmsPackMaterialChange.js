import enumData from "@/page/pt/enum.js"

export default {
	name: 'wmsPackMaterialChange',
	data()
	{
		return {
			record: {},
			feeList:[],
			costList: [],
			changeList:[],
			show: this.$route.query.type != 0,
		}
	},
	/**
	 * 初始化
	 */
	mounted()
	{
		this.initData();
	},
	/**
	 * 组件
	 */
	components: {
		enumData,
	},
	/**
	 * 绑定函数
	 */
	methods: {
		/**
		 * 初始化静态数据
		 */
		async initData()
		{
			let data = await this.common.postUrl("wmsPackMaterialTF", "loadPackMaterialRegisterByRecordId", {recordId: this.$route.query.recordId});
			this.record = data.record;
			this.feeList = data.feeList;
			this.costList = data.costList;

			this.changeList = data.changeList;
			if (data.changeList.length > 0)
			{
				let totalFee = 0;
				for (let i = 0; i < data.changeList.length; i++)
				{
					let item = data.changeList[i];
					if (item.verifyState == 1)
					{
						if (this.common.isNotBlank(item.totalFee))
							totalFee = this.common.accAdd(totalFee, item.totalFee);
					}
				}
				this.cost.totalFee = this.common.accAdd(totalFee, this.cost.totalFee);
			}
			this.$forceUpdate();
		},
		/**
		 * 包材登记异动
		 */
		async saveChange()
		{
			if (this.common.isBlank(this.cost.fee))
			{
				this.$message.error("请填写异动金额！");
				return false;
			}
			this.cost.recordId = this.$route.query.recordId;
			await this.common.postUrl("wmsPackMaterialTF", "savePackMaterialChange", this.cost, null,null,'',true);
			this.$message.success("异动成功！");
			this.closePage(false);
		},
		calc()
		{
			if (isNaN(this.cost.fee))
				return;
			let totalFee = 0
			if (this.common.isNotBlank(this.cost.totalFee))//有成本
			{
				totalFee = this.common.accAdd(this.cost.totalFee, this.cost.fee);
			}
			else
			{
				totalFee = this.cost.fee;
			}
			this.cost.afterFee = totalFee;
			this.$forceUpdate();
		},
		closePage()
		{
			this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId,true)
		},
	},
}
