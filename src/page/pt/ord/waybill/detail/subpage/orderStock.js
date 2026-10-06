import tableCommon from "@/components/table/tableCommon.vue";
import enumData  from "@/page/pt/enum.js"

export default {
  name: 'orderStock',
  props: {
    dispatchType: Number,
    orderStockList:{type: Array},
  },
  data() {
    return {
      showGoodsDetialDialog: false,
      stockInfo: {},
      totalInfo: {
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
        otherFee: 0,
        totalFee: 0,

        transitFee:0,
        transitPickupFee:0,
        transitDeliveryFee:0,
        transitOtherFee:0,
        totalTransitFee:0,
      },

      deliveryModeShow: false,    // 交接方式
      deliveryTenantShow: false, // 供应商
      transitWorkShow: false,   //中转网点
      sameDestShow: false,      // 是否相同目的地
      arriveWorkShow: false,    // 选择目的地

      totalPointFeeShow: false,
      freightShow: false,
      premiumFeeShow: false,
      pickupFeeShow: false,
      deliveryFeeShow: false,
      loadingFeeShow: false,
      dischargeFeeShow: false,
      emptyDrivingFeeShow: false,
      standbyFeeShow: false,
      otherFeeShow: false,
      totalFeeShow: false,

      transitFeeShow:false,
      transitPickupFeeShow:false,
      transitDeliveryFeeShow:false,
      transitOtherFeeShow:false,
      totalTransitFeeShow:false,

      totalFeeDisplayName:'合计',

      dispatchGoodsInfo: {},

    }
  },
  mounted() {
  },
  components: {
    tableCommon
  },
  methods: {
    init(){
      this.initDisplayUI();
      //设置初始值
      this.calculateTotalGoods();
      this.calculateTotalFee();
      this.calculateTotalTransitFee();
    },
    //根据调度类型显示不同的列
    initDisplayUI(){
      if(this.dispatchType == enumData.dispatchType.fullWholeDispatch){//整车
        this.arriveWorkShow = true;
        this.totalPointFeeShow = true;
        this.freightShow = true;
        this.premiumFeeShow = true;
        this.loadingFeeShow = true;
        this.dischargeFeeShow = true;
        this.emptyDrivingFeeShow = true;
        this.standbyFeeShow = true;
        this.otherFeeShow = true;
        this.totalFeeShow = true;
      }else if(this.dispatchType == enumData.dispatchType.pickTransitDispatch){
        this.deliveryTenantShow = true;
        this.transitWorkShow = true;
        // this.deliveryModeShow = true;
        // this.arriveWorkShow = true;

        this.totalPointFeeShow = true;
        this.premiumFeeShow = true;
        this.pickupFeeShow = true;
        this.loadingFeeShow = true;
        this.dischargeFeeShow = true;
        this.emptyDrivingFeeShow = true;
        this.standbyFeeShow = true;
        this.otherFeeShow = true;
        this.totalFeeShow = true;
        this.totalFeeDisplayName = '提货合计';

        this.transitFeeShow = true;
        this.transitDeliveryFeeShow = true;
        this.transitOtherFeeShow = true;
        this.totalTransitFeeShow = true;
      }else if(this.dispatchType == enumData.dispatchType.shareDispatch){
        this.deliveryModeShow = true;
        this.arriveWorkShow = true;

        this.totalPointFeeShow = true;
        this.freightShow = true;
        this.premiumFeeShow = true;
        this.pickupFeeShow = true;
        this.deliveryFeeShow = true;
        this.loadingFeeShow = true;
        this.dischargeFeeShow = true;
        this.emptyDrivingFeeShow = true;
        this.standbyFeeShow = true;
        this.otherFeeShow = true;
        this.totalFeeShow = true;

        this.sameDestShow = true;
      }else if(this.dispatchType == enumData.dispatchType.transitDispatch){
        this.deliveryTenantShow = true;
        this.transitWorkShow = true;
        this.deliveryModeShow = true;
        this.arriveWorkShow = true;

        this.transitFeeShow = true;
        this.transitPickupFeeShow = true;
        this.transitDeliveryFeeShow = true;
        this.transitOtherFeeShow = true;
        this.totalTransitFeeShow = true;
      }
    },
    //计算货物合计
    calculateTotalGoods(){
      this.totalInfo.goodsCount=0;
      this.totalInfo.goodsWeight=0;
      this.totalInfo.goodsVolume=0;
      for (let i = 0; i < this.orderStockList.length; i++) {
        let item = this.orderStockList[i];
        this.totalInfo.goodsCount = this.common.accAdd(this.totalInfo.goodsCount,item.goodsCount);
        this.totalInfo.goodsWeight = this.common.accAdd(this.totalInfo.goodsWeight,item.goodsWeight);
        this.totalInfo.goodsVolume = this.common.accAdd(this.totalInfo.goodsVolume,item.goodsVolume);
      }
      this.$forceUpdate();
    },
    //计算费用
    calculateTotalFee(){
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

      for (let i = 0; i < this.orderStockList.length; i++) {
        let item = this.orderStockList[i];
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

    //计算费用
    calculateTotalTransitFee(){
      this.totalInfo.transitFee=0;
      this.totalInfo.transitPickupFee=0;
      this.totalInfo.transitDeliveryFee=0;
      this.totalInfo.transitOtherFee=0;
      this.totalInfo.totalTransitFee=0;

      for (let i = 0; i < this.orderStockList.length; i++) {
        let item = this.orderStockList[i];
        item.totalTransitFee = 0;
        item.totalTransitFee = this.common.accAdd(item.totalTransitFee,item.transitFee);
        this.totalInfo.transitFee = this.common.accAdd(this.totalInfo.transitFee,item.transitFee);

        item.totalTransitFee = this.common.accAdd(item.totalTransitFee,item.transitPickupFee);
        this.totalInfo.transitPickupFee = this.common.accAdd(this.totalInfo.transitPickupFee,item.transitPickupFee);

        item.totalTransitFee = this.common.accAdd(item.totalTransitFee,item.transitDeliveryFee);
        this.totalInfo.transitDeliveryFee = this.common.accAdd(this.totalInfo.transitDeliveryFee,item.transitDeliveryFee);

        item.totalTransitFee = this.common.accAdd(item.totalTransitFee,item.transitOtherFee);
        this.totalInfo.transitOtherFee = this.common.accAdd(this.totalInfo.transitOtherFee,item.transitOtherFee);

        this.totalInfo.totalTransitFee = this.common.accAdd(this.totalInfo.totalTransitFee,item.totalTransitFee);
      }
      this.$forceUpdate();
    },

    //展示货物明细弹窗
    async showGoodsDetail(item,index) {
      //如果没有调度过货物，查询一下
      if (!item.orderStockDetailList) {
        item.orderStockDetailList = await this.common.postUrl("ordDispatchTF", "queryOrdStockGoodsDetailList", {orderStockId: item.orderStockId});
      }
      this.dispatchGoodsInfo=this.common.copyObj(item);
      this.dispatchGoodsInfo.index = index;
      this.dispatchGoodsInfo.goodsCount = 0;
      this.dispatchGoodsInfo.goodsWeight = 0;
      this.dispatchGoodsInfo.goodsVolume = 0;
      for (let i = 0; i < item.orderStockDetailList.length; i++) {
        let orderStockDetail = item.orderStockDetailList[i];
        this.dispatchGoodsInfo.goodsCount = this.common.accAdd(this.dispatchGoodsInfo.goodsCount,orderStockDetail.goodsCount);
        this.dispatchGoodsInfo.goodsWeight = this.common.accAdd(this.dispatchGoodsInfo.goodsWeight,orderStockDetail.goodsWeight);
        this.dispatchGoodsInfo.goodsVolume = this.common.accAdd(this.dispatchGoodsInfo.goodsVolume,orderStockDetail.goodsVolume);
      }


      this.showGoodsDetialDialog = true;
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
  },
}
