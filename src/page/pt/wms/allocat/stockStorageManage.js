import tableCommon from "@/components/table/tableCommon.vue";
import searchList from "@/components/searchList/searchList.vue";
import enumData from "@/page/pt/enum";

export default {
  name: 'stockStorageManage',
  data() {
    return {
      head: [
        {"name": "库区", "code": "reservoirName", "width": "110", "type": "text"},
        {"name": "库位", "code": "storageCode", "width": "110", "type": "text"},
        {"name": "所属货主", "code": "srcTenantName", "width": "250", "type": "text"},
        {"name": "到货厂商", "code": "fromTenantName", "width": "250", "type": "text"},
        // {"name": "入库日期", "code": "inDate", "width": "110", "type": "text"},
        {"name": "供应商批次号", "code": "supplierBatchNum", "width": "110", "type": "text"},
        {"name": "批次号", "code": "batchNum", "width": "110", "type": "text"},
        {"name": "ASN", "code": "asn", "width": "90", "type": "text"},
        {"name": "物料编码", "code": "materialNum", "width": "150", "type": "text"},
        {"name": "规格名称", "code": "specsName", "width": "110", "type": "text"},
        {"name": "生产日期", "code": "produceDate", "width": "110", "type": "text"},
        {"name": "过期日期", "code": "expireDate", "width": "110", "type": "text"},
        {"name": "物料描述", "code": "materialDesc", "width": "110", "type": "text"},
        {"name": "最大装载长宽高", "code": "lengthStr", "width": "110", "type": "text"},
        {"name": "箱装容数", "code": "perBoxNums", "width": "110", "type": "text"},
        {"name": "托装容数", "code": "perPalletNums", "width": "110", "type": "text"},
        {"name": "在库数量", "code": "stockNums", "width": "110", "type": "text"},
        {"name": "预占数量", "code": "expectNums", "width": "110", "type": "text"},
        {"name": "可用数量", "code": "okNums", "width": "110", "type": "text"},
        {"name": "异常数量", "code": "errorNums", "width": "110", "type": "text"},
        {"name": "管理单位", "code": "unitName", "width": "110", "type": "text"},
        {"name": "是否冻结", "code": "freezeStateName", "width": "110", "type": "text"},
      ],
      loadParam: {},
      modifyDialogShow: false,
      modifyDialogShow2:false,
      modifyDialogShow3:false,
      info: {},

      dialogShow:false,
      allocatInfo:{
        items:[],
      },
      newReservoirList: [],//库区下拉数据
      whetherData:[],
      useSapStockNums:false,
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
    async initData() {
      this.newReservoirList = await this.common.postUrl("wmsReservoirTF", "getReservoirDataSel", {});
      this.whetherData = await this.common.postUrl("commonTF", "getSysStaticData", {codeType: "WHETHER"});
      this.initHead();
    },
    initHead(){
      let userInfo = this.common.userInfo();
      if(userInfo.useSapStockNums==1){
        for (let i = 0; i < this.head.length; i++) {
          if(this.head[i].code=='errorNums'){
            let entityIds = localStorage.getItem("entityIds").split(",");
            let isEntity = false;
            entityIds.forEach(item => {
              if(1005230==item){
                isEntity = true;
              }
            })
            if(isEntity){
              this.head.splice(i+1, 0, {"name": "SAP登记库存数量", "code": "sapStockNums", "width": "110", "type": "diy"});
            }else{
              this.head.splice(i+1, 0, {"name": "SAP登记库存数量", "code": "sapStockNums", "width": "110", "type": "text"});
            }
            this.head.splice(i+2, 0, {"name": "SAP登记预占数量", "code": "sapStockExpectNums", "width": "110", "type": "text"});
            this.head.splice(i+3, 0, {"name": "SAP登记可用数量", "code": "sapStockOkNums", "width": "110", "type": "text"});
            break;
          }
        }
        this.useSapStockNums = true;
      }else{
        this.head = this.head.filter(item => item.code !=='sapStockNums'&&item.code !=='sapStockExpectNums'&&item.code !=='sapStockOkNums');
        this.useSapStockNums = false;
      }
      let that = this;
      this.$nextTick(() => {
        that.$refs.table.initHead();
      });
    },
    saveSapStockNums(item){
      let that  = this;
      if(item.sapStockNums>item.okNums){
        this.$message.error("不能大于可用数量");
        return;
      }
      this.common.postUrl('wmsMaterialPickTF', 'saveSapStockNums', item, function (data) {
        if (data) {
          that.doQuery();
          that.$message.success('更新成功');
        }
      });
    },

    /**
     * 查询列表
     */
    doQuery(query=this.loadParam) {
      this.loadParam = query;
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
      this.loadParam = {};
    },
    download(){
      this.$refs.table.downloadExcelFile('按库位在库单列表');
    },
    modify(){
      let selectData = this.$refs.table.getSelectItem();
      if (selectData.length ==0) {
        this.$message.error("请至少选择一条数据！");
        return;
      }
      for (let i = 0; i < selectData.length; i++) {
        if (selectData[i].newScanQrcode == 1) {
          this.$message.error("新条码不允许修改批次！");
          return;
        }
      }
      if (selectData.length ==1) {
        this.info = this.common.copyObj(selectData[0]);
        this.modifyDialogShow = true;
      }else{
        let materialNum = selectData[0].materialNum;
        for (let i = 0; i < selectData.length; i++) {
          if(materialNum!= selectData[i].materialNum){
            this.$message.error("请选择相同物料！");
            return;
          }
        }
        this.info={};
        this.info.items = selectData;
        let that = this;
        this.$nextTick(() => {
          that.$refs.table2.changeTop(1);
          that.$refs.table2.resetData(selectData);
        });
        this.modifyDialogShow3 = true;
      }
    },
    close(){
      this.modifyDialogShow = false;
    },
    saveBatchNumModfiy(){
      let that = this;
      that.common.postUrl("wmsMaterialPickTF","batchNumModfiy", that.info, function (data_) {
        if (that.common.isNotBlank(data_)) {
          that.$message.success('修改成功');
          that.close();
          that.doQuery();
        }
      },null,'',true);
    },
    save3(){
      let that = this;
      that.common.postUrl("wmsMaterialPickTF","batchNumBatchModfiy", that.info, function (data_) {
        if (that.common.isNotBlank(data_)) {
          that.$message.success('修改成功');
          that.close3();
          that.doQuery();
        }
      },null,'',true);
    },
    modify2(){
      let selectData = this.$refs.table.getSelectItem();
      if (selectData.length !=1) {
        this.$message.error("请先选择一条数据！");
        return;
      }
      this.info = this.common.copyObj(selectData[0]);
      this.modifyDialogShow2 = true;
    },
    close2(){
      this.modifyDialogShow2 = false;
    },
    close3(){
      this.modifyDialogShow3 = false;
    },
    save2(){
      let that = this;
      that.common.postUrl("wmsMaterialPickTF","produceDateModfiy", that.info, function (data_) {
        if (that.common.isNotBlank(data_)) {
          that.$message.success('修改成功');
          that.close2();
          that.doQuery();
        }
      },null,'',true);
    },
    batchGenerateBar(){
      let selectData = this.$refs.table.getSelectItem();
      if (selectData.length <=0) {
        this.$message.error("请选择需要生成条码的数据！");
        return false;
      }
      let ids = [];
      for (let i = 0; i < selectData.length; i++) {
        if(selectData[i].scanQrcode!=1){
          this.$message.error("请选择需要扫码的数据！");
          return false;
        }
        if(selectData[i].stockNums<=selectData[i].totalNums){
          this.$message.error("第"+(i+1)+"条数据的库存已经全部生成条码！");
          return;
        }
        ids.push(selectData[i].id);
      }

      this.$emit('openTab', {
        urlName: '批量生成条码',
        urlId: new Date().getTime(),
        urlPathName: "/batchGenerateBar",
        urlPath: "/pt/wms/allocat/qrcode/batchGenerateBar.vue",
        query:{ids}
      });
    },
    generateBar(){
      let selectData = this.$refs.table.getSelectItem();
      if (selectData.length !==1) {
        this.$message.error("请选择一条需要生成条码的数据！");
        return false;
      }
      if(selectData[0].scanQrcode!=1){
        this.$message.error("请选择需要扫码的数据！");
        return false;
      }
      if(selectData[0].stockNums<=selectData[0].totalNums){
        this.$message.error("该数据的库存已经全部生成条码！");
        return;
      }

      this.$emit('openTab', {
        urlName: '生成条码',
        urlId: new Date().getTime(),
        urlPathName: "/generateBar",
        urlPath: "/pt/wms/allocat/qrcode/generateBar.vue",
        query:{ids:[selectData[0].id]}
      });
    },
    dbViewQrcodeBars(data){
      if(data.totalNums<=0){
        this.$message.error("该数据没有生成条码！");
        return;
      }
      this.$emit('openTab', {
        urlName: '查看条码',
        urlId: new Date().getTime(),
        urlPathName: "/viewQrcodeBars",
        urlPath: "/pt/wms/allocat/qrcode/viewQrcodeBars.vue",
        query:{id:data.id,isNew: data.newScanQrcode}
      });
    },
    viewQrcodeBars(){
      let selectData = this.$refs.table.getSelectItem();
      if (selectData.length !==1) {
        this.$message.error("请选择一条需要查看条码的数据！");
        return false;
      }
      if(selectData[0].totalNums<=0){
        this.$message.error("该数据没有生成条码！");
        return;
      }
      if(selectData[0].newScanQrcode == 0){   //旧条码
        this.$emit('openTab', {
          urlName: '查看条码',
          urlId: new Date().getTime(),
          urlPathName: "/viewQrcodeBars",
          urlPath: "/pt/wms/allocat/qrcode/viewQrcodeBars.vue",
          query:{id:selectData[0].id,isNew: selectData[0].newScanQrcode}
        });
      }else{  //新条码
        this.$emit("openTab",{
          urlId: "printTagCode_"+selectData[0].id,
          query: {stockMaterialDtlId: selectData[0].id,type:3},
          urlName: '标签预览',
          urlPathName: "/printTagCode",
          urlPath: '/pt/wms/ord/printTagCode.vue'});
      }
    },
    printQrcodeBars(){
      let selectData = this.$refs.table.getSelectItem();
      if (selectData.length !==1) {
        this.$message.error("请选择一条需要打印条码的数据！");
        return false;
      }
      if(selectData[0].totalNums<=0){
        this.$message.error("该数据没有生成条码！");
        return;
      }

      this.$emit('openTab', {
        urlName: '打印条码',
        urlId: new Date().getTime(),
        urlPathName: "/codePrintView",
        urlPath: "/pt/wms/allocat/qrcode/codePrintView.vue",
        query:{stockMaterialDtlId:selectData[0].id,isNew: selectData[0].newScanQrcode}
      });
    },

    showAllocat(){
      let selectData = this.$refs.table.getSelectItem();
      if (selectData.length !==1) {
        this.$message.error("请选择一条需要移库操作的数据！");
        return
      }
      this.allocatInfo = this.common.copyObj(selectData[0]);
      this.allocatInfo.items=[];
      this.add();
      if(this.allocatInfo.scanQrcode==1){
        this.allocatInfo.items[0].nums = this.allocatInfo.stockNums;
        this.allocatInfo.items[0].sapNums = this.allocatInfo.sapStockNums;
      }
      if(this.allocatInfo.newScanQrcode==1){
        this.allocatInfo.items[0].nums = this.allocatInfo.stockNums;
        this.allocatInfo.items[0].sapNums = this.allocatInfo.sapStockNums;
      }

      this.showDialog(true);
    },
    freeze(){
      let selectData = this.$refs.table.getSelectItem();
      if (selectData.length !== 1) {
        this.$message.error("请选择一条需要冻结操作的数据！");
        return
      }
      if(selectData[0].freezeState!=0){
        this.$message.error("选择的数据是冻结状态！");
        return
      }
      this.$confirm("是否确认冻结该库存？", "提示").then(async () =>{
        await this.common.postUrl("wmsAllocatTF", "freeze", selectData[0], null, null, '', true);
        this.$message.success("冻结成功！");
        await this.doQuery();
      }).catch(() =>{
        //取消
      });
    },
    async unfreeze() {
      let selectData = this.$refs.table.getSelectItem();
      if (selectData.length !== 1) {
        this.$message.error("请选择一条需要解冻操作的数据！");
        return
      }
      if(selectData[0].freezeState!=1){
        this.$message.error("选择的数据不是冻结状态！");
        return
      }
      this.$confirm("是否确认解冻该库存？", "提示").then(async () =>{
        await this.common.postUrl("wmsAllocatTF", "unfreeze", selectData[0], null, null, '', true);
        this.$message.success("解冻成功！");
        await this.doQuery();
      }).catch(() =>{
        //取消
      });

    },
    /**
     * 库存调拨
     */
    async sureRecord() {
      let map = new Map();
      for (let i = 0; i < this.allocatInfo.items.length; i++)
      {
        let item = this.allocatInfo.items[i];
        if (this.common.isBlank(item.toReservoirId))
        {
          this.$message.error("请选择第" + (i + 1) + "行的新库区！");
          return false;
        }
        if (this.common.isBlank(item.toStorageId))
        {
          this.$message.error("请选择第" + (i + 1) + "行的新库位！");
          return false;
        }
        if (this.common.isBlank(item.nums))
        {
          this.$message.error("请输入第" + (i + 1) + "行的移库数量！");
          return false;
        }
        let numsSum = map.get(item.id);
        if (this.common.isBlank(numsSum)) numsSum = 0;
        if (Number(item.nums) + numsSum > this.allocatInfo.stockNums)
        {
          this.$message.error("批次号：" + this.allocatInfo.batchNum + "移库的总数量超过批次的库存！");
          return false;
        }
        map.set(item.id, numsSum + Number(item.nums));
      }
      await this.common.postUrl("wmsAllocatTF", "saveAllocatNew", this.allocatInfo, null,null,'',true);
      this.$message.success("移库成功！");
      await this.doQuery();
      await this.showDialog(false);
    },

    showDialog(flag){
      this.dialogShow = flag;
    },
    /**
     * 添加
     */
    add()
    {
      this.allocatInfo.items.push({freezeState:0});
      this.$forceUpdate();
    },
    /**
     * 移除
     * @param index
     */
    remove(index)
    {
      if (this.allocatInfo.items.length > 1)
        this.allocatInfo.items.splice(index, 1);
      this.$forceUpdate();
    },
    /**
     * 改变是否冻结
     * @param item
     */
    changeSwitch(item)
    {
      item.freezeState = item.freezeState == 1 ? 0 : 1;
      this.$forceUpdate();
    },
    forceUpdate(){
      this.$forceUpdate();
    },
    /**
     * 通过库区加载库位集合
     * @returns {Promise<*[]>}
     */
    async loadStorageListByReservoirId(item)
    {
      let data = [];
      if (this.common.isNotBlank(item.toReservoirId)){
        data = await this.common.postUrl("wmsReservoirTF", "queryStorageListByReservoirId", {reservoirId: item.toReservoirId});
      }
      item.toStorageId = '';
      item.newStorageList = data;
      this.$forceUpdate();
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
        urlId: 'stockMaterialDtl' + 'Detail' + data.id,
        query: {
          logId: data.id,
          logType: enumData.LOG_TYPE.STOCK_MATERIAL_DTL,
        },
        urlName: "物料库存明细" + "操作日志",
        urlPathName: "/operateLog",
        urlPath: "/pt/operateLog/operateLog.vue"});
    },

  },
  computed:{
    formData(){
      return [
        {"name":"库区","model":"reservoirName","type":"input","placeholder":"搜索库区","isshow":true},
        {"name":"库位","model":"storageName","type":"input","placeholder":"搜索库位","isshow":true},
        {"name":"批次号","model":"batchNum","type":"textarea","placeholder":"搜索批次号","isshow":true},
        {"name":"供应商批次号","model":"supplierBatchNum","type":"input","placeholder":"供应商批次号","isshow":true},
        {"name":"所属货主","model":"srcTenantName","type":"input","placeholder":"搜索所属货主","isshow":true},
        {"name":"到货厂商","model":"fromTenantName","type":"input","placeholder":"搜索到货厂商","isshow":true},
        {"name":"物料编码","model":"materialNum","type":"input","placeholder":"搜索物料编码","isshow":true},
        {"name":"物料描述","model":"materialDesc","type":"input","placeholder":"搜索物料描述","isshow":true},
        {"name":"生产日期","model":"produceDate","type":"daterange","isshow":true},
        {"name":"是否冻结","model":"freezeState","type":"select","options":this.whetherData,"label":"codeName","value":"codeValue","placeholder":"是否冻结","method":"doQuery","isshow":true},
        {"name":"标签编号","model":"codeNum","type":"input","placeholder":"标签编号","isshow":true},
        {"name":"客户码编号","model":"custCodeNum","type":"input","placeholder":"客户码编号","isshow":true},
      ]
    }
  },
}
