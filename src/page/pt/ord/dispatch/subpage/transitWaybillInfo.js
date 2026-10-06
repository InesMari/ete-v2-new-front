import enumData from "@/page/pt/enum";

export default {
  name: 'transitWaybillInfo',
  data() {
    return {
      waybillInfo:{
        isInvoice:'0',
        isUrgent:'0',
        haveReceipt:'0',
        periodicalDay:30,//后续要从供应商去读取  默认30天
        pieceGoodsList:[],
        goods:new Map(),
      },
      whetherOptions:[],//是否
      vehicleTypeOptions:[],
      vehicleLengthOptions:[],
      billingTypeOptions:[],
      transportOptions:[],
      vehicleData:[],
      driverData:[],

      pickerOptions:{
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '明天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周后',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      vehicleDisable:{
        pickup:false,
        delivery:false,
        trunkRoad:false,
      },
      isInvoiceDisabled:false,
      showGoodsDetialDialog:false,
      isClick:false,
    }
  },
  mounted() {
    this.initStaticData();
  },

  components: {
  },
  methods: {

    //初始化页面的静态数据
    initStaticData(){
      let that = this;
      this.common.postUrl('commonTF','getSysStaticDataByCodeTypes',{'codeType':'WHETHER,VEHICLE_TYPE,VEHICLE_LENGTH,BILLING_TYPE_ORDER,TRANSPORT'},function (data) {
        that.whetherOptions = data.WHETHER;
        that.vehicleTypeOptions = data.VEHICLE_TYPE;
        that.vehicleLengthOptions = data.VEHICLE_LENGTH;
        that.billingTypeOptions = data.BILLING_TYPE_ORDER;
        //去掉按整车
        for (let i = 0; i < that.billingTypeOptions.length; i++) {
          if('1'==that.billingTypeOptions[i].codeValue){
            that.billingTypeOptions.splice(i,1);
            break;
          }
        }
        that.transportOptions = data.TRANSPORT;
      });
    },
    changePayMode(payMode){
      this.waybillInfo.supplierTenantId='';
      this.waybillInfo.supplierName='';
      this.waybillInfo.linkman = '';
      this.waybillInfo.linkPhone = '';
      this.clearSelVehicleInfo();
      this.clearSelDriverInfo();
      if(payMode==1){
        this.waybillInfo.isInvoice = '1';
      }else{
        this.waybillInfo.isInvoice = '0';
      }
      this.isInvoiceDisabled = true;
    },
    clearPayMode(){
      this.isInvoiceDisabled = false;
    },
    changeSupplier(item){
      this.waybillInfo.supplierTenantId=item.tenantId;
      this.waybillInfo.supplierName=item.supplierName;
      this.waybillInfo.linkman = item.linkman;
      this.waybillInfo.linkPhone = item.linkPhone;
      if(!this.isInvoiceDisabled){
        this.waybillInfo.isInvoice = item.invoiceFlg+'';
      }
      this.waybillInfo.periodicalDay = item.accountPeriod;
      if(this.common.isBlank(this.waybillInfo.periodicalDay)){
        this.waybillInfo.periodicalDay = 30;
      }
      this.clearSelVehicleInfo();
      this.clearSelDriverInfo();
      this.initVehicleList(item.tenantId,this.waybillInfo.isInvoice);
      this.initDriverList(item.tenantId,this.waybillInfo.isInvoice);
    },
    //初始化车辆
    initVehicleList(supplierTenantId,isInvoice){
      let that = this;
      that.vehicleData=[];
      this.common.postUrl("resVehicleInfoTF", "selVehicleInfoListByCond", {tenantId:supplierTenantId,isInvoice,rows:2500}, function (data) {
        that.vehicleData = data.items;
        that.$forceUpdate();
      });
    },
    getRealKey(prefix,key){
      return prefix+key.substr(0,1).toUpperCase()+key.substr(1);
    },
    //清除选择车辆信息
    clearSelVehicleInfo(){
      this.vehicleData=[];
      this.clearOneSelVehicleInfo('pickup');
      this.clearOneSelVehicleInfo('delivery');
      this.clearOneSelVehicleInfo('trunkRoad');
    },
    //清除提货送货干线其中一种车辆信息
    clearOneSelVehicleInfo(prefix){
      this.waybillInfo[this.getRealKey(prefix,'vehicleId')]='';
      this.waybillInfo[this.getRealKey(prefix,'plateNumber')]='';
      this.waybillInfo[this.getRealKey(prefix,'vehicleType')]='';
      this.waybillInfo[this.getRealKey(prefix,'vehicleLength')]='';
      this.vehicleDisable[prefix]=false;
      this.$forceUpdate();
    },
    //切换车辆
    changeVehicle(value,prefix){
      this.clearOneSelVehicleInfo(prefix);
      for (let i = 0; i < this.vehicleData.length; i++) {
        if(value==this.vehicleData[i].vehicleId){
          this.waybillInfo[this.getRealKey(prefix,'vehicleId')]=this.vehicleData[i].vehicleId;
          this.waybillInfo[this.getRealKey(prefix,'plateNumber')]=this.vehicleData[i].plateNumber;
          this.waybillInfo[this.getRealKey(prefix,'vehicleType')]=this.vehicleData[i].vehicleType+'';
          this.waybillInfo[this.getRealKey(prefix,'vehicleLength')]=this.vehicleData[i].vehicleLength+'';
          this.vehicleDisable[prefix]=false;
          this.$forceUpdate();
          break;
        }
      }
    },
    //输入车辆信息
    inputVehicleInfo(e,prefix){
      this.clearOneSelVehicleInfo(prefix);
      this.waybillInfo[this.getRealKey(prefix,'vehicleId')]=e.target.value;
      this.waybillInfo[this.getRealKey(prefix,'plateNumber')]=e.target.value;
      this.$forceUpdate();
    },
    //初始化司机
    initDriverList(supplierTenantId,isInvoice){
      let that = this;
      that.driverData=[];
      this.common.postUrl("driverTF", "selDriverInfoListByCond", {tenantId:supplierTenantId,isInvoice,rows:2500}, function (data) {
        that.driverData = data.items;
        that.$forceUpdate();
      });
    },
    //清除选择司机信息
    clearSelDriverInfo(){
      this.driverData=[];
      this.clearOneSelDriverInfo('pickup');
      this.clearOneSelDriverInfo('delivery');
      this.clearOneSelDriverInfo('trunkRoad');
    },
    //清除提货送货干线其中一种司机信息
    clearOneSelDriverInfo(prefix){
      this.waybillInfo[this.getRealKey(prefix,'driverUserId')]='';
      this.waybillInfo[this.getRealKey(prefix,'driverName')]='';
      this.waybillInfo[this.getRealKey(prefix,'driverLinkPhone')]='';
      this.$forceUpdate();
    },
    //输入司机信息
    inputDriverInfo(e,prefix){
      this.clearOneSelDriverInfo(prefix);
      this.waybillInfo[this.getRealKey(prefix,'driverUserId')]=e.target.value;
      this.waybillInfo[this.getRealKey(prefix,'driverName')]=e.target.value;
      this.$forceUpdate();
    },

    //切换司机
    changeDriver(value,prefix){
      for (let i = 0; i < this.driverData.length; i++) {
        if(value==this.driverData[i].driverUserId){
          this.waybillInfo[this.getRealKey(prefix,'driverUserId')]=this.driverData[i].driverUserId;
          this.waybillInfo[this.getRealKey(prefix,'driverName')]=this.driverData[i].driverName;
          this.waybillInfo[this.getRealKey(prefix,'driverLinkPhone')]=this.driverData[i].driverPhone;
          this.$forceUpdate();
          break;
        }
      }
    },
    getData(){
      if(this.waybillInfo.periodicalDay&&this.waybillInfo.periodicalDay>365){
        this.$message.error("周期天数不能超过365天");
        return;
      }
      return this.waybillInfo;
    },
    forceUpdate(){
      this.$forceUpdate();
    },

    selSectionFee(item){
      //费用
      this.waybillInfo.freightPrice=item.freightFeePrice;
      this.waybillInfo.transitPickupFee=item.pickupFee;
      this.waybillInfo.transitFee=item.freightFee;
      this.waybillInfo.transitDeliveryFee=item.deliveryFee;
      this.waybillInfo.totalFee=item.totalFee;
      this.waybillInfo.billingType = item.billingType;
      this.waybillInfo.transport = item.transport;
      this.waybillInfo.periodicalPay = this.waybillInfo.totalFee;
      this.$forceUpdate();
    },

    //计算总金额
    calculateFee(){
      if(this.waybillInfo.billingType==enumData.billingTypeOrder.byGrossweight){
        this.waybillInfo.transitFee=this.common.accMul(this.waybillInfo.grossWeight,this.waybillInfo.freightPrice);
      }else if(this.waybillInfo.billingType==enumData.billingTypeOrder.byNetweight){
        this.waybillInfo.transitFee=this.common.accMul(this.waybillInfo.netWeight,this.waybillInfo.freightPrice);
      }else if(this.waybillInfo.billingType==enumData.billingTypeOrder.byVolume){
        this.waybillInfo.transitFee=this.common.accMul(this.waybillInfo.volume,this.waybillInfo.freightPrice);
      }
      this.waybillInfo.totalFee = this.common.accAdd(this.waybillInfo.transitFee,this.waybillInfo.transitOtherFee);
      this.waybillInfo.totalFee = this.common.accAdd(this.waybillInfo.totalFee,this.waybillInfo.transitPickupFee);
      this.waybillInfo.totalFee = this.common.accAdd(this.waybillInfo.totalFee,this.waybillInfo.transitDeliveryFee);

      this.waybillInfo.periodicalPay = this.waybillInfo.totalFee;
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
        orderStock.piecePrice = 0;//todo  待查找价格
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
      this.waybillInfo.transitFee = totalPieceFee;
      this.$forceUpdate();
      this.calculateFee();
      this.showGoodsDetialDialog = false;
    },

    //获取最优报价
    async matchQuote(){
      if(!this.isClick){
        return;
      }
      let param = this.$parent.initParam();
      let feeData = await this.common.postUrl("quoteLDNewTF", "querySupplierLDBestQuote", param);
      if(this.waybillInfo.billingType==5){//按件
        for (let i = 0; i < this.waybillInfo.pieceGoodsList.length; i++) {
          let pieceGood = this.waybillInfo.pieceGoodsList[i];
          let key = pieceGood.custTenantId+'_'+pieceGood.goodsId+'_'+pieceGood.beginWorkId+'_'+pieceGood.endWorkId;
          this.waybillInfo.goods.get(key).piecePrice=0;
          this.waybillInfo.pieceGoodsList[i].piecePrice=0;
          this.waybillInfo.pieceGoodsList[i].pieceFee = 0;
        }
      }else{
        this.waybillInfo.transitPickupFee = 0;
        this.waybillInfo.transitDeliveryFee = 0;
        this.waybillInfo.freightPrice = 0;
        this.waybillInfo.transitFee=0;
        this.calculateFee();
      }
      if(JSON.stringify(feeData) != '{}'){
        if(this.waybillInfo.billingType==5){//按件
          for (let i = 0; i < this.waybillInfo.pieceGoodsList.length; i++) {
            let pieceGood = this.waybillInfo.pieceGoodsList[i];
            let key = pieceGood.custTenantId+'_'+pieceGood.goodsId+'_'+pieceGood.beginWorkId+'_'+pieceGood.endWorkId;
            this.waybillInfo.goods.get(key).piecePrice=feeData['goodsId'+pieceGood.goodsId];
            this.waybillInfo.pieceGoodsList[i].piecePrice=feeData['goodsId'+pieceGood.goodsId];
            this.waybillInfo.pieceGoodsList[i].pieceFee = this.common.accMul(this.waybillInfo.pieceGoodsList[i].actualGoodsCount,this.waybillInfo.pieceGoodsList[i].piecePrice);
          }
        }else{
          this.waybillInfo.transitPickupFee = feeData.pickupFee;
          this.waybillInfo.transitDeliveryFee = feeData.deliveryFee;
          this.waybillInfo.freightPrice = feeData.freightFee;
          this.calculateFee();
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
