<template>
  <div id="addTask" class="addTaskPage">
    <div class="common-info">
        <div class="editView">
            <el-input v-model="info.title" placeholder="请输入标题"></el-input>
            <WangEditor ref="wangEditor"></WangEditor>
            <div class="submitView clearfix">
                <el-checkbox class="fl" v-model="isNext">继续新建下一个</el-checkbox>
                <div class="fr">
                    <el-button size="small" @click="closePage">关闭</el-button>
                    <el-button size="small" type="primary" @click="submit">提交</el-button>
                </div>
            </div>
        </div>
        <div class="categoryView">
          <div class="item">
            <div class="label">迭代：</div>
            <div class="value">
              <el-select v-model="info.iterationId" placeholder="请选择" :disabled="info.itDisabled" filterable>
                <el-option v-for="item in iterationData" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </div>
          </div>
            <div class="item">
                <div class="label">关联需求：</div>
                <div class="value">
                    <el-select v-model="info.relId" placeholder="请选择" filterable>
                        <el-option v-for="item in requirementData" :key="item.id" :label="item.title" :value="item.id"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="item">
              <div class="label">父任务：</div>
              <div class="value">
                <el-select v-model="info.parentId" placeholder="请选择" filterable>
                  <el-option v-for="item in taskData" :key="item.id" :label="item.title" :value="item.id"></el-option>
                </el-select>
              </div>
            </div>
            <div class="item">
                <div class="label"><em>*</em>优先级：</div>
                <div class="value">
                    <el-select v-model="info.priority" placeholder="请选择">
                      <el-option v-for="item in priorityData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="item">
              <div class="label"><em>*</em>负责人：</div>
              <div class="value">
                <el-select v-model="info.assignedToUserId" placeholder="请选择">
                  <el-option v-for="item in userData" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
                </el-select>
              </div>
            </div>
            <div class="item">
              <div class="label"><em>*</em>验证人：</div>
              <div class="value">
                <el-select v-model="info.testUserId" placeholder="请选择">
                  <el-option v-for="item in userData" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
                </el-select>
              </div>
            </div>
            <div class="item">
              <div class="label"><em>*</em>计划开始时间：</div>
              <div class="value">
                <el-date-picker v-model="info.planStartDate" type="date" placeholder="开始时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
              </div>
            </div>
            <div class="item">
              <div class="label"><em>*</em>计划完成时间：</div>
              <div class="value">
                <el-date-picker v-model="info.planEndDate" type="date" placeholder="完成时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
              </div>
            </div>
            <div class="item">
                <div class="label">需求附件：</div>
                <div class="value">
                  <my-file-model-list ref="fileModelList" @delFile="delFile" ></my-file-model-list>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import addTask from './addTask.js'
export default addTask
</script>
<style lang="scss" scoped>
.addTaskPage{
  /deep/ .common-info{
    display: flex;
    .editView{
      flex: 1;
      min-width: 0;
      .el-input{
        margin-bottom: 20px;
      }
      .submitView{
        margin-top: 10px;
        line-height: 32px;
      }
    }
    .categoryView{
      width: 350px;
      margin-left: 20px;
      .item{
        display: flex;
        margin-bottom: 10px;
        .label{
          width: 90px;
          line-height: 40px;
          text-align: right;
          // margin-right: 10px;
        }
        .value{
          flex:1;
          min-width: 0;
          line-height: 40px;
        }
        .el-select{
          width: 100%;
        }
        .el-date-editor.el-input{
          width: 100%;
        }
      }
    }
  }
}
</style>