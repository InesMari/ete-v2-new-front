import tableCommon from "@/components/table/tableCommon.vue";
import myImport from "@/components/myImport/myImport";

export default {
  name: 'stockMaterialManageHZ',
  data() {
    return {
      head: [
        {"name": "仓库", "code": "workStoreName", "width": "110", "type": "text"},
        // {"name": "所属货主", "code": "srcTenantName", "width": "110", "type": "text"},
        // {"name": "到货厂商", "code": "fromTenantName", "width": "110", "type": "text"},
        {"name": "物料编码", "code": "materialNum", "width": "110", "type": "text"},
        {"name": "物料描述", "code": "materialDesc", "width": "110", "type": "text"},
        {"name": "规格名称", "code": "specsName", "width": "110", "type": "text"},
        {"name": "最大装载长宽高", "code": "lengthStr", "width": "110", "type": "text"},
        {"name": "箱装容数", "code": "perBoxNums", "width": "110", "type": "text"},
        {"name": "托装容数", "code": "perPalletNums", "width": "110", "type": "text"},
        {"name": "在库数量", "code": "stockNums", "width": "110", "type": "text"},
        {"name": "管理单位", "code": "unitName", "width": "110", "type": "text"},
        {"name": "冻结数量", "code": "freezeNums", "width": "110", "type": "text"},
        {"name": "预占数量", "code": "expectNums", "width": "110", "type": "text"},
        {"name": "可用数量", "code": "okNums", "width": "110", "type": "text"}
      ],
      loadParam: {isHZ: 1},
      uploadOpen:false,
      workList:[],
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
    async initData()
    {
      let that = this;
      this.common.postUrl('wmsBaseTF','getAllWorkStore',{isHZ: 1},function (data) {
        that.workList = data;
      });
    },
    /**
     *
     */
    doQuery() {
      this.$refs.table.load("wmsMaterialPickTF", "queryStockMaterialPage", this.loadParam);
    },
    /**
     * 清空
     */
    clear() {
      this.loadParam = {isHZ: 1};
    },
    uploadSuccess()
    {
      this.doQuery();
      this.uploadOpen=false;
      this.$message.success("库存导入成功！");
    },
    download(){
      this.$refs.table.downloadExcelFile('按物料在库单列表');
    },
  },
}
