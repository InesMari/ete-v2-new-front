<template>
  <div id="saveStorehouseFee">
    <!-- 新增 仓库 -->
    <div class="common-info">
      <h3 class="common-title mb_20"><span class="title-name">基本信息</span></h3>
      <ul class="content clearfix">
        <li class="item">
          <label class="label-term"><em>*</em>物流中心</label>
          <div class="input-text">
            <el-select v-model="info.workId" filterable clearable :disabled="disabled||type==2" @change="changeWork">
              <el-option v-for="item in workData" :key="item.workId" :label="item.workName"
                         :value="item.workId"></el-option>
            </el-select>
          </div>
        </li>
        <li class="item">
          <label class="label-term"><em>*</em>费用类型</label>
          <div class="input-text">
            <el-select v-model="info.feeType" filterable :disabled="disabled" @change="forceUpdate">
              <el-option v-for="item in feeTypeData" :key="item.codeValue" :label="item.codeName"
                         :value="item.codeValue"></el-option>
            </el-select>
          </div>
        </li>
        <li class="item">
          <label class="label-term"><em>*</em>合同编号</label>
          <div class="input-text" :class="disabled?'link':''">
            <el-select v-model="info.contractId" filterable clearable :disabled="disabled"
                       @change="changeContract">
              <el-option v-for="item in contractData" :key="item.id" :label="item.contractNum"
                         :value="item.id">
                <span style="float: left">{{ item.contractNum }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.tenantName }}</span>
              </el-option>
            </el-select>
            <div v-if="disabled" class="linkView" @click="open"></div>
          </div>
        </li>
        <li class="item">
          <label class="label-term"><em>*</em>供应商</label>
          <div class="input-text">
            <el-select v-model="info.supplierTenantId" filterable clearable :disabled="true" @change="forceUpdate">
              <el-option v-for="item in allSupplierData" :key="item.tenantId" :label="item.supplierName"
                         :value="item.tenantId"></el-option>
            </el-select>
          </div>
        </li>
        <li class="item ">
          <label class="label-term"><em>*</em>租赁面积(㎡)</label>
          <div class="input-text">
            <el-input v-model="info.storehouseArea" v-mydiyval="3" maxlength="50" placeholder="请输入租赁面积"
                      @input="calFee" :disabled="disabled"></el-input>
          </div>
        </li>
        <li class="item ">
          <label class="label-term">合同开始日期</label>
          <div class="input-text">
            <el-input v-model="info.leaseStartDate" placeholder="租赁开始日期" :disabled="true"></el-input>
          </div>
        </li>
        <li class="item ">
          <label class="label-term">合同结束日期</label>
          <div class="input-text">
            <el-input v-model="info.leaseEndDate" placeholder="租赁结束日期" :disabled="true"></el-input>
          </div>
        </li>
        <li class="item ">
          <label class="label-term">合同期限</label>
          <div class="input-text">
            <el-input v-model="info.leaseMonth" placeholder="租赁结束日期" :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term"><em>*</em>未税单价</label>
          <div class="input-text">
            <el-input v-model="info.leaseFeePriceNoTax" v-mydiyval="6" maxlength="50" placeholder="请输入未税单价" :disabled="disabled" @input="calFee"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term"><em>*</em>租金税率(%)</label>
          <div class="input-text">
            <el-input v-model="info.leaseFeeTaxRate" v-mydoubleval maxlength="50" placeholder="请输入租金税率" :disabled="disabled" @input="forceUpdate"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term"><em>*</em>含税单价</label>
          <div class="input-text">
            <el-input v-model="info.leaseFeePrice" v-mydiyval="6" maxlength="50" placeholder="请输入含税单价" :disabled="disabled" @input="calFee"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term"><em>*</em>支付周期</label>
          <div class="input-text">
            <el-select v-model="info.payCycle" filterable :disabled="disabled" @change="forceUpdate">
              <el-option v-for="item in payCycleData" :key="item.codeValue" :label="item.codeName"
                         :value="item.codeValue"></el-option>
            </el-select>
          </div>
        </li>
        <li class="item">
          <label class="label-term">未税管理费单价</label>
          <div class="input-text">
            <el-input v-model="info.manageFeePriceNoTax" v-mydouble5val maxlength="50" placeholder="请输入未税管理费单价" :disabled="disabled" @input="calFee"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">管理费税率(%)</label>
          <div class="input-text">
            <el-input v-model="info.manageFeeTaxRate" v-mydoubleval maxlength="50" placeholder="请输入管理费税率" :disabled="disabled" @input="forceUpdate"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">管理费含税单价</label>
          <div class="input-text">
            <el-input v-model="info.manageFeePrice" v-mydouble5val maxlength="50" placeholder="请输入管理费含税单价" :disabled="disabled" @input="calFee"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term"><em>*</em>计费方式</label>
          <div class="input-text">
            <el-select v-model="info.billingMethod" filterable :disabled="disabled" @change="changeBillingMethod" @input="forceUpdate">
              <el-option v-for="item in billingMethodData" :key="item.codeValue" :label="item.codeName"
                         :value="item.codeValue"></el-option>
            </el-select>
          </div>
        </li>
        <li class="item">
          <label class="label-term">未税其他杂费</label>
          <div class="input-text">
            <el-input v-model="info.otherFeeNoTax" v-mydoubleval maxlength="50" placeholder="请输入未税其他杂费" :disabled="disabled" @input="calFee"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">杂费税率(%)</label>
          <div class="input-text">
            <el-input v-model="info.otherFeeTaxRate" v-mydoubleval maxlength="50" placeholder="请输入其他杂费" :disabled="disabled" @input="forceUpdate"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">含税其他杂费</label>
          <div class="input-text">
            <el-input v-model="info.otherFee" v-mydoubleval maxlength="50" placeholder="请输入含税其他杂费" :disabled="disabled" @input="calFee"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">押金(保证金)</label>
          <div class="input-text">
            <el-input v-model="info.deposit" v-mydoubleval maxlength="50" placeholder="请输入押金(保证金)" :disabled="disabled" @input="forceUpdate"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">未税月费用</label>
          <div class="input-text">
            <el-input v-model="info.totalFeeNoTax" v-mydoubleval maxlength="50" :disabled="disabled||totalFeeDisabled" @input="calFeeList"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">含税月费用</label>
          <div class="input-text">
            <el-input v-model="info.totalFee" v-mydoubleval maxlength="50" :disabled="disabled||totalFeeDisabled" @input="calFeeList"></el-input>
          </div>
        </li>
        <li class="item item50">
          <label class="label-term">备注</label>
          <div class="input-text">
            <el-input v-model="info.remark" maxlength="200" placeholder="请输入备注" :disabled="disabled" @input="forceUpdate"></el-input>
          </div>
        </li>
      </ul>
      <div class="state" v-if="info.verifyState!=undefined&&info.verifyState!=0&&type==3" :class="info.verifyState==1?'state1':'state0'"><div class="text">{{ info.verifyState==1?"审核通过":"审核不通过" }}</div></div>
      <h3 class="common-title">
        <span class="title-name">月度费用</span>
        <div class="feeTime">
          <label class="label">计费周期：</label>
          <el-date-picker v-model="info.billingDate" type="daterange" range-separator="至" start-placeholder="开始日期" :disabled="disabled"
                            end-placeholder="结束日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd" unlink-panels @change="calFeeList" @blur="calFeeList"></el-date-picker>
        </div>
      </h3>

      <table ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
        <thead>
        <tr>
          <th width="60">序号</th>
          <th width="120">计费期</th>
          <th width="120">计费起始日</th>
          <th width="120">计费截止日</th>
          <th width="80">租赁天数</th>
          <th width="80">月天数</th>
          <th width="120">未税月费用</th>
          <th width="120">含税月费用</th>
<!--          <th width="120" v-if="type!=1">水费</th>-->
<!--          <th width="120" v-if="type!=1">电费</th>-->
          <th width="120" v-if="type!=1">异动费</th>
          <th width="120" v-if="type!=1">合计</th>
          <th width="120" v-if="type!=1">已付</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,idx) in info.details" :key="idx" :class="item.modifyDisabled==1?'disabled':''">
          <td width="60">{{idx+1}}</td>
          <td width="120">{{item.billMonth}}</td>
          <td width="120">{{item.billingStartDate}}</td>
          <td width="120">{{item.billingEndDate}}</td>
          <td width="80">{{item.leaseDays}}</td>
          <td width="80">{{item.billMonthDays}}</td>
          <td width="120">{{item.totalFeeNoTax}}</td>
          <td width="120">{{item.totalFee}}</td>
<!--          <td width="120" v-if="type!=1">{{item.waterFee}}</td>-->
<!--          <td width="120" v-if="type!=1">{{item.energyFee}}</td>-->
          <td width="120" v-if="type!=1">{{item.changeFee}}</td>
          <td width="120" v-if="type!=1">{{item.amount}}</td>
          <td width="120" v-if="type!=1">{{item.payFee}}</td>
        </tr>
        </tbody>
      </table>

      
    <!-- 版本选择悬浮窗 -->
    <div class="timeline" v-if="info.hisInfo&&info.hisInfo.length>1&&type==3">
        <div class="item" v-for="item in info.hisInfo" :key="item.hisId" @click="changeHisVer(item.hisId)">
            <div class="circle" :class="item.hisId==currentHisId?'active':''"></div>
            <div class="content">
                <p>{{item.title}}</p>
                <p>{{item.date}}</p>
            </div>
            <div class="line"></div>
        </div>
    </div>
      <!-- 版本选择悬浮窗 -->

      <div class="page-bot-btn ">
        <el-button  @click="close(false)">关闭</el-button>
        <el-button type="primary" v-show="!disabled" @click="saveStorehouseFee()">提交</el-button>
        <el-button type="primary" v-show="type==4" @click="verify()">审核</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import saveStorehouseFee from './saveStorehouseFee.js'

export default saveStorehouseFee
</script>
<style lang="scss" scoped>
#saveStorehouseFee{

  .item33 {
    width: 31.3% !important;
    margin-right: 2% !important;
  }
  
  .item98 {
    width: 98% !important;
  }
  
  .common-info{
    position:relative;
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
        border-color: red;
        .text{
          border-color: red;
          color: red;
        }
      }
      &.state1{
        border-color: green;
        .text{
          border-color: green;
          color: green;
        }
      }
    }
    /deep/ .input-text.link{
      position: relative;
      .el-select{
        .el-input__inner{
          color: $main-color;
          text-decoration: underline;
        }
      }
      .linkView{
        position: absolute;
        top:0;
        left: 0;
        width: 80%;
        z-index: 9;
        height: 100%;
        cursor: pointer;
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

  .timeline {
    position: fixed;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 999;
    padding: 10px;
    border-radius: 5px;
    transition: all .3s;

    .item {
        position: relative;
        padding-bottom: 20px;
        padding-right: 20px;
        text-align: center;
        min-height: 40px;
        cursor: pointer;

        .circle {
            position: absolute;
            background-color: #E4E7ED;
            border-radius: 50%;
            width: 12px;
            height: 12px;
            right: 0;
            top: 16px;
            margin-top: -6px;
            z-index: 9;
            &.active{
                background: #07c160;
            }
        }

        .line {
            position: absolute;
            right: 5px;
            top: 16px;
            height: 100%;
            border-left: 2px solid #E4E7ED;
        }

        .content {
            display: none;

        }

        &:last-child{
            padding-bottom: 0;
            .line{
                display: none;
            }
        }
        
        &:hover{
            p{
                color: #07c160;
            }
        }
    }
    &:hover{
        background: #fff;
        box-shadow: 0 0 4px rgba(0,0,0,0.2);
        right: 10px;
        .item{
            .content {
                display: block;
            }
        }
    }
  }
}
</style>
