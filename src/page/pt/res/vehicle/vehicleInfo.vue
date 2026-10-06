<template>
    <div id="vehicleInfo" class="vehicleInfoPage">
        <div class="common-info">
            <em style="font-size:14px;padding-left:22px;">注：图片上传大小不能超过2M，请注意压缩处理</em>
            <ul class="content clearfix">
                <li class="item img-upload">
                    <label class="label-term"><em>*</em>行驶证主页</label>
                    <div class="input-text">
                        <myFileModel ref="vehicleLicenseFront"
                                     @successCallback="successCallbackVehicleLicenseFront"
                                     @delCallback="delCallbackVehicleLicenseFront"
                                     :disabledEdit="isDisable" :disabledDel="isDisable"></myFileModel>
                    </div>
                </li>
                <li class="item img-upload">
                    <label class="label-term"><em>*</em>行驶证副页</label>
                    <div class="input-text">
                        <myFileModel ref="vehicleLicenseBack"
                                     @successCallback="successCallbackVehicleLicenseBack"
                                     @delCallback="delCallbackVehicleLicenseBack"
                                     :disabledEdit="isDisable" :disabledDel="isDisable"></myFileModel>
                    </div>
                </li>
                <li class="item img-upload">
                    <label class="label-term">行驶证主页示例</label>
                    <div class="input-text">
                        <img src="@/static/image/own_car_img_2.png" alt="" @click="viewExampleImage('own_car_img_2.png', 1)">
                    </div>
                </li>
                <li class="item img-upload">
                    <label class="label-term">行驶证副页示例</label>
                    <div class="input-text">
                        <img src="@/static/image/own_car_img_3.png" alt="" @click="viewExampleImage('own_car_img_3.png', 2)">
                    </div>
                </li>
            </ul>
            <ul class="content clearfix">
                <li class="item img-upload">
                    <label class="label-term">道路运输证</label>
                    <div class="input-text">
                        <myFileModel ref="roadTransportCertificate"
                                     @successCallback="successCallbackRoadTransportCertificate"
                                     @delCallback="delCallbackRoadTransportCertificate" :disabledEdit="isDisable"
                                     :disabledDel="isDisable"></myFileModel>
                    </div>
                </li>
                <li class="item img-upload">
                    <label class="label-term">道路运输经营许可证</label>
                    <div class="input-text">
                        <myFileModel ref="roadOperatingPermit" @successCallback="successCallbackRoadOperatingPermit"
                                     @delCallback="delCallbackRoadOperatingPermit" :disabledEdit="isDisable"
                                     :disabledDel="isDisable"></myFileModel>
                    </div>
                </li>
                <li class="item img-upload">
                    <label class="label-term">道路运输证示例</label>
                    <div class="input-text">
                        <img src="@/static/image/own_car_img_1.png" alt="" @click="viewExampleImage('own_car_img_1.png', 0)">
                    </div>
                </li>
                <li class="item img-upload">
                    <label class="label-term">道路运输经营许可证示例</label>
                    <div class="input-text">
                        <img src="@/static/image/own_car_img_6.png" alt="" @click="viewExampleImage('own_car_img_6.png', 3)">
                    </div>
                </li>
            </ul>
            <ul class="content clearfix" v-if="type == 1">
                <li class="item item100">
                    <label class="label-term"><em>*</em>部标机
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">自动创建以及绑定部标机设备</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </label>
                    <div class="input-text">
                        <el-radio :disabled="isDisable" v-model="vehicleInfo.sinoiovFlag"
                                  v-for="item in whetherData" :key="item.codeValue" :label="item.codeValue">
                            {{ item.codeName }}
                        </el-radio>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix">
                <li class="item">
                    <label class="label-term"><em>*</em>车牌号码</label>
                    <div class="input-text">
                        <el-input v-model="vehicleInfo.plateNumber" @blur="inputPlateNumber($event)"
                                  :disabled="isDisable" placeholder="请输入/通过主页识别"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>车辆识别代号</label>
                    <div class="input-text">
                        <el-input v-model="vehicleInfo.vin" :disabled="isDisable" placeholder="请输入/通过主页识别"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>使用性质</label>
                    <div class="input-text">
                        <el-select v-model="vehicleInfo.useCharacter" filterable clearable
                                   :disabled="isDisable" placeholder="请选择/通过主页识别">
                            <el-option v-for="item in vehicleUseCharacterData" :key="item.codeValue"
                                       :label="item.codeName" :value="item.codeValue">
                            </el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>行驶证车型</label>
                    <div class="input-text">
                        <el-select v-model="vehicleInfo.vehicleType" filterable clearable
                                   :disabled="isDisable" placeholder="请选择/通过主页识别">
                            <el-option v-for="item in vehicleTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue">
                            </el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">发证机关</label>
                    <div class="input-text">
                        <el-input v-model="vehicleInfo.issueUnit" :disabled="isDisable" placeholder="请选择/通过主页识别"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>注册日期</label>
                    <div class="input-text">
                        <el-date-picker
                                v-model="vehicleInfo.registerDate"
                                type="date" value-format="yyyy-MM-dd"
                                placeholder="请选择/通过主页识别" :disabled="isDisable">
                        </el-date-picker>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>发证日期</label>
                    <div class="input-text">
                        <el-date-picker
                                v-model="vehicleInfo.issueDate"
                                type="date" value-format="yyyy-MM-dd"
                                placeholder="请选择/通过主页识别" :disabled="isDisable">
                        </el-date-picker>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">所有人</label>
                    <div class="input-text">
                        <el-input v-model="vehicleInfo.vehicleOwner" :disabled="isDisable" placeholder="请输入/通过主页识别"></el-input>
                    </div>
                </li>

                <li class="item">
                    <label class="label-term"><em>*</em>核定载质量</label>
                    <div class="input-text">
                        <el-input v-model="vehicleInfo.loadWeight" v-mynumval
                                  :disabled="isDisable" placeholder="请输入/副页识别"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>总质量</label>
                    <div class="input-text">
                        <el-input v-model="vehicleInfo.totalWeight" v-mynumval
                                  :disabled="isDisable" placeholder="请输入/副页识别"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>车牌颜色</label>
                    <div class="input-text">
                        <el-select v-model="vehicleInfo.licensePlateColor" filterable clearable
                                   placeholder="请选择/副页识别" :disabled="isDisable">
                            <el-option v-for="item in plateColorTypeData" :key="item.codeValue"
                                       :label="item.codeName" :value="item.codeValue">
                            </el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>车长</label>
                    <div class="input-text">
                        <el-select v-model="vehicleInfo.vehicleLength" filterable clearable
                                   :disabled="isDisable" placeholder="请输入/副页识别">
                            <el-option v-for="item in vehicleLengthData" :key="item.codeValue"
                                       :label="item.codeName" :value="item.codeValue">
                            </el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>能源类型</label>
                    <div class="input-text">
                        <el-select v-model="vehicleInfo.energyType" filterable clearable
                                   :disabled="isDisable" placeholder="请选择/副页识别">
                            <el-option v-for="item in vehicleEnergyTypeData" :key="item.codeValue"
                                       :label="item.codeName" :value="item.codeValue">
                            </el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">道路运输证号</label>
                    <div class="input-text">
                        <el-input v-model="vehicleInfo.roadTransportCertificate"
                                  :disabled="isDisable" placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">道路运输经营许可证号</label>
                    <div class="input-text">
                        <el-input v-model="vehicleInfo.roadOperatingPermit"
                                  :disabled="isDisable" placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>报价车型</label>
                    <div class="input-text">
                        <el-select v-model="vehicleInfo.vehicleTypeQuote" filterable clearable placeholder="请选择" :disabled="isDisable">
                            <el-option v-for="item in vehicleTypeQuoteData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                            </el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item item50" >
                    <label class="label-term"><em>*</em>绑定供应商</label>
                    <div class="input-text">
                        <el-select v-model="vehicleInfo.supplierList" @change="$forceUpdate()"
                                   placeholder="请选择" multiple filterable clearable :disabled="isDisable">
                            <el-option
                                    v-for="item in supplierData"
                                    :key="item.tenantId"
                                    :label="item.supplierName + '-' + item.linkPhone"
                                    :value="item.tenantId">
                                <span style="float: left">{{ item.supplierName }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.linkPhone }}</span>
                            </el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term">可查询定位客户</label>
                    <div class="input-text">
                        <el-select v-model="vehicleInfo.custTenantIds" @change="$forceUpdate()" placeholder="请选择" multiple filterable :disabled="isDisable">
                            <el-option
                                    v-for="item in custData"
                                    :key="item.tenantId"
                                    :label="item.name"
                                    :value="item.tenantId">
                            </el-option>
                        </el-select>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix">
                <li class="item item100" v-show="type == 3">
                    <label class="label-term"><em>*</em>审核备注</label>
                    <div class="input-text">
                        <el-input v-model="vehicleInfo.authRemarkInternal"></el-input>
                    </div>
                </li>
            </ul>
        </div>
        <div class="page-bot-btn ">
            <el-button @click="closePage()">关闭</el-button>
            <el-button type="primary" @click="saveOrUpdateVehicleInfo()" v-show="type == 1 || type == 2">{{type == 1 ? '新增' : '修改'}}</el-button>
            <el-button type="danger" @click="audit(12,2)" v-show="type == 3">不通过</el-button>
            <el-button type="primary" @click="audit(12,1)" v-show="type == 3">通过</el-button>
        </div>

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="viewerImages" :initial-index="currentImageIndex"></fileViewer>
    </div>
</template>

<script>
import vehicleInfo from './vehicleInfo.js'

export default vehicleInfo
</script>

<style lang="scss" scoped>
.vehicleInfoPage{
    .common-info .content > .item .input-text{
        img{
            width: 160px;
            height: 110px;
            border-radius: 6px;
            cursor: pointer;
        }
    }
}
</style>
