import {head} from '@/static/json.js'
import tableCommon from "@/components/table/tableCommon.vue"
import fileViewer from '@/components/myFile/file-viewer.vue';

export default {
  name: 'invoiceManager',
  data() {
    return {
      head:head,
      showViewer:false,
      srcList:[],
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
    fileViewer,
  },
  methods: {
    checkTicket(){
      this.showViewer = true;
      this.srcList=[];
      this.srcList.push("http://47.105.96.101:1080//group1/M00/00/14/rB_z_190IV2AZuIQAAAoLPDVbpw500_big.jpg");
      this.$refs.viewer.show();
    },
  },
}
