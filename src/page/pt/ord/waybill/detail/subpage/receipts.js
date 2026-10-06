import myFileModel from '@/components/myFileModel/myFileModel.vue'
import fileViewer from '@/components/myFile/file-viewer.vue';

export default {
  name: 'receipts',
  props:{ticketList:{type: Array}},
  data() {
    return {
      srcList: [],

    }
  },
  mounted() {
  },
  show(){

  },
  components: {
    myFileModel,
    fileViewer
  },
  methods: {
    // 查看票据图片
    showTickerImg(path){
      this.srcList=[];
      this.srcList.push(this.common.getBigImgPath(path));
      this.$refs.viewer.show();
    },
  },
}
