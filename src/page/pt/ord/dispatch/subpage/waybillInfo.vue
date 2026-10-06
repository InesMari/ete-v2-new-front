<template>
  <div id="waybillInfo" class="clearfix infoTable" style="padding-top: 5px">
    <div class="leftTitle" style="height: 326px;">运输信息</div>
    <div class="innerTable">
      <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
        <thead>
        <tr>
          <th width="16%">供应商</th>
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
            <lazy-select
              v-model="waybillInfo.supplierTenantId"
              :data="supplierData"
              labelKey="supplierName"
              valueKey="tenantId"
              @change="changeSupplier"
              placeholder="选择供应商"
            />
          </td>
          <td>
            <el-input v-model="waybillInfo.linkman" type="text" placeholder="联系人"></el-input>
          </td>
          <td>
            <el-input v-model="waybillInfo.linkPhone" type="text" placeholder="联系电话"></el-input>
          </td>
          <td>
            <el-select v-model="waybillInfo.isInvoice" placeholder="是否开票" @change="changeIsInvoice" :disabled="isInvoiceDisabled">
              <el-option v-for="item in whetherOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
            </el-select>
          </td>
          <td>
            <el-select v-model="waybillInfo.isUrgent" placeholder="是否加急">
              <el-option v-for="item in whetherOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
            </el-select>
          </td>
          <td>
            <el-select v-model="waybillInfo.haveReceipt" placeholder="是否回单" v-if="haveReceiptShow">
              <el-option v-for="item in whetherOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
            </el-select>
          </td>
        </tr>
        </tbody>
      </table>
      <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
        <thead>
        <tr>
          <th width="16%">车牌号码</th>
          <th width="16%">车型</th>
          <th width="16%">车长</th>
          <th width="16%">司机</th>
          <th width="16%">司机电话</th>
          <th width="16%">线路名称</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>
            <!-- <el-select v-model="waybillInfo.vehicleId" placeholder="车牌号码" filterable clearable @change="changeVehicle" @clear="clearSelVehicleInfo">
              <el-option v-for="item in vehicleData" :key="item.vehicleId" :label="item.plateNumber" :value="item.vehicleId"></el-option>
            </el-select> -->
            <lazy-select
              v-model="waybillInfo.vehicleId"
              :data="vehicleData"
              labelKey="plateNumber"
              valueKey="vehicleId"
              @change="changeVehicle"
              placeholder="车牌号码"
            />
          </td>
          <td>
            <el-select v-model="waybillInfo.vehicleType" placeholder="车型" @change="forceUpdate" :disabled="vehicleDisable" filterable clearable>
              <el-option v-for="item in vehicleTypeOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
            </el-select>
          </td>
          <td>
            <el-select v-model="waybillInfo.vehicleLength" placeholder="车长" @change="forceUpdate" :disabled="vehicleDisable" filterable clearable>
              <el-option v-for="item in vehicleLengthOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
            </el-select>
          </td>
          <td>
            <!-- <el-select v-model="waybillInfo.driverUserId" placeholder="司机" filterable clearable @change="changeDriver" @clear="clearSelDriverInfo">
              <el-option v-for="item in driverData" :key="item.driverUserId" :label="item.driverName" :value="item.driverUserId"></el-option>
            </el-select> -->
            <lazy-select
              v-model="waybillInfo.driverUserId"
              :data="driverData"
              labelKey="driverName"
              valueKey="driverUserId"
              @change="changeDriver"
              placeholder="司机"
            />
          </td>
          <td>
            <el-input v-model="waybillInfo.driverLinkPhone" type="text" placeholder="联系电话" @input="forceUpdate"></el-input>
          </td>
          <td>
            <el-input v-model="waybillInfo.routeName" type="text" placeholder="线路名称"></el-input>
          </td>
        </tr>
        </tbody>
      </table>
      <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
        <thead>
        <tr>
          <th width="11%">计费方式</th>
          <th width="8%" v-show="waybillInfo.billingType==5">按件计费</th>
          <th width="8%">报价车型</th>
          <th width="8%">净重(KG)</th>
          <th width="8%">毛重(KG)</th>
          <th width="8%">体积(m³)</th>
          <th width="7%">计费单价</th>
          <th width="7%">中途点数</th>
          <th width="7%">点位费</th>
          <th width="8%">点位费合计</th>
          <th width="8%">运费</th>
<!--            <th width="7%">保险费</th>-->
<!--            <th width="7%">装货费</th>-->
<!--            <th width="7%">卸货费</th>-->
<!--            <th width="7%">其他费</th>-->
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>
            <el-select v-model="waybillInfo.billingType" placeholder="计费方式" filterable clearable @change="initPieceGoods();" @click.native="changeClick">
              <el-option v-for="item in billingTypeOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
            </el-select>
          </td>
          <td v-show="waybillInfo.billingType==5">
            <a href="javascript:void(0);" class="link" @click.stop="showGoodsDetialDialog=true">维护明细</a>
          </td>
          <td>
            <el-select v-model="waybillInfo.quoteVehicleType" placeholder="报价车型" filterable clearable @change="matchQuote" @click.native="changeClick">
              <el-option
                  v-for="v in quoteVehicleTypeData"
                  :key="v.codeValue"
                  :label="v.codeName"
                  :value="v.codeValue">
              </el-option>
            </el-select>
          </td>
          <td>
            <el-input v-model="waybillInfo.netWeight" type="text" placeholder="净重(KG)" @blur="matchQuote()" @input="forceUpdate" @click.native="changeClick" v-mydouble4val></el-input>
          </td>
          <td>
            <el-input v-model="waybillInfo.grossWeight" type="text" placeholder="毛重(KG)" @blur="matchQuote()" @input="forceUpdate" @click.native="changeClick" v-mydouble4val></el-input>
          </td>
          <td>
            <el-input v-model="waybillInfo.volume" type="text" placeholder="体积(m³)" @blur="matchQuote()" @input="forceUpdate" @click.native="changeClick" v-mydouble4val></el-input>
          </td>
          <td>
            {{waybillInfo.freightPrice}}
<!--              <el-input v-model="waybillInfo.freightPrice" type="text" placeholder="计费单价" @input="changeFee('freight')" v-mydouble4val></el-input>-->
          </td>
          <td>
            {{waybillInfo.midwayPointNum}}
<!--            <el-input v-model="waybillInfo.midwayPointNum" type="text" placeholder="中途点数" @input="changeFee('totalPointFee')" disabled="true"></el-input>-->
          </td>
          <td>
            {{waybillInfo.pointFee}}
<!--              <el-input v-model="waybillInfo.pointFee" type="text" placeholder="点位费" @input="changeFee('totalPointFee')" v-mydouble4val></el-input>-->
          </td>
          <td>{{waybillInfo.totalPointFee}}</td>
          <td>
            {{waybillInfo.freight}}
<!--              <el-input v-model="waybillInfo.freight" type="text" placeholder="运费" :disabled="waybillInfo.billingType!=1" @input="changeFee('freight')" v-mydouble4val></el-input>-->
          </td>
<!--            <td>-->
<!--              <el-input v-model="waybillInfo.premiumFee" type="text" placeholder="保险费" @input="changeFee('premiumFee')" v-mydouble4val></el-input>-->
<!--            </td>-->
<!--            <td>-->
<!--              <el-input v-model="waybillInfo.loadingFee" type="text" placeholder="装货费" @input="changeFee('loadingFee')" v-mydouble4val></el-input>-->
<!--            </td>-->
<!--            <td>-->
<!--              <el-input v-model="waybillInfo.dischargeFee" type="text" placeholder="卸货费" @input="changeFee('dischargeFee')" v-mydouble4val></el-input>-->
<!--            </td>-->
<!--            <td>-->
<!--              <el-input v-model="waybillInfo.otherFee" type="text" placeholder="其他费" @input="changeFee('otherFee')" v-mydouble4val></el-input>-->
<!--            </td>-->
        </tr>
        </tbody>
      </table>
      <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
        <thead>
        <tr>
          <th width="20%">费用合计</th>
          <th width="20%">预付</th>
          <th width="20%">到付</th>
          <th width="20%">周期付</th>
          <th width="20%">周期天数</th>
          <th width="20%">是否同步</th>
          <th width="20%">油费（宝奇平台用）</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{{waybillInfo.totalFee}}</td>
          <td>
            <el-input v-model="waybillInfo.prePay" type="text" placeholder="预付金额" v-mydouble4val></el-input>
          </td>
          <td>
            <el-input v-model="waybillInfo.afterPay" type="text" placeholder="到付金额" v-mydouble4val></el-input>
          </td>
          <td>
            <el-input v-model="waybillInfo.periodicalPay" type="text" placeholder="周期付金额" v-mydouble4val></el-input>
          </td>
          <td>
            <el-input v-model="waybillInfo.periodicalDay" type="text" placeholder="周期天数" v-mynumval></el-input>
          </td>
          <td>
            <el-select v-model="waybillInfo.isSync" placeholder="是否同步">
              <el-option v-for="item in whetherOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
            </el-select>
          </td>
          <td>
            <el-input v-model="waybillInfo.oilFee" type="text" placeholder="油费（宝奇平台用）" v-mynumval></el-input>
          </td>
        </tr>
        </tbody>
      </table>
      <table class="fillTable" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td class="label" width="15%">备注</td>
          <td class="value">
            <el-input v-model="waybillInfo.remark" type="text" placeholder="" @input="$forceUpdate();"></el-input>
          </td>
	
        <td class="label" width="15%">结算主体</td>
        <td class="value" style="width: 50px!important;">
          <el-select v-model="waybillInfo.settleBody" placeholder="结算主体">
            <el-option v-for="item in settleBodyData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
          </el-select>
        </td>
        </tr>
      </table>
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
import waybillInfo from './waybillInfo.js'
export default waybillInfo
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>
