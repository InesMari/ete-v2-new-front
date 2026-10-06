import feeInfo from "@/page/pt/ord/dispatch/subpage/feeInfo.vue";
import orderStock from "@/page/pt/ord/dispatch/subpage/orderStock.vue";
import transitWaybillInfo from "@/page/pt/ord/dispatch/subpage/transitWaybillInfo.vue";
import waybillInfo from "@/page/pt/ord/dispatch/subpage/waybillInfo.vue";
import workInfo from "@/page/pt/ord/dispatch/subpage/workInfo.vue";
import receipts from "@/page/pt/ord/dispatch/subpage/receipts.vue";
import selStock from "@/page/pt/ord/dispatch/selStock.vue";
import sectionFee from "@/page/pt/ord/dispatch/subpage/sectionFee.vue";
import enumData  from "@/page/pt/enum.js"

export default {
  name: 'dispatch',
  data() {
    return {
      isShowMain:true,
      dispatchType: this.$route.query.dispatchType,
      tenantName: this.$route.query.tenantName,
      orderStockShow:false,
      transitWaybillInfoShow:false,
      waybillInfoShow:false,
      workInfoShow:false,
      receiptsShow:false,
      // transitSpecial:true,
      routeNameflag:false,//线路名称是否自动生成
      payMode:'-1',
      recycleWaybill: this.$route.query.recycleWaybill,
      orderId: this.$route.query.orderId,
    }
  },
  mounted() {
    this.init();
  },
  components: {
    feeInfo,
    orderStock,
    transitWaybillInfo,
    waybillInfo,
    workInfo,
    receipts,
    selStock,
    sectionFee
  },
  methods: {
    init(){
      if(this.dispatchType==enumData.dispatchType.transitDispatch){
        this.orderStockShow=true;
        this.transitWaybillInfoShow=true;
        // this.transitSpecial=false;
        this.workInfoShow=true;
      }else{
        this.orderStockShow=true;
        this.waybillInfoShow=true;
        this.workInfoShow=true;
        this.receiptsShow=true;
      }
      if(this.recycleWaybill=='1'){
          this.isShowMain = false;
          this.next();
      }
    },
    back(){
      this.isShowMain = true;
    },
    //传递作业点
    passWorkInfo(workInfo){
      let num = this.$refs.workInfo.init(workInfo);
      if(this.dispatchType!=enumData.dispatchType.transitDispatch){
        // this.$refs.waybillInfo.changeMidwayPointNum(num);
        this.$refs.waybillInfo.matchQuote();
      }else{
        this.$refs.transitWaybillInfo.matchQuote();
      }
    },
    //传递调度总体积
    passDispatchTotalVolume(value){
      if(this.dispatchType!=enumData.dispatchType.transitDispatch){
        if(!this.$refs.waybillInfo.waybillInfo.volume){
          this.$refs.waybillInfo.waybillInfo.volume=value;
          this.$refs.waybillInfo.waybillInfo.netWeight=this.$refs.orderStock.totalInfo.goodsWeight;
          this.$refs.waybillInfo.waybillInfo.grossWeight=this.$refs.orderStock.totalInfo.goodsWeight;
          this.$refs.waybillInfo.$forceUpdate();
        }
      }else{
        if(!this.$refs.transitWaybillInfo.waybillInfo.volume) {
          this.$refs.transitWaybillInfo.waybillInfo.volume = value;
          this.$refs.transitWaybillInfo.waybillInfo.netWeight = this.$refs.orderStock.totalInfo.goodsWeight;
          this.$refs.transitWaybillInfo.waybillInfo.grossWeight = this.$refs.orderStock.totalInfo.goodsWeight;
          this.$refs.transitWaybillInfo.$forceUpdate();
        }
      }
    },
    passTransitFee(value){
      if(this.dispatchType==enumData.dispatchType.transitDispatch){
        this.$refs.transitWaybillInfo.waybillInfo.periodicalPay=value;
        this.$refs.transitWaybillInfo.$forceUpdate();
      }
    },
    //分摊金额
    shareFee(col,value){
      this.$refs.orderStock.shareFee(col,value);
    },
    //库存单页面选择中转供应商
    changeSupplier(item){
      if(this.dispatchType==enumData.dispatchType.transitDispatch) {
        this.$refs.transitWaybillInfo.changeSupplier(item);
      }
    },
    setRouteName(routeName){
      if(this.dispatchType!=enumData.dispatchType.transitDispatch) {
        if(!this.routeNameflag){
          this.$refs.waybillInfo.waybillInfo.routeName = routeName;
          this.$forceUpdate();
        }
      }
    },
    changePayMode(){
      if(this.dispatchType!=enumData.dispatchType.transitDispatch) {
        this.$refs.waybillInfo.changePayMode(this.payMode);
      }else{
        this.$refs.transitWaybillInfo.changePayMode(this.payMode);
        this.$refs.orderStock.changePayMode(this.payMode);
      }
      this.$refs.sectionFee.title='当前报价  未计算，请点击左侧计算成本报价按钮获取报价！';
      this.$forceUpdate();
    },
    async next() {
        let selectItem = [];
        if (this.recycleWaybill == 1) {
            let pageData = await this.common.postUrl("ordDispatchTF", "queryOrdStockPage", {dispatchType:this.dispatchType,orderId:this.orderId});
            selectItem = pageData.items;
            //把起始点跟终点数据换一下
            selectItem.forEach(item => {
                // 交换起始点和终点数据
                let tempWorkId = item.workId;
                let tempInsWorkId = item.insWorkId;
                let tempWorkName = item.workName;
                let tempWorkAddress = item.workAddress;
                let tempWorkType = item.workType;
                let tempLinkmanName = item.linkmanName;
                let tempBill = item.bill;
                let tempPhone = item.phone;
                let tempWorkDate = item.workDate;

                item.workId = item.destWorkId;
                item.insWorkId = item.insDestWorkId;
                item.workName = item.destWorkName;
                item.workAddress = item.destWorkAddress;
                item.workType = item.destWorkType;
                item.linkmanName = item.destLinkmanName;
                item.bill = item.destBill;
                item.phone = item.destPhone;
                item.workDate = item.destWorkDate;

                item.destWorkId = tempWorkId;
                item.insDestWorkId = tempInsWorkId;
                item.destWorkName = tempWorkName;
                item.destWorkAddress = tempWorkAddress;
                item.destWorkType = tempWorkType;
                item.destLinkmanName = tempLinkmanName;
                item.destBill = tempBill;
                item.destPhone = tempPhone;
                item.destWorkDate = tempWorkDate;
            });

        } else {
            selectItem = this.$refs.selStock.getSelectItem();
        }

        if (selectItem.length <= 0) {
            this.$message.error("请至少选择一个库存单!");
            return false;
        }
        if (this.dispatchType == enumData.dispatchType.transitDispatch) {
            if (selectItem.length != 1) {
                this.$message.error("请选择一个库存单!");
                return false;
            }
        }
        // this.$refs.waybillInfo.setBizType(selectItem[0].bizType);

        this.isShowMain = false;
        let param = {
            dispatchType: this.dispatchType,
            selectItem
        }
        this.$refs.orderStock.init(param);
        //初始化
        this.$refs.feeInfo.init(this.$refs.orderStock.getData());
        //判断如果全部来自同一个订单，直接用订单的线路名称  是否回单有同样的问题
        let routeName = selectItem[0].routeName;
        let remark = '';
        let map = new Map();
        this.$refs.sectionFee.isCheck = false;
        this.$refs.sectionFee.display = false;
        for (let idx in selectItem) {
            let stockItem = selectItem[idx];
            if (routeName != stockItem.routeName) {
                routeName = '';
            }
            //旧点检逻辑删除，只做新的自有车点检逻辑，后续需要恢复，打开这里即可
            // if(this.dispatchType == enumData.dispatchType.shareDispatch){
            //   if(stockItem.bizType==2||stockItem.bizType==3){
            //     this.$refs.sectionFee.isCheck = true;
            //     this.$refs.sectionFee.display = true;
            //   }
            // }
            if (selectItem[idx].haveReceipt == 1) {
                if (this.dispatchType != enumData.dispatchType.pickTransitDispatch) {
                    if (this.$refs.waybillInfo) {
                        this.$refs.waybillInfo.waybillInfo.haveReceipt = '1';
                        this.$forceUpdate();
                    }
                }
            }
            if (!map.get(stockItem.orderNum) && stockItem.remark) {
                remark += '订单' + stockItem.orderNum + '的备注：' + stockItem.remark + ",";
                map.set(stockItem.orderNum, 1);
            }
        }
        if (routeName != '' && this.$refs.waybillInfo && !this.$refs.waybillInfo.waybillInfo.routeName) {
            if (this.dispatchType != enumData.dispatchType.transitDispatch) {
                this.routeNameflag = true;
                this.$refs.waybillInfo.waybillInfo.routeName = routeName;
                this.$forceUpdate();
            }
        }
        if (remark != '' && this.$refs.waybillInfo && !this.$refs.waybillInfo.waybillInfo.remark) {
            this.$refs.waybillInfo.waybillInfo.remark = remark;
            this.$forceUpdate();
        }
        //重新选择以后，如果是按件计费的话需要重新计算费用
        if (this.dispatchType != enumData.dispatchType.transitDispatch) {
            this.$refs.waybillInfo.initPieceGoods();
        } else {
            this.$refs.transitWaybillInfo.initPieceGoods();
        }

    },
    passOrderStockInfo(){
      //初始化
      this.$refs.feeInfo.init(this.$refs.orderStock.getData());
    },
    initParam(){
      let param = {
        goodsWeight:'',
        goodsVolume:'',
      };
      //判断客户有几个，如果有多个不传递
      let item = this.$refs.orderStock.stockInfo.selectItem;
      let specifyTenantId = item[0].orderCustId;
      for (let i = 0; i < item.length; i++) {
        if(specifyTenantId!=item[i].orderCustId){
          specifyTenantId=-1;
          break;
        }
      }
      // let vehicleLength = 0;
      // let vehicleLengthValue = 0;
      // for (let i = 0; i < item.length; i++) {
      //   if(item[i].vehicleLength){
      //     let tmpValue = item[i].vehicleLengthName.replace('m','');
      //     if(tmpValue>vehicleLengthValue){
      //       vehicleLength=item[i].vehicleLength;
      //       vehicleLengthValue = tmpValue;
      //     }
      //   }
      // }
      let isRound = false;
      if(item.length==1&&item[0].orderType==2){
        isRound = true;
      }
      param.specifyTenantId = specifyTenantId;
      param.workList = this.$refs.workInfo.workInfo;
      param.dispatchType = this.dispatchType;
      if(param.dispatchType!=enumData.dispatchType.transitDispatch){
        // param.midwayPointNum=this.$refs.waybillInfo.waybillInfo.midwayPointNum;
        param.tenantId = this.$refs.waybillInfo.waybillInfo.supplierTenantId;
        param.billingType = this.$refs.waybillInfo.waybillInfo.billingType;
        param.quoteVehicleType = this.$refs.waybillInfo.waybillInfo.quoteVehicleType;
        param.vehicleLength = this.$refs.waybillInfo.waybillInfo.vehicleLength;
        // if(vehicleLength>0){
        //   param.vehicleLength = vehicleLength;
        // }
        param.goodsInfoList = this.$refs.waybillInfo.waybillInfo.pieceGoodsList;
        param.goodsWeight = this.$refs.waybillInfo.waybillInfo.netWeight;
        if(param.billingType&&param.billingType=='4'){
          param.goodsWeight = this.$refs.waybillInfo.waybillInfo.grossWeight;
        }
        param.goodsVolume = this.$refs.waybillInfo.waybillInfo.volume;

        //判断如果只有一个整车双程的订单，且送到目的地，获取整车的往返价格
        if(isRound){
          if(item[0].deliveryMode!=1){
            isRound = false;
          }
        }
        param.isRound = isRound;
      }else{
        param.tenantId = this.$refs.transitWaybillInfo.waybillInfo.supplierTenantId;
        param.billingType = this.$refs.transitWaybillInfo.waybillInfo.billingType;
        param.transport = this.$refs.transitWaybillInfo.waybillInfo.transport;
        if(this.$refs.transitWaybillInfo.waybillInfo.pieceGoodsList){
          param.goodsIds = [];
          for (let i = 0; i < this.$refs.transitWaybillInfo.waybillInfo.pieceGoodsList.length; i++) {
            param.goodsIds.push(this.$refs.transitWaybillInfo.waybillInfo.pieceGoodsList[i].goodsId);
          }
        }
        param.goodsWeight = this.$refs.transitWaybillInfo.waybillInfo.netWeight;
        if(param.billingType&&param.billingType=='4'){
          param.goodsWeight = this.$refs.transitWaybillInfo.waybillInfo.grossWeight;
        }
        param.goodsVolume = this.$refs.transitWaybillInfo.waybillInfo.volume;
      }
      return param;
    },
    getAllOrderStock(){
      return this.$refs.orderStock.stockInfo.selectItem;
    },
    async selSectionFee(item) {
      this.payMode = '';
      //中转的情况
      if (this.dispatchType == enumData.dispatchType.transitDispatch) {
        await this.$refs.orderStock.clearPayMode();
        await this.$refs.transitWaybillInfo.clearPayMode();
        await this.$refs.orderStock.selSectionFeeForTransit(item);
        this.$refs.transitWaybillInfo.selSectionFee(item);
      } else {
        await this.$refs.waybillInfo.clearPayMode();
        this.$refs.waybillInfo.selSectionFee(item);
      }

    },
    dispatch(){
      let param = {};
      param.dispatchType = this.dispatchType;
      param.recycleWaybill = this.recycleWaybill;
      param.orderStock = this.$refs.orderStock.getData();
      param.workInfo = this.$refs.workInfo.getData();
      let isRound = false;
      let item = this.$refs.orderStock.stockInfo.selectItem;
      if(item.length==1&&item[0].orderType==2){
        isRound = true;
      }
      if(this.dispatchType==enumData.dispatchType.transitDispatch){
        param.waybillInfo = this.$refs.transitWaybillInfo.getData();
        if(param.waybillInfo.pickupVehicleId==param.waybillInfo.pickupPlateNumber){
          param.waybillInfo.pickupVehicleId='';
        }
        if(param.waybillInfo.deliveryVehicleId==param.waybillInfo.deliveryPlateNumber){
          param.waybillInfo.deliveryVehicleId='';
        }
        if(param.waybillInfo.trunkRoadVehicleId==param.waybillInfo.trunkRoadPlateNumber){
          param.waybillInfo.trunkRoadVehicleId='';
        }
        if(param.waybillInfo.pickupDriverUserId==param.waybillInfo.pickupDriverName){
          param.waybillInfo.pickupDriverUserId='';
        }
        if(param.waybillInfo.deliveryDriverUserId==param.waybillInfo.deliveryDriverName){
          param.waybillInfo.deliveryDriverUserId='';
        }
        if(param.waybillInfo.trunkRoadDriverUserId==param.waybillInfo.trunkRoadDriverName){
          param.waybillInfo.trunkRoadDriverUserId='';
        }
      }else{
        param.sameDest = this.$refs.orderStock.sameDest;
        param.waybillInfo = this.$refs.waybillInfo.getData();
        param.receipts = this.$refs.receipts.getData();
        param.feeInfo  = this.$refs.feeInfo.getData();

        let totalFee = 0;
        for (let i = 0; i < param.feeInfo.orderStockStatementList.length; i++) {
          let item = param.feeInfo.orderStockStatementList[i];
          totalFee = this.common.accAdd(totalFee,item.totalFee);
        }
        if(param.feeInfo.feeInfo.totalFee!==totalFee){
          this.$message.error("费用异动分摊不正确");
          return;
        }
        param.waybillInfo.isCheck = this.$refs.sectionFee.isCheck?1:0;

        //判断如果只有一个整车双程的订单，且送到目的地，获取整车的往返价格
        if(isRound){
          if(item[0].deliveryMode!=1){
            isRound = false;
          }
        }
        param.waybillInfo.isRound = isRound;
      }
      if(param.workInfo.length==1){
        this.$message.error("请选择卸货地");
        return;
      }

      let that = this;
      this.common.postUrl("ordDispatchTF", "addOrdDispatchInfo", param,function (data){
        if(data){
          that.$message.success("调度成功");
          // that.$emit("refreshTab",that.$route.meta.id);
          that.$emit("refreshTab",that.$route.meta.id,{dispatchType:that.dispatchType});
          if(that.recycleWaybill){
            that.$emit("closeTab",that.$route.meta.id, that.$route.meta.parentId)
          }
        }
      },null,'',true);

    },
    quit(){
      this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
    }
  },
}
