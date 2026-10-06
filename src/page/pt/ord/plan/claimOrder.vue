<template>
  <div id="claimOrder" class="claimOrderPage orderPage">
    <div class="common-info">
        <h3 class="common-title"><span class="title-name">基本信息</span></h3>
        <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td class="label">订单类型</td>
                <td class="value">
                    <el-input v-model="orderInfo.orderTypeName" type="text" :disabled="true"></el-input>
                </td>
                <td class="label">客户</td>
                <td class="value">
                  <el-input v-model="orderInfo.orderCustName" type="text" :disabled="true"></el-input>
                </td>
                <td class="label">联系人</td>
                <td class="value">
                  <el-input v-model="orderInfo.deliverCustLinkman" type="text"></el-input>
                </td>
                <td class="label">联系电话</td>
                <td class="value">
                  <el-input v-model="orderInfo.deliverCustLinkPhone" type="text"></el-input>
                </td>
            </tr>
            <tr>
                <td class="label">线路名称</td>
                <td class="value">
                    <el-input v-model="orderInfo.routeName" type="text" :disabled="true"></el-input>
                </td>
                <td class="label">是否加急</td>
                <td class="value">
                  <el-select v-model="orderInfo.isUrgent" placeholder="是否加急" @change="forceUpdate">
                    <el-option v-for="item in whetherData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                  </el-select>
                </td>
                <td class="label">客户单号</td>
                <td class="value">
                  <el-input v-model="orderInfo.custOrderNum" type="text"></el-input>
                </td>
                <td class="label">回单份数</td>
                <td class="value">
                  <el-input v-model="orderInfo.receiptNum" type="text" v-mynumval></el-input>
                </td>
            </tr>
        </table>
        <h3 class="common-title mt_20">
            <span class="title-name">作业点信息</span>
        </h3>
        <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
                <tr>
                    <th>作业点顺序</th>
                    <th>作业点</th>
                    <th>作业内容</th>
                    <th>联系人</th>
                    <th>联系手机</th>
                    <th>联系电话</th>
                    <th>详细地址</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,index) in workData" :key="index">
                    <td>{{index+1}}</td>
                    <td>
                        <el-input v-model="item.workName" type="text" :disabled="true"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.workTypeName" type="text" :disabled="true"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.linkmanName" type="text" :disabled="true"></el-input>
                    </td>
                    <td>
                      <el-input v-model="item.bill" type="text" :disabled="true"></el-input>
                    </td>
                    <td>
                      <el-input v-model="item.phone" type="text" :disabled="true"></el-input>
                    </td>
                    <td>
                      <el-input v-model="item.workAddressStr" type="text" :disabled="true"></el-input>
                    </td>
                </tr>
            </tbody>
        </table>
        <table class="tableCommon mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
                <tr>
                    <th>货物名称</th>
                    <th>货物类别</th>
                    <th>包装</th>
                    <th>提货点</th>
                    <th>卸货点</th>
                    <th>可调度件数</th>
                    <th>货物件数（件）</th>
                    <th>可调度重量</th>
                    <th>货物重量（KG）</th>
                    <th>可调度体积</th>
                    <th>货物体积（m³）</th>
                    <th>规格</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,index) in goodsData" :key="index">
                    <td>
                        <el-input v-model="item.goodsName" type="text" :disabled="true"></el-input>
                    </td>
                    <td>
                      <el-input v-model="item.className" type="text" :disabled="true"></el-input>
                    </td>
                    <td>
                      <el-input v-model="item.packingTypeName" type="text" :disabled="true"></el-input>
                    </td>
                    <td>
                      <el-input v-model="item.beginWorkName" type="text" :disabled="true"></el-input>
                    </td>
                    <td>
                      <el-input v-model="item.endWorkName" type="text" :disabled="true"></el-input>
                    </td>
                    <td>
                      <el-input v-model="item.remainGoodsCount" type="text" :disabled="true"></el-input>
                    </td>
                    <td>
                      <el-input v-model="item.goodsCount" v-mynumval type="text" @input="checkRemainGoods(1,index);synchronizationGoodsSum()"></el-input>
                    </td>
                    <td>
                      <el-input v-model="item.remainGoodsWeight" type="text" :disabled="true"></el-input>
                    </td>
                    <td>
                      <el-input v-model="item.goodsWeight" v-mydoubleval type="text" @input="checkRemainGoods(2,index);synchronizationGoodsSum()"></el-input>
                    </td>
                    <td>
                      <el-input v-model="item.remainGoodsVolume" type="text" :disabled="true"></el-input>
                    </td>
                    <td>
                      <el-input v-model="item.goodsVolume" v-mydoubleval type="text" @input="checkRemainGoods(3,index);synchronizationGoodsSum()"></el-input>
                    </td>
                    <td>
                      <el-input v-model="item.goodsModel" type="text" :disabled="true"></el-input>
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
                    <td class="red">{{orderInfo.remainGoodsCountSum}}</td>
                    <td class="red">{{fee.goodsCountSum}}</td>
                    <td class="red">{{orderInfo.remainGoodsWeightSum}}</td>
                    <td class="red">{{fee.goodsWeightSum}}</td>
                    <td class="red">{{orderInfo.remainGoodsVolumeSum}}</td>
                    <td class="red">{{fee.goodsVolumeSum}}</td>
                    <td></td>
                </tr>
            </tfoot>
        </table>
        <table class="fillTbale mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td class="label">计费方式</td>
                <td class="value">
                    <el-select v-model="fee.billingType" placeholder="计费方式" @change="calcTotalFee(0)">
                      <el-option v-for="item in billingTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                    </el-select>
                </td>
                <td class="label">车型</td>
                <td class="value">
                    <el-select v-model="fee.vehicleType" placeholder="请选择车型" @change="forceUpdate">
                      <el-option v-for="item in vehicleTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                    </el-select>
                </td>
                <td class="label">车长</td>
                <td class="value">
                    <el-select v-model="fee.vehicleLength" placeholder="请选择车长" @change="forceUpdate">
                      <el-option v-for="item in vehicleLengthData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                    </el-select>
                </td>
                <td class="label">结算方式</td>
                <td class="value">
                    <el-select v-model="fee.payMode" placeholder="结算方式" @change="changePayMode">
                      <el-option v-for="item in payModeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                    </el-select>
                </td>
            </tr>
        </table>
        <table class="tableCommon mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
                <tr>
                    <th>净重（KG）</th>
                    <th>毛重（KG）</th>
                    <th>计费单价</th>
                    <th>中途点数</th>
                    <th>
                      点位费
                      <el-tooltip class="item" effect="light" placement="top-start">
                        <div slot="content">中途点数*单价</div>
                        <i class="el-icon-question pointer"></i>
                      </el-tooltip>
                    </th>
                    <th>点位费合计</th>
                    <th>
                        运费
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">按重量：单价*重量<br/>按体积：单价*体积</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </th>
                    <th>提货费</th>
                    <th>送货费</th>
                    <th>装货费</th>
                    <th>卸货费</th>
                    <th>其他费</th>
                    <th>
                        费用合计                        
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">运费+装卸费+卸货费+其他费+点位费</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <el-input v-model="fee.netWeight" v-mydouble4val type="text" placeholder="" @input="calcTotalFee()"></el-input>
                    </td>
                    <td>
                        <el-input v-model="fee.grossWeight" v-mydouble4val type="text" placeholder="" @input="calcTotalFee()"></el-input>
                    </td>
                    <td>
                        <el-input v-model="fee.freightPrice" v-show="fee.billingType == 1" v-mydoubleval @input="calcTotalFee(1)" type="text" placeholder=""></el-input>
                        <el-input v-model="fee.freightPrice" v-show="fee.billingType != 1" v-mydouble4val @input="calcTotalFee(1)" type="text" placeholder=""></el-input>
                    </td>
                    <td>
                        {{middleCount}}
                    </td>
                    <td>
                        <el-input v-model="fee.pointFee" v-mydoubleval type="text" placeholder="" @input="changePointFee()"></el-input>
                    </td>
                    <td>
                        {{fee.totalPointFee}}
                    </td>
                    <td>
                        <el-input v-model="fee.freight" v-mydoubleval type="text" placeholder="" @input="calcTotalFee(2)"></el-input>
                    </td>
                    <td>
                      <el-input v-model="fee.pickupFee" v-mydoubleval @input="calcTotalFee()" type="text" placeholder=""></el-input>
                    </td>
                    <td>
                      <el-input v-model="fee.deliveryFee" v-mydoubleval @input="calcTotalFee()" type="text" placeholder=""></el-input>
                    </td>
                    <td>
                        <el-input v-model="fee.loadingFee" v-mydoubleval type="text" placeholder="" @input="calcTotalFee()"></el-input>
                    </td>
                    <td>
                        <el-input v-model="fee.dischargeFee" v-mydoubleval type="text" placeholder="" @input="calcTotalFee()"></el-input>
                    </td>
                    <td>
                        <el-input v-model="fee.otherFee" v-mydoubleval type="text" placeholder="" @input="calcTotalFee()"></el-input>
                    </td>
                    <td>
                        {{fee.totalFee}}
                    </td>
                </tr>
            </tbody>
        </table>        
        <table class="tableCommon mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
                <tr>
                    <th>提付</th>
                    <th>现付</th>
                    <th>回单付</th>
                    <th>月结</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <el-input v-model="fee.pickupPay" @input="changePayMode(2)" :disabled="fee.payModeItemDisabled" v-mydoubleval type="text" placeholder=""></el-input>
                    </td>
                    <td>
                        <el-input v-model="fee.spotPay" @input="changePayMode(3)" :disabled="fee.payModeItemDisabled" v-mydoubleval type="text" placeholder=""></el-input>
                    </td>
                    <td>
                        <el-input v-model="fee.receiptPay" @input="changePayMode(4)" :disabled="fee.payModeItemDisabled" v-mydoubleval type="text" placeholder=""></el-input>
                    </td>
                    <td>
                        <el-input v-model="fee.monthPay" @input="changePayMode(1)" :disabled="fee.payModeItemDisabled" v-mydoubleval type="text" placeholder=""></el-input>
                    </td>
                </tr>
            </tbody>
        </table>
        <table class="fillTbale mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td class="label">订单备注</td>
                <td class="value" colspan="7">
                    <el-input v-model="orderInfo.remark" type="text" placeholder=""></el-input>
                </td>
            </tr>
        </table>
        <div class="bot-btn">
            <el-button @click="closePage">关闭</el-button>
            <el-button type="primary" @click="checkOrderData">保存</el-button>
            <el-button type="primary">保存并整车调度</el-button>
        </div>
    </div>
  </div>
</template>

<script>
import claimOrder from './claimOrder.js'
export default claimOrder
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>