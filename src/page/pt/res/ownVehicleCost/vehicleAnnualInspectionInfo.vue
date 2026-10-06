<template>
    <div id="vehicleAnnualInspectionInfo" class="addOrderPage orderPage">
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
                  <td class="label"><em>*</em>年检日期</td>
                  <td class="value">
                    <el-date-picker v-model="info.inspectionDate" type="date" placeholder="请选择年检日期"
                                    align="right" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="isDisable">
                    </el-date-picker>
                  </td>
                </tr>
              <tr>
                <td class="label"><em>*</em>年检费用</td>
                <td class="value">
                  <el-input v-model="info.inspectionFee" placeholder="请填写年检费用"
                            :disabled="isDisable"></el-input>
                </td>
                <td class="label"><em>*</em>年检到期日期</td>
                <td class="value">
                  <el-date-picker v-model="info.nextInspectionDate" type="date" placeholder="请选择年检到期日期"
                                  align="right" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="isDisable">
                  </el-date-picker>
                </td>
              </tr>
              <tr>
                <td class="label">车管所</td>
                <td class="value">
                  <el-input v-model="info.vehicleDepartment" placeholder="请填写车管所"
                            :disabled="isDisable"></el-input>
                </td>
                <td class="label">备注</td>
                <td class="value">
                  <el-input v-model="info.remark" placeholder="请填写备注"
                            :disabled="isDisable"></el-input>
                </td>
              </tr>
            </table>
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
                <el-button type="primary" v-show="type == 1 || type == 2" @click="saveOrUpdateInfo">保存</el-button>
                <el-button type="danger" v-show="type == 3" @click="verifyInfo(2)">审核不通过</el-button>
                <el-button type="primary" v-show="type == 3" @click="verifyInfo(1)">审核通过</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import vehicleAnnualInspectionInfo from './vehicleAnnualInspectionInfo.js'

export default vehicleAnnualInspectionInfo
</script>

<style lang="scss">
    @import '@/page/pt/ord/order.scss';
</style>

<style scoped lang="scss">
    #vehicleAnnualInspectionInfo {
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
