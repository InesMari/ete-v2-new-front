import tableCommon from "@/components/table/tableCommon.vue";
import enumData  from "@/page/pt/enum.js"

export default {
  name: 'orderStock',
  props: ['dispatchType','recycleWaybill'],
  data() {
    return {
      showGoodsDetialDialog: false,
      stockInfo: {selectItem:[]},
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
        emptyDrivingFee: 0,
        standbyFee: 0,
        otherFee: 0,
        totalFee: 0,

        transitFee:0,
        transitPickupFee:0,
        transitDeliveryFee:0,
        transitOtherFee:0,
        totalTransitFee:0,
        amount:0,
      },

      deliveryModeShow: false,    // 交接方式
      deliveryTenantShow: false, // 供应商
      transitWorkShow: false,   //中转网点
      sameDestShow: false,      // 是否相同目的地
      arriveWorkShow: false,    // 选择目的地
      destWorkShow: false,     // 订单目的地

      totalPointFeeShow: false,
      freightShow: false,
      premiumFeeShow: false,
      pickupFeeShow: false,
      deliveryFeeShow: false,
      loadingFeeShow: false,
      dischargeFeeShow: false,
      otherFeeShow: false,
      totalFeeShow: false,

      transitFeeShow:false,
      transitPickupFeeShow:false,
      transitDeliveryFeeShow:false,
      transitOtherFeeShow:false,
      totalTransitFeeShow:false,

      totalFeeDisplayName:'合计',

      sameDest: false,
      dispatchGoodsInfo: {},
      deliveryModeOptions: [],//交接方式
      supplierData: [],//供应商
      supplierWorkData: [],//供应商地址
      arriveWorkDialogShow:false,
      head: [
        {"name": "企业名称", "code": "tenantName", "width": "150", "type": "text"},
        {"name": "作业点名称", "code": "workName", "width": "120", "type": "text"},
        {"name": "详细地址", "code": "workAddress", "width": "200", "type": "text"},

      ],
      query:{
        tenantName: '',
        keyword:''
      },
      isInvoice:-1,
    }
  },
  mounted() {
    this.initStaticData();
    this.initDisplayUI();
  },
  components: {
    tableCommon
  },
  methods: {
    init(data){
      //这里要做个比较 保留原有的数据
      let tmpSelectItem;
      if(this.stockInfo.selectItem){
        tmpSelectItem=this.common.copyObj(this.stockInfo.selectItem);
      }
      this.stockInfo=this.common.copyObj(data);
      //设置初始值
      this.initDefaultValue();
      if(tmpSelectItem){
        for (let i = 0; i < this.stockInfo.selectItem.length; i++) {
          let item = this.stockInfo.selectItem[i];
          for (let j = 0; j < tmpSelectItem.length; j++) {
            let tmp = tmpSelectItem[j];
            if(tmp.orderStockId == item.orderStockId){
              this.stockInfo.selectItem[i] = tmp;
            }
          }
        }
      }
      this.calculateTotalGoods();
      this.calculateTotalFee();
      // this.calculateTotalTransitFee();
      this.passWorkInfo();
    },
    //根据调度类型显示不同的列
    initDisplayUI(){
      if(this.dispatchType == enumData.dispatchType.fullWholeDispatch){
        this.destWorkShow = true;
        this.totalPointFeeShow = true;
        this.freightShow = true;
        this.premiumFeeShow = true;
        this.loadingFeeShow = true;
        this.dischargeFeeShow = true;
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
        this.otherFeeShow = true;
        this.totalFeeShow = true;

        this.sameDestShow = true;
      }else if(this.dispatchType == enumData.dispatchType.transitDispatch){
        this.deliveryTenantShow = true;
        // this.transitWorkShow = true;
        this.deliveryModeShow = true;
        this.arriveWorkShow = true;

        this.transitFeeShow = true;
        this.transitPickupFeeShow = true;
        this.transitDeliveryFeeShow = true;
        this.transitOtherFeeShow = true;
        this.totalTransitFeeShow = true;
      }
    },
    //初始化页面的静态数据
    initStaticData(){
      let that = this;
      this.common.postUrl('commonTF','getSysStaticData',{'codeType':'DELIVERY_MODE'},function (data) {
        that.deliveryModeOptions = data;
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
      if(payMode==1){
        this.isInvoice = 1;
      }else{
        this.isInvoice = -1;
      }
      this.stockInfo.selectItem[0].deliveryTenantId='';
      this.changeSupplier(0);
      this.initSupplierData();

      // //费用
      // this.stockInfo.selectItem[0].transitFee='';
      // this.stockInfo.selectItem[0].transitPickupFee='';
      // this.stockInfo.selectItem[0].transitDeliveryFee='';
      // this.stockInfo.selectItem[0].totalTransitFee='';
      // this.calculateTotalTransitFee();

      this.$forceUpdate();
    },
    //初始化页面的默认值
    initDefaultValue(){
      for (let i = 0; i < this.stockInfo.selectItem.length; i++) {
        let item = this.stockInfo.selectItem[i];
        if(this.dispatchType == enumData.dispatchType.pickTransitDispatch) {
          item.transitDeliveryMode = '1';
          item.transitArriveWorkId = item.destWorkId;
          item.transitArriveWorkName = item.destWorkName;
          item.transitArriveWorkAddress = item.destWorkAddress;
          item.transitArriveWorkType = 2;
          item.transitArriveLinkmanName = item.destLinkmanName;
          item.transitArriveBill = item.destBill;
          item.transitArrivePhone = item.destPhone;
          item.transitArriveWorkDate = item.destWorkDate;
        }else{
          item.deliveryMode = '1';
          item.arriveWorkId = item.destWorkId;
          item.arriveWorkName = item.destWorkName;
          item.arriveWorkAddress = item.destWorkAddress;
          item.arriveWorkType = 2;
          item.arriveLinkmanName = item.destLinkmanName;
          item.arriveBill = item.destBill;
          item.arrivePhone = item.destPhone;
          item.arriveWorkDate = item.destWorkDate;
        }
      }
      this.$forceUpdate();
    },
    //计算货物合计
    calculateTotalGoods(){
      this.totalInfo.goodsCount=0;
      this.totalInfo.goodsWeight=0;
      this.totalInfo.goodsVolume=0;
      for (let i = 0; i < this.stockInfo.selectItem.length; i++) {
        let item = this.stockInfo.selectItem[i];
        this.totalInfo.goodsCount = this.common.accAdd(this.totalInfo.goodsCount,item.goodsCount);
        this.totalInfo.goodsWeight = this.common.accAdd(this.totalInfo.goodsWeight,item.goodsWeight);
        this.totalInfo.goodsVolume = this.common.accAdd(this.totalInfo.goodsVolume,item.goodsVolume);
      }
      this.passDispatchTotalVolume(this.totalInfo.goodsVolume);
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
      this.totalInfo.amount=0;

      for (let i = 0; i < this.stockInfo.selectItem.length; i++) {
        let item = this.stockInfo.selectItem[i];
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
        this.totalInfo.amount = this.common.accAdd(this.totalInfo.amount,item.amount);
      }
      this.$forceUpdate();
    },

    //计算费用
    calculateTotalTransitFee(){
      // this.totalInfo.transitFee=0;
      // this.totalInfo.transitPickupFee=0;
      // this.totalInfo.transitDeliveryFee=0;
      // this.totalInfo.transitOtherFee=0;
      // this.totalInfo.totalTransitFee=0;
      //
      // for (let i = 0; i < this.stockInfo.selectItem.length; i++) {
      //   let item = this.stockInfo.selectItem[i];
      //   item.totalTransitFee = 0;
      //   item.totalTransitFee = this.common.accAdd(item.totalTransitFee,item.transitFee);
      //   this.totalInfo.transitFee = this.common.accAdd(this.totalInfo.transitFee,item.transitFee);
      //
      //   item.totalTransitFee = this.common.accAdd(item.totalTransitFee,item.transitPickupFee);
      //   this.totalInfo.transitPickupFee = this.common.accAdd(this.totalInfo.transitPickupFee,item.transitPickupFee);
      //
      //   item.totalTransitFee = this.common.accAdd(item.totalTransitFee,item.transitDeliveryFee);
      //   this.totalInfo.transitDeliveryFee = this.common.accAdd(this.totalInfo.transitDeliveryFee,item.transitDeliveryFee);
      //
      //   item.totalTransitFee = this.common.accAdd(item.totalTransitFee,item.transitOtherFee);
      //   this.totalInfo.transitOtherFee = this.common.accAdd(this.totalInfo.transitOtherFee,item.transitOtherFee);
      //
      //   this.totalInfo.totalTransitFee = this.common.accAdd(this.totalInfo.totalTransitFee,item.totalTransitFee);
      // }
      // this.$parent.passTransitFee(this.totalInfo.totalTransitFee);
      // this.$forceUpdate();
    },


    //输入判断
    inputGoodsDetail(type,index){
      this.checkGoodsMethod(type,index);
      this.calculateGoodsDetail();
    },
    //调度货物基础判断方法
    checkGoodsMethod(type,index){
      let orderStockDetail = this.dispatchGoodsInfo.orderStockDetailList[index];
      if(type==1){
        if(orderStockDetail.goodsCount<orderStockDetail.dispatchGoodsCount){
          this.$message.error("调度件数不能大于库存件数");
          this.$refs['dispatchGoodsCount'+index][0].focus();
          return false;
        }
        if(orderStockDetail.dispatchGoodsCount<0){
          this.$message.error("调度件数不能小于0");
          this.$refs['dispatchGoodsCount'+index][0].focus();
          return false;
        }
      } else if(type==2){
        if(orderStockDetail.goodsWeight<orderStockDetail.dispatchGoodsWeight){
          this.$message.error("调度重量不能大于库存重量");
          this.$refs['dispatchGoodsWeight'+index][0].focus();
          return false;
        }
        if(orderStockDetail.dispatchGoodsWeight<0){
          this.$message.error("调度重量不能小于0");
          this.$refs['dispatchGoodsWeight'+index][0].focus();
          return false;
        }
      } else if(type==3){
        if(orderStockDetail.goodsVolume<orderStockDetail.dispatchGoodsVolume){
          this.$message.error("调度体积不能大于库存体积");
          this.$refs['dispatchGoodsVolume'+index][0].focus();
          return false;
        }
        if(orderStockDetail.dispatchGoodsVolume<0){
          this.$message.error("调度体积不能小于0");
          this.$refs['dispatchGoodsVolume'+index][0].focus();
          return false;
        }
      }
    },
    //判断调度数量
    checkGoodsDetail(){
      for (let i = 0; i < this.dispatchGoodsInfo.orderStockDetailList.length; i++) {
        this.checkGoodsMethod(1,i);
        this.checkGoodsMethod(2,i);
        this.checkGoodsMethod(3,i);
      }
      return true;
    },

    //计算调度货物详情的合计
    calculateGoodsDetail(){
      this.dispatchGoodsInfo.dispatchGoodsCount = 0;
      this.dispatchGoodsInfo.dispatchGoodsWeight = 0;
      this.dispatchGoodsInfo.dispatchGoodsVolume = 0;
      for (let i = 0; i < this.dispatchGoodsInfo.orderStockDetailList.length; i++) {
        let orderStockDetail = this.dispatchGoodsInfo.orderStockDetailList[i];
        this.dispatchGoodsInfo.dispatchGoodsCount = this.common.accAdd(this.dispatchGoodsInfo.dispatchGoodsCount,orderStockDetail.dispatchGoodsCount);
        this.dispatchGoodsInfo.dispatchGoodsWeight = this.common.accAdd(this.dispatchGoodsInfo.dispatchGoodsWeight,orderStockDetail.dispatchGoodsWeight);
        this.dispatchGoodsInfo.dispatchGoodsVolume = this.common.accAdd(this.dispatchGoodsInfo.dispatchGoodsVolume,orderStockDetail.dispatchGoodsVolume);
      }
      this.$forceUpdate();
    },
    //展示货物明细弹窗
    async showGoodsDetail(item,index) {
      //如果没有调度过货物，查询一下
      if (!item.orderStockDetailList) {
        item.orderStockDetailList = await this.common.postUrl("ordDispatchTF", "queryOrdStockGoodsDetailList", {orderStockId: item.orderStockId});
        for (let i = 0; i < item.orderStockDetailList.length; i++) {
          let orderStockDetail = item.orderStockDetailList[i];
          orderStockDetail.dispatchGoodsCount = orderStockDetail.goodsCount;
          orderStockDetail.dispatchGoodsWeight = orderStockDetail.goodsWeight;
          orderStockDetail.dispatchGoodsVolume = orderStockDetail.goodsVolume;
        }
      }
      this.dispatchGoodsInfo=this.common.copyObj(item);
      this.dispatchGoodsInfo.index = index;
      this.dispatchGoodsInfo.goodsCount = 0;
      this.dispatchGoodsInfo.goodsWeight = 0;
      this.dispatchGoodsInfo.goodsVolume = 0;
      this.dispatchGoodsInfo.dispatchGoodsCount = 0;
      this.dispatchGoodsInfo.dispatchGoodsWeight = 0;
      this.dispatchGoodsInfo.dispatchGoodsVolume = 0;
      for (let i = 0; i < item.orderStockDetailList.length; i++) {
        let orderStockDetail = item.orderStockDetailList[i];
        this.dispatchGoodsInfo.goodsCount = this.common.accAdd(this.dispatchGoodsInfo.goodsCount,orderStockDetail.goodsCount);
        this.dispatchGoodsInfo.goodsWeight = this.common.accAdd(this.dispatchGoodsInfo.goodsWeight,orderStockDetail.goodsWeight);
        this.dispatchGoodsInfo.goodsVolume = this.common.accAdd(this.dispatchGoodsInfo.goodsVolume,orderStockDetail.goodsVolume);
        this.dispatchGoodsInfo.dispatchGoodsCount = this.common.accAdd(this.dispatchGoodsInfo.dispatchGoodsCount,orderStockDetail.dispatchGoodsCount);
        this.dispatchGoodsInfo.dispatchGoodsWeight = this.common.accAdd(this.dispatchGoodsInfo.dispatchGoodsWeight,orderStockDetail.dispatchGoodsWeight);
        this.dispatchGoodsInfo.dispatchGoodsVolume = this.common.accAdd(this.dispatchGoodsInfo.dispatchGoodsVolume,orderStockDetail.dispatchGoodsVolume);
      }


      this.showGoodsDetialDialog = true;
    },
    //保存货物调度
    dispachGoodsDetail(){
      if(!this.checkGoodsDetail()){
        return;
      }
      this.stockInfo.selectItem[this.dispatchGoodsInfo.index].orderStockDetailList=this.dispatchGoodsInfo.orderStockDetailList;
      this.stockInfo.selectItem[this.dispatchGoodsInfo.index].goodsCount = this.dispatchGoodsInfo.dispatchGoodsCount;
      this.stockInfo.selectItem[this.dispatchGoodsInfo.index].goodsWeight = this.dispatchGoodsInfo.dispatchGoodsWeight;
      this.stockInfo.selectItem[this.dispatchGoodsInfo.index].goodsVolume = this.dispatchGoodsInfo.dispatchGoodsVolume;
      this.dispatchGoodsInfo={};
      this.showGoodsDetialDialog = false;
      this.calculateTotalGoods();
      this.$parent.passOrderStockInfo();
      this.$forceUpdate();
    },
    //返回数据
    getData(){
      return this.stockInfo.selectItem;
    },

    //相同目的地相同的选择时赋值给下面的其他行数据
    sameSelectChange(col){
      let firstItemValue = this.stockInfo.selectItem[0][col]
      for (let i = 0; i < this.stockInfo.selectItem.length; i++) {
        this.stockInfo.selectItem[i][col]=firstItemValue;
        this.changeDeliveryMode(this.stockInfo.selectItem[i]);
      }
      this.$forceUpdate();
    },
    setSameValue(col){
      let firstItemValue = this.stockInfo.selectItem[0][col]
      for (let i = 0; i < this.stockInfo.selectItem.length; i++) {
        this.stockInfo.selectItem[i][col]=firstItemValue;
      }
    },
    changeDeliveryMode(item){
      if(this.dispatchType == enumData.dispatchType.pickTransitDispatch) {
        if (item.transitDeliveryMode == 1) {
          item.transitArriveWorkId = item.destWorkId;
          item.transitArriveWorkName = item.destWorkName;
          item.transitArriveWorkAddress = item.destWorkAddress;
          item.transitArriveLinkmanName = item.destLinkmanName;
          item.transitArriveBill = item.destBill;
          item.transitArrivePhone = item.destPhone;
          item.transitArriveWorkDate = item.destWorkDate;
        } else {
          item.transitArriveWorkId = '';
          item.transitArriveWorkName = '';
          item.transitArriveWorkAddress = '';
          item.transitArriveLinkmanName = '';
          item.transitArriveBill = '';
          item.transitArrivePhone = '';
          item.transitArriveWorkDate = '';
        }
      }else{
        if(item.deliveryMode==1){
          item.arriveWorkId = item.destWorkId;
          item.arriveWorkName = item.destWorkName;
          item.arriveWorkAddress = item.destWorkAddress;
          item.arriveLinkmanName = item.destLinkmanName;
          item.arriveBill = item.destBill;
          item.arrivePhone = item.destPhone;
          item.arriveWorkDate = item.destWorkDate;
        }else{
          item.arriveWorkId = '';
          item.arriveWorkName = '';
          item.arriveWorkAddress = '';
          item.arriveLinkmanName = '';
          item.arriveBill = '';
          item.arrivePhone = '';
          item.arriveWorkDate = '';
        }
      }
      this.passWorkInfo();
      this.$forceUpdate();
    },
    /**
     * 改变供应商 查询网点
     */
    async changeSupplier(index) {
      let item = this.stockInfo.selectItem[index];
      this.supplierWorkData[index] = [];
      if(item.deliveryMode!=1){
        item.arriveWorkId = '';
        item.arriveWorkName = '';
        item.arriveWorkAddress = '';
        item.arriveLinkmanName = '';
        item.arriveBill = '';
        item.arrivePhone = '';
        item.arriveWorkDate = '';
      }
      if (item.deliveryTenantId) {
        this.supplierWorkData[index] = await this.common.postUrl("workGoodsTF", "queryWorkDataSelect", {tenantId: item.deliveryTenantId});
        for (let i = 0; i < this.supplierData.length; i++) {
          if (item.deliveryTenantId == this.supplierData[i].tenantId) {
            //触发中转页面变更供应商
            this.$parent.changeSupplier(this.supplierData[i]);
            break;
          }
        }
      }
      this.passWorkInfo();
      this.$forceUpdate();
    },
    //查询当前货主以及所有供应商的作业点加上我的仓库  目的地(目的地的情况，就不能选择)
    showArriveWorkDialog(item,index){
      if(item.deliveryMode==1){
        return false;
      }
      this.query.index = index;
      this.query.tenantId = [];
      this.query.tenantId.push(item.orderCustId);
      this.arriveWorkDialogShow=true
      this.$nextTick(() => {
        this.doQuery();
      });

    },
    /**
     * 列表查询
     */
    doQuery()
    {
      //查询所有库存单的租户
      this.$refs.table.load("ordDispatchTF", "selWorkInfoListByCond", this.query);
    },
    selArriveWork(){
      let selectItems =  this.$refs.table.getSelectItem();
      if (selectItems.length !== 1){
        this.$message.error("请选择一个作业点!");
        return false;
      }
      let selectItem = selectItems[0];
      this.setSelArriveWork('workId',selectItem);
      this.setSelArriveWork('workName',selectItem);
      this.setSelArriveWork('workAddress',selectItem);
      this.setSelArriveWork('workType',selectItem,2);
      this.setSelArriveWork('linkmanName',selectItem);
      this.setSelArriveWork('bill',selectItem);
      this.setSelArriveWork('phone',selectItem);
      this.arriveWorkDialogShow=false;
      this.passWorkInfo();
      this.$forceUpdate();
    },

    setSelArriveWork(col,item,value){
      let prefix = 'arrive';
      if(this.dispatchType==enumData.dispatchType.pickTransitDispatch){
        prefix = 'transitArrive';
      }
      let arriveCol = prefix + col.substr(0,1).toUpperCase()+col.substr(1);
      this.stockInfo.selectItem[this.query.index][arriveCol] = value||item[col];
      if(this.sameDest) {
        this.setSameValue(arriveCol);
      }
    },

    /**
     * 清空
     */
    clear(){
      this.query.tenantName='';
      this.query.keyword='';
    },
    //跳转会选择库存单
    back(){
      this.$parent.back();
    },
    //把调度总体积传递给下一个页面用于计算运费
    passDispatchTotalVolume(totalVolume){
      this.$parent.passDispatchTotalVolume(totalVolume);
    },
    //这里把所有作业点传递过去，不计算
    passWorkInfo(){
      let workInfo = [];
      let endWorkInfo = [];
      //循序所有的调度单，拼出来所有的作业点
      for (let i = 0; i < this.stockInfo.selectItem.length; i++) {
        let item = this.stockInfo.selectItem[i];
        //放入起点
        workInfo.push({
          orderStockId:item.orderStockId,//库存单ID
          orderNum:item.orderNum,
          workId:item.workId,
          workName:item.workName,
          workAddress:item.workAddress,
          workType:1,
          linkmanName:item.linkmanName,
          bill:item.bill,
          phone:item.phone,
          workDate:item.workDate,
        });
        if(item.arriveWorkId){
          if(this.dispatchType==enumData.dispatchType.pickTransitDispatch){
            let tmp = this.supplierWorkData[i];
            for (let j = 0; j < tmp.length; j++) {
              if(tmp[j].workId==item.arriveWorkId){
                item.arriveWorkName = tmp[j].workName;
                endWorkInfo.push({
                  orderStockId:item.orderStockId,//库存单ID
                  orderNum:item.orderNum,
                  workId:tmp[j].workId,
                  workName:tmp[j].workName,
                  workAddress:tmp[j].workAddressStr,
                  workType:2,
                  linkmanName:tmp[j].linkmanName,
                  bill:tmp[j].bill,
                  phone:tmp[j].phone,
                });
                break;
              }
            }
          }else{
            endWorkInfo.push({
              orderStockId:item.orderStockId,//库存单ID
              orderNum:item.orderNum,
              workId:item.arriveWorkId,
              workName:item.arriveWorkName,
              workAddress:item.arriveWorkAddress,
              workType:2,
              linkmanName:item.arriveLinkmanName,
              bill:item.arriveBill,
              phone:item.arrivePhone,
              workDate:item.arriveWorkDate,
            });
          }
        }
      }
      workInfo= [...workInfo,...endWorkInfo];
      this.$parent.passWorkInfo(workInfo);
    },

    //分摊金额  按照金额比重
    shareFee(col,value){
      let remainValue = value;
      //提货中转运费对应到提货费
      if(this.dispatchType==enumData.dispatchType.pickTransitDispatch&&
          col=='freight'){
        col = 'pickupFee';
      }
      //如果只有一条数据的情况
      if(this.stockInfo.selectItem.length==1){
        this.stockInfo.selectItem[0][col]=value;
        this.calculateTotalFee();
        this.$forceUpdate();
        return;
      }

      if(this.totalInfo.goodsWeight<=0){
        let realValue = this.common.accDiv(value,this.stockInfo.selectItem.length);
        realValue = Math.round(realValue*100)/100;
        for (let i = 0; i < this.stockInfo.selectItem.length; i++) {
          if(i!=this.stockInfo.selectItem.length-1){
            this.stockInfo.selectItem[i][col]=realValue;
            remainValue = this.common.accSub(remainValue,realValue);
          }else{
            this.stockInfo.selectItem[i][col]=remainValue;
          }
        }
      }else {
        for (let i = 0; i < this.stockInfo.selectItem.length; i++) {
          let item = this.stockInfo.selectItem[i];
          if (i != this.stockInfo.selectItem.length - 1) {
            let accMul = this.common.accMul(value, item.goodsWeight);
            let realValue = this.common.accDiv(accMul, this.totalInfo.goodsWeight);
            realValue = Math.round(realValue * 100) / 100;
            this.stockInfo.selectItem[i][col] = realValue;
            remainValue = this.common.accSub(remainValue, realValue);
          } else {
            this.stockInfo.selectItem[i][col] = remainValue;
          }
        }
      }
      this.calculateTotalFee();
      this.$forceUpdate();
    },
    /**
     * 订单详情
     */
    toOrderDetail(orderId)
    {
      this.$parent.$emit("openTab",{
        urlId: 'orderDetail' + orderId,
        query: {orderId: orderId, pId: 1001070},
        urlName: "订单详情",
        urlPathName: "/order",
        urlPath: "/pt/ord/order/orderDetail/orderDetailMain.vue"});
    },
    async clearPayMode() {
      this.isInvoice = -1;
      this.stockInfo.selectItem[0].deliveryTenantId = '';
      await this.changeSupplier(0);
      await this.initSupplierData();
      this.$forceUpdate();
    },
    async selSectionFeeForTransit(item){
      //干线供应商
      this.stockInfo.selectItem[0].deliveryTenantId=item.tenantId;
      await this.changeSupplier(0);

      // //费用
      // this.stockInfo.selectItem[0].transitFee=item.freightFee;
      // this.stockInfo.selectItem[0].transitPickupFee=item.pickupFee;
      // this.stockInfo.selectItem[0].transitDeliveryFee=item.deliveryFee;
      // this.stockInfo.selectItem[0].totalTransitFee=item.totalFee;
      // this.calculateTotalTransitFee();

      this.$forceUpdate();
    },
  },
}
