import dbTable from "@/components/dbTable/dbTable.vue"
import enumData from "@/page/pt/enum";

export default {
  name: 'selStock',
  props: {
    dispatchType: Number,
  },
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
        midwayPointNumSymbol:'>'
      },
      pickerOptions: {
        shortcuts: [{
          text: '最近一天',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1);
            picker.$emit('pick', [start, end]);
          }
        },{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth()-1);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth()-3);
            picker.$emit('pick', [start, end]);
          }
        }],
      },
      vehicleTypeOptions:[],
      vehicleLengthOptions:[],
      tips:'可对n个订单进行调度提+干业务；生成一张派车单，n张中转单',
    }
  },
  mounted() {
    this.doQuery();
    this.initStaticData();
    this.initTips();
  },
  components: {
    dbTable,
  },
  methods: {
    clear() {
      this.param={
          goodsWeightSymbol:'>',
          goodsVolumeSymbol:'>',
          goodsCountSymbol:'>',
          midwayPointNumSymbol:'>'
      };
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
    doQuery() {
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
      this.param.dispatchType = this.dispatchType;
      this.$refs.table.load("ordDispatchTF", "queryOrdStockPage", this.param);
    },
    //初始化页面的静态数据
    initStaticData(){
      let that = this;
      this.common.postUrl('commonTF','getSysStaticDataByCodeTypes',{'codeType':'VEHICLE_TYPE,VEHICLE_LENGTH'},function (data) {
        that.vehicleTypeOptions = data.VEHICLE_TYPE;
        that.vehicleLengthOptions = data.VEHICLE_LENGTH;
      });
    },
    initData(data){
      this.$refs.table.setRightData(data);
    },
    getSelectItem() {
      let selectItem = this.$refs.table.getRightData();
      return selectItem;
    },
    next(){
      this.$emit("next");
    }
  },
}
