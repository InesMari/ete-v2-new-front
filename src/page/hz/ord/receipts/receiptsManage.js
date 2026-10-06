import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import fileViewer from '@/components/myFile/file-viewer.vue';

export default {
	name: 'receiptsManage',
	data()
	{
		return {
			head: [
				{"name": "订单号", "code": "orderNum", "width": "150", "type": "diy"},
				{"name": "我的单号", "code": "custOrderNum", "width": "150", "type": "text"},
				{"name": "单据", "code": "receiptsFileName", "width": "120", "type": "diy"},
				{"name": "派车单号", "code": "waybillNum", "width": "150", "type": "diy"},
				{"name": "车牌号码", "code": "plateNumber", "width": "90", "type": "text"},
				{"name": "司机", "code": "driverName", "width": "90", "type": "text"},
				{"name": "单据类型", "code": "receiptsTypeName", "width": "80", "type": "text"},
				{"name": "单据状态", "code": "receiptStateName", "width": "110", "type": "text"},
			],
			query: this.initQuery(),
			receiptStateData: [],
			receiptTypeData: [],
			srcList: [],
		}
	},
	/**
	 * 初始化
	 */
	mounted()
	{
		this.initData();
		this.doQuery();
	},
	/**
	 * 组件
	 */
	components: {
		tableCommon,
		myFileModel,
		fileViewer,
	},
	/**
	 * 绑定函数
	 */
	methods: {
		/**
		 *
		 */
		async doQuery()
		{
			await this.$refs.table.load("receiptsTF", "queryReceiptsInfoData", this.query);
		},
		/**
		 * 初始化静态数据
		 */
		initData()
		{
			let that = this;
			this.common.postUrl("commonTF", "getSysStaticData", {codeType: "RECEIPT_STATE"}, function (data)
			{
				that.receiptStateData = data;
			});
			this.common.postUrl("commonTF", "getSysStaticData", {codeType: "RECEIPT_TYPE"}, function (data)
			{
				that.receiptTypeData = data;
			});
		},
		/**
		 * 初始化查询条件
		 */
		initQuery()
		{
			this.query = {
				custOrderNum: '',
				plateNumber: '',
				driverName: '',
				waybillNum: '',
				receiptState: '',
				receiptType: '',
				isHz:1,
			};
			return this.query;
		},

		/**
		 * 派车单详情/中转详情
		 */
		toDetail(item, code)
		{
			if (code == 'waybillNum')
			{
				this.$emit("openTab",{
					urlId: 'waybillDetail' + item.waybillId,
					query: {waybillId: item.waybillId},
					urlName: "派车单详情",
					urlPathName: "/detail",
					urlPath: "/hz/ord/waybill/detail/waybillDetail.vue"});
			}
			else if (code == 'orderNum')
			{
				this.$emit("openTab",{
					urlId: 'orderDetail' + item.orderId,
					query: {orderId: item.orderId},
					urlName: "订单详情",
					urlPathName: "/order",
					urlPath: "/hz/ord/order/orderDetail/orderDetailMain.vue"});
			}else if(code == 'receiptsFileName'){
				if(!item.imgPathUrl){
					this.$message.error("没有图片~");
					return;
				}
				this.srcList=[];
				this.srcList.push(item.imgPathUrl);
      			this.$refs.viewer.show();
			}
		},

	},
}
