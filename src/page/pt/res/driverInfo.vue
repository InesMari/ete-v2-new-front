<template>
    <div id="driverInfo">
        <div class="common-info">
            <em style="font-size:14px;padding-left:22px;">注：图片上传大小不能超过2M，请注意压缩处理</em>
            <ul class="content clearfix">
                <li class="item img-upload">
                    <label class="label-term"><em>*</em>身份证正面</label>
                    <div class="input-text">
                        <myFileModel ref="idCardFrontImg"
                                     @successCallback="successCallbackIdCardFront"
                                     @delCallback="delCallbackIdCardFront"
                                     :disabledEdit="isDisable" :disabledDel="isDisable"></myFileModel>
                    </div>
                </li>
                <li class="item img-upload">
                    <label class="label-term"><em>*</em>身份证反面</label>
                    <div class="input-text">
                        <myFileModel ref="idCardBackImg"
                                     @successCallback="successCallbackIdCardBackImg"
                                     @delCallback="delCallbackIdCardBackImg"
                                     :disabledEdit="isDisable" :disabledDel="isDisable"></myFileModel>
                    </div>
                </li>
                <li class="item img-upload">
                    <label class="label-term">从业资格证</label>
                    <div class="input-text">
                        <myFileModel ref="qualifyCertImg"
                                     @successCallback="successCallbackQualifyCertImg"
                                     @delCallback="delCallbackQualifyCertImg"
                                     :disabledEdit="isDisable" :disabledDel="isDisable"></myFileModel>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix">
                <li class="item img-upload">
                    <label class="label-term"><em>*</em>驾驶证正面</label>
                    <div class="input-text">
                        <myFileModel ref="driverLicenceFrontImg"
                                     @successCallback="successCallbackDriverLicenceFrontImg"
                                     @delCallback="delCallbackDriverLicenceFrontImg"
                                     :disabledEdit="isDisable" :disabledDel="isDisable"></myFileModel>
                    </div>
                </li>
                <li class="item img-upload">
                    <label class="label-term"><em>*</em>驾驶证副页</label>
                    <div class="input-text">
                        <myFileModel ref="driverLicenceBackImg"
                                     @successCallback="successCallbackDriverLicenceBackImg"
                                     @delCallback="delCallbackDriverLicenceBackImg"
                                     :disabledEdit="isDisable" :disabledDel="isDisable"></myFileModel>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix" v-if="false">
                <li class="item item100">
                    <label class="label-term">审核状态：</label>
                    <div class="input-text">
                        <el-button type="text" v-for="authStateShowText in authStateShowTextList">{{authStateShowText }}
                        </el-button>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix">
                <li class="item">
                    <label class="label-term"><em>*</em>司机姓名</label>
                    <div class="input-text">
                        <el-input v-model="driverInfoData.driverName" :disabled="type == 0 || type == 2 || type == 4"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>身份证号</label>
                    <div class="input-text">
                        <el-input v-model="driverInfoData.idCard" :disabled="isDisable"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>手机号</label>
                    <div class="input-text">
                        <el-input v-model="driverInfoData.driverPhone" v-mynumval placeholder="11位手机号码"
                                  minlength="11" maxlength="11" :disabled="isDisable"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>准驾车型</label>
                    <div class="input-text">
                        <el-select v-model="driverInfoData.driverClass" placeholder="请选择" :disabled="isDisable"
                                   clearable>
                            <el-option v-for="item in dicQuasiDrivingTypeData" :key="item.codeValue"
                                       :label="item.codeName" :value="item.codeValue">
                            </el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>发证机关</label>
                    <div class="input-text">
                        <el-input v-model="driverInfoData.licenseIssuingAuthority" placeholder="驾驶证发证机关"
                                  :disabled="isDisable"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>有效期</label>
                    <div class="input-text">
                        <el-date-picker
                                v-model="driverInfoData.effectiveDate"
                                type="date"
                                placeholder="驾驶证生效日期" :disabled="isDisable">
                        </el-date-picker>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>至</label>
                    <div class="input-text">
                        <el-date-picker
                                v-model="driverInfoData.expireDate"
                                type="date"
                                placeholder="驾驶证失效效期" :disabled="isDisable">
                        </el-date-picker>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>驾驶证号</label>
                    <div class="input-text">
                        <el-input v-model="driverInfoData.driverLicence" :disabled="isDisable"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>个体供应商</label>
                    <div class="input-text">
                        <el-select v-model="driverInfoData.individualSupplier" placeholder="请选择"
                                   :disabled="isDisable" @change="$forceUpdate()">
                            <el-option v-for="item in whetherData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue">
                            </el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">从业资格证号</label>
                    <div class="input-text">
                        <el-input v-model="driverInfoData.qualifyCertId" placeholder="从业资格证号"
                                  :disabled="isDisable"></el-input>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term"><em>*</em>绑定供应商</label>
                    <div class="input-text">
                        <el-select v-model="driverInfoData.supplierList" @change="$forceUpdate()" placeholder="请选择"
                                   multiple filterable :disabled="isDisable">
                            <el-option
                                    v-for="item in supplierOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">默认车辆</label>
                    <div class="input-text">
                        <el-input v-model="driverInfoData.plateNumber"
                                  placeholder="默认车辆，用于司机接单的时候自动带上该车辆"
                                  :disabled="isDisable"></el-input>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix">
                <li class="item item100" v-show="type == 4" >
                    <label class="label-term"><em>*</em>审核备注</label>
                    <div class="input-text">
                        <el-input v-model="driverInfoData.authRemarkInternal"></el-input>
                    </div>
                </li>
            </ul>

        </div>
        <div class="page-bot-btn ">
            <el-button @click="closePage()">关闭</el-button>
            <el-button type="primary" @click="saveDriverInfo()" v-show="type == 1 || type == 2">提交</el-button>
            <el-button type="danger" @click="audit(11,2)" v-show="type == 4">不通过</el-button>
            <el-button type="primary" @click="audit(11,1)" v-show="type == 4">通过</el-button>
        </div>

    </div>
</template>

<script>
import driverInfo from './driverInfo.js'

export default driverInfo
</script>

<style scoped>

</style>
