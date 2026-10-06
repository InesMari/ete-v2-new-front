<template>
    <div id="vehicleFixedCostInfo" class="addOrderPage orderPage">
        <div class="common-info">
            <h3 class="common-title"><span class="title-name">基本信息</span></h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label"><em>*</em>车牌号码</td>
                    <td class="value">
                        <el-select v-model="info.vehicleId" filterable clearable :disabled="isDisable"
                                   placeholder="请选择车牌号" >
                            <el-option v-for="item in vehicleData" :key="item.id" :label="item.plateNumber"
                                       :value="item.id"></el-option>
                        </el-select>
                    </td>
                    <td class="label">备注</td>
                    <td class="value">
                        <el-input v-model="info.remark" placeholder="请填写备注"
                                  :disabled="isDisable"></el-input>
                    </td>
                </tr>
            </table>
            <h3 class="common-title mt_20">
                <span class="title-name">车辆月度固定费用信息</span>
            </h3>
            <div class="table_height">
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                    <tr>
                        <th width="80">序号</th>
                        <th width="140"><em>*</em>费用类型</th>
                        <th width="120"><em>*</em>开始日期</th>
                        <th width="120"><em>*</em>结束日期</th>
                        <th width="180">购买公司</th>
                        <th width="180"><em>*</em>金额(<em style="font-size: 10px;">注： 保险录入的是未税金额</em>)</th>
                        <th width="100">时长(月份数)</th>
                        <th width="100">月平均费用</th>
                        <th width="50" v-show="type == 1 || type == 2">
                            <el-tooltip effect="dark" content="添加" placement="top-start" :hide-after='1000'>
                                <span @click="addItem()" class="add"></span>
                            </el-tooltip>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in feeList">
                        <td>{{ index + 1 }}</td>
                        <td>
                            <el-select v-model="item.feeType" filterable clearable placeholder="请选择费用类型"
                                       :disabled="isDisable">
                                <el-option v-for="item in feeTypeData" :key="item.codeValue" :label="item.codeName"
                                           :value="item.codeValue"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-date-picker v-model="item.startDate" type="date" placeholder="请选择开始日期"
                                            align="right" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                            @change="changeStartDate(item)" :disabled="isDisable">
                            </el-date-picker>
                        </td>
                        <td>
                            <el-date-picker v-model="item.endDate" type="date" placeholder="请选择结束日期"
                                            align="right" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                            @change="changeEndDate(item)" :disabled="isDisable">
                            </el-date-picker>
                        </td>
                        <td>
                            <el-input v-model="item.purchaseCompany" :disabled="isDisable" placeholder="请填写购买公司"></el-input>
                        </td>
                        <td>
                            <el-input v-model="item.fee" @input="changeFee(item)" :disabled="isDisable" v-mydoubleval placeholder="元"></el-input>
                        </td>
                        <td>
                            <el-input v-model="item.month" disabled placeholder="时长(月份数)"></el-input>
                        </td>
                        <td>
                            <el-input v-model="item.monthFee" disabled placeholder="月平均费用"></el-input>
                        </td>
                        <td v-show="type == 1 || type == 2">
                            <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000'>
                                <span @click="removeItem(item, index)" class="del"></span>
                            </el-tooltip>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <h3 class="common-title mt_20">
                <span class="title-name">附件</span>
            </h3>
            <div class="uploadFile clearfix">
                <div class="fl mr_20"  v-for="(item, index) in fileList">
                    <myFileModel :ref="'file' + index" @successCallback="successCallback" @delCallback="delCallback"
                                 :componentId="index" :disabledEdit="isDisable" :disabledDel="isDisable"></myFileModel>
                    <p>只支持.jpg .png .pdf .xls .xlsx格式</p>
                </div>
            </div>
            <table class="fillTbale mt_20" v-show="type == 3" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">审核备注</td>
                    <td class="value" colspan="7">
                        <el-input v-model="verifyRemark" placeholder="请填写审核备注"></el-input>
                    </td>
                </tr>
            </table>

            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" v-show="type == 1 || type == 2" @click="saveOrUpdateVehicleFixedCost">保存</el-button>
                <el-button type="danger" v-show="type == 3" @click="verifyVehicleFixedCost(2)">审核不通过</el-button>
                <el-button type="primary" v-show="type == 3" @click="verifyVehicleFixedCost(1)">审核通过</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import vehicleFixedCostInfo from './vehicleFixedCostInfo.js'

export default vehicleFixedCostInfo
</script>

<style lang="scss">
    @import '@/page/pt/ord/order.scss';
</style>

<style scoped lang="scss">
    #vehicleFixedCostInfo {
        .uploadFile{
            padding: 20px;
            background: #fff;
            border:$border;
            p{
                text-align: center;
            }
            .imgList{
                img{
                    width:110px;
                    height: 110px;
                    border-radius: 5px;
                    overflow: hidden;
                    float: left;
                    margin-left: 20px;
                }
            }
            .form{
                line-height: 110px;
                font-weight: bold;
                font-size: 14px;
                button{
                    margin-left: 20px;
                }
                .el-select .el-input input{
                    color: #0379FF;
                }
            }
        }
    }
</style>
