import tableCommon from "@/components/table/tableCommon.vue";
import myElDatePicker from "@/components/myElDatePicker/index.js";
import enumData from "@/page/pt/enum.js"
import selectWork from "@/page/pt/wms/selectWork.vue";

export default {
	name: 'outDeviceStockManege',
	data()
	{
		return {
			head: [
				{"name": "器具名称", "code": "deviceName", "width": "200", "type": "text"},
				{"name": "器具规格", "code": "spec", "width": "110", "type": "text"},
				{"name": "使用客户", "code": "tenantName", "width": "110", "type": "text"},
				{"name": "在库数量", "code": "innerNums", "width": "110", "type": "text"},
				{"name": "客户处数量", "code": "outterNums", "width": "110", "type": "text"},
				{"name": "未回收数量", "code": "reoveryNums", "width": "110", "type": "text"},
			],
			query: this.initQuery(),
			typeData: [],
			showSelWork:false,
		}
	},
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
			query.type = 2;//客户器具
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
		open(type)
		{
			if (type == 1)
			{
				this.$emit("openTab",{
					urlId: 'outDeviceManage' + new Date().getTime(),
					query: {},
					urlName: "客户器具维护",
					urlPathName: "/outDeviceManage",
					urlPath: "/pt/wms/device/outDeviceManage.vue"});
			}
			else if (type == 2)
			{
				this.$emit("openTab",{
					urlId: 'outDeviceRegister' + new Date().getTime(),
					query: {},
					urlName: "客户器具登记",
					urlPathName: "/outDeviceRegister",
					urlPath: "/pt/wms/device/outDeviceRegister.vue"});
			}
			else if (type === 3)
			{
				this.$emit("openTab",{
					urlId: 'outDeviceRegisterRecordManage',
					query: {},
					urlName: "客户器具登记明细",
					urlPathName: "/outDeviceRegisterRecordManage",
					urlPath: "/pt/device/record/outDeviceRegisterRecordManage.vue"});
			}
			else if (type === 4)
			{
				this.$emit("openTab",{
					urlId: 'outDeviceReoveryRecordManage',
					query: {},
					urlName: "客户器具回收明细",
					urlPathName: "/outDeviceReoveryRecordManage",
					urlPath: "/pt/device/record/outDeviceReoveryRecordManage.vue"});
			}
			else if (type == 5)
			{
				this.$emit("openTab",{
					urlId: 'outDeviceClearUpRecordManage',
					query: {},
					urlName: "客户器具整理明细",
					urlPathName: "/outDeviceClearUpRecordManage",
					urlPath: "/pt/device/record/outDeviceClearUpRecordManage.vue"});
			}
			else if (type == 10)
			{
				this.$emit("openTab",{
					urlId: 'outDeviceFeeSumManage',
					query: {},
					urlName: "费用汇总",
					urlPathName: "/outDeviceFeeSumManage",
					urlPath: "/pt/device/record/outDeviceFeeSumManage.vue"});
			}
		},
	},
}
