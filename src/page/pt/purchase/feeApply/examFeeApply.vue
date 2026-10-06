<template>
    <div id="examFeeApply">
      <div class="common-info">
        <div class="pageTitle">费用申请单<span class="applyNum">申请单号:{{info.applyNum}}</span></div>
        <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td class="label">申请人</td>
                <td class="value">{{info.applyUserName}}</td>
                <td class="label">申请部门</td>
                <td class="value">{{info.orgName}}</td>
                <td class="label">申请主体</td>
                <td style="width:33%;" class="value">{{info.applySettleBodyName}}</td>
            </tr>
            <tr>
                <td class="label">申请日期</td>
                <td class="value">{{info.applyDate}}</td>
                <td class="label"><em>*</em>申请理由</td>
                <td class="value" colspan="3">{{info.applyRemark}}</td>
            </tr>
            <tr>
                <td class="label" ><em>*</em>紧急程度</td>
                <td class="value" >{{info.urgentLevelName}}</td>
                <td class="label"><em>*</em>是否预算内</td>
                <td class="value">{{info.isWithinBudgetName}}</td>
                <td class="label"><em>*</em>期望完成日期</td>
                <td class="value">{{info.expectDate}}</td>
            </tr>
            <tr>
                <td class="label"><em>*</em>收货人</td>
                <td class="value">{{info.deliveryUser}}</td>
                <td class="label"><em>*</em>收货人联系电话</td>
                <td class="value">{{info.deliveryPhone}}</td>
                <td class="label"><em>*</em>收货地址</td>
                <td class="value">{{info.deliveryAddress}}</td>
            </tr>
        </table>
        <div style="overflow-x:auto;">
            <table class="tableCommon mt_20" width="100%" border="0" cellspacing="0" cellpadding="0"  ref="table">
                <thead>
                    <tr>
                      <th width="60">序号</th>
                      <th width="200">费用类型</th>
                      <th width="200">品名/项目</th>
                      <th width="180">规格型号</th>
                      <th width="200">供应商</th>
                      <th width="80">数量单位</th>
                      <th width="80">在途数量</th>
                      <th width="80">现有库存数量</th>
                      <th width="80">上月使用数量</th>
                      <th width="100">需求数量</th>
                      <th width="100">已采购数量</th>
                      <th width="100">核销数量</th>
                      <th width="100">核销备注</th>
                      <th width="100">付款类型</th>
                      <th width="80">参考税率</th>
                      <th width="80">参考含税单价</th>
                      <th width="80">参考含税金额</th>
<!--                      <th width="100">采购类型</th>-->
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(fee, index) in info.dtls">
                        <td>{{ index+1 }}</td>
                      <td>{{fee.feeNames}}</td>
                      <td>{{fee.projectName}}</td>
                      <td>{{fee.specification}}</td>
                      <td>{{fee.tenantName}}</td>
                      <td>{{fee.unit}}</td>
                      <td>{{fee.inTheRoadNums}}</td>
                      <td>{{fee.stockNums}}</td>
                      <td>{{fee.lastMonthUseNums}}</td>
                      <td>{{fee.demandNums}}</td>
                      <td>{{fee.purchaseNums}}</td>
                      <td>{{fee.oldWriteOffNums}}</td>
                      <td>{{fee.writeOffRemark}}</td>
                      <td>{{fee.payTypeName}}</td>
                      <td>{{fee.referTax}}</td>
                      <td>{{fee.referPrice}}</td>
                      <td>{{fee.referTotalFee}}</td>
<!--                      <td>{{fee.purchaseTypeName}}</td>-->
                    </tr>
                    <tr>
                        <td>合计</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>{{totalReferTotalFee}}</td>
<!--                        <td></td>-->
                    </tr>
                </tbody>
            </table>
        </div>
        <h3 class="common-title mt_20"><span class="title-name">附件</span></h3>
        <div class="uploadFile clearfix">
            <div class="fl mr_20"  v-for="(item,index) in info.files">
                <myFileModel :ref="'file' + index" :componentId="index" :disabled-del="true" :disabled-edit="true"></myFileModel>
                <p>只支持.jpg .png .pdf .xls .xlsx格式</p>
            </div>
        </div>
        <h3 class="common-title mt_20"><span class="title-name">审核信息</span></h3>        
        <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
                <tr>
                    <th>审核部门</th>
                    <th>审核人</th>
                    <th>审核日期</th>
                    <th>审核意见</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in info.userList">
                    <td>{{item.orgName}}</td>
                    <td>{{item.verifyUser}}</td>
                    <td>{{item.verifyDate}}</td>
                    <td>{{item.verifyRemark}}</td>
                </tr>
            </tbody>
        </table>

        <h3 class="common-title mt_20" v-if="info.purchaseOrderList&&info.purchaseOrderList.length>0"><span class="title-name">采购信息</span></h3>
        <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" v-if="info.purchaseOrderList&&info.purchaseOrderList.length>0">
          <thead>
          <tr>
            <th>采购单单号</th>
            <th>费用类型</th>
            <th>品名/项目</th>
            <th>需求总数量</th>
            <th>采购总数量</th>
            <th>采购人</th>
            <th>创建时间</th>
            <th>状态</th>
            <th>审核状态</th>
            <th>当前审核人</th>
            <th>部门审核</th>
            <th>部门审核意见</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in info.purchaseOrderList" >
            <td><a href="javascript:void(0);" class="link" @click.stop="toPurOrder(item)">{{item.purchaseNum}}</a></td>
            <td>{{item.feeSubTypeName}}</td>
            <td>{{item.projectNames}}</td>
            <td>{{item.totalDemandNums}}</td>
            <td>{{item.purchaseNums}}</td>
            <td>{{item.purchaseUserName}}</td>
            <td>{{item.createDate}}</td>
            <td>{{item.stateName}}</td>
            <td>{{item.verifyStateName}}</td>
            <td>{{item.currentVerifyData}}</td>
            <td>{{item.verifyUserName1}}</td>
            <td>{{item.verifyRemark1}}</td>
          </tr>
          </tbody>
        </table>


        <div class="bot-btn">
          <el-button @click="closePage">关闭</el-button>
          <el-button type="danger" v-if="viewType==2" @click="save(2)">审核不通过</el-button>
          <el-button type="primary" v-if="viewType==2" @click="save(1)">审核通过</el-button>
        </div>
      </div>

    </div>
  </template>
    
<script>
import examFeeApply from './examFeeApply.js'
export default examFeeApply
</script>
<style lang="scss" scoped>
#examFeeApply {
    height: auto!important;;
    /deep/ .common-info{
        height: 100%;
        padding: 30px 20px;
        box-sizing: border-box;
        .pageTitle{
            font-weight: bold;
            text-align: center;
            margin-bottom: 20px;
            font-size: 16px;
            position: relative;
            .applyNum{
              font-weight: bold;
              font-size: 12px;
              position: absolute;
              bottom: -16px;
              right: 0;
            }
        }
        .fillTbale{
            .el-textarea__inner{
                border:none;
            }
        }
        .tableCommon{
            border:$border;
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
    }
}
</style>