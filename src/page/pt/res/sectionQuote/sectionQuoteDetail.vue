<template>
    <div id="sectionQuoteDetail" class="sectionQuoteDetailPage orderPage">
        <div class="common-info">
            <!--            基础信息-->
            <h3 class="common-title"><span class="title-name">基本信息</span></h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">询价编号</td>
                    <td class="value">
                        {{ order.rfqQuoteNum }}
                    </td>
                    <td class="label">询价状态</td>
                    <td class="value">
                        {{ order.rfqStsName }}
                    </td>
                    <td class="label">报价类型</td>
                    <td class="value">
                        {{ order.rfqQuoteTypeName }}
                    </td>
                    <td class="label">报价级别</td>
                    <td class="value">
                        {{ order.quoteLevelName }}
                    </td>
                </tr>
                <tr>
                    <td class="label">客户</td>
                    <td class="value">
                        {{ order.tenantName }}
                    </td>
                    <td class="label">线路名称</td>
                    <td class="value">
                        {{ order.routeName }}
                    </td>
                    <td class="label">账期</td>
                    <td class="value">
                        {{ order.accountPeriod }}
                    </td>
                    <td class="label">询价截止时间</td>
                    <td class="value">
                        {{ order.effectDate }} - {{ order.expireDate }}
                    </td>
                </tr>
                <tr>
                    <td class="label">货物</td>
                    <td class="value" colspan="3">
                        {{ order.goodsName }}
                    </td>
                    <td class="label">供应商服务区域</td>
                    <td class="value" colspan="3">
                        {{ order.serviceAreasName }}
                    </td>
                </tr>
                <tr>
                    <td class="label">竞价供应商</td>
                    <td class="value" colspan="7">
                        {{ order.supplierTenantName }}
                    </td>
                </tr>
            </table>
            <!--            基础信息-->

            <!--            作业点-->
            <h3 class="common-title mt_20">
                <span class="title-name">作业点信息</span>
              <el-checkbox style="margin-left: 10px;" v-model="order.smsFlag" @change="$forceUpdate()" disabled="true">是否短信推送</el-checkbox>
              <div v-show="showDistance" style="display: inline-block;color:red;margin:5px 0 0 10px;font-weight: bold;">
                    作业点距离：{{ order.predictDistance + "(KM)"}}
                    &nbsp;&nbsp;估算时间：{{ order.predictTime + "(分钟)"}}
                </div>
            </h3>
            <div class="table_height">
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" style="z-index:9;">
                    <thead>
                    <tr>
                        <th width="150">序号</th>
                        <th>作业点/区域</th>
                        <th>详细地址(作业点/区域)</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="work in workList">
                        <td>{{ work.name }}</td>
                        <td>
                            {{ work.workName }}
                        </td>
                        <td>
                            {{ work.workAddressStr }}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <!--            作业点-->

            <!--            作业要求-->
            <h3 class="common-title mt_20">
                <span class="title-name">作业要求信息</span>
            </h3>
            <div class="table_height">
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                    <tr>
                        <th width="150">序号</th>
                        <th>内容</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in requirementList">
                        <td>{{ index + 1 }}</td>
                        <td>
                            {{ item.content }}
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <!--            作业要求-->

            <!--            报价明细-->
            <h3 class="common-title mt_20" v-show="type==0">
                <span class="title-name">报价明细&nbsp;<em>注：相同的起始点、中途点、目的地、计费方式、报价车型、车长、只能存在一条。通用等于全选。</em></span>
            </h3>
            <table v-show="type==0" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th width="150">序号</th>
                    <th v-show="order.rfqQuoteType == enumData.rfqQuoteType.LD">费用类型</th>
                    <th>计费方式</th>
                    <th v-show="order.rfqQuoteType != enumData.rfqQuoteType.LD">报价车型</th>
                    <th v-show="order.rfqQuoteType != enumData.rfqQuoteType.LD">车长</th>
                    <th v-show="order.rfqQuoteType == enumData.rfqQuoteType.LD">单位</th>
                    <th v-show="order.rfqQuoteType == enumData.rfqQuoteType.LD">数量区间</th>
                    <th v-show="order.rfqQuoteType == enumData.rfqQuoteType.WMS">车辆数</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in quoteDtlList">
                    <td>{{ index + 1 }}</td>
                    <td v-show="order.rfqQuoteType == enumData.rfqQuoteType.LD">
                        {{ item.feeTypeName }}
                    </td>
                    <td>
                        {{ item.billingTypeName }}
                    </td>
                    <td v-show="order.rfqQuoteType != enumData.rfqQuoteType.LD">
                        {{ item.quoteVehicleTypeName }}
                    </td>
                    <td v-show="order.rfqQuoteType != enumData.rfqQuoteType.LD">
                        {{ item.vehicleLengthName }}
                    </td>
                    <td v-show="order.rfqQuoteType == enumData.rfqQuoteType.LD">
                        {{ item.rangeUnitName }}
                    </td>
                    <td v-show="order.rfqQuoteType == enumData.rfqQuoteType.LD">
                        {{ item.rangeStart }} - {{ item.rangeEnd }}
                    </td>
                    <td v-show="order.rfqQuoteType == enumData.rfqQuoteType.WMS">
                        {{ item.vehicleCount }}
                    </td>
                </tr>
                </tbody>
            </table>
            <!--            报价明细-->

            <!--            竞价明细-->
            <h3 class="common-title mt_20">
                <span class="title-name">竞价明细&nbsp;&nbsp;&nbsp;
                    <span v-show="type == 1">(竞价企业： <em>{{ order.bidSupplierCount }}</em>   家)
                    </span>
                </span>
            </h3>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th v-show="type != 0">选择</th>
                    <th>竞价状态</th>
                    <th v-show="order.rfqQuoteType == enumData.rfqQuoteType.LD">费用类型</th>
                    <th>计费方式</th>
                    <th v-show="order.rfqQuoteType != enumData.rfqQuoteType.LD" width="250">报价车型</th>
                    <th v-show="order.rfqQuoteType != enumData.rfqQuoteType.LD" width="250">车长</th>
                    <th v-show="order.rfqQuoteType == enumData.rfqQuoteType.LD">单位</th>
                    <th v-show="order.rfqQuoteType == enumData.rfqQuoteType.LD">数量区间</th>
                    <th v-show="order.rfqQuoteType == enumData.rfqQuoteType.ZC">运费单价/元</th>
                    <th v-show="order.rfqQuoteType == enumData.rfqQuoteType.ZC">点位费单价/元</th>
                    <th v-show="order.rfqQuoteType == enumData.rfqQuoteType.LD">费用</th>
                    <th v-show="order.rfqQuoteType == enumData.rfqQuoteType.WMS">单价金额</th>
                    <th width="300">竞价单位名称</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="item in quoteList" :class="{'disabled':type==2&&item.selVerifyState==0}" >
                    <td v-show="type != 0">
                        <el-checkbox v-model="item.isSelect" :disabled="item.disabled"></el-checkbox>
                    </td>
                    <td>
                        {{ item.bidStsName }}
                    </td>
                    <td v-show="order.rfqQuoteType == enumData.rfqQuoteType.LD">
                        {{ item.feeTypeName }}
                    </td>
                    <td>
                        {{ item.billingTypeName }}
                    </td>
                    <td v-show="order.rfqQuoteType != enumData.rfqQuoteType.LD" :title="item.quoteVehicleTypeName">
                        {{ item.quoteVehicleTypeName }}
                    </td>
                    <td v-show="order.rfqQuoteType != enumData.rfqQuoteType.LD" :title="item.vehicleLengthName">
                        {{ item.vehicleLengthName }}
                    </td>
                    <td v-show="order.rfqQuoteType == enumData.rfqQuoteType.LD">
                        {{ item.rangeUnitName }}
                    </td>
                    <td v-show="order.rfqQuoteType == enumData.rfqQuoteType.LD">
                        {{ item.rangeStart }} - {{ item.rangeEnd }}
                    </td>
                    <td v-show="order.rfqQuoteType == enumData.rfqQuoteType.ZC">
                        {{ item.feePrice }}
                    </td>
                    <td v-show="order.rfqQuoteType == enumData.rfqQuoteType.ZC">
                        {{ item.pointFee }}
                    </td>
                    <td v-show="order.rfqQuoteType == enumData.rfqQuoteType.LD">
                        {{ item.fee }}
                    </td>
                    <td v-show="order.rfqQuoteType == enumData.rfqQuoteType.WMS">
                        {{ item.feePrice }}
                    </td>
                    <td>
                        {{ item.tenantName }}
                    </td>
                </tr>
                </tbody>
            </table>
            <!--            竞价明细-->

            <table v-show="type == 2" class="fillTbale mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">审核备注</td>
                    <td class="value" colspan="7">
                        <el-input v-model="verifyRemark" placeholder="审核备注"></el-input>
                    </td>
                </tr>
            </table>

            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
                <el-button v-show="type == 1" type="primary" @click="initiateAudit">发起审计</el-button>
                <el-button v-show="type == 2" type="primary" @click="audit(1)">审计通过</el-button>
                <el-button v-show="type == 2" type="primary" @click="audit(2)">审计不通过</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import sectionQuoteDetail from './sectionQuoteDetail.js'

export default sectionQuoteDetail
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>
<style lang="scss" scoped>

.sectionQuoteDetailPage {
    /deep/ .mycity {
        width: 100%;
        .el-autocomplete{
            width: 100%;
        }
        .ma{
            position: fixed!important;
        }
    }
  tr.disabled{
    td{
      color: #999!important;
      a{
        color: #999!important;
      }
    }
  }
}
</style>
