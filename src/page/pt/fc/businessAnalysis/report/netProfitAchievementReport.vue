<template>
    <div id="netProfitAchievementReport">
        <div class="common-info">
            <div class="detailTitle">净利达成表（年度：{{beginYear}}年  本期时间段：{{beginMonth}}月至{{endMonth}}月）</div>
          <div style="overflow: auto;">
            <table ref="table" class="tableCommon mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th width="120">项目</th>
                        <th v-for="hd in allDatas" :width="hd.width ? hd.width : 120">{{ hd.orgName }}</th>
                        <th width="120">合计</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in projectNames">
                        <td width="120">{{ item.name }}</td>
                        <td v-for="hd in allDatas" :width="hd.width ? hd.width : 120">
                          {{ hd[item.code] | permill}}
                        </td>
                        <td width="120">{{ item.total | permill}}</td>
                    </tr>
                </tbody>
            </table>
          </div>

          <div class="chartView" >
            <div class="item">
              <div class="title clearfix">净利达成分析
              </div>
              <div style="height:350px;width: 100%;" id="chart1"></div>
            </div>
          </div>

            <div class="page-bot-btn">
                <el-button @click="closePage()">关闭</el-button>
                <el-button type="primary" @click="downloadExcel()">导出excel</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import netProfitAchievementReport from './netProfitAchievementReport.js'
export default netProfitAchievementReport
</script>
<style lang="scss" scoped>
#netProfitAchievementReport {
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

  /deep/ .chartView{
    border-bottom: $border;
    background: #fff;
    display: flex;
    padding: 0;;
    .title{
      font-size: 16px;
      font-weight: bold;
      padding: 0 20px;
      line-height: 32px;
    }
    .item{
      flex: 1;
      padding: 30px;
      border-right: $border;
      &:last-child{
        border:none
      }
    }
  }
}
</style>

