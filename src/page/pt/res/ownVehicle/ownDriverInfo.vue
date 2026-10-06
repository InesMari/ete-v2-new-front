<template>
    <div id="ownDriverInfo">
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
            <ul class="content clearfix">
                <li class="item">
                    <label class="label-term"><em>*</em>身份证号</label>
                    <div class="input-text">
                        <el-input v-model="driverInfoData.idCard" @input="loadDriver" placeholder="请填写身份证号"
                                  :disabled="isDisable"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>司机姓名</label>
                    <div class="input-text">
                        <el-input v-model="driverInfoData.driverName" placeholder="请填写司机姓名"
                                  :disabled="isDisable"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>手机号</label>
                    <div class="input-text">
                        <el-input v-model="driverInfoData.driverPhone" v-mynumval placeholder="11位手机号码"
                                  maxlength="11" :disabled="isDisable"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>籍贯</label>
                    <div class="input-text">
                        <el-input v-model="driverInfoData.nativePlace" placeholder="请输入籍贯"
                                  :disabled="isDisable"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>性别</label>
                    <div class="input-text">
                        <el-radio v-model="driverInfoData.sex" :disabled="isDisable"
                                  v-for="item in sexData" :key="item.codeValue" :label="item.codeValue">
                            {{ item.codeName }}
                        </el-radio>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>准驾车型</label>
                    <div class="input-text">
                        <el-select v-model="driverInfoData.driverClass" placeholder="请选择准驾车型" :disabled="isDisable"
                                   clearable>
                            <el-option v-for="item in quasiDrivingTypeData" :key="item.codeValue"
                                       :label="item.codeName" :value="item.codeValue">
                            </el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>驾驶证号</label>
                    <div class="input-text">
                        <el-input v-model="driverInfoData.driverLicence" placeholder="请填写驾驶证号"
                                  :disabled="isDisable"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">从业资格证号</label>
                    <div class="input-text">
                        <el-input v-model="driverInfoData.qualifyCertId" placeholder="请填写从业资格证号"
                                  :disabled="isDisable"></el-input>
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
                                type="date" value-format="yyyy-MM-dd"
                                placeholder="驾驶证生效日期" :disabled="isDisable">
                        </el-date-picker>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>至</label>
                    <div class="input-text">
                        <el-date-picker  value-format="yyyy-MM-dd"
                                         v-model="driverInfoData.expireDate" type="date"
                                         placeholder="驾驶证失效日期" :disabled="isDisable">
                        </el-date-picker>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>入职日期</label>
                    <div class="input-text">
                        <el-date-picker  value-format="yyyy-MM-dd"
                                         v-model="driverInfoData.entryDate" type="date"
                                         placeholder="请选择入职日期" :disabled="isDisable">
                        </el-date-picker>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>入职年龄</label>
                    <div class="input-text">
                        <el-input v-model="driverInfoData.entryAge"  v-mynumval placeholder="请填写入职年龄"
                                  :disabled="isDisable"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>入职驾龄</label>
                    <div class="input-text">
                        <el-input v-model="driverInfoData.entryDriverLicenceAge" v-mynumval placeholder="请填写入职驾龄"
                                  :disabled="isDisable"></el-input>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term"><em>*</em>所属公司</label>
                    <div class="input-text">
                        <el-select v-model="driverInfoData.supplierId" @change="$forceUpdate()"
                                   placeholder="请选择所属公司" clearable filterable :disabled="isDisable">
                            <el-option
                                    v-for="item in supplierData"
                                    :key="item.tenantId"
                                    :label="item.supplierName + '-' + item.linkPhone"
                                    :value="item.tenantId">
                            </el-option>
                        </el-select>
                    </div>
                </li>
              <li class="item">
                <label class="label-term">绑定车辆</label>
                <div class="input-text">
                  <el-select v-model="driverInfoData.vehicleId"
                             placeholder="请选择绑定车辆" filterable clearable :disabled="isDisable">
                    <el-option
                        v-for="item in vehicleData"
                        :key="item.id"
                        :label="item.plateNumber"
                        :value="item.id">
                    </el-option>
                  </el-select>
                </div>
              </li>
            </ul>
        </div>
        <div class="page-bot-btn ">
            <el-button @click="closePage()">关闭</el-button>
            <el-button type="primary" @click="saveDriverInfo()" v-show="type == 1 || type == 2">{{confirmText}}</el-button>
        </div>

    </div>
</template>

<script>
import ownDriverInfo from './ownDriverInfo.js'

export default ownDriverInfo
</script>

<style scoped>

</style>
