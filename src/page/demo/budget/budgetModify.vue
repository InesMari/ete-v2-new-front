<template>
    <div id="budgetModify">
        <div class="common-info">
        <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td class="label">物流基地：</td>
                <td class="value">xxxxx</td>
                <td class="label">到货厂商：</td>
                <td class="value">xxxxx</td>
                <td class="label">管理费率(%)：</td>
                <td class="value" style="width: 45%;">
                    <el-input v-model="value"></el-input>
                </td>
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
    </div>
</div></template>

<script>
import budgetModify from './budgetModify.js'
export default budgetModify
</script>
<style lang="scss" scoped>
#budgetModify {
    .common-info {
        padding-top: 20px;
    }
    

    /deep/ .tableCommon {
        border: $border;

        .el-input__inner {
            text-align: center;
        }
    }
}
</style>

