<template>
    <div id="exceptionDetail">
      <div class="common-info">
        <h3 class="common-title"><span class="title-name">异常基础信息</span></h3>
        <ul class="content clearfix mt_20">
          <li class="item item50">
            <label class="label-term"><em>*</em>事发时间:</label>
            <div class="input-text">{{ info.incidentDate}}</div>
          </li>
          <li class="item item50">
            <label class="label-term"><em>*</em>发生地点/线路:</label>
            <div class="input-text">{{ info.incidentAddress}}</div>
          </li>
        </ul>
        <ul class="content clearfix">
          <li class="item item50">
            <label class="label-term"><em>*</em>事件经过:</label>
            <div class="input-text">
              <div class="areaView">{{info.incidentProcess}}</div>
            </div>
          </li>
            <li class="item item50">
                <label class="label-term">问题描述:</label>
                <div class="input-text">
                    <div class="areaView">{{info.problemDescribe}}</div>
                </div>
            </li>
          <li class="item item50">
            <label class="label-term">现场照片/视频:</label>
            <div class="input-text">
              <myFileModel v-for="(item,index) in info.files" :ref="'imgCover'+index" :componentId="index" :disabled-del="true" :disabled-edit="true" supportFiles="mp4,img"></myFileModel>
            </div>
          </li>
        </ul>
        <ul class="content clearfix">
          <li class="item item50">
            <label class="label-term">现场应急处理措施:</label>
            <div class="input-text">
              <div class="areaView">{{info.emergencyTreatment}}</div>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">请求协助内容:</label>
            <div class="input-text">
              <div class="areaView">{{info.assistContent}}</div>
            </div>
          </li>
        </ul>

        <ul class="content clearfix">
          <li class="item item50">
            <label class="label-term">产生后果：</label>
            <div class="input-text">{{info.party}}</div>
          </li>
            <li class="item item50">
                <label class="label-term">当事人：</label>
                <div class="input-text">{{info.discoverer}}</div>
            </li>
          <li class="item item50">
            <label class="label-term">提报部门:</label>
            <div class="input-text">{{ info.orgName }}</div>
          </li>
          <li class="item item50">
            <label class="label-term">提报人:</label>
            <div class="input-text">{{ info.createUserName }}</div>
          </li>
          <li class="item item50">
            <label class="label-term">提报时间:</label>
            <div class="input-text">{{ info.createDate }}</div>
          </li>
            <li class="item item50">
                <label class="label-term"><em>*</em>现场是否向保险公司报案:</label>
                <div class="input-text">
                    <el-radio-group v-model="info.whetherReport" disabled>
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </div>
            </li>
            <li class="item item50" >
                <label class="label-term">保险种类:</label>
                <div class="input-text">
                    {{ info.insureClass }}
                </div>
            </li>
            <li class="item item50" >
                <label class="label-term">报案号:</label>
                <div class="input-text">
                    {{ info.reportNum }}
                </div>
            </li>
        </ul>

        <h3 class="common-title"><span class="title-name">异常评定信息</span></h3>
        <ul class="content clearfix mt_20">
          <li class="item item50">
            <label class="label-term">异常事件编号:</label>
            <div class="input-text">{{ info.exceptionNum }}</div>
          </li>
          <li class="item item50">
            <label class="label-term"><em>*</em>处理状态:</label>
            <div class="input-text">{{info.stateName}}</div>
          </li>
          <li class="item item50">
            <label class="label-term"><em>*</em>异常类型:
              <el-tooltip class="item" effect="light" placement="top-start">
                  <div slot="content">
                      A 类：客户原因造成的运输车辆或货物出现异常。<br>
                      B 类：易迁易自身操作和供应商问题或资源异常，可能或已经造成一定损失的异常。<br>
                      C 类：易迁易自身操作，被客户或最终客户投诉或索赔。<br>
                      D 类：发生人员、财产、火灾等安全生产事故或自然灾害、群体性等重大异常事件。
                  </div>
                  <i class="el-icon-question pointer red"></i>
              </el-tooltip>
            </label>
            <div class="input-text">{{info.typeName}}</div>
          </li>
          <li class="item item50">
            <label class="label-term"><em>*</em>责任单位:</label>
            <div class="input-text">{{info.responsibleCompany}}</div>
          </li>
          <li class="item item50">
            <label class="label-term">责任人:</label>
            <div class="input-text">{{info.responsiblePeople}}</div>
          </li>
          <li class="item item50">
            <label class="label-term">对象客户:</label>
            <div class="input-text">{{info.custName}}</div>
          </li>
          <li class="item item50">
            <label class="label-term"><em>*</em>有无人员伤害:</label>
            <div class="input-text">{{info.peopleInjuryStsName}}</div>
          </li>
          <li class="item item50">
            <label class="label-term">人员伤害情况:</label>
            <div class="input-text">{{info.peopleInjuryStr}}</div>
          </li>
          <li class="item item50">
            <label class="label-term">预估损失金额（元）:</label>
            <div class="input-text red"> {{info.lossFee}}</div>
          </li>
          <li class="item item50">
            <label class="label-term">实际损失金额（元）:</label>
            <div class="input-text red"> {{info.actualLossFee}}</div>
          </li>
          <li class="item item50">
            <label class="label-term"><em>*</em>处理结果:</label>
            <div class="input-text">{{info.result}}</div>
          </li>
          <li class="item item50">
            <label class="label-term">附件:</label>
            <div class="input-text">
              <myFileModel ref="file" :disabled-del="true" :disabled-edit="true" ></myFileModel>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term"><em>*</em>是否纳入月考核评定:</label>
            <div class="input-text">{{info.isExamineName}}</div>
          </li>
        </ul>

        <!-- 审核页面的步骤条 -->
        <h3 class="common-title" v-show="info.state>=2"><span class="title-name">审核信息</span></h3>
        <el-steps :active="info.active" v-show="info.state>=2" align-center finish-status="success" :process-status="info.processStatus" style="width:600px;margin:20px auto 0">
          <el-step v-for="item in info.userList" :title="item.userName" :description="item.verifyDate"></el-step>
        </el-steps>
        <div class="bot-btn">
          <el-button @click="closePage" v-if="type==1">关闭</el-button>
          <el-button v-show="type == 2" type="primary" @click="verify(1)">审核通过</el-button>
          <el-button v-show="type == 2" @click="verify(2)">审核不通过</el-button>
        </div>
      </div>
    </div>
  </template>
    
    <script>
    import exceptionDetail from './exceptionDetail.js'
    export default exceptionDetail
  </script>
<style lang="scss" scoped>
  #exceptionDetail {
    height: auto!important;;
    /deep/ .common-info{
      height: 100%;
      padding: 30px 20px;
      box-sizing: border-box;
      .content{
        .el-textarea__inner{
          width: 100%;
        }
        &>.item{
          .label-term{
            width: 130px;
          }
          .input-text{
            width: calc(100% - 140px);
            .areaView{
              padding:10px 0;
              line-height: 20px;
            }
          }
        }
        .myFileModel{
          float: left;
          margin-right: 10px;
          .avatar-uploader{
            .el-upload{
              width: 115px;
              height: 80px;
            }
            .avatar-uploader-icon{
              width: 115px;
              height: 80px;
              line-height: 80px;
            }
          } 
        } 
      }
    }
    
  }
</style>