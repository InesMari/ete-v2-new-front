import dbTable from "@/components/dbTable/dbTable.vue"
import enumData from "@/page/pt/enum.js";
import searchList from "@/components/searchList/searchList.vue";

export default {
  name: 'selStock',
  props: ['dispatchType','tenantName'],
  data() {
    return {
      head: [
        {"name": "订单号", "code": "orderNum", "width": "160", "type": "text"},
        {"name": "客户单号", "code": "custOrderNum", "width": "160", "type": "text"},
        {"name": "下单客户", "code": "orderCustName", "width": "200", "type": "text"},
        {"name": "业务类型", "code": "bizTypeName", "width": "150", "type": "text"},
        {"name": "客户下单时间", "code": "customerOrderDate", "width": "150", "type": "text"},
        {"name": "重量(KG)", "code": "goodsWeight", "width": "60", "type": "text","issum":"true"},
        {"name": "体积(㎡)", "code": "goodsVolume", "width": "60", "type": "text","issum":"true"},
        {"name": "件数(件)", "code": "goodsCount", "width": "60", "type": "text","issum":"true"},
        {"name": "中途点数", "code": "midwayPointNum", "width": "60", "type": "text"},
        {"name": "库存仓库", "code": "workName", "width": "160", "type": "text"},
        {"name": "库存状态", "code": "stockStateName", "width": "60", "type": "text"},
        {"name": "库存仓库地址", "code": "workAddress", "width": "250", "type": "text"},
        {"name": "目的地", "code": "destWorkName", "width": "160", "type": "text"},
        {"name": "目的地地址", "code": "destWorkAddress", "width": "250", "type": "text"},
        {"name": "提货时间", "code": "pickupDate", "width": "150", "type": "text"},
        {"name": "车型", "code": "vehicleTypeName", "width": "100", "type": "text"},
        {"name": "车长", "code": "vehicleLengthName", "width": "60", "type": "text"},
        {"name": "总费用合计", "code": "amount", "width": "100", "type": "text"},
        {"name": "线路名称", "code": "routeName", "width": "160", "type": "text"},
        {"name": "订单备注", "code": "remark", "width": "200", "type": "text"},
      ],
      symbolOptions:[
        {value:'>',label:'>'},
        {value:'<',label:'<'},
        {value:'>=',label:'>='},
        {value:'<=',label:'<='},
        {value:'=',label:'='},
      ],
      param:{
        goodsWeightSymbol:'>',
        goodsVolumeSymbol:'>',
        goodsCountSymbol:'>',
        midwayPointNumSymbol:'>',
        daterange: [],
        pickupDate: [],
        orderCustName:this.tenantName,
      },

      pickerOptions: enumData.DATE_RANGE_SHORTCUT_OPTIONS,
      vehicleTypeOptions:[],
      vehicleLengthOptions:[],
      selStockTable: "selStockTable" + this.dispatchType,
      tips:'可对n个订单进行调度提+干业务；生成一张派车单，n张中转单',
      init:1,
    }
  },
  mounted() {
    this.initStaticData();
    this.doQuery();
    this.initTips();
  },
  components: {
    dbTable,
    searchList
  },
  methods: {
    clear() {
      this.param={
          goodsWeightSymbol:'>',
          goodsVolumeSymbol:'>',
          goodsCountSymbol:'>',
          midwayPointNumSymbol:'>',
          daterange: [],
          pickupDate: [],

        
      };
      this.init=0;
    },
    forceUpdate() {
      this.$forceUpdate();
    },
    initTips(){
      if(this.dispatchType==enumData.dispatchType.shareDispatch){
        this.tips='可对n个订单进行调度；生成一张派车单';
      }else if(this.dispatchType==enumData.dispatchType.pickTransitDispatch){
        this.tips='可对n个订单进行调度提+干业务；生成一张派车单，n张中转单';
      }else if(this.dispatchType==enumData.dispatchType.fullWholeDispatch){
        this.tips='单个或多个订单进行调度；同一库存的调度';
      }else if(this.dispatchType==enumData.dispatchType.transitDispatch){
        this.tips='只能对单个订单进行调度且限于两个作业点';
      }
    },
    //初始化页面的静态数据
    initStaticData(){
      let that = this;
      this.common.postUrl('commonTF','getSysStaticDataByCodeTypes',{'codeType':'VEHICLE_TYPE,VEHICLE_LENGTH'},function (data) {
        that.vehicleTypeOptions = data.VEHICLE_TYPE;
        that.vehicleLengthOptions = data.VEHICLE_LENGTH;
      });
    },
    doQuery(query=this.param) {      
      this.param = query;
      if(this.$route.query.oldParam&&this.init==1){
        this.param = this.$route.query.oldParam;
      }
      if(this.common.isNotBlank(this.param.daterange) && this.param.daterange.length==2){
        this.param.startCreateDate = this.param.daterange[0];
        this.param.endCreateDate = this.param.daterange[1];
      }else{
        this.param.startCreateDate = '';
        this.param.endCreateDate = '';
      }
      if(this.common.isNotBlank(this.param.pickupDate) && this.param.pickupDate.length==2){
        this.param.startWorkDate = this.param.pickupDate[0];
        this.param.endWorkDate = this.param.pickupDate[1];
      }else{
        this.param.startWorkDate = '';
        this.param.endWorkDate = '';
      }
      if(this.common.isNotBlank(this.param.customerOrderDate) && this.param.customerOrderDate.length === 2){
        this.param.startCustomerOrderDate = this.param.customerOrderDate[0];
        this.param.endCustomerOrderDate = this.param.customerOrderDate[1];
      }else{
        this.param.startCustomerOrderDate = '';
        this.param.endCustomerOrderDate = '';
      }
      this.param.dispatchType = this.dispatchType;
      this.$refs.table.load("ordDispatchTF", "queryOrdStockPage", this.param);
    },
    getSelectItem() {
      let selectItem = this.$refs.table.getRightData();
      return selectItem;
    },
    next(){
      this.$emit("next");
    }
  },
  computed:{
    formData(){
      return [
        {"name":"下单客户","model":"orderCustName","type":"input","placeholder":"下单客户","isshow":true},
        {"name":"系统录单时间","model":"daterange","type":"daterange","isshow":true},
        {"name":"订单号","model":"orderNum","type":"input","placeholder":"订单号","isshow":true},
        {"name":"客户下单时间","model":"customerOrderDate","type":"daterange","isshow":true},
        {"name":"库存仓库","model":"workNameKeyword","type":"input","placeholder":"库存仓库","isshow":true},
        {
          "name":"货物重量","model":"goodsWeightWY","isshow":true,
          children:[
            {"model":"goodsWeightSymbol","type":"select","options":this.symbolOptions,"label":"label","value":"value","isshow":true},
            {"type":"input","model":"goodsWeight"},
          ]
        },
        {
          "name":"货物体积","model":"goodsVolumeWY","isshow":true,
          children:[
            {"model":"goodsVolumeSymbol","type":"select","options":this.symbolOptions,"label":"label","value":"value","isshow":true},
            {"type":"input","model":"goodsVolume"},
          ]
        },
        {
          "name":"货物件数","model":"goodsCountWY","isshow":true,
          children:[
            {"model":"goodsCountSymbol","type":"select","options":this.symbolOptions,"label":"label","value":"value","isshow":true},
            {"type":"input","model":"goodsCount"},
          ]
        },
        {
          "name":"中途点数","model":"midwayPointNumWY","isshow":true,
          children:[
            {"model":"midwayPointNumSymbol","type":"select","options":this.symbolOptions,"label":"label","value":"value","isshow":true},
            {"type":"input","model":"midwayPointNum"},
          ]
        },
        {"name":"目的地","model":"destWorkNameKeyword","type":"input","placeholder":"目的地","isshow":true},
        {"name":"提货时间","model":"pickupDate","type":"daterange","isshow":true,if:this.dispatchType==3},
        {"name":"车型","model":"vehicleType","type":"select","options":this.vehicleTypeOptions,"label":"codeName","value":"codeValue","placeholder":"车型","method":"doQuery","isshow":true,if:this.dispatchType==3},
        {"name":"车长","model":"vehicleLength","type":"select","options":this.vehicleLengthOptions,"label":"codeName","value":"codeValue","placeholder":"车长","method":"doQuery","isshow":true,if:this.dispatchType==3},
        {"name":"线路名称","model":"routeName","type":"input","placeholder":"线路名称","isshow":true,if:this.dispatchType==3},
         {"name":"客户单号","model":"custOrderNum","type":"input","placeholder":"客户单号","isshow":true},

      ]
    }
  },
}
