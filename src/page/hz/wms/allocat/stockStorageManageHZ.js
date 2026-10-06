import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";

export default {
  name: 'stockStorageManageHZ',
  data() {
    return {
      head: [
        {"name": "仓库", "code": "workStoreName", "width": "110", "type": "text"},
        {"name": "库区", "code": "reservoirName", "width": "110", "type": "text"},
        {"name": "库位", "code": "storageCode", "width": "110", "type": "text"},
        // {"name": "所属货主", "code": "srcTenantName", "width": "110", "type": "text"},
        // {"name": "到货厂商", "code": "fromTenantName", "width": "110", "type": "text"},
        {"name": "入库日期", "code": "inDate", "width": "110", "type": "text"},
        {"name": "供应商批次号", "code": "supplierBatchNum", "width": "110", "type": "text"},
        {"name": "批次号", "code": "batchNum", "width": "110", "type": "text"},
        {"name": "物料编码", "code": "materialNum", "width": "110", "type": "text"},
        {"name": "规格名称", "code": "specsName", "width": "110", "type": "text"},
        {"name": "生产日期", "code": "produceDate", "width": "110", "type": "text"},
        {"name": "过期日期", "code": "expireDate", "width": "110", "type": "text"},
        {"name": "物料描述", "code": "materialDesc", "width": "110", "type": "text"},
        {"name": "最大装载长宽高", "code": "lengthStr", "width": "110", "type": "text"},
        {"name": "箱装容数", "code": "perBoxNums", "width": "110", "type": "text"},
        {"name": "托装容数", "code": "perPalletNums", "width": "110", "type": "text"},
        {"name": "在库数量", "code": "stockNums", "width": "110", "type": "text"},
        {"name": "管理单位", "code": "unitName", "width": "110", "type": "text"}
      ],
      loadParam: {isHZ: 1},
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
    searchList
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
      if(this.common.isNotBlank(this.loadParam.produceDate) && this.loadParam.produceDate.length === 2){
        this.loadParam.startProduceDate = this.loadParam.produceDate[0];
        this.loadParam.endProduceDate = this.loadParam.produceDate[1];
      }else{
        this.loadParam.startProduceDate = '';
        this.loadParam.endProduceDate = '';
      }
      this.$refs.table.load("wmsMaterialPickTF", "queryStockStoragePage", this.loadParam);
    },
    /**
     * 清空
     */
    clear() {
      this.loadParam = {isHZ: 1};
    },
    download(){
      this.$refs.table.downloadExcelFile('按库位在库单列表');
    },
  },
  computed:{
    formData(){
      return [
        {"name":"库区","model":"reservoirName","type":"input","placeholder":"搜索库区","isshow":true},
        {"name":"库位","model":"storageName","type":"input","placeholder":"搜索库位","isshow":true},
        {"name":"批次号","model":"batchNum","type":"input","placeholder":"搜索批次号","isshow":true},
        {"name":"所属货主","model":"srcTenantName","type":"input","placeholder":"搜索所属货主","isshow":true},
        {"name":"到货厂商","model":"fromTenantName","type":"input","placeholder":"搜索到货厂商","isshow":true},
        {"name":"物料编码","model":"materialNum","type":"input","placeholder":"搜索物料编码","isshow":true},
        {"name":"物料描述","model":"materialDesc","type":"input","placeholder":"搜索物料描述","isshow":true},
        {"name":"生产日期","model":"produceDate","type":"daterange","isshow":true},
      ]
    }
  },
}
