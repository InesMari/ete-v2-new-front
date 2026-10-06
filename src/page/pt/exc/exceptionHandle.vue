<template>
    <div id="exceptionHandle">
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
        </ul>
        <h3 class="common-title"><span class="title-name">异常评定信息</span></h3>
        <ul class="content clearfix mt_20">
          <li class="item item100">
            <label class="label-term">异常事件编号:</label>
            <div class="input-text">{{ info.exceptionNum }}</div>
          </li>
<!--          <li class="item item50">-->
<!--            <label class="label-term"><em>*</em>处理状态:</label>-->
<!--            <div class="input-text">-->
<!--                <el-select v-model="info.state" @input="forceUpdate" placeholder="请选择" filterable clearable >-->
<!--                  <el-option v-for="item in stateData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>-->
<!--                </el-select>-->
<!--            </div>-->
<!--          </li>-->
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
            <div class="input-text">
                <el-select v-model="info.type" @input="forceUpdate"  placeholder="请选择" filterable clearable >
                  <el-option v-for="item in typeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                </el-select>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term"><em>*</em>责任单位:</label>
            <div class="input-text">
                  <el-input v-model="info.responsibleCompany" @input="forceUpdate"  placeholder="请输入"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">责任人:</label>
            <div class="input-text">
                  <el-input v-model="info.responsiblePeople"  placeholder="请输入"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">对象客户:</label>
            <div class="input-text">
              <el-select v-model="info.relCustTenantId" @input="forceUpdate" placeholder="请选择" filterable clearable >
                <el-option v-for="item in custData" :key="item.tenantId" :label="item.name" :value="item.tenantId"></el-option>
              </el-select>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term"><em>*</em>有无人员伤害:</label>
            <div class="input-text">
              <el-radio-group v-model="info.peopleInjurySts">
                <el-radio :label="1">有</el-radio>
                <el-radio :label="0">无</el-radio>
              </el-radio-group>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">人员伤害情况:</label>
            <div class="input-text">
                  <el-input v-model="info.peopleInjuryStr"  @input="forceUpdate" placeholder="请输入"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">预估损失金额（元）:</label>
            <div class="input-text">
                  <el-input class="red" v-model="info.lossFee" @input="forceUpdate" placeholder="请输入"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">实际损失金额（元）:</label>
            <div class="input-text">
              <el-input class="red" v-model="info.actualLossFee" v-mypmdoubleval @input="forceUpdate" placeholder="请输入"></el-input>
            </div>
          </li>
          <li class="item item100">
            <label class="label-term"><em>*</em>处理结果:</label>
            <div class="input-text">
                <el-input v-model="info.result" @input="forceUpdate" type="textarea" maxlength="200" placeholder="请输入异常最后的处理结果"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">附件:</label>
            <div class="input-text">
              <myFileModel ref="file" @successCallback="successCallback"></myFileModel>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term"><em>*</em>是否纳入月考核评定:</label>
            <div class="input-text">
              <el-radio-group v-model="info.isExamine">
                <el-radio :label="1">是</el-radio>
                <el-radio :label="0">否</el-radio>
              </el-radio-group>
            </div>
          </li>
        </ul>

<!--        &lt;!&ndash; 审核页面的步骤条 &ndash;&gt;-->
<!--        <h3 class="common-title"><span class="title-name">审核信息</span></h3>        -->
<!--        <el-steps :active="info.active" align-center finish-status="success" :process-status="info.processStatus" style="width:600px;margin:20px auto 0">-->
<!--          <el-step v-for="item in info.userList" :title="item.userName" :description="item.reviewDate"></el-step>-->
<!--        </el-steps>-->
        <div class="bot-btn">
          <el-button @click="closePage">关闭</el-button>
          <el-button type="primary" @click="save">处理完成</el-button>
        </div>
      </div>
    </div>
  </template>
    
    <script>
    import exceptionHandle from './exceptionHandle.js'
    export default exceptionHandle
  </script>
<style lang="scss" scoped>
  #exceptionHandle {
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