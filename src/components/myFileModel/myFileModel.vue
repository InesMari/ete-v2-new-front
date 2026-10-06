<template>
  <div id="myFileModel" class="myFileModel">
    <el-upload
    class="avatar-uploader"
    :class="{'disabled':disabled||disabledEdit,'textBtn':isTextBtn||txtOnlyUp}"
    action=""
    :http-request="() => {}"
    :show-file-list="false"
    :disabled="disabled||disabledEdit"
    :on-success="handleAvatarSuccess"
    drag
    :multiple="true"
    :before-upload="beforeAvatarUpload">
      <div v-if="isTextBtn">
        <a href="javascript:;" class="link" v-if="!haveImg&&!disabled">上传</a>
        <a href="javascript:;" class="link" v-if="haveImg&& !disabledEdit" style="margin-right: 5px;">修改</a>
        <a href="javascript:;" class="link" v-if="haveImg&& !disabledDel" @click.stop="delImg()" style="margin-right: 5px;">删除</a>
        <a href="javascript:;" class="link" @click.stop="visitFile()" v-if="haveImg">查看</a>
      </div>
      <div v-else-if="txtOnlyUp">
        <a href="javascript:;" class="link" v-if="!disabled">上传</a>          
      </div>
      <div v-else class="avatar-uploader-inner">
        <!-- 上传图片 -->
        <img v-if="type=='img'" :src="imageUrl" class="avatar">
        <!-- 上传excel文档 -->
        <img v-else-if="type=='excel'" src="@/static/image/excel.png" class="excelIco">
        <!-- 上传word文档 -->
        <img v-else-if="type=='word'" src="@/static/image/word.png" class="excelIco">
        <!-- 上传ppt文档 -->
        <img v-else-if="type=='ppt'" src="@/static/image/ppt.png" class="excelIco">
        <!-- 上传pdf文档 -->
        <img v-else-if="type=='pdf'" src="@/static/image/pdf.png" class="excelIco">
        <!-- 上传视频（mp4） -->
        <div v-else-if="type=='mp4'" class="video"><i class="el-icon-video-play"></i></div>
        <!-- 上传文件 -->
        <img v-else-if="type=='file'" src="@/static/image/fileIco.png" class="excelIco">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        <div v-show="haveImg&&!disabled" @click.stop="visitFile()" class="img_popup">
          <i class="close" @click.stop="delImg()" v-if="!disabledDel">×</i>
          <div class="editImg" v-if="!disabledEdit">修改{{type == 'img' ? '图片' : '文件'}}</div>
        </div>
      </div>
    </el-upload>
    <fileViewer ref="viewer" :url-list="[bigImageUrl]"></fileViewer>
  </div>
</template>

<script>
  import myFileModel from './myFileModel.js'
  export default myFileModel
</script>
<style src="./myFileModel.scss" lang="scss" scoped></style>
