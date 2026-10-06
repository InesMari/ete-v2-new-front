<template>
    <div id="wmsWaybillInfo" class="clearfix infoTable" style="padding-top: 5px">
        <h3 class="common-title mt_20">
            <span class="title-name">运输信息</span>
        </h3>
        <div class="innerTable" style="width:100%">
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th width="19%"><em>*</em>供应商</th>
                    <th width="19%">联系人</th>
                    <th width="19%">联系电话</th>
                    <th width="19%">是否加急</th>
                    <th width="19%">是否回单</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <el-select v-model="waybillInfo.supplierTenantId" placeholder="请选择供应商" filterable clearable
                                   @change="changeSupplier" @click.native="initSupplierData" :disabled="type==2">
                            <el-option v-for="item in supplierData" :key="item.tenantId" :label="item.supplierName"
                                       :value="item.tenantId"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-input v-model="waybillInfo.linkman" type="text" placeholder="联系人" :disabled="type==2"></el-input>
                    </td>
                    <td>
                        <el-input v-model="waybillInfo.linkPhone" type="text" placeholder="联系电话" :disabled="type==2"></el-input>
                    </td>
                    <td>
                        <el-select v-model="waybillInfo.isUrgent" placeholder="是否加急" @change="matchOrderFee" :disabled="type==2">
                            <el-option v-for="item in whetherOptions" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-select v-model="waybillInfo.haveReceipt" placeholder="是否回单" :disabled="type==2">
                            <el-option v-for="item in whetherOptions" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                </tr>
                </tbody>
            </table>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th width="19%"><em>*</em>车牌号码</th>
                    <th width="19%">车型</th>
                    <th width="19%">车长</th>
                    <th width="19%"><em>*</em>司机</th>
                    <th width="19%">司机电话</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <el-select v-model="waybillInfo.vehicleId"
                                   filterable clearable
                                   @change="changeVehicle"
                                   @clear="clearSelVehicleInfo"
                                   placeholder="车牌号码" :disabled="type==2">
                            <el-option v-for="item in vehicleData" :key="item.vehicleId" :label="item.plateNumber"
                                       :value="item.vehicleId"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-select v-model="waybillInfo.vehicleType" placeholder="车型" @change="$forceUpdate"
                                   :disabled="vehicleDisable||type==2" filterable clearable>
                            <el-option v-for="item in vehicleTypeOptions" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-select v-model="waybillInfo.vehicleLength" placeholder="车长" @change="matchOrderFee"
                                   :disabled="vehicleDisable||type==2" filterable clearable>
                            <el-option v-for="item in vehicleLengthOptions" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-select v-model="waybillInfo.driverUserId"
                                   filterable clearable  :disabled="type==2"
                                   @change="changeDriver"
                                   @clear="clearSelDriverInfo"
                                   placeholder="司机">
                            <el-option v-for="item in driverData" :key="item.driverUserId" :label="item.driverName"
                                       :value="item.driverUserId"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-input v-model="waybillInfo.driverLinkPhone"  :disabled="type==2" type="text" placeholder="联系电话"
                                  @input="$forceUpdate"></el-input>
                    </td>
                </tr>
                </tbody>
            </table>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
                <thead>
                <tr>
                    <th width="19%">配送时间</th>
                    <th width="19%">报价车型</th>
                    <th width="19%">是否往返</th>
                  <th width="19%" v-if="type==2&&waybillInfo.isReturn==1">返程数量</th>
                  <th :width="type==1||waybillInfo.isReturn==0?'38%':'19%'">备注</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <my-el-date-picker @input="forceUpdate" v-model="waybillInfo.deliveryDate" type="datetime"
                                           placeholder="请选择日期时间" align="right"  :disabled="type==2"
                                           format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">
                        </my-el-date-picker>
                    </td>
                    <td>
                      <el-select v-model="waybillInfo.quoteVehicleType" placeholder="报价车型" @change="matchOrderFee"  :disabled="type==2" filterable clearable>
                        <el-option v-for="item in quoteVehicleTypeData" :key="item.codeValue" :label="item.codeName"
                                   :value="item.codeValue"></el-option>
                      </el-select>
                    </td>
                    <td>
                      <el-switch v-model="waybillInfo.isReturn == 1"
                                 @change="changeReturn"
                                 active-color="#13ce66"
                                 inactive-color="#ff4949"
                                 active-text="是"
                                 inactive-text="否">
                      </el-switch>
                    </td>
                  <td v-if="type==2&&waybillInfo.isReturn==1">
                    <el-input v-model="waybillInfo.returnNums" @input="changeReturnNums"></el-input>
                  </td>
                    <td>
                        <el-input v-model="waybillInfo.remark"  :disabled="type==2" @input="$forceUpdate();" placeholder="备注"></el-input>
                    </td>
                </tr>
                </tbody>

<!--                <tr>-->
<!--                  <td class="label" width="19%">配送时间</td>-->
<!--                  <td class="value" style="width: 15%;">-->
<!--                    <my-el-date-picker @input="forceUpdate" v-model="waybillInfo.deliveryDate" type="datetime"-->
<!--                                       placeholder="请选择日期时间" align="right"-->
<!--                                       format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss">-->
<!--                    </my-el-date-picker>-->
<!--                  </td>-->
<!--                    <td class="label" width="19%">备注</td>-->
<!--                    <td class="value">-->
<!--                        <el-input v-model="waybillInfo.remark" type="text" placeholder=""-->
<!--                                  @input="$forceUpdate();"></el-input>-->
<!--                    </td>-->
<!--                </tr>-->

            </table>
        </div>

    </div>
</template>

<script>
import waybillInfo from './waybillInfo.js'

export default waybillInfo
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>
