<template>
    <div id="budgetDetail">
        <div class="common-info">
            <div class="detailTitle">{{info.year}}年【{{info.orgName}}】预算汇总表</div>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">总收入：</td>
                    <td class="value">{{ info.totalIncome | permill}}</td>
                    <td class="label">总成本：</td>
                    <td class="value">{{ info.totalCost | permill}}</td>
                    <td class="label">毛利率(%)：</td>
                    <td class="value">{{ info.profitRate }}</td>
                    <td class="label">毛利额：</td>
                    <td class="value">{{ info.grossProfit | permill}}</td>
                </tr>
                <tr>
                  <td class="label">管理费率(%)：</td>
                  <td class="value">{{ info.managementFeeRate }}</td>
                  <td class="label">管理费用：</td>
                  <td class="value">{{ info.managementFee | permill}}</td>
                  <td class="label">净利率(%)：</td>
                  <td class="value">{{ info.netProfitRate }}</td>
                  <td class="label">净利润：</td>
                  <td class="value">{{ info.netProfit | permill}}</td>
                </tr>
            </table>
            <div class="table_height mt_20">
                <table ref="table" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th width="200">项目名称</th>
                            <th v-for="hd in info.dtls" :width="hd.width ? hd.width : 100">{{ hd.name }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in projectNames">
                            <td width="200">{{ item.attrName }}</td>
                            <td v-for="(hd,hdIdx) in info.dtls" :width="hd.width ? hd.width : 100">
                                {{ hd[item.attrCode] | permill}}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="opView">
                <div class="item">审核人：{{ info.verifyUserName | emptyToStr  }}</div>
                <div class="item">审核状态：{{ info.verifyStsName | emptyToStr  }}</div>
                <div class="item">审核时间：{{ info.verifyDate | emptyToStr  }}</div>
                <div class="item">创建人：{{ info.createUserName | emptyToStr  }}</div>
                <div class="item">创建时间：{{ info.createDate | emptyToStr  }}</div>
                <div class="item">修改人：{{ info.updateUserName | emptyToStr  }}</div>
                <div class="item">修改时间：{{ info.updateDate | emptyToStr  }}</div>
            </div>
            <div class="page-bot-btn" v-if="verifySts == 0">
                <el-button @click="close">关闭</el-button>
                <el-button type="primary" @click="exportExcel">导出excel</el-button>
            </div>
            <div class="page-bot-btn" v-if="verifySts == 1">
                <el-button @click="close">关闭</el-button>
                <el-button type="primary" @click="showVerifyDialog(true)">去审核</el-button>
            </div>
        </div>

        
      <el-dialog title="审核提示" :visible.sync="showVerify" :close-on-click-modal="false" :close-on-press-escape="false" width="620px" @close="showVerifyDialog(false)">
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix">
              <li class="item item50">
                <label class="label-term">物流基地：</label>
                <div class="input-text">{{ info.orgName }}</div>
              </li>
            <li class="item item50">
              <label class="label-term">数据年份：</label>
                <div class="input-text">{{ info.year }}</div>
            </li>
            <li class="item item50">
              <label class="label-term">总收入：</label>
                <div class="input-text">{{ info.totalIncome | permill}}</div>
            </li>
            <li class="item item50">
              <label class="label-term">总成本：</label>
                <div class="input-text">{{ info.totalCost | permill}}</div>
            </li>
            <li class="item item50">
              <label class="label-term">净利率：</label>
                <div class="input-text">{{ info.netProfitRate }}</div>
            </li>
            <li class="item item50">
              <label class="label-term">净利润：</label>
                <div class="input-text">{{ info.netProfit | permill}}</div>
            </li>
            <li class="item item98">
              <label class="label-term">审核备注：</label>
              <div class="input-text">
                <el-input v-model="info.verifyRemark" type="textarea" :rows="2" :autosize="{ minRows: 2, maxRows: 2 }" placeholder="请输入审核备注"></el-input>
              </div>
            </li>
          </ul>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="showVerifyDialog(false)">关闭</el-button>
            <el-button type="danger" size="mini" @click="verify(2)">审核不通过</el-button>
            <el-button type="primary" size="mini" @click="verify(1)">审核通过</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import budgetDetail from './budgetDetail.js'
export default budgetDetail
</script>
<style lang="scss" scoped>
#budgetDetail {
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

    .table_height {
        overflow: auto;
        height: calc(100% - 170px);
        position: relative;

        thead {
            position: sticky;
            top: 0;
            left: 0;
            z-index: 9;

        }
    }
    .opView {
        display: flex;
        margin-top: 10px;

        .item {
            flex-grow: 1;
            text-align: center;
        }
    }
}
</style>

