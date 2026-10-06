<template>
    <div id="paymentPlanDetail">
      <div class="common-info flex">
        <h3 class="common-title"><span class="title-name">基本信息</span></h3>
        <ul class="content clearfix mt_20">
            <li class="item item100">
              <label class="label-term">费用清单编号：</label>
              <div class="input-text">{{ info.planNum }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">成本发生日期：</label>
                <div class="input-text">{{ info.billMonth }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">成本发生部门：</label>
                <div class="input-text">{{ info.orgName }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">含税金额：</label>
                <div class="input-text"><em>{{ info.fee }}</em></div>
            </li>
            <li class="item item50">
                <label class="label-term">采购单号：</label>
                <div class="input-text"><a href="javascript:void(0);" class="link" @click.stop="toPurOrderDetail(info)">{{info.purchaseNum}}</a></div>
            </li>
            <li class="item item50">
                <label class="label-term">供应商合同号：</label>
                <div class="input-text"><a href="javascript:void(0);" class="link" @click.stop="toContractDetail(info)">{{info.contractNum}}</a></div>
            </li>
            <li class="item item50">
                <label class="label-term">供应商名称：</label>
                <div class="input-text">{{ info.tenantName }}</div>
            </li>
<!--            <li class="item item50">-->
<!--                <label class="label-term">是否入账：</label>-->
<!--                <div class="input-text">{{ info.entryBillFlgName }}</div>-->
<!--            </li>-->
<!--            <li class="item item50">-->
<!--                <label class="label-term">对账单编号：</label>-->
<!--                <div class="input-text">{{ info.billNum }}</div>-->
<!--            </li>-->
            <li class="item item50">
                <label class="label-term">付款状态：</label>
                <div class="input-text">{{ info.payStateName }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">请款单号：</label>
                <div class="input-text"><a href="javascript:void(0);" class="link"  v-for="(data,index) in info.reqNumArray" @click.stop="toDetail(info, 'reqNums', index)" >{{index>0?','+data:data}}</a></div>
            </li>
            <li class="item item50">
              <label class="label-term">付款单号：</label>
              <div class="input-text"> <a href="javascript:void(0);" class="link"  v-for="(data,index) in info.payNumArray" @click.stop="toDetail(info, 'payNums', index)">{{index>0?','+data:data}}</a></div>
            </li>
            <li class="item item50">
                <label class="label-term">付款条件：</label>
                <div class="input-text">{{ info.payCondition }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">实际付款时间：</label>
                <div class="input-text">{{ info.payDate }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">费用申请单号：</label>
                <div class="input-text"> <a href="javascript:void(0);" class="link"  @click.stop="toApplyDetail(info)">{{info.applyNum}}</a></div>
            </li>
        </ul>
        <h3 class="common-title mt_20"><span class="title-name">物品/项目信息</span></h3>        
        <ul class="content clearfix mt_20">
            <li class="item item50">
                <label class="label-term">费用类型：</label>
                <div class="input-text">{{ info.feeNames }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">品名/项目：</label>
                <div class="input-text">{{ info.projectName }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">规格型号：</label>
                <div class="input-text">{{ info.specification }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">数量：</label>
                <div class="input-text">{{ info.nums }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">付款类型：</label>
                <div class="input-text">{{ info.payTypeName }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">租赁/分期月份数：</label>
                <div class="input-text">{{ info.depreciationMonthCount }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">开始计费日期：</label>
                <div class="input-text">{{ info.chargeDate }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">增值税：</label>
                <div class="input-text">{{ info.rate }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">含税参考单价：</label>
                <div class="input-text">{{ info.referPrice }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">收货日期：</label>
                <div class="input-text">{{ info.inDate }}</div>
            </li>
        </ul>
        <div class="bot-btn">
          <el-button @click="closePage">关闭</el-button>
        </div>
      </div>
    </div>
  </template>
    
<script>
import paymentPlanDetail from './paymentPlanDetail.js'
export default paymentPlanDetail
</script>
<style lang="scss" scoped>
#paymentPlanDetail {
    height: auto!important;;
    /deep/ .common-info{
        height: 100%;
        padding: 30px 20px;
        box-sizing: border-box;
        .tableCommon{
            border:$border;
        }
        .label-term{
            height: 30px;
            width: 120px;
        }
        .input-text{
            line-height: 30px;
        }
    }
    
    .uploadFile{
        img{
          width:110px;
          height: 80px;
          border-radius: 5px;
          overflow: hidden;
          float: left;
          margin-right: 20px;
          float: left;
        }
    }
}
</style>