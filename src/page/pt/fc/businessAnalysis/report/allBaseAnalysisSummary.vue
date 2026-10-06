<template>
    <div id="allBaseAnalysisSummary">
        <div class="common-info">
            <div class="detailTitle">各仓经营结果及分析表 ({{ beginMonth }}至{{ endMonth }})</div>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label" style="background-color: #00b6f7">预算</td>
                    <td class="label">总收入：</td>
                    <td class="value">{{ budgetInfo.totalIncome | permill}}</td>
                    <td class="label">总成本：</td>
                    <td class="value">{{ budgetInfo.totalCost | permill}}</td>
                    <td class="label">毛利率(%)：</td>
                    <td class="value" style="width: 70px!important">{{ budgetInfo.profitRate }}</td>
                    <td class="label">毛利额：</td>
                    <td class="value">{{ budgetInfo.grossProfit | permill}}</td>
                    <td class="label">管理费用：</td>
                    <td class="value">{{ budgetInfo.managementFee | permill}}</td>
                    <td class="label">净利率(%)：</td>
                    <td class="value" style="width: 70px!important">{{ budgetInfo.netProfitRate }}</td>
                    <td class="label">净利润：</td>
                    <td class="value" colspan="3">{{ budgetInfo.netProfit | permill}}</td>
                </tr>
                <tr>
                    <td class="label" style="background-color: #00b6f7">实绩</td>
                    <td class="label">总收入：</td>
                    <td class="value">{{ actualInfo.totalIncome| permill }}</td>
                    <td class="label">总成本：</td>
                    <td class="value">{{ actualInfo.totalCost | permill}}</td>
                    <td class="label">毛利率(%)：</td>
                    <td class="value" style="width: 70px!important">{{ actualInfo.profitRate }}</td>
                    <td class="label">毛利额：</td>
                    <td class="value">{{ actualInfo.grossProfit | permill}}</td>
                    <td class="label">管理费用：</td>
                    <td class="value">{{ actualInfo.managementFee | permill}}</td>
                    <td class="label">净利率(%)：</td>
                    <td class="value" style="width: 70px!important">{{ actualInfo.netProfitRate }}</td>
                    <td class="label">净利润：</td>
                    <td class="value">{{ actualInfo.netProfit | permill}}</td>
                    <td class="label" style="width: 110px">核算净利润：</td>
                    <td class="value">{{ actualInfo.adjustNetProfit | permill}}</td>
                </tr>
            </table>
            <h3 class="common-title"><span class="title-name" style="margin: auto">汇总</span></h3>
            <div class="table_height">
                <table ref="table" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th width="250" rowspan="2">项目名称</th>
                            <th v-for="hd in monthData" colspan="2" :width="hd.width?hd.width:120">{{ hd.month }}</th>
                        </tr>
                        <tr>
                            <th v-for="hd in monthDataDouble" >{{ hd.name }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in projectNames">
                            <td width="150">{{ item.attrName }}</td>
                            <td v-for="hd in summaryList" :width="hd.width ? hd.width : 120">
                              {{ hd[item.attrCode] | permill}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-for="(base,index) in baseList">
                <h3 class="common-title"><span class="title-name" style="margin: auto">{{ base.orgName }}</span></h3>
                <div class="table_height">
                    <table :ref="'table'+index" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                        <thead>
                        <tr>
                            <th width="250" rowspan="2">项目名称</th>
                            <th v-for="hd in monthData" colspan="2" :width="hd.width?hd.width:120">{{ hd.month }}</th>
                        </tr>
                        <tr>
                            <th v-for="hd in monthDataDouble" >{{ hd.name }}</th>
                        </tr>
                        </thead>
                        <tbody>

                        <tr v-for="item in projectNames">
                          <td width="150">{{ item.attrName }}</td>
                          <td v-for="hd in base.data" :width="hd.width ? hd.width : 120">
                            {{ hd[item.attrCode] | permill}}
                          </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="page-bot-btn">
                <el-button @click="closePage">关闭</el-button>
                <el-button @click="exportData" type="primary">导出excel</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import allBaseAnalysisSummary from './allBaseAnalysisSummary.js'
export default allBaseAnalysisSummary
</script>
<style lang="scss" scoped>
#allBaseAnalysisSummary {
    .common-info {
        padding-top: 20px;
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
    .table_height{
        max-height: 500px;
        overflow: auto;
        position: relative;

        thead {
            position: sticky;
            top: 0;
            left: 0;
            z-index: 9;

        }
        
    }
}
</style>

