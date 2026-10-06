<template>
    <div id="addActual">
        <div class="common-info">
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">物流基地：</td>
                    <td class="value">
                        <el-select v-model="info.orgId" :disabled="disabled" clearable filterable placeholder="请选择">
                            <el-option v-for="item in orgData" :key="item.id" :label="item.orgName" :value="item.id">
                            </el-option>
                        </el-select>
                    </td>
                    <td class="label">实绩年度：</td>
                    <td class="value">
                        <el-date-picker v-model="info.year" :disabled="disabled" type="year" placeholder="预算年度"
                            value-format="yyyy"></el-date-picker>
                    </td>
                </tr>
            </table>
            <div class="table_height mt_20">
                <table ref="table" class="tableCommon mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th width="200">项目名称</th>
                            <th v-for="(hd, hdIdx) in info.dtls" :width="hd.width ? hd.width : 100">{{ hd.name }}
                                <el-tooltip class="item" effect="dark" content="审核通过数据不能修改" placement="top">
                                    <i class="el-icon-lock" v-show="hd.verifySts == 1"></i>
                                </el-tooltip>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in projectNames">
                            <td width="200" v-if="item.show" >{{ item.attrName }}</td>
                            <td v-if="item.show" v-for="(hd, hdIdx) in info.dtls" :width="hd.width ? hd.width : 100">
                                <span v-if="item.disable || hd.verifySts == 1||hdIdx==12">{{ hd[item.attrCode] | permill}}</span>
                                <el-input v-else v-model="hd[item.attrCode]" @input="forceUpdate" v-mypmdoublethousandval
                                    @blur="toCalcRowsTotal(item, hd, hdIdx)" @focus="getCurrentIptIdx(hdIdx)"
                                    placeholder="请输入"></el-input>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="page-bot-btn">
                <el-button @click="close">关闭</el-button>
                <el-button type="primary" @click="save">提交</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import addActual from './addActual.js'
export default addActual
</script>
<style lang="scss" scoped>
#addActual {
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

