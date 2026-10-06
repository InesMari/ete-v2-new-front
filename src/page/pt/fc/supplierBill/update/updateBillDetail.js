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
			listArray: [],//选择的数据
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
		 * 改变tab
		 * @param tab
		 */
		changeTab(tab)
		{
			this.changeTabHead(tab);
			this.tableData = this.listArray[tab.id - 1];
		},
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
		/**
		 * 关闭当前页面
		 */
		closePage()
		{
			this.$parent.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
		},
		initAttach(){
			this.$refs.attach.initDate(this.bill.attachFileId);
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
