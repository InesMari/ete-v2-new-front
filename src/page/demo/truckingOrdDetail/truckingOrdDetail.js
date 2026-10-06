import innerTab from "@/components/innerTab/innerTab.vue"
import tableCommon from "@/components/table/tableCommon.vue";
import mapTrack from "@/components/mapTrack/mapTrack.vue";

export default {
  name: 'truckingOrdDetail',
  data() {
    return {
      isshowGoodsDetialDialog:false,
      isshowOperateDialog:false,
      tabs: [{
              name: "派车单详情",
              active: true,
              type:1,
          },
          {
              name: "修改记录",
              type:2,
          },
          {
              name: "车辆轨迹",
              type:3,
          },
      ],
      showType:1,
      isShowMap:false,
      // 假数据配置
      inputvalue:"",
      list:[0,1,2,3,4,5,6,7,8,9,10],
      options:[
        {id:1,label:"sss"},        
        {id:2,label:"aaa"}
      ],
      head: [
        {"name": "登录账号", "code": "billId", "type": "text"},
        {"name": "使用人", "code": "userName", "width": "100", "type": "text"},
        {"name": "所属角色", "code": "roleNames", "width": "100", "type": "text"},
        {"name": "创建人", "code": "createUser", "width": "100", "type": "text"},
        {"name": "创建时间", "code": "createDate", "width": "200", "type": "text"}
      ],
      // 假数据配置 end
    }
  },
  mounted() {
    this.doQuery();
  },
  methods: {
    async doQuery(){
      //这里只是借点数据用用
      let {items} = await this.$refs.table.load("staffTF", "queryStaffs", this.query);
      this.tableData = items;
    },
    selectCallback(data){
      this.tab = data;
      this.showType = data.type;
    },
    //展示货物明细弹窗
    showGoodsDetail(){
      this.isshowGoodsDetialDialog = true;
    },
    /**
     * 查看合并作业点
     */
    showOperateDialog(){
      this.isshowOperateDialog = true;
    },
    /**
     * 展示运输轨迹弹窗
     */
    showTrack(){
      this.isShowMap = true;
    },
    hideMapBack(){
      this.isShowMap = false;
    }
  },
  components:{
    innerTab,
    tableCommon,
    mapTrack
  }
}