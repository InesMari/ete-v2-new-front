<template>
    <div id="ownVehicleInfo" class="ownVehicleInfoPage">
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
                    <label class="label-term"><em>*</em>道路运输证</label>
                    <div class="input-text">
                        <myFileModel ref="roadTransportCertificate"
                                     @successCallback="successCallbackRoadTransportCertificate"
                                     @delCallback="delCallbackRoadTransportCertificate" :disabledEdit="isDisable"
                                     :disabledDel="isDisable"></myFileModel>
                    </div>
                </li>
                <li class="item img-upload">
                    <label class="label-term"><em>*</em>车身照片</label>
                    <div class="input-text">
                        <myFileModel ref="carBody" @successCallback="successCallbackCarBody"
                                     @delCallback="delCallbackCarBody" :disabledEdit="isDisable"
                                     :disabledDel="isDisable"></myFileModel>
                        <em style="">注：车身侧45角度拍照</em>
                    </div>
                </li>
                <li class="item img-upload">
                    <label class="label-term">道路运输证示例</label>
                    <div class="input-text">
                        <img src="@/static/image/own_car_img_1.png" alt="" @click="viewExampleImage('own_car_img_1.png', 0)">
                    </div>
                </li>
                <li class="item img-upload">
                    <label class="label-term">车身照片示例</label>
                    <div class="input-text">
                        <img src="@/static/image/own_car_img_4.png" alt="" @click="viewExampleImage('own_car_img_4.png', 3)">
                    </div>
                </li>
            </ul>
            <ul class="content clearfix" v-if="showSinoiovFlag">
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
                    <label class="label-term"><em>*</em>品牌型号</label>
                    <div class="input-text">
                        <el-input v-model="vehicleInfo.brand" maxlength="50" :disabled="isDisable" placeholder="请输入/通过主页识别"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">使用性质</label>
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
                    <label class="label-term">行驶证车型</label>
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
                    <label class="label-term">档案编号</label>
                    <div class="input-text">
                        <el-input v-model="vehicleInfo.fileNumber" :disabled="isDisable" placeholder="请输入/副页识别"></el-input>
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
                    <label class="label-term">总质量</label>
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
                    <label class="label-term">准牵引总质量</label>
                    <div class="input-text">
                        <el-input v-model="vehicleInfo.tractionMass" v-mynumval
                                  :disabled="isDisable" placeholder="请输入/副页识别"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">车长</label>
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
                    <label class="label-term">能源类型</label>
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
                    <label class="label-term">轮胎规格</label>
                    <div class="input-text">
                        <el-input v-model="vehicleInfo.tireSpecification" :disabled="isDisable" placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">前轮个数</label>
                    <div class="input-text">
                        <el-input v-model="vehicleInfo.tiresNumber" v-mynumval :disabled="isDisable" placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">后轮个数</label>
                    <div class="input-text">
                        <el-input v-model="vehicleInfo.rearWheelNumber" v-mynumval :disabled="isDisable" placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">发动机号</label>
                    <div class="input-text">
                        <el-input v-model="vehicleInfo.engineNumber" :disabled="isDisable" placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">排量(L)</label>
                    <div class="input-text">
                        <el-input v-model="vehicleInfo.displacement" :disabled="isDisable" placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">额定功率(kw)</label>
                    <div class="input-text">
                        <el-input v-model="vehicleInfo.ratedPower" :disabled="isDisable" placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">变速箱类型</label>
                    <div class="input-text">
                        <el-select v-model="vehicleInfo.gearboxType" filterable clearable
                                   :disabled="isDisable" placeholder="请选择">
                            <el-option v-for="item in gearboxTypeData" :key="item.codeValue"
                                       :label="item.codeName" :value="item.codeValue">
                            </el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">购置来源</label>
                    <div class="input-text">
                        <el-select v-model="vehicleInfo.purchaseSource" filterable clearable
                                   :disabled="isDisable" placeholder="请选择运输类型">
                            <el-option v-for="item in purchaseSourceData" :key="item.codeValue"
                                       :label="item.codeName" :value="item.codeValue">
                            </el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>购买日期</label>
                    <div class="input-text">
                        <el-date-picker
                                v-model="vehicleInfo.buyDate"
                                type="date" value-format="yyyy-MM-dd"
                                placeholder="请选择" :disabled="isDisable || (type == 2 && vehicleInfo.buyDate != null)">
                        </el-date-picker>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>运输类型</label>
                    <div class="input-text">
                        <el-select v-model="vehicleInfo.transportType" filterable clearable
                                   :disabled="isDisable" placeholder="请选择">
                            <el-option v-for="item in transportTypeData" :key="item.codeValue"
                                       :label="item.codeName" :value="item.codeValue">
                            </el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>车辆销售方</label>
                    <div class="input-text">
                        <el-input v-model="vehicleInfo.vehicleSeller" :disabled="isDisable" placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>购置价格</label>
                    <div class="input-text">
                        <el-input v-model="vehicleInfo.buyPrice" v-mydouble5val :disabled="isDisable" placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>购置税</label>
                    <div class="input-text">
                        <el-input v-model="vehicleInfo.purchaseTax" v-mydouble5val :disabled="isDisable" placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item" >
                    <label class="label-term">绑定挂车</label>
                    <div class="input-text">
                        <el-select v-model="vehicleInfo.trailerId" @clear="onTrailerClear"
                                   placeholder="请选择" filterable clearable :disabled="isDisable">
                            <el-option
                                    v-for="item in trailerData"
                                    :key="item.id"
                                    :label="item.plateNumber"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item item50" >
                    <label class="label-term"><em>*</em>所属公司</label>
                    <div class="input-text">
                        <el-select v-model="vehicleInfo.supplierList" @change="$forceUpdate()"
                                   placeholder="请选择" multiple filterable clearable :disabled="isDisable">
                            <el-option
                                    v-for="item in supplierData"
                                    :key="item.tenantId"
                                    :label="item.supplierName"
                                    :value="item.tenantId">
                                <span style="float: left">{{ item.supplierName }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.linkPhone }}</span>
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

        
        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="viewerImages" :initial-index="currentImageIndex"></fileViewer>
    </div>
</template>

<script>
import ownVehicleInfo from './ownVehicleInfo.js'

export default ownVehicleInfo
</script>

<style lang="scss" scoped>
.ownVehicleInfoPage{
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
