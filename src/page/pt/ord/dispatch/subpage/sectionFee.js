import tableCommon from "@/components/table/tableCommon.vue";
import enumData  from "@/page/pt/enum.js"

export default {
  name: 'sectionFee',
  data() {
    return {
      showDialog:false,
      specifyTenantDisabled:false,
      param:{
        billingType:1,
        specifyTenant:false
      },
      billingTypeOptions:[],
      quoteVehicleTypeOptions:[],
      vehicleLengthOptions:[],
      head1:[
        {"name": "供应商", "code": "tenantName", "width": "130", "type": "text"},
        {"name": "起始地", "code": "startAddress", "width": "150", "type": "text"},
        {"name": "目的地", "code": "endAddress", "width": "150", "type": "text"},
        {"name": "时效", "code": "transportTimeliness", "width": "90", "type": "text"},
        {"name": "价格", "code": "feePrice", "width": "80", "type": "text"},
        {"name": "点位费", "code": "pointFee", "width": "80", "type": "text"},
        {"name": "中途点数", "code": "midwayPointNum", "width": "80", "type": "text"},
        {"name": "点位费合计", "code": "totalPointFee", "width": "80", "type": "text"},
        {"name": "运费", "code": "totalFee", "width": "80", "type": "text"},
        {"name": "操作", "code": "", "width": "120", "type": "diy"}
      ],
      head2:[
        {"name": "供应商", "code": "tenantName", "width": "130", "type": "text"},
        {"name": "时效", "code": "transportTimeliness", "width": "90", "type": "text"},
        // {"name": "提货费单价", "code": "pickupFeePrice", "width": "80", "type": "text"},
        {"name": "提货费", "code": "pickupFee", "width": "80", "type": "text"},
        {"name": "干线运费单价", "code": "freightFeePrice", "width": "80", "type": "text"},
        {"name": "干线运费", "code": "freightFee", "width": "80", "type": "text"},
        // {"name": "送货费单价", "code": "deliveryFeePrice", "width": "80", "type": "text"},
        {"name": "送货费", "code": "deliveryFee", "width": "80", "type": "text"},
        {"name": "运费合计", "code": "totalFee", "width": "80", "type": "text"},
        {"name": "操作", "code": "", "width": "120", "type": "diy"}
      ],
      head: [

      ],
      title:'当前报价  未计算，请点击左侧计算成本报价按钮获取报价！',
      qryParam:{},
      isCheck:false,
      display:false,
    }
  },
  mounted() {
    this.initStaticData();
  },
  components: {
    tableCommon,
  },
  methods: {
    //初始化页面的静态数据
    initStaticData(){
      let that = this;
      this.common.postUrl('commonTF','getSysStaticDataByCodeTypes',{'codeType':'BILLING_TYPE_ORDER,VEHICLE_TYPE_QUOTE,VEHICLE_LENGTH'},function (data) {
        that.billingTypeOptions = data.BILLING_TYPE_ORDER;
        that.billingTypeOptions.splice(4, 1);
        that.quoteVehicleTypeOptions = data.VEHICLE_TYPE_QUOTE
        that.vehicleLengthOptions = data.VEHICLE_LENGTH;
      });
    },
    doQuery(){
      if(!this.param.billingType){
        this.$message.error("请选择计费方式!");
        return false;
      }
      let bean = 'quoteLDNewTF';
      let method = 'queryLDWaybillFee';
      if(this.param.dispatchType!=enumData.dispatchType.transitDispatch){
        if(!this.param.quoteVehicleType){
          this.$message.error("请选择报价车型!");
          return false;
        }
        if(!this.param.vehicleLength){
          this.$message.error("请选择车长!");
          return false;
        }
        bean = 'ZCQuoteNewTF';
        method = 'queryZCWaybillFee';
      }
      this.qryParam = this.common.copyObj(this.param);
      this.$refs.table.load(bean, method, this.param);
    },
    displayDialog(){
      this.param = this.$parent.initParam();
      if(this.param.specifyTenantId<=0){
        this.specifyTenantDisabled = true;
      }
      if(this.param.dispatchType!=enumData.dispatchType.transitDispatch) {
        this.param.billingType='1';
        this.head = this.head1;
      }else{
        this.param.billingType='2';
        this.head = this.head2;
        this.param.transport1 = true;
        this.param.transport2 = true;
        this.param.transport3 = true;
        //去掉按整车
        for (let i = 0; i < this.billingTypeOptions.length; i++) {
          if('1'==this.billingTypeOptions[i].codeValue){
            this.billingTypeOptions.splice(i,1);
            break;
          }
        }
      }
      this.showDialog = true;
      this.$forceUpdate();
    },
    selSectionFee(item){
      let billingTypeName = '';
      for (let i = 0; i < this.billingTypeOptions.length; i++) {
        if(this.qryParam.billingType==this.billingTypeOptions[i].codeValue){
          billingTypeName = this.billingTypeOptions[i].codeName;
          break;
        }
      }
      item.billingType = this.qryParam.billingType;
      if(this.qryParam.dispatchType!=enumData.dispatchType.transitDispatch) {
        let quoteVehicleTypeName = '';
        for (let i = 0; i < this.quoteVehicleTypeOptions.length; i++) {
          if (this.qryParam.quoteVehicleType == this.quoteVehicleTypeOptions[i].codeValue) {
            quoteVehicleTypeName = this.quoteVehicleTypeOptions[i].codeName;
            break;
          }
        }
        let vehicleLengthName = '';
        for (let i = 0; i < this.vehicleLengthOptions.length; i++) {
          if (this.qryParam.vehicleLength == this.vehicleLengthOptions[i].codeValue) {
            vehicleLengthName = this.vehicleLengthOptions[i].codeName;
            break;
          }
        }
        item.quoteVehicleType = this.qryParam.quoteVehicleType;
        item.vehicleLength = this.qryParam.vehicleLength;
        this.title = "当前报价  供应商：" + item.tenantName + "、时效：" + (item.transportTimeliness ? item.transportTimeliness : '') + "小时、计费方式：" + billingTypeName + "、车型：" + quoteVehicleTypeName;
        this.title += "、车长：" + vehicleLengthName + "、价格：" + item.totalFee;
      }else{
        //1 提+干+送 2 提+干 3 干+送 4 干
        item.transport='';
        if(this.qryParam.transport1&&this.qryParam.transport2&&this.qryParam.transport3){
          item.transport='1';
        }else if(this.qryParam.transport1&&this.qryParam.transport2&&!this.qryParam.transport3){
          item.transport='2';
        }else if(!this.qryParam.transport1&&this.qryParam.transport2&&this.qryParam.transport3){
          item.transport='3';
        }else if(!this.qryParam.transport1&&this.qryParam.transport2&&!this.qryParam.transport3){
          item.transport='4';
        }
        this.title = "当前报价  供应商：" + item.tenantName + "、时效：" + (item.transportTimeliness ? item.transportTimeliness : '') + "小时、计费方式：" + billingTypeName;
        this.title += "、提货费：" + (item.pickupFee?item.pickupFee:0);
        this.title += "、干线运费：" + item.freightFee;
        this.title += "、送货费：" + (item.deliveryFee?item.deliveryFee:0);
        this.title += "、运费合计：" + item.totalFee;
      }
      //执行调度页面的选择费用
      this.$parent.selSectionFee(item);
      this.showDialog = false;
    },
    forceUpdate(){
      this.$forceUpdate();
    },
    closeDialog(){
      this.showDialog = false;
    }
  },
}
