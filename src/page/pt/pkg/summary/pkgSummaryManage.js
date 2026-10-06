import tableCommon from "@/components/table/tableCommon.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';
import fileViewer from '@/components/myFile/file-viewer.vue';
import myImport from "@/components/myImport/myImport";

export default {
  name: 'pkgSummaryManage',
  data()
  {
    return {
      head:
          [
            {"name": "包装名称", "code": "name", "width": "150", "type": "text"},
            {"name": "包装类型", "code": "packTypeName", "width": "150", "type": "text"},
            {"name": "长宽高(mm)", "code": "overall", "width": "90", "type": "text"},
            {"name": "包装配件", "code": "packComponentsStr", "width": "150", "type": "text"},
            {"name": "总数量", "code": "totalNums", "width": "100", "type": "text","issum": "true"},
            {"name": "内部在库", "code": "innerNums", "width": "100", "type": "text","issum": "true"},
            {"name": "客户在库", "code": "outterNums", "width": "100", "type": "text","issum": "true"},
            {"name": "使用客户数", "code": "useCustNums", "width": "100", "type": "text"},
            {"name": "创建人", "code": "createUserName", "width": "100", "type": "text"},
            {"name": "创建时间", "code": "createDate", "width": "150", "type": "text"},
            {"name": "包装图片", "code": "", "width": "100", "type": "diy"}
          ],
      query: {
        packType: '',
        fuzName: '',
      },
      title: "新增包装",
      isShowAddDialog: false,
      isShowAllocateDialog: false,
      pkgInfo: {},
      pkgAllocateInfo: {},
      packTypeOptions: [],
      packComponentOptions: [],
      packComponentOption: '',
      custTenantOptions: '',
      pkgOptions: '',
      outWorkNodeOptions: [],
      inWorkNodeOptions: [],
      srcList: [],
    }
  },
  /**
   * 初始化
   */
  mounted() {
    this.initData();
    this.doQuery();
  },
  /**
   * 绑定函数
   */
  methods: {

    /**
     * 查询列表
     */
    doQuery() {
      this.$refs.table.load("pkgPackInfoTF", "queryPkgPackInfoPage", this.query);
    },


    /**
     * 初始化数据
     */
    initData() {
      let that = this;
      //初始化页面的静态数据
      let codeTypes = {'codeType': 'GOODS_PACKING_TYPE,PACK_COMPONENTS'};
      this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', codeTypes, function (data) {
        that.packTypeOptions = data.GOODS_PACKING_TYPE;
        that.packComponentOptions = data.PACK_COMPONENTS;
      });
    },


    /**
     * 展示Dialog
     * @param isShow
     */
    showAddDialog(isShow) {
      this.pkgInfo = {};
      if (isShow) {
        this.title = '新增';
        this.isShowAddDialog = true;
      } else {
        this.isShowAddDialog = false;
        this.$refs.pkgImg.clean();
      }
    },

    /**
     * 显示弹出框
     * type 1-修改
     */
    displayDialog(type){
      let data = null;
      this.pkgInfo = {};
      if(type !== 1){
        let array = this.$refs.table.getSelectItem();
        if (array.length !== 1) {
          this.$message.error("请选择一条数据!");
          return false;
        }
        data = array[0];
      }
      this.toDisplay(type, data);
    },

    /**
     * 显示弹出框
     * type 2-修改
     */
    toDisplay(type,data){
      if (type == 2) {
        this.pkgInfo = this.common.copyObj(data);
        if (this.pkgInfo.packImgId) {
          this.$refs.pkgImg.initDate(this.pkgInfo.packImgId);
        }
        // this.pkgInfo.packComponents = ['1','2'];
        this.pkgInfo.packType = data.packType + '';
        if(!(data.packComponents instanceof Array)){
          if(this.common.isNotBlank(data.packComponents) && !data.packComponents.startsWith("[")){
            let packComponentsArray = data.packComponents.split(",");
            if(packComponentsArray.length > 0){
              this.pkgInfo.packComponents = packComponentsArray;
            }
          }
        }
        this.title = '修改包装';
        this.isShowAddDialog = true;
        this.$forceUpdate();
      }
    },

    /**
     * 删除包装
     */
    async delPgkInfo() {
      let that = this;
      this.pkgInfo = {};
      let array = this.$refs.table.getSelectItem();
      if (array.length !== 1) {
        this.$message.error("请选择一条数据!");
        return false;
      }
      let data = array[0];

      if(data.totalNums > 0){
        this.$message.error("该包装已有使用，不可删除!");
        return false;
      }

      await this.$confirm('确定要删除此包装信息?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      });
  
      await this.common.postUrl("pkgPackInfoTF", "delPkgPackInfo", data);
      that.$message.success("删除成功！");
      that.doQuery();
    },



    /**
     * 展示内部调拨Dialog
     * @param isShow
     */
    showAllocateDialog(isShow) {

      this.cleanAllocateData();

      if (isShow) {
        this.isShowAllocateDialog = true;

        let that = this;
        //客户
        this.common.postUrl("pkgContractTF", "getPackContractCust", {}, function (data) {
          that.custTenantOptions = data;
        })
      } else {
        this.isShowAllocateDialog = false;
      }
    },

    cleanAllocateData() {
      this.pkgAllocateInfo = {};
      this.custTenantOptions = [];
      this.pkgOptions = [];
      this.inWorkNodeOptions = [];
      this.outWorkNodeOptions = [];
    },


    /**
     * 获取包装出库作业点
     */
    getPkgOutWorkNodeOptions() {
      let packId = this.pkgAllocateInfo.packId;
      let custTenantId = this.pkgAllocateInfo.custTenantId;
      if (this.common.isBlank(custTenantId)) {
        this.$message.error("请选择客户!");
        return false;
      }
      if (this.common.isBlank(packId)) {
        this.$message.error("请选择包装!");
        return false;
      }

      let that = this;

      //出库作业点
      let param = {"packId": packId, "custTenantId": custTenantId};
      this.common.postUrl("pkgPackInfoTF", "getPkgOutWorkNodeList", param, function (data) {
          that.outWorkNodeOptions = data;
      });
    },


    selectContractCust() {
      this.loadCustContractPackInfo();
      this.loadWorkDataByTenantId();
    },


    /**
     * 通过客户加载作业点集合
     *
     */
    async loadWorkDataByTenantId() {
      let custTenantId = this.pkgAllocateInfo.custTenantId;
      if (this.common.isBlank(custTenantId)) {
        this.$message.error("请选择客户!");
        return false;
      }

      let that = this;
      this.common.postUrl("workGoodsTF", "queryWorkDataSelect", {tenantId: custTenantId}, function (data) {
        that.inWorkNodeOptions = data;
      });
    },


    /**
     * 合同客户签约的包装列表
     *
     */
    async loadCustContractPackInfo() {
      let custTenantId = this.pkgAllocateInfo.custTenantId;
      if (this.common.isBlank(custTenantId)) {
        this.$message.error("请选择客户!");
        return false;
      }

      let that = this;

      //包装列表
      this.common.postUrl("pkgContractTF", "getContractPackInfoByCustId", {custTenantId: custTenantId}, function (data) {
        if (data) {
          that.pkgOptions = data;
        }
      });
    },


    /**
     * 新建包装
     */
    savePkgData() {
      let method = 'savePackInfo';
      let that = this;
      let param = that.pkgInfo;
      this.common.postUrl("pkgPackInfoTF", method, param, function (data) {
        if (data) {
          that.$message.success("新增成功！")
          that.clear();
          that.doQuery();
          that.showAddDialog(false);
        }
      }, null, '', true);
    },

    /**
     * 上传成功后回调
     */
    importPkgAllocateSuccess() {
      this.doQuery();
      this.showAllocateDialog(false);
      this.$message.success("内部调拨操作成功！");
    },


    /**
     * 内部调拨
     */
    submitPkgAllocateData() {
      if (this.common.isBlank(this.pkgAllocateInfo.custTenantId)) {
        this.$message.error("客户名称 不可为空！");
        return false;
      }
      if (this.common.isBlank(this.pkgAllocateInfo.packId)) {
        this.$message.error("包装名称 不可为空！");
        return false;
      }
      if (this.common.isBlank(this.pkgAllocateInfo.receiptWorkId)) {
        this.$message.error("交付地 不可为空！");
        return false;
      }
      if (this.common.isBlank(this.pkgAllocateInfo.allocatQuantity)) {
        this.$message.error("调拨数量 不可为空！");
        return false;
      }
      if (this.common.isBlank(this.pkgAllocateInfo.chargeDate)) {
        this.$message.error("开始计费日期 不可为空！");
        return false;
      }
      if (this.$refs.myImport.$refs.upload.fileList.length === 0)
      {
        // this.$message.error("请上传包装明细文件！");
        // return false;
      }
      this.pkgAllocateInfo.isSaveUpload = "1";//服务端是否保存上传文件
      this.$refs.myImport.submitFileForm();
    },


    /**
     * 包装租赁明细
     * @param isShow
     */
    toShowPkgBizDetail() {
      let array = this.$refs.table.getSelectItem();
      if (array.length !== 1) {
        this.$message.error("请选择一条数据!");
        return false;
      }
      let data = array[0];
      let item = {
        urlName: '库存明细',
        urlId: 'packStoreDetailManage' + data.id,
        urlPathName: "",
        urlPath: "/pt/pkg/business/packStoreDetailManage.vue",
        query: {pkgId: data.id},
      }
      this.$emit('openTab', item);
    },

    /** 地图查看库存位置 */
    toPackMonitor() {
      let array = this.$refs.table.getSelectItem();
      if (array.length !== 1)
      {
        this.$message.error("请选择一条数据!");
        return false;
      }
      this.$emit("openTab",{
        urlId: 'packMonitor' + array[0].id,
        query: {packId:array[0].id},
        urlName: "查看库存位置",
        urlPathName: "/business",
        urlPath: "/pt/pkg/business/packMonitor.vue"});
    },

    successCallback(imgData){
      this.pkgInfo.packImgId = imgData.flowId;
      this.pkgInfo.packImgPath = imgData.storePath;
    },

    /**
     * 显示包装图片
     * @param data
     */
    showPkgImg(data){
      if(!data.packImgId && !data.packImgUrl){
        this.$message.error("没有图片~");
        return;
      }
      this.srcList=[];
      this.srcList.push(data.packImgUrl);
			this.$refs.viewer.show();

    },

    /**
     * 清空
     */
    clear() {
      this.query = {};
      this.srcList = [];
    },

  },


    /**
     * 组件
     */
    components: {
      myFileModel,
      fileViewer,
      tableCommon,
      myImport
    },
}