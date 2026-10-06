import tableCommon from "@/components/table/tableCommon.vue";
import myImport from "@/components/myImport/myImport";
import enumData from "@/page/pt/enum";

export default {
  name: 'stockMaterialManage',
  data() {
    return {
      head: [
        {"name": "所属货主", "code": "srcTenantName", "width": "250", "type": "text"},
        {"name": "到货厂商", "code": "fromTenantName", "width": "250", "type": "text"},
        {"name": "物料编码", "code": "materialNum", "width": "150", "type": "text"},
        {"name": "物料描述", "code": "materialDesc", "width": "150", "type": "text"},
        {"name": "规格名称", "code": "specsName", "width": "110", "type": "text"},
        {"name": "最大装载长宽高", "code": "lengthStr", "width": "110", "type": "text"},
        {"name": "箱装容数", "code": "perBoxNums", "width": "110", "type": "text"},
        {"name": "托装容数", "code": "perPalletNums", "width": "110", "type": "text"},
        {"name": "在库箱装", "code": "boxNums", "width": "110", "type": "text"},
        {"name": "在库托装", "code": "palletNums", "width": "110", "type": "text"},
        {"name": "在库数量", "code": "stockNums", "width": "110", "type": "text"},
        {"name": "管理单位", "code": "unitName", "width": "110", "type": "text"},
        {"name": "冻结数量", "code": "freezeNums", "width": "110", "type": "text"},
        {"name": "预占数量", "code": "expectNums", "width": "110", "type": "text"},
        {"name": "可用数量", "code": "okNums", "width": "110", "type": "text"},
        {"name": "异常数量", "code": "errorNums", "width": "110", "type": "text"},
      ],
      loadParam: {},
      uploadOpen:false,
    }
  },
  /**
   * 初始化
   */
  mounted() {
    this.initHead();
    this.doQuery();
  },
  /**
   * 组件
   */
  components: {
    tableCommon,
    myImport
  },
  /**
   * 绑定函数
   */
  methods: {
    initHead(){
      let userInfo = this.common.userInfo();
      if(userInfo.useSapStockNums==1){
        for (let i = 0; i < this.head.length; i++) {
          if(this.head[i].code=='errorNums'){
            this.head.splice(i+1, 0, {"name": "SAP登记库存数量", "code": "sapStockNums", "width": "110", "type": "text"});
            this.head.splice(i+2, 0, {"name": "SAP登记预占数量", "code": "sapStockExpectNums", "width": "110", "type": "text"});
            this.head.splice(i+3, 0, {"name": "SAP登记可用数量", "code": "sapStockOkNums", "width": "110", "type": "text"});
            break;
          }
        }
      }else{
        this.head = this.head.filter(item => item.code !=='sapStockNums'&&item.code !=='sapStockExpectNums'&&item.code !=='sapStockOkNums');
      }
      let that = this;
      this.$nextTick(() => {
        that.$refs.table.initHead();
      });
    },
    /**
     * 查询列表
     */
    doQuery() {
      this.$refs.table.load("wmsMaterialPickTF", "queryStockMaterialPage", this.loadParam);
    },
    /**
     * 清空
     */
    clear() {
      this.loadParam = {};
    },
    sureSuccess()
    {
      this.doQuery();
      this.showUpload(false);
      this.$message.success("库存导入成功！");
    },
    /**
     * 展示上传
     */
    showUpload(flag)
    {
      if (!flag)
        this.$refs.myImport.$refs.upload.clearFiles();
      this.uploadOpen = flag;
    },
    /**
     * 确认收货
     */
    sure()
    {
      this.$refs.myImport.submitFileForm();
    },

    download(){
      this.$refs.table.downloadExcelFile('按物料在库单列表');
    },

    downloadExcel(){
      let selectData = this.$refs.table.getSelectItem();
      if (selectData.length <=0) {
        this.$message.error("请先选择数据！");
        return;
      }
      let stockMaterialIds = [];
      if (selectData.length >0) {
        for (let i = 0; i < selectData.length; i++) {
          stockMaterialIds.push(selectData[i].id);
        }
      }
      this.loadParam.stockMaterialIds = stockMaterialIds;
      this.loadParam.selfCreateUrl = 'wmsStockLogTF|downloadExcel';
      this.common.downloadExcelFile('', this.loadParam, '', '', "物料出入库详情", 'stockMaterialManageTable2');
    },

    gotoLog()
    {
      let selectData = this.$refs.table.getSelectItem();
      if (selectData.length != 1) {
        this.$message.error("请选择一条数据！");
        return;
      }
      let data = selectData[0];
      this.$emit("openTab",{
        urlId: 'stockMaterialInfo' + 'Detail' + data.id,
        query: {
          logId: data.id,
          logType: enumData.LOG_TYPE.STOCK_MATERIAL_INFO,
        },
        urlName: "物料库存" + "操作日志",
        urlPathName: "/operateLog",
        urlPath: "/pt/operateLog/operateLog.vue"});
    },
  },
}
