<template>
    <div id="driverAssessmentInfo" class="driverAssessmentInfo">
        <div class="common-info">
            <h3 class="pageTitle">{{title}}</h3>
            <table
                    class="fillTbale"
                    width="100%"
                    border="0"
                    cellspacing="0"
                    cellpadding="0">
                <tr>
                    <td class="label"><em>*</em>考评月份</td>
                    <td class="value" colspan="3">
                        <el-date-picker v-model="info.assessmentMonth" :disabled="isDisable" type="month" placeholder="考评月份" value-format="yyyy-MM"></el-date-picker>
                    </td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>司机名称</td>
                    <td class="value">
                        <el-select v-model="info.driverId" @change="changeDriver"
                                   placeholder="请选择司机名称" filterable clearable :disabled="isDisable">
                            <el-option
                                    v-for="item in driverData"
                                    :key="item.id"
                                    :label="item.driverName + '-' + item.driverPhone"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </td>
                    <td class="label">手机号码</td>
                    <td class="value">
                        <el-input v-model="info.driverPhone" placeholder="请选择司机姓名"
                                  maxlength="20" disabled></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">所属公司</td>
                    <td class="value" colspan="3">
                        <el-input v-model="info.supplierName" placeholder="请选择司机姓名" disabled></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>运作数据</td>
                    <td class="value" colspan="3" style="height:60px;">
                        <el-input v-model="info.operationalData" placeholder="请填写运作数据"
                                  :disabled="isDisable"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>车辆点检</td>
                    <td class="value" colspan="3" style="height:60px;">
                        <el-input v-model="info.vehicleInspection" placeholder="请填写车辆点检"
                                  :disabled="isDisable"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>工作态度</td>
                    <td class="value" colspan="3" style="height:60px;">
                        <el-input v-model="info.workAttitude" placeholder="请填写工作态度"
                                  :disabled="isDisable"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>异常点</td>
                    <td class="value" colspan="3" style="height:60px;">
                        <el-input v-model="info.outlier" placeholder="请填写异常点"
                                  :disabled="isDisable"></el-input>
                    </td>
                </tr>
            </table>
            <div class="page-bot-btn ">
                <el-button @click="closePage()">关闭</el-button>
                <el-button type="primary" @click="saveOrUpdateDriverAssessment()" v-show="type == 1 || type == 2">{{type == 1 ? '新增' : '修改'}}</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import driverAssessmentInfo from './driverAssessmentInfo.js'
export default driverAssessmentInfo

</script>
<style lang="scss" scoped>
.driverAssessmentInfo {
    .pageTitle {
        margin-bottom: 25px;
        font-size: 16px;
        font-weight: bold;
        text-align: center;
    }

    .fillTbale td.value {
        text-align: left;
        padding: 0 15px;

        /deep/ .el-input__inner {
            padding: 0;
        }
        /deep/ .el-input__prefix {
            display: none;
        }
    }
}
</style>
