<template>
  <div class="wangEditorComponents">
    <div class="infoTip" v-if="showInfoTip">
      <i class="el-icon-warning"></i>你有一份自动保存于{{editorInfo.time}}的草稿，是否<a class="link" @click="resetEditorInfo">恢复</a>上一次输入的描述？<i class="el-icon-close" @click="closeInfoTip"></i>
    </div>
    <div class="editorView" style="border: 1px solid #ccc">
      <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editor"
        :defaultConfig="toolbarConfig"
        :mode="mode"
      />
      <Editor
        :style="'height: ' + height + 'px; overflow-y: hidden'"
        :defaultConfig="editorConfig"
        v-model="html"
        :mode="mode"
        @onCreated="onCreated"
        @onChange="onChange"
      />  
    </div>
  </div>
</template>
  
<script>
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

export default {
  name: "WangEditor",
  components: {
    Editor,
    Toolbar,
  },
  props: {
    height: {
      type: Number,
      default: 500,
    },
  },
  data() {
    return {
      editor: null,
      html: "",
      editorConfig: {
        MENU_CONF: {
          uploadImage: {
            customUpload:this.customUploadFn,
            // base64LimitSize: 10 * 1024 // 10k 以下插入 base64
          }
        },
        autoFocus: false
      },
      toolbarConfig: {
        excludeKeys: ["uploadVideo"],
      },
      mode: "default", // or 'simple'
      showInfoTip:false,
      editorInfo:{},
    }
  },
  mounted() {
    this.checkHisEditorInfo();
  },
  methods: {
    /**
     * 检查并设置编辑器信息。
     * 该函数从本地存储中读取编辑器信息，根据当前路由路径获取特定的编辑器内容，并据此决定是否显示信息提示。
     * 无参数。
     * 无显式返回值，但可能会影响组件的状态（如：showInfoTip）。
     */
    checkHisEditorInfo(){
        // 从本地存储获取编辑器信息，如果不存在则默认为空对象
        this.editorInfoStorage = JSON.parse(localStorage.getItem('editorInfo')) || {};
        // 根据当前路由的路径获取对应的编辑器信息，如果不存在则默认为空对象
        this.editorInfo = this.editorInfoStorage[this.$route.meta.path] || {};
        // 检查编辑器内容和时间是否都不为空
        if(this.common.isNotBlank(this.editorInfo.content) && this.common.isNotBlank(this.editorInfo.time)){
          // 计算当前时间与编辑信息时间的差值
          let timeStamp = new Date().getTime() - new Date(this.editorInfo.time).getTime();
          // 如果时间差小于一天，则显示信息提示
          if(timeStamp < 86400000){
            this.showInfoTip = true;
          }else{
            // 如果时间差大于等于一天，清除当前路径的编辑器信息，并更新localStorage
            this.editorInfoStorage[this.$route.meta.path] = null;
            localStorage.setItem('editorInfo',JSON.stringify(this.editorInfoStorage));
          }
        }
    },
        /**
     * 重置编辑器信息，将编辑器内容设置为当前编辑器信息中的内容，并关闭信息提示。
     */
    resetEditorInfo(){      
      this.setEditor(this.editorInfo.content); // 设置编辑器内容
      this.closeInfoTip(); // 关闭信息提示
    },
    
    /**
     * 关闭信息提示，将是否关闭和是否显示信息提示的标志设置为true和false。
     */
    closeInfoTip(){
      this.isClose = true; // 标记为已关闭
      this.showInfoTip = false; // 隐藏信息提示
    },
    
    /**
     * 清除编辑器信息存储，将当前路由路径对应的编辑器信息设置为null，并更新localStorage中的编辑器信息存储。
     */
    clearEditorInfoSorage(){
      this.editorInfoStorage[this.$route.meta.path] = null; // 清除当前路径的编辑器信息
      localStorage.setItem('editorInfo',JSON.stringify(this.editorInfoStorage)); // 更新localStorage中的编辑器信息存储
    },
        /**
     * 自定义上传函数，对上传的文件进行校验，并通过回调函数插入到页面中。
     * @param {File} file - 需要上传的文件对象。
     * @param {Function} insertFn - 文件上传成功后，用于将图片插入到页面的回调函数。
     * @returns {boolean} - 如果文件类型不正确，则返回false，否则不返回值，由回调函数处理结果。
     */
    customUploadFn(file, insertFn) {
        // 校验上传文件的类型，必须为jpeg、gif或png格式
        if (!/jpeg|gif|png/.test(file.type)) {
            this.$message.error("请上传图片");
            return false;
        }
        let _this = this;
        // 调用common对象的uploadFile方法上传文件
        this.common.uploadFile(file,function(res){            
            // 上传成功后，通过insertFn插入处理后的图片路径到页面
            insertFn(_this.common.getBigImgPath(res.fullPath), "", "");
        })
    },
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
      window.editor = this.editor;
    },
        /**
     * 处理编辑器内容变化的事件。
     * 该函数首先检查是否处于关闭状态，如果是，则取消进一步的操作。
     * 接着，清除之前设置的定时器，以防止旧的编辑内容被保存。
     * 然后，获取当前路由的路径，并在10秒后执行保存编辑器内容的操作，
     * 包括获取HTML内容、更新编辑器信息、将编辑器信息存储到localStorage中。
     */
    onChange(){
      // 如果当前处于关闭状态，则取消进一步操作
      if(this.isClose){
        this.isClose = false;
        return;
      }
      // 清除之前的定时器
      clearTimeout(this.timer);
      // 获取当前路由的路径
      let path = this.$route.meta.path;
      // 设置定时器，在10秒后保存编辑器的内容和时间信息
      this.timer = setTimeout(() => {
        // 获取编辑器的HTML内容
        let html = this.editor.getHtml();
        // 更新编辑器信息，包括内容和时间
        this.editorInfo.content = html;
        this.editorInfo.time = this.common.formatDate.getDateTime();
        // 将编辑器信息存储到本地存储中，以路径为键
        this.editorInfoStorage[path] = this.editorInfo;
        localStorage.setItem('editorInfo',JSON.stringify(this.editorInfoStorage));
      }, 10000);
    },
    beforeDestroy() {
      const editor = this.editor;
      if (editor == null) return;
      editor.destroy(); // 组件销毁时，及时销毁编辑器
    },
    // 回显值
    setEditor(html,disable){
      if (this.common.isNotBlank(this.editor)) {
        this.editor.setHtml(html);
        if(disable){
          this.editor.disable();
        }
      }else{
        let that = this;
        const timer = setTimeout(() => {
          clearTimeout(timer)
          that.setEditor(html)
        }, 300);
      }
    },
    getText(){
      return this.editor.getText();
    },
    clearEditor() {
      // 清空编辑器
      this.editor.setHtml('');
      this.clearEditorInfoSorage();
      this.editor.clear();
    },
  },
};
</script>
<style lang="scss" scoped>
.infoTip{
  background: #ffefe3;
  padding:5px 10px;
  color: #333;
  .el-icon-warning{
    color: #ed9011;
    margin-right: 10px;
    font-size: 16px;
    vertical-align: text-bottom;
  }
  .el-icon-close{
    color: #333;
    float: right;
    cursor: pointer;
    margin-top: 4px;
    font-size: 14px;
    &:hover{
      color: red;
    }
  }
}
</style>
<style>
.w-e-full-screen-container{
  z-index: 9999;
}
</style>