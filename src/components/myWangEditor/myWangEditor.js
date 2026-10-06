import WangEditor from "@/components/wangEditor/wangEditor.vue";
import fileViewer from '@/components/myFile/file-viewer.vue';

export default {
  name: "myWangEditor",
  components: {
    WangEditor,
    fileViewer,
  },
  props:["title","content","disabled"],
  data() {
    return {
      isEdit:false,
      imageUrl:"",
    }
  },
  mounted(){

  },
  methods:{
    reEdit(){
      this.isEdit = true;
      this.$nextTick(()=>{
        this.$refs.wangEditor.setEditor(this.content);
      })
    },
    // 图片点击查看大图
    initImgs(){
      let content = this.$refs.content;
      let imgs = content.querySelectorAll("img");
      let _this = this;
      if(imgs.length>0){
        imgs.forEach((el,index) => {
          el.addEventListener("click",function(){
            _this.imageUrl = this.src;
            _this.$refs.viewer.show();
            _this.$forceUpdate();
          })
        })
      }
    },
    // 取消
    cancel(){
      this.isEdit = false;
    },
    // 保存
    submit(){
      // this.content = this.$refs.wangEditor.html;
      this.$emit("submit",this.$refs.wangEditor.html,this.$refs.wangEditor.getText());
      this.$refs.wangEditor.clearEditorInfoSorage();
      this.cancel();
    }

  },
  watch:{
    content:{
        handler(n){
            this.$nextTick(()=>{
              this.initImgs();
            })
        }
    }
  }
};