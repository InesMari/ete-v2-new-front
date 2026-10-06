import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";
import fileViewer from '@/components/myFile/file-viewer.vue';
import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
	name: 'outDeviceFeeDtlManage',
	data()
	{
		return {
			head: [
				{"name": "登记单号", "code": "recordNum", "width": "150", "type": "text"},
				{"name": "器具名称", "code": "deviceName", "width": "150", "type": "text"},
				{"name": "器具规格", "code": "spec", "width": "150", "type": "text"},
				{"name": "实际日期", "code": "actualDate", "width": "120", "type": "text"},
				{"name": "所属人", "code": "srcTenantName", "width": "200", "type": "text"},
				{"name": "使用客户", "code": "useTenantName", "width": "200", "type": "text"},
				{"name": "登记数量", "code": "dealNum", "width": "120", "type": "text"},
				{"name": "登记类型", "code": "dealTypeName", "width": "120", "type": "text"},
				{"name": "回收成本单价", "code": "reoveryPrice", "width": "120", "type": "text"},
				{"name": "回收成本金额", "code": "reoveryFee", "width": "120", "type": "text"},
				{"name": "整理成本单价", "code": "clearUpPrice", "width": "120", "type": "text"},
				{"name": "整理成本金额", "code": "clearUpFee", "width": "120", "type": "text"},
				{"name": "运输成本单价", "code": "transportPrice", "width": "120", "type": "text"},
				{"name": "运输成本金额", "code": "transportFee", "width": "120", "type": "text"},
				{"name": "成本合计金额", "code": "totalFee", "width": "120", "type": "text"},
				{"name": "回收收入单价", "code": "incomePrice", "width": "120", "type": "text"},
				{"name": "回收收入金额", "code": "incomeFee", "width": "120", "type": "text"},
				{"name": "登记人", "code": "createUserName", "width": "180", "type": "text"},
				{"name": "登记时间", "code": "createDate", "width": "150", "type": "text"},
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
			await this.$refs.table.load("deviceRecordService", "queryDeviceRecordFeeDtlPage", query);
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
		/**
		 * 导出
		 */
		download() {
			this.$refs.table.downloadExcelFile();
		},
	},
}
