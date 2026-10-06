import tableCommon from "@/components/table/tableCommon.vue";
import scrollTable from "@/components/scrollTable/scrollTable.vue";

export default {
  name: 'inventoryCfgManage',
  data() {
    return {
      head: [
        {"name": "仓库", "code": "workName", "width": "120", "type": "text"},
        {"name": "出租方", "code": "leaser", "width": "130", "type": "text"},
        {"name": "地址", "code": "address", "width": "200", "type": "text"},
        {"name": "创建人", "code": "createUserName", "width": "90", "type": "text"},
        {"name": "创建时间", "code": "createDate", "width": "110", "type": "text"},
      ],
      query: {
        workName:''
      },
      title:'',
      dialogShow:false,
      inventoryInfo:{
        baseInfo:{
          month:'',
          inventoryName:''
        },
        dtlInfo:[],
      },
      dialogType:1,//1新增 2修改 3查看
      workList:[]

    }
  },
  /**
   * 初始化
   */
  mounted() {
    this.init();
    this.doQuery();
  },
  /**
   * 组件
   */
  components: {
    tableCommon,
    scrollTable
  },
  /**
   * 绑定函数
   */
  methods: {
    init(){
      let that = this;
      this.common.postUrl('wmsBaseTF','getAllWorkStore',{},function (data) {
        that.workList = data;
      });
    },
    /**
     * 查询列表
     */
    doQuery(query=this.query) {
      this.query = query;
      this.$refs.table.load("wmsInventoryTF", "qryWmsInventoryCfgPage", this.query);
    },
    /**
     * 清空
     */
    clear() {
      this.query = {
        workName:''
      };
    },
    add(){
      this.inventoryInfo.dtlInfo.push({transferState:1});
    },
    remove(index){
      if(this.inventoryInfo.dtlInfo.length>1){
        this.inventoryInfo.dtlInfo.splice(index, 1);
      }
    },
    async toCommit(){
      let inventoryInfo = {};
      inventoryInfo = this.inventoryInfo.baseInfo;
      inventoryInfo.dtlList = this.common.copyObj(this.inventoryInfo.dtlInfo);
      inventoryInfo.workName=this.workList.find(item=>item.workId===inventoryInfo.workStoreId).workName;

      let method = '';
      let msg = '';
      if(this.dialogType==1){
        method = 'addWmsInventoryCfg';
        msg = '新增点检配置信息成功！';
      }else if(this.dialogType==2){
        method = 'updateWmsInventoryCfg';
        msg = '修改点检配置信息成功！';
      }
      await this.common.postUrl("wmsInventoryTF", method, inventoryInfo,
          null, null, '', true);
      this.$message.success(msg);
      this.showDialog(false);
      await this.doQuery();

    },
    toDel() {
      let selectData = this.$refs.table.getSelectItem();
      if (selectData.length < 1) {
        this.$message.error("请选择一条点检配置信息！");
        return;
      }
      this.$confirm("是否确认删除点检配置信息？", "提示").then(async () =>{
        await this.common.postUrl("wmsInventoryTF", "delWmsInventoryCfg", selectData[0],
            null, null, '', true);
        this.$message.success("删除点检配置信息成功！");
        await this.doQuery();
      }).catch(() =>{
        //取消
      });
    },

    showDialog(flag){
      this.dialogShow = flag;
    },
    async displayAdd(){
      this.dialogType=1;
      this.title="新增点检配置";
      this.inventoryInfo.dtlInfo=[{transferState:1}];
      this.showDialog(true);
    },
    async displayUpdate(){
      let selectData = this.$refs.table.getSelectItem();
      if (selectData.length != 1) {
        this.$message.error("请选择一条点检配置信息！");
        return false;
      }
      this.dialogType=2;
      this.title="修改点检配置";
      this.showDialog(true);
      this.inventoryInfo = await this.common.postUrl("wmsInventoryTF", "qryWmsInventoryCfg", {id:selectData[0].id}, null,null,'',true);
    },
    async displayView(data){
      this.dialogType=3;
      this.title="查看点检配置";
      this.showDialog(true);
      this.inventoryInfo = await this.common.postUrl("wmsInventoryTF", "qryWmsInventoryCfg", {id:data.id}, null,null,'',true);
    },

    /**
     * @param item
     */
    changeSwitch(item){
      item.transferState = item.transferState == 1 ? 0 : 1;
      this.$forceUpdate();
    },
    forceUpdate(){
      this.$forceUpdate();
    }

  },
}
