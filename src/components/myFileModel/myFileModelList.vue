<template>
  <div id="myFileModelList">
    <myFileModel ref="file" @successCallback="successCallback" v-show="!disabled"></myFileModel>
    <div class="fileList" v-show="fileList.length>0">
      <div class="fileItem" v-for="(item,index) in fileList">
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
          <div class="fileName">{{ item.fileName }}</div>
          <div class="nameTime">{{ item.userName }}<span class="date">{{ item.upDate }}</span></div>
        </div>
        <i v-if="item.type!='img'" :class="(item.type=='pdf'||item.type=='excel'||item.type=='word'||item.type=='ppt')?'el-icon-view':'el-icon-download'" @click="download(index)"></i>
        <i v-if="item.type=='img'" class="el-icon-view" @click="viewBigImg(index)"></i>
        <el-popconfirm
            confirm-button-text='确认'
            cancel-button-text='取消'
            icon="el-icon-info"
            icon-color="red"
            title="确认删除附件吗？"
            v-if="!disabled"
            @confirm="delFile(index)">
          <i class="el-icon-delete" style="margin-top: 5px;" slot="reference"></i>
        </el-popconfirm>
      </div>
    </div>
    <fileViewer ref="viewer" :url-list="[bigImageUrl]"></fileViewer>
    <div class="popup_bj" v-show="isshowVideo">
      <i class="el-icon-circle-close close" @click="closeVideo"></i>
      <video ref="video" :src="fullPath" controls></video>
    </div>
  </div>
</template>

<script>
import myFileModel from "@/components/myFileModel/myFileModel.vue";
import fileViewer from '@/components/myFile/file-viewer.vue';

export default {
  name: "myFileModelList",
  components: {
    myFileModel,
    fileViewer,
  },
  props:["disabled","name"],
  data() {
    return {
      fileList: [],
      type:'',
      imageUrl:'',
      isshowVideo:false,  //是否展示视频
      fullPath:'',
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
      data.userName = this.common.userInfo().userName;
      data.upDate = this.common.formatDate.getDate(new Date());
      data.fileId = data.flowId;
      data.filePath = data.storePath;
      this.fileList.unshift(data);
      this.$refs.file.clean();
      this.$emit("successCallback",data);
    },
    // 下载文件
    download(index){
      let item = this.fileList[index];
      if(item.type == 'mp4'){
        this.isshowVideo = true;
      }else{
        if(item.type=='pdf'){   //查看pdf
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
        }else{  //下载文件
          let fullPath = item.fullPath+'?filename='+this.fileList[index].fileName;
          this.common.downloadFile(fullPath)
        }
      }
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
    // 关闭查看视频
    closeVideo(){
      this.$refs.video.pause();
      this.isshowVideo = false;
    }

  }
};
</script>
<style lang="scss" scoped>
#myFileModelList{
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
    margin-top: 10px;
    .fileItem{
      display: flex;
      margin-bottom: 10px;
      padding: 10px;
      background: #f2f5f7;
      align-items: center;
      .fileIco{
        width: 50px;
        height: 50px;
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

