import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import selectWork from "@/page/pt/wms/selectWork.vue";
import enumData from "@/page/pt/enum";

export default {
  name: 'stockDtlManage',
  data() {
    return {
      head: [
        {"name": "物料编码", "code": "materialNum", "width": "150", "type": "text"},
        {"name": "物料描述", "code": "materialDesc", "width": "150", "type": "text"},
        {"name": "到货厂商", "code": "fromTenantName", "width": "250", "type": "text"},
        {"name": "所属货主", "code": "srcTenantName", "width": "250", "type": "text"},
        {"name": "批次号", "code": "batchNum", "width": "110", "type": "text"},
        {"name": "供应商批次号", "code": "supplierBatchNum", "width": "110", "type": "text"},
        {"name": "ASN", "code": "asn", "width": "90", "type": "text"},
        {"name": "规格名称", "code": "specsName", "width": "110", "type": "text"},
        {"name": "最大装载长宽高", "code": "lengthStr", "width": "110", "type": "text"},
        {"name": "箱装容数", "code": "perBoxNums", "width": "110", "type": "text"},
        {"name": "托装容数", "code": "perPalletNums", "width": "110", "type": "text"},
        {"name": "生产日期", "code": "produceDate", "width": "110", "type": "text"},
        {"name": "过期日期", "code": "expireDate", "width": "110", "type": "text"},
        {"name": "管理单位", "code": "unitName", "width": "110", "type": "text"},
        {"name": "入库数量", "code": "nums", "width": "110", "type": "text"},
        {"name": "出库汇总", "code": "totalOutNums", "width": "110", "type": "text"},
        {"name": "库存结余", "code": "stockNums", "width": "110", "type": "text"},
      ],
      loadParam: {stockNumsSymbol:'='},
      showSelWork:false,
      symbolOptions: enumData.compareText,
    }
  },
  /**
   * 初始化
   */
  mounted() {
    this.initSelWork();
    this.doQuery();
  },
  /**
   * 组件
   */
  components: {
    tableCommon,
    searchList,
    selectWork
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
    doQuery(query=this.loadParam) {
      this.loadParam = query;
      if(this.common.isNotBlank(this.loadParam.inDate) && this.loadParam.inDate.length === 2){
        this.loadParam.startInDate = this.loadParam.inDate[0];
        this.loadParam.endInDate = this.loadParam.inDate[1];
      }else{
        this.loadParam.startInDate = '';
        this.loadParam.endInDate = '';
      }
      if(this.common.isNotBlank(this.loadParam.produceDate) && this.loadParam.produceDate.length === 2){
        this.loadParam.startProduceDate = this.loadParam.produceDate[0];
        this.loadParam.endProduceDate = this.loadParam.produceDate[1];
      }else{
        this.loadParam.startProduceDate = '';
        this.loadParam.endProduceDate = '';
      }
      if(this.common.isNotBlank(this.loadParam.expireDate) && this.loadParam.expireDate.length === 2){
        this.loadParam.startExpireDate = this.loadParam.expireDate[0];
        this.loadParam.endExpireDate = this.loadParam.expireDate[1];
      }else{
        this.loadParam.startExpireDate = '';
        this.loadParam.endExpireDate = '';
      }
      this.$refs.table.load("wmsMaterialPickTF", "queryStockDtlPage", this.loadParam);
    },
    /**
     * 清空
     */
    clear() {
      this.loadParam = {};
    },
    download(){
      this.$refs.table.downloadExcelFile('库存结余明细列表');
    },
  },
  computed:{
    formData(){
      return [
        {"name":"所属货主","model":"srcTenantName","type":"input","placeholder":"搜索所属货主","isshow":true},
        {"name":"ASN","model":"asn","type":"input","placeholder":"搜索asn","isshow":true},
        {"name":"到货厂商","model":"fromTenantName","type":"input","placeholder":"搜索到货厂商","isshow":true},
        {"name":"物料编码","model":"materialNum","type":"input","placeholder":"搜索物料编码","isshow":true},
        {"name":"物料描述","model":"materialDesc","type":"input","placeholder":"搜索物料描述","isshow":true},
        {"name":"批次号","model":"batchNum","type":"input","placeholder":"搜索批次号","isshow":true},
        {"name":"生产日期","model":"produceDate","type":"daterange","isshow":true},
        {"name":"过期日期","model":"expireDate","type":"daterange","isshow":true},
        {"name":"库存结余","model":"stockNumsSymbolItem","isshow":true,
          children:[
            {"model":"stockNumsSymbol","options":this.symbolOptions,"label":"label","value":"value","clearable":true},
            {"model":"stockNums"}]
        },
      ]
    }
  },
}
