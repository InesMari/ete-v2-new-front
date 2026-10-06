<template>
    <div class="addRecruit" id="addRecruit">
      <div class="common-info">
        <ul class="content clearfix">
          <li class="item item100">
            <label class="label-term"><em>*</em>职位名称</label>
            <div class="input-text">
              <el-input v-model="info.positionName"  show-word-limit maxlength="50"></el-input>
            </div>
          </li>
          <li class="item item100">
            <label class="label-term">标签</label>
            <div class="input-text">
              <Mytag ref="tags" :dynamic-tags="info.tagArray"></Mytag>
            </div>
          </li>
          <li class="item item100 itemEditor">
            <label class="label-term"><em>*</em>职位描述</label>
            <div class="input-text">
              <WangEditor ref="positionDesc" id="positionDesc"></WangEditor>
            </div>
          </li>
          <li class="item item100 itemEditor">
            <label class="label-term"><em>*</em>任职要求描述</label>
            <div class="input-text">
              <WangEditor ref="requirementDesc" id="requirementDesc"></WangEditor>
            </div>
          </li>
          <li class="item item100">
            <label class="label-term"><em>*</em>薪资范围</label>
            <div class="input-text range">
              <el-input v-model="info.salaryStart" v-mypmnumval></el-input>
              <span style="margin:0 10px;">-</span>
              <el-input v-model="info.salaryEnd"  v-mypmnumval></el-input>
            </div>
          </li>
          <li class="item item100">
            <label class="label-term"><em>*</em>工作城市</label>
            <div class="input-text">
              <el-input v-model="info.workCity"  show-word-limit maxlength="50"></el-input>
            </div>
          </li>
          <li class="item item100">
            <label class="label-term">工作地址</label>
            <div class="input-text">
              <el-input v-model="info.workAddress"  show-word-limit maxlength="200"></el-input>
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
    import addRecruit from './addRecruit.js'
    export default addRecruit
  </script>
<style lang="scss" scoped>
  .addRecruit {
    height: auto!important;
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
        .input-text.range{
          display: flex;
          width: 180px;
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