import {head} from '@/static/json.js'
import scrollTable from "@/components/scrollTable/scrollTable.vue"

export default {
  name: 'listNoSearch',
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
    scrollTable,
  },
  methods: {
    
  },
}
