import WangEditor from "@/components/wangEditor/wangEditor.vue";
import myFileModel from '@/components/myFileModel/myFileModel.vue'

export default {
  name: 'taskDetail',
  data() {
    return {
      info:{
        content:"<p>只是内容</p><p>只是内容</p><p>只是内容</p><p>只是内容</p>"
      },
      isEdit:false,
      options:[],
      fileList:[],
      inputvalue:''
    }
  },
  components: {
    WangEditor,
    myFileModel
  },
  mounted() {

  },
  methods: {
    reEdit(){
      this.isEdit = true;
      this.$nextTick(()=>{
        this.$refs.wangEditor.setEditor(this.info.content);
      })
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
    // 取消
    cancel(){
      this.isEdit = false;
    },
    // 保存
    submit(){
      this.info.content = this.$refs.wangEditor.html;
      this.cancel();
    }
  },
}