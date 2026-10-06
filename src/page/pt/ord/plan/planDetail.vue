<template>
  <div id="planDetail" class="addPlanPage orderPage">
    <div class="common-info">
        <!-- 基本信息 -->
        <h3 class="common-title"><span class="title-name">基本信息</span></h3>
        <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td class="label"><em>*</em>客户</td>
                <td class="value">
                  <el-input v-model="orderPlan.orderCustName" type="text" :readonly="true"></el-input>
                </td>
                <td class="label"><em>*</em>线路名称</td>
                <td class="value">
                  <el-input v-model="orderPlan.routeName" type="text" :readonly="true"></el-input>
                </td>
                <td class="label"><em>*</em>订单类型</td>
                <td class="value">
                    <el-input v-model="orderPlan.orderTypeName" type="text" :readonly="true"></el-input>
                </td>
                <td class="label"><em>*</em>是否回单</td>
                <td class="value">
                  <el-input v-model="orderPlan.isReceiptName" type="text" :readonly="true"></el-input>
                </td>
            </tr>
            <tr>

                <td class="label"><em>*</em>起始日期</td>
                <td class="value">
                  <el-input v-model="orderPlan.startDate" type="text" :readonly="true"></el-input>
                </td>
                <td class="label"><em>*</em>结束日期</td>
                <td class="value">
                  <el-input v-model="orderPlan.endDate" type="text" :readonly="true"></el-input>
                </td>
                <td class="label"><em>*</em>计划单位</td>
                <td class="value">
                  <el-input v-model="orderPlan.planCompanyName" type="text" :readonly="true"></el-input>
                </td>
                <td class="label"><em>*</em>计划数</td>
                <td class="value">
                  <el-input v-model="orderPlan.planCount" type="text" :readonly="true"></el-input>
                </td>
            </tr>
          <tr>
            <td class="label">平台计划编号</td>
            <td class="value" colspan="7">
              <el-input v-model="orderPlan.thrdPlanNum" type="text" :readonly="true"></el-input>
            </td>
          </tr>
        </table>
        <!-- 作业点信息 -->
        <h3 class="common-title mt_20">
            <span class="title-name">作业点信息</span>
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
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,index) in workData" :key="index">
                    <td>{{index+1}}</td>
                    <td>
                        <el-input v-model="item.workName" type="text" :readonly="true"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.workTypeName" type="text" :readonly="true"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.linkmanName" type="text" :readonly="true"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.bill" type="text" :readonly="true"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.phone" type="text" :readonly="true"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.workAddressStr" type="text" :readonly="true"></el-input>
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
              <el-input v-model="incomeFee.billingTypeName" type="text" :readonly="true"></el-input>
            </td>
            <td class="label"><em>*</em>结算方式</td>
            <td class="value">
              <el-input v-model="incomeFee.payModeName" type="text" :readonly="true"></el-input>
            </td>
            <td class="label">报价车型</td>
            <td class="value">
              <el-input v-model="incomeFee.quoteVehicleTypeName" type="text" :readonly="true"></el-input>
            </td>
            <td class="label">车长</td>
            <td class="value">
              <el-input v-model="incomeFee.vehicleLengthName" type="text" :readonly="true"></el-input>
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
<!--            <th width="70">保险费</th>-->
<!--            <th width="70">提货费</th>-->
<!--            <th width="70">送货费</th>-->
<!--            <th width="70">装货费</th>-->
<!--            <th width="70">卸货费</th>-->
<!--            <th width="70">其他费</th>-->
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
              <el-input v-model="incomeFee.freightPrice" type="text" :readonly="true"></el-input>
            </td>
            <td>
              <el-input v-model="incomeFee.midwayPointNum" type="text" :readonly="true"></el-input>
            </td>
            <td>
              <el-input v-model="incomeFee.pointFee" type="text" :readonly="true"></el-input>
            </td>
            <td>
              <el-input v-model="incomeFee.totalPointFee" type="text" :readonly="true"></el-input>
            </td>
            <td>
              <el-input v-model="incomeFee.freight" type="text" :readonly="true"></el-input>
            </td>
<!--            <td>-->
<!--              <el-input v-model="incomeFee.premiumFee" type="text" :readonly="true"></el-input>-->
<!--            </td>-->
<!--            <td>-->
<!--              <el-input v-model="incomeFee.pickupFee" type="text" :readonly="true"></el-input>-->
<!--            </td>-->
<!--            <td>-->
<!--              <el-input v-model="incomeFee.deliveryFee" type="text" :readonly="true"></el-input>-->
<!--            </td>-->
<!--            <td>-->
<!--              <el-input v-model="incomeFee.loadingFee" type="text" :readonly="true"></el-input>-->
<!--            </td>-->
<!--            <td>-->
<!--              <el-input v-model="incomeFee.dischargeFee" type="text" :readonly="true"></el-input>-->
<!--            </td>-->
<!--            <td>-->
<!--              <el-input v-model="incomeFee.otherFee" type="text" :readonly="true"></el-input>-->
<!--            </td>-->
            <td>
              <el-input v-model="incomeFee.totalFee" type="text" :readonly="true"></el-input>
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
              <el-input v-model="costFee.billingTypeName" type="text" :readonly="true"></el-input>
            </td>
            <td class="label">报价车型</td>
            <td class="value">
              <el-input v-model="costFee.quoteVehicleTypeName" type="text" :readonly="true"></el-input>
            </td>
            <td class="label">车长</td>
            <td class="value">
              <el-input v-model="costFee.vehicleLengthName" type="text" :readonly="true"></el-input>
            </td>
            <td class="label">结算主体</td>
            <td class="value">
              <el-input v-model="orderPlan.settleBodyName" type="text" :readonly="true"></el-input>
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
<!--            <th width="70">保险费</th>-->
<!--            <th width="70">提货费</th>-->
<!--            <th width="70">送货费</th>-->
<!--            <th width="70">装货费</th>-->
<!--            <th width="70">卸货费</th>-->
<!--            <th width="70">其他费</th>-->
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
              <el-input v-model="costFee.freightPrice" type="text" :readonly="true"></el-input>
            </td>
            <td>
              <el-input v-model="costFee.midwayPointNum" type="text" :readonly="true"></el-input>
            </td>
            <td>
              <el-input v-model="costFee.pointFee" type="text" :readonly="true"></el-input>
            </td>
            <td>
              <el-input v-model="costFee.totalPointFee" type="text" :readonly="true"></el-input>
            </td>
            <td>
              <el-input v-model="costFee.freight" type="text" :readonly="true"></el-input>
            </td>
<!--            <td>-->
<!--              <el-input v-model="costFee.premiumFee" type="text" :readonly="true"></el-input>-->
<!--            </td>-->
<!--            <td>-->
<!--              <el-input v-model="costFee.pickupFee" type="text" :readonly="true"></el-input>-->
<!--            </td>-->
<!--            <td>-->
<!--              <el-input v-model="costFee.deliveryFee" type="text" :readonly="true"></el-input>-->
<!--            </td>-->
<!--            <td>-->
<!--              <el-input v-model="costFee.loadingFee" type="text" :readonly="true"></el-input>-->
<!--            </td>-->
<!--            <td>-->
<!--              <el-input v-model="costFee.dischargeFee" type="text" :readonly="true"></el-input>-->
<!--            </td>-->
<!--            <td>-->
<!--              <el-input v-model="costFee.otherFee" type="text" :readonly="true"></el-input>-->
<!--            </td>-->
            <td>
              <el-input v-model="costFee.totalFee" type="text" :readonly="true"></el-input>
            </td>
          </tr>
          </tbody>
        </table>
        <!-- 货物信息 -->
        <h3 class="common-title mt_20"><span class="title-name">单趟计划货物信息</span></h3>
        <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
                <tr>
                    <th>货物名称</th>
                    <th>货物类别</th>
                    <th>包装</th>
                    <th>提货点</th>
                    <th>卸货点</th>
                    <th>货物件数（件）</th>
                    <th>货物重量（KG）</th>
                    <th>货物体积（m³）</th>
                    <th>规格</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,index) in goodsData" :key="index">
                    <td>
                        <el-input v-model="item.goodsName" type="text" :readonly="true"></el-input>
                    </td>
                    <td>
                      <el-input v-model="item.className" type="text" :readonly="true"></el-input>
                    </td>
                    <td>
                      <el-input v-model="item.packingTypeName" type="text" :readonly="true"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.beginWorkName" type="text" :readonly="true"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.endWorkName" type="text" :readonly="true"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.goodsCount" type="text" :readonly="true"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.goodsWeight" v-mydoubleval type="text" :readonly="true"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.goodsVolume" v-mydoubleval type="text" :readonly="true"></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.goodsModel" type="text" :readonly="true"></el-input>
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
                    <td class="red">{{orderPlan.goodsCountSum}}</td>
                    <td class="red">{{orderPlan.goodsWeightSum}}</td>
                    <td class="red">{{orderPlan.goodsVolumeSum}}</td>
                    <td></td>
                </tr>
            </tfoot>
        </table>
        <!-- 供应商司机车辆信息 -->
        <h3 class="common-title mt_20"><span class="title-name">绑定供应商/司机/车辆</span>
          <div style="display: inline-block;color:red;margin:5px 0 0px 10px;font-weight: bold;">
            注：只有绑定的供应商/司机才可以领单进行运作
          </div>
        </h3>
        <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
          <thead>
          <tr>
            <th>序号</th>
            <th>供应商</th>
<!--            <th>司机</th>-->
<!--            <th>车辆</th>-->
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in supplierData" :key="index">
            <td>
              {{index+1}}
            </td>
            <td>
              <el-input v-model="item.supplierName" type="text" :readonly="true"></el-input>
            </td>
<!--            <td>-->
<!--              <el-input v-model="item.driverName" type="text" :readonly="true"></el-input>-->
<!--            </td>-->
<!--            <td>-->
<!--              <el-input v-model="item.plateNumber" type="text" :readonly="true"></el-input>-->
<!--            </td>-->
          </tr>
          </tbody>
        </table>
        <div class="bot-btn">
            <el-button @click="close()">关闭</el-button>
        </div>
    </div>
  </div>
</template>

<script>
import planDetail from './planDetail.js'
export default planDetail
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>