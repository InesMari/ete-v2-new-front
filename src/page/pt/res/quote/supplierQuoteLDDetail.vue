<template>
    <div id="supplierQuoteLDDetail" class="supplierQuoteLDDetailPage">
      <div class="common-info">
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">报价结算单号</td>
                    <td class="value">{{ info.quoteNum }}</td>
                    <td class="label">客户名称</td>
                    <td class="value">{{ info.supplierName }}</td>
                    <td class="label">报价级别</td>
                    <td class="value">{{ info.quoteLevelName }}</td>
                </tr>
                <tr>
                    <td class="label">线路名称</td>
                    <td class="value">{{ info.indexSearchStr }}</td>
                    <td class="label">生效日期</td>
                    <td class="value">{{ info.effectDate }}</td>
                    <td class="label">失效日期</td>
                    <td class="value">{{ info.expireDate }}</td>
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
                    <td class="label">创建人</td>
                    <td class="value">{{ info.createUserName }}</td>
                    <td class="label">创建时间</td>
                    <td class="value">{{ info.createDate }}</td>
                    <td colspan="2"></td>
                </tr>
            </table>
            <el-steps :active="2" align-center>
                <el-step title="起始地" :description="info.beginIndexSearchStr"></el-step>
                <el-step title="目的地" :description="info.endIndexSearchStr"></el-step>
            </el-steps>
            <table class="tableCommon" ref="feeDetail" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th width="100">序号</th>
                    <th width="120">费用类型</th>
                    <th width="120">区间</th>
                    <th width="100">区间单位</th>
                    <th width="100">计费方式</th>
                    <th width="100">货物</th>
                    <th width="100">费用</th>
                </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index)  in info.detailList">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.feeTypeName }}</td>
                        <td>{{ item.rangeStr }}</td>
                        <td>{{ item.rangeUnitName }}</td>
                        <td>{{ item.billingTypeName }}</td>
                        <td>{{ item.goodsNames }}</td>
                        <td>{{ item.fee }}</td>
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
import supplierQuoteLDDetail from './supplierQuoteLDDetail.js'

export default supplierQuoteLDDetail
</script>
<style lang="scss" scoped>

.supplierQuoteLDDetailPage {
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