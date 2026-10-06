import tableCommon from "@/components/table/tableCommon.vue";
import scrollTable from "@/components/scrollTable/scrollTable.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
  name: 'allInventoryManage',
  data() {
    return {
      head: [
        {"name": "仓库", "code": "workName", "width": "120", "type": "text"},
        {"name": "点检月份", "code": "month", "width": "80", "type": "text"},
        {"name": "点检名称", "code": "inventoryName", "width": "160", "type": "text"},
        {"name": "出租方", "code": "leaser", "width": "130", "type": "text"},
        {"name": "地址", "code": "address", "width": "200", "type": "text"},
        {"name": "状态", "code": "stateName", "width": "90", "type": "text"},
        {"name": "点检人", "code": "createUserName", "width": "90", "type": "text"},
        {"name": "点检时间", "code": "createDate", "width": "110", "type": "text"},
        {"name": "确认人", "code": "confirmUserName", "width": "90", "type": "text"},
        {"name": "确认时间", "code": "confirmDate", "width": "110", "type": "text"},
      ],
      headDtl:[
        {"name": "名称", "code": "name", "width": "110", "type": "text"},
        {"name": "规格型号", "code": "model", "width": "110", "type": "text"},
        {"name": "单位", "code": "unit", "width": "110", "type": "text"},
        {"name": "数量", "code": "nums", "width": "110", "type": "text"},
        {"name": "生产厂家", "code": "manufacturer", "width": "110", "type": "text"},
        {"name": "备注", "code": "remark", "width": "240", "type": "text"},
        {"name": "移交状态", "code": "transferState", "width": "110", "type": "diy"},
        {"name": "点检状态", "code": "inventoryState", "width": "110", "type": "diy"},
        {"name": "点检附件", "code": "inventoryFile", "width": "120", "type": "diy"},
        {"name": "点检备注", "code": "inventoryRemark", "width": "240", "type": "text"},
      ],
      query: {
        isAll:1,
        month:'',
        inventoryName:'',
        workName:''
      },
      title:'',
      dialogShow:false,
      inventoryInfo:{
        baseInfo:{
          month:'',
          inventoryName:''
        }
      },

    }
  },
  /**
   * 初始化
   */
  mounted() {
    this.doQuery();
  },
  /**
   * 组件
   */
  components: {
    tableCommon,
    scrollTable,
    myFileModel
  },
  /**
   * 绑定函数
   */
  methods: {
    /**
     * 查询列表
     */
    doQuery(query=this.query) {
      this.query = query;
      this.query.isAll=1;
      this.$refs.table.load("wmsInventoryTF", "qryWmsInventoryPage", this.query);
    },
    /**
     * 清空
     */
    clear() {
      this.query = {
        isAll:1,
        month:'',
        inventoryName:'',
        workName:''
      };
    },

    showDialog(flag){
      this.dialogShow = flag;
    },
    async displayView(data){
      this.title="查看点检";
      this.showDialog(true);
      this.inventoryInfo = await this.common.postUrl("wmsInventoryTF", "qryWmsInventory", {id:data.id}, null,null,'',true);
      this.$nextTick(()=>{
        this.$refs.scrollTable.setData(this.inventoryInfo.dtlInfo);    //设置表格数据
        this.$refs.scrollTable.calcFootSum();   //表格合计
        this.$refs.scrollTable.changeTop(0);    //表格滚动初始化
      })
      setTimeout(() =>{
        for (let i = 0; i < this.inventoryInfo.dtlInfo.length; i++) {
          if(this.inventoryInfo.dtlInfo[i].inventoryFileId){
            this.$refs['inventoryFile' + i].initDate(this.inventoryInfo.dtlInfo[i].inventoryFileId);
          }
        }
      },0);
      this.inventoryInfo.baseInfo.inventoryName=this.inventoryInfo.baseInfo.name;
    },

    /**
     * @param item
     */
    changeSwitch(item){
      item.inventoryState = item.inventoryState == 1 ? 0 : 1;
      this.$forceUpdate();
    },
    forceUpdate(){
      this.$forceUpdate();
    }

  },
}
