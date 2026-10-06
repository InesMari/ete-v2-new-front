import tableCommon from "@/components/table/tableCommon.vue";
import enumData from "@/page/pt/enum";

export default {
  name: 'transitManage',
  data() {
    return {
      transitOrderData: '',
      feeInfo: '',
      opType: '',
      isshowUploadDialog: false,
      isshowGoodsDetialDialog: false,
      showGoodsDetialDialog: false,
      showPieceGoodsListDialog: false,
      disableEdit: true,
      disableWorkNodeEdit: true,
      disableFeeMoveEdit: false,
      modifyOpDisable: false,
      showTransitLog: false,
      showTransitFeeMoveTable: false,
      showSubmitBtn: false,
      isViewDetail: false,
      arriveWorkDialogShow: false,
      dicDeliveryMode: [],
      dicVehicleLength: [],
      dicVehicleType: [],
      dicWhether: [],
      dicTransitOpNode: [],
      dispatchGoodsInfo: {},
      ordTransitDetailList: {},
      waybillStatementList: {},
      waybillAdditionalBillList: {},
      pieceGoodsList: [],
      totalAdditionalFeeSum: 0,
      feeMoveTotalInfo: {
        transitFeeSum: 0,
        transitOtherFeeSum: 0,
        pickupFeeSum: 0,
        deliveryFeeSum: 0,
        totalFeeSum: 0,
      },
      additionalBillTotalInfo: {
        transitFeeSum: 0,
        transitOtherFeeSum: 0,
        pickupFeeSum: 0,
        deliveryFeeSum: 0,
        totalFeeSum: 0,
      },
      transitWaybillOrderWorkList: {},
      deliveryModeOptions: [],//交接方式
      supplierData: [],//供应商
      billingTypeOptions:[],//计费方式
      transportOptions:[],//运输模式
      taxPoint: '',//税点
      totalPaymentFee: '',//付款额
      quoteTotalFee: 0,//报价费用合计
      vehicleData: '',//供应商关联的车辆
      driverData: [],//供应商关联的司机
      vehicleDisable: {
        PICK_: true,
        TRUNK_: true,
        DELIVERY_: true,
      },
      query:{
        tenantName: '',
        keyword:''
      },
      head: [
        {"name": "企业名称", "code": "tenantName", "width": "150", "type": "text"},
        {"name": "作业点名称", "code": "workName", "width": "120", "type": "text"},
        {"name": "详细地址", "code": "workAddress", "width": "200", "type": "text"},
      ],
    };
  },
  mounted() {
    this.init();
    this.doQuery();
  },
  components: {
    tableCommon,
  },
  methods: {
    init() {
      let that = this;
      //operType: '中转跟踪'-1  '修改中转'-2  '查看中转'-3  '费用异动'-4
      that.opType = this.$route.query.t;
      if (that.opType == enumData.transitOpType.track) {
        //中转跟踪
        that.disableEdit = false;
        that.showTransitLog = true;
        that.showSubmitBtn = true;
        that.disableWorkNodeEdit = false;
        that.showTransitFeeMoveTable = false;
        that.disableFeeMoveEdit = true;
      } else if (that.opType == enumData.transitOpType.modify) {
        //中转修改
        that.disableEdit = false;
        that.showTransitLog = false;
        that.showSubmitBtn = true;
        that.disableWorkNodeEdit = false;
        that.modifyOpDisable = false;
        that.showTransitFeeMoveTable = false;
        that.disableFeeMoveEdit = true;
      }else if (that.opType == enumData.transitOpType.view) {
        //中转查看
        that.disableEdit = true;
        that.isViewDetail = true;
        that.showSubmitBtn = false;
        that.disableWorkNodeEdit = true;
        that.showTransitFeeMoveTable = true;
        that.disableFeeMoveEdit = true;
      }else if (that.opType == enumData.transitOpType.feeMove) {
        //费用异动
        that.disableEdit = true;
        that.showTransitLog = false;
        that.showSubmitBtn = true;
        that.disableWorkNodeEdit = true;
        that.modifyOpDisable = true;
        that.showTransitFeeMoveTable = true;
        that.disableFeeMoveEdit = false;
      }
      // else {
      //   that.showSubmitBtn = false;
        // that.showTransitLog = true;
      // }


      let codeTypes = 'DELIVERY_MODE,BILLING_TYPE_ORDER,TRANSPORT,VEHICLE_LENGTH,VEHICLE_TYPE,WHETHER,TRANSIT_OP_NODE';
      this.common.postUrl('commonTF','getSysStaticDataByCodeTypes',{'codeType': codeTypes},function (data) {
        that.dicDeliveryMode = data.DELIVERY_MODE;
        that.dicVehicleLength = data.VEHICLE_LENGTH;
        that.dicVehicleType = data.VEHICLE_TYPE;
        that.dicWhether = data.WHETHER;
        that.dicTransitOpNode = data.TRANSIT_OP_NODE;
        that.dicTransitOpNode.unshift({codeValue: '', codeName: ''});
        that.billingTypeOptions = data.BILLING_TYPE_ORDER;
        that.transportOptions = data.TRANSPORT;

        that.forceUpdate();
      });

      this.common.postUrl("commonTF", "getTaxPoint", {}, function (data) {
        that.taxPoint = data.taxPoint;
      });

      this.common.postUrl("supplierTF", "queryAllSupplierList", {}, function (data) {
        that.supplierData = data;
      });

    },

    /**
     * 获取中转日志列表数据
     * @param wayBillId
     * @param dispatchId
     */
    refreshOrdWaybillTransitLog(wayBillId,dispatchId) {
      let that = this;
      let param = {waybillId: wayBillId, dispatchId: dispatchId};
      this.common.postUrl("ordWaybillTransitLogTF", "queryOrdWaybillTransitLog", param, function (data) {
        if (data) {
          that.ordTransitDetailList = data;

          //中转跟踪节点选项处理
          for (let i = that.dicTransitOpNode.length - 1; i >= 0; i--) {
            let codeValue = parseInt(that.dicTransitOpNode[i].codeValue);
            if (codeValue < that.transitOrderData.TRANSIT_OP_NODE && codeValue <= 2) {
                that.dicTransitOpNode.splice(i, 1);
            }
          }
          if(that.transitOrderData.TRANSIT_OP_NODE <= 2){
            // that.transitOrderData.TRANSIT_OP_NODE = (parseInt(that.transitOrderData.TRANSIT_OP_NODE) + 1) + '';
            that.transitOrderData.TRANSIT_OP_NODE = '';
            that.forceUpdate();
          }else {
            that.transitOrderData.TRANSIT_OP_NODE = that.transitOrderData.TRANSIT_OP_NODE + '';
          }
        }
      });
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
          if (that.opType == enumData.transitOpType.view) {
            that.getAdditionalBillTotalFee(wayBillId);
          }else {
            that.updateTotalFee();
          }
        }
      });
    },

    /**
     * 获取费用补录列表数据
     * @param wayBillId
     * @param dispatchId
     */
    loadAdditionalBillList(wayBillId) {
      let that = this;
      let param = {wayBillId: wayBillId};
      this.common.postUrl("transitManageTF", "loadAdditionalBillList", param, function (data) {
        if (data) {
          that.waybillAdditionalBillList = data.waybillAdditionalBillList;
          that.additionalBillTotalInfo = {
              transitFeeSum: data.transitFeeSum,
              transitOtherFeeSum: data.transitOtherFeeSum,
              pickupFeeSum: data.pickupFeeSum,
              deliveryFeeSum: data.deliveryFeeSum,
              totalFeeSum: data.totalFeeSum,
          };
        }
      });
    },

    /**
     * 获取运输实际件数信息
     * @param wayBillId
     * @param dispatchId
     */
    getOrdPieceGoodsInfo(wayBillId) {
      let that = this;
      let param = {wayBillId: wayBillId};
      this.common.postUrl("transitManageTF", "getOrdPieceGoodsInfo", param, function (data) {
        if (data) {
          that.pieceGoodsList = data;
        }
      });
    },

    inputPieceGoodsInfo(index){
      let pieceGood = this.pieceGoodsList[index];
      pieceGood.pieceFee = this.common.accMul(pieceGood.actualGoodsCount,pieceGood.piecePrice)
      this.$forceUpdate();
    },

    savePieceGoodsInfo(){
      let totalPieceFee = 0;
      for (let i = 0; i < this.pieceGoodsList.length; i++) {
        let pieceGood = this.pieceGoodsList[i];
        totalPieceFee = this.common.accAdd(pieceGood.pieceFee,totalPieceFee);
      }
      this.transitOrderData.TRANSIT_FEE = totalPieceFee;

      this.updateTotalFee();

      this.$forceUpdate();

      this.showPieceGoodsListDialog = false;
    },

    /**
     * 获取补费金额合计
     * @param wayBillId
     * @param dispatchId
     */
    getAdditionalBillTotalFee(wayBillId) {
      let that = this;
      let param = {wayBillId: wayBillId};
      this.common.postUrl("transitManageTF", "getAdditionalBillTotalFee", param, function (data) {
        if (data) {
          that.totalAdditionalFeeSum = data.totalAdditionalFeeSum;

          //计算总费用合计
          // that.updateTotalFee();

          let statementFee = that.transitOrderData.STATEMENT_FEE;
          let quoteTotalFeeCount = 0;
          quoteTotalFeeCount = that.common.accAdd(that.transitOrderData.TOTAL_FEE,statementFee);
          quoteTotalFeeCount = that.common.accAdd(data.totalAdditionalFeeSum,quoteTotalFeeCount);

          that.quoteTotalFee = quoteTotalFeeCount;
        }
      });
      that.forceUpdate();
    },

    /**
     * 获取运单作业点数据
     * @param wayBillId
     */
    loadTransitWaybillOrderWorkData(wayBillId) {
      let that = this;
      let param = {wayBillId: wayBillId};
      this.common.postUrl("transitManageTF", "loadTransitWaybillOrderWorkData", param, function (data) {
        if (data) {
          that.transitWaybillOrderWorkList = data;
        }
      });
    },


    doQuery() {
      let waybillNum = this.$route.query.waybillNum;
      // operType:'中转跟踪',1  '修改中转',2  '查看中转',3
      let opType = this.$route.query.t;
      let that = this;
      this.common.postUrl("transitManageTF", "queryOrdTransitDetail", {"WAYBILL_NUM": waybillNum}, function (data) {
        that.transitOrderData = data;
        that.transitOrderData.DELIVERY_MODE = that.transitOrderData.DELIVERY_MODE + '';
        that.transitOrderData.IS_INVOICE = that.transitOrderData.IS_INVOICE + '';
        that.transitOrderData.HAVE_RECEIPT = that.transitOrderData.HAVE_RECEIPT + '';
        that.transitOrderData.PICK_VEHICLE_TYPE = that.transitOrderData.PICK_VEHICLE_TYPE > 0 ? that.transitOrderData.PICK_VEHICLE_TYPE + '' : '';
        that.transitOrderData.PICK_VEHICLE_LENGTH = that.transitOrderData.PICK_VEHICLE_LENGTH > 0 ? that.transitOrderData.PICK_VEHICLE_LENGTH + '' : '';
        that.transitOrderData.TRUNK_VEHICLE_TYPE = that.transitOrderData.TRUNK_VEHICLE_TYPE > 0 ? that.transitOrderData.TRUNK_VEHICLE_TYPE + '' : '';
        that.transitOrderData.TRUNK_VEHICLE_LENGTH = that.transitOrderData.TRUNK_VEHICLE_LENGTH > 0 ? that.transitOrderData.TRUNK_VEHICLE_LENGTH + '' : '';
        that.transitOrderData.DELIVERY_VEHICLE_TYPE = that.transitOrderData.DELIVERY_VEHICLE_TYPE > 0 ? that.transitOrderData.DELIVERY_VEHICLE_TYPE + '' : '';
        that.transitOrderData.DELIVERY_VEHICLE_LENGTH = that.transitOrderData.DELIVERY_VEHICLE_LENGTH > 0 ? that.transitOrderData.DELIVERY_VEHICLE_LENGTH + '' : '';
        that.transitOrderData.BILLING_TYPE = that.transitOrderData.BILLING_TYPE > 0 ? that.transitOrderData.BILLING_TYPE + '' : '';
        that.transitOrderData.TRANSPORT = that.transitOrderData.TRANSPORT > 0 ? that.transitOrderData.TRANSPORT + '' : '';
        // that.transitOrderData.TRANSIT_SUPPLIER_ID = that.transitOrderData.TRANSIT_SUPPLIER_ID + '';
        // that.transitOrderData.TRANSIT_OP_NODE = that.transitOrderData.TRANSIT_OP_NODE ? that.transitOrderData.TRANSIT_OP_NODE + '' : '';

        that.loadTransitWaybillOrderWorkData(data.WAYBILL_ID);

        if (opType == enumData.transitOpType.view) {
          //中转详情,查询费用异动金额，补费金额
          that.loadWaybillStatementList(data.WAYBILL_ID);

          //费用补录记录
          that.loadAdditionalBillList(data.WAYBILL_ID);

          //展示中转跟踪记录
          // that.refreshOrdWaybillTransitLog(data.WAYBILL_ID,data.DISPATCH_ID);
        }else if(opType == enumData.transitOpType.track){
          //中转跟踪
          that.refreshOrdWaybillTransitLog(data.WAYBILL_ID,data.DISPATCH_ID);
        }else if(opType == enumData.transitOpType.feeMove){ //中转费用异动
            that.feeInfo = {
              transitFee : '',
              transitOtherFee : '',
              transitPickupFee : '',
              transitDeliveryFee : '',
              totalTransitFee : '',
            };
          that.loadWaybillStatementList(data.WAYBILL_ID);
        }else if(opType == enumData.transitOpType.modify){ //中转修改

            that.getOrdPieceGoodsInfo(data.WAYBILL_ID);

            that.calcPayInfo();

            let statementFee = that.transitOrderData.STATEMENT_FEE;
            that.quoteTotalFee = that.common.accAdd(that.transitOrderData.TOTAL_FEE,statementFee);
            that.quoteTotalFee = that.common.accAdd(that.transitOrderData.MAKEUP_FEE,that.quoteTotalFee);
        }

        let supplierTenantId = that.transitOrderData.TRANSIT_SUPPLIER_ID;
        let isInvoice = that.transitOrderData.IS_INVOICE;

        that.initVehicleList(supplierTenantId, isInvoice);

        that.initDriverList(supplierTenantId, isInvoice);

        that.forceUpdate();
      });
    },

    showUploadDialog() {
      this.isshowUploadDialog = true;
    },

    //展示货物明细弹窗
    async showGoodsDetail() {
      let orderStockId = this.transitOrderData.ORDER_STOCK_ID;
      this.dispatchGoodsInfo.orderStockDetailList = await this.common.postUrl("ordDispatchTF", "queryOrdStockGoodsDetailList", {orderStockId: orderStockId});
      this.showGoodsDetialDialog = true;
    },

    /**
     * 提交中转信息
     * @returns {boolean}
     */
    submitTransit() {
      let that = this;
      // operType: '中转跟踪'-1  '修改中转'-2  '查看中转'-3  '费用异动'-4
      if (that.opType == enumData.transitOpType.track) {
        //中转跟踪
        let orderId = that.transitOrderData.ORDER_ID;
        let waybillId = that.transitOrderData.WAYBILL_ID;
        let dispatchId = that.transitOrderData.DISPATCH_ID;
        let transitOpNode = that.transitOrderData.TRANSIT_OP_NODE;
        let transitOpContent = that.transitOrderData.TRANSIT_OP_CONTENT;

        let param = {
          orderId: orderId,
          waybillId: waybillId,
          dispatchId: dispatchId,
          transitOpNode: transitOpNode,
          transitOpContent: transitOpContent,
          transitOrderData: that.transitOrderData,
          transitWaybillOrderWorkList: that.transitWaybillOrderWorkList,
        };
        this.common.postUrl("ordWaybillTransitLogTF", "saveTransitLog", param, function (data) {
          if (data) {
            that.$message.success("中转跟踪成功");
            // that.refreshOrdWaybillTransitLog(waybillId,dispatchId);
            that.transitOrderData.TRANSIT_OP_CONTENT = '';

            that.init();
            that.doQuery();
          }
        },null,'',true);
      } else if (that.opType == enumData.transitOpType.feeMove) {
        //费用异动
        that.feeInfo.waybillId = that.transitOrderData.WAYBILL_ID;
        that.loadWaybillStatementList(that.transitOrderData.WAYBILL_ID);
        let param = {
          feeInfo: that.feeInfo,
          orderStockStatementList: [that.feeInfo],
        };
        this.common.postUrl("ordWaybillTF", "feeChange", param, function (data) {
          if (data) {
            // that.$msgbox("保存成功！");
            if(data=='1'){
              that.$message.success("新增费用异动成功");
            }else{
              that.$message.warning("该中转单已进报表，此次异动需审核通过才能生效");
            }
            that.feeInfo = {
              transitFee : '',
              transitOtherFee : '',
              transitPickupFee : '',
              transitDeliveryFee : '',
              totalTransitFee : '',
            };
            that.loadWaybillStatementList(that.transitOrderData.WAYBILL_ID);
          }
        },null,'',true);
      } else if (that.opType == enumData.transitOpType.modify) {
        //中转修改
        if(that.transitOrderData.PERIODICAL_PAY && !this.common.checkNum(parseInt(that.transitOrderData.PERIODICAL_DAY))){
            this.$message.error("请输入周期天数！");
            return false;
        }
        if(that.totalPaymentFee != that.quoteTotalFee){
          this.$message.error("付款额需与中转成本费用相等！");
          return false;
        }
        for (let i = 0; i < that.transitWaybillOrderWorkList.length; i++) {
          if(that.transitWaybillOrderWorkList[i].entryTime && that.transitOrderData.TRANSIT_OP_NODE < 1){
            this.$message.error("当前运单还未跟踪节点，不可输入实际到达时间！已自动清空实际到达时间！");
            for (let j = 0; j < that.transitWaybillOrderWorkList.length; j++) {
              this.transitWaybillOrderWorkList[j].entryTime = null;
            }
            return false;
          }
        }

        let param = {
          transitWaybillOrderWorkList: that.transitWaybillOrderWorkList,
          pieceGoodsList: that.pieceGoodsList,
          transitOrderData: that.transitOrderData,
          transitOpNode: that.transitOrderData.TRANSIT_OP_NODE,
        };
        this.common.postUrl("transitManageTF", "ordTransitChg", param, function (data) {
          if (data) {
            that.$message.success("中转修改成功");
            that.doQuery();
            that.init();
          }
        },null,'',true);
      }
    },

    /**
     * 改变供应商 查询网点
     */
    changeSupplier(supplierId) {
      let that = this;
      if (supplierId) {
        this.common.postUrl("supplierTF", "getSupplierDetailInfo", {tenantId: supplierId}, function (data) {
          that.transitOrderData.SUPLIER_LINK_MAN = data.linkman;
          that.transitOrderData.SUPLIER_LINK_PHONE = data.linkPhone;

          that.initVehicleList(data.tenantId,data.isInvoice);
        });
      }
    },


    //初始化车辆
    initVehicleList(supplierTenantId,isInvoice){
      let that = this;
      that.vehicleData=[];
      this.common.postUrl("resVehicleInfoTF", "selVehicleInfoListByCond", {tenantId:supplierTenantId,isInvoice,rows:2500}, function (data) {
        if(data){
          that.vehicleData = data.items;

          that.addExtVehicleData("PICK_");
          that.addExtVehicleData("DELIVERY_");
          that.addExtVehicleData("TRUNK_");

          that.$forceUpdate();
        }
      });
    },

    //初始化司机
    initDriverList(supplierTenantId,isInvoice){
      let that = this;
      that.driverData=[];
      this.common.postUrl("driverTF", "selDriverInfoListByCond", {tenantId:supplierTenantId,isInvoice,rows:2500}, function (data) {
        that.driverData = data.items;
        that.$forceUpdate();

        that.addExtDriverData("PICK_");
        that.addExtDriverData("DELIVERY_");
        that.addExtDriverData("TRUNK_");
      });
    },

    //key拼装
    getRealKey(prefix,key){
      let realKey = prefix+key.substr(0,1).toUpperCase()+key.substr(1);
      return realKey;
    },

    //清除选择车辆信息
    clearSelVehicleInfo(){
      this.vehicleData=[];
      this.clearOneSelVehicleInfo('PICK_');
      this.clearOneSelVehicleInfo('DELIVERY_');
      this.clearOneSelVehicleInfo('TRUNK_');
    },

    //清除选择司机信息
    clearSelDriverInfo(){
      this.driverData=[];
      this.clearOneSelDriverInfo('PICK_');
      this.clearOneSelDriverInfo('DELIVERY_');
      this.clearOneSelDriverInfo('TRUNK_');
    },

    //清除提货送货干线其中一种车辆信息
    clearOneSelVehicleInfo(prefix){
      this.transitOrderData[this.getRealKey(prefix,'VEHICLE_ID')]='';
      this.transitOrderData[this.getRealKey(prefix,'PLATE_NUMBER')]='';
      this.transitOrderData[this.getRealKey(prefix,'VEHICLE_TYPE')]='';
      this.transitOrderData[this.getRealKey(prefix,'VEHICLE_LENGTH')]='';
      this.vehicleDisable[prefix] = true;
      this.$forceUpdate();
    },

    //清除提货送货干线其中一种司机信息
    clearOneSelDriverInfo(prefix){
      this.transitOrderData[this.getRealKey(prefix, 'DRIVER_USER_ID')] = '';
      this.transitOrderData[this.getRealKey(prefix, 'DRIVER_NAME')] = '';
      this.transitOrderData[this.getRealKey(prefix, 'LINK_PHONE')] = '';
      // this.vehicleDisable[prefix] = true;
      this.$forceUpdate();
    },

    //切换车辆
    changeVehicle(value,prefix){
      this.clearOneSelVehicleInfo(prefix);
      for (let i = 0; i < this.vehicleData.length; i++) {
        if (value == this.vehicleData[i].vehicleId) {
          this.transitOrderData[this.getRealKey(prefix, 'VEHICLE_ID')] = this.vehicleData[i].vehicleId;
          this.transitOrderData[this.getRealKey(prefix, 'PLATE_NUMBER')] = this.vehicleData[i].plateNumber;
          this.transitOrderData[this.getRealKey(prefix, 'VEHICLE_TYPE')] = this.vehicleData[i].vehicleType + '';
          this.transitOrderData[this.getRealKey(prefix, 'VEHICLE_LENGTH')] = this.vehicleData[i].vehicleLength + '';
          if(value < 0){
            this.vehicleDisable[prefix] = false;
          }
          this.$forceUpdate();
          break;
        }
      }
    },

    //切换司机
    changeDriver(value,prefix){
      this.clearOneSelDriverInfo(prefix);
      for (let i = 0; i < this.driverData.length; i++) {
        if (value == this.driverData[i].driverUserId) {
          this.transitOrderData[this.getRealKey(prefix, 'DRIVER_USER_ID')] = this.driverData[i].driverUserId;
          this.transitOrderData[this.getRealKey(prefix, 'DRIVER_NAME')] = this.driverData[i].driverName;
          this.transitOrderData[this.getRealKey(prefix, 'LINK_PHONE')] = this.driverData[i].driverPhone + '';
          // if(value < 0){
          //   this.vehicleDisable[prefix] = false;
          // }
          this.$forceUpdate();
          break;
        }
      }
    },

    //输入车辆信息
    inputVehicleInfo(e,prefix){
      this.clearOneSelVehicleInfo(prefix);
      let plateNumber = e.target.value.toUpperCase();
      if (this.common.isNotBlank(plateNumber) ) {
        if(plateNumber.length > 5){
          let isExistVehicle = false;
          for (let i = 0; i < this.vehicleData.length; i++) {
            if (plateNumber == this.vehicleData[i].plateNumber) {
              isExistVehicle = true;
              break;
            }
          }

          if(!isExistVehicle){
            let vehicleId = 0 - (new Date().getTime());
            this.transitOrderData[this.getRealKey(prefix, 'VEHICLE_ID')] = vehicleId;
            this.transitOrderData[this.getRealKey(prefix, 'PLATE_NUMBER')] = plateNumber;

            this.addExtVehicleData(prefix);
          }
        }
        this.$forceUpdate();
      }
    },

    //输入司机信息
    inputDriverInfo(e,prefix){
      this.clearOneSelDriverInfo(prefix);
      let driverName = e.target.value;
      if (this.common.isNotBlank(driverName) && driverName.length > 1) {
        let isExistDriver = false;
        for (let i = 0; i < this.driverData.length; i++) {
          if (driverName == this.driverData[i].driverName) {
            isExistDriver = true;
            break;
          }
        }

        if(!isExistDriver){
          let driverUserId = 0 - (new Date().getTime());
          this.transitOrderData[this.getRealKey(prefix, 'DRIVER_USER_ID')] = driverUserId;
          this.transitOrderData[this.getRealKey(prefix, 'DRIVER_NAME')] = driverName;

          this.addExtDriverData(prefix);
        }

        this.$forceUpdate();
      }
    },

    //添加非系统供应商车辆至下拉框数据源
    addExtVehicleData (prefix) {
      let vehicleId = this.transitOrderData[this.getRealKey(prefix,'VEHICLE_ID')];
      let plateNumber = this.transitOrderData[this.getRealKey(prefix,'PLATE_NUMBER')];
      let vehicleType = this.transitOrderData[this.getRealKey(prefix,'VEHICLE_TYPE')];
      let vehicleLength = this.transitOrderData[this.getRealKey(prefix,'VEHICLE_LENGTH')];

      if(this.common.isNotBlank(plateNumber)){
        let isSysVehicle = false;
        for (let i = 0; i < this.vehicleData.length; i++) {
          if (vehicleId == this.vehicleData[i].vehicleId || plateNumber == this.vehicleData[i].plateNumber) {
            isSysVehicle = true;
            break;
          }
        }
        //用户输入的车辆数据
        if (isSysVehicle === false) {
          this.vehicleData.unshift({
            vehicleId: vehicleId,
            plateNumber: plateNumber,
            vehicleType: vehicleType,
            vehicleLength: vehicleLength
          });
          this.vehicleDisable[prefix] = false;
        }
      }
    },


    //添加非系统供应商司机至下拉框数据源
    addExtDriverData (prefix) {
      let driverUserId = this.transitOrderData[this.getRealKey(prefix, 'DRIVER_USER_ID')];
      let driverName = this.transitOrderData[this.getRealKey(prefix,'DRIVER_NAME')];
      let linkPhone = this.transitOrderData[this.getRealKey(prefix,'LINK_PHONE')];

      if(this.common.isNotBlank(driverName)){
        let isSysDriver = false;
        for (let i = 0; i < this.driverData.length; i++) {
          if (driverUserId == this.driverData[i].driverId || driverName == this.driverData[i].driverName) {
            isSysDriver = true;
            break;
          }
        }
        //用户输入的车辆数据
        if (isSysDriver === false) {
          // console.log('addExtDriverData -- driverUserId:' + driverUserId + ' ---driverName:' + driverName);
          if(this.common.isBlank(linkPhone)){
            linkPhone = "";
          }
          this.driverData.unshift({
            driverUserId: driverUserId,
            driverName: driverName,
            driverPhone: linkPhone,
          });
          // this.vehicleDisable[prefix] = false;
        }
      }
    },

    /**
     * 运单费用合计自动计算
     */
    updateTotalFee() {
      let that = this;
      let totalfee = 0;
      let transitfee = that.transitOrderData.TRANSIT_FEE;
      let transitotherfee = that.transitOrderData.TRANSIT_OTHER_FEE;
      let pickupfee = that.transitOrderData.PICKUP_FEE;
      let deliveryfee = that.transitOrderData.DELIVERY_FEE;

      let taxPoint = that.taxPoint;

      totalfee = this.common.accAdd(totalfee,transitfee);
      totalfee = this.common.accAdd(totalfee,transitotherfee);
      totalfee = this.common.accAdd(totalfee,pickupfee);
      totalfee = this.common.accAdd(totalfee,deliveryfee);
      if (that.opType == enumData.transitOpType.feeMove) {
        //费用合计加上异动费用
        totalfee = this.common.accAdd(totalfee,that.feeMoveTotalInfo.totalFeeSum);
      }
      // else if (that.opType == enumData.transitOpType.view) {
      //   //费用合计加上异动费用、补费金额
      //   //异动费用
      //   that.quoteTotalFee = this.common.accAdd(that.quoteTotalFee,that.feeMoveTotalInfo.totalFeeSum);
      //   //补费费用
      //   that.quoteTotalFee = this.common.accAdd(that.quoteTotalFee,that.totalAdditionalFeeSum);
      // }

      // that.transitOrderData.TOTAL_FEE = totalfee;
      // that.transitOrderData.TOTAL_FEE_WITH_TAX = this.common.accMul(totalfee, taxPoint);
      //
      // that.transitOrderData.PERIODICAL_PAY = totalfee;

      that.calcPayInfo();

      that.forceUpdate();
    },

    /**
     * 运单费用异动合计自动计算
     */
    updateFeeMoveTotal() {
      let that = this;
      let totalfee = 0;
      let transitfee = that.feeInfo.transitFee;
      let transitotherfee = that.feeInfo.transitOtherFee;
      let pickupfee = that.feeInfo.transitPickupFee;
      let deliveryfee = that.feeInfo.transitDeliveryFee;
      // let taxPoint = that.taxPoint;

      totalfee = this.common.accAdd(totalfee,transitfee);
      totalfee = this.common.accAdd(totalfee,transitotherfee);
      totalfee = this.common.accAdd(totalfee,pickupfee);
      totalfee = this.common.accAdd(totalfee,deliveryfee);

      that.feeInfo.totalTransitFee = totalfee + '';
      // that.feeInfo.TOTAL_FEE_WITH_TAX = this.common.accMul(totalfee, taxPoint);

      that.forceUpdate();
    },


    /**
     * 付款方式费用合计自动计算
     */
    calcPayInfo() {
      let that = this;
      let totalfee = 0;
      let prepay = that.transitOrderData.PRE_PAY;
      let afterpay = that.transitOrderData.AFTER_PAY;
      let periodicalpay = that.transitOrderData.PERIODICAL_PAY;

      totalfee = this.common.accAdd(totalfee,prepay);
      totalfee = this.common.accAdd(totalfee,afterpay);
      totalfee = this.common.accAdd(totalfee,periodicalpay);

      this.totalPaymentFee = totalfee;
    },

    /**
     * 订单详情
     */
    toOrderDetail(orderId)
    {
      let opType = this.$route.query.t;
      if(opType == 3){
        this.$parent.$emit("openTab",{
          urlId: 'orderDetail' + orderId,
          query: {orderId: orderId,pId: 1001070},
          urlName: "订单详情",
          urlPathName: "/order",
          urlPath: "/pt/ord/order/orderDetail/orderDetailMain.vue"});
      }else {
        this.$emit("openTab",{
          urlId: 'orderDetail' + orderId,
          query: {orderId: orderId,pId: 1001070},
          urlName: "订单详情",
          urlPathName: "/order",
          urlPath: "/pt/ord/order/orderDetail/orderDetailMain.vue"});
      }
    },

    changeDeliveryMode(){
        if (this.transitOrderData.DELIVERY_MODE == 1) {
          this.transitOrderData.UNLOAD_WORK_NODE_ID = this.transitOrderData.DEST_WORK_NODE_ID;
          this.transitOrderData.UNLOAD_WORK_NODE_NAME = this.transitOrderData.DEST_WORK_NODE_NAME;
          this.transitOrderData.UNLOAD_WORK_ADDRESS_STR = this.transitOrderData.DEST_WORK_ADDRESS_STR;
        }else {
          this.transitOrderData.UNLOAD_WORK_NODE_ID = '';
          this.transitOrderData.UNLOAD_WORK_NODE_NAME = '';
          this.transitOrderData.UNLOAD_WORK_ADDRESS_STR = '';
        }
    },

    //查询当前货主以及所有供应商的作业点加上我的仓库  目的地(目的地的情况，就不能选择)
    showArriveWorkDialog(){
      if(this.transitOrderData.deliveryMode==1 || !this.modifyOpDisable){
        return false;
      }
      // this.query.index = index;
      this.query.tenantId = [];
      this.query.tenantId.push(this.transitOrderData.CUST_ID);
      this.arriveWorkDialogShow = true;
      this.$nextTick(() => {
        this.doQueryWorkInfo();
      });
    },

    /**
     * 卸货地列表查询列表
     */
    doQueryWorkInfo()
    {
      //查询所有库存单的租户
      this.$refs.table.load("ordDispatchTF", "selWorkInfoListByCond", this.query);
    },

    /**
     * 选择卸货地时更新作业点信息
     * @returns {boolean}
     */
    selArriveWork(){
      let selectItems =  this.$refs.table.getSelectItem();
      if (selectItems.length !== 1){
        this.$message.error("请选择一个作业点!");
        return false;
      }
      let selectItem = selectItems[0];
      this.transitOrderData.UNLOAD_WORK_NODE_ID = selectItem.workId;
      this.transitOrderData.UNLOAD_WORK_NODE_NAME = selectItem.workName;
      this.transitOrderData.UNLOAD_WORK_ADDRESS_STR = selectItem.workAddress;
      let linkmanName = selectItem.linkmanName;
      let bill = selectItem.bill;

      for (let i = 0; i < this.transitWaybillOrderWorkList.length; i++) {
        let workInfo = this.transitWaybillOrderWorkList[i];
        if(workInfo.workType == 2 && workInfo.workId != this.transitOrderData.UNLOAD_WORK_NODE_ID){
            workInfo.workId = this.transitOrderData.UNLOAD_WORK_NODE_ID;
            workInfo.workName = this.transitOrderData.UNLOAD_WORK_NODE_NAME;
            workInfo.workAddress = this.transitOrderData.UNLOAD_WORK_ADDRESS_STR;
            workInfo.linkmanName = linkmanName;
            workInfo.bill = bill;
            break;
        }
      }

      this.arriveWorkDialogShow=false;
      this.$forceUpdate();
    },


    /** 刷新页面元素 */
    forceUpdate() {
      this.$forceUpdate();
    },

    closePage() {
      let opType = this.$route.query.t;
      if(opType == 3){
        this.$parent.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId);
      }else {
        this.$emit("closeTab", this.$route.meta.id, this.$route.meta.parentId);
      }
    }

    },
}
