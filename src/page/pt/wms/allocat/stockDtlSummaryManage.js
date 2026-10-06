import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import selectWork from "@/page/pt/wms/selectWork.vue";
import enumData from "@/page/pt/enum";

export default {
  name: 'stockDtlSummaryManage',
  data() {
    return {
      head: [
        {"name": "库存日期", "code": "rptDate", "width": "150", "type": "text"},
        {"name": "物料编码", "code": "materialNum", "width": "150", "type": "text"},
        {"name": "物料名称", "code": "materialDesc", "width": "150", "type": "text"},
        {"name": "供应商名称", "code": "srcTenantName", "width": "250", "type": "text"},
        {"name": "单位", "code": "unitName", "width": "110", "type": "text"},
        {"name": "入库总数", "code": "inNums", "width": "110", "type": "text"},
        {"name": "出库总数", "code": "outNums", "width": "110", "type": "text"},
        {"name": "期初库存", "code": "initStockNums", "width": "110", "type": "text"},
        {"name": "当时库存数量", "code": "stockNums", "width": "110", "type": "text"},
        {"name": "当时库存箱数", "code": "stockBoxNums", "width": "110", "type": "text"},
        {"name": "当时库存托数", "code": "stockPalletNums", "width": "110", "type": "text"},
        {"name": "即时库存数量", "code": "nowStockNums", "width": "110", "type": "text"},
        {"name": "即时库存箱数", "code": "nowStockBoxNums", "width": "110", "type": "text"},
        {"name": "即时库存托数", "code": "nowStockPalletNums", "width": "110", "type": "text"},
        {"name": "箱装容数", "code": "perBoxNums", "width": "110", "type": "text"},
        {"name": "整托收容数", "code": "perPalletNums", "width": "110", "type": "text"},
      ],
      loadParam: {stockNumsSymbol:'=',rptDate:[]},
      showSelWork:false,
      symbolOptions: enumData.compareText,
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
      if(this.common.isNotBlank(this.loadParam.rptDate) && this.loadParam.rptDate.length==2){
        this.loadParam.startDate = this.loadParam.rptDate[0];
        this.loadParam.endDate = this.loadParam.rptDate[1];
      }else{
        this.loadParam.startDate = '';
        this.loadParam.endDate = '';
      }
      this.$refs.table.load("wmsMaterialPickTF", "queryStockDtlSummaryPage", this.loadParam);
    },
    /**
     * 清空
     */
    clear() {
      this.loadParam = {};
    },
    download(){
      // 后端导出
      let queryUrl = 'wmsMaterialPickTF|queryStockDtlSummaryPage';
      let excelKeys='rptDate*,materialNum,materialDesc,srcTenantName,unitName,inNums@,outNums@,initStockNums@,code2,code3,stockNums@,stockBoxNums@,perBoxNums,perPalletNums,remark';
      let excelLables='库存日期,物料编码,物料名称,供应商名称,单位,入库总数,出库总数,期初库存,良品结存,不良品数量,即时库存数量,库存箱数,箱装容数,整托收容数,备注';
      this.common.downloadExcelFile(queryUrl,this.loadParam,excelLables,excelKeys,'库存结余汇总列表','stockDtlSummaryManageTable');
    },
  },
  computed:{
    formData(){
      return [
        {"name":"库存日期","model":"rptDate","type":"daterange","isshow":true},
        {"name":"供应商名称","model":"srcTenantName","type":"input","placeholder":"搜索供应商名称","isshow":true},
        {"name":"物料编码","model":"materialNum","type":"input","placeholder":"搜索物料编码","isshow":true},
        {"name":"物料名称","model":"materialDesc","type":"input","placeholder":"搜索物料名称","isshow":true},
        {"name":"库存结余","model":"stockNumsSymbolItem","isshow":true,
          children:[
            {"model":"stockNumsSymbol","options":this.symbolOptions,"label":"label","value":"value","clearable":true},
            {"model":"stockNums"}]
        },
      ]
    }
  },
}
