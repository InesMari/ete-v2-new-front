import myFileModel from '@/components/myFileModel/myFileModel.vue'
import imgsUpload from '@/components/imgsUpload/imgsUpload.vue'
import fileViewer from '@/components/myFile/file-viewer.vue';

export default {
  name: 'receipts',
  props:{ticketList:{type: Array}},
  data() {
    return {
      isshowUploadDialog:false,
      srcList: [],

    }
  },
  mounted() {
  },
  show(){

  },
  components: {
    myFileModel,
    imgsUpload,
    fileViewer
  },
  methods: {
    //上传单据
    showUploadDialog(){
      this.isshowUploadDialog = true;
      if(this.common.isNotBlank(this.$refs.imgsUpload)){
        this.$refs.imgsUpload.show();
      }
    },
    getData(){
      return this.ticketList;
    },
    // 单据选择回调
    imgCallback(data){
      for (let i = 0; i < data.length; i++) {
        data[i].receiptsTypeName = data[i].codeName;
        data[i].receiptsType = data[i].codeValue;
        data[i].createDate = data[i].time;
        data[i].fileName = data[i].showName;
        data[i].createUserName = this.common.userInfo().userName;
        this.ticketList.push(data[i]);
      }
    },
    // 删除图片
    delImg(index){
      //删除数据
      this.common.postUrl("fileCommonTF","doDel",{flowId:this.ticketList[index].flowId});
      this.ticketList.splice(index,1);
    },
    // 查看票据图片
    showTickerImg(path){
      this.srcList=[];
      this.srcList.push(this.common.getBigImgPath(path));
      this.$refs.viewer.show();
    },
  },
}
