<template>
    <div class="manage" id="addQuestion">
      <div class="common-info">
        <ul class="content clearfix">
          <li class="item item100">
            <label class="label-term"><em>*</em>问题名称</label>
            <div class="input-text">
              <el-input v-model="info.name"  show-word-limit maxlength="50" :disabled="view"></el-input>
            </div>
          </li>
          <li class="item item100">
            <label class="label-term"><em>*</em>分类目录</label>
            <div class="input-text">
                <el-select v-model="info.type" placeholder="请选择分类目录" filterable clearable :disabled="view" >
                  <el-option v-for="item in typeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                </el-select>
            </div>
          </li>
          <li class="item item100 itemEditor">
            <label class="label-term"><em>*</em>答案描述</label>
            <div class="input-text">
              <WangEditor ref="wangEditor" :disabled="view"></WangEditor>
            </div>
          </li>
          <li class="item item100">
            <label class="label-term"><em>*</em>问题排序</label>
            <div class="input-text">
              <el-input-number v-model="info.sortId"  :min="0" :disabled="view"></el-input-number>
            </div>
          </li>
          <li class="item item100">
            <label class="label-term">是否热门</label>
            <div class="input-text">
              <el-select v-model="info.isPopular" clearable filterable placeholder="请选择是否热门" :disabled="view">
                <el-option v-for="item in whetherData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
              </el-select>
            </div>
          </li>
        </ul>
        <div class="bot-btn" v-if="$route.query.type!=3">
          <el-button type="primary" @click="save">确认{{ $route.query.type==1?'新增':'修改' }}</el-button>
          <el-button @click="closePage">关闭</el-button>
        </div>
      </div>
    </div>
  </template>
    
    <script>
    import addQuestion from './addQuestion.js'
    export default addQuestion
  </script>
    <style lang="scss" scoped>
  .manage {
    .common-info{
      // height: 100%;
      padding: 30px 20px;
      box-sizing: border-box;
      /deep/ .content{
          // height: calc(100% - 80px);
        .itemEditor{
          // height: calc(100% - 200px);
          .input-text{
            // height: 100%;
            &>div{
              // height: 100%;
              display: flex;
              flex-direction: column;
            }
            .w-e-full-screen-container{
              z-index: 999999;
            }
          }
          .wangEditorComponents{
            .editorView{
              display: flex;
              flex-direction: column;
              height: 0;
              flex: 1;
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