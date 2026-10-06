<template>
    <div id="actualDetail">
        <div class="common-info">
            <div class="detailTitle">2025年【番禺物流基地(达道仓)】实绩汇总表</div>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">总收入：</td>
                    <td class="value">xxxxx</td>
                    <td class="label">总成本：</td>
                    <td class="value">xxxxx</td>
                    <td class="label">利润率：</td>
                    <td class="value">xxxxx</td>
                    <td class="label">毛利率：</td>
                    <td class="value">xxxxx</td>
                    <td class="label">管理费用：</td>
                    <td class="value">xxxxx</td>
                    <td class="label">利润额：</td>
                    <td class="value">xxxxx</td>
                </tr>
            </table>

            <table class="tableCommon mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th width="150">项目名称</th>
                        <th v-for="hd in monthData" :width="hd.width ? hd.width : 100">{{ hd.name }}</th>
                        <th width="100">合计</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in projectNames">
                        <td width="150">{{ item.name }}</td>
                        <td v-for="hd in monthData" :width="hd.width ? hd.width : 100">
                            <el-input v-model="hd[item.code]" placeholder="请输入"></el-input>
                        </td>
                        <td width="100">{{ item.total }}</td>
                    </tr>
                </tbody>
            </table>

            <div class="createView">
                <span>创建人：xxxx</span>
                <span>创建时间：xxxxx</span>
            </div>

            <div class="page-bot-btn">
                <el-button>关闭</el-button>
                <el-button type="primary">导出excel</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import actualDetail from './actualDetail.js'
export default actualDetail
</script>
<style lang="scss" scoped>
#actualDetail {
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

