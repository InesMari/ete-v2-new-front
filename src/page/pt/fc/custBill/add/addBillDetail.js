import tableCommon from "@/components/table/tableCommon.vue"
import simpleTable from "@/components/simpleTable/simpleTable.vue"
import commonBillDetail from "../commonBillDetail.js";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import enumData from "@/page/pt/enum";


export default {
	name: 'addBillDetail',
	mixins: [commonBillDetail],
	data()
	{
		return {
			tabs: [
				{name: '运输订单', active: true, id: enumData.FC_CUST_BILL_ITEM_TYPE.ORDER,show:true},
				{name: '仓储费用', active: false, id: enumData.FC_CUST_BILL_ITEM_TYPE.STOREHOUSE,show:true},
				{name: '其他费用', active: false, id: enumData.FC_CUST_BILL_ITEM_TYPE.PROJECTSUNDRY,show:true},
				{name: '器具费用', active: false, id: enumData.FC_CUST_BILL_ITEM_TYPE.PACKLEASE,show:true},
			],
			customerAllData: [],//对账客户下拉
		}
	},
	mounted()
	{
		let that = this;

		that.$nextTick(() => {
			that.tableData = that.listArray[0];
		})
	},
	components: {
		tableCommon,
		simpleTable,
		myFileModel,
	},
	methods: {
		/**
		 * 重新勾选
		 */
		recheck()
		{
			this.$emit("recheck");
		},
		/**
		 * 双击查看详情
		 * @param data
		 */
		dblclickItem(data)
		{
			this.openDetail(data, true);
		},
		/**
		 * 查看详情
		 */
		toOrderDetailFromSon()
		{
			this.toOrderDetail(true);
		},
		initImageData(){
			let imageData = this.$refs.attach.getImageData();
			if(imageData.flowId){
				this.bill.attachFileId = imageData.flowId;
				this.bill.attachFilePath = imageData.storePath;
			}
		},
		initReceiptData(){
			let imageData = this.$refs.receipt.getImageData();
			if(imageData.flowId){
				this.bill.attachFileReceiptId = imageData.flowId;
				this.bill.attachFileReceiptPath = imageData.storePath;
			}
		}
	},
}
