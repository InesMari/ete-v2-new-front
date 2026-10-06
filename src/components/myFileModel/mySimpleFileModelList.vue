<template>
  <div id="mySimpleFileModelList">
    <myFileModel ref="file" @successCallback="successCallback" v-show="!disabled" :fileLimit="fileLimit"></myFileModel>
    <div class="fileList" v-show="fileList.length>0">
      <div class="fileItem" v-for="(item,index) in fileList">
        {{index+1}}.
        <!-- 上传图片 -->
        <img v-if="item.type=='img'" :src="item.fullPath" class="fileIco">
        <!-- 上传excel文档 -->
        <img v-else-if="item.type=='excel'" src="@/static/image/excel.png" class="fileIco">
        <!-- 上传word文档 -->
        <img v-else-if="item.type=='word'" src="@/static/image/word.png" class="fileIco">
        <!-- 上传ppt文档 -->
        <img v-else-if="item.type=='ppt'" src="@/static/image/ppt.png" class="fileIco">
        <!-- 上传pdf文档 -->
        <img v-else-if="item.type=='pdf'" src="@/static/image/pdf.png" class="fileIco">
        <!-- 上传视频（mp4） -->
        <div v-else-if="item.type=='mp4'" class="video"><i class="el-icon-video-play"></i></div>
        <!-- 上传文件 -->
        <img v-else-if="item.type=='file'" src="@/static/image/fileIco.png" class="fileIco">
        <div class="fileInfo">
          <a class="link blueFont" href="javascript:void(0);" @click="view(item,index)">{{ item.fileName?item.fileName:'附件'+(index+1) }}</a>
        </div>
        <el-popconfirm
            confirm-button-text='确认'
            cancel-button-text='取消'
            icon="el-icon-info"
            icon-color="red"
            title="删除附件后，附件需要重新上传，确认删除附件吗？"
            v-if="!disabled"
            @confirm="delFile(index)">
          <i class="el-icon-delete" style="margin-top: 5px;margin-left: 5px;" slot="reference"></i>
        </el-popconfirm>
        <slot :item="item" :index="index"></slot>
      </div>
    </div>
    <fileViewer ref="viewer" :url-list="[bigImageUrl]"></fileViewer>
  </div>
</template>

<script>
import myFileModel from "@/components/myFileModel/myFileModel.vue";
import fileViewer from '@/components/myFile/file-viewer.vue';

export default {
  name: "mySimpleFileModelList",
  components: {
    myFileModel,
    fileViewer,
  },
  props:["disabled","name","switchFile","successCallbackFlag","fileLimit"],
  data() {
    return {
      fileList: [],
      type:'',
      imageUrl:'',
      bigImageUrl:'',
    }
  },
  mounted(){

  },
  methods:{
    /**
     * 图片上传成功回调
     */
    successCallback(data){
      data.fileId = data.flowId;
      data.filePath = data.storePath;
      this.$refs.file.clean();
      this.$emit("successCallback",data);
      if(this.successCallbackFlag){
        this.fileList.push(data);
      }
    },
    view(item,index){
      if(item.type=='img'){
        this.viewBigImg(index);
      }else if(item.type=='pdf'){   //查看pdf
        let idx = item.fullPath.indexOf("?");
        let url = item.fullPath;
        if(idx>=0){
          url = item.fullPath.substring(idx,0);
        }
        this.bigImageUrl = url;
        this.$refs.viewer.show();
      }else if(item.type=='excel'||item.type=='word'||item.type=='ppt'){  //使用OnlyOffice预览office文档
        this.bigImageUrl = item.fullPath;
        this.$refs.viewer.show();
      }else{
        this.download(index);
      }
    },
    // 下载文件
    download(index){
      this.common.downloadFile(this.fileList[index].fullPath);
    },
    // 删除文件
    delFile(index){
      // this.common.postUrl("fileCommonTF","doDel",{flowId:this.fileList[index].flowId});
      //调用父组件的回调
      this.$emit("delFile",this.fileList[index]);
      this.fileList.splice(index,1);
      //到后台删除
    },
    getAllFileList(){
      return this.fileList;
    },
    initFileList(fileList){
      this.fileList = fileList;
      if(this.fileList==null){
        this.fileList=[];
      }
      let that = this;
      this.fileList.forEach(item=> {
        item.type = that.$refs.file.getFileType(item.fileName);
      })
    },
    // 查看大图
    viewBigImg(index){
      this.bigImageUrl = this.common.getBigImgPath(this.fileList[index].fullPath);
      this.$refs.viewer.show();
    },
  }
};
</script>
<style lang="scss" scoped>
#mySimpleFileModelList{
  display: flex;
  flex:1;
  min-width: 0;
  /deep/ .myFileModel{
    .avatar-uploader{
      .el-upload,.avatar-uploader-icon{
        width:80px;
        height: 80px;
        line-height: 80px;
      }
      .avatar-uploader-inner>img{
        display: none;
      }
    }
  }
  .fileList{
    margin: 0 0 10px 10px;
    width: calc(100% - 80px);
    max-width: 250px;
    .fileItem{
      display: flex;
      margin-bottom: 10px;
      padding: 5px;
      background: #f2f5f7;
      align-items: center;
      position: relative;
      .fileIco{
        width: 20px;
        height: 20px;
      }
      .el-icon-delete{
        font-size: 16px;
        cursor: pointer;
        &:hover{
          color: red;
        }
      }
      .el-icon-download,.el-icon-view{
        font-size: 16px;
        margin-right: 8px;
        cursor: pointer;
        &:hover{
          color: #00d500;
        }
      }
      .fileInfo{
        margin-left: 5px;
        flex: 1;
        min-width: 0; 
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .fileName{
          margin-bottom: 5px;
          color: #333;
          font-size: 13px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .nameTime{
          color: #999;
          .date{
            margin-left: 10px;
          }
        }
      }
    }
  }
}

</style>

