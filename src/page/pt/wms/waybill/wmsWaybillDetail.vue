<template>
    <div id="wmsWaybillDetail">
        <div class="common-info">
            <h3 class="common-title"><span class="title-name">基本信息</span></h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">配送单号</td>
                    <td class="value">
                        <el-input v-model="waybillInfo.waybillNum" :disabled="true"></el-input>
                    </td>
                    <td class="label">配送托数</td>
                    <td class="value">
                        <el-input v-model="waybillInfo.palletNums" :disabled="true"></el-input>
                    </td>
                    <td class="label">创建人</td>
                    <td class="value">
                        <el-input v-model="waybillInfo.createUserName" :disabled="true"></el-input>
                    </td>
                    <td class="label">创建时间</td>
                    <td class="value">
                        <el-input v-model="waybillInfo.createDate" :disabled="true"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">要求送达时间</td>
                    <td class="value" colspan="3">
                        <el-input v-model="waybillInfo.requireDate" :disabled="true"></el-input>
                    </td>
                    <td class="label">起始地址</td>
                    <td class="value" colspan="3">
                        <el-input v-model="waybillInfo.workAddressStr" :disabled="true"></el-input>
                    </td>
                </tr>
            </table>
            
            <!--            出库物料信息-->
            <h3 class="common-title mt_20">
                <span class="title-name">出/入库物料信息</span>
            </h3>
            <div class="table_height orderInfo" style="overflow-x:auto;">
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                    <tr>
                        <th width="150">出/入库单号</th>
                        <th width="200">货主</th>
                        <th width="200">到货厂商</th>
                        <th width="150">物料编码</th>
                        <th width="150">批次号</th>
                        <th width="150">供应商批次号</th>
                        <th width="150">ASN</th>
                        <th width="100">物料描述</th>
                        <th width="150">作业点</th>
                        <th width="100">卸货点</th>
                        <th width="300">送货卸货地址</th>
                        <th width="100">管理单位</th>
                        <th width="100">出/入库数量</th>
                        <th width="100">出/入库箱数</th>
                        <th width="100">出/入库托数</th>
                        <th width="100">配送数量</th>
                        <th width="100">配送箱数</th>
                        <th width="100">配送托数</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in list">
                        <td><a href="javascript:void(0);" class="link"  @click.stop="toOrderDetail(item)">{{ item.outOrderNum }}</a></td>
                        <td>{{ item.srcTenantName }}</td>
                        <td>{{ item.fromTenantName }}</td>
                        <td>{{ item.materialNum }}</td>
                        <td>{{ item.batchNum }}</td>
                        <td>{{ item.supplierBatchNum }}</td>
                        <td>{{ item.asn }}</td>
                        <td>{{ item.materialDesc }}</td>
                        <td>{{ item.workName }}</td>
                        <td>{{ item.workDetailName }}</td>
                        <td>{{ item.workNameDetail }}</td>
                        <td>{{ item.unitName }}</td>
                        <td>{{ item.nums }}</td>
                        <td>{{ item.boxNums }}</td>
                        <td>{{ item.palletNums }}</td>
                        <td>{{ item.deliveryNums }}</td>
                        <td>{{ item.deliveryBoxNums }}</td>
                        <td>{{ item.deliveryPalletNums }}</td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <td>合计：{{ list.length }}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="red fw">{{ totalInfo.nums }}</td>
                        <td class="red fw">{{ totalInfo.boxNums }}</td>
                        <td class="red fw">{{ totalInfo.palletNums }}</td>
                        <td class="red fw">{{ totalInfo.deliveryNums }}</td>
                        <td class="red fw">{{ totalInfo.deliveryBoxNums }}</td>
                        <td class="red fw">{{ totalInfo.deliveryPalletNums }}</td>
                    </tr>
                    </tfoot>
                </table>
            </div>
            <!--            出库物料信息-->
            
            <!--            运输信息-->
            <h3 class="common-title mt_20">
                <span class="title-name">运输信息</span>
            </h3>
            <div class="innerTable" style="width:100%">
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                    <tr>
                        <th width="19%">供应商</th>
                        <th width="19%">联系人</th>
                        <th width="19%">联系电话</th>
                        <th width="19%">是否加急</th>
                        <th width="19%">是否回单</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            {{ waybillInfo.tenantName }}
                        </td>
                        <td>
                            {{ waybillInfo.linkman }}
                        </td>
                        <td>
                            {{ waybillInfo.linkPhone }}
                        </td>
                        <td>
                            {{ waybillInfo.isUrgentName }}
                        </td>
                        <td>
                            {{ waybillInfo.haveReceiptName }}
                        </td>
                    </tr>
                    </tbody>
                </table>
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                    <tr>
                        <th width="19%">车牌号码</th>
                        <th width="19%">车型/报价车型</th>
                        <th width="19%">车长</th>
                        <th width="19%">司机</th>
                        <th width="19%">司机电话</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            {{ waybillInfo.plateNumber }}
                        </td>
                        <td>
                            {{ waybillInfo.vehicleTypeName }}/{{ waybillInfo.quoteVehicleTypeName }}
                        </td>
                        <td>
                            {{ waybillInfo.vehicleLengthName }}
                        </td>
                        <td>
                            {{ waybillInfo.driverName }}
                        </td>
                        <td>
                            {{ waybillInfo.driverLinkPhone }}
                        </td>
                    </tr>
                    </tbody>
                </table>
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
                    <thead>
                        <tr>
                            <th width="19%">配送时间</th>
                            <th width="19%">是否返程</th>
                            <th width="19%">返程数量</th>
                            <th width="38%">备注</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                {{ waybillInfo.deliveryDate }}
                            </td>
                            <td>
                                {{ waybillInfo.isReturnName }}
                            </td>
                            <td>
                                {{ costInfo.returnNums }}
                            </td>
                            <td>
                                {{ waybillInfo.remark }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!--            运输信息-->
            
<!--            &lt;!&ndash;            运输成本&ndash;&gt;-->
<!--            <h3 class="common-title mt_20">-->
<!--                <span class="title-name">运输成本</span>-->
<!--            </h3>-->
<!--            <div class="tickManager" style="overflow: auto;">-->
<!--                <table class="tableCommon" ref="feeDetail" width="100%" border="0" cellspacing="0" cellpadding="0">-->
<!--                    <thead>-->
<!--                    <tr>-->
<!--                        <th width="19%">计费方式</th>-->
<!--                        <th width="19%">报价车型</th>-->
<!--                        <th width="19%">计费单价</th>-->
<!--                        <th width="19%">{{ costInfo.billingType == 2 ? '计费件数' : '数量'}}</th>-->
<!--                        <th width="19%">运费金额</th>-->
<!--                    </tr>-->
<!--                    </thead>-->
<!--                    <tbody>-->
<!--                    <tr>-->
<!--                        <td>{{ costInfo.billingTypeName }}</td>-->
<!--                        <td>{{ costInfo.quoteVehicleTypeName }}</td>-->
<!--                        <td>{{ costInfo.freightPrice }}</td>-->
<!--                        <td>{{ costInfo.goodsCount }}</td>-->
<!--                        <td>{{ costInfo.freight }}</td>-->
<!--                    </tr>-->
<!--                    </tbody>-->
<!--                </table>-->
<!--            </div>-->
<!--            &lt;!&ndash;            运输成本&ndash;&gt;-->
            
            <!--            短驳配送收入-->
            <h3 class="common-title mt_20">
                <span class="title-name">短驳配送收入</span>
            </h3>
            <div class="tickManager" style="overflow: auto;">
                <table class="tableCommon" ref="feeDetail" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                    <tr>
                        
                        <th width="50">序号</th>
                        <th width="250">货主</th>
                        <th width="150">费用项目名称</th>
                        <th width="100">单位</th>
                        <th width="100">不含税单价</th>
                        <th width="100">税率</th>
                        <th width="100">含税价</th>
                        <th width="100">数量</th>
                        <th width="100">不含税金额</th>
                        <th width="100">含税金额</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index)  in feeList">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.srcTenantName }}</td>
                        <td>{{ item.itemName }}</td>
                        <td>{{ item.unit }}</td>
                        <td>{{ item.price }}</td>
                        <td>{{ item.tax }}</td>
                        <td>{{ item.priceWithTax }}</td>
                        <td>{{ item.num }}</td>
                        <td>{{ item.totalFee }}</td>
                        <td>{{ item.totalFeeWithTax }}</td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <td>合计：</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="red fw">{{ totalInfo.num }}</td>
                        <td class="red fw">{{ totalInfo.totalFee }}</td>
                        <td class="red fw">{{ totalInfo.totalFeeWithTax }}</td>
                    </tr>
                    </tfoot>
                </table>
            </div>
            <!--            短驳配送收入-->

            <!--            仓配项目成本-->
            <h3 class="common-title mt_20">
                <span class="title-name">仓配项目成本</span>
            </h3>
            <div class="tickManager" style="overflow: auto;">
                <table class="tableCommon" ref="feeDetail" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                    <tr>
                        <th width="50">序号</th>
                        <th width="150">费用类型</th>
                        <th width="150">作业名称</th>
                        <th width="100">计费单位</th>
                        <th width="100">外包作业</th>
                        <th width="250">外包供应商</th>
                        <th width="100">未税单价</th>
                        <th width="100">税率(%)</th>
                        <th width="100">含税价</th>
                        <th width="100">数量</th>
                        <th width="100">未税金额</th>
                        <th width="100">含税金额</th>
                        <th width="100">托面积合计(m²)</th>
                        <th width="100">托面积占比(%)</th>
                        <th width="100">实际成本</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index)  in costList">
                        <td>{{index + 1}}</td>
                        <td>{{ item.itemTypeName }}</td>
                        <td>{{ item.itemName }}</td>
                        <td>{{ item.unit }}</td>
                        <td>
                            <el-switch v-model="item.isWorkOrder == 1"
                                       disabled
                                       active-color="#13ce66"
                                       inactive-color="#ff4949"
                                       active-text="是"
                                       inactive-text="否">
                            </el-switch>
                        </td>
                        <td>{{ item.tenantName }}</td>
                        <td>{{ item.price }}</td>
                        <td>{{ item.tax }}</td>
                        <td>{{ item.priceWithTax }}</td>
                        <td>{{ item.num }}</td>
                        <td>{{ item.totalFee }}</td>
                        <td>{{ item.totalFeeWithTax }}</td>
                        <td>{{ item.palletNumsSum }}</td>
                        <td>{{ item.palletNumsPercent }}</td>
                        <td>{{ item.actualCost }}</td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <td>合计：</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="red">{{ totalInfo.costNum }}</td>
                        <td class="red">{{ totalInfo.costTotalFee }}</td>
                        <td class="red">{{ totalInfo.costTotalFeeWithTax }}</td>
                        <td></td>
                        <td></td>
                        <td class="red">{{ totalInfo.actualCost }}</td>
                    </tr>
                    </tfoot>
                </table>
            </div>
            <!--            仓配项目成本-->

            <div id="costList" class="clearfix infoTable" style="padding-top: 5px">
                <h3 class="common-title mt_20">
                    <span class="title-name">本车次毛利率</span>
                </h3>
                <div class="innerTable" style="width: 100%;">
                    <table class="tableCommon" ref="feeDetail" width="100%" border="0" cellspacing="0" cellpadding="0">
                        <thead>
                        <tr>
                            <th width="150">实际成本</th>
                            <th width="150">含税收入</th>
                            <th width="100">本车次毛利率(%)</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{{ costInfo.actualCost }}</td>
                            <td>{{ costInfo.income }}</td>
                            <td>{{ costInfo.profitRate }}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import wmsWaybillDetail from './wmsWaybillDetail.js'

export default wmsWaybillDetail
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>
