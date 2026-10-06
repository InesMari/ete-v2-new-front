<template>
  <div id="saveInsuranceInfo">
    <div class="common-info" style="padding-top: 10px;">
      <h3 class="common-title mb_10">
        <span class="title-name">基本信息</span>
        <span class="fr" style="width: 92%;text-align: right;" v-if="type=='3'||type=='4'">保险费用编号:{{info.insuranceNum}}</span>
      </h3>
      <ul class="content clearfix">
        <li class="item item33">
          <label class="label-term"><em>*</em>保险合同编号:</label>
          <div class="input-text">
            <el-select v-model="info.contractId" filterable clearable @change="changeContract" :disabled="disabled">
              <el-option v-for="item in contractData" :key="item.contractId" :label="item.contractNum" :value="item.contractId">
                <span style="float: left">{{ item.contractNum }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.tenantName }}</span>
              </el-option>
            </el-select>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term">险种:</label>
          <div class="input-text">{{info.contractContentName}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">保险公司:</label>
          <div class="input-text">{{info.tenantName}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">合同开始日期:</label>
          <div class="input-text">{{info.beginDate}}</div>
        </li>
        <li class="item item50">
          <label class="label-term">合同结束日期:</label>
          <div class="input-text">{{info.endDate}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">计费起始月份:</label>
          <div class="input-text">
            <el-date-picker v-model="info.billingStartDate" type="month" class="tl" placeholder="请选择计费起始月份" format="yyyy-MM"
                            value-format="yyyy-MM" :disabled="disabled" @input="calBillingMonths"></el-date-picker>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term">计费结束月份:</label>
          <div class="input-text">
            <el-date-picker v-model="info.billingEndDate" type="month" class="tl" placeholder="请选择计费结束月份" format="yyyy-MM"
                            value-format="yyyy-MM" :disabled="disabled" @input="calBillingMonths"></el-date-picker>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term">计费期数:</label>
          <div class="input-text">{{info.billingMonths}}</div>
        </li>
        <li class="item item98">
          <label class="label-term">保险基本条款:</label>
          <div class="input-text">
            <el-input type="textarea" v-model="info.insuranceRemark" style="width: 100%" maxlength="100" placeholder="如保险内容、免赔额等备注内容（100字以内）" :disabled="disabled" @input="forceUpdate"></el-input>
          </div>
        </li>
      </ul>
      <div class="state" v-if="type==3" :class="'state'+info.verifyState"><div class="text">{{ info.verifyState==0?"未审核":info.verifyState==1?"审核通过":"审核不通过" }}</div></div>
      <h3 class="common-title mb_10"><span class="title-name">保险费用清单列表</span></h3>
      <div style="overflow-x:auto;">
        <table ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
        <thead>
        <tr>
          <th width="60">序号</th>
          <th width="180">被保险部门</th>
          <th width="250">地址</th>
          <th width="250">保险标的</th>
          <th width="200">结算主体</th>
          <th width="120">保险额度</th>
          <th width="120">保险费（含税）</th>
          <th width="100">税率</th>
          <th width="120">保险费（未税）</th>
          <th width="100">税额</th>
          <th width="120">月保险费用（含税）</th>
          <th width="120">月保险费用（未税）</th>
          <th width="100">
            <el-tooltip effect="dark" content="添加" placement="top-start" :hide-after='1000'>
              <span @click="addFee" class="add" v-if="!disabled"></span>
            </el-tooltip>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,idx) in info.feeDetails" :key="idx">
          <td width="60">{{idx+1}}</td>
          <td width="180">
            <el-select v-model="item.insuranceOrgId" :disabled="disabled" @change="changeOrg(item)"
                       filterable clearable placeholder="请选择部门">
              <el-option v-for="item in orgData" :key="item.id" :label="item.orgName"
                         :value="item.id">
              </el-option>
            </el-select>
          </td>
          <td width="250"><el-input v-model="item.insuranceAddress" :disabled="disabled" placeholder="请填写地址" @input="forceUpdate"></el-input></td>
          <td width="250"><el-input v-model="item.insuranceSubject" :disabled="disabled" placeholder="请填写保险标的" @input="forceUpdate"></el-input></td>
          <td width="200">
            <el-select v-model="item.settleBody" :disabled="disabled" @change="forceUpdate"
                       filterable clearable placeholder="请选择结算主体">
              <el-option v-for="item in settleBodyData" :key="item.codeValue" :label="item.codeName"
                         :value="item.codeValue">
              </el-option>
            </el-select>
          </td>
          <td width="120"><el-input v-model="item.insuranceLimit" :disabled="disabled" @input="forceUpdate" placeholder="请填写保险额度"></el-input></td>
          <td width="120"><el-input v-model="item.totalFeeWithTax" @input="calFee(item)"  :disabled="disabled" placeholder="请填写保险费（含税）"></el-input></td>
          <td width="100"><el-input v-model="item.taxRate" @input="calFee(item)" :disabled="disabled" placeholder="请填写税率"></el-input></td>
          <td width="120">{{item.totalFee}}</td>
          <td width="100">{{item.totalTax}}</td>
          <td width="120">{{item.monthFeeWithTax}}</td>
          <td width="120">{{item.monthFee}}</td>
          <td width="100">
            <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000'>
              <span @click="delFee(idx)" class="del" v-if="!disabled"></span>
            </el-tooltip>
          </td>
        </tr>
        </tbody>
        <tfoot>
          <tr>
            <td class="fw red">合计</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>{{totalInfo.totalFeeWithTax}}</td>
            <td>{{totalInfo.taxRate}}</td>
            <td>{{totalInfo.totalFee}}</td>
            <td>{{totalInfo.totalTax}}</td>
            <td>{{totalInfo.monthFeeWithTax}}</td>
            <td>{{totalInfo.monthFee}}</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      </div>

      <div class="page-bot-btn ">
        <el-button size="mini" @click="close">关闭</el-button>
        <el-button type="primary" v-show="!disabled" size="mini" @click="saveInsuranceInfo">提交</el-button>
        <el-button type="primary" v-show="type==4" size="mini" @click="verify">审核</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import saveInsuranceInfo from './saveInsuranceInfo.js'

export default saveInsuranceInfo
</script>
<style lang="scss" scoped>
#saveInsuranceInfo{

  .item33 {
    width: 31.3% !important;
    margin-right: 2% !important;
  }
  
  .item98 {
    width: 98% !important;
  }
  
  /deep/ .common-info{
    position:relative;
    .mb_10{
      margin-bottom: 10px;
    }
    .content{
      .el-textarea__inner{
        width: 100%;
        font-size: 12px;
      }
    }
    .add{
      vertical-align: middle;
      @include add;
    }
    .del{
      vertical-align: middle;
      @include del;
    }
    .state{
      position: absolute;
      top: 88px;
      right: 40px;
      border:3px solid red;
      padding:2px 5px;
      transform: rotate(30deg);
      .text{
          border:1px solid red;
          width: 100px;
          line-height: 40px;
          font-size: 18px;
          color: red;
          text-align: center;
        }
      &.state0{
        border-color: green;
        .text{
          border-color: green;
          color: green;
        }
      }
      &.state1{
        border-color: deepskyblue;
        .text{
          border-color: deepskyblue;
          color: deepskyblue;
        }
      }
      &.state2{
        border-color: red;
        .text{
          border-color: red;
          color: red;
        }
      }
    }
  }
  
  .common-title{
    display: flex;
    align-items: center;
    .title-name::before{
      top:9px
    }
    .feeTime{
      display: flex;
      align-items: center;
      .label{
        margin-left: 20px;
      }
    }
  }

  .tableCommon{
    table-layout: initial;
    border-left: $border;
    border-right: $border;
    tbody{
      tr.disabled{
        td{
          color: #999!important;
        }
      }
    }
  }

}
</style>
