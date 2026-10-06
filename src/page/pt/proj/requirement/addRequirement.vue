<template>
  <div id="addRequirement" class="addRequirementPage">
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
              <div class="label"><em>*</em>需求来源：</div>
              <div class="value">
                <el-select v-model="info.requirementClass" placeholder="请选择">
                  <el-option v-for="item in requirementClassData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                </el-select>
              </div>
            </div>
            <div class="item">
                <div class="label"><em>*</em>分类：</div>
                <div class="value">
                    <el-select v-model="info.type" placeholder="请选择">
                        <el-option v-for="item in typeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
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
            <div class="item" v-if="info.requirementClass==1||info.requirementClass==3">
              <div class="label"><em>*</em>需求部门：</div>
              <div class="value">
                <el-select v-model="info.srcOrgId" placeholder="请选择" @change="changeOrg" filterable>
                  <el-option v-for="item in orgData" :key="item.id" :label="item.orgName"
                             :value="item.id"></el-option>
                </el-select>
              </div>
            </div>
            <div class="item" v-if="info.requirementClass==1||info.requirementClass==3">
              <div class="label"><em>*</em>结算主体：</div>
              <div class="value">
                <el-select v-model="info.srcSettleBody" placeholder="请选择" filterable>
                  <el-option v-for="item in settleBodyData" :key="item.codeValue" :label="item.codeName"
                             :value="item.codeValue"></el-option>
                </el-select>
              </div>
            </div>
            <div class="item" v-if="info.requirementClass==1||info.requirementClass==3">
                <div class="label"><em>*</em>需求人：</div>
                <div class="value">
                    <el-select v-model="info.srcUserId" placeholder="请选择" filterable>
                        <el-option v-for="item in orgUserData" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="item" v-if="info.requirementClass==2">
              <div class="label"><em>*</em>需求客户：</div>
              <div class="value">
                <el-select v-model="info.srcTenantId" placeholder="请选择" filterable clearable>
                  <el-option v-for="item in custOptions" :key="item.tenantId" :label="item.name" :value="item.tenantId"></el-option>
                </el-select>
              </div>
            </div>
          <div class="item">
            <div class="label">工时(人日)：</div>
            <div class="value">
              <el-input v-model="info.workHours" v-mydoubleval placeholder="请输入工时"></el-input>
            </div>
          </div>
          <div class="item">
            <div class="label">需求确认人：</div>
            <div class="value">
              <el-select v-model="info.confirmUserId" placeholder="请选择" filterable>
                <el-option v-for="item in orgUserData" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
              </el-select>
            </div>
          </div>
          <div class="item" v-if="info.iterationId>0">
            <div class="label">迭代：</div>
            <div class="value">
              <el-select v-model="info.iterationId" placeholder="请选择" disabled="true">
                <el-option v-for="item in iterationData" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
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
import addRequirement from './addRequirement.js'
export default addRequirement
</script>
<style lang="scss" scoped>
.addRequirementPage{
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