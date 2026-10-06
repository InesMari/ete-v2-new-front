<template>
    <div id="generateSectionQuote" class="generateSectionQuotePage orderPage">
        <div class="common-info">
            <div :style="index == 0 ? '' : 'margin-top:20px;'" v-for="(tenant, index) in tenantList">
            <!--            基础信息-->
            <h3 class="common-title"><span class="title-name">基本信息</span></h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">询价编号</td>
                    <td class="value">
                        {{ tenant.order.rfqQuoteNum }}
                    </td>
                    <td class="label">报价类型</td>
                    <td class="value">
                        {{ tenant.order.rfqQuoteTypeName }}
                    </td>
                    <td class="label">报价级别</td>
                    <td class="value">
                        {{ tenant.order.quoteLevelName }}
                    </td>
                    <td class="label">供应商</td>
                    <td class="value">
                        <em>{{ tenant.tenantName }}</em>
                    </td>
                </tr>
                <tr>
                    <td class="label" v-show="rfqQuoteType != enumData.rfqQuoteType.WMS">指定客户</td>
                    <td class="value" v-show="rfqQuoteType != enumData.rfqQuoteType.WMS">
                        <el-select v-model="tenant.order.specifyTenantId" filterable clearable
                                   @change="forceUpdate" placeholder="请选择指定客户">
                            <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name"
                                       :value="item.tenantId"></el-option>
                        </el-select>
                    </td>
                    <td class="label" v-show="rfqQuoteType != enumData.rfqQuoteType.WMS">
                        <em v-show="rfqQuoteType == enumData.rfqQuoteType.LD">*</em>运输时效
                    </td>
                    <td class="value" v-show="rfqQuoteType != enumData.rfqQuoteType.WMS">
                        <el-input v-model="tenant.order.transportTimeliness"
                                  @input="forceUpdate" v-mynumval placeholder="请输入小时"></el-input>
                    </td>
                    <td class="label"><em>*</em>生效失效时间</td>
                    <td class="value" :colspan="rfqQuoteType != enumData.rfqQuoteType.WMS ? 3 : 7">
                        <el-date-picker v-model="tenant.order.validDate" @input="forceUpdate"
                                        type="daterange" placeholder="请选择日期时间" align="right"
                                        format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </td>
                </tr>
                <tr>
                    <td class="label">备注</td>
                    <td class="value" colspan="7">
                        <el-input v-model="tenant.order.remark" @input="forceUpdate" placeholder="请输入备注"></el-input>
                    </td>
                </tr>
            </table>
            <!--            基础信息-->

            <!--            作业点-->
            <h3 class="common-title mt_20">
                <span class="title-name">作业点信息</span>
                <div v-show="showDistance" style="display: inline-block;color:red;margin:5px 0 0 10px;font-weight: bold;">
                    作业点距离：{{ tenant.order.predictDistance + "(KM)"}}
                    &nbsp;&nbsp;估算时间：{{ tenant.order.predictTime + "(分钟)"}}
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
                    <tr v-for="work in tenant.workList">
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

            <!--            报价明细-->
            <h3 class="common-title mt_20">
                <span class="title-name">报价明细&nbsp;<em>注：相同的起始点、中途点、目的地、计费方式、报价车型、车长、只能存在一条。通用等于全选。</em></span>
            </h3>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th width="150">序号</th>
                    <th v-show="rfqQuoteType == enumData.rfqQuoteType.LD">费用类型</th>
                    <th>计费方式</th>
                    <th v-show="rfqQuoteType != enumData.rfqQuoteType.LD" width="250">报价车型</th>
                    <th v-show="rfqQuoteType != enumData.rfqQuoteType.LD" width="250">车长</th>
                    <th v-show="rfqQuoteType != enumData.rfqQuoteType.WMS" width="250">货物</th>
                    <th v-show="rfqQuoteType == enumData.rfqQuoteType.LD">单位</th>
                    <th v-show="rfqQuoteType == enumData.rfqQuoteType.LD">数量区间</th>
                    <th v-show="rfqQuoteType == enumData.rfqQuoteType.ZC">运费单价/元</th>
                    <th v-show="rfqQuoteType == enumData.rfqQuoteType.ZC">点位费单价/元</th>
                    <th v-show="rfqQuoteType == enumData.rfqQuoteType.LD">费用</th>
                    <th v-show="rfqQuoteType == enumData.rfqQuoteType.WMS">单价金额</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in tenant.quoteList">
                    <td>{{ index + 1 }}</td>
                    <td v-show="rfqQuoteType == enumData.rfqQuoteType.LD">
                        {{ item.feeTypeName }}
                    </td>
                    <td>
                        {{ item.billingTypeName }}
                    </td>
                    <td v-show="rfqQuoteType != enumData.rfqQuoteType.LD" :title="item.quoteVehicleTypeName">
                        {{ item.quoteVehicleTypeName }}
                    </td>
                    <td v-show="rfqQuoteType != enumData.rfqQuoteType.LD" :title="item.vehicleLengthName">
                        {{ item.vehicleLengthName }}
                    </td>
                    <td v-show="rfqQuoteType != enumData.rfqQuoteType.WMS" :title="item.goodsName">
                        {{ item.goodsName }}
                    </td>
                    <td v-show="rfqQuoteType == enumData.rfqQuoteType.LD">
                        {{ item.rangeUnitName }}
                    </td>
                    <td v-show="rfqQuoteType == enumData.rfqQuoteType.LD">
                        {{ item.rangeStart }} - {{ item.rangeEnd }}
                    </td>
                    <td v-show="rfqQuoteType == enumData.rfqQuoteType.ZC">
                        {{ item.feePrice }}
                    </td>
                    <td v-show="rfqQuoteType == enumData.rfqQuoteType.ZC">
                        {{ item.pointFee }}
                    </td>
                    <td v-show="rfqQuoteType == enumData.rfqQuoteType.LD">
                        {{ item.fee }}
                    </td>
                    <td v-show="rfqQuoteType == enumData.rfqQuoteType.WMS">
                        {{ item.feePrice }}
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
            <!--            报价明细-->

            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" @click="generateQuote">生成报价</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import generateSectionQuote from './generateSectionQuote.js'

export default generateSectionQuote
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>
<style lang="scss" scoped>

.generateSectionQuotePage {
    /deep/ .mycity {
        width: 100%;
        .el-autocomplete{
            width: 100%;
        }
        .ma{
            position: fixed!important;
        }
    }
    .switchDiv {
        padding: 2px 8px;
        border: 1px solid $main-color;
        border-radius: 3px;
        color: $main-color;
        display: inline-block;
        margin-left: 10px;
        vertical-align: top;
        cursor: pointer;

        .name {
            vertical-align: middle;
            margin-left: 8px;
        }

        // &:hover{
        //   color: #fff;
        //   background: $main-color;
        // }
    }
}
</style>
