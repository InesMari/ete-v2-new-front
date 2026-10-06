<template>
    <div id="addPlan" class="addPlanPage orderPage">
        <div class="common-info">
            <!-- 基本信息 -->
            <h3 class="common-title"><span class="title-name">基本信息</span></h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label"><em>*</em>客户</td>
                    <td class="value">
                        <el-select v-model="orderPlan.orderCustId" placeholder="请选择下单客户" filterable clearable
                                   @change="changeCustomerSelect">
                            <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name"
                                       :value="item.tenantId"></el-option>
                        </el-select>
                    </td>
                    <td class="label"><em>*</em>线路名称</td>
                    <td class="value">
                        <el-select v-model="orderPlan.routeId" @click.native="tipSelectCustomer"
                                   placeholder="请选择线路" filterable clearable @change="changeRouteSelect">
                            <el-option v-for="item in routeData" :key="item.routeId" :label="item.routeName"
                                       :value="item.routeId"></el-option>
                        </el-select>
                    </td>
                    <td class="label"><em>*</em>订单类型</td>
                    <td class="value">
                        <el-select v-model="orderPlan.orderType" placeholder="请选择订单类型" clearable
                                   @change="matchOrderFee">
                            <el-option v-for="item in orderTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label"><em>*</em>是否回单</td>
                    <td class="value">
                        <el-select v-model="orderPlan.isReceipt" placeholder="是否回单" clearable @change="forceUpdate">
                            <el-option v-for="item in receiptData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>起始日期</td>
                    <td class="value">
                        <el-date-picker v-model="orderPlan.startDate" type="date" @change="changeStartDate"
                                        placeholder="选择日期" value-format="yyyy-MM-dd"
                                        :picker-options="pickerOptions" ></el-date-picker>
                    </td>
                    <td class="label"><em>*</em>结束日期</td>
                    <td class="value">
                        <el-date-picker v-model="orderPlan.endDate" type="date" placeholder="选择日期"
                                        value-format="yyyy-MM-dd" :picker-options="pickerOptions_"  :disabled="true"></el-date-picker>
                    </td>
                    <td class="label"><em>*</em>计划单位</td>
                    <td class="value">
                        <el-select v-model="orderPlan.planCompany" placeholder="计划单位" clearable
                                   @change="forceUpdate">
                            <el-option v-for="item in companyData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label"><em>*</em>计划数</td>
                    <td class="value">
                        <el-input v-model="orderPlan.planCount" type="text" @change="forceUpdate"></el-input>
                    </td>
                </tr>
<!--                <tr>-->
<!--                    <td class="label">平台计划编号</td>-->
<!--                    <td class="value" colspan="7">-->
<!--                        <el-input v-model="orderPlan.thrdPlanNum" type="text" @change="forceUpdate"></el-input>-->
<!--                    </td>-->
<!--                </tr>-->
            </table>
            <!-- 作业点信息 -->
            <h3 class="common-title mt_20">
                <span class="title-name">作业点信息</span>
                <div v-show="orderPlan.farthestDistanceInfo"
                     style="display: inline-block;color:red;margin:5px 0 0px 10px;font-weight: bold;">
                    最远距离：{{ orderPlan.farthestDistanceInfo }}
                </div>
                <el-tooltip effect="dark" content="编辑顺序" placement="top-start" :hide-after='1000'>
                    <img src="@/static/image/edit.png" class="edit" alt="" @click="showEditDialog('true')">
                </el-tooltip>
            </h3>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th>作业点顺序</th>
                    <th><em>*</em>作业点</th>
                    <th><em>*</em>作业内容</th>
                    <th>联系人</th>
                    <th>联系手机</th>
                    <th>联系电话</th>
                    <th><em>*</em>详细地址</th>
                    <th width="50"></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in workData" :key="index">
                    <td>{{ index + 1 }}</td>
                    <td>
                        <el-select v-model="item.workId" @click.native="tipSelectCustomer" filterable
                                   placeholder="请选择作业点" @change="changeWorkSelect(index);forceUpdate()">
                            <el-option v-for="work in custWorkData" :key="work.workId" :label="work.workName"
                                       :value="work.workId"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-select v-model="item.workType" placeholder="请选择作业内容"
                                   @change="synchronizationWorkData()">
                            <el-option v-for="work in workTypeData" :key="work.codeValue" :label="work.codeName"
                                       :value="work.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-input v-model="item.linkmanName" type="text" @input="forceUpdate"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.bill" type="text" @input="forceUpdate"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.phone" type="text" @input="forceUpdate"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.workAddressStr" type="text" :disabled="true"></el-input>
                    </td>
                    <td>
                        <el-tooltip effect="dark" content="添加作业点" placement="top-start" :hide-after='1000'
                                    v-show="index==0 && orderPlan.orderType!=3">
                            <span class="add" @click="addWork()"></span>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除作业点" placement="top-start" :hide-after='1000'
                                    v-show="index!=0 && index!=workData.length-1">
                            <span class="del" @click="delWork(index)"></span>
                        </el-tooltip>
                    </td>
                </tr>
                </tbody>
            </table>
            <!-- 收入费用信息 -->
            <h3 class="common-title mt_20"><span class="title-name">单趟收入计费明细</span></h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label"><em>*</em>计费方式</td>
                    <td class="value">
                        <el-select v-model="incomeFee.billingType" @change="matchOrderFee" placeholder="计费方式">
                            <el-option v-for="item in billingTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label"><em>*</em>结算方式</td>
                    <td class="value">
                        <el-select v-model="incomeFee.payMode" clearable placeholder="结算方式">
                            <el-option v-for="item in payModeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">报价车型</td>
                    <td class="value">
                        <el-select v-model="incomeFee.quoteVehicleType" @change="matchOrderFee"
                                   placeholder="请选择报价车型" filterable clearable>
                            <el-option v-for="v in quoteVehicleTypeData" :key="v.codeValue" :label="v.codeName"
                                       :value="v.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">车长</td>
                    <td class="value">
                        <el-select v-model="incomeFee.vehicleLength" filterable clearable @change="matchOrderFee"
                                   placeholder="请选择车长">
                            <el-option v-for="item in vehicleLengthData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                </tr>
            </table>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th width="70">计费单价</th>
                    <th width="70">中途点数</th>
                    <th width="70">点位费</th>
                    <th width="90">点位费合计
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">=中途点数*点位费</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </th>
                    <th width="90">运费
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">按体积：=单价*体积<br/>按净重：=单价*净重<br/>按毛重：=单价*毛重</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </th>
                    <th width="90">收入费用合计
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">=点位费合计+运费</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <el-input v-model="incomeFee.freightPrice" v-mydouble4val @input="calcTotalFee()" type="text"
                                  placeholder=""></el-input>
                    </td>
                    <td>
                        <el-input v-model="workData.length - 2" :disabled="true" type="text" placeholder=""></el-input>
                    </td>
                    <td>
                        <el-input v-model="incomeFee.pointFee" v-mydoubleval @input="changePointFee()" type="text"
                                  placeholder=""></el-input>
                    </td>
                    <td>
                        <el-input v-model="incomeFee.totalPointFee" :disabled="true" type="text"
                                  placeholder=""></el-input>
                    </td>
                    <td>
                        <el-input v-model="incomeFee.freight" v-mydoubleval @input="calcTotalFee()"
                                  :disabled="incomeFee.billingType != 1" type="text" placeholder=""></el-input>
                    </td>
                    <td>
                        <el-input v-model="incomeFee.totalFee" :disabled="true" type="text" placeholder=""></el-input>
                    </td>
                </tr>
                </tbody>
            </table>
            <!-- 成本费用信息 -->
            <h3 class="common-title mt_20"><span class="title-name">单趟成本计费明细</span></h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label"><em>*</em>计费方式</td>
                    <td class="value">
                        <el-select v-model="costFee.billingType" placeholder="计费方式">
                            <el-option v-for="item in billingTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">报价车型</td>
                    <td class="value">
                        <el-select v-model="costFee.quoteVehicleType" placeholder="请选择报价车型" filterable clearable>
                            <el-option v-for="v in quoteVehicleTypeData" :key="v.codeValue" :label="v.codeName"
                                       :value="v.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">车长</td>
                    <td class="value">
                        <el-select v-model="costFee.vehicleLength" filterable clearable placeholder="请选择车长">
                            <el-option v-for="item in vehicleLengthData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">结算主体</td>
                    <td class="value">
                        <el-select v-model="orderPlan.settleBody" filterable clearable placeholder="请选择结算主体">
                            <el-option v-for="item in settleBodyData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>

                </tr>
            </table>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th width="70">计费单价</th>
                    <th width="70">中途点数</th>
                    <th width="70">点位费</th>
                    <th width="90">点位费合计
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">=中途点数*点位费</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </th>
                    <th width="90">运费
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">按体积：=单价*体积<br/>按净重：=单价*净重<br/>按毛重：=单价*毛重</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </th>
                    <th width="90">成本费用合计
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">=点位费合计+运费</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>
                        <el-input v-model="costFee.freightPrice" v-mydouble4val @input="calcCostTotalFee()" type="text"
                                  placeholder=""></el-input>
                    </td>
                    <td>
                        <el-input v-model="workData.length - 2" :disabled="true" type="text" placeholder=""></el-input>
                    </td>
                    <td>
                        <el-input v-model="costFee.pointFee" v-mydoubleval @input="changeCostPointFee()" type="text"
                                  placeholder=""></el-input>
                    </td>
                    <td>
                        <el-input v-model="costFee.totalPointFee" :disabled="true" type="text"
                                  placeholder=""></el-input>
                    </td>
                    <td>
                        <el-input v-model="costFee.freight" v-mydoubleval @input="calcCostTotalFee()"
                                  :disabled="costFee.billingType != 1" type="text" placeholder=""></el-input>
                    </td>
                    <td>
                        <el-input v-model="costFee.totalFee" :disabled="true" type="text" placeholder=""></el-input>
                    </td>
                </tr>
                </tbody>
            </table>
            <!-- 货物信息 -->
            <h3 class="common-title mt_20"><span class="title-name">单趟计划货物信息</span></h3>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th><em>*</em>货物名称</th>
                    <th>货物类别</th>
                    <th>包装</th>
                    <th>提货点</th>
                    <th>卸货点</th>
                    <th>货物件数（件）</th>
                    <th>货物重量（KG）</th>
                    <th>货物体积（m³）</th>
                    <th>规格</th>
                    <th width="50">
                        <el-tooltip effect="dark" content="添加货物" placement="top-start" :hide-after='1000'>
                            <span class="add" @click="addGoods()"></span>
                        </el-tooltip>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in goodsData" :key="index">
                    <td>
                        <!--                        <el-select v-model="item.goodsId" @click.native="tipSelectCustomer" filterable placeholder="请选择货物" @change="changeGoodsSelect(index)">-->
                        <!--                            <el-option v-for="good in custGoodsData" :key="good.goodsId" :label="good.goodsName" :value="good.goodsId"></el-option>-->
                        <!--                        </el-select>-->
                        <el-select v-model="item.goodsId" @click.native="tipSelectCustomer"
                                   @change="changeGoods(item, index)" filterable clearable placeholder="选择货物">
                            <el-option-group v-for="group in goodsGroupData" :key="group.label" :label="group.label">
                                <el-option v-for="goods in group.goodsData" :key="goods.goodsId"
                                           :label="goods.goodsName" :value="goods.goodsId"
                                           :disabled="goods.disabled"></el-option>
                            </el-option-group>
                        </el-select>
                    </td>
                    <td>
                        <el-input v-model="item.className" type="text" :disabled="true"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.packingTypeName" type="text" :disabled="true"></el-input>
                    </td>
                    <td>
                        <el-select v-model="item.beginWorkId" filterable clearable @change="forceUpdate">
                            <el-option v-for="work in carryWorkData" :key="work.workId" :label="work.workName"
                                       :value="work.workId"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-select v-model="item.endWorkId" filterable clearable @change="forceUpdate">
                            <el-option v-for="work in dischargeWorkData" :key="work.workId" :label="work.workName"
                                       :value="work.workId"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-input v-model="item.goodsCount" v-mynumval type="text"
                                  @input="changeGoodsCount(item, index)"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.goodsWeight" v-mydoubleval type="text"
                                  @input="synchronizationGoodsSum()"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.goodsVolume" v-mydoubleval type="text"
                                  @input="synchronizationGoodsSum()"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.goodsModel" type="text" @input="forceUpdate"></el-input>
                    </td>
                    <td>
                        <el-tooltip effect="dark" content="删除货物" placement="top-start" :hide-after='1000'
                                    v-show="index!=0">
                            <span class="del" @click="delGoods(index)"></span>
                        </el-tooltip>
                    </td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <td>合计：</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="red">{{ goodsCountSum }}</td>
                    <td class="red">{{ goodsWeightSum }}</td>
                    <td class="red">{{ goodsVolumeSum }}</td>
                    <td></td>
                    <td></td>
                </tr>
                </tfoot>
            </table>
            <!-- 供应商司机车辆信息 -->
            <h3 class="common-title mt_20"><span class="title-name">绑定供应商</span>
                <div style="display: inline-block;color:red;margin:5px 0 0px 10px;font-weight: bold;">
                    注：只有绑定的供应商对应的司机才可以领单进行运作
                </div>
            </h3>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th width="100">序号</th>
                    <th>供应商</th>
                    <th width="50">
                        <el-tooltip effect="dark" content="添加供应商" placement="top-start" :hide-after='1000'>
                            <span class="add" @click="addSupplier()"></span>
                        </el-tooltip>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in tenantDriverVehicleData" :key="index">
                    <td>
                        {{ index + 1 }}
                    </td>
                    <td>
                        <el-select v-model="item.tenantId" filterable clearable @change="changeSupplier(item,index)">
                            <el-option v-for="supplier in supplierData" :key="supplier.tenantId"
                                       :label="supplier.supplierName" :value="supplier.tenantId"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-tooltip effect="dark" content="删除供应商" placement="top-start" :hide-after='1000'
                                    v-show="index!=0">
                            <span class="del" @click="delSupplier(index)"></span>
                        </el-tooltip>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="bot-btn">
                <el-button @click="close()">关闭</el-button>
                <el-button type="primary" @click="saveOrdPlan()">保存</el-button>
            </div>
        </div>
        <!-- 修改作业点信息顺序 -->
        <el-dialog class="editDialog" title="修改作业点顺序" :visible.sync="showDialog" width="700px"
                   :close-on-click-modal="false" :close-on-press-escape="false">
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th width="100">作业点名称</th>
                    <th width="200">详细地址</th>
                    <th width="100">作业内容</th>
                    <th width="100">作业顺序</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in workData" :key="index">
                    <td>{{ item.workName }}</td>
                    <td>{{ item.workAddressStr }}</td>
                    <td>{{ item.workTypeName }}</td>
                    <td>
                        <el-input v-model="item.subIndex" v-mynumval type="text" placeholder="顺序"
                                  style="text-align:center;"></el-input>
                    </td>
                </tr>
                </tbody>
            </table>
            <div class="page-bot-btn">
                <el-button size="mini" @click="showEditDialog('false')">关闭</el-button>
                <el-button type="primary" size="mini" @click="sumitWorkIndex()">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import addPlan from './addPlan.js'

export default addPlan
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>
