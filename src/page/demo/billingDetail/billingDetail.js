import {head} from '@/static/json.js'
import tableCommon from "@/components/table/tableCommon.vue"
import simpleTable from "@/components/simpleTable/simpleTable.vue"

export default {
  name: 'billingDetail',
  data() {
    return {
      head: [
          {"name": "登录账号", "code": "billId", "type": "text"},
          {"name": "使用人", "code": "userName", "width": "100", "type": "text"},
          {"name": "所属角色", "code": "roleNames", "width": "100", "type": "text"},
          {"name": "创建人", "code": "createUser", "width": "100", "type": "text"},
          {"name": "创建时间", "code": "createDate", "width": "200", "type": "text"}
      ],
      tableData:[],
      tabs:[
        {name:'订单信息',active:true},
        {name:'仓库收入信息'},
        {name:'项目其他收入'},
        {name:'账单补录费用'},
        {name:'账单操作记录'},
        {name:'开票申请记录'},
        {name:'发票开具记录'},
        {name:'收款登记记录'},
      ],
      // 假数据配置
      time:"",
      datetime:"",
      selectValue:"",
      inputvalue:"",
      daterange:"",
      options:[],
      // 假数据配置 end
    }
  },
  mounted() {
    this.doQuery();
  },
  components: {
    tableCommon,
    simpleTable,
  },
  methods: {
    async doQuery(){     
      let data = await this.common.postUrl("staffTF", "queryStaffs", {keyword: ""},"","","",true); 
      this.tableData = data.items;
    },
    //行单击回调
    selectItem(data){
      
    },
    // 查看详情（获取选中行）
    toDetail(){
      let data = this.$refs.table.getSelectItem();
      console.log(data);
    },
    changeTab(tab){
      this.tabs.forEach(el => {
        el.active = false;
      })
      tab.active = true;
      this.$forceUpdate();
    },
    changeSel(){},
  },
}
