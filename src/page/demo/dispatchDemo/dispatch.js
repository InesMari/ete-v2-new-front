import myFileModel from '@/components/myFileModel/myFileModel.vue'
import imgsUpload from '@/components/imgsUpload/imgsUpload.vue'
import fileViewer from '@/components/myFile/file-viewer.vue';

export default {
  name: 'dispatch',
  props:['data'],
  data() {
    return {
      isshowUploadDialog:false,
      isshowGoodsDetialDialog:false,
      showViewer:false,
      srcList: [],
      // 假数据配置
      list:[1,2,3],
      selectValue:"",
      inputvalue:"",
      options:[],
      ticketList:[
        {codeName:"提货凭证",time:"2020-11-17 20:25:33",showName:"xxxyy,png",name:"张三"}
      ],
      // 假数据配置 end
    }
  },
  mounted() {
    console.log(this.data)
  },
  components: {
    myFileModel,
    imgsUpload,
    fileViewer
  },
  methods: {
    showUploadDialog(){
      this.isshowUploadDialog = true;
      if(this.common.isNotBlank(this.$refs.imgsUpload)){
        this.$refs.imgsUpload.show();
      }
    },
    //展示货物明细弹窗
    showGoodsDetail(){
      this.isshowGoodsDetialDialog = true;
    },
    back(){
      this.$emit("hide");
    },
    // 单据选择回调
    imgCallback(data){
      this.ticketList = [...this.ticketList,...data];
    },
    // 查看票据图片
    showTickerImg(path){
      this.showViewer = true;
      this.srcList=[];
      this.srcList.push(path);
    },
    // 关闭查看大图
    closeViewer(){
      this.showViewer = false;
  },
  },
}