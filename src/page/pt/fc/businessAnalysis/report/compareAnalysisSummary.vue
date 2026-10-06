<template>
    <div id="compareAnalysisSummary">
        <div class="common-info">
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">物流基地:</td>
                    <td class="value">
                        <el-input v-model="info.orgName" maxlength="100" disabled></el-input>
                    </td>
                    <td class="label">数据来源:</td>
                    <td class="value">
                        <el-input v-model="info.typeName" maxlength="100" disabled></el-input>
                    </td>
                </tr>
            </table>

            <table class="fillTbale topTable mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label" style="background-color: #00b6f7">{{ beginMonth }}</td>
                    <td class="label">总收入：</td>
                    <td class="value">{{ baseInfo.totalIncome | permill}}</td>
                    <td class="label">总成本：</td>
                    <td class="value">{{ baseInfo.totalCost | permill}}</td>
                    <td class="label">毛利率：</td>
                    <td class="value">{{ baseInfo.profitRate }}</td>
                    <td class="label">毛利额：</td>
                    <td class="value">{{ baseInfo.grossProfit | permill}}</td>
                    <td class="label">管理费用：</td>
                    <td class="value">{{ baseInfo.managementFee | permill}}</td>
                    <td class="label">净利率：</td>
                    <td class="value">{{ baseInfo.netProfitRate }}</td>
                    <td class="label">净利润：</td>
                    <td class="value">{{ baseInfo.netProfit | permill}}</td>
                    <td class="label" v-if="info.type==2" style="width: 120px">核算净利润：</td>
                    <td class="value" v-if="info.type==2">{{ baseInfo.adjustNetProfit | permill}}</td>
                </tr>
                <tr>
                    <td class="label" style="background-color: #00b6f7">{{ endMonth }}</td>
                    <td class="label">总收入：</td>
                    <td class="value">{{ compareInfo.totalIncome | permill}}</td>
                    <td class="label">总成本：</td>
                    <td class="value">{{ compareInfo.totalCost | permill}}</td>
                    <td class="label">毛利率：</td>
                    <td class="value">{{ compareInfo.profitRate }}</td>
                    <td class="label">毛利额：</td>
                    <td class="value">{{ compareInfo.grossProfit | permill}}</td>
                    <td class="label">管理费用：</td>
                    <td class="value">{{ compareInfo.managementFee | permill}}</td>
                    <td class="label">净利率：</td>
                    <td class="value">{{ compareInfo.netProfitRate }}</td>
                    <td class="label">净利润：</td>
                    <td class="value">{{ compareInfo.netProfit | permill}}</td>
                    <td class="label" v-if="info.type==2">核算净利润：</td>
                    <td class="value" v-if="info.type==2">{{ compareInfo.adjustNetProfit | permill}}</td>
                </tr>
                <tr>
                    <td class="label" colspan="2">趋势</td>
                    <td class="value">
                        <img v-if="differ.totalIncome > 0" src="@/static/image/icons/ascend.png" style="height: 30px;">
                        <img v-else-if="differ.totalIncome < 0" src="@/static/image/icons/decline.png" style="height: 30px;">
                        <img v-else src="@/static/image/icons/flat.png" style="height: 30px;">
                        <span :class="{ 
                            'positive': differ.totalIncomePercent > 0, 
                            'flat': differ.totalIncomePercent == 0, 
                            'negative': differ.totalIncomePercent < 0}">{{ differ.totalIncomePercent }}%</span>
                    </td>
                    <td class="label"></td>
                    <td class="value">
                        <img v-if="differ.totalCost > 0" src="@/static/image/icons/ascend.png" style="height: 30px;">
                        <img v-else-if="differ.totalCost < 0" src="@/static/image/icons/decline.png" style="height: 30px;">
                        <img v-else src="@/static/image/icons/flat.png" style="height: 30px;">
                        <span :class="{ 
                            'positive': differ.totalCostPercent > 0, 
                            'flat': differ.totalCostPercent == 0, 
                            'negative': differ.totalCostPercent < 0}">{{ differ.totalCostPercent }}%</span>
                    </td>
                    <td class="label"></td>
                    <td class="value">
                        <img v-if="differ.profitRate > 0" src="@/static/image/icons/ascend.png" style="height: 30px;">
                        <img v-else-if="differ.profitRate < 0" src="@/static/image/icons/decline.png" style="height: 30px;">
                        <img v-else src="@/static/image/icons/flat.png" style="height: 30px;">
                        <span :class="{ 
                            'positive': differ.profitRatePercent > 0, 
                            'flat': differ.profitRatePercent == 0, 
                            'negative': differ.profitRatePercent < 0}">{{ differ.profitRatePercent }}%</span>
                    </td>
                    <td class="label"></td>
                    <td class="value">
                        <img v-if="differ.grossProfit > 0" src="@/static/image/icons/ascend.png" style="height: 30px;">
                        <img v-else-if="differ.grossProfit < 0" src="@/static/image/icons/decline.png" style="height: 30px;">
                        <img v-else src="@/static/image/icons/flat.png" style="height: 30px;">
                        <span :class="{ 
                            'positive': differ.grossProfitPercent > 0, 
                            'flat': differ.grossProfitPercent == 0, 
                            'negative': differ.grossProfitPercent < 0}">{{ differ.grossProfitPercent }}%</span>
                    </td>
                    <td class="label"></td>
                    <td class="value">
                        <img v-if="differ.managementFee > 0" src="@/static/image/icons/ascend.png" style="height: 30px;">
                        <img v-else-if="differ.managementFee < 0" src="@/static/image/icons/decline.png" style="height: 30px;">
                        <img v-else src="@/static/image/icons/flat.png" style="height: 30px;">
                        <span :class="{ 
                            'positive': differ.managementFeePercent > 0, 
                            'flat': differ.managementFeePercent == 0, 
                            'negative': differ.managementFeePercent < 0}">{{ differ.managementFeePercent }}%</span>
                    </td>
                    <td class="label"></td>
                    <td class="value">
                      <img v-if="differ.netProfitRate > 0" src="@/static/image/icons/ascend.png" style="height: 30px;">
                      <img v-else-if="differ.netProfitRate < 0" src="@/static/image/icons/decline.png" style="height: 30px;">
                      <img v-else src="@/static/image/icons/flat.png" style="height: 30px;">
                      <span :class="{
                              'positive': differ.netProfitRatePercent > 0,
                              'flat': differ.netProfitRatePercent == 0,
                              'negative': differ.netProfitRatePercent < 0}">{{ differ.netProfitRatePercent }}%</span>
                    </td>
                    <td class="label"></td>
                    <td class="value">
                        <img v-if="differ.netProfit > 0" src="@/static/image/icons/ascend.png" style="height: 30px;">
                        <img v-else-if="differ.netProfit < 0" src="@/static/image/icons/decline.png" style="height: 30px;">
                        <img v-else src="@/static/image/icons/flat.png" style="height: 30px;">
                        <span :class="{ 
                            'positive': differ.netProfitPercent > 0,
                            'flat': differ.netProfitPercent == 0,
                            'negative': differ.netProfitPercent < 0}">{{ differ.netProfitPercent }}%</span>
                    </td>
                    <td class="label" v-if="info.type==2"></td>
                    <td class="value" v-if="info.type==2">
                      <img v-if="differ.adjustNetProfit > 0" src="@/static/image/icons/ascend.png" style="height: 30px;">
                      <img v-else-if="differ.adjustNetProfit < 0" src="@/static/image/icons/decline.png" style="height: 30px;">
                      <img v-else src="@/static/image/icons/flat.png" style="height: 30px;">
                      <span :class="{
                              'positive': differ.adjustNetProfitPercent > 0,
                              'flat': differ.adjustNetProfitPercent == 0,
                              'negative': differ.adjustNetProfitPercent < 0}">{{ differ.adjustNetProfitPercent }}%</span>
                    </td>
                </tr>
            </table>

            <div class="table_height mt_20">
                <table ref="table" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th width="150">项目名称</th>
                            <th>{{ beginMonth }}</th>
                            <th>{{ endMonth }}</th>
                            <th width="150" >差异</th>
                            <th width="150" >趋势</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in list">
                            <td width="150">{{ item.attrName }}</td>
                            <td>{{ item.base | permill}}</td>
                            <td>{{ item.compare | permill}}</td>
                            <td>{{ item.differ | permill}}</td>
                            <td width="100">
                                <img v-if="item.differ > 0" src="@/static/image/icons/ascend.png" style="height: 30px;">
                                <img v-else-if="item.differ < 0" src="@/static/image/icons/decline.png" style="height: 30px;">
                                <img v-else src="@/static/image/icons/flat.png" style="height: 30px;">
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div class="page-bot-btn">
                <el-button @click="closePage">关闭</el-button>
                <el-button @click="exportData" type="primary">导出excel</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import compareAnalysisSummary from './compareAnalysisSummary.js'
export default compareAnalysisSummary
</script>
<style lang="scss" scoped>
#compareAnalysisSummary {
    .common-info {
        padding-top: 20px;
        height: 100%;
        box-sizing: border-box;
    }

    .detailTitle {
        line-height: 1.5;
        margin-bottom: 20px;
        font-size: 16px;
        text-align: center;
    }

    /deep/ .tableCommon {
        border: $border;

        .el-input__inner {
            text-align: center;
        }
    }

    .createView {
        text-align: right;

        span {
            margin-left: 80px;
            line-height: 40px;
            font-size: 14x;
        }
    }
    .table_height {
        overflow: auto;
        height: calc(100% - 220px);
        position: relative;

        thead {
            position: sticky;
            top: 0;
            left: 0;
            z-index: 9;

        }
    }
    .topTable.fillTbale td.value{
        img{
            vertical-align: bottom;
            margin-right: 12px;
        }
        span{
            vertical-align: super;
            &.positive{
                color: #ef3d2e;
            }
            &.negative{
                color: #1afa29;
            }
            &.flat{
                color: #f4ea2a;
            }
        }
    }
}
</style>

