<template>
  <div id="transitWaybillInfo" class="clearfix infoTable" style="padding-top: 5px">
    <div class="clearfix">
      <div class="leftTitle" style="height: 284px;">中转信息</div>
      <div class="innerTable">
      <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
        <thead>
        <tr>
          <th width="16%">外发单号</th>
          <th width="16%">联系人</th>
          <th width="16%">联系电话</th>
          <th width="16%">是否开票</th>
          <th width="16%">是否加急</th>
          <th width="16%">是否回单</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>
            <el-input v-model="waybillInfo.deliveryOrderNo" type="text" placeholder="外发单号"></el-input>
          </td>
          <td>
            <el-input v-model="waybillInfo.linkman" type="text" placeholder="联系人"></el-input>
          </td>
          <td>
            <el-input v-model="waybillInfo.linkPhone" type="text" placeholder="联系电话"></el-input>
          </td>
          <td>
            <el-select v-model="waybillInfo.isInvoice" placeholder="是否开票" :disabled="isInvoiceDisabled">
              <el-option v-for="item in whetherOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
            </el-select>
          </td>
          <td>
            <el-select v-model="waybillInfo.isUrgent" placeholder="是否加急">
              <el-option v-for="item in whetherOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
            </el-select>
          </td>
          <td>
            <el-select v-model="waybillInfo.haveReceipt" placeholder="是否回单">
              <el-option v-for="item in whetherOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
            </el-select>
          </td>
        </tr>
        </tbody>
      </table>
      <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
        <thead>
        <tr>
          <th width="16%">提货车牌号</th>
          <th width="16%">车型</th>
          <th width="16%">车长</th>
          <th width="16%">提货司机</th>
          <th width="16%">提货司机电话</th>
<!--          <th width="16%">预计提货时间</th>-->
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>
            <el-select v-model="waybillInfo.pickupVehicleId" placeholder="车牌号码" filterable clearable
                       @blur="inputVehicleInfo($event,'pickup')"
                       @change="changeVehicle($event,'pickup')" @clear="clearOneSelVehicleInfo('pickup')">
              <el-option v-for="item in vehicleData" :key="item.vehicleId" :label="item.plateNumber" :value="item.vehicleId"></el-option>
            </el-select>
          </td>
          <td>
            <el-select v-model="waybillInfo.pickupVehicleType" placeholder="车型" @change="forceUpdate" :disabled="vehicleDisable.pickup" filterable clearable>
              <el-option v-for="item in vehicleTypeOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
            </el-select>
          </td>
          <td>
            <el-select v-model="waybillInfo.pickupVehicleLength" placeholder="车长" @change="forceUpdate" :disabled="vehicleDisable.pickup" filterable clearable>
              <el-option v-for="item in vehicleLengthOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
            </el-select>
          </td>
          <td>
            <el-select v-model="waybillInfo.pickupDriverUserId" placeholder="司机" filterable clearable
                       @blur="inputDriverInfo($event,'pickup')"
                       @change="changeDriver($event,'pickup')" @clear="clearOneSelDriverInfo('pickup')">
              <el-option v-for="item in driverData" :key="item.driverUserId" :label="item.driverName" :value="item.driverUserId"></el-option>
            </el-select>
          </td>
          <td>
            <el-input v-model="waybillInfo.pickupDriverLinkPhone" type="text" placeholder="联系电话" @input="forceUpdate"></el-input>
          </td>
<!--          <td>-->
<!--            <el-date-picker @input="$forceUpdate" v-model="waybillInfo.pickupWorkDate" type="datetime"-->
<!--                            placeholder="选择预计提货时间" align="right" :picker-options="pickerOptions"-->
<!--                            value-format="yyyy-MM-dd HH:mm:ss">-->
<!--            </el-date-picker>-->
<!--          </td>-->
        </tr>
        </tbody>
      </table>
      <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
        <thead>
        <tr>
          <th width="16%">送货车牌号</th>
          <th width="16%">车型</th>
          <th width="16%">车长</th>
          <th width="16%">送货司机</th>
          <th width="16%">送货司机电话</th>
<!--          <th width="16%">预计送货时间</th>-->
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>
            <el-select v-model="waybillInfo.deliveryVehicleId" placeholder="车牌号码" filterable clearable
                       @blur="inputVehicleInfo($event,'delivery')"
                       @change="changeVehicle($event,'delivery')" @clear="clearOneSelVehicleInfo('delivery')">
              <el-option v-for="item in vehicleData" :key="item.vehicleId" :label="item.plateNumber" :value="item.vehicleId"></el-option>
            </el-select>
          </td>
          <td>
            <el-select v-model="waybillInfo.deliveryVehicleType" placeholder="车型" @change="forceUpdate" :disabled="vehicleDisable.delivery" filterable clearable>
              <el-option v-for="item in vehicleTypeOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
            </el-select>
          </td>
          <td>
            <el-select v-model="waybillInfo.deliveryVehicleLength" placeholder="车长" @change="forceUpdate" :disabled="vehicleDisable.delivery" filterable clearable>
              <el-option v-for="item in vehicleLengthOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
            </el-select>
          </td>
          <td>
            <el-select v-model="waybillInfo.deliveryDriverUserId" placeholder="司机" filterable clearable
                       @blur="inputDriverInfo($event,'delivery')"
                       @change="changeDriver($event,'delivery')" @clear="clearOneSelDriverInfo('delivery')">
              <el-option v-for="item in driverData" :key="item.driverUserId" :label="item.driverName" :value="item.driverUserId"></el-option>
            </el-select>
          </td>
          <td>
            <el-input v-model="waybillInfo.deliveryDriverLinkPhone" type="text" placeholder="联系电话" @input="forceUpdate"></el-input>
          </td>
<!--          <td>-->
<!--            <el-date-picker @input="$forceUpdate" v-model="waybillInfo.deliveryWorkDate" type="datetime"-->
<!--                            placeholder="选择预计送货时间" align="right" :picker-options="pickerOptions"-->
<!--                            value-format="yyyy-MM-dd HH:mm:ss">-->
<!--            </el-date-picker>-->
<!--          </td>-->
        </tr>
        </tbody>
      </table>
      <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
        <thead>
        <tr>
          <th width="16%">干线车牌号</th>
          <th width="16%">车型</th>
          <th width="16%">车长</th>
          <th width="16%">干线司机</th>
          <th width="16%">干线司机电话</th>
<!--          <th width="16%">外发单号</th>-->
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>
            <el-select v-model="waybillInfo.trunkRoadVehicleId" placeholder="车牌号码" filterable clearable
                       @blur="inputVehicleInfo($event,'trunkRoad')"
                       @change="changeVehicle($event,'trunkRoad')" @clear="clearOneSelVehicleInfo('trunkRoad')">
              <el-option v-for="item in vehicleData" :key="item.vehicleId" :label="item.plateNumber" :value="item.vehicleId"></el-option>
            </el-select>
          </td>
          <td>
            <el-select v-model="waybillInfo.trunkRoadVehicleType" placeholder="车型" @change="forceUpdate" :disabled="vehicleDisable.trunkRoad" filterable clearable>
              <el-option v-for="item in vehicleTypeOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
            </el-select>
          </td>
          <td>
            <el-select v-model="waybillInfo.trunkRoadVehicleLength" placeholder="车长" @change="forceUpdate" :disabled="vehicleDisable.trunkRoad" filterable clearable>
              <el-option v-for="item in vehicleLengthOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
            </el-select>
          </td>
          <td>
            <el-select v-model="waybillInfo.trunkRoadDriverUserId" placeholder="司机" filterable clearable
                       @blur="inputDriverInfo($event,'trunkRoad')"
                       @change="changeDriver($event,'trunkRoad')" @clear="clearOneSelDriverInfo('trunkRoad')">
              <el-option v-for="item in driverData" :key="item.driverUserId" :label="item.driverName" :value="item.driverUserId"></el-option>
            </el-select>
          </td>
          <td>
            <el-input v-model="waybillInfo.trunkRoadDriverLinkPhone" type="text" placeholder="联系电话" @input="forceUpdate"></el-input>
          </td>
<!--          <td>-->
<!--            <el-input v-model="waybillInfo.deliveryOrderNo" type="text" placeholder="外发单号"></el-input>-->
<!--          </td>-->
        </tr>
        </tbody>
      </table>
    </div>
    </div>
    <div class="clearfix">
      <div class="leftTitle" style=" margin-top:5px;height: 184px;">报价明细</div>
      <div class="innerTable" style="margin-top:5px;">
        <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
          <thead>
          <tr>
            <th width="11%">计费方式</th>
            <th width="11%">运输模式</th>
            <th width="8%" v-show="waybillInfo.billingType==5">按件计费</th>
            <th width="8%">净重(KG)</th>
            <th width="8%">毛重(KG)</th>
            <th width="8%">体积(m³)</th>
            <th width="7%">计费单价</th>
            <th width="8%">提货费</th>
            <th width="8%">送货费</th>
            <th width="8%">干线费</th>
            <th width="8%">干线其他费</th>
            <th width="8%">费用合计</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>
              <el-select v-model="waybillInfo.billingType" placeholder="计费方式" filterable clearable @change="initPieceGoods();" @click.native="changeClick">
                <el-option v-for="item in billingTypeOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
              </el-select>
            </td>
            <td>
              <el-select v-model="waybillInfo.transport" placeholder="运输模式" filterable clearable @change="matchQuote()" @click.native="changeClick">
                <el-option v-for="item in transportOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
              </el-select>
            </td>
            <td v-show="waybillInfo.billingType==5">
              <a href="javascript:void(0);" class="link" @click.stop="showGoodsDetialDialog=true">维护明细</a>
            </td>
            <td>
              <el-input v-model="waybillInfo.netWeight" type="text" placeholder="净重(KG)" @blur="matchQuote()" @input="forceUpdate" @click.native="changeClick" v-mydouble4val></el-input>
            </td>
            <td>
              <el-input v-model="waybillInfo.grossWeight" type="text" placeholder="毛重(KG)" @blur="matchQuote()" @input="forceUpdate" @click.native="changeClick" v-mydouble4val></el-input>
            </td>
            <td>
              <el-input v-model="waybillInfo.volume" type="text" placeholder="体积(m³)" @blur="matchQuote()" @input="forceUpdate"  @click.native="changeClick" v-mydouble4val></el-input>
            </td>
            <td>
              {{waybillInfo.freightPrice}}
            </td>
            <td>
              {{waybillInfo.transitPickupFee}}
            </td>
            <td>
              {{waybillInfo.transitDeliveryFee}}
            </td>
            <td>
              {{waybillInfo.transitFee}}
            </td>
            <td>
              <el-input v-model="waybillInfo.transitOtherFee" type="text" placeholder="中转其他费" @input="calculateFee()" v-mypmdouble4val></el-input>
            </td>
            <td>
              {{waybillInfo.totalFee}}
            </td>
          </tr>
          </tbody>
        </table>
        <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
          <thead>
          <tr>
            <th width="25%">预付</th>
            <th width="25%">到付</th>
            <th width="25%">周期付</th>
            <th width="25%">周期天数</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>
              <el-input v-model="waybillInfo.prePay" type="text" placeholder="预付金额" v-mydoubleval></el-input>
            </td>
            <td>
              <el-input v-model="waybillInfo.afterPay" type="text" placeholder="到付金额" v-mydoubleval></el-input>
            </td>
            <td>
              <el-input v-model="waybillInfo.periodicalPay" type="text" placeholder="周期付金额" @input="forceUpdate" v-mydoubleval></el-input>
            </td>
            <td>
              <el-input v-model="waybillInfo.periodicalDay" type="text" placeholder="周期天数" v-mynumval></el-input>
            </td>
          </tr>
          </tbody>
        </table>
        <table class="fillTable" width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td class="label" width="15%">备注</td>
            <td class="value">
              <el-input v-model="waybillInfo.remark" type="text" placeholder=""></el-input>
            </td>
          </tr>
        </table>
      </div>
    </div>

    <!-- 货物明细 -->
    <el-dialog title="维护运输实际件数" :visible.sync="showGoodsDetialDialog"  :close-on-click-modal="false" :close-on-press-escape="false"  width="1200px"  @close="showGoodsDetialDialog=false">
      <div class="common-info" style="border:none;padding:0;">
        <div>
          <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
            <tr>
              <th width="5%">序号</th>
              <th width="20%">下单客户</th>
              <th width="11%">货物</th>
              <th width="20%">库存仓库</th>
              <th width="20%">卸货地</th>
              <th width="8%">实际件数</th>
              <th width="8%">计费单价</th>
              <th width="8%">运费</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in waybillInfo.pieceGoodsList">
              <td>{{index+1}}</td>
              <td>{{item.custTenantName}}</td>
              <td>{{item.goodsName}}</td>
              <td>{{item.beginWorkName}}</td>
              <td>{{item.endWorkName}}</td>
              <td><el-input v-model="item.actualGoodsCount" type="text" placeholder="实际件数" @input="inputGoodsDetail(index)" @blur="inputGoodsDetail(index)" v-mynumval></el-input></td>
              <td>{{item.piecePrice}}</td>
              <td>{{item.pieceFee}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="page-bot-btn">
        <el-button size="mini" @click="showGoodsDetialDialog=false">关闭</el-button>
        <el-button type="primary" size="mini" @click="saveGoodsDetail">提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import transitWaybillInfo from './transitWaybillInfo.js'
export default transitWaybillInfo
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>
