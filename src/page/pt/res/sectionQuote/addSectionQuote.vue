<template>
    <div id="addSectionQuote" class="addSectionQuotePage addOrderPage orderPage">
        <div class="common-info">
            <!--            基础信息-->
            <h3 class="common-title"><span class="title-name">基本信息</span></h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label"><em>*</em>报价类型</td>
                    <td class="value">
                        <el-select v-model="order.rfqQuoteType" filterable
                                   @change="changeRfqQuoteType" placeholder="请选择报价类型">
                            <el-option v-for="item in rfqQuoteTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label"><em>*</em>报价级别</td>
                    <td class="value">
                        <el-select v-model="order.quoteLevel" :disabled="quoteLevelDisabled"
                                   @change="changeQuoteLevel" placeholder="请选择报价级别">
                            <el-option v-for="item in quoteLevelData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">账期</td>
                    <td class="value">
                        <el-input v-model="order.accountPeriod" v-mynumval type="text"></el-input>
                    </td>
                    <td class="label"><em>*</em>询价截止时间</td>
                    <td class="value">
                        <my-el-date-picker v-model="order.validDate" @input="forceUpdate"
                                        type="datetimerange" placeholder="请选择日期时间" align="right"
                                        format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm">
                        </my-el-date-picker>
                    </td>
                </tr>
                <tr>
                    <td class="label">客户</td>
                    <td class="value">
                        <el-select v-model="order.tenantId" filterable clearable
                                   allow-create default-first-option
                                   @change="changeTenant" :placeholder="tenantTip">
                            <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name"
                                       :value="item.tenantId"></el-option>
                        </el-select>
                    </td>
                    <td class="label">线路名称</td>
                    <td class="value">
                        <el-select v-model="order.routeId" filterable clearable
                                   allow-create default-first-option @change="changeRoute"
                                   @click.native="selectCustomerTip(1)"
                                   :placeholder="routeTip">
                            <el-option v-for="item in routeData" :key="item.routeId" :label="item.routeName"
                                       :value="item.routeId"></el-option>
                        </el-select>
                    </td>
                    <td class="label">货物</td>
                    <td class="value" colspan="3">
                        <el-select v-model="order.goodsId" filterable clearable multiple
                                   @change="changeGoods" placeholder="请选择货物">
                            <el-option-group v-for="group in goodsGroupData" :key="group.label" :label="group.label">
                                <el-option v-for="item in group.goodsData" :key="item.goodsId" :label="item.goodsName"
                                           :value="item.goodsId" :disabled="item.disabled"></el-option>
                            </el-option-group>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <td class="label">供应商类型</td>
                    <td class="value">
                        <el-select v-model="order.supplierType" filterable clearable
                                   @change="loadSupplierData(true)" placeholder="请选择供应商类型">
                            <el-option v-for="item in supplierTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">主营业务</td>
                    <td class="value">
                        <el-select v-model="order.mainBusiness" filterable clearable
                                   @change="loadSupplierData(true)" placeholder="请选择主营业务">
                            <el-option v-for="item in mainBusinessData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">供应商服务区域</td>
                    <td class="value" colspan="3">
                        <el-select v-model="order.serviceAreas" filterable clearable multiple
                                   @change="loadSupplierData(true)" placeholder="请选择供应商服务区域">
                            <el-option v-for="item in serviceAreasData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>竞价供应商</td>
                    <td class="value" colspan="7">
                        <el-select v-model="order.supplierTenantId" filterable clearable multiple
                                   @change="changeSupplier" @click.native="selectSupplierTip(1)" placeholder="请选择竞价供应商">
                            <el-option v-for="item in supplierData" :key="item.tenantId" :label="item.supplierName"
                                       :value="item.tenantId" :disabled="item.disabled"></el-option>
                        </el-select>
                    </td>
                </tr>
            </table>
            <!--            基础信息-->

            <!--            作业点-->
            <h3 class="common-title mt_20">
                <span class="title-name">作业点信息</span>
              <el-checkbox style="margin-left: 10px;" v-model="order.smsFlag" @change="$forceUpdate()">是否短信推送</el-checkbox>
              <div v-show="showDistance" style="display: inline-block;color:red;margin:5px 0 0 10px;font-weight: bold;">
                    作业点距离：{{ order.predictDistance + "(KM)"}}
                    &nbsp;&nbsp;估算时间：{{ order.predictTime + "(分钟)"}}
                </div>
            </h3>
            <div class="table_height">
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" style="z-index:9;">
                    <thead>
                    <tr>
                        <th width="150">序号</th>
                        <th><em>*</em>作业点/区域</th>
                        <th>详细地址(作业点/区域)</th>
                        <th width="50" v-show="order.rfqQuoteType != enumData.rfqQuoteType.WMS">
                            <el-tooltip effect="dark" content="添加作业点/区域" placement="top-start" :hide-after='1000'>
                                <span @click="addWork()" class="add"></span>
                            </el-tooltip>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(work, index) in workList" v-show="order.rfqQuoteType != enumData.rfqQuoteType.WMS">
                        <td>{{ work.name }}</td>
                        <td>
                            <el-select v-model="work.workId" v-show="order.quoteLevel == enumData.quoteLevel.PRESS_WORK"
                                       @click.native="selectCustomerTip(2)" filterable clearable
                                       @change="changeWork(index, work)" placeholder="请选择作业点">
                                <el-option v-for="item in workData" :key="item.workId" :label="item.workName"
                                           :value="item.workId" :disabled="item.disabled"></el-option>
                            </el-select>
                            <mycity :ref="'city' + index" class="mycity fl mm" selectType="3"
                                    v-show="order.quoteLevel == enumData.quoteLevel.PRESS_REGION"
                                    @selectCallback="selectCallback(index, work)" placeholder="请选择省市区">
                            </mycity>
                        </td>
                        <td>
                            <el-input v-model="work.workAddressStr" :disabled="true" type="text"
                                      placeholder="详细地址" :title="work.workAddressStr"></el-input>
                        </td>
                        <td>
                            <el-tooltip effect="dark" content="删除作业点" placement="top-start" :hide-after='1000'
                                        v-show="index !== 0 && workList.length > 2 && index !== workList.length - 1">
                                <span @click="removeWork(work, index)" class="del"></span>
                            </el-tooltip>
                        </td>
                    </tr>
                    <tr v-show="order.rfqQuoteType == enumData.rfqQuoteType.WMS">
                        <td>{{ '起始地' }}</td>
                        <td>
                            <el-select v-model="begin.workId" filterable clearable
                                       @change="changeBeginWork(begin)" placeholder="请选择起始地">
                                <el-option v-for="item in beginWorkData" :key="item.workId" :label="item.workName"
                                           :value="item.workId" :disabled="item.disabled"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-input v-model="begin.workAddressStr" :disabled="true" type="text"
                                      placeholder="起始地详细地址" :title="begin.workAddressStr"></el-input>
                        </td>
                    </tr>
                    <tr v-show="order.rfqQuoteType == enumData.rfqQuoteType.WMS">
                        <td>{{ '目的地' }}</td>
                        <td>
                            <el-select v-model="end.workId" filterable clearable
                                       @change="changeEndWork(end)" placeholder="请选择目的地">
                                <el-option v-for="item in endWorkData" :key="item.workId" :label="item.workName"
                                           :value="item.workId" :disabled="item.disabled"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-input v-model="end.workAddressStr" :disabled="true" type="text"
                                      placeholder="目的地详细地址" :title="end.workAddressStr"></el-input>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <!--            作业点-->

            <!--            作业要求-->
            <h3 class="common-title mt_20">
                <span class="title-name">作业要求信息</span>
            </h3>
            <div class="table_height">
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                    <tr>
                        <th width="150">序号</th>
                        <th>内容</th>
                        <th width="50">
                            <el-tooltip effect="dark" content="添加作业要求" placement="top-start" :hide-after='1000'>
                                <span @click="addRequirement()" class="add"></span>
                            </el-tooltip>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in requirementList">
                        <td>{{ index + 1 }}</td>
                        <td>
                            <el-input v-model="item.content" type="text" placeholder="作业要求内容"
                                      :title="item.content"></el-input>
                        </td>
                        <td>
                            <el-tooltip effect="dark" content="删除作业要求" placement="top-start" :hide-after='1000'>
                                <span @click="removeRequirement(index)" class="del"></span>
                            </el-tooltip>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <!--            作业要求-->

            <!--            报价明细-->
            <h3 class="common-title mt_20">
                <span class="title-name">报价明细&nbsp;<em>注：相同的起始点、中途点、目的地、计费方式、报价车型、车长、只能存在一条。通用等于全选。</em></span>
            </h3>
            <table ref="scrollTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th width="150">序号</th>
                    <th v-show="order.rfqQuoteType == enumData.rfqQuoteType.LD">费用类型</th>
                    <th>计费方式</th>
                    <th v-show="order.rfqQuoteType != enumData.rfqQuoteType.LD">报价车型</th>
                    <th v-show="order.rfqQuoteType != enumData.rfqQuoteType.LD">车长</th>
                    <th v-show="order.rfqQuoteType == enumData.rfqQuoteType.LD">单位</th>
                    <th v-show="order.rfqQuoteType == enumData.rfqQuoteType.LD">数量区间</th>
                    <th width="50">
                        <el-tooltip effect="dark" content="添加报价" placement="top-start" :hide-after='1000'
                                    style="margin-right: 10px">
                            <span @click="addQuoteItem()" class="add"></span>
                        </el-tooltip>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in quoteList">
                    <td>{{ index + 1 }}</td>
                    <td v-show="order.rfqQuoteType == enumData.rfqQuoteType.LD">
                        <el-select v-model="item.feeType" filterable clearable
                                   @change="changeFeeType(index)" placeholder="请选择费用类型">
                            <el-option v-for="v in item.feeTypeData" :key="v.codeValue" :label="v.codeName"
                                       :value="v.codeValue" :disabled="v.disabled"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-select v-model="item.billingType" filterable clearable
                                   @change="changeBillingType(item)" :disabled="item.billingTypeDisabled"
                                   placeholder="请选择计费方式">
                            <el-option v-for="v in billingTypeData" :key="v.codeValue" :label="v.codeName"
                                       :value="v.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td v-show="order.rfqQuoteType != enumData.rfqQuoteType.LD">
                        <el-select v-model="item.quoteVehicleType" filterable multiple clearable
                                   @change="changeQuoteVehicleType(item)" placeholder="请选择报价车型">
                            <el-option v-for="v in item.quoteVehicleTypeData" :key="v.codeValue" :label="v.codeName"
                                       :value="v.codeValue" :disabled="v.disabled"></el-option>
                        </el-select>
                    </td>
                    <td v-show="order.rfqQuoteType != enumData.rfqQuoteType.LD">
                        <el-select v-model="item.vehicleLength" filterable multiple clearable
                                   @change="changeVehicleLength(item)" :disabled="item.vehicleLengthDisabled"
                                   placeholder="请选择车长">
                            <el-option v-for="v in item.vehicleLengthData" :key="v.codeValue" :label="v.codeName"
                                       :value="v.codeValue" :disabled="v.disabled"></el-option>
                        </el-select>
                    </td>
                    <td v-show="order.rfqQuoteType == enumData.rfqQuoteType.LD">
                        <el-select v-model="item.rangeUnit" filterable clearable placeholder="请选择单位">
                            <el-option v-for="v in item.rangeUnitData" :key="v.codeValue" :label="v.codeName"
                                       :value="v.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td v-show="order.rfqQuoteType == enumData.rfqQuoteType.LD">
                        <el-input v-model="item.rangeStart" v-mydoubleval style="width: 46%"
                                  @input="forceUpdate" placeholder="最小值"></el-input>
                        -
                        <el-input v-model="item.rangeEnd" v-mydoubleval style="width: 46%"
                                  @input="$forceUpdate" placeholder="最大值"></el-input>
                    </td>
                    <td style="border-bottom:0;text-align: left;">
                        <el-tooltip effect="dark" content="删除报价" v-show="quoteList.length > 1"
                                    placement="top-start" :hide-after='1000'>
                            <span @click="removeQuoteItem(index)" class="del"></span>
                        </el-tooltip>
                    </td>
                </tr>
                </tbody>
            </table>
            <!--            报价明细-->

            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" @click="saveSectionQuote">保存</el-button>
            </div>
        </div>

    </div>
</template>

<script>
import addSectionQuote from './addSectionQuote.js'
import enumData from "@/page/pt/enum";

export default addSectionQuote
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>
<style lang="scss" scoped>

.addSectionQuotePage {
    /deep/ .mycity {
        width: 100%;
        .el-autocomplete{
            width: 100%;
        }
        .ma{
            position: fixed!important;
        }
    }
}
</style>
