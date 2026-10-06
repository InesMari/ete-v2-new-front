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
				{name: '派车单信息', active: true, id: enumData.FC_SUPPLIER_BILL_ITEM_TYPE.WAYBILL,show:true},
				{name: '仓储费用', active: false, id: enumData.FC_SUPPLIER_BILL_ITEM_TYPE.STOREHOUSE,show:true},
				{name: '器具费用', active: false, id: enumData.FC_SUPPLIER_BILL_ITEM_TYPE.PACKCOST,show:true},
			],
		}
	},
	mounted()
	{
		let that = this;
		//列表数据
		that.$nextTick(() => {
			that.tableData = that.listArray[0];
		})
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
			if(this.showGotoDetail){
				this.openDetail(data, true);
			}
		},
		/**
		 * 查看详情
		 */
		toDetailFromSon()
		{
			this.toDetail(true);
		},
		initImageData(){
			let imageData = this.$refs.attach.getImageData();
			if(imageData.flowId){
				this.bill.attachFileId = imageData.flowId;
				this.bill.attachFilePath = imageData.storePath;
			}
		}

	},
}
