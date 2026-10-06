import tableCommon from "@/components/table/tableCommon.vue";
import myElDatePicker from "@/components/myElDatePicker/index.js";
import enumData from "@/page/pt/enum.js"

export default {
	name: 'wmsPackMaterialBaseManage',
	data()
	{
		return {
			head: [
				{"name": "包材名称", "code": "name", "width": "200", "type": "text"},
				{"name": "包材类型", "code": "typeName", "width": "120", "type": "text"},
				{"name": "管理单位", "code": "unitName", "width": "200", "type": "text"},
				{"name": "备注", "code": "remark", "width": "200", "type": "text"},
				{"name": "创建人", "code": "createUserName", "width": "110", "type": "text"},
				{"name": "创建时间", "code": "createDate", "width": "110", "type": "text"}
			],
			query: this.initQuery(),
			typeData: [],
			unitData: [],
			packMaterialShow: false,
			isOnlySee: false,//是否仅仅查看
			showAddButton: false,
			showUpdateButton: false,
			title: '新增包材',
			packMaterial: this.initPackMaterial(),
		}
	},
	/**
	 * 初始化
	 */
	async mounted()
	{
		await this.initData();
		await this.doQuery();
	},
	/**
	 * 组件
	 */
	components: {
		tableCommon,
		myElDatePicker,
		enumData,
	},
	/**
	 * 绑定函数
	 */
	methods: {
		/**
		 * 列表查询
		 */
		async doQuery(query = this.query)
		{
			await this.$refs.table.load("wmsPackMaterialTF", "queryPackMaterialBasePage", query);
		},
		/**
		 * 初始化静态数据
		 */
		async initData()
		{
			this.typeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WMS_PACK_TYPE"});
			this.unitData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WMS_UNIT"});
		},
		/**
		 * 初始化查询条件
		 * @returns
		 */
		initQuery()
		{
			this.query = {
				name: '',
				type: '',
			};
			return this.query;
		},
		/**
		 * 初始化
		 */
		initPackMaterial()
		{
			return this.packMaterial = {
				name: '',
				type: '',
				unit: '',
				remark: '',
			};
		},
		/**
		 * 双击详情
		 * @param data
		 */
		dblclickItem(data)
		{
			this.showPackMaterial(true, 3, data);
		},
		/**
		 * 控制弹窗
		 * @param flag
		 * @param type 1新增 2修改 3查看
		 * @param data
		 */
		showPackMaterial(flag, type, data)
		{
			this.initPackMaterial();
			if (type === 1)
				this.title = '新增包材';
			else if (type === 2)
			{
				let selectData = this.$refs.table.getSelectItem();
				if (selectData.length !== 1)
				{
					this.$message.error("请选择一条需要修改的包材！");
					return false;
				}
				this.title = '修改包材';
				this.packMaterial = this.common.copyObj(selectData[0]);
			}
			else if (type === 3)
			{
				this.title = '查看包材';
				this.packMaterial = this.common.copyObj(data);
			}
			this.showAddButton = type === 1;
			this.showUpdateButton = type === 2;
			this.isOnlySee = type === 3;//不是查看都是可输入
			this.packMaterialShow = flag;
			this.$forceUpdate();
		},
		/**
		 *
		 */
		async sure(type)
		{
			if (this.common.isBlank(this.packMaterial.name))
			{
				this.$message.error("请输入包材名称！");
				return false;
			}
			if (this.common.isBlank(this.packMaterial.type))
			{
				this.$message.error("请选择包材类型！");
				return false;
			}
			if (this.common.isBlank(this.packMaterial.unit))
			{
				this.$message.error("请选择管理单位！");
				return false;
			}
			await this.common.postUrl("wmsPackMaterialTF", "saveOrUpdatePackMaterial", this.packMaterial, null,null,'',true);
			this.$message.success(type === 1 ? "新增成功！" : "修改成功！");
			this.showPackMaterial(false);
			await this.doQuery();
		},
		/**
		 * 删除包材
		 * @returns {boolean}
		 */
		async deletePackMaterial()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要删除的包材！");
				return false;
			}
			this.$confirm("确认需要删除该包材？", "提示").then(async () =>
			{
				await this.common.postUrl("wmsPackMaterialTF", "deletePackMaterial", selectData[0], null, null, '', true);
				this.$message.success("删除成功！");
				this.showPackMaterial(false);
				await this.doQuery();
			}).catch(() =>{});
		},
	},
}
