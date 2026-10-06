import tableCommon from "@/components/table/tableCommon.vue"
import simpleTable from "@/components/simpleTable/simpleTable.vue"
import commonBillDetail from "../commonBillDetail.js";
import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
	name: 'updateBillDetail',
	mixins: [commonBillDetail],
	data()
	{
		return {
			customerAllData: [],//对账客户下拉
			saveFlag: false,//点击保存标志
		}
	},
	mounted()
	{

	},
	components: {
		tableCommon,
		simpleTable,
		myFileModel
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
		/**
		 * 关闭当前页面
		 */
		closePage()
		{
			this.$parent.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
		},
		initAttach(){
			if (this.bill.attachFileId)
				this.$refs.attach.initDate(this.bill.attachFileId);
		},
		initImageData(){
			let imageData = this.$refs.attach.getImageData();
			if(imageData.flowId){
				this.bill.attachFileId = imageData.flowId;
				this.bill.attachFilePath = imageData.storePath;
			}
		},
		//初始化回单附件
		initAttachReceipt(){
			if (this.bill.attachFileReceiptId)
				this.$refs.receipt.initDate(this.bill.attachFileReceiptId);
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
