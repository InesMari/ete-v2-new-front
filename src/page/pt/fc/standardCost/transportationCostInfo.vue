<template>
    <div id="transportationCostInfo">
        <!-- 新增 仓库 -->
        <div class="common-info">
            <ul class="content clearfix">
                <li class="item" style="width: 52%;margin: 0">
                    <label class="label-term"><em>*</em>始发地</label>
                    <div class="input-text">
                        <el-select v-model="info.beginProvinceId"
                                   filterable disabled
                                   class="fl"
                                   style="width: auto"
                                   placeholder="省份">
                            <el-option v-for="item in provinceData" :key="item.id" :label="item.name"
                                       :value="item.id"></el-option>
                        </el-select>
                        <el-select v-model="info.beginCityId"
                                   filterable disabled
                                   class="fl"
                                   style="width: auto"
                                   placeholder="城市">
                            <el-option v-for="item in beginCityData" :key="item.id" :label="item.name"
                                       :value="item.id"></el-option>
                        </el-select>
                        <el-select v-model="info.beginDistrictId"
                                   filterable :disabled="beginDistrictDisabled"
                                   class="fl"
                                   style="width: auto"
                                   placeholder="区县">
                            <el-option v-for="item in beginDistrictData" :key="item.id" :label="item.name"
                                       :value="item.id" ></el-option>
                        </el-select>
                        <el-button type="primary" @click="showMap(1, true)" class="fl ml_10">地图选择</el-button>
                        <map-dialog ref="begin"
                                    mapName="begin"
                                    :mapPoint="beginMapPoint"
                                    :isShowMap="beginMapVisible"
                                    :showSure="isVisible"
                                    :showClear="isVisible"
                                    @sureCallback="sureBeginAddress"
                                    @hideMapBack="hideMapBack($event,1)"
                                    :modal="false">
                        </map-dialog>
                    </div>
                </li>
                <li class="item" style="width: 36%;margin-left: -2%">
                    <label class="label-term"><em>*</em>街道地址</label>
                    <div class="input-text">
                        <el-input v-model="info.beginAddress"
                                  :disabled="isVisible"
                                  maxlength="200" placeholder="不需要重复填写省/市/区"></el-input>
                    </div>
                </li>
                <li class="item" style="width: initial;min-width: initial;float: right">
                    <el-button type="danger" v-show="type != 5 && type != 6" @click="clearAddress" class="fl ml_10">清空地址</el-button>
                </li>
                <li class="item" style="width: 52%;margin: 0">
                    <label class="label-term"><em>*</em>目的地</label>
                    <div class="input-text">
                        <el-select v-model="info.endProvinceId" class="fl" style="width: auto"
                                   filterable disabled
                                   placeholder="省份">
                            <el-option v-for="item in provinceData" :key="item.id" :label="item.name"
                                       :value="item.id"></el-option>
                        </el-select>
                        <el-select v-model="info.endCityId" class="fl" style="width: auto"
                                   filterable disabled placeholder="城市">
                            <el-option v-for="item in endCityData" :key="item.id" :label="item.name"
                                       :value="item.id"></el-option>
                        </el-select>
                        <el-select v-model="info.endDistrictId" class="fl" style="width: auto"
                                   filterable :disabled="endDistrictDisabled"
                                   placeholder="区县">
                            <el-option v-for="item in endDistrictData" :key="item.id" :label="item.name"
                                       :value="item.id" ></el-option>
                        </el-select>
                        <el-button type="primary" @click="showMap(2, true)" class="fl ml_10">地图选择</el-button>
                        <map-dialog ref="end"
                                    mapName="end"
                                    :mapPoint="endMapPoint"
                                    :isShowMap="endMapVisible"
                                    :showSure="isVisible"
                                    :showClear="isVisible"
                                    @sureCallback="sureEndAddress"
                                    @hideMapBack="hideMapBack($event,2)"
                                    :modal="false"></map-dialog>
                    </div>
                </li>
                <li class="item" style="width: 36%;margin-left: -2%;margin-right: 0;">
                    <label class="label-term"><em>*</em>街道地址</label>
                    <div class="input-text">
                        <el-input v-model="info.endAddress"
                                  :disabled="isVisible"
                                  maxlength="200" placeholder="不需要重复填写省/市/区"></el-input>
                    </div>
                </li>
                <li class="item" style="width: 12%;min-width: initial;float: right">
                    <label class="label-term" style="width: 48px;">总里程</label>
                    <div class="input-text" style="width: calc(100% - 58px);">
                        <el-input v-model="info.mileage" disabled></el-input>
                    </div>
                </li>

                <li class="item ">
                    <label class="label-term">司机工资含社保(元/月)：</label>
                    <div class="input-text">
                        <el-input v-model="info.driverSalary" @input="changeDriverSalary"
                                  v-mydoubleval :disabled="isVisible"></el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term">司机人数：</label>
                    <div class="input-text">
                        <el-input v-model="info.driverCount" @input="changeDriverCount"
                                  v-mynumval :disabled="isVisible"></el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term">社保公积金(元/月)：</label>
                    <div class="input-text">
                        <el-input v-model="info.socialSecurity"
                                  v-mydoubleval maxlength="50"
                                  @input="changeSocialSecurity"
                                  :disabled="isVisible"
                                  placeholder="请输入" ></el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term">商业险(元/月)：</label>
                    <div class="input-text">
                        <el-input v-model="info.commercialInsurance"
                                  v-mydoubleval maxlength="50"
                                  @input="changeCommercialInsurance"
                                  :disabled="isVisible"
                                  placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term">交强险(元/月)：</label>
                    <div class="input-text">
                        <el-input v-model="info.heavyTrafficInsurance"
                                  v-mydoubleval maxlength="50"
                                  @input="changeHeavyTrafficInsurance"
                                  :disabled="isVisible"
                                  placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term">车辆折旧(元/月)：</label>
                    <div class="input-text">
                        <el-input v-model="info.depreciation"
                                  v-mydoubleval maxlength="50"
                                  @input="changeDepreciation"
                                  :disabled="isVisible"
                                  placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term">GPS服务费(元/月)：</label>
                    <div class="input-text">
                        <el-input v-model="info.gpsServiceCharge"
                                  v-mydoubleval maxlength="50"
                                  @input="changeGpsServiceCharge"
                                  :disabled="isVisible"
                                  placeholder="请输入" ></el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term">月尿素费：</label>
                    <div class="input-text">
                        <el-input v-model="info.ureaFee"
                                  v-mydoubleval maxlength="50"
                                  @input="changeUreaFee"
                                  :disabled="isVisible"
                                  placeholder="请输入" ></el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term">车长：</label>
                    <div class="input-text">
                        <el-select v-model="info.vehicleLength"
                                   filterable clearable
                                   @change="changeVehicleLength"
                                   :disabled="isVisible">
                            <el-option v-for="item in vehicleLengthData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term">能源类型：</label>
                    <div class="input-text">
                        <el-select v-model="info.energyType"
                                   filterable clearable
                                   @change="changeEnergyType"
                                   :disabled="isVisible">
                            <el-option v-for="item in energyTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term">油费/电费：</label>
                    <div class="input-text">
                        <el-input v-model="info.oilFee"
                                  maxlength="50" disabled
                                  placeholder="选择车长和能源类型自动计算"></el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term">路桥费：</label>
                    <div class="input-text">
                        <el-input v-model="info.roadBridgeFee"
                                  v-mydoubleval maxlength="50"
                                  @input="changeRoadBridgeFee"
                                  :disabled="isVisible"
                                  placeholder="请输入" ></el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term">修理费：</label>
                    <div class="input-text">
                        <el-input v-model="info.repairFee"
                                  v-mydoubleval
                                  disabled></el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term">保养费：</label>
                    <div class="input-text">
                        <el-input v-model="info.maintenance"
                                  v-mydoubleval
                                  disabled></el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term">轮胎：</label>
                    <div class="input-text">
                        <el-input v-model="info.tire"
                                  v-mydoubleval maxlength="50"
                                  @input="changeTire"
                                  :disabled="isVisible"
                                  placeholder="请输入" ></el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term">车辆数量：</label>
                    <div class="input-text">
                        <el-input v-model="info.vehicleCount"
                                  v-mynumval
                                  @input="changeVehicleCount"
                                  :disabled="isVisible"
                                  placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term">每月趟数：</label>
                    <div class="input-text">
                        <el-input v-model="info.monthTimes"
                                  v-mynumval
                                  @input="changeMonthTimes"
                                  :disabled="isVisible"
                                  placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term">管理成本(%)：</label>
                    <div class="input-text">
                        <el-input v-model="info.manageCost"
                                  maxlength="50"
                                  @input="changeManageCost"
                                  :disabled="isVisible"
                                  placeholder="请输入"></el-input>
                    </div>
                </li>

                <li class="item item50">
                    <label class="label-term">备注</label>
                    <div class="input-text">
                        <el-input v-model="info.remark"
                                  maxlength="50"
                                  :disabled="isVisible"
                                  placeholder="请输入备注"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">合计：</label>
                    <div class="input-text">
                        <el-input v-model="info.amount" disabled></el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term">单趟成本：</label>
                    <div class="input-text">
                        <el-input v-model="info.cost"
                                  maxlength="50"
                                  v-mydoubleval
                                  disabled></el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term">单趟运输成本(含管理成本)：</label>
                    <div class="input-text">
                        <el-input v-model="info.transportationCost"
                                  maxlength="50" disabled></el-input>
                    </div>
                </li>
            </ul>
            <div class="page-bot-btn ">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" @click="save()" v-show="type != 5 && type != 6">提交</el-button>
            </div>
        </div>

    </div>
</template>

<script>
import transportationCostInfo from './transportationCostInfo.js'

export default transportationCostInfo
</script>
<style lang="scss">

</style>
