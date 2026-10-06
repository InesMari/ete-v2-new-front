import enumData  from "@/page/pt/enum.js"

export default {
  name: 'waybillInfo',
  props: {
    dispatchType: Number,
    waybillInfo:{type: Object},
  },
  data() {
    return {
      showGoodsDetialDialog:false
    }
  },
  mounted() {

  },
  components: {
  },
  methods: {
    init(){
      this.initDisplayUI();
    },
    //根据调度类型显示不同的列
    initDisplayUI(){
      if(this.dispatchType == enumData.dispatchType.pickTransitDispatch){
        this.haveReceiptShow=false;
      }
    },

    forceUpdate(){
      this.$forceUpdate();
    },
  },
}
