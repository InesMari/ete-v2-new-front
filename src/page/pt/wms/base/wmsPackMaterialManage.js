import tableCommon from "@/components/table/tableCommon.vue";
import myElDatePicker from "@/components/myElDatePicker/index.js";
import enumData from "@/page/pt/enum.js"
import selectWork from "@/page/pt/wms/selectWork.vue";

export default {
	name: 'wmsPackMaterialManage',
	data()
	{
		return {
			head: [
				{"name": "器具名称", "code": "deviceName", "width": "150", "type": "text"},
				{"name": "器具规格", "code": "spec", "width": "150", "type": "text"},
				{"name": "所属人", "code": "srcTenantName", "width": "200", "type": "text"},
				{"name": "使用客户", "code": "tenantName", "width": "200", "type": "text"},
				{"name": "在库数量", "code": "innerNums", "width": "130", "type": "text"},
				{"name": "客户处数量", "code": "outterNums", "width": "130", "type": "text"},
				{"name": "未回收数量", "code": "reoveryNums", "width": "130", "type": "text"},
			],
			query: this.initQuery(),
			typeData: [],
			showSelWork:false,
		}
	},
	mounted()
	{
		this.initSelWork();
		this.doQuery();
		this.initData();
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
		async doQuery()
		{
			let query = this.query;
			query.isLoadWork = 1;//加载当前仓库的数据
			await this.$refs.table.load("stockDeviceService", "queryDeviceStockPage", query);
		},
		/**
		 * 初始化静态数据
		 */
		async initData()
		{
			this.typeData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WMS_PACK_TYPE"});
		},
		/**
		 * 初始化查询条件
		 * @returns
		 */
		initQuery()
		{
			return this.query = {
				deviceName: '',
				tenantName: '',
			};
		},
		go(type)
		{
			if (type === 0)
			{
				this.$emit("openTab",{
					urlId: 'deviceRegisterRecordManage',
					query: {},
					urlName: "器具登记/操作明细",
					urlPathName: "/device",
					urlPath: "/pt/device/record/deviceRegisterRecordManage.vue"});
			}
			else if (type === 2)
			{
				this.$emit("openTab",{
					urlId: 'wmsPackMaterialRegister' + new Date().getTime(),
					query: {},
					urlName: "器具登记",
					urlPathName: "/wms",
					urlPath: "/pt/wms/base/packMaterial/wmsPackMaterialRegister.vue"});
			}
			else if (type === 3)
			{
				this.$emit("openTab",{
					urlId: 'wmsPackMaterialRecordManage',
					query: {},
					urlName: "包材记录",
					urlPathName: "/wms",
					urlPath: "/pt/wms/base/packMaterial/wmsPackMaterialRecordManage.vue"});
			}
		},
		// gotoLog()
		// {
		// 	let selectData = this.$refs.table.getSelectItem();
		// 	if (selectData.length != 1) {
		// 		this.$message.error("请选择一条数据！");
		// 		return;
		// 	}
		// 	let data = selectData[0];
		// 	this.$emit("openTab",{
		// 		urlId: 'reservoir' + 'Detail' + data.ids,
		// 		query: {
		// 			logId: data.ids,
		// 			logType: enumData.LOG_TYPE.RESERVOIR,
		// 		},
		// 		urlName: "器具库存" + "操作日志",
		// 		urlPathName: "/operateLog",
		// 		urlPath: "/pt/operateLog/operateLog.vue"});
		// },
	},
}
