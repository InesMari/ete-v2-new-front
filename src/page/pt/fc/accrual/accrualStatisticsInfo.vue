<template>
    <div id="accrualStatisticsInfo" class="accrualStatisticsInfo">
        <div class="common-info">
            <h3 class="warehouseTitle">仓库成本计提详情</h3>
            <div class="warehouseInfo clearfix">
                <div class="fl">{{ info.orgName }}</div>
                <div class="fr">
                    {{ info.accrualMonth }}
                    <el-button type="primary" plain size="mini" @click="downloadExcelFile" style="margin-left: 10px;">导出excel</el-button>
                </div>
            </div>

            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th :width="hd.width" v-for="hd in head">{{hd.name}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(data, index) in dataList">
                        <td :rowspan="data.accrualCostTypeRowspan" v-if="data.showAccrualCostType">{{ data.idx }}</td>
                        <td :rowspan="data.accrualCostTypeRowspan" v-if="data.showAccrualCostType">{{ data.accrualCostTypeName }}</td>
                        <td :rowspan="data.accrualCostSubTypeRowspan" v-if="data.showAccrualCostSubType">{{ data.accrualCostSubTypeName }}</td>
                        <td>{{ data.tenantName }}</td>
                        <td>{{ data.totalFee }}</td>
                        <td>{{ data.taxRate }}</td>
                        <td>{{ data.totalTax }}</td>
                        <td>{{ data.totalFeeWithTax }}</td>
                        <td>{{ data.amountNoTax }}</td>
                        <td>{{ data.amount }}</td>
                        <td>{{ data.diff }}</td>
                        <td>{{ data.payFee }}</td>
                        <td>{{ data.noPayFee }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
  
<script>
import accrualStatisticsInfo from './accrualStatisticsInfo.js'
export default accrualStatisticsInfo
</script>
<style lang="scss" scoped>

.accrualStatisticsInfo {
    .warehouseTitle{
        text-align: center;
        font-size: 20px;
        font-weight: bold;
    }
    .tableCommon {
        border: $border;
    }
    .warehouseInfo{
        padding: 0 10px;
        &>div{
            line-height: 40px;
            font-size: 14px;
        }
    }
}
</style>
  