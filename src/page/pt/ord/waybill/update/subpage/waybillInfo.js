import enumData  from "@/page/pt/enum.js"
import lazySelect from '@/components/lazySelect/lazySelect.vue'

export default {
  name: 'waybillInfo',
  props: {
    dispatchType: Number,
    waybillInfo:{type: Object}
  },
  data() {
    return {
      // waybillInfo:{
      //   isInvoice:'0',
      //   isUrgent:'0',
      //   haveReceipt:'0',
      //   billingType:'1',
      //   periodicalDay:30,//后续要从供应商去读取  默认30天
      // },
      whetherOptions:[],//是否
      supplierData:[],
      vehicleTypeOptions:[],
      billingTypeOptions:[],
      vehicleLengthOptions:[],
      quoteVehicleTypeData:[],
      vehicleData:[],
      driverData:[],
      bizTypeData: [],
      haveReceiptShow:true,


      supplierTenantIdDisabled:false,
      linkmanDisabled:false,
      linkPhoneDisabled:false,
      isInvoiceDisabled:false,
      isUrgentDisabled:false,
      haveReceiptDisabled:false,
      vehicleIdDisabled:false,
      vehicleTypeDisabled:false,
      vehicleLengthDisabled:false,
      driverUserIdDisabled:false,
      driverLinkPhoneDisabled:false,
      routeNameDisabled:false,
      feeModule:false,

      vehicleDisable:false,

      showGoodsDetialDialog:false,
    }
  },
  mounted() {
    this.initStaticData();
  },
  components: {
    lazySelect,
  },
  methods: {
    initSupplier(value){
      for (let i = 0; i < this.supplierData.length; i++) {
        if (value == this.supplierData[i].tenantId) {
          this.initVehicleList(this.supplierData[i].tenantId, this.supplierData[i].invoiceFlg);
          this.initDriverList(this.supplierData[i].tenantId, this.supplierData[i].invoiceFlg);
          this.$forceUpdate();
          break;
        }
      }
    },
    //根据调度类型显示不同的列
    initDisplayUI(){
      if(this.dispatchType == enumData.dispatchType.pickTransitDispatch){
        this.haveReceiptShow=false;
      }
    },
    initDisabled(waybillState){
      if(waybillState==enumData.waybillState.inWay
          ||waybillState==enumData.waybillState.finished){
        this.supplierTenantIdDisabled=true;
        this.linkmanDisabled=true;
        this.linkPhoneDisabled=true;
        // this.isInvoiceDisabled=true;
        this.isUrgentDisabled=true;
        // this.haveReceiptDisabled=true; 阿涛说的 随时都可以改
        this.vehicleIdDisabled=true;
        this.vehicleTypeDisabled=true;
        this.vehicleLengthDisabled=true;
        this.driverUserIdDisabled=true;
        this.driverLinkPhoneDisabled=true;
        if(waybillState==enumData.waybillState.finished){
          this.routeNameDisabled=true;
          this.feeModule=true;
        }
      }
      if(this.waybillInfo.vehicleId){
        this.vehicleDisable = true;
      }
      if(this.waybillInfo.entryBillFlag==1){
        this.isInvoiceDisabled=true;
      }
    },
    //初始化页面的静态数据
    initStaticData() {
      let that = this;
      this.common.postUrl('commonTF', 'getSysStaticDataByCodeTypes', {'codeType': 'WHETHER,VEHICLE_TYPE,VEHICLE_LENGTH,BILLING_TYPE_ORDER,VEHICLE_TYPE_QUOTE,BIZ_TYPE'}, function (data) {
        that.whetherOptions = data.WHETHER;
        that.vehicleTypeOptions = data.VEHICLE_TYPE;
        that.vehicleLengthOptions = data.VEHICLE_LENGTH;
        that.billingTypeOptions = data.BILLING_TYPE_ORDER;
        that.quoteVehicleTypeData = data.VEHICLE_TYPE_QUOTE;
        that.bizTypeData = data.BIZ_TYPE;
        that.$forceUpdate();
      });
      this.initSupplierData();
    },
    initSupplierData(){
      let that = this;
      this.common.postUrl("supplierTF", "queryAllSupplierList", {}, function (data) {
        that.supplierData = data;
        if(that.waybillInfo.supplierTenantId){
          that.initSupplier(that.waybillInfo.supplierTenantId);
        }
      });
    },
      async changeSupplier(value){
          let list = await this.common.postUrl("commonTF", "getOwnSupplierTenantIds", {});
          let isOwnSupplierTenantId = false;
          for (let item of list)
          {
              if (item == value)
              {
                  isOwnSupplierTenantId = true;
                  break;
              }
          }
        if (isOwnSupplierTenantId)
        {
            let fee = this.$parent.$refs.orderStock.totalInfo.amount;
            if (fee > 0)
            {
                this.waybillInfo.freight = this.common.accMul(fee, this.common.shareRate).toFixed(2);
            }
            else
            {
                this.waybillInfo.freight = null;
            }
        }
        else
        {
            this.waybillInfo.freight = null;
        }
        
        this.changeFee('freight');
        
      for (let i = 0; i < this.supplierData.length; i++) {
        if(value==this.supplierData[i].tenantId){
          this.waybillInfo.linkman = this.supplierData[i].linkman;
          this.waybillInfo.linkPhone = this.supplierData[i].linkPhone;
          this.waybillInfo.isInvoice = this.supplierData[i].invoiceFlg+'';
          this.waybillInfo.periodicalDay = this.supplierData[i].accountPeriod;
          if(this.common.isBlank(this.waybillInfo.periodicalDay)){
            this.waybillInfo.periodicalDay = 30;
          }
          this.clearSelVehicleInfo();
          this.clearSelDriverInfo();
          this.initVehicleList(this.supplierData[i].tenantId,this.supplierData[i].invoiceFlg);
          this.initDriverList(this.supplierData[i].tenantId,this.supplierData[i].invoiceFlg);
          break;
        }
      }
    },
    changeIsInvoice(){
      if(this.waybillInfo.supplierTenantId){
        if(!this.vehicleIdDisabled){
          if(this.driverData!=[]){
            this.clearSelVehicleInfo();
            this.clearSelDriverInfo();
          }
          this.initVehicleList(this.waybillInfo.supplierTenantId,this.waybillInfo.isInvoice);
          this.initDriverList(this.waybillInfo.supplierTenantId,this.waybillInfo.isInvoice);
        }
      }
    },
    //初始化车辆
    initVehicleList(supplierTenantId,isInvoice){
      let that = this;
      that.vehicleData=[];
      this.common.postUrl("resVehicleInfoTF", "selVehicleInfoListByCond", {tenantId:supplierTenantId,isInvoice,rows:9999}, function (data) {
        that.vehicleData = data.items;
        that.$forceUpdate();
      });
    },
    //清除选择车辆信息
    clearSelVehicleInfo(){
      this.waybillInfo.vehicleId='';
      this.waybillInfo.plateNumber='';
      this.waybillInfo.vehicleType='';
      this.waybillInfo.vehicleLength='';
      this.vehicleDisable = false;
      this.$forceUpdate();
    },
    //切换车辆
    changeVehicle(value){
      this.clearSelVehicleInfo();
      for (let i = 0; i < this.vehicleData.length; i++) {
        if(value==this.vehicleData[i].vehicleId){
          this.waybillInfo.vehicleId=this.vehicleData[i].vehicleId;
          this.waybillInfo.plateNumber=this.vehicleData[i].plateNumber;
          this.waybillInfo.vehicleType=this.vehicleData[i].vehicleType+'';
          this.waybillInfo.vehicleLength=this.vehicleData[i].vehicleLength+'';
          this.vehicleDisable = true;
          this.$forceUpdate();
          break;
        }
      }
    },
    //初始化司机
    initDriverList(supplierTenantId,isInvoice){
      let that = this;
      that.driverData=[];
      this.common.postUrl("driverTF", "selDriverInfoListByCond", {tenantId:supplierTenantId,isInvoice,ownVehicle:1,rows:9999}, function (data) {
        that.driverData = data.items;
        that.$forceUpdate();
      });
    },
    //清除选择司机信息
    clearSelDriverInfo(){
      this.waybillInfo.driverUserId='';
      this.waybillInfo.driverName='';
      this.waybillInfo.driverLinkPhone='';
      this.$forceUpdate();
    },
    //切换司机
    changeDriver(value){
      for (let i = 0; i < this.driverData.length; i++) {
        if(value==this.driverData[i].driverUserId){
          this.waybillInfo.driverUserId=this.driverData[i].driverUserId;
          this.waybillInfo.driverName=this.driverData[i].driverName;
          this.waybillInfo.driverLinkPhone=this.driverData[i].driverPhone;
          this.$forceUpdate();
          break;
        }
      }
    },

    changeFee(col){
      this.calculateFee();
      this.shareFee(col,this.waybillInfo[col]);
    },
    //回调金额用于分摊金额
    shareFee(col,value){
      this.$parent.shareFee(col,value);
    },
    //计算总金额
    calculateFee(){
      let tmpAmount = this.waybillInfo.amount;
      if(this.waybillInfo.billingType==enumData.billingTypeOrder.byGrossweight){
        this.waybillInfo.freight=this.common.accMul(this.waybillInfo.grossWeight,this.waybillInfo.freightPrice);
      }else if(this.waybillInfo.billingType==enumData.billingTypeOrder.byNetweight){
        this.waybillInfo.freight=this.common.accMul(this.waybillInfo.netWeight,this.waybillInfo.freightPrice);
      }else if(this.waybillInfo.billingType==enumData.billingTypeOrder.byVolume){
        this.waybillInfo.freight=this.common.accMul(this.waybillInfo.volume,this.waybillInfo.freightPrice);
      }
      this.waybillInfo.totalPointFee =this.common.accMul(this.waybillInfo.midwayPointNum,this.waybillInfo.pointFee);
      this.waybillInfo.totalFee = this.common.accAdd(this.waybillInfo.freight,this.waybillInfo.totalPointFee);
      // this.waybillInfo.totalFee = this.common.accAdd(this.waybillInfo.totalFee,this.waybillInfo.premiumFee);
      // this.waybillInfo.totalFee = this.common.accAdd(this.waybillInfo.totalFee,this.waybillInfo.loadingFee);
      // this.waybillInfo.totalFee = this.common.accAdd(this.waybillInfo.totalFee,this.waybillInfo.dischargeFee);
      // this.waybillInfo.totalFee = this.common.accAdd(this.waybillInfo.totalFee,this.waybillInfo.otherFee);

      this.waybillInfo.amount = this.common.accAdd(this.waybillInfo.totalFee,this.waybillInfo.statementFee);
      this.waybillInfo.amount = this.common.accAdd(this.waybillInfo.amount,this.waybillInfo.makeupFee);
      tmpAmount = this.common.accSub(this.waybillInfo.amount,tmpAmount);
      if(tmpAmount>=0){
        this.waybillInfo.periodicalPay = this.common.accAdd(this.waybillInfo.periodicalPay,tmpAmount);
      }else{
        while(tmpAmount<0){
          if(this.waybillInfo.prePay>0){
            if(this.common.accAdd(this.waybillInfo.prePay,tmpAmount)<=0){
              this.waybillInfo.prePay = 0;
              tmpAmount=this.common.accAdd(this.waybillInfo.prePay,tmpAmount);
            }else{
              tmpAmount=0;
              this.waybillInfo.prePay=this.common.accAdd(this.waybillInfo.prePay,tmpAmount);
            }
          }else if(this.waybillInfo.afterPay>0){
            if(this.common.accAdd(this.waybillInfo.afterPay,tmpAmount)<=0){
              this.waybillInfo.afterPay = 0;
              tmpAmount=this.common.accAdd(this.waybillInfo.afterPay,tmpAmount);
            }else{
              tmpAmount=0;
              this.waybillInfo.afterPay=this.common.accAdd(this.waybillInfo.afterPay,tmpAmount);
            }
          }else if(this.waybillInfo.periodicalPay>0){
            if(this.common.accAdd(this.waybillInfo.periodicalPay,tmpAmount)<=0){
              this.waybillInfo.periodicalPay = 0;
              tmpAmount=this.common.accAdd(this.waybillInfo.periodicalPay,tmpAmount);
            }else{
              tmpAmount=0;
              this.waybillInfo.periodicalPay=this.common.accAdd(this.waybillInfo.periodicalPay,tmpAmount);
            }
          }else{
            tmpAmount=0;
          }
        }
      }



      this.$forceUpdate();
    },
    //校验付费的金额
    checkTotalPay(){
      let totalPay = 0;
      totalPay = this.common.accAdd(this.waybillInfo.prePay,this.waybillInfo.afterPay);
      totalPay = this.common.accAdd(totalPay,this.waybillInfo.periodicalPay);
      if(totalPay!=this.waybillInfo.amount){
        return false;
      }
      return true;
    },
    changeMidwayPointNum(midwayPointNum){
      this.waybillInfo.midwayPointNum = midwayPointNum<0?0:midwayPointNum;
      this.changeFee('totalPointFee');
    },
    getData(){
      if(this.waybillInfo.periodicalDay&&this.waybillInfo.periodicalDay>365){
        this.$message.error("周期天数不能超过365天");
        return;
      }
      return this.waybillInfo;
    },
    setBizType(bizType){
      this.waybillInfo.bizType = bizType;
      this.$forceUpdate();
    },
    forceUpdate(){
      this.$forceUpdate();
    },
    async initPieceGoods() {
      if (this.waybillInfo.billingType != 5) {
        return;
      }
      //拿出来所有的库存单对应的货物
      let allOrderStocks = this.$parent.getAllOrderStock();
      let orderStockIds = [];
      let allOrderStockMap = new Map();
      for (let i = 0; i < allOrderStocks.length; i++) {
        orderStockIds.push(allOrderStocks[i].orderStockId);
        allOrderStockMap.set(allOrderStocks[i].orderStockId, allOrderStocks[i]);
      }
      let orderStockDetailList = await this.common.postUrl("ordDispatchTF", "queryAllOrdStockGoodsDetailList", {orderStockIds});
      let goods = new Map();
      for (let i = 0; i < orderStockDetailList.length; i++) {
        let orderStockDetail = orderStockDetailList[i];
        let orderStock = this.common.copyObj(allOrderStockMap.get(orderStockDetail.orderStockId));
        orderStock.goodsId = orderStockDetail.goodsId;
        orderStock.goodsName = orderStockDetail.goodsName;
        orderStock.custTenantId = orderStock.orderCustId;
        orderStock.custTenantName = orderStock.orderCustName;
        orderStock.beginWorkId = orderStock.workId;
        orderStock.beginWorkName = orderStock.workName;
        orderStock.endWorkId = orderStock.arriveWorkId;
        orderStock.endWorkName = orderStock.arriveWorkName;
        let key = orderStock.custTenantId+'_'+orderStock.goodsId+'_'+orderStock.beginWorkId+'_'+orderStock.endWorkId;
        if(!goods.get(key)){
          goods.set(key,orderStock);
        }
      }

      for (let i = 0; i < this.waybillInfo.pieceGoodsList.length; i++) {
        let pieceGood = this.waybillInfo.pieceGoodsList[i];
        let key = pieceGood.custTenantId+'_'+pieceGood.goodsId+'_'+pieceGood.beginWorkId+'_'+pieceGood.endWorkId;
        goods.get(key).piecePrice=pieceGood.piecePrice;
        goods.get(key).pieceFee=pieceGood.pieceFee;
        goods.get(key).actualGoodsCount=pieceGood.actualGoodsCount;
      }
      this.waybillInfo.goods = goods;
    },
    //打开维护运输实际件数界面
    async updatePieceGoods(flag) {
      if(this.waybillInfo.billingType!=5){
        return;
      }
      this.waybillInfo.pieceGoodsList=[];
      //拿出来所有的库存单对应的货物
      let allOrderStocks = this.$parent.getAllOrderStock();
      let orderStockIds = [];
      let allOrderStockMap = new Map();
      for (let i = 0; i < allOrderStocks.length; i++) {
        orderStockIds.push(allOrderStocks[i].orderStockId);
        allOrderStockMap.set(allOrderStocks[i].orderStockId,allOrderStocks[i]);
      }
      let orderStockDetailList = await this.common.postUrl("ordDispatchTF", "queryAllOrdStockGoodsDetailList", {orderStockIds});
      //所有的货物  根据客户 货物 起始点 终点 去重
      let goods = this.waybillInfo.goods;

      let delGoodsKey = new Set();
      for (let key of goods.keys()) {
        delGoodsKey.add(key);
      }
      for (let i = 0; i < orderStockDetailList.length; i++) {
        let orderStockDetail = orderStockDetailList[i];
        let orderStock = this.common.copyObj(allOrderStockMap.get(orderStockDetail.orderStockId));
        orderStock.goodsId = orderStockDetail.goodsId;
        orderStock.goodsName = orderStockDetail.goodsName;
        orderStock.custTenantId = orderStock.orderCustId;
        orderStock.custTenantName = orderStock.orderCustName;
        orderStock.beginWorkId = orderStock.workId;
        orderStock.beginWorkName = orderStock.workName;
        orderStock.endWorkId = orderStock.arriveWorkId;
        orderStock.endWorkName = orderStock.arriveWorkName;
        orderStock.actualGoodsCount = 0;
        orderStock.piecePrice = 1;//todo  待查找价格
        orderStock.pieceFee = 0;
        let key = orderStock.custTenantId+'_'+orderStock.goodsId+'_'+orderStock.beginWorkId+'_'+orderStock.endWorkId;
        delGoodsKey.delete(key);
        if(!goods.get(key)){
          goods.set(key,orderStock);
        }
      }
      for (let k of delGoodsKey.keys()) {
        goods.delete(k);
      }
      for (let value of goods.values()) {
        this.waybillInfo.pieceGoodsList.push(this.common.copyObj(value));
      }

      //查询
      this.saveGoodsDetail();
      this.showGoodsDetialDialog = flag;
      this.$forceUpdate();
    },
    inputGoodsDetail(index){
      let pieceGood = this.waybillInfo.pieceGoodsList[index];
      pieceGood.pieceFee = this.common.accMul(pieceGood.actualGoodsCount,pieceGood.piecePrice)
      this.$forceUpdate();
    },
    saveGoodsDetail(){
      let totalPieceFee = 0;
      for (let i = 0; i < this.waybillInfo.pieceGoodsList.length; i++) {
        let pieceGood = this.waybillInfo.pieceGoodsList[i];
        let key = pieceGood.custTenantId+'_'+pieceGood.goodsId+'_'+pieceGood.beginWorkId+'_'+pieceGood.endWorkId;
        this.waybillInfo.goods.get(key).pieceFee=pieceGood.pieceFee;
        this.waybillInfo.goods.get(key).actualGoodsCount=pieceGood.actualGoodsCount;
        totalPieceFee = this.common.accAdd(pieceGood.pieceFee,totalPieceFee);
      }
      this.waybillInfo.freight = totalPieceFee;
      this.$forceUpdate();
      this.changeFee('freight');
      this.showGoodsDetialDialog = false;
    },
  },
}
