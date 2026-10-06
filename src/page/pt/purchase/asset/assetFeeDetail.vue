<template>
  <div id="assetFeeDetail">
    <!-- 新增 仓库 -->
    <div class="common-info">
      <h3 class="common-title mb_10">
        <span class="title-name">基本信息</span>
        <span class="fr" style="width: 92%;text-align: right;">设备资源编号：<a href="javascript:void(0);" class="link" @click.stop="toAssetInfo(info)">{{info.assetNum}}</a></span>
      </h3>
      <ul class="content clearfix">
        <li class="item item33">
          <label class="label-term">资产名称：</label>
          <div class="input-text disabled">{{info.assetName}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">规格型号：</label>
          <div class="input-text">{{info.model}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">资产采购类型：</label>
          <div class="input-text">{{info.assetPurchaseTypeName}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">资产类型：</label>
          <div class="input-text">{{info.assetTypeName}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">资产类别：</label>
          <div class="input-text">{{info.assetClassName}}</div>
        </li>
        <li class="item item33" :style="info.assetSubClass?'':'visibility: hidden'">
          <label class="label-term">资产子类别：</label>
          <div class="input-text">{{info.assetSubClassName}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">是否集采：</label>
          <div class="input-text">{{info.isCentralPurchaseName}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">所在地：</label>
          <div class="input-text">{{info.locationWorkName}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">设备序列号：</label>
          <div class="input-text">{{info.equipmentNum}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">供应商：</label>
          <div class="input-text">{{info.supplierTenantName}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">合同：</label>
          <div class="input-text"><a href="javascript:void(0);" class="link" @click.stop="toContractDetail(info)">{{info.contractNum}}</a>
          </div>
        </li>
        <li class="item item33" :style="info.assetClass=='4'?'':'visibility: hidden'">
          <label class="label-term">使用客户：</label>
          <div class="input-text">{{info.custTenantName}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">部门：</label>
          <div class="input-text">{{info.settleOrgName}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">结算主体：</label>
          <div class="input-text">{{info.settleBodyName}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">存放位置：</label>
          <div class="input-text">{{info.storageLocation}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">采购单号：</label>
          <div class="input-text"><a href="javascript:void(0);" class="link" @click.stop="toPurOrderDetail(info)">{{info.purchaseNum}}</a></div>
        </li>
        <li class="item item33">
          <label class="label-term">库存数量：</label>
          <div class="input-text">{{info.stockNum}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">备注：</label>
          <div class="input-text">{{info.remark}}</div>
        </li>
      </ul>
      <h3 class="common-title mb_10"><span class="title-name">当月费用信息</span></h3>
      <ul class="content clearfix">
        <li class="item item33">
          <label class="label-term">付款类型：</label>
          <div class="input-text">{{info.payTypeName}}</div>
        </li>
        <li class="item item33" :style="info.assetPurchaseType=='2'?'':'visibility: hidden'">
          <label class="label-term">计费周期：</label>
          <div class="input-text">{{info.billingCycleName}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">税率：</label>
          <div class="input-text">{{info.tax}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">费用月份：</label>
          <div class="input-text">{{feeDetail.billMonth}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">计费起始日期：</label>
          <div class="input-text">{{feeDetail.billingStartDate}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">计费截止日期：</label>
          <div class="input-text">{{feeDetail.billingEndDate}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">所属期数：</label>
          <div class="input-text">第{{feeDetail.periods}}期</div>
        </li>
        <li class="item item33">
          <label class="label-term">是否入账：</label>
          <div class="input-text">{{feeDetail.isEntryAcctName}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">是否支付：</label>
          <div class="input-text">{{feeDetail.isPayName}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">数量：</label>
          <div class="input-text">{{feeDetail.billingNum}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">租赁天数：</label>
          <div class="input-text">{{feeDetail.leaseDays}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">月天数：</label>
          <div class="input-text">{{feeDetail.billMonthDays}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">单位：</label>
          <div class="input-text">{{feeDetail.unit}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">未税月费用：</label>
          <div class="input-text">{{feeDetail.amount}}</div>
        </li>
        <li class="item item33">
          <label class="label-term">含税月费用：</label>
          <div class="input-text">{{feeDetail.amountWithTax}}</div>
        </li>
      </ul>
      <div class="page-bot-btn ">
        <el-button size="mini" @click="close">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import assetFeeDetail from './assetFeeDetail.js'

export default assetFeeDetail
</script>
<style lang="scss" scoped>
#assetFeeDetail{

  .item33 {
    width: 31.3% !important;
    margin-right: 2% !important;
  }
  
  .item98 {
    width: 98% !important;
  }
  
  .common-info{
    position:relative;
    .mb_10{
      margin-bottom: 10px;
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
    .uploadFile{
      padding: 20px;
      background: #fff;
      border:$border;
      p{
        text-align: center;
      }
      .imgList{
        img{
          width:110px;
          height: 110px;
          border-radius: 5px;
          overflow: hidden;
          float: left;
          margin-left: 20px;
        }
      }
      .form{
        line-height: 110px;
        font-weight: bold;
        font-size: 14px;
        button{
          margin-left: 20px;
        }
        .el-select .el-input input{
          color: #0379FF;
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
