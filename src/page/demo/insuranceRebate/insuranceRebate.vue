<template>
    <div id="insuranceRebate" class="insuranceRebatePage">
        <div class="common-info">
            <div class="tableTitle">广东易迁易信息科技有限公司</div>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">结算主体</td>
                    <td class="value">
                        <el-select v-model="info.tenantId" filterable clearable placeholder="请选择">
                            <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name"
                                :value="item.tenantId"></el-option>
                        </el-select>
                    </td>
                    <td class="label">车牌号码</td>
                    <td class="value">
                        <el-input v-model="info.custOrderNum" type="text" placeholder="请输入"></el-input>
                    </td>
                    <td class="label">险种</td>
                    <td class="value">
                        <el-input v-model="info.custOrderNum" type="text" placeholder="请输入"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">保额</td>
                    <td class="value">
                        <el-input v-model="info.custOrderNum" type="text" placeholder="请输入"></el-input>
                    </td>
                    <td class="label">返点金额</td>
                    <td class="value">
                        <el-input v-model="info.custOrderNum" type="text" placeholder="请输入"></el-input>
                    </td>
                    <td class="label">入账金额</td>
                    <td class="value">
                        <el-input v-model="info.custOrderNum" type="text" placeholder="请输入"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">保险公司</td>
                    <td class="value">
                        <el-input v-model="info.custOrderNum" type="text" placeholder="请输入"></el-input>
                    </td>
                    <td class="label">保险起止</td>
                    <td class="value" colspan="3">
                        <el-date-picker :disabled="disabled" v-model="info.keepDate" type="daterange"
                            value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </td>
                </tr>
                <tr>
                    <td class="label">保险公司</td>
                    <td class="value">
                        <el-select v-model="info.tenantId" filterable clearable placeholder="请选择">
                            <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name"
                                :value="item.tenantId"></el-option>
                        </el-select>
                    </td>
                    <td class="label">保险起止</td>
                    <td class="value" colspan="3">
                        <el-date-picker :disabled="disabled" v-model="info.keepDate" type="daterange"
                            value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </td>
                </tr>
                <tr>
                    <td class="label">附件</td>
                    <td class="value" colspan="5" style="padding: 10px;">
                        <myFileModel ref="file" @successCallback="successCallback" @delCallback="deleteCallback"
                            :disabledEdit="disabled" :disabledDel="disabled"></myFileModel>
                    </td>
                </tr>
            </table>
            <div class="tfootInfo">
                <div class="item">创建人：xxxx</div>
                <div class="item">创建时间：xxxx</div>
                <div class="item">确认人：xxxx</div>
                <div class="item">确认时间：xxxx</div>
            </div>
            <div class="page-bot-btn ">
                <el-button @click="openDialog(false)">关闭</el-button>
                <el-button type="primary" @click="saveGoodsInfo()">提交</el-button>
            </div>
        </div>
    </div>
</template>
  
<script>
import insuranceRebate from './insuranceRebate.js'
export default insuranceRebate
</script>
<style lang="scss" scoped>
.insuranceRebatePage {
    .tableTitle {
        font-weight: bold;
        color: #000;
        margin-bottom: 25px;
        font-size: 16px;
        text-align: center;
    }

    /deep/ .fillTbale {
        .value {
            text-align: left;

            .el-date-editor {
                width: 100%;
            }
        }
    }

    .tfootInfo {
        display: flex;

        .item {
            flex: 1;
            line-height: 50px;
            padding-left: 10px;
            text-align: center;
        }
    }
}</style>