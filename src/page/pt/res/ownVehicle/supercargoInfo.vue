<template>
    <div id="supercargoInfo">
        <div class="common-info">
            <em style="font-size:14px;padding-left:22px;">注：图片上传大小不能超过2M，请注意压缩处理</em>
            <ul class="content clearfix">
                <li class="item img-upload">
                    <label class="label-term"><em>*</em>身份证正面</label>
                    <div class="input-text">
                        <myFileModel ref="idCardFrontImg"
                                     @successCallback="successCallbackIdCardFront"
                                     :disabledEdit="isDisable" :disabledDel="isDisable"></myFileModel>
                    </div>
                </li>
                <li class="item img-upload">
                    <label class="label-term"><em>*</em>身份证反面</label>
                    <div class="input-text">
                        <myFileModel ref="idCardBackImg"
                                     @successCallback="successCallbackIdCardBackImg"
                                     :disabledEdit="isDisable" :disabledDel="isDisable"></myFileModel>
                    </div>
                </li>
                <li class="item img-upload">
                    <label class="label-term"><em>*</em>押运证</label>
                    <div class="input-text">
                        <myFileModel ref="supercargoLicenceImg"
                                     @successCallback="successCallbackSupercargoLicenceImg"
                                     :disabledEdit="isDisable" :disabledDel="isDisable"></myFileModel>
                    </div>
                </li>
            </ul>

            <ul class="content clearfix">
                <li class="item item100">
                    <label class="label-term"><em>*</em>性别</label>
                    <div class="input-text">
                        <el-radio :disabled="isDisable" v-model="info.sex"
                                  v-for="item in sexData" :key="item.codeValue" :label="item.codeValue">
                            {{ item.codeName }}
                        </el-radio>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix">
                <li class="item">
                    <label class="label-term"><em>*</em>押运员姓名</label>
                    <div class="input-text">
                        <el-input v-model="info.supercargoName" placeholder="请填写押运员姓名"
                                  maxlength="20" :disabled="isDisable"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>身份证号</label>
                    <div class="input-text">
                        <el-input v-model="info.idCard" placeholder="请填写身份证号"
                                  maxlength="18" :disabled="isDisable"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>手机号码</label>
                    <div class="input-text">
                        <el-input v-model="info.billId" v-mynumval placeholder="11位手机号码"
                                  maxlength="11" :disabled="isDisable"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>押运证证号</label>
                    <div class="input-text">
                        <el-input v-model="info.supercargoLicence" placeholder="请填写押运证证号"
                                  maxlength="30" :disabled="isDisable"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>有效期</label>
                    <div class="input-text">
                        <el-date-picker
                                v-model="info.effectiveDate"
                                type="date" value-format="yyyy-MM-dd"
                                placeholder="押运证生效日期" :disabled="isDisable">
                        </el-date-picker>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>至</label>
                    <div class="input-text">
                        <el-date-picker
                                v-model="info.expireDate" type="date" value-format="yyyy-MM-dd"
                                placeholder="押运证失效日期" :disabled="isDisable">
                        </el-date-picker>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>入职日期</label>
                    <div class="input-text">
                        <el-date-picker
                                v-model="info.entryDate" type="date" value-format="yyyy-MM-dd"
                                placeholder="请选择入职日期" :disabled="isDisable">
                        </el-date-picker>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>入职年龄</label>
                    <div class="input-text">
                        <el-input v-model="info.entryAge" v-mynumval placeholder="请填写入职年龄"
                                  maxlength="3" :disabled="isDisable"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>住址</label>
                    <div class="input-text">
                        <mycity ref="city" :disabled="isDisable" selectType="3" @selectCallback="selectCallback" class="mycity fl city" placeholder="请选择省市区"></mycity>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>入职押运龄</label>
                    <div class="input-text">
                        <el-input v-model="info.entrySupercargoAge" v-mynumval placeholder="请填写入职驾龄"
                                  maxlength="3" :disabled="isDisable"></el-input>
                    </div>
                </li>
                <li class="item" style="width:679px;">
                    <label class="label-term"><em>*</em>绑定司机</label>
                    <div class="input-text">
                        <el-select v-model="info.driverId"
                                   placeholder="请选择绑定司机" filterable clearable :disabled="isDisable">
                            <el-option
                                    v-for="item in driverData"
                                    :key="item.id"
                                    :label="item.driverName + '-' + item.driverPhone"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </li>
            </ul>
        </div>
        <div class="page-bot-btn ">
            <el-button @click="closePage()">关闭</el-button>
            <el-button type="primary" @click="saveOrUpdateVehicleInfo()" v-show="type == 1 || type == 2">{{type == 1 ? '新增' : '修改'}}</el-button>
        </div>
    </div>
</template>

<script>
import supercargoInfo from './supercargoInfo.js'

export default supercargoInfo
</script>

<style scoped lang="scss">
    #supercargoInfo {
        /deep/ .city{
            width: 100%;
            .el-autocomplete {
                width: 100%;
            }
        }
    }
</style>
