import {head} from '@/static/json.js'
import tableCommon from "@/components/table/tableCommon.vue"

export default {
  name: 'list',
  data() {
    return {
      head:head,
      seeOrdRepertory:true,
      // 假数据配置
      selectValue:"",
      inputvalue:"",
      // 假数据配置 end
    }
  },
  mounted() {
    
  },
  components: {
    tableCommon,
  },
  methods: {
    changeSwitch(){
      this.seeOrdRepertory = this.seeOrdRepertory?false:true;
    }
  },
}