<template>
    <div id="inOrderDetail">
      <div class="common-info flex">
        <h3 class="common-title"><span class="title-name">入库基础信息</span></h3>
        <ul class="content clearfix mt_20">
            <li class="item item50">
                <label class="label-term">采购方：</label>
                <div class="input-text">{{ info.settleBodyName }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">采购单单号：</label>
                <div class="input-text"><a href="javascript:void(0);" class="link" @click.stop="toPurOrder(info)">{{info.purchaseNum}}</a></div>
            </li>
            <li class="item item50">
                <label class="label-term">采购入库编码：</label>
                <div class="input-text">{{ info.deliveryNum }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">入库地：</label>
                <div class="input-text">{{ info.workName }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">预计发货/提货时间：</label>
                <div class="input-text">{{ info.deliverDate }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">入库日期：</label>
                <div class="input-text">{{ info.inDate }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">供应商名称：</label>
                <div class="input-text">{{ info.tenantName }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">使用客户：</label>
                <div class="input-text">{{ info.useCustomerName }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">交货单：</label>
                <div class="input-text uploadFile clearfix">
                    <img class="img" :src="info.url" v-if="info.url" @click="seeBigImg(info.url)" alt="">
                </div>
            </li>
            <li class="item item50">
                <label class="label-term">备注：</label>
                <div class="input-text">{{ info.orderRemark }}</div>
            </li>
        </ul>
        <ul class="content clearfix mt_20">
            <li class="item item50">
                <label class="label-term">入库人员：</label>
                <div class="input-text">{{ info.createUserName }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">入库操作时间：</label>
                <div class="input-text">{{ info.createDate }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">客户确认状态：</label>
                <div class="input-text">{{ info.confirmStateName }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">客户确认时间：</label>
                <div class="input-text">{{ info.confirmDate }}</div>
            </li>
        </ul>
        <h3 class="common-title mt_20"><span class="title-name">入库物品信息</span></h3>
        <div style="overflow-x:auto;">
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                      <th width="80">序号</th>
                      <th width="150">物品种类</th>
                      <th width="150">品名</th>
                      <th width="120">规格型号</th>
                      <th width="100">数量单位</th>
                      <th width="100">采购数量</th>
                      <th width="100">入库数量</th>
                      <th width="120">付款类型</th>
                      <th width="150">开始计费日期</th>
                      <th width="150">结束计费日期</th>
                      <th width="120">资产类别</th>
                      <th width="120">资产子类别</th>
                      <th width="120">是否集采</th>
                      <th width="150">设备序列号</th>
                      <th width="150">合同编号</th>
                      <th width="200">存放场地</th>
                      <th width="120">计费周期</th>
                      <th width="120">押金</th>
                      <th width="120">违约金</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in dtlList">
                        <td>{{ index+1 }}</td>
                        <td>{{ item.feeSubTypeName }}</td>
                        <td>{{ item.projectName }}</td>
                        <td>{{ item.specification }}</td>
                        <td>{{ item.unit }}</td>
                        <td>{{ item.purchaseNum }}</td>
                        <td>{{ item.deliveryNums }}</td>
                        <td>{{ item.payTypeName }}</td>
                        <td>{{ item.chargeDate }}</td>
                        <td>{{item.chargeDateEnd}}</td>
                        <td>{{item.assetClassName}}</td>
                        <td>{{item.assetSubClassName}}</td>
                        <td>{{item.isCentralPurchaseName}}</td>
                        <td>{{item.equipmentNum}}</td>
                        <td><a href="javascript:void(0);" class="link"  @click.stop="toContractDetail(item)">{{item.contractNum}}</a></td>
                        <td>{{item.storageLocation}}</td>
                        <td>{{item.billingCycleName}}</td>
                        <td>{{item.deposit}}</td>
                        <td>{{item.liquidatedDamages}}</td>
                    </tr>
                    <tr>
                        <td>合计</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>{{ total.purchaseNum }}</td>
                        <td>{{ total.deliveryNums }}</td>
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
                        <td>{{total.deposit}}</td>
                        <td>{{total.liquidatedDamages}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="bot-btn">
          <el-button @click="closePage">关闭</el-button>
        </div>
      </div>

      <fileViewer ref="viewer" :url-list="[bigImageUrl]"></fileViewer>
    </div>
  </template>
    
<script>
import inOrderDetail from './inOrderDetail.js'
export default inOrderDetail
</script>
<style lang="scss" scoped>
#inOrderDetail {
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