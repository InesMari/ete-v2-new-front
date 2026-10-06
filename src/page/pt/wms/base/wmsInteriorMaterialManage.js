import tableCommon from "@/components/table/tableCommon.vue";
import myElDatePicker from "@/components/myElDatePicker/index.js";
import enumData from "@/page/pt/enum.js"
import selectWork from "@/page/pt/wms/selectWork.vue";

export default {
	name: 'wmsInteriorMaterialManage',
	data()
	{
		return {
			head: [
				{"name": "内材名称", "code": "name", "width": "200", "type": "text"},
				{"name": "到货厂商", "code": "tenantName", "width": "120", "type": "text"},
				{"name": "管理单位", "code": "unitName", "width": "200", "type": "text"},
				{"name": "在库数量", "code": "storagedNums", "width": "120", "type": "text"},
				{"name": "备注", "code": "remark", "width": "200", "type": "text"},
			],
			query: this.initQuery(),
			unitData: [],
			interiorMaterialRecordShow: false,
			interiorMaterialRecord: this.initInteriorMaterialRecord(),
			pickerOptions: enumData.DATE_SHORTCUT_OPTIONS,
			interiorMaterialData:[],//内材数据
			tenantData:[],//到货厂商数据
			opTypeData:[],//登记类型
			showSelWork:false,
		}
	},
	/**
	 * 初始化
	 */
	mounted()
	{
		this.initSelWork();
		this.initData();
		this.doQuery();
	},
	/**
	 * 组件
	 */
	components: {
		tableCommon,
		myElDatePicker,
		enumData,
		selectWork
	},
	/**
	 * 绑定函数
	 */
	methods: {
		initSelWork(){
			this.userInfo = this.common.userInfo();
			if(!this.userInfo.workId){
				this.showSelWork = true;
			}else{
				this.firstIn = false;
				this.doQuery();
			}
		},
		selWork(){
			this.showSelWork = false;
			this.$forceUpdate();
			if(!this.firstIn){
				this.$emit('closeOthers', {});
			}
			this.userInfo = this.common.userInfo();
			this.firstIn = false;
			this.doQuery();
		},
		/**
		 * 列表查询
		 */
		async doQuery(query = this.query)
		{
			await this.$refs.table.load("wmsInteriorMaterialTF", "queryInteriorMaterialPage", query);
		},
		/**
		 * 初始化静态数据
		 */
		async initData()
		{
			this.unitData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WMS_UNIT"});
			this.opTypeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WMS_INTERIOR_OP_TYPE"});
			await this.initData2();
		},
		/**
		 * 初始化静态数据
		 */
		async initData2()
		{
			this.interiorMaterialData = await this.common.postUrl("wmsInteriorMaterialTF", "queryInteriorMaterialBaseList", {});
			this.tenantData = await this.common.postUrl("wmsTenantTF", "queryArrivalManufacturerTenantList", {isLoadETE: 1});
		},
		/**
		 * 初始化查询条件
		 * @returns
		 */
		initQuery()
		{
			this.query = {
				name: '',
				tenantName: '',
				type: '',
			};
			return this.query;
		},
		/**
		 * 初始化
		 */
		initInteriorMaterialRecord()
		{
			return this.interiorMaterialRecord = {
				pId: '',
				fromTenantId: '',
				nums: '',
				opType: '',
				realDate: '',
				remark: '',
			};
		},
		/**
		 * 控制弹窗
		 * @param flag
		 * @param data
		 */
		async showInteriorMaterialRecord(flag)
		{
			this.initInteriorMaterialRecord();
			await this.initData2();
			this.interiorMaterialRecordShow = flag;
			this.$forceUpdate();
		},

		/**
		 * 跳转
		 * @returns {boolean}
		 */
		go(type)
		{
			let selectData = this.$refs.table.getSelectItem();
			let name = "";
			if (selectData.length === 1)
				name = selectData[0].name;
			if (type === 1)
			{
				this.$emit("openTab",{
					urlId: 'interiorMaterialBase',
					query: {pId: 1005045},
					urlName: "内材维护",
					urlPathName: "/interiorMaterialBase",
					urlPath: "/pt/wms/base/wmsInteriorMaterialBaseManage.vue"});
			}
			else
			{
				this.$emit("openTab",{
					urlId: 'interiorMaterialLog',
					query: {name: name},
					urlName: "内材记录",
					urlPathName: "/interiorMaterialLog",
					urlPath: "/pt/wms/base/wmsInteriorMaterialLogManage.vue"});
			}
		},
		/**
		 * 刷新
		 */
		forceUpdate()
		{
			this.$forceUpdate();
		},
		/**
		 * 内材登记
		 */
		async sureRecord()
		{
			if (this.common.isBlank(this.interiorMaterialRecord.pId))
			{
				this.$message.error("请选择内材名称！");
				return false;
			}
			if (this.common.isBlank(this.interiorMaterialRecord.fromTenantId))
			{
				this.$message.error("请选择到货厂商！");
				return false;
			}
			if (this.common.isBlank(this.interiorMaterialRecord.nums))
			{
				this.$message.error("请输入数量！");
				return false;
			}
			if (this.common.isBlank(this.interiorMaterialRecord.opType))
			{
				this.$message.error("请选择登记类型！");
				return false;
			}
			if (this.common.isBlank(this.interiorMaterialRecord.realDate))
			{
				this.$message.error("请选择实际日期！");
				return false;
			}
			await this.common.postUrl("wmsInteriorMaterialTF", "interiorMaterialRegister", this.interiorMaterialRecord, null,null,'',true);
			this.$message.success("登记成功！");
			this.showInteriorMaterialRecord(false);
			await this.doQuery();
		},
	},
}
