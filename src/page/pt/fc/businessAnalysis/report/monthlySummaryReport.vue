<template>
    <div id="monthlySummaryReport">
        <div class="common-info">
            <div class="detailTitle">预算&实绩数据对比汇总简要报表（{{beginYear}}年{{beginMonth}}月-{{endYear}}年{{endMonth}}月）</div>
            <div style="overflow: auto;">
                <table ref="table" class="tableCommon mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th width="100">预算</th>
                            <th v-for="hd in fcBudgetDtls" :width="hd.width ? hd.width : 120">{{ hd.orgName }}</th>
                            <th width="100">合计</th>
                        </tr>
                    </thead>
                    <tbody>
                      <template v-for="(item ,index) in projectNames">
                          <tr v-if="index<projectNames.length-1">
                              <td width="100">{{ item.name }}</td>
                              <td v-for="hd in fcBudgetDtls" :width="hd.width ? hd.width : 120">
                                {{ hd[item.code] | permill}}
                              </td>
                              <td width="100">{{ item.budgetTotal | permill}}</td>
                          </tr>
                      </template>
                    </tbody>
                </table>
            </div>
        <div style="overflow: auto;">
          <table class="tableCommon mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
            <tr>
              <th width="100">实绩</th>
              <th v-for="hd in fcActualDtls" :width="hd.width ? hd.width : 120">{{ hd.orgName }}</th>
              <th width="100">合计</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in projectNames">
              <td width="100">{{ item.name }}</td>
              <td v-for="hd in fcActualDtls" :width="hd.width ? hd.width : 120">
                {{ hd[item.code] | permill}}
              </td>
              <td width="100">{{ item.actualTotal | permill}}</td>
            </tr>
            </tbody>
          </table>
        </div>
          <div style="overflow: auto;">
            <table class="tableCommon mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
              <thead>
              <tr>
                <th width="100">差异对比</th>
                <th v-for="hd in fcDiffDtls" :width="hd.width ? hd.width : 120">{{ hd.orgName }}</th>
                <th width="100">合计</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="item in projectNames">
                <td width="100">{{ item.name }}</td>
                <td v-for="hd in fcDiffDtls" :width="hd.width ? hd.width : 120">
                  {{ hd[item.code] | permill}}
                </td>
                <td width="100">{{ item.diffTotal | permill}}</td>
              </tr>
              </tbody>
            </table>
          </div>
            <div class="page-bot-btn">
                <el-button @click="closePage()">关闭</el-button>
                <el-button type="primary" @click="downloadExcel()">导出excel</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import monthlySummaryReport from './monthlySummaryReport.js'
export default monthlySummaryReport
</script>
<style lang="scss" scoped>
#monthlySummaryReport {
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
}
</style>

