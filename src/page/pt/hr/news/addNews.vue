<template>
    <div class="manage" id="addNews">
      <div class="common-info">
        <ul class="content clearfix">
          <li class="item item100">
            <label class="label-term"><em>*</em>标题</label>
            <div class="input-text">
              <el-input v-model="info.title"  show-word-limit maxlength="50"></el-input>
            </div>
          </li>
          <li class="item item100">
            <label class="label-term"><em>*</em>图片</label>
            <div class="input-text">
              <myFileModel ref="pic"></myFileModel>
            </div>
          </li>
          <li class="item item100 itemEditor">
            <label class="label-term"><em>*</em>内容</label>
            <div class="input-text">
              <WangEditor ref="wangEditor"></WangEditor>
            </div>
          </li>
        </ul>
        <div class="bot-btn">
          <el-button type="primary" @click="save">保存</el-button>
          <el-button @click="closePage">关闭</el-button>
        </div>
      </div>
    </div>
  </template>
    
    <script>
    import addNews from './addNews.js'
    export default addNews
  </script>
    <style lang="scss" scoped>
  .manage {
    .common-info{
      height: 100%;
      padding: 30px 20px;
      box-sizing: border-box;
      /deep/ .content{
          height: calc(100% - 80px);
        .itemEditor{
          height: calc(100% - 200px);
          .input-text{
            height: 100%;
            &>div{
              height: 100%;
              display: flex;
              flex-direction: column;
            }
            .w-e-full-screen-container{
              z-index: 999999;
            }
          }
        }
      }
    }
    /deep/ .el-select {
      width: 300px!important;
    }
    /deep/ .el-input-number{
      width: initial;
    }
    
  }
  </style>