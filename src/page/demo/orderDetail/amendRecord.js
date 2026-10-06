import {head} from '@/static/json.js'
import tableCommon from "@/components/table/tableCommon.vue"

export default {
  name: 'amendRecord',
  data() {
    return {
      head:head,
      // 假数据配置
      time:"",
      datetime:"",
      selectValue:"",
      inputvalue:"",
      daterange:"",
      // 假数据配置 end
    }
  },
  mounted() {
    
  },
  components: {
    tableCommon,
  },
  methods: {
    changeSel(){

    },
  },
}