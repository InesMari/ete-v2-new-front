import WangEditor from "@/components/wangEditor/wangEditor.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue';

export default {
  name: 'addTask',
  data() {
    return {
      info:{},
      options:[],
      fileList:[],
    }
  },
  components: {
    WangEditor,
    myFileModel
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      let aaa = await this.common.postUrl("menuTF", "queryAuthMenuList", {});
    },
    /**
     * 图片上传成功回调
     */
    fileCallback(data){
      console.log(data);
      this.fileList.push(data);
      this.$refs.file.clean();
    },
    // 下载文件
    download(index){
      this.common.downloadFile(this.fileList[index].fullPath);
    },
    // 删除文件
    delFile(index){
      this.fileList.splice(index,1)
    },
    close(){

    },
    // 保存
    submit(){
      this.info.content = this.$refs.wangEditor.html;
    }
  },
}