import orderStock from "@/page/pt/ord/waybill/update/subpage/orderStock.vue";
import waybillInfo from "@/page/pt/ord/waybill/update/subpage/waybillInfo.vue";
import workInfo from "@/page/pt/ord/waybill/update/subpage/workInfo.vue";
import receipts from "@/page/pt/ord/waybill/update/subpage/receipts.vue";
import selStock from "@/page/pt/ord/waybill/update/subpage/selStock.vue";
import feeInfo from "@/page/pt/ord/waybill/subpage/feeInfo.vue";
import enumData  from "@/page/pt/enum.js"

export default {
  name: 'updateWaybill',
  data() {
    return {
      isShowMain:false,
      dispatchType: this.$route.query.dispatchType,
      routeNameflag:false,//线路名称是否自动生成
      allData:{
        waybillInfo:{},
        workInfoList:[],
        receiptList:[],
      },
    }
  },
  mounted() {
    this.init();
  },
  components: {
    orderStock,
    waybillInfo,
    workInfo,
    receipts,
    selStock,
    feeInfo
  },
  methods: {
    init(){
      this.queryWaybillInfo();
    },
    async queryWaybillInfo(){
      let data = await this.common.postUrl("ordWaybillTF", "queryWaybillInfo", this.$route.query);
      //基础数据
      this.allData = data;
      this.allData.waybillInfo.isInvoice=data.waybillInfo.isInvoice+'';
      this.allData.waybillInfo.isUrgent=data.waybillInfo.isUrgent+'';
      this.allData.waybillInfo.haveReceipt=data.waybillInfo.haveReceipt+'';
      this.allData.waybillInfo.billingType=data.waybillInfo.billingType+'';
      // if (data.waybillInfo.bizType)
      //   this.allData.waybillInfo.bizType=data.waybillInfo.bizType+'';
      this.allData.waybillInfo.vehicleType=data.waybillInfo.vehicleType==null?data.waybillInfo.vehicleType:data.waybillInfo.vehicleType+'';
      this.allData.waybillInfo.vehicleLength=data.waybillInfo.vehicleLength==null?data.waybillInfo.vehicleLength:data.waybillInfo.vehicleLength+'';
      this.allData.waybillInfo.quoteVehicleType=data.waybillInfo.quoteVehicleType==null?data.waybillInfo.quoteVehicleType:data.waybillInfo.quoteVehicleType+'';
      this.$forceUpdate();
      let that = this;
      this.$nextTick(() => {
        that.$refs.selStock.initData(data.orderStockList);
        that.next(1);
        // that.$refs.orderStock.initSupplierWorkData();
        that.$refs.orderStock.initDisabled(data.waybillInfo.waybillState);
        that.$refs.waybillInfo.initSupplier(data.waybillInfo.supplierTenantId);
        that.$refs.waybillInfo.initDisabled(data.waybillInfo.waybillState);
        that.$refs.waybillInfo.initPieceGoods();
        that.$refs.workInfo.initDisabled(data.waybillInfo.waybillState);
      });
    },
    back(){
      this.isShowMain = true;
    },
    //传递作业点
    passWorkInfo(workInfo){
      let num = this.$refs.workInfo.init(workInfo);
      if(this.dispatchType!=enumData.dispatchType.transitDispatch){
        this.$refs.waybillInfo.changeMidwayPointNum(num);
      }
    },
    //传递调度总体积
    passDispatchTotalVolume(value){
      if(this.dispatchType!=enumData.dispatchType.transitDispatch){
        if(!this.$refs.waybillInfo.waybillInfo.volume){
          this.$refs.waybillInfo.waybillInfo.volume=value;
        }
      }
    },
    //分摊金额
    shareFee(col,value){
      this.$refs.orderStock.shareFee(col,value);
    },
    //库存单页面选择中转供应商
    changeSupplier(item){
      this.$refs.transitWaybillInfo.changeSupplier(item);
    },
    setRouteName(routeName){
      if(this.dispatchType!=enumData.dispatchType.transitDispatch) {
        if(!this.routeNameflag){
          this.$refs.waybillInfo.waybillInfo.routeName = routeName;
          this.$forceUpdate();
        }
      }
    },
    next(first){
      let selectItem =  this.$refs.selStock.getSelectItem();
      if (selectItem.length <= 0){
        this.$message.error("请至少选择一个库存单!");
        return false;
      }
      if(this.dispatchType==enumData.dispatchType.transitDispatch){
        if (selectItem.length != 1){
          this.$message.error("请选择一个库存单!");
          return false;
        }
      }
      
      if (first !== 1)
      {
        // this.$refs.waybillInfo.setBizType(selectItem[0].bizType);
      }
      
      this.isShowMain = false;
      let param={
        dispatchType:this.dispatchType,
        selectItem
      }
      this.$refs.orderStock.init(param,first);
      //判断如果全部来自同一个订单，直接用订单的线路名称  是否回单有同样的问题
      let routeName = selectItem[0].routeName;
      let remark = '';
      let map = new Map();
      for (let idx in selectItem) {
        let stockItem = selectItem[idx];
        if(routeName!=stockItem.routeName){
          routeName='';
        }
        if(selectItem[idx].haveReceipt==1){
          if(this.dispatchType != enumData.dispatchType.pickTransitDispatch){
            this.$refs.waybillInfo.waybillInfo.haveReceipt = '1';
            this.$forceUpdate();
          }
        }
        if(!map.get(stockItem.orderNum)&&stockItem.remark){
          remark+='订单'+stockItem.orderNum+'的备注：'+stockItem.remark+",";
          map.set(stockItem.orderNum,1);
        }
      }
      if(routeName!=''&&!this.$refs.waybillInfo.waybillInfo.routeName){
        if(this.dispatchType!=enumData.dispatchType.transitDispatch) {
          this.routeNameflag = true;
          this.$refs.waybillInfo.waybillInfo.routeName = routeName;
          this.$forceUpdate();
        }
      }
      if(remark!=''&&!this.$refs.waybillInfo.waybillInfo.remark){
        this.$refs.waybillInfo.waybillInfo.remark = remark;
        this.$forceUpdate();
      }
      //重新选择以后，如果是按件计费的话需要重新计算费用
      if(!first){
        this.$refs.waybillInfo.updatePieceGoods(false);
      }
    },
    getAllOrderStock(){
      return this.$refs.orderStock.stockInfo.selectItem;
    },
    updateWaybill(){
      let param = {};
      param.dispatchType = this.dispatchType;
      param.orderStock = this.$refs.orderStock.getData();
      param.workInfo = this.$refs.workInfo.getData();
      param.sameDest = this.$refs.orderStock.sameDest;
      param.waybillInfo = this.$refs.waybillInfo.getData();
      param.receipts = this.$refs.receipts.getData();
      if(param.workInfo.length==1){
        this.$message.error("请选择卸货地");
        return;
      }
      let that = this;
      this.common.postUrl("ordWaybillTF", "updateWaybill", param,function (data){
        if(data){
          that.$message.success("修改成功");
          that.$emit("closeTab",that.$route.meta.id, that.$route.meta.parentId,true)
        }
      },null,'',true);

    },
    quit(){
      this.$emit("closeTab",this.$route.meta.id, this.$route.meta.parentId)
    }
  },
}
