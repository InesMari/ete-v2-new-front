import enumData from "@/page/pt/enum";

export default {
  name: 'feeInfo',
  props:{statementList:{type: Array},waybillInfo:{type: Object},orderStockStatementList:{type:Array},},
  data() {
    return {
      feeInfo:{},
      totalInfo: this.initTotalFee(),
    }
  },
  mounted() {
  },
  components: {
  },
  methods: {
    init(){
      this.feeInfo.freightPrice = this.waybillInfo.freightPrice;
      this.initStatementFee();
      this.calculateStatementTotalGoods();
      this.calculateStatementTotalFee();
    },
    changeFee(col){
      let shareCol = col;
      let freightPrice = this.feeInfo.freightPrice;
      if(this.waybillInfo.billingType==enumData.billingTypeOrder.byGrossweight&&(col=='grossWeight'||col=='freightPrice')){
        let grossWeight = this.common.accAdd(this.waybillInfo.grossWeight,this.feeInfo.grossWeight);
        let freight=this.common.accMul(grossWeight,freightPrice);
        this.feeInfo.freight=this.common.accSub(freight,this.waybillInfo.freight);
        shareCol = 'freight';
      }else if(this.waybillInfo.billingType==enumData.billingTypeOrder.byNetweight&&(col=='netWeight'||col=='freightPrice')){
        let netWeight = this.common.accAdd(this.waybillInfo.netWeight,this.feeInfo.netWeight);
        let freight=this.common.accMul(netWeight,freightPrice);
        this.feeInfo.freight=this.common.accSub(freight,this.waybillInfo.freight);
        shareCol = 'freight';
      }else if(this.waybillInfo.billingType==enumData.billingTypeOrder.byVolume&&(col=='volume'||col=='freightPrice')){
        this.waybillInfo.freight=this.common.accMul(this.waybillInfo.volume,this.waybillInfo.freightPrice);
        let volume = this.common.accAdd(this.waybillInfo.volume,this.feeInfo.volume);
        let freight=this.common.accMul(volume,freightPrice);
        this.feeInfo.freight=this.common.accSub(freight,this.waybillInfo.freight);
        shareCol = 'freight';
      }else if(col=='pointFee'){
        let pointFee = this.common.accAdd(this.waybillInfo.pointFee,this.feeInfo.pointFee);
        let totalPointFee=this.common.accMul(this.waybillInfo.midwayPointNum,pointFee);
        this.feeInfo.totalPointFee=this.common.accSub(totalPointFee,this.waybillInfo.totalPointFee);
        shareCol = 'totalPointFee';
      }
      this.calculateTotalFee();
      this.shareFee(shareCol,this.feeInfo[shareCol]);
    },
    //分摊金额  按照金额比重
    shareFee(col,value){
      let remainValue = value;
      //提货中转运费对应到提货费
      if(this.waybillInfo.dispatchType==enumData.dispatchType.pickTransitDispatch&&
          col=='freight'){
        col = 'pickupFee';
      }
      //如果只有一条数据的情况
      if(this.orderStockStatementList.length==1){
        this.orderStockStatementList[0][col]=value;
        this.calculateStatementTotalFee();
        this.$forceUpdate();
        return;
      }
      if(this.totalInfo.goodsWeight<=0){
        let realValue = this.common.accDiv(value,this.orderStockStatementList.length);
        realValue = Math.round(realValue*100)/100;
        for (let i = 0; i < this.orderStockStatementList.length; i++) {
          if(i!=this.orderStockStatementList.length-1){
            this.orderStockStatementList[i][col]=realValue;
            remainValue = this.common.accSub(remainValue,realValue);
          }else{
            this.orderStockStatementList[i][col]=remainValue;
          }
        }
      }else{
        for (let i = 0; i < this.orderStockStatementList.length; i++) {
          let item = this.orderStockStatementList[i];
          if(i!=this.orderStockStatementList.length-1){
            let accMul = this.common.accMul(value,item.goodsWeight);
            let realValue = this.common.accDiv(accMul,this.totalInfo.goodsWeight);
            realValue = Math.round(realValue*100)/100;
            this.orderStockStatementList[i][col]=realValue;
            remainValue = this.common.accSub(remainValue,realValue);
          }else{
            this.orderStockStatementList[i][col]=remainValue;
          }
        }
      }

      this.calculateStatementTotalFee();
      this.$forceUpdate();
    },
    //计算货物合计
    calculateStatementTotalGoods(){
      this.totalInfo.goodsCount=0;
      this.totalInfo.goodsWeight=0;
      this.totalInfo.goodsVolume=0;
      for (let i = 0; i < this.orderStockStatementList.length; i++) {
        let item = this.orderStockStatementList[i];
        this.totalInfo.goodsCount = this.common.accAdd(this.totalInfo.goodsCount,item.goodsCount);
        this.totalInfo.goodsWeight = this.common.accAdd(this.totalInfo.goodsWeight,item.goodsWeight);
        this.totalInfo.goodsVolume = this.common.accAdd(this.totalInfo.goodsVolume,item.goodsVolume);
      }
      this.$forceUpdate();
    },
    //计算费用
    initStatementFee(){
      for (let i = 0; i < this.orderStockStatementList.length; i++) {
        let item = this.orderStockStatementList[i];
        item.totalPointFee=0;
        item.freight=0;
        item.premiumFee=0;
        item.pickupFee=0;
        item.deliveryFee=0;
        item.loadingFee=0;
        item.dischargeFee=0;
        item.emptyDrivingFee=0;
        item.standbyFee=0;
        item.otherFee=0;
        item.totalFee=0;
      }
      this.$forceUpdate();
    },
    //计算费用
    calculateStatementTotalFee(){
      this.totalInfo.totalPointFee=0;
      this.totalInfo.freight=0;
      this.totalInfo.premiumFee=0;
      this.totalInfo.pickupFee=0;
      this.totalInfo.deliveryFee=0;
      this.totalInfo.loadingFee=0;
      this.totalInfo.dischargeFee=0;
      this.totalInfo.emptyDrivingFee=0;
      this.totalInfo.standbyFee=0;
      this.totalInfo.otherFee=0;
      this.totalInfo.totalFee=0;

      for (let i = 0; i < this.orderStockStatementList.length; i++) {
        let item = this.orderStockStatementList[i];
        item.totalFee = 0;
        item.totalFee = this.common.accAdd(item.totalFee,item.totalPointFee);
        this.totalInfo.totalPointFee = this.common.accAdd(this.totalInfo.totalPointFee,item.totalPointFee);

        item.totalFee = this.common.accAdd(item.totalFee,item.freight);
        this.totalInfo.freight = this.common.accAdd(this.totalInfo.freight,item.freight);

        item.totalFee = this.common.accAdd(item.totalFee,item.premiumFee);
        this.totalInfo.premiumFee = this.common.accAdd(this.totalInfo.premiumFee,item.premiumFee);

        item.totalFee = this.common.accAdd(item.totalFee,item.pickupFee);
        this.totalInfo.pickupFee = this.common.accAdd(this.totalInfo.pickupFee,item.pickupFee);

        item.totalFee = this.common.accAdd(item.totalFee,item.deliveryFee);
        this.totalInfo.deliveryFee = this.common.accAdd(this.totalInfo.deliveryFee,item.deliveryFee);

        item.totalFee = this.common.accAdd(item.totalFee,item.loadingFee);
        this.totalInfo.loadingFee = this.common.accAdd(this.totalInfo.loadingFee,item.loadingFee);

        item.totalFee = this.common.accAdd(item.totalFee,item.dischargeFee);
        this.totalInfo.dischargeFee = this.common.accAdd(this.totalInfo.dischargeFee,item.dischargeFee);

        item.totalFee = this.common.accAdd(item.totalFee,item.emptyDrivingFee);
        this.totalInfo.emptyDrivingFee = this.common.accAdd(this.totalInfo.emptyDrivingFee,item.emptyDrivingFee);

        item.totalFee = this.common.accAdd(item.totalFee,item.standbyFee);
        this.totalInfo.standbyFee = this.common.accAdd(this.totalInfo.standbyFee,item.standbyFee);

        item.totalFee = this.common.accAdd(item.totalFee,item.otherFee);
        this.totalInfo.otherFee = this.common.accAdd(this.totalInfo.otherFee,item.otherFee);

        this.totalInfo.totalFee = this.common.accAdd(this.totalInfo.totalFee,item.totalFee);
      }
      this.$forceUpdate();
    },
    //计算总金额
    calculateTotalFee(){
      this.feeInfo.totalFee = this.common.accAdd(this.feeInfo.freight,this.feeInfo.totalPointFee);
      this.feeInfo.totalFee = this.common.accAdd(this.feeInfo.totalFee,this.feeInfo.premiumFee);
      this.feeInfo.totalFee = this.common.accAdd(this.feeInfo.totalFee,this.feeInfo.loadingFee);
      this.feeInfo.totalFee = this.common.accAdd(this.feeInfo.totalFee,this.feeInfo.dischargeFee);
      this.feeInfo.totalFee = this.common.accAdd(this.feeInfo.totalFee,this.feeInfo.emptyDrivingFee);
      this.feeInfo.totalFee = this.common.accAdd(this.feeInfo.totalFee,this.feeInfo.standbyFee);
      this.feeInfo.totalFee = this.common.accAdd(this.feeInfo.totalFee,this.feeInfo.otherFee);
      this.addChangeFee(this.feeInfo.totalFee);
      this.$forceUpdate();
    },
    //把费用异动的费用全部写入周期付
    addChangeFee(totalFee){
      this.$parent.addChangeFee(totalFee);
    },
    /**
     * 订单详情
     */
    toOrderDetail(orderId)
    {
      this.$parent.$emit("openTab",{
        urlId: 'orderDetail' + orderId,
        query: {orderId: orderId,pId: 1001070},
        urlName: "订单详情",
        urlPathName: "/order",
        urlPath: "/pt/ord/order/orderDetail/orderDetailMain.vue"});
    },
    getData(){
      this.feeInfo.waybillId = this.waybillInfo.waybillId;
      this.feeInfo.periodicalPay = this.waybillInfo.periodicalPay;
      let param = {
        feeInfo:this.feeInfo,
        orderStockStatementList:this.orderStockStatementList
      }
      return param;
    },
    initTotalFee()
    {
        this.totalInfo = {
          goodsCount: 0,
          goodsWeight: 0,
          goodsVolume: 0,
          totalPointFee: 0,
          freight: 0,
          premiumFee: 0,
          pickupFee: 0,
          deliveryFee: 0,
          loadingFee: 0,
          dischargeFee: 0,
          emptyDrivingFee: 0,
          standbyFee: 0,
          otherFee: 0,
          totalFee: 0,
        }
        return this.totalInfo;
    },
  },
}
