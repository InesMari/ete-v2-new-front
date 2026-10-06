<template>
    <div id="budgetModify">
        <div class="common-info">
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">物流基地：</td>
                    <td class="value">{{ info.orgName }}</td>
                    <td class="label">预算年度：</td>
                    <td class="value">{{ info.year }}</td>
                    <td class="label">管理费率(%)：</td>
                    <td class="value" style="width: 45%;">
                        <el-input v-model="info.managementFeeRate"></el-input>
                    </td>
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
                        <tr v-for="item in projectNames">
                            <td width="200">{{ item.attrName }}</td>
                            <td v-for="(hd,hdIdx) in info.dtls" :width="hd.width ? hd.width : 100">
                                <span v-if="item.disable||hdIdx==12">{{ hd[item.attrCode] }}</span>
                                <el-input v-else v-model="hd[item.attrCode]" v-mypmdoublethousandval @input="forceUpdate" @blur="calcRowsTotal(item,hd,hdIdx)" placeholder="请输入"></el-input>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="page-bot-btn">
                <el-button @click="close">关闭</el-button>
                <el-button type="primary" @click="save">确认修改</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import budgetModify from './budgetModify.js'
export default budgetModify
</script>
<style lang="scss" scoped>
#budgetModify {
    .common-info {
        padding-top: 20px;
        height: 100%;
        box-sizing: border-box;
    }


    /deep/ .tableCommon {
        border: $border;

        .el-input__inner {
            text-align: center;
        }
    }

    .table_height {
        overflow: auto;
        height: calc(100% - 100px);
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

