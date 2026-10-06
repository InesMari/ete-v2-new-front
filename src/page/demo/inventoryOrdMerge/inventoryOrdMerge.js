import dbTable from "@/components/dbTable/dbTable.vue"
import dispatch from "../dispatchDemo/dispatch.vue"

export default {
  name: 'inventoryOrdMerge',
  data() {
    return {
      isShowMain:true,
      data:{
        "name":"张三"
      },
      head:[
          {name:"作业点名称",code:"workName"},
          {name:"作业点地址",code:"workAddressStr"},
      ],
      // 假数据配置
      time:"",
      datetime:"",
      selectValue:"",
      inputvalue:"",
      daterange:"",
      radio:'',
      options:[]
      // 假数据配置 end
    }
  },
  mounted() {
    this.doQuery();
  },
  components: {
    dbTable,
    dispatch,
  },
  methods: {
    doQuery() {
      this.$refs.table.load("workGoodsTF", "queryWorkData", {tenantId:27});
    },
    //下一步
    next(){
      this.isShowMain = false;
    },
    // 隐藏组件
    hideComponent(){
      this.isShowMain = true;
    }
  },
}