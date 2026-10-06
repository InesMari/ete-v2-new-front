<template>
  <div id="requirementDetail" class="requirementDetailPage">
    <div class="common-info">
        <div class="editView">
            <el-input class="title-input" v-model="info.title" placeholder="请输入标题" @change="updateRequirementInfoByField('title')" :disabled="baseDisable" ></el-input>
            <div class="task-info">
              <my-wang-editor :title="contentTitle" ref="wangEditor" :content="info.requirementDesc" @submit="contentSubmit" :disabled="baseDisable"></my-wang-editor>
            </div>
            <div class="task-info task-info2">
              <my-wang-editor :title="solveTitle" ref="solveWangEditor" :content="info.solveDesc" @submit="solveSubmit" :disabled="solveDisable"></my-wang-editor>
            </div>
            <div class="history task-info2">
              <el-tabs v-model="tab" @tab-click="handleClick">
                <el-tab-pane label="动态记录" name="1">
                  <div class="list">
                    <div class="item" v-for="item in info.logList">
                      <div class="tag">{{ item.firstName }}</div>
                      <div class="content">
                        <div class="name">{{ item.createUserName }}<span class="date">{{ item.createDate }}</span></div>
                        <div class="desc">{{ item.opContent }}</div>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="关联任务" name="2">
                  <div class="table-content" style="border: none;margin-top: -10px;">
                    <div class="table-title">
                      <div class="table-title-btn" style="margin-right: 90px;">
                        <el-button type="primary" plain size="mini" @click="add()" v-entity="1007094" v-if="info.state<5">新增关联任务</el-button>
                      </div>
                    </div>
                    <tableCommon tableName="subRequirementTaskManageTable" ref="table" :showNum="true" :showSetTable="true" :head="head" :showSelect="false"  @dblclickItem="dblclickItem">
                      <template v-slot="{item,code}">
                        <div v-if="code=='stateName'">
                          <div v-if="stateDisable||item.disabled" style="color: #999!important;">{{item.stateName}}</div>
                          <el-select v-model="item.state" placeholder="请选择" @change="updateTaskInfoByField(item,'state')" v-else>
                            <el-option v-for="item in taskStateData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                          </el-select>
                        </div>
                        <div v-if="'parentTaskNum'==code">
                          <a href="javascript:void(0);" class="link" @click.stop="gotoTask(item)">{{item[code]}}</a>
                        </div>
                      </template>
                    </tableCommon>
                  </div>
                </el-tab-pane>
              </el-tabs>

            </div>
        </div>
        <div class="categoryView">
            <div class="item">
              <div class="label">需求编号：</div>
              <div class="value">{{info.requirementNum}}</div>
            </div>
            <div class="item">
              <div class="label"><em>*</em>需求来源：</div>
              <div class="value">
                <el-select v-model="info.requirementClass" placeholder="请选择" @change="updateRequirementInfoByField('requirementClass')" :disabled="baseDisable">
                  <el-option v-for="item in requirementClassData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                </el-select>
              </div>
            </div>
            <div class="item">
              <div class="label"><em>*</em>分类：</div>
              <div class="value">
                <el-select v-model="info.type" placeholder="请选择" @change="updateRequirementInfoByField('type')" :disabled="baseDisable">
                  <el-option v-for="item in typeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                </el-select>
              </div>
            </div>
            <div class="item">
              <div class="label"><em>*</em>优先级：</div>
              <div class="value">
                <el-select v-model="info.priority" placeholder="请选择" @change="updateRequirementInfoByField('priority')" :disabled="baseDisable">
                  <el-option v-for="item in priorityData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                </el-select>
              </div>
            </div>
            <div class="item" v-if="info.requirementClass==1||info.requirementClass==3">
              <div class="label"><em>*</em>需求部门：</div>
              <div class="value">
                <el-select v-model="info.srcOrgId" placeholder="请选择" @change="changeOrg" :disabled="baseDisable" filterable>
                  <el-option v-for="item in orgData" :key="item.id" :label="item.orgName"
                             :value="item.id"></el-option>
                </el-select>
              </div>
            </div>
            <div class="item" v-if="info.requirementClass==1||info.requirementClass==3">
              <div class="label"><em>*</em>结算主体：</div>
              <div class="value">
                <el-select v-model="info.srcSettleBody" placeholder="请选择" filterable @change="updateRequirementInfoByField('srcSettleBody')" :disabled="baseDisable">
                  <el-option v-for="item in settleBodyData" :key="item.codeValue" :label="item.codeName"
                             :value="item.codeValue"></el-option>
                </el-select>
              </div>
            </div>
            <div class="item" v-if="info.requirementClass==1||info.requirementClass==3">
              <div class="label"><em>*</em>需求人：</div>
              <div class="value">
                <el-select v-model="info.srcUserId" placeholder="请选择" @change="updateRequirementInfoByField('srcUserId')" :disabled="baseDisable" filterable>
                  <el-option v-for="item in orgUserData" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
                </el-select>
              </div>
            </div>
            <div class="item" v-if="info.requirementClass==2">
              <div class="label"><em>*</em>需求客户：</div>
              <div class="value">
                <el-select v-model="info.srcTenantId" placeholder="请选择" filterable @change="updateRequirementInfoByField('srcTenantId')" :disabled="baseDisable">
                  <el-option v-for="item in custOptions" :key="item.tenantId" :label="item.name" :value="item.tenantId"></el-option>
                </el-select>
              </div>
            </div>
            <div class="item">
              <div class="label">工时(人日)：</div>
              <div class="value">
                <el-input v-model="info.workHours" v-mydoubleval placeholder="请输入工时" @blur="updateRequirementInfoByField('workHours')" :disabled="baseDisable"></el-input>
              </div>
            </div>
            <div class="item">
              <div class="label">需求确认人：</div>
              <div class="value">
                <el-select v-model="info.confirmUserId" placeholder="请选择" filterable @change="updateRequirementInfoByField('confirmUserId')" :disabled="baseDisable">
                  <el-option v-for="item in orgUserData" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
                </el-select>
              </div>
            </div>
            <div class="item">
                <div class="label"><em>*</em>采纳状态：</div>
                <div class="value">
                    <el-select v-model="info.acceptState" placeholder="请选择" @change="updateRequirementInfoByField('acceptState')" :disabled="solveDisable">
                      <el-option v-for="item in acceptStateData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="item">
                <div class="label"><em>*</em>状态：</div>
                <div class="value">
                    <el-select v-model="info.state" placeholder="请选择"  @change="updateRequirementInfoByField('state')" :disabled="stateDisable">
                      <el-option v-for="item in stateData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                    </el-select>
                </div>
            </div>
          <div class="item">
            <div class="label">迭代：</div>
            <div class="value">
              <el-select v-model="info.iterationId" placeholder="请选择" @change="updateRequirementInfoByField('iterationId')" :disabled="solveDisable" filterable>
                <el-option v-for="item in iterationData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                <el-option v-if="!iterationData.some(subItem=> subItem.id === info.iterationId)&&info.iterationId" :label="info.iterationName" :value="info.iterationId" :key="info.iterationId"/>
              </el-select>
            </div>
          </div>
            <div class="item">
                <div class="label"><em>*</em>负责人：</div>
                <div class="value">
                    <el-select v-model="info.assignedToUserId" placeholder="请选择" @change="updateRequirementInfoByField('assignedToUserId')" :disabled="solveDisable">
                      <el-option v-for="item in assignedToUserData" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="item">
                <div class="label">计划开始时间：</div>
                <div class="value">
                    <el-date-picker v-model="info.planStartDate" type="date" placeholder="开始时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="updateRequirementInfoByField('planStartDate')" :disabled="solveDisable"></el-date-picker>
                </div>
            </div>
            <div class="item">
                <div class="label">计划完成时间：</div>
                <div class="value">
                    <el-date-picker v-model="info.planEndDate" type="date" placeholder="完成时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="updateRequirementInfoByField('planEndDate')" :disabled="solveDisable"></el-date-picker>
                </div>
            </div>
           <div class="item">
              <div class="label">实际开始时间：</div>
              <div class="value">
                <el-date-picker v-model="info.actualStartDate" type="date" placeholder="开始时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="updateRequirementInfoByField('actualStartDate')" :disabled="solveDisable"></el-date-picker>
              </div>
            </div>
            <div class="item">
              <div class="label">实际完成时间：</div>
              <div class="value">
                <el-date-picker v-model="info.actualEndDate" type="date" placeholder="完成时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="updateRequirementInfoByField('actualEndDate')" :disabled="solveDisable"></el-date-picker>
              </div>
            </div>
            <div class="item">
              <div class="label">需求附件：</div>
              <div class="value">
                <my-file-model-list ref="fileModelList" @successCallback="addRequirementFile($event,1)" @delFile="delRequirementFile($event,1)" :disabled="baseDisable"></my-file-model-list>
              </div>
            </div>
            <div class="item">
              <div class="label">解决方案附件：</div>
              <div class="value">
                <my-file-model-list ref="solveFileModelList" @successCallback="addRequirementFile($event,2)" @delFile="delRequirementFile($event,2)" :disabled="solveDisable"></my-file-model-list>
              </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import requirementDetail from './requirementDetail.js'
export default requirementDetail
</script>
<style lang="scss" scoped>
.requirementDetailPage{
    /deep/ .common-info{
        display: flex;
        .editView{
            flex: 1;
            min-width: 0;
            .title-input{
              margin-bottom: 20px;
            }
            .submitView{
                margin-top: 10px;
                line-height: 32px;
            }
            .title{
                font-size: 14px;
                font-weight: bold;
            }
            .content{
              p{
                word-break: break-all;
              }
              pre{
                word-wrap: break-word;
                white-space: normal;
                word-break: break-all;
              }
            }
            .task-info{
                .title{
                    margin-bottom: 10px;
                    line-height: 30px;
                }
            }
            .task-info2{
                border-top: 1px dashed $border-color;
                margin-top: 10px;
                padding-top: 10px;
            }
            .history{
                margin-top: 20px;
                .el-tabs__nav-wrap::after {
                  background-color:transparent;
                }
                .list{
                    margin-top: 20px;
                    position: relative;
                    &::after{
                        content: '';
                        position: absolute;
                        left: 15px;
                        top: 0;
                        border-left: $border;
                        height: calc(100% - 60px);
                        z-index: 3;
                    }
                    .item{
                        position: relative;
                        z-index: 9;
                        display: flex;
                        margin-bottom: 10px;
                        &:first-child{
                            .tag{
                                color: #fff;
                                background: $main-color;
                            }
                        }
                        .tag{
                            width: 30px;
                            background: #eee;
                            // color: #fff;
                            text-align: center;
                            height: 30px;
                            line-height: 30px;
                            border-radius: 50%;
                        }
                        .content{
                            flex: 1;
                            margin-left: 10px;
                            // &:hover{
                            //     background: #f9f9f9;
                            // }
                            .name{
                                color:#adadad;
                                font-size: 14px;
                                line-height: 30px;
                                font-weight: bold;
                                .date{
                                    font-size: 12px;
                                    margin-left: 10px;
                                }
                            }
                            .desc{
                                line-height: 40px;
                                color:#adadad;
                                font-size: 14px;
                            }
                        }
                    }
                }
            }
        }
      .categoryView{
        width: 350px;
        margin-left: 20px;
        //height: 500px;
        //position: sticky;
        //top: 10px;
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