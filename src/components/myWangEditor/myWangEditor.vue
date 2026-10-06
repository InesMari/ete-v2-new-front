<template>
    <div id="myWangEditor" class="myWangEditor">
      <div class="title">
        {{ title }}
        <div class="fr">
          <el-button size="mini" @click="reEdit" v-show="!isEdit&&!disabled">编辑</el-button>
          <el-button size="mini" @click="cancel" v-show="isEdit">取消</el-button>
          <el-button size="mini" @click="submit" v-show="isEdit" type="primary">保存</el-button>
        </div>
      </div>
      <div class="w-e-text-container">
        <div ref="content" class="content" data-slate-editor style="padding-bottom: 10px;" v-show="!isEdit||disabled" v-html="content"></div>
      </div>
      <WangEditor ref="wangEditor" v-show="isEdit"></WangEditor>
      <fileViewer ref="viewer" :url-list="[imageUrl]"></fileViewer>
    </div>
</template>

<script>
import myWangEditor from './myWangEditor.js'
export default myWangEditor
</script>
<style scoped lang="scss">
.myWangEditor{
  /deep/ .content{
    img{
      max-width: 100%;
      cursor: zoom-in;
    }
  }
}
</style>