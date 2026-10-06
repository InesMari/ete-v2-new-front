import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import selectWork from "@/page/pt/wms/selectWork.vue";
import enumData from "@/page/pt/enum";

export default {
  name: 'qrcodeManage',
  data() {
    return {
      head: [
        {"name": "条码编号", "code": "codeNum", "width": "120", "type": "text"},
        {"name": "条码", "code": "qrcodeUrl", "width": "180", "type": "diy"},
        {"name": "入库时代条码编号", "code": "inCodeNum", "width": "120", "type": "text"},
        {"name": "入库时代条码", "code": "inQrcodeUrl", "width": "180", "type": "diy"},
        {"name": "物料编码", "code": "materialNum", "width": "150", "type": "text"},
        {"name": "物料描述", "code": "materialDesc", "width": "150", "type": "text"},
        {"name": "规格名称", "code": "specsName", "width": "110", "type": "text"},
        {"name": "是否尾数", "code": "isRemainderName", "width": "110", "type": "text"},
        {"name": "库区", "code": "reservoirName", "width": "110", "type": "text"},
        {"name": "库位", "code": "storageCode", "width": "110", "type": "text"},
        {"name": "所属货主", "code": "srcTenantName", "width": "250", "type": "text"},
        {"name": "到货厂商", "code": "fromTenantName", "width": "250", "type": "text"},
        // {"name": "入库日期", "code": "inDate", "width": "110", "type": "text"},
        {"name": "供应商批次号", "code": "supplierBatchNum", "width": "110", "type": "text"},
        {"name": "批次号", "code": "batchNum", "width": "110", "type": "text"},
        {"name": "ASN", "code": "asn", "width": "90", "type": "text"},
        {"name": "生产日期", "code": "produceDate", "width": "110", "type": "text"},
        {"name": "过期日期", "code": "expireDate", "width": "110", "type": "text"},
        // {"name": "物料描述", "code": "materialDesc", "width": "110", "type": "text"},
        {"name": "最大装载长宽高", "code": "lengthStr", "width": "110", "type": "text"},
        {"name": "箱装容数", "code": "perBoxNums", "width": "110", "type": "text"},
        {"name": "托装容数", "code": "perPalletNums", "width": "110", "type": "text"},
        {"name": "条码数量", "code": "qrcodeNums", "width": "110", "type": "text"},
        {"name": "管理单位", "code": "unitName", "width": "110", "type": "text"}
      ],
      loadParam: {},
      showSelWork:false,
      isRemainderData:[],
      qrcodeModifyShow:false,
      info:{},
    }
  },
  /**
   * 初始化
   */
  mounted() {
    this.initSelWork();
    this.doQuery();
    this.init();
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
    init() {
      let that = this;
      //入库状态
      this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"}, function (data) {
        that.isRemainderData = data;
      });
    },
    /**
     * 查询列表
     */
    async doQuery(query = this.loadParam) {
      this.loadParam = query;
      await this.$refs.table.load("wmsStockMaterialTF", "queryStockMaterialQrcodePage", this.loadParam);
      this.$nextTick(() => {
        this.$refs.table.resetTrHeight();
      });
    },
    /**
     * 清空
     */
    clear() {
      this.loadParam = {};
    },
    mergeGenerateBar(){
      let selectData = this.$refs.table.getSelectItem();
      if (selectData.length <=1) {
        this.$message.error("请选择需要合并生成条码的数据！");
        return false;
      }
      let ids = [];
      let stockDtlId = selectData[0].stockDtlId;
      for (let i = 0; i < selectData.length; i++) {
        if(stockDtlId!==selectData[i].stockDtlId){
          this.$message.error("不同物料库存的货物条码不能合并！");
          return false;
        }
        if(selectData[i].isRemainder==0){
          this.$message.error("不是尾数不能合并！");
          return false;
        }
        ids.push(selectData[i].id);
      }
      this.$emit('openTab', {
        urlName: '合并条码',
        urlId: new Date().getTime(),
        urlPathName: "/mergeGenerateBar",
        urlPath: "/pt/wms/allocat/qrcode/mergeGenerateBar.vue",
        query:{ids}
      });
    },
    codePrint(){
      let selectData = this.$refs.table.getSelectItem();
      if (selectData.length <1) {
        this.$message.error("请选择需要打印条码的数据！");
        return false;
      }
      let ids = [];
      for (let i = 0; i < selectData.length; i++) {
        ids.push(selectData[i].id);
      }
      this.$emit('openTab', {
        urlName: '打印条码',
        urlId: new Date().getTime(),
        urlPathName: "/codePrintView",
        urlPath: "/pt/wms/allocat/qrcode/codePrintView.vue",
        query:{ids}
      });
    },
    dblclickItem(data){
      this.$emit('openTab', {
        urlName: '查看条码',
        urlId: new Date().getTime(),
        urlPathName: "/codeDetail",
        urlPath: "/pt/wms/allocat/qrcode/codeDetailMain.vue",
        query:{id:data.id,
          logId: data.id,
          logType: enumData.LOG_TYPE.STOCK_CODE,
        }
      });
    },
    download(){
      this.$refs.table.downloadExcelFile('按库位在库条码列表');
    },
    showQrcodeModify(flag){
      this.qrcodeModifyShow = flag;
    },
    qrcodeModify(){
      let selectData = this.$refs.table.getSelectItem();
      if (selectData.length !==1) {
        this.$message.error("请选择一条需要修改的数据！");
        return false;
      }
      this.info = this.common.copyObj(selectData[0]);
      this.showQrcodeModify(true);
    },
    async sureQrcodeModify() {
      await this.common.postUrl('wmsStockMaterialTF', 'qrcodeModify', this.info, null, null, null, true);
      this.$message.success("修改成功")
      this.showQrcodeModify(false);
      this.doQuery();
    }
  },
  computed:{
    formData(){
      return [
        {"name":"条码编号","model":"codeNum","type":"textarea","placeholder":"搜索条码编号","isshow":true},
        {"name":"物料编码","model":"materialNum","type":"input","placeholder":"搜索物料编码","isshow":true},
        {"name":"库区","model":"reservoirName","type":"input","placeholder":"搜索库区","isshow":true},
        {"name":"库位","model":"storageName","type":"input","placeholder":"搜索库位","isshow":true},
        {"name":"批次号","model":"batchNum","type":"textarea","placeholder":"搜索批次号","isshow":true},
        {"name":"ASN","model":"asn","type":"input","placeholder":"搜索ASN","isshow":true},
        {"name":"是否尾数","model":"isRemainder","type":"select","options":this.isRemainderData,"label":"codeName","value":"codeValue","placeholder":"是否尾数","method":"doQuery","isshow":true},
      ]
    }
  },
}
