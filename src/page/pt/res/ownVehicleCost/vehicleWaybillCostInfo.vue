<template>
    <div id="vehicleWaybillCostInfo" class="addOrderPage orderPage">
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
                    <td class="label"><em>*</em>日期</td>
                    <td class="value">
                        <el-date-picker v-model="info.feeDate" type="date" placeholder="请选择日期"
                                        align="right" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
                                        :disabled="isDisable">
                        </el-date-picker>
                    </td>
                    <td class="label">备注(<em style="font-size: 10px;">油费需登记油品，路桥费需登记起止路线</em>)</td>
                    <td class="value">
                        <el-input v-model="info.remark" placeholder="请填写备注"
                                  :disabled="isDisable"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>费用类型</td>
                    <td class="value" colspan="5">
                        <el-radio-group v-model="info.feeType" :disabled="isDisable" @change="changeFeeType">
                            <el-radio :label="item.codeValue" v-for="item in feeTypeData">{{ item.codeName }}</el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr v-show="costPayTypeShow">
                    <td class="label"><em>*</em>支付类型</td>
                    <td class="value" colspan="3">
                        <el-radio-group v-model="info.costPayType" :disabled="isDisable">
                            <el-radio :label="item.codeValue" v-for="item in costPayTypeData">{{ item.codeName }}</el-radio>
                        </el-radio-group>
                    </td>
                    <td class="label"><em>*</em>里程数(km)</td>
                    <td class="value">
                        <el-input v-model="info.mileage" placeholder="请填写里程数"
                                  :disabled="isDisable2"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>数量</td>
                    <td class="value">
                        <el-input v-model="info.num" v-mydoubleval placeholder="请填写数量"
                                  :disabled="isDisable"></el-input>
                    </td>
                    <td class="label"><em>*</em>金额</td>
                    <td class="value">
                        <el-input v-model="info.fee" v-mydoubleval placeholder="请填写金额"
                                  :disabled="isDisable"></el-input>
                    </td>
                    <td class="label">单位</td>
                    <td class="value">
                        <el-input v-model="info.unit" placeholder="请填写单位"
                                  :disabled="isDisable"></el-input>
                    </td>
                </tr>
            </table>
            <h3 class="common-title mt_20">
                <span class="title-name"><em>*</em>附件</span>
            </h3>
            <div class="uploadFile clearfix">
                <div class="fl mr_20"  v-for="(item, index) in fileList">
                    <myFileModel :ref="'file' + index" @successCallback="successCallback" @delCallback="delCallback"
                                 supportFiles="file" :componentId="index" :disabledEdit="isDisable" :disabledDel="isDisable"></myFileModel>
                    <p>只支持.jpg .png .pdf .xls .xlsx格式</p>
                </div>
            </div>
            <h3 class="common-title mt_20">
              <span class="title-name">付款截图</span>
            </h3>
            <div class="uploadFile clearfix">
              <div class="fl mr_20"  v-for="(item, index) in receiptsList">
                <myFileModel :ref="'receipts' + index" @successCallback="successReceiptsCallback" @delCallback="delReceiptsCallback"
                             supportFiles="pdf,img" :componentId="index" :disabledEdit="isDisable" :disabledDel="isDisable"></myFileModel>
                <p>只支持.jpg .png .pdf格式</p>
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
                <el-button type="primary" v-show="type == 1 || type == 2" @click="saveOrUpdateVehicleWaybillCost">保存</el-button>
                <el-button type="danger" v-show="type == 3" @click="verifyVehicleWaybillCost(2)">审核不通过</el-button>
                <el-button type="primary" v-show="type == 3" @click="verifyVehicleWaybillCost(1)">审核通过</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import vehicleWaybillCostInfo from './vehicleWaybillCostInfo.js'

export default vehicleWaybillCostInfo
</script>

<style lang="scss">
    @import '@/page/pt/ord/order.scss';
</style>

<style scoped lang="scss">
    #vehicleWaybillCostInfo {
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
