<template>
    <div id="supplierZCQuoteDetail" class="supplierZCQuoteDetailPage">
      <div class="common-info">
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">报价结算单号</td>
                    <td class="value">{{ info.quoteNum }}</td>
                    <td class="label">供应商名称</td>
                    <td class="value">{{ info.tenantName }}</td>
                    <td class="label">报价级别</td>
                    <td class="value">{{ info.quoteLevelName }}</td>
                </tr>
                <tr>
                    <td class="label">线路名称</td>
                    <td class="value">{{ info.routeName }}</td>
                    <td class="label">有效日期</td>
                    <td class="value">{{ info.effectDate + "-" + info.expireDate}}</td>
                    <td class="label">指定客户</td>
                    <td class="value">{{ info.specifyTenantName }}</td>
                </tr>
                <tr>
                    <td class="label">审核状态</td>
                    <td class="value">{{ info.verifyStateName }}</td>
                    <td class="label">审核人</td>
                    <td class="value">{{ info.verifyUserName }}</td>
                    <td class="label">审核时间</td>
                    <td class="value">{{ info.verifyDate }}</td>
                </tr>
                <tr>
                    <td class="label">合同编号</td>
                    <td class="value"><a class="link" @click="toContractDetail(info.contractId)">{{ info.contractNum }}</a></td>
                    <td class="label">申请人</td>
                    <td class="value">{{ info.createUserName }}</td>
                    <td class="label">申请时间</td>
                    <td class="value">{{ info.createDate }}</td>
                </tr>
            </table>
            <el-steps :active="4" align-center>
                <el-step title="起始地" :description="info.sectionData[0].indexSearchStr"></el-step>
                <el-step title="中途点1" :description="info.sectionData.length>2?info.sectionData[1].indexSearchStr:''"></el-step>
                <el-step title="中途点2" :description="info.sectionData.length>3?info.sectionData[2].indexSearchStr:''"></el-step>
                <el-step title="目的地" :description="info.sectionData[info.sectionData.length-1].indexSearchStr"></el-step>
            </el-steps>
            <table class="tableCommon" ref="feeDetail" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th width="100">序号</th>
                    <th width="120">计费方式</th>
                    <th width="120">报价车型</th>
                    <th width="100">车长</th>
                    <th width="100">货物</th>
                    <th width="100">单程运费单价/元</th>
                    <th width="100">往返运费单价/元</th>
                    <th width="100">点位费单价/元</th>
                </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index)  in info.quoteList">
                        <td>{{ index + 1 }}</td>
                        <td>{{item.billingTypeName}}</td>
                        <td>{{ item.quoteVehicleTypeName }}</td>
                        <td>{{ item.vehicleLengthName }}</td>
                        <td>{{ item.goodsName }}</td>
                        <td>{{ item.feePrice }}</td>
                        <td>{{ item.returnPrice }}</td>
                        <td>{{ item.pointFee }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

            <div class="bot-btn ">
                <el-button @click="close()">关闭</el-button>
            </div>
    </div>
</template>

<script>
import supplierZCQuoteDetail from './supplierZCQuoteDetail.js'

export default supplierZCQuoteDetail
</script>
<style lang="scss" scoped>

.supplierZCQuoteDetailPage {
    .tableCommon {
        border: $border;
    }
    /deep/ .el-step{
        padding:30px 0;
        .el-step__icon-inner{
            color: #409EFF;
        }
        .el-step__title{
            color:#333;
            font-size: 14px;
        }
        .el-step__description{
            color: #333;
            font-weight: bold;
            font-size: 14px;
            white-space: nowrap;
        }
    }
}

</style>