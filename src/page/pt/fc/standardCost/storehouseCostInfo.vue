<template>
    <div id="storehouseCostInfo">
        <!-- 新增 仓库 -->
        <div class="common-info">
            <ul class="content clearfix">
                <li class="item ">
                    <label class="label-term"><em>*</em>物流基地</label>
                    <div class="input-text">
                        <el-select v-model="info.workId" filterable clearable :disabled="isVisible"
                                   @change="changeWork">
                            <el-option v-for="item in workData" :key="item.workId" :label="item.workName"
                                       :value="item.workId"></el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term"><em>*</em>总面积(㎡)</label>
                    <div class="input-text">
                        <el-input v-model="info.storehouseArea"
                                  @input="changeStorehouseArea"
                                  v-mydoubleval maxlength="10"
                                  placeholder="请输入总面积"
                                  :disabled="isVisible">
                        </el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term"><em>*</em>立库面积(㎡)</label>
                    <div class="input-text">
                        <el-input v-model="info.verticalWarehouseArea"
                                  @input="changeVerticalWarehouseArea"
                                  v-mydoubleval maxlength="10"
                                  placeholder="请输入立库面积"
                                  :disabled="isVisible">
                        </el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term">平库面积(㎡)</label>
                    <div class="input-text">
                        <el-input v-model="info.flatWarehouseArea"
                                  v-mydoubleval maxlength="10"
                                  placeholder="=总面积-平库面积"
                                  :disabled="isVisible">
                        </el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term"><em>*</em>每月总租金</label>
                    <div class="input-text">
                        <el-input v-model="info.monthRent"
                                  @input="changeMonthRent"
                                  v-mydoubleval maxlength="10"
                                  placeholder="请输入每月总租金"
                                  :disabled="isVisible">
                        </el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term"><em>*</em>立库库位数(个)</label>
                    <div class="input-text">
                        <el-input v-model="info.verticalStorage"
                                  @input="changeVerticalStorage"
                                  v-mynumval placeholder="立库库位数(个)"
                                  :disabled="isVisible">
                        </el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term"><em>*</em>每托面积(㎡)</label>
                    <div class="input-text">
                        <el-input v-model="info.palletArea"
                                  @input="changePalletArea"
                                  v-mydoubleval maxlength="10"
                                  placeholder="请输入每托面积"
                                  :disabled="isVisible">
                        </el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term"><em>*</em>板位利用率(%)</label>
                    <div class="input-text">
                        <el-input v-model="info.plateUseRate"
                                  maxlength="10"
                                  @input="changePlateUseRate"
                                  :disabled="isVisible">
                        </el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term"><em>*</em>总库位面积(㎡)</label>
                    <div class="input-text">
                        <el-input v-model="info.storageWarehouseArea"
                                  v-mydoubleval maxlength="10"
                                  placeholder="=库位数*每托面积*板位利用率"
                                  disabled>
                        </el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term"><em>*</em>面积利用率(%)</label>
                    <div class="input-text">
                        <el-input v-model="info.areaUsePercent"
                                  placeholder="=总库位面积/立库面积"
                                  disabled>
                        </el-input>
                    </div>
                </li>

                <li class="item ">
                    <label class="label-term"><em>*</em>成本类型</label>
                    <div class="input-text">
                        <el-select v-model="info.costType" filterable clearable :disabled="isVisible"
                                   @change="changeCostType">
                            <el-option v-for="item in storehouseCostTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term">货架价格(元/月)</label>
                    <div class="input-text">
                        <div style="width: 48%;" class="fl">
                            <el-input v-model="info.shelfPrice"
                                      maxlength="10" @input="changeShelfPrice"
                                      :placeholder="info.costType == 1 ? '不含税单价' : '购买总价'"
                                      :disabled="isVisible">
                            </el-input>
                        </div>
                        <div style="width: 49%;" class="fl">
                            <el-input v-model="info.storageCost"
                                      maxlength="10"
                                      :placeholder="info.costType == 1 ? '单价*库位数' : '总价/60'"
                                      disabled>
                            </el-input>
                        </div>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term">设备费用</label>
                    <div class="input-text">
                        <el-input v-model="info.equipmentCost"
                                  maxlength="10"
                                  @input="changeEquipmentCost"
                                  :disabled="isVisible"></el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term">人员费用</label>
                    <div class="input-text">
                        <el-input v-model="info.personCost"
                                  v-mydoubleval
                                  maxlength="10"
                                  @input="changePersonCost"
                                  :disabled="isVisible">
                        </el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term"><em>*</em>平库成本/㎡</label>
                    <div class="input-text">
                        <el-input v-model="info.flatWarehouseCost"
                                  v-mydoubleval
                                  maxlength="10"
                                  placeholder="=每月总租金/总面积"
                                  disabled>
                        </el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term"><em>*</em>立库成本/㎡</label>
                    <div class="input-text">
                        <el-input v-model="info.verticalWarehouseCost"
                                  v-mydoubleval
                                  maxlength="10"
                                  disabled>
                        </el-input>
                    </div>
                </li>
                <li class="item ">
<!--                    <label class="label-term">水费(元/月/m³)</label>-->
                    <label class="label-term">水费(元/月/㎡)</label>
                    <div class="input-text">
                        <el-input v-model="info.waterCost"
                                  maxlength="10"
                                  @input="changeWaterCost"
                                  :disabled="isVisible">
                        </el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term">仓库保险(元/月/㎡)</label>
                    <div class="input-text">
                        <el-input v-model="info.insuranceCost"
                                  maxlength="10"
                                  @input="changeInsuranceCost"
                                  :disabled="isVisible">
                        </el-input>
                    </div>
                </li>
                <li class="item ">
                    <label class="label-term"><em>*</em>管理成本(%)</label>
                    <div class="input-text">
                        <el-input v-model="info.manageCost"
                                  maxlength="10"
                                  @input="changeManageCost"
                                  :disabled="isVisible">
                        </el-input>
                    </div>
                </li>
            </ul>
            <hr/>
            <ul class="content clearfix mt_20">
                <li class="item item50">
                    <label class="label-term" style="width: 150px;">平库成本合计（含管理费）</label>
                    <div class="input-text" style="width: calc(100% - 160px);">
                        <el-input v-model="info.flatWarehouseAmount" disabled></el-input>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term" style="width: 150px;">立库成本合计（含管理费）</label>
                    <div class="input-text" style="width: calc(100% - 160px);">
                        <el-input v-model="info.verticalWarehouseAmount" disabled></el-input>
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
import storehouseCostInfo from './storehouseCostInfo.js'

export default storehouseCostInfo
</script>
<style lang="scss">
.item33 {
    width: 33% !important;
    margin-right: 0 !important;
}

.item98 {
    width: 98% !important;
}
</style>
