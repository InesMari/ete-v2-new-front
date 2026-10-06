import tableCommon from "@/components/table/tableCommon.vue"
import mapDialog from "@/components/mapDialog/mapDialog.vue";
import enumData from "@/page/pt/enum";
import searchList from "@/components/searchList/searchList.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
  name: 'transitList',
  data() {
    return {
      head: [
        {"name":"订单号","code":"ORDER_NUM","width":"150","type" : "text"},
        {"name":"派车单号","code":"WAYBILL_NUM","width":"150","type" : "text"},
        {"name": "派车状态", "code": "waybillStateName", "width": "80", "type": "text"},
        {"name":"外发单号","code":"DELIVERY_ORDER_NO","width":"120","type" : "text"},
        {"name":"下单客户","code":"CUST_NAME","width":"180","type" : "text"},
        {"name": "调度时间", "code": "createDate", "width": "150", "type": "text"},
        {"name": "客户下单时间", "code": "CUSTOMER_ORDER_DATE", "width": "150", "type": "text"},
        {"name":"跟踪节点","code":"TRANSIT_OP_NODE_NAME","width":"80","type" : "text"},
        // {"name":"提货点","code":"WORK_NAME","width":"150","type" : "text"},
        {"name":"起始地","code":"WORK_NAME","width":"150","type" : "text"},
        {"name":"目的地","code":"UNLOAD_WORK_NODE_NAME","width":"150","type" : "text"},
        {"name":"调度件数","code":"GOODS_COUNT","width":"150","type" : "text"},
        {"name":"调度数量","code":"GOODS_WEIGHT","width":"150","type" : "text"},
        {"name":"调度体积","code":"GOODS_VOLUME","width":"150","type" : "text"},
        {"name":"干线运费","code":"TRANSIT_FEE","width":"100","type":"text"},
        {"name":"提货费","code":"PICKUP_FEE","width":"100","type" : "text"},
        {"name":"送货费","code":"DELIVERY_FEE","width":"100","type" : "text"},
        // {"name":"装货费","code":"LOADING_FEE","width":"100","type" : "text"},
        // {"name":"卸货费","code":"DISCHARGE_FEE","width":"100","type" : "text"},
        // {"name":"其他费","code":"OTHER_FEE","numberic":"4","width":"90","type" : "text"},
        {"name": "下单金额合计", "code": "totalFee", "width": "80", "type": "text",isSum:true},
        {"name": "异动金额合计", "code": "statementFee", "width": "80", "type": "text",isSum:true},
        {"name": "补费金额合计", "code": "makeupFee", "width": "80", "type": "text",isSum:true},
        {"name": "费用合计", "code": "amount", "width": "80", "type": "text",isSum:true},
          {"name": "支付状态","code":"payStateName","width":"100", "type": "text"},
          {"name":"现付","code":"PRE_PAY","width":"80","type" : "text"},
        {"name":"到付","code":"AFTER_PAY","width":"80","type" : "text"},
        {"name":"周期付","code":"PERIODICAL_PAY","width":"100","type" : "text"},
        {"name":"周期天数","code":"PERIODICAL_DAY","width":"100","type" : "text"},
        {"name":"是否入账","code":"ENTRY_BILL_FLAG","width":"100","type" : "text"},
        {"name": "账单编号", "code": "BILL_NUM", "width": "160", "type": "text"},
        {"name":"是否生成报表","code":"ENTRY_REPORT_FLAG","width":"100","type" : "text"},
        {"name":"是否开票","code":"IS_INVOICE_NAME","width":"100","type" : "text"},
        {"name":"干线供应商","code":"TRANSIT_SUPPLIER_NAME","width":"100","type" : "text"},
        {"name":"联系人","code":"SUPLIER_LINK_MAN","width":"100","type" : "text"},
        {"name":"联系电话","code":"SUPLIER_LINK_PHONE","width":"100","type" : "text"},
        {"name":"提货车辆","code":"PICK_PLATE_NUMBER","width":"100","type" : "text"},
        {"name":"提货司机","code":"PICK_DRIVER_NAME","width":"100","type" : "text"},
        {"name":"提货司机电话","code":"PICK_LINK_PHONE","width":"100","type" : "text"},
        {"name":"干线车辆","code":"TRUNK_PLATE_NUMBER","width":"100","type" : "text"},
        {"name":"干线司机","code":"TRUNK_DRIVER_NAME","width":"100","type" : "text"},
        {"name":"干线司机电话","code":"TRUNK_LINK_PHONE","width":"100","type" : "text"},
        {"name":"送货车辆","code":"DELIVERY_PLATE_NUMBER","width":"100","type" : "text"},
        {"name":"送货司机","code":"DELIVERY_DRIVER_NAME","width":"100","type" : "text"},
        {"name":"送货司机电话","code":"DELIVERY_LINK_PHONE","width":"100","type" : "text"},
        {"name":"备注","code":"REMARK","width":"200","type" : "text"},
        {"name":"下单人员","code":"ORDER_PERSONNEL_NAME","width":"200","type" : "text"},
        {"name": "审核状态", "code": "verifyStateName", "width": "120", "type": "text"},
        {"name": "审核人", "code": "verifyUserName", "width": "100", "type": "text"},
        {"name": "审核时间", "code": "verifyDate", "width": "150", "type": "text"},
      ],
      query:{
        CUST_NAME: this.$route.query.tenantName,//客户详情中转管理跳转
        PICK_PLATE_NUMBER: '',
        PICK_DRIVER_NAME: '',
        TRANSIT_PLATE_NUMBER: '',
        TRANSIT_DRIVER_NAME: '',
        DELIVERY_PLATE_NUMBER: '',
        DELIVERY_DRIVER_NAME: '',
        TRANSIT_SUPPLIER_ID: this.$route.query.supplierId,
        ORDER_NUM: '',
        TRANSIT_OP_NODE: '',
        transitDate: '',
        WAYBILL_NUM: '',
        ENTRY_BILL_FLAG: '',
        ENTRY_REPORT_FLAG: '',
        IS_INVOICE: '',
        verifyState:'',
      },
      dicTransitOpNode: [],
      dic_whether: [],
      waybillStateOptions: [],
      supplierList: [],
      showLimitDeploy:false,
      showAddClient:false,
      showCheckInfo:false,
      showUpload:false,
      dialogVisible:false,
      pickerOptions: enumData.DATE_RANGE_SHORTCUT_OPTIONS,
      orderData: [],
      waybillWorkData: [],
      showReceipts: false,//上传回单
      receipts: this.initReceipts(),
      showFeeMoveDialog: false,//中转费用异动
      waybillStatementList: {},//中转费用异动
      feeMoveTotalInfo: {
        transitFeeSum: 0,
        transitOtherFeeSum: 0,
        pickupFeeSum: 0,
        deliveryFeeSum: 0,
        totalFeeSum: 0,
      },
      feeInfo: {
        waybillId : '',
        transitPickupFee : '',
        transitDeliveryFee : '',
        transitFee : '',
        totalTransitFee : '',
      },
      showTrackDialog: false,//中转跟踪
      trackInfo: {
        waybillId : '',
        transitOpNode : '',
        transitOpContent : '',
        actArrivalTime : '',
        transitLocation : '',
      },
      ordTransitDetailList: [],
      transitOrderData: '',
      isShowMap: false,//显示地图
      mapPoint:null,
      showMapBotton: false,//地图按钮显示
      verifyStateData:[{codeValue:0,codeName:'未审核'},{codeValue:1,codeName:'已审核'}],

      list:[{}],

    }
  },
  mounted() {
    this.initData();
    this.doQuery();
    this.$refs.table.resetTableLeft();
  },
  components: {
    tableCommon,
    mapDialog,
    searchList,
    myFileModel
  },
  methods: {
    /**
     * 初始化数据
     */
    initData(){
      let that = this;
      let codeTypes = 'TRANSIT_OP_NODE,WAYBILL_STATE,WHETHER';
      this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': codeTypes}, function (data) {
          that.dicTransitOpNode = data.TRANSIT_OP_NODE;
          that.waybillStateOptions = data.WAYBILL_STATE;
          that.dic_whether = data.WHETHER;
      });

      this.common.postUrl("supplierTF", "queryAllSupplierList", {}, function (data) {
        that.supplierList = data;
        // that.supplierList.unshift({codeValue:'',codeName:''});
      });
    },

    /**
     * 查询列表数据
     */
    doQuery(query=this.query){
      this.query = query;
      if(this.common.isNotBlank(this.query.customerOrderDate) && this.query.customerOrderDate.length === 2){
        this.query.startCustomerOrderDate = this.query.customerOrderDate[0];
        this.query.endCustomerOrderDate = this.query.customerOrderDate[1];
      }else{
        this.query.startCustomerOrderDate = '';
        this.query.endCustomerOrderDate = '';
      }
      if(this.common.isNotBlank(this.query.transitDate) && this.query.transitDate.length === 2){
        this.query.startTransitDate = this.query.transitDate[0];
        this.query.endTransitDate = this.query.transitDate[1];
      }else{
        this.query.startTransitDate = '';
        this.query.endTransitDate = '';
      }
      this.$refs.table.load("transitManageTF", "queryOrdTransitPage", this.query);
    },

    /**
     * 跳转中转调度页面
     * @returns {Promise<void>}
     */
    async toTransitDispatch() {
      let dispatchType = 4;
      let dispatchName = await this.common.postUrl("ordDispatchTF", "getDispatchTypeName", {dispatchType: dispatchType});
      let item = {
        urlName: dispatchName,
        urlId: 'dispatch',
        urlPathName: "/dispatch",
        urlPath: "/pt/ord/dispatch/dispatch.vue",
        query: {dispatchType:dispatchType},
      }
      this.$emit('openTab', item);
    },

    /**
     * 跳转中转信息页面 operType: '中转跟踪'-1  '修改中转'-2  '查看中转'-3  '费用异动'-4
     */
    toTransitManage(tabName,operType)
    {
      let array = this.$refs.table.getSelectItem();
      if (array.length !== 1)
      {
        this.$message.error("请选择一条中转数据");
        return false;
      }
      let data = array[0];
      if (data.verifyState == 1) {
        this.$message.error("派车单: " + data.WAYBILL_NUM + "已审核，不允许费用异动！");
        return false;
      }

      this.toDisplay(tabName, operType, data);
    },

    /**
     * operType: '中转跟踪'-1  '修改中转'-2  '查看中转'-3  '费用异动'-4
     * @param tabName
     * @param operType
     * @param data
     * @returns {boolean}
     */
    toDisplay(tabName, operType, data) {
      let item = {
        urlName: tabName,
        urlId: 'transitManage' + data.WAYBILL_ID,
        urlPathName: "/transit",
        urlPath: "/pt/ord/transit/transitManage.vue",
        query: {t: operType, waybillNum: data.WAYBILL_NUM, tansitWaybillId: data.WAYBILL_ID,unShowCheck: 1,},
      }

      if (operType === enumData.transitOpType.view) {
        item.urlId= 'transitDetailMain' + data.WAYBILL_ID;
        item.urlPath = '/pt/ord/transit/transitDetailMain';
      }else {
        if (operType === enumData.transitOpType.track) {
          let transitOpNode = data.TRANSIT_OP_NODE;
          if(transitOpNode === enumData.transitOpNodeState.completed ){
            //跟踪节点已完成不可再跟踪
            this.$message.error("当前操作不允许！中转节点已完成!");
            return false;
          }
          if(data.TRANSIT_STATE === enumData.waybillState.waitAppointVehicle){
            //提货中转还未送到中转网点，不可跟踪
            this.$message.error("当前操作不允许！该货物还未送到中转网点!");
            return false;
          }

          this.transitOrderData = data;
          this.loadOrdWaybillTransitLog(data.WAYBILL_ID,data.DISPATCH_ID,transitOpNode);

          this.trackInfo.transitOpNode = '';
          this.trackInfo.transitOpContent = '';
          this.trackInfo.actArrivalTime = '';
          this.trackInfo.transitLocation = '';
          this.showTrackDialog = true;
          return;
        }else if (operType === enumData.transitOpType.feeMove) {
          // if (!(data.WAYBILL_STATE === enumData.waybillState.finished || data.WAYBILL_STATE === enumData.waybillState.abort)) {
          //   this.$message.error("当前操作不允许！中转单状态需为 已完成 或 异常终止");
          //   return false;
          // }
          if (data.ENTRY_BILL_FLAG === '是') {
            this.$message.error("当前操作不允许！生成账单后不能费用异动");
            return false;
          }
          this.loadWaybillStatementList(data.WAYBILL_ID);
          this.showFeeMoveDialog = true;
          this.feeInfo.waybillId = data.WAYBILL_ID;
          this.feeInfo.waybillNum = data.WAYBILL_NUM;
          this.feeInfo.remark = '';
          this.feeInfo.transitOtherFee = '';
          this.$forceUpdate();
          // this.feeInfo.transitPickupFee = data.PICKUP_FEE;
          // this.feeInfo.transitDeliveryFee = data.DELIVERY_FEE;
          // this.feeInfo.transitFee = data.TRANSIT_FEE;
          // this.feeInfo.totalTransitFee = data.COMPOSITE_TOTAL_FEE;
          return;
        }else if(operType === enumData.transitOpType.modify){
          // if (data.WAYBILL_STATE === enumData.waybillState.finished) {
          //   this.$message.error("当前操作不允许！中转单已完成");
          //   return false;
          // }
          if (data.WAYBILL_STATE === enumData.waybillState.cancelled){
            this.$message.error("中转单已经取消，当前操作不允许！");
            return false;
          }
          if (data.WAYBILL_STATE === enumData.waybillState.abort){
            this.$message.error("中转单异常中止，当前操作不允许！");
            return false;
          }
          if (data.ENTRY_BILL_FLAG === '是') {
            this.$message.error("当前操作不允许！生成账单后不能修改");
            return false;
          }
          if (data.ENTRY_REPORT_FLAG === '是') {
            this.$message.error("当前操作不允许！生成报表后不能修改");
            return false;
          }
        }
      }
      this.$emit('openTab', item);
    },

    showCancelWaybills(){
      let selectData = this.$refs.table.getSelectItem();
      if (selectData.length < 1) {
        this.$message.error("请至少选择一个需要取消的中转单！");
        return false;
      }
      for (let i = 0; i < selectData.length; i++) {
        if (selectData[i].WAYBILL_STATE == enumData.waybillState.cancelled) {
          this.$message.error("中转单: " + selectData[i].WAYBILL_NUM + "已经取消，请勿重复操作！");
          return false;
        }
        if (selectData[i].WAYBILL_STATE == enumData.waybillState.finished) {
          this.$message.error("中转单: " + selectData[i].WAYBILL_NUM + "已完成，不可取消！");
          return false;
        }
        if (selectData[i].WAYBILL_STATE == enumData.waybillState.abort) {
          this.$message.error("中转单: " + selectData[i].WAYBILL_NUM + "异常中止，不可取消！");
          return false;
        }
      }

      this.dialogVisible = true;
    },
    cancelWaybills() {
      let selectData = this.$refs.table.getSelectItem();
      if (selectData.length < 1) {
        this.$message.error("请至少选择一个需要取消的中转单！");
        return false;
      }
      for (let i = 0; i < selectData.length; i++) {
        if (selectData[i].WAYBILL_STATE == enumData.waybillState.cancelled) {
          this.$message.error("中转单: " + selectData[i].WAYBILL_NUM + "已经取消，请勿重复操作！");
          return false;
        }
        if (selectData[i].WAYBILL_STATE == enumData.waybillState.finished) {
          this.$message.error("中转单: " + selectData[i].WAYBILL_NUM + "已完成，不可取消！");
          return false;
        }
        if (selectData[i].WAYBILL_STATE == enumData.waybillState.abort) {
          this.$message.error("中转单: " + selectData[i].WAYBILL_NUM + "异常中止，不可取消！");
          return false;
        }
      }


      let waybillIds = [];
      let waybillNum = '';
      selectData.forEach(item => {
        if (this.common.isNotBlank(item.WAYBILL_ID)) {
          waybillIds.push(item.WAYBILL_ID);
          waybillNum += item.waybillNum + ",";
        }
      });
      waybillNum = waybillNum.substring(0, waybillNum.length-1);
      let that = this;
      this.common.postUrl("ordWaybillTF", "cancelWaybills", {waybillIds,waybillNum,isTransit:1}, function (data) {
        that.doQuery();
        that.$message.success("取消成功！");
        that.dialogVisible = false;
      },null,'',true);
    },


    /**
     * operType:'中转跟踪',1  '修改中转',2  '查看中转',3
     * @param data
     */
    dblclickItem(data){
      this.toDisplay('查看中转', enumData.transitOpType.view, data);
    },

    invoice(){
      this.showLimitDeploy = true;
    },
    closeLimitDeploy(){
      this.showLimitDeploy = false;
    },
    addClient(){
      this.showAddClient = true;
    },
    checkInfo(){
      this.showCheckInfo = true;
    },
    closeCheckInfo(){
      this.showCheckInfo = false;
    },
    changeSel(){

    },
    options(){

    },
    cleanQryCond(){
      this.query = {
            CUST_NAME: '',
            PICK_PLATE_NUMBER: '',
            PICK_DRIVER_NAME: '',
            TRANSIT_PLATE_NUMBER: '',
            TRANSIT_DRIVER_NAME: '',
            DELIVERY_PLATE_NUMBER: '',
            DELIVERY_DRIVER_NAME: '',
            TRANSIT_SUPPLIER_ID: '',
            ORDER_NUM: '',
            TRANSIT_OP_NODE: '',
            TRANSIT_DATE: '',
      }
    },
    upload(){
      this.showUpload = true;
    },

/*********************** 回单 ***********************/
    /**
     * 初始化回单对象
     * @returns {*}
     */
    initReceipts()
    {
      this.receipts = {
        rId: '',//ord_waybill_receipts_info id
        waybillId: '',
        dispatchId: '',
        waybillNum: '',
        orderId: '',
        orderNum: '',
        tenantName: '',
        waybillWorkId: '',
        workAddressStr: '',
        receiptsType: '1',
      };
      return this.receipts;
    },
    /**
     * 打开上传单据
     */
    openAddReceipts()
    {
      let selectData = this.$refs.table.getSelectItem();
      if(selectData.length !== 1)
      {
        this.$message.error("请选择一个上传单据的中转单！");
        return false;
      }
      if (!(selectData[0].WAYBILL_STATE == enumData.waybillState.finished
        || selectData[0].WAYBILL_STATE == enumData.waybillState.abort))
      {
        this.$message.error("完成的中转单才能上传单据！");
        return false;
      }
      this.initReceipts();
      this.receipts.waybillId = selectData[0].waybillId;
      this.receipts.waybillNum = selectData[0].WAYBILL_NUM;
      this.receipts.dispatchId = selectData[0].dispatchId;
      this.loadWaybillOrderData();

      this.list=[{}];
    },
    /**
     * 改变运单号
     */
    async loadWaybillOrderData()
    {
      this.orderData = await this.common.postUrl("receiptsTF", "loadWaybillOrderInfoByWaybillId", {waybillId: this.receipts.waybillId});
      if (this.orderData.length === 1)
      {
        this.receipts.orderId = this.orderData[0].orderId;
        this.receipts.tenantName = this.orderData[0].tenantName;
      }
      this.loadWaybillWorkData();
    },
    /**
     * 加载运单作业点数据
     * @returns {Promise<void>}
     */
    async loadWaybillWorkData()
    {
      this.waybillWorkData = await this.common.postUrl("receiptsTF", "loadWaybillWorkInfoByWaybillId", {waybillId: this.receipts.waybillId});
      this.changeReceiptsShow(true);
    },
    /**
     * 改变展示窗口
     */
    changeReceiptsShow(flag)
    {
      this.showReceipts = flag;
    },
    /**
     * 改变订单
     */
    changeWaybillOrder(orderId)
    {
      this.orderData.forEach(item => {
        if (item.orderId == orderId){ this.receipts.tenantName = item.tenantName ;}
      });
    },
    /**
     * 运单作业点改变
     */
    changeWaybillWork(waybillWorkId)
    {
      if (this.common.isNotBlank(this.waybillWorkData) && this.waybillWorkData.length > 0)
      {
        this.waybillWorkData.forEach(item => {
          if (item.waybillWorkId == waybillWorkId){ this.receipts.workAddressStr = item.workAddressStr ;}
        });
      }
    },
    // /**
    //  * 回调获取图片的信息
    //  * @param imgData
    //  */
    // setImgData(imgData)
    // {
    //   this.receipts.imgId = imgData.flowId;
    //   this.receipts.fileName = imgData.fileName;
    //   this.receipts.imgPath = imgData.storePath;
    // },
    /**
     * 新增单据
     */
    addReceipts()
    {
      if (this.common.isBlank(this.receipts.waybillId))
      {
        this.$message.error("请选择派车单号再提交！");
        return false;
      }
      if (this.common.isBlank(this.receipts.orderId))
      {
        this.$message.error("请选择订单号再提交！");
        return false;
      }
      if (this.common.isBlank(this.receipts.waybillWorkId))
      {
        this.$message.error("请选择作业点再提交！");
        return false;
      }
      if (this.common.isBlank(this.receipts.receiptsType))
      {
        this.$message.error("请选择单据类型再提交！");
        return false;
      }
      // this.receipts.imgId = this.$refs.receiptsImg.getImageData().flowId;
      // this.receipts.imgPath = this.$refs.receiptsImg.getImageData().storePath;
      // if (this.common.isBlank(this.receipts.imgId))
      // {
      //   this.$message.error("请上传图片信息再提交！");
      //   return false;
      // }
      // if (this.common.isBlank(this.receipts.imgPath))
      // {
      //   this.$message.error("请上传图片信息再提交！");
      //   return false;
      // }
      let list = this.common.copyObj(this.list);
      this.receipts.receiptsList=[];
      for (let i = 0; i < list.length; i++) {
        if(list[i].imgId){
          this.receipts.receiptsList.push(list[i]);
        }
      }
      if (this.receipts.receiptsList.length==0)
      {
        this.$message.error("请上传图片信息再提交！");
        return false;
      }
      this.receipts.ischeckFinish = 1;
      let that = this;
      this.common.postUrl("receiptsTF", "addReceipts", this.receipts, function (data)
      {
        that.doQuery();
        that.changeReceiptsShow(false);
        that.$message.success("单据上传成功");
      },null, null,true);
    },


    /**
     * 获取中转费用异动列表数据
     * @param wayBillId
     * @param dispatchId
     */
    loadWaybillStatementList(wayBillId) {
      let that = this;
      let param = {wayBillId: wayBillId};
      this.common.postUrl("transitManageTF", "loadWaybillStatementList", param, function (data) {
        if (data) {
          that.waybillStatementList = data.waybillStatementList;
          that.feeMoveTotalInfo = {
            transitFeeSum: data.transitFeeSum,
            transitOtherFeeSum: data.transitOtherFeeSum,
            pickupFeeSum: data.pickupFeeSum,
            deliveryFeeSum: data.deliveryFeeSum,
            totalFeeSum: data.totalFeeSum,
          };
          // if (that.opType == enumData.transitOpType.view) {
          //   that.getAdditionalBillTotalFee(wayBillId);
          // }
          //加上费用异动金额，更新总费用合计
          // that.updateFeeTotal();
        }
      });
    },

    /**
     * 保存费用异动变更
     */
    saveFeeMoveInfo() {
      //费用异动
      let that = this;
      let waybillId = that.feeInfo.waybillId;
      let param = {
        feeInfo: that.feeInfo,
        orderStockStatementList: [that.feeInfo],
        isTransit:1
      };
      if(this.common.isBlank(this.feeInfo.transitOtherFee)){
        that.$message.error("请输入中转其他费用！");
        return false;
      }
      this.common.postUrl("ordWaybillTF", "feeChange", param, function (data) {
        if (data) {
          if (data == '1') {
            that.$message.success("新增费用异动成功");
          } else {
            that.$message.warning("该中转单已进报表，此次异动需审核通过才能生效");
          }
          that.feeInfo = {
            waybillId: waybillId,
            transitOtherFee: '',
            remark: ''
          };
          that.loadWaybillStatementList(waybillId);
          that.doQuery();
        }
      }, null, '', true);
    },


    /**
     * 运单费用异动合计自动计算
     */
    updateFeeMoveTotal() {
      let that = this;
      let totalfee = 0;
      let transitotherfee = that.feeInfo.transitOtherFee;
      // let transitfee = that.feeInfo.transitFee;
      // let pickupfee = that.feeInfo.transitPickupFee;
      // let deliveryfee = that.feeInfo.transitDeliveryFee;
      // let taxPoint = that.taxPoint;

      // totalfee = this.common.accAdd(totalfee,transitfee);
      // totalfee = this.common.accAdd(totalfee,pickupfee);
      // totalfee = this.common.accAdd(totalfee,deliveryfee);
      totalfee = this.common.accAdd(totalfee,transitotherfee);

      that.feeInfo.totalTransitFee = totalfee;
      // that.feeInfo.TOTAL_FEE_WITH_TAX = this.common.accMul(totalfee, taxPoint);

      this.$forceUpdate();
    },


    /**
     * 改变展示窗口
     */
    changeShowTrackDialogShow(flag){
      this.showTrackDialog = flag;
    },


    /**
     * 提交中转信息
     * @returns {boolean}
     */
    submitTrackInfo() {
      let that = this;
      //中转跟踪
      let orderId = that.transitOrderData.ORDER_ID;
      let waybillId = that.transitOrderData.WAYBILL_ID;
      let dispatchId = that.transitOrderData.DISPATCH_ID;
      let transitOpNode = that.trackInfo.transitOpNode;
      let transitOpContent = that.trackInfo.transitOpContent;
      let actArrivalTime = that.trackInfo.actArrivalTime;
      let transitLocation = that.trackInfo.transitLocation;

      if(this.common.isBlank(transitOpNode)){
        this.$message.error("请选择跟踪节点！");
        return false;
      }

      let param = {
        orderId: orderId,
        waybillId: waybillId,
        dispatchId: dispatchId,
        transitOpNode: transitOpNode,
        transitOpContent: transitOpContent,
        actArrivalTime: actArrivalTime,
        transitLocation: transitLocation,
      };
      this.common.postUrl("ordWaybillTransitLogTF", "saveTransitLog", param, function (data) {
        if (data) {
          that.$message.success("中转跟踪成功");
          that.trackInfo.transitOpNode = '';
          that.trackInfo.transitOpContent = '';
          that.trackInfo.actArrivalTime = '';
          that.trackInfo.transitLocation = '';

          that.loadOrdWaybillTransitLog(waybillId, dispatchId,transitOpNode);
          that.doQuery();
        }
      },null,'',true);
    },

    /**
     * 获取中转日志列表数据
     * @param wayBillId
     * @param dispatchId
     * @param transitOpNode
     */
    loadOrdWaybillTransitLog(wayBillId,dispatchId,transitOpNode) {
      let that = this;

      let codeTypes = 'TRANSIT_OP_NODE';
      this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': codeTypes}, function (data) {
        if(data){
          that.dicTransitOpNode = data.TRANSIT_OP_NODE;
          that.ordTransitDetailList = '';
          let param = {waybillId: wayBillId, dispatchId: dispatchId};
          that.common.postUrl("ordWaybillTransitLogTF", "queryOrdWaybillTransitLog", param, function (data) {
            if (data) {
              that.ordTransitDetailList = data;

              //中转跟踪节点选项处理
              if(that.ordTransitDetailList.length > 0){
                for (let i = that.dicTransitOpNode.length - 1; i >= 0; i--) {
                  let codeValue = parseInt(that.dicTransitOpNode[i].codeValue);
                  if (codeValue < transitOpNode && codeValue <= 2) {
                    that.dicTransitOpNode.splice(i, 1);
                  }
                }
              }
            }
          });
        }
      });


      this.$forceUpdate();
    },

    hideMapBackDraw(){
      this.isShowMapDraw = false;
    },
    showMap(){
      this.isShowMap = true;
      this.trackInfo.transitLocation = '';
      this.cleanMap();
    },

    // 清空地图
    cleanMap(){
      this.$refs.mapDialog.mapText = "";
      this.$refs.mapDialog.mapInfo = {};
      this.$refs.mapDialog.overlays = [];
    },

    hideMapBack(){
      this.isShowMap = false;
      this.cleanMap();
    },

    /** 地图回调 */
    async sureWorkAddress(data){
      let address = data.address;
      if(this.common.isNotBlank(address)){
        this.trackInfo.transitLocation = address;
      }
      this.hideMapBack();
      this.$forceUpdate();
    },

    changeInput() {
      this.$forceUpdate();
    },
    download(){
      this.$refs.table.downloadExcelFile('中转列表');
    },
    verifyWaybill(){
      let selectData = this.$refs.table.getSelectItem();
      if (selectData.length <=0 )
      {
        this.$message.error("请至少选择一条需要审核的数据！");
        return false;
      }
      let waybillIds = [];
      for (let i = 0; i < selectData.length; i++) {
        if (selectData[i].WAYBILL_STATE != enumData.waybillState.finished)
        {
          this.$message.error("只能选择已完成的中转单！");
          return false;
        }
        // if (selectData[i].verifyState == 1) {
        //   this.$message.error("只能选择未审核的中转单！");
        //   return false;
        // }
        waybillIds.push(selectData[i].waybillId);
      }
      let that = this;
      that.common.postUrl("ordWaybillTF", "verifyWaybill", {waybillIds}, function (data){
        that.doQuery();
        that.$message.success("审核成功");
      },null, null,true);
    },

    /**
     * 上传图片回调
     * @param flag
     */
    fileCallback(imgData){
      imgData.imgId = imgData.flowId;
      imgData.imgPath = imgData.storePath;
      if (this.list.length <= 5)
        this.list[imgData.componentId] = imgData;
      let flag = true;
      for (let i = 0; i < this.list.length; i++)
        if (this.common.isBlank(this.list[i].imgId)) flag = false;//存在空的
      if(this.list.length  < 5 && flag){
        this.list.push({});
      }
      this.initListComponentId();
    },
    initListComponentId()
    {
      for (let i = 0; i < this.list.length; i++)
        this.list[i].componentId = i;
      this.$forceUpdate();
    },
    delCallback(index){
      this.list.splice(index,1);
      let flag = true;
      for (let i = 0; i < this.list.length; i++)
        if (this.common.isBlank(this.list[i].imgId)) flag = false;//存在空的
      if(this.list.length === 4 && flag){
        this.list.push({});
      }
      this.imgDisplay();
      this.initListComponentId();
    },
    imgDisplay(){
      this.$nextTick(() => {
        let that = this;
        for (let i = 0; i < this.list.length; i++) {
          if (that.list[i].imgId) {
            eval("that.$refs.file" + i + "[0].initDate(" + that.list[i].imgId + ")");
          } else {
            eval("that.$refs.file" + i + "[0].clean()");
          }
        }
      });
    },

  },
  computed:{
    formData(){
      return [
        {"name":"发货客户","model":"CUST_NAME","type":"input","placeholder":"发货客户","isshow":true},
        {"name":"提货车辆","model":"PICK_PLATE_NUMBER","type":"input","placeholder":"提货车辆","isshow":true},
        {"name":"提货司机","model":"PICK_DRIVER_NAME","type":"input","placeholder":"提货司机","isshow":true},
        {"name":"干线车辆","model":"TRANSIT_PLATE_NUMBER","type":"input","placeholder":"干线车辆","isshow":true},
        {"name":"干线司机","model":"TRANSIT_DRIVER_NAME","type":"input","placeholder":"干线司机","isshow":true},
        {"name":"送货车辆","model":"DELIVERY_PLATE_NUMBER","type":"input","placeholder":"送货车辆","isshow":true},
        {"name":"送货司机","model":"DELIVERY_DRIVER_NAME","type":"input","placeholder":"送货司机","isshow":true},
        {"name":"干线供应商","model":"TRANSIT_SUPPLIER_ID","type":"select","options":this.supplierList,"label":"supplierName","value":"tenantId","placeholder":"干线供应商","method":"doQuery","isshow":true},
        {"name":"订单号","model":"ORDER_NUM","type":"input","placeholder":"订单号","isshow":true},
        {"name":"派车单号","model":"WAYBILL_NUM","type":"input","placeholder":"派车单号","isshow":true},
        {"name":"跟踪节点","model":"TRANSIT_OP_NODE","type":"select","options":this.dicTransitOpNode,"label":"codeName","value":"codeValue","placeholder":"跟踪节点","method":"doQuery","isshow":true},
        {"name":"客户下单时间","model":"customerOrderDate","type":"daterange","isshow":true},
        {"name":"调度时间","model":"transitDate","type":"daterange","isshow":true},
        {"name":"派车状态","model":"waybillState","type":"select","options":this.waybillStateOptions,"label":"codeName","value":"codeValue","placeholder":"派车状态","method":"doQuery","isshow":true},
        {"name":"是否入账","model":"ENTRY_BILL_FLAG","type":"select","options":this.dic_whether,"label":"codeName","value":"codeValue","placeholder":"是否入账","method":"doQuery","isshow":true},
        {"name":"是否生成报表","model":"ENTRY_REPORT_FLAG","type":"select","options":this.dic_whether,"label":"codeName","value":"codeValue","placeholder":"是否生成报表","method":"doQuery","isshow":true},
        {"name":"是否开票","model":"IS_INVOICE","type":"select","options":this.dic_whether,"label":"codeName","value":"codeValue","placeholder":"是否开票","method":"doQuery","isshow":true},
        {"name":"审核状态","model":"verifyState","type":"select","options":this.verifyStateData,"label":"codeName","value":"codeValue","placeholder":"审核状态","method":"doQuery","isshow":true},
          {"name":"支付状态","model":"payState","type":"select","options":[{codeName:'未支付',codeValue:'1'},{codeName:'部分支付',codeValue:'2'},{codeName:'全部支付',codeValue:'3'}],"label":"codeName","value":"codeValue","placeholder":"支付状态","method":"doQuery","isshow":true},
      ]
    }
  },
}
