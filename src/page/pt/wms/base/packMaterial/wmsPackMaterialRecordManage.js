import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";

export default {
	name: 'wmsPackMaterialRecordManage',
	data()
	{
		return {
			head: [
				{"name": "登记单号", "code": "recordNum", "width": "150", "type": "text"},
				{"name": "出入库单号", "code": "orderNum", "width": "200", "type": "diy"},
				{"name": "包材名称", "code": "name", "width": "200", "type": "text"},
				{"name": "到货厂商", "code": "tenantName", "width": "200", "type": "text"},
				{"name": "登记数量", "code": "nums", "width": "120", "type": "text"},
				{"name": "登记类型", "code": "opTypeName", "width": "120", "type": "text"},
				{"name": "实际时间", "code": "realDate", "width": "150", "type": "text"},
				{"name": "备注", "code": "remark", "width": "200", "type": "text"},
				{"name": "登记人", "code": "createUserName", "width": "180", "type": "text"},
				{"name": "登记时间", "code": "createDate", "width": "150", "type": "text"},
			],
			query: this.initQuery(this.$route.query.name),
			pickerOptions: enumData.DATE_RANGE_SHORTCUT_OPTIONS,
		}
	},
	/**
	 * 初始化
	 */
	mounted()
	{
		this.query.ids = this.$route.query.ids;
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
		async doQuery(query = this.query)
		{
			if(this.common.isNotBlank(this.query.date) && this.query.date.length === 2){
				query.beginDate = this.query.date[0];
				query.endDate = this.query.date[1];
			}else{
				query.beginDate = '';
				query.endDate = '';
			}
			await this.$refs.table.load("wmsPackMaterialTF", "queryPackMaterialRecordPage", query);
		},
		/**
		 * 初始化静态数据
		 */
		async initData()
		{
		},
		/**
		 * 初始化查询条件
		 * @returns
		 */
		initQuery(name)
		{
			this.query = {
				name: name,
				tenantName: '',
				date: '',
			};
			return this.query;
		},
		/**
		 * 打开详情
		 * @param data
		 */
		openDetail(item, code)
		{
			if (item.opType == 4)
			{
				this.$emit("openTab",{
					urlId: "inOrderDetail"+item.orderId,
					query: {inOrderId:item.orderId,
						logId: item.orderId,
						logType: enumData.LOG_TYPE.WMS_IN_ORDER,
					},
					urlName: '入库单详情',
					urlPathName: "/inOrderDetail",
					urlPath: '/pt/wms/ord/inOrderDetail.vue'});
			}
			else
			{
				this.$emit("openTab",{
					urlId: "urlId"+item.orderId,
					query: {outOrderId:item.orderId,
						logId: item.orderId,
						logType: enumData.LOG_TYPE.WMS_OUT_ORDER,
					},
					urlName: '出库单详情',
					urlPathName: "/outOrderDetail",
					urlPath: '/pt/wms/ord/outOrderDetail.vue'});
			}
		},
		go(type)
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length != 1) {
				this.$message.error("请选择一条需要异动的包材记录！");
				return;
			}
			let data = selectData[0];
			//WMS_PACK_OP_TYPE
			if (data.opType == 4 || data.opType == 5)
			{
				this.$message.error("出入库关联包材暂不支持成本异动！");
				return;
			}
			this.$emit("openTab",{
				urlId: "wmsPackMaterialChange" + data.recordId,
				query: {type: type, recordId: data.recordId},
				urlName: '包材登记成本异动',
				urlPathName: "/wmsPackMaterialChange",
				urlPath: '/pt/wms/base/packMaterial/wmsPackMaterialChange.vue'});
		},
		detailChange()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要查看的包材数据！");
				return false;
			}
			let data = selectData[0];
			this.$emit("openTab",{
				urlId: "wmsPackMaterialChangeDetail" + data.recordId,
				query: {type: 0, recordId: data.recordId},
				urlName: '包材登记详情',
				urlPathName: "/wmsPackMaterialChangeDetail",
				urlPath: '/pt/wms/base/packMaterial/wmsPackMaterialChange.vue'});
		},
		deletePackMaterialRecord()
		{
			let selectData = this.$refs.table.getSelectItem();
			if (selectData.length !== 1)
			{
				this.$message.error("请选择一条需要删除的包材登记数据！");
				return false;
			}
			let data = selectData[0];
			let that = this;
			that.$confirm("确认删除这个包材登记？", "提示").then(() =>{
				that.common.postUrl("wmsPackMaterialTF", "deletePackMaterialRecord", data, function (data)
				{
					that.doQuery();
					that.$message.success("删除成功！");
				},null,'',true);
			}).catch(() =>{});

		}
	},
}
