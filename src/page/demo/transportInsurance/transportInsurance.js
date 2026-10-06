import {head} from '@/static/json.js'
import tableCommon from "@/components/table/tableCommon.vue"
import scrollTable from "@/components/scrollTable/scrollTable.vue"
import mycity from '@/components/mycity/mycity.vue'

export default {
  name: 'transportInsurance',
  data() {
    return {
      head:head,
      showModify:false,
      showModifyRecord:false,
      // 假数据配置
      time:"",
      datetime:"",
      selectValue:"",
      inputvalue:"",
      daterange:"",
      radio:'',
      // 假数据配置 end
    }
  },
  mounted() {
    
  },
  components: {
    tableCommon,
    mycity,
    scrollTable,
  },
  methods: {
    add(){
        let item = {
            urlName: "新增角色",
            urlId: new Date().getTime(),
            urlPath: "/demo/list/list.vue",
            urlPathName: "/list",
            query:{name: "dx", age: 18},
        }
        this.$emit('openTab', item);
    },
    modify(){
      this.showModify = true;
    },
    modifyRecord(){
      this.showModifyRecord = true;
    },
    changeSel(){

    },
    options(){
      
    }

  },
}