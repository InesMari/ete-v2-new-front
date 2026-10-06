import tableCommon from "@/components/table/tableCommon.vue";
import selectWork from "@/page/pt/wms/selectWork.vue";
import scrollTable from "@/components/scrollTable/scrollTable.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import fileViewer from '@/components/myFile/file-viewer.vue';

export default {
  name: 'inventoryManage',
  data() {
    return {
      head: [
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
        {"name": "规格型号", "code": "model", "width": "80", "type": "text"},
        {"name": "单位", "code": "unit", "width": "60", "type": "text"},
        {"name": "数量", "code": "nums", "width": "60", "type": "text"},
        {"name": "生产厂家", "code": "manufacturer", "width": "110", "type": "text"},
        {"name": "备注", "code": "remark", "width": "200", "type": "text"},
        {"name": "移交状态", "code": "transferState", "width": "80", "type": "diy"},
        {"name": "点检状态", "code": "inventoryState", "width": "80", "type": "diy"},
        {"name": "点检附件", "code": "inventoryFile", "width": "250", "type": "diy"},
        {"name": "点检备注", "code": "inventoryRemark", "width": "240", "type": "diy"},
      ],
      query: {
        month:'',
        inventoryName:''
      },
      showSelWork:false,
      title:'',
      dialogShow:false,
      inventoryInfo:{
        baseInfo:{
          month:'',
          inventoryName:''
        }
      },
      dialogType:1,//1新增 2修改 3确认 4查看
      imageUrls:[], //图片预览列表
      imgViewIndex:0, //默认预览第几张
    }
  },
  /**
   * 初始化
   */
  mounted() {
    this.initSelWork();
  },
  /**
   * 组件
   */
  components: {
    tableCommon,
    selectWork,
    scrollTable,
    myFileModel,
    fileViewer,
  },
  /**
   * 绑定函数
   */
  methods: {
    initSelWork(){
      this.userInfo = this.common.userInfo();
      if(!this.userInfo.workId){
        this.showSelWork = true;
      }else{
        this.firstIn = false;
        this.doQuery();
      }
    },
    selWork(){
      this.showSelWork = false;
      this.$forceUpdate();
      if(!this.firstIn){
        this.$emit('closeOthers', {});
      }
      this.userInfo = this.common.userInfo();
      this.firstIn = false;
      this.doQuery();
    },
    /**
     * 查询列表
     */
    doQuery(query=this.query) {
      this.query = query;
      this.$refs.table.load("wmsInventoryTF", "qryWmsInventoryPage", this.query);
    },
    /**
     * 清空
     */
    clear() {
      this.query = {
        month:'',
        inventoryName:''
      };
    },
     async toCommit() {
       let inventoryInfo = {};
       inventoryInfo = this.inventoryInfo.baseInfo;
       inventoryInfo.dtlList = this.common.copyObj(this.$refs.scrollTable.getData());

       let method = '';
       let msg = '';
       if (this.dialogType == 1) {
         inventoryInfo.cfgId = this.inventoryInfo.baseInfo.id;
         for (let i = 0; i < inventoryInfo.dtlList.length; i++) {
           inventoryInfo.dtlList[i].dtlCfgId = inventoryInfo.dtlList[i].id;
           // inventoryInfo.dtlList[i].inventoryFileId = this.$refs['inventoryFile' + i].getImageData().flowId;
           // inventoryInfo.dtlList[i].inventoryFilePath = this.$refs['inventoryFile' + i].getImageData().storePath;
         }
         method = 'addWmsInventory';
         msg = '新增点检信息成功！';
       } else if (this.dialogType == 2) {
         // for (let i = 0; i < inventoryInfo.dtlList.length; i++) {
         //   inventoryInfo.dtlList[i].inventoryFileId = this.$refs['inventoryFile' + i].getImageData().flowId;
         //   inventoryInfo.dtlList[i].inventoryFilePath = this.$refs['inventoryFile' + i].getImageData().storePath;
         // }
         method = 'updateWmsInventory';
         msg = '修改点检信息成功！';
       } else if (this.dialogType == 3) {
         method = 'confirmWmsInventory';
         msg = '确认点检信息成功！';
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
        this.$message.error("请选择一条点检信息！");
        return;
      }
      if (selectData[0].state != 0) {
        this.$message.error("未确认状态的点检信息才可以删除！");
        return false;
      }
      this.$confirm("是否确认删除点检信息？", "提示").then(async () =>{
        await this.common.postUrl("wmsInventoryTF", "delWmsInventory", selectData[0],
            null, null, '', true);
        this.$message.success("删除点检信息成功！");
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
      this.title="新增点检";
      let that = this;
      this.common.postUrl("wmsInventoryTF", "qryWmsInventoryCfgForAdd", {}, function (data) {
        that.inventoryInfo = data;
        that.showDialog(true);
        that.$nextTick(()=>{
          for (let i = 0; i < that.inventoryInfo.dtlInfo.length; i++) {
            that.inventoryInfo.dtlInfo[i].inventoryState=1;
          }
          that.$refs.scrollTable.setData(that.inventoryInfo.dtlInfo);    //设置表格数据
          that.$refs.scrollTable.calcFootSum();   //表格合计
          that.$refs.scrollTable.changeTop(0);    //表格滚动初始化
        })
        setTimeout(() =>{
          for (let i = 0; i < that.inventoryInfo.dtlInfo.length; i++) {
            that.$refs['inventoryFile' + i].clean();
          }
        },0);
        that.inventoryInfo.baseInfo.month=that.common.formatDate.getMonth();
        that.inventoryInfo.baseInfo.inventoryName=that.common.userInfo().workName+that.common.formatDate.year()+'年'+that.common.formatDate.month()+'月'+'基础设施点检';
      },null,'',true);

    },
    async displayUpdate(){
      let selectData = this.$refs.table.getSelectItem();
      if (selectData.length != 1) {
        this.$message.error("请选择一条点检信息！");
        return false;
      }
      if (selectData[0].state != 0) {
        this.$message.error("未确认状态的点检信息才可以修改！");
        return false;
      }
      this.dialogType=2;
      this.title="修改点检";
      let that = this;
      this.common.postUrl("wmsInventoryTF", "qryWmsInventory", {id:selectData[0].id}, function (data) {
        that.inventoryInfo = data;
        that.showDialog(true);
        that.$nextTick(()=>{
          that.$refs.scrollTable.setData(that.inventoryInfo.dtlInfo);    //设置表格数据
          that.$refs.scrollTable.calcFootSum();   //表格合计
          that.$refs.scrollTable.changeTop(0);    //表格滚动初始化
        })
        // setTimeout(() =>{
        //   for (let i = 0; i < that.inventoryInfo.dtlInfo.length; i++) {
        //     if(that.inventoryInfo.dtlInfo[i].inventoryFileId){
        //       that.$refs['inventoryFile' + i].initDate(that.inventoryInfo.dtlInfo[i].inventoryFileId);
        //     }
        //   }
        // },0);

        that.inventoryInfo.baseInfo.inventoryName=that.inventoryInfo.baseInfo.name;
      },null,'',true);

    },
    async displayComfirm(){
      let selectData = this.$refs.table.getSelectItem();
      if (selectData.length != 1) {
        this.$message.error("请选择一条点检信息！");
        return false;
      }
      if (selectData[0].state != 0) {
        this.$message.error("未确认状态的点检信息才可以确认！");
        return false;
      }
      this.dialogType=3;
      this.title="确认点检";
      let that = this;
      this.inventoryInfo = await this.common.postUrl("wmsInventoryTF", "qryWmsInventory", selectData[0], function (data) {
        that.inventoryInfo = data;
        that.showDialog(true);
        that.$nextTick(()=>{
          that.$refs.scrollTable.setData(that.inventoryInfo.dtlInfo);    //设置表格数据
          that.$refs.scrollTable.calcFootSum();   //表格合计
          that.$refs.scrollTable.changeTop(0);    //表格滚动初始化
        })
        setTimeout(() =>{
          for (let i = 0; i < that.inventoryInfo.dtlInfo.length; i++) {
            if(that.inventoryInfo.dtlInfo[i].inventoryFileId){
              that.$refs['inventoryFile' + i].initDate(that.inventoryInfo.dtlInfo[i].inventoryFileId);
            }
          }
        },0);
        that.inventoryInfo.baseInfo.inventoryName=that.inventoryInfo.baseInfo.name;
      },null,'',true);
    },
    async displayView(data){
      this.dialogType=4;
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
    },
    // 图片上传成功回调
    fileCallback(data,item){
      if(this.common.isBlank(item.imgs)) item.imgs=[];
      let obj = {
        inventoryFileId:data.flowId,
        inventoryFilePath:data.storePath,
        url:this.common.getBigImgPath(data.fullPath),
      }
      item.imgs.push(obj);
      // 最多5张
      if(item.imgs.length == 5){
        item.hidefilemodel = true;
      }
      this.$refs.scrollTable.forceUpdate();
    },
    // 查看大图
    viewImage(imgs,i){
      this.imageUrls = imgs.map(item=>item.url)
      this.imgViewIndex = i;
      this.$refs.viewer.show();
    },
    // 删除图片
    delImg(item,index){
      item.splice(index,1);
      this.$refs.scrollTable.forceUpdate();
    },
  },
}
