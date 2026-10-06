<template>
    <div id="wmsCostInfo" class="clearfix infoTable" style="padding-top: 5px">
        <h3 class="common-title mt_20">
            <span class="title-name">运输成本</span>
        </h3>
        <div class="innerTable" style="width:100%">
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th width="19%"><em>*</em>计费方式</th>
                    <th width="19%"><em>*</em>报价车型</th>
                    <th width="19%">计费单价</th>
                    <th width="19%">{{ costInfo.billingType == 2 ? '计费件数' : '数量'}}</th>
                    <th width="19%">运费金额</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <el-select v-model="costInfo.billingType" filterable
                                   @change="changeBillingType">
                            <el-option v-for="item in billingTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-select v-model="costInfo.quoteVehicleType" filterable
                                   @change="changeQuoteVehicleType">
                            <el-option v-for="item in quoteVehicleTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-input v-model="costInfo.freightPrice" type="text" disabled></el-input>
                    </td>
                    <td>
                        <el-input v-model="costInfo.goodsCount" type="text" @input="calcCost" maxlength="10" mynumval :disabled="goodsCountDisabled"></el-input>
                    </td>
                    <td>
                        <el-input v-model="costInfo.freight" type="text" mydouble4val></el-input>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import costInfo from './costInfo.js'

export default costInfo
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>
