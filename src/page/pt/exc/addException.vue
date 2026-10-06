<template>
    <div id="addException">
      <div class="common-info">
        <h3 class="common-title"><span class="title-name">异常基础信息</span></h3>
        <ul class="content clearfix mt_20">
          <li class="item item50">
            <label class="label-term"><em>*</em>事发时间:</label>
            <div class="input-text">
              <my-el-date-picker @input="forceUpdate" v-model="info.incidentDate" type="datetime"
                                 placeholder="选择日期时间" align="right"
                                 format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm">
              </my-el-date-picker>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term"><em>*</em>发生地点/线路:</label>
            <div class="input-text">
              <el-input v-model="info.incidentAddress" @input="forceUpdate"  type="text" maxlength="200" placeholder="请输入发生地点/线路"></el-input>
            </div>
          </li>
        </ul>
        <ul class="content clearfix">
          <li class="item item50">
            <label class="label-term"><em>*</em>事件经过:</label>
            <div class="input-text">
                <el-input v-model="info.incidentProcess" @input="forceUpdate" :autosize="{minRows:5}" type="textarea" maxlength="2000" placeholder="请输入详细的事件经过"></el-input>
            </div>
          </li>
            <li class="item item50">
                <label class="label-term">问题描述:</label>
                <div class="input-text">
                    <el-input v-model="info.problemDescribe" @input="forceUpdate" :autosize="{minRows:5}" type="textarea" maxlength="2000" placeholder="请输入问题描述"></el-input>
                </div>
            </li>
          <li class="item item50">
            <label class="label-term">现场照片/视频:</label>
            <div class="input-text">
              <div class="clearfix">
                <myFileModel v-for="(item,index) in info.files" :ref="'imgCover'+index" :componentId="index" @successCallback="successCallback" supportFiles="mp4,img"></myFileModel>
              </div>
              <div class="red">只能上传jpg/png/mp4文件，且不超过20MB</div>
            </div>
          </li>
        </ul>
        <ul class="content clearfix">
          <li class="item item50">
            <label class="label-term">现场应急处理措施:</label>
            <div class="input-text">
                <el-input v-model="info.emergencyTreatment" @input="forceUpdate" :autosize="{minRows:5}"  type="textarea" maxlength="2000" placeholder="请输入现场应急处理措施"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">请求协助内容:</label>
            <div class="input-text">
                <el-input v-model="info.assistContent" @input="forceUpdate" :autosize="{minRows:5}"  type="textarea" maxlength="2000" placeholder="请输入请求协助内容"></el-input>
            </div>
          </li>
        </ul>

          <ul class="content clearfix">
              <li class="item" style="width: 31%;">
                  <label class="label-term">产生后果：</label>
                  <div class="input-text">
                      <el-input v-model="info.party"  @input="forceUpdate" placeholder="请输入"></el-input>
                  </div>
              </li>
              <li class="item" style="width: 31%;">
                  <label class="label-term">当事人：</label>
                  <div class="input-text">
                      <el-input v-model="info.discoverer"  @input="forceUpdate" placeholder="请输入"></el-input>
                  </div>
              </li>
              <li class="item" style="width: 31%;">
                  <label class="label-term">提报部门:</label>
                  <div class="input-text">{{ info.orgName }}</div>
              </li>
              <li class="item"  style="width: 31%;">
                  <label class="label-term">提报人:</label>
                  <div class="input-text">{{ info.createUserName }}</div>
              </li>
          </ul>
          <ul class="content clearfix">
              <li class="item" style="width: 31%;">
                  <label class="label-term"><em>*</em>现场是否向保险公司报案:</label>
                  <div class="input-text">
                      <el-radio-group v-model="info.whetherReport">
                          <el-radio :label="1">是</el-radio>
                          <el-radio :label="0">否</el-radio>
                      </el-radio-group>
                  </div>
              </li>
              <li class="item" style="width: 31%;">
                  <label class="label-term"><em v-show="info.whetherReport == 1">*</em>保险种类:</label>
                  <div class="input-text">
                      <el-input v-model="info.insureClass" @input="forceUpdate"  placeholder="请输入"></el-input>
                  </div>
              </li>
              <li class="item" style="width: 31%;">
                  <label class="label-term"><em v-show="info.whetherReport == 1">*</em>报案号:</label>
                  <div class="input-text">
                      <el-input v-model="info.reportNum" @input="forceUpdate" placeholder="请输入"></el-input>
                  </div>
              </li>
          </ul>


        <h3 class="common-title"><span class="title-name">异常评定信息:</span></h3>
        <ul class="content clearfix mt_20">
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
                <el-select v-model="info.type" @input="forceUpdate" placeholder="请选择" filterable clearable >
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
                  <el-input v-model="info.responsiblePeople" @input="forceUpdate"  placeholder="请输入"></el-input>
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
                  <el-input v-model="info.peopleInjuryStr" @input="forceUpdate"  placeholder="请输入"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">预估损失金额（元）:</label>
            <div class="input-text">
                  <el-input v-model="info.lossFee" @input="forceUpdate" placeholder="请输入"></el-input>
            </div>
          </li>
        </ul>
        <div class="bot-btn">
          <el-button @click="closePage">关闭</el-button>
          <el-button type="primary" @click="save">提交</el-button>
        </div>
      </div>
    </div>
  </template>
    
    <script>
    import addException from './addException.js'
    export default addException
  </script>
    <style lang="scss" scoped>
  #addException {
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