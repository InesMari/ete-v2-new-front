<template>
  <div id="bugDetail" class="bugDetailPage">
    <div class="common-info">
        <div class="editView">
            <el-input class="title-input" v-model="info.title" placeholder="请输入标题" @change="updateBugInfoByField('title')" :disabled="baseDisable" ></el-input>
            <div class="task-info">
              <my-wang-editor :title="contentTitle" ref="wangEditor" :content="info.contentDesc" @submit="contentSubmit" :disabled="baseDisable"></my-wang-editor>
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
                <el-tab-pane label="子缺陷" name="2">
                  <div class="table-content" style="border: none;margin-top: -10px;">
                    <div class="table-title">
                      <div class="table-title-btn" style="margin-right: 90px;">
                        <el-button type="primary" plain size="mini" @click="add()" v-entity="1007098" v-if="info.state<6">新增子缺陷</el-button>
                      </div>
                    </div>
                    <tableCommon tableName="subBugManageTable" ref="table" :showNum="true" :showSetTable="true" :head="head" :showSelect="false"  @dblclickItem="dblclickItem">
                      <template v-slot="{item,code}">
                        <div v-if="code=='stateName'">
                          <div v-if="stateDisable||item.disabled" style="color: #999!important;">{{item.stateName}}</div>
                          <el-select v-model="item.state" placeholder="请选择" @change="updateSubBugInfoByField(item,'state')" v-else>
                            <el-option v-for="item in stateData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                          </el-select>
                        </div>
                        <div v-if="'relTaskNum'==code">
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
              <div class="label">任务编号：</div>
              <div class="value">{{info.taskNum}}</div>
            </div>
          <div class="item">
            <div class="label">迭代：</div>
            <div class="value">
              <el-select v-model="info.iterationId" placeholder="请选择" @change="updateBugInfoByField('iterationId')" filterable :disabled="baseDisable">
                <el-option v-for="item in iterationData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                <el-option v-if="!iterationData.some(iterationData=> iterationData.id === info.iterationId)&&info.iterationId" :label="info.iterationName" :value="info.iterationId" :key="info.iterationId"/>
              </el-select>
            </div>
          </div>
          <div class="item">
            <div class="label">关联任务：</div>
            <div class="value">
              <el-select v-model="info.relId" placeholder="请选择" @change="updateBugInfoByField('relId')" filterable clearable :disabled="baseDisable">
                <el-option v-for="item in taskData" :key="item.id" :label="item.title" :value="item.id"></el-option>
                <el-option v-if="!taskData.some(subItem=> subItem.id === info.relId)&&info.relId" :label="info.relTaskTitle" :value="info.relId" :key="info.relId"/>
              </el-select>
            </div>
          </div>
          <div class="item">
            <div class="label">父缺陷：</div>
            <div class="value">
              <el-select v-model="info.parentId" placeholder="请选择" @change="updateBugInfoByField('parentId')" filterable :disabled="baseDisable" clearable>
                <el-option v-for="item in bugData" :key="item.id" :label="item.title" :value="item.id"></el-option>
                <el-option v-if="!bugData.some(subItem=> subItem.id === info.parentId)&&info.parentId" :label="info.parentBugTitle" :value="info.parentId" :key="info.parentId"/>
              </el-select>
            </div>
          </div>
          <div class="item">
            <div class="label"><em>*</em>优先级：</div>
            <div class="value">
              <el-select v-model="info.priority" placeholder="请选择" @change="updateBugInfoByField('priority')" :disabled="baseDisable">
                <el-option v-for="item in priorityData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
              </el-select>
            </div>
          </div>
          <div class="item">
            <div class="label"><em>*</em>严重程度：</div>
            <div class="value">
              <el-select v-model="info.severity" placeholder="请选择"  @change="updateBugInfoByField('priority')" :disabled="baseDisable">
                <el-option v-for="item in severityData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
              </el-select>
            </div>
          </div>
          <div class="item">
            <div class="label"><em>*</em>负责人：</div>
            <div class="value">
              <el-select v-model="info.assignedToUserId" placeholder="请选择" @change="updateBugInfoByField('assignedToUserId')" :disabled="baseDisable">
                <el-option v-for="item in userData" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
              </el-select>
            </div>
          </div>
          <div class="item">
            <div class="label"><em>*</em>验证人：</div>
            <div class="value">
              <el-select v-model="info.testUserId" placeholder="请选择" @change="updateBugInfoByField('testUserId')" :disabled="baseDisable">
                <el-option v-for="item in userData" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
              </el-select>
            </div>
          </div>
          <div class="item">
            <div class="label"><em>*</em>状态：</div>
            <div class="value">
              <el-select v-model="info.state" placeholder="请选择"  @change="updateBugInfoByField('state')" :disabled="stateDisable">
                <el-option v-for="item in stateData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
              </el-select>
            </div>
          </div>
          <div class="item" v-if="info.state==2">
            <div class="label"><em>*</em>不修复理由：</div>
            <div class="value">
              <el-input v-model="info.refuseDesc" placeholder="请输入不修复理由" @change="updateBugInfoByField('refuseDesc')" :disabled="baseDisable" ></el-input>
            </div>
          </div>
            <div class="item">
                <div class="label">计划开始时间：</div>
                <div class="value">
                    <el-date-picker v-model="info.planStartDate" type="date" placeholder="开始时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="updateBugInfoByField('planStartDate')" :disabled="baseDisable"></el-date-picker>
                </div>
            </div>
            <div class="item">
                <div class="label">计划完成时间：</div>
                <div class="value">
                    <el-date-picker v-model="info.planEndDate" type="date" placeholder="完成时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="updateBugInfoByField('planEndDate')" :disabled="baseDisable"></el-date-picker>
                </div>
            </div>
           <div class="item">
              <div class="label">实际开始时间：</div>
              <div class="value">
                <el-date-picker v-model="info.actualStartDate" type="date" placeholder="开始时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="updateBugInfoByField('actualStartDate')" :disabled="baseDisable"></el-date-picker>
              </div>
            </div>
            <div class="item">
              <div class="label">实际完成时间：</div>
              <div class="value">
                <el-date-picker v-model="info.actualEndDate" type="date" placeholder="完成时间" format="yyyy-MM-dd" value-format="yyyy-MM-dd" @change="updateBugInfoByField('actualEndDate')" :disabled="baseDisable"></el-date-picker>
              </div>
            </div>
            <div class="item">
              <div class="label">需求附件：</div>
              <div class="value">
                <my-file-model-list ref="fileModelList" @successCallback="addBugFile" @delFile="delBugFile" :disabled="baseDisable"></my-file-model-list>
              </div>
            </div>

        </div>
    </div>
  </div>
</template>

<script>
import bugDetail from './bugDetail.js'
export default bugDetail
</script>
<style lang="scss" scoped>
.bugDetailPage{
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