import enumData  from "@/page/pt/enum.js"
import lazySelect from '@/components/lazySelect/lazySelect.vue'

export default {
  name: 'waybillInfo',
  props: ['dispatchType'],
  data() {
    return {
      waybillInfo:{
          isSync:'',
        isInvoice:'0',
        isUrgent:'0',
        bizType:'',
        haveReceipt:'0',
        billingType:'1',
        periodicalDay:30,//后续要从供应商去读取  默认30天
        pieceGoodsList:[],
        goods:new Map(),
      },
      whetherOptions:[],//是否
      supplierData:[],
      vehicleTypeOptions:[],
      billingTypeOptions:[],
      vehicleLengthOptions:[],
      quoteVehicleTypeData:[],
      vehicleData:[],
      driverData:[],
      settleBodyData:[],
      haveReceiptShow:true,
      vehicleDisable:false,
      showGoodsDetialDialog:false,

      isInvoiceDisabled:false,
      isInvoice:-1,
      ownVehicle:-1,
      payMode:-1,
      isClick:false,
    }
  },
  mounted() {
    this.initStaticData();
  },
  components: {
    lazySelect,
  },
  methods: {
    //根据调度类型显示不同的列
    initDisplayUI(){
      if(this.dispatchType == enumData.dispatchType.pickTransitDispatch){
        this.haveReceiptShow=false;
      }
    },
    //初始化页面的静态数据
    initStaticData(){
      let that = this;
      this.common.postUrl('commonTF','getSysStaticDataByCodeTypes',{'codeType':'WHETHER,VEHICLE_TYPE,VEHICLE_LENGTH,BILLING_TYPE_ORDER,VEHICLE_TYPE_QUOTE,PAY_TITLE'},function (data) {
        that.whetherOptions = data.WHETHER;
        that.vehicleTypeOptions = data.VEHICLE_TYPE;
        that.vehicleLengthOptions = data.VEHICLE_LENGTH;
        that.billingTypeOptions = data.BILLING_TYPE_ORDER;
        that.quoteVehicleTypeData = data.VEHICLE_TYPE_QUOTE;
        that.settleBodyData = data.PAY_TITLE;
        that.$forceUpdate();
      });
      this.initSupplierData();
    },
    async initSupplierData() {
      let that = this;
      await this.common.postUrl("supplierTF", "queryAllSupplierList", {isInvoice: this.isInvoice}, function (data) {
        that.supplierData = data;
      });
    },
    changePayMode(payMode){
      this.waybillInfo.supplierTenantId = '';
      this.waybillInfo.linkman = '';
      this.waybillInfo.linkPhone = '';
      this.waybillInfo.periodicalDay = '30';
      this.clearSelVehicleInfo();
      this.clearSelDriverInfo();

      if(payMode==1){
        this.waybillInfo.isInvoice = '1';
        this.isInvoice = 1;
        this.ownVehicle = -1;
      }else if(payMode==2){
        this.waybillInfo.isInvoice = '0';
        this.isInvoice = 0;
        this.ownVehicle = 1;
      }else{
        this.waybillInfo.isInvoice = '0';
        this.isInvoice = 0;
        this.ownVehicle = -1;
      }
      this.payMode = payMode;
      this.isInvoiceDisabled = true;
      this.initSupplierData();

      //费用
      this.waybillInfo.freightPrice='';
      this.changeFee('freight');
      this.waybillInfo.pointFee='';
      this.changeFee('totalPointFee');
      this.waybillInfo.freight='';
      this.changeFee('freight');
      this.$forceUpdate();
    },

    async clearPayMode() {
      this.isInvoice = -1;
      this.ownVehicle = -1;
      this.isInvoiceDisabled = false;
      await this.initSupplierData();
    },

    clearSupplier(){
      this.waybillInfo.linkman = '';
      this.waybillInfo.linkPhone = '';
      this.waybillInfo.isInvoice = '';
      this.clearSelVehicleInfo();
      this.clearSelDriverInfo();
      this.vehicleData=[];
      this.driverData=[];
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
      
      if(!value){
        this.clearSupplier();
        return;
      }
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
      //触发价格匹配
      this.matchQuote();
    },
    changeIsInvoice(){
      if(this.waybillInfo.supplierTenantId){
        if(this.driverData!=[]){
          this.clearSelVehicleInfo();
          this.clearSelDriverInfo();
        }
        this.initVehicleList(this.waybillInfo.supplierTenantId,this.waybillInfo.isInvoice);
        this.initDriverList(this.waybillInfo.supplierTenantId,this.waybillInfo.isInvoice);
      }
    },
    //初始化车辆
    initVehicleList(supplierTenantId,isInvoice){
      let that = this;
      that.vehicleData=[];
      this.common.postUrl("resVehicleInfoTF", "selVehicleInfoListByCond", {tenantId:supplierTenantId,isInvoice,ownVehicle:this.ownVehicle,rows:9999}, function (data) {
        that.vehicleData = data.items;
        that.$forceUpdate();
      });
    },
    //清除选择车辆信息
    clearSelVehicleInfo(){
      this.waybillInfo.vehicleId='';
      this.waybillInfo.plateNumber='';
      this.waybillInfo.vehicleType='';
      // this.waybillInfo.quoteVehicleType='';
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
          // this.waybillInfo.quoteVehicleType=this.vehicleData[i].vehicleTypeQuote+'';
          this.waybillInfo.vehicleLength=this.vehicleData[i].vehicleLength+'';
          this.vehicleDisable = true;
          if(this.payMode<0){
            if(this.vehicleData[i].vehicleAttribution==2||this.vehicleData[i].vehicleAttribution==3){
              this.ownVehicle = 1;
            }else{
              if(this.ownVehicle==1){
                this.clearSelDriverInfo();
              }
              this.ownVehicle = -1;
            }
            this.initDriverList(this.waybillInfo.supplierTenantId,this.waybillInfo.isInvoice);
          }
          this.$forceUpdate();
          break;
        }
      }
      //触发价格匹配
      this.matchQuote();
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
      this.waybillInfo.periodicalPay = this.waybillInfo.totalFee;
      this.$parent.$refs.feeInfo.calcTotalStatementFeeSum(this.waybillInfo.totalFee);
      this.$forceUpdate();
    },
    //校验付费的金额
    checkTotalPay(){
      let totalPay = 0;
      totalPay = this.common.accAdd(this.waybillInfo.prePay,this.waybillInfo.afterPay);
      totalPay = this.common.accAdd(totalPay,this.waybillInfo.periodicalPay);
      if(totalPay!=this.waybillInfo.totalFee){
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
    selSectionFee(item){
      //干线供应商
      this.waybillInfo.supplierTenantId=item.tenantId;
      this.changeSupplier(item.tenantId);
      this.waybillInfo.billingType = item.billingType;
      this.waybillInfo.quoteVehicleType = item.quoteVehicleType;
      this.waybillInfo.vehicleLength = item.vehicleLength;
      //费用
      this.waybillInfo.freightPrice=item.feePrice;
      this.changeFee('freight');
      this.waybillInfo.midwayPointNum=item.midwayPointNum;
      this.waybillInfo.pointFee=item.pointFee;
      this.changeFee('totalPointFee');
      this.waybillInfo.freight=item.freight;
      this.changeFee('freight');
      this.$forceUpdate();
    },
    //打开维护运输实际件数界面
    async initPieceGoods() {
      if(this.waybillInfo.billingType!=5){
        this.matchQuote();
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
        orderStock.piecePrice = 0;
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
      //触发价格匹配
      this.matchQuote();
      this.saveGoodsDetail();
      // this.showGoodsDetialDialog = flag;
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
    //获取最优报价
    async matchQuote(){
      if(!this.isClick){
        return;
      }
      
        let list = await this.common.postUrl("commonTF", "getOwnSupplierTenantIds", {});
        let isOwnSupplierTenantId = false;
        for (let item of list)
        {
            if (item == this.waybillInfo.supplierTenantId)
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
                this.changeFee('freight');
            }
            else
            {
                this.waybillInfo.freight = null;
                this.changeFee('freight');
            }
            return;
        }
        
      let param = this.$parent.initParam();
      let pointNums = param.workList.length;
      let feeData = await this.common.postUrl("ZCQuoteNewTF", "querySupplierZCBestQuote", param);
      
      if(this.waybillInfo.billingType==5)//按件
      {
        for (let i = 0; i < this.waybillInfo.pieceGoodsList.length; i++) {
          let pieceGood = this.waybillInfo.pieceGoodsList[i];
          let key = pieceGood.custTenantId+'_'+pieceGood.goodsId+'_'+pieceGood.beginWorkId+'_'+pieceGood.endWorkId;
          this.waybillInfo.goods.get(key).piecePrice=0;
          this.waybillInfo.pieceGoodsList[i].piecePrice=0;
          this.waybillInfo.pieceGoodsList[i].pieceFee = 0;
        }
      }else{
        this.waybillInfo.freightPrice = 0;
        this.changeFee('freight');
        this.waybillInfo.pointFee=0;
        this.waybillInfo.totalPointFee =0;
        this.waybillInfo.freight=0;
        this.changeFee('totalPointFee');
      }
      if(JSON.stringify(feeData) != '{}'){
        if(this.waybillInfo.billingType==5){//按件
          for (let i = 0; i < this.waybillInfo.pieceGoodsList.length; i++) {
            let pieceGood = this.waybillInfo.pieceGoodsList[i];
            let key = pieceGood.custTenantId+'_'+pieceGood.goodsId+'_'+pieceGood.beginWorkId+'_'+pieceGood.endWorkId;
            this.waybillInfo.goods.get(key).piecePrice=feeData[key].feePrice;
            this.waybillInfo.pieceGoodsList[i].piecePrice=feeData[key].feePrice;
            this.waybillInfo.pieceGoodsList[i].pieceFee = this.common.accMul(this.waybillInfo.pieceGoodsList[i].actualGoodsCount,this.waybillInfo.pieceGoodsList[i].piecePrice);
          }
        }else{
          if(this.waybillInfo.billingType!=1) {
            this.waybillInfo.freightPrice = feeData.feePrice;
          }else{
            this.waybillInfo.freight = feeData.feePrice;
          }
          this.changeFee('freight');
          if(feeData.dtlNums<pointNums&&feeData.pointFee>0){
            this.waybillInfo.pointFee=feeData.pointFee;
            // let tmp = this.common.accSub(pointNums,feeData.dtlNums);
            this.waybillInfo.midwayPointNum = feeData.midwayPointNum;
            // this.waybillInfo.totalPointFee =this.common.accMul(tmp,this.waybillInfo.pointFee);
            this.changeFee('totalPointFee');
          }
        }
      }
      this.isClick=false;
      this.$forceUpdate();
    },
    changeClick(){
      this.isClick=true;
      this.$forceUpdate();
    }
  },
}
