<template>
  <div id="wmsStorehouseFeeDetail">
    <!-- 新增 仓库 -->
    <div class="common-info">
      <h3 class="common-title mb_20"><span class="title-name">基本信息</span></h3>
      <ul class="content clearfix">
        <li class="item">
          <label class="label-term">租赁费用编号</label>
          <div class="input-text">
            <el-input :disabled="true" v-model="info.workFeeExtNum "></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">物流中心</label>
          <div class="input-text">
            <el-input v-model="info.workName" :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">费用类型</label>
          <div class="input-text">
            <el-input v-model="info.feeTypeName" :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">合同编号</label>
          <div class="input-text">
            <el-input v-model="info.contractNum" :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">供应商</label>
          <div class="input-text">
            <el-input v-model="info.supplierTenantName" :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">合同开始日期</label>
          <div class="input-text">
            <el-input v-model="info.leaseStartDate" :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">合同结束日期</label>
          <div class="input-text">
            <el-input v-model="info.leaseEndDate" :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">合同期限</label>
          <div class="input-text">
            <el-input v-model="info.leaseMonth" :disabled="true"></el-input>
          </div>
        </li>
        <div class="state" v-if="info.verifyState!=0" :class="info.verifyState==1?'state1':'state0'"><div class="text">{{ info.verifyState==1?"审核通过":"审核不通过" }}</div></div>

        <h3 class="common-title">
          <span class="title-name">当月租赁费用明细</span>
        </h3>

        <li class="item">
          <label class="label-term">租赁面积(㎡)</label>
          <div class="input-text">
            <el-input v-model="info.storehouseArea" :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">费用月份</label>
          <div class="input-text">
            <el-input v-model="info.billMonth" :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">计费开始日期</label>
          <div class="input-text">
            <el-input v-model="info.billingStartDate" :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">计费结束日期</label>
          <div class="input-text">
            <el-input v-model="info.billingEndDate" :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">未税单价</label>
          <div class="input-text">
            <el-input v-model="info.leaseFeePriceNoTax"  :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">租金税率(%)</label>
          <div class="input-text">
            <el-input v-model="info.leaseFeeTaxRate"  :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">含税单价</label>
          <div class="input-text">
            <el-input v-model="info.leaseFeePrice"  :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">支付周期</label>
          <div class="input-text">
            <el-input v-model="info.payCycleName"  :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">未税管理费单价</label>
          <div class="input-text">
            <el-input v-model="info.manageFeePriceNoTax"  :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">管理费税率(%)</label>
          <div class="input-text">
            <el-input v-model="info.manageFeeTaxRate"  :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">管理费含税单价</label>
          <div class="input-text">
            <el-input v-model="info.manageFeePrice"  :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">计费方式</label>
          <div class="input-text">
            <el-input v-model="info.billingMethodName"  :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">未税其他杂费</label>
          <div class="input-text">
            <el-input v-model="info.otherFeeNoTax" :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">杂费税率(%)</label>
          <div class="input-text">
            <el-input v-model="info.otherFeeTaxRate" :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">含税其他杂费</label>
          <div class="input-text">
            <el-input v-model="info.otherFee" :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">押金(保证金)</label>
          <div class="input-text">
            <el-input v-model="info.deposit" :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">租赁天数</label>
          <div class="input-text">
            <el-input v-model="info.leaseDays"  :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">月天数</label>
          <div class="input-text">
            <el-input v-model="info.billMonthDays"  :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">是否入账</label>
          <div class="input-text">
            <el-input v-model="info.isEntryAcctName"  :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">是否支付</label>
          <div class="input-text">
            <el-input v-model="info.isPayName"  :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">未税月费用</label>
          <div class="input-text">
            <el-input v-model="info.totalFeeNoTax" :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">含税月费用</label>
          <div class="input-text">
            <el-input v-model="info.totalFee" :disabled="true"></el-input>
          </div>
        </li>
<!--        <li class="item">-->
<!--          <label class="label-term">含税水费</label>-->
<!--          <div class="input-text">-->
<!--            <el-input v-model="info.waterFee" :disabled="true"></el-input>-->
<!--          </div>-->
<!--        </li>-->
<!--        <li class="item">-->
<!--          <label class="label-term">含税电费</label>-->
<!--          <div class="input-text">-->
<!--            <el-input v-model="info.energyFee" :disabled="true"></el-input>-->
<!--          </div>-->
<!--        </li>-->
        <li class="item">
          <label class="label-term">含税异动费</label>
          <div class="input-text">
            <el-input v-model="info.changeFee" :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">含税费用合计</label>
          <div class="input-text">
            <el-input v-model="info.amount" :disabled="true"></el-input>
          </div>
        </li>
        <li class="item">
          <label class="label-term">实际已付</label>
          <div class="input-text">
            <el-input v-model="info.payFee" :disabled="true"></el-input>
          </div>
        </li>
        <li class="item item75">
          <label class="label-term">备注</label>
          <div class="input-text">
            <el-input v-model="info.remark" :disabled="true"></el-input>
          </div>
        </li>
      </ul>
      <div class="page-bot-btn ">
        <el-button size="mini" @click="close(false)">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import wmsStorehouseFeeDetail from './wmsStorehouseFeeDetail.js'

export default wmsStorehouseFeeDetail
</script>
<style lang="scss" scoped>
#wmsStorehouseFeeDetail{

  .item33 {
    width: 31.3% !important;
    margin-right: 2% !important;
  }
  
  .item98 {
    width: 98% !important;
  }

  .item75 {
    width: 73% !important;
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
