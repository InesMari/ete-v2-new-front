import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";
import fileViewer from '@/components/myFile/file-viewer.vue';
import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
	name: 'outDeviceFeeSumManage',
	data()
	{
		return {
			head: [
				{"name": "所属仓库", "code": "workName", "width": "150", "type": "text"},
				{"name": "结算月份", "code": "monthStr", "width": "200", "type": "text"},
				{"name": "客户名称", "code": "tenantName", "width": "120", "type": "text"},
				{"name": "器具名称", "code": "deviceName", "width": "120", "type": "text"},
				{"name": "器具规格", "code": "spec", "width": "120", "type": "text"},
				{"name": "回收数量", "code": "reoveryNum", "width": "120", "type": "text"},
				{"name": "返回数量", "code": "returnNum", "width": "110", "type": "text"},
				{"name": "整理数量", "code": "clearUpNum", "width": "110", "type": "text"},
				{"name": "成本金额", "code": "totalFee", "width": "150", "type": "text"},
				{"name": "收入金额", "code": "totalIncomeFee", "width": "150", "type": "text"},
			],
			query: this.initQuery(),
			pickerOptions: enumData.DATE_RANGE_SHORTCUT_OPTIONS,
			workData: [],
		}
	},
	/**
	 * 初始化
	 */
	mounted()
	{
		this.doQuery();
		this.initData();
	},
	/**
	 * 组件
	 */
	components: {
		tableCommon,
		enumData,
	},
	/**
	 * 绑定函数
	 */
	methods: {
		/**
		 * 列表查询
		 */
		async doQuery()
		{
			let query = this.query
			if(this.common.isNotBlank(query.createDate) && query.createDate.length === 2){
				query.startCreateDate = query.createDate[0];
				query.endCreateDate = query.createDate[1];
			}else{
				query.startCreateDate = '';
				query.endCreateDate = '';
			}
			await this.$refs.table.load("deviceRecordService", "queryDeviceRecordFeeSumPage", query);
		},
		/**
		 * 初始化静态数据
		 */
		async initData()
		{
			this.workData = await this.common.postUrl("storeHouseBizTF", "queryStoreHouseList", {});
			this.$forceUpdate();
		},
		/**
		 * 初始化查询条件
		 * @returns
		 */
		initQuery()
		{
			return this.query = {
				workId: '',
				month: '',
				tenantName: '',
				createDate: null,
				useTenantName: null,
			};
		},
		open(type)
		{
			this.$emit("openTab",{
				urlId: 'outDeviceFeeDtlManage',
				query: {},
				urlName: "费用明细",
				urlPathName: "/outDeviceFeeDtlManage",
				urlPath: "/pt/device/record/outDeviceFeeDtlManage.vue"});
		},
		/**
		 * 导出
		 */
		download() {
			this.$refs.table.downloadExcelFile();
		},
	},
}
