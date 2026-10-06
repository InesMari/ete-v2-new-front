<template>
  <div id="waybillInfo" class="clearfix infoTable">
    <!--派车单基本数据 开始-->
    <table class="fillTbale mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td class="label">派车单号</td>
        <td class="value">{{waybillInfo.waybillNum}}</td>
        <td class="label">派车类型</td>
        <td class="value">{{waybillInfo.dispatchTypeName}}</td>
        <td class="label">调度人</td>
        <td class="value">{{waybillInfo.createUserName}}</td>
        <td class="label">调度时间</td>
        <td class="value">{{waybillInfo.createDate}}</td>
      </tr>
    </table>
    <!--派车单基本数据 结束-->

    <div class="leftTitle" style="height: 321px;">运输信息</div>
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
          <td>{{waybillInfo.supplierName}}</td>
          <td>{{waybillInfo.linkman}}</td>
          <td>{{waybillInfo.linkPhone}}</td>
          <td>{{waybillInfo.isInvoiceName}}</td>
          <td>{{waybillInfo.isUrgentName}}</td>
          <td>{{waybillInfo.haveReceiptName}}</td>
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
          <td>{{waybillInfo.plateNumber}}</td>
          <td>{{waybillInfo.vehicleTypeName}}</td>
          <td>{{waybillInfo.vehicleLengthName}}</td>
          <td>{{waybillInfo.driverName}}</td>
          <td>{{waybillInfo.driverLinkPhone}}</td>
          <td>{{waybillInfo.routeName}}</td>
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
<!--          <th width="7%">保险费</th>-->
<!--          <th width="7%">装货费</th>-->
<!--          <th width="7%">卸货费</th>-->
<!--          <th width="7%">其他费</th>-->
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{{waybillInfo.billingTypeName}}</td>
          <td v-show="waybillInfo.billingType==5">
            <a href="javascript:void(0);" class="link" @click.stop="showGoodsDetialDialog=true">查看明细</a>
          </td>
          <td>{{waybillInfo.quoteVehicleTypeName}}</td>
          <td>{{waybillInfo.netWeight}}</td>
          <td>{{waybillInfo.grossWeight}}</td>
          <td>{{waybillInfo.volume}}</td>
          <td>{{waybillInfo.freightPrice}}</td>
          <td>{{waybillInfo.midwayPointNum}}</td>
          <td>{{waybillInfo.pointFee}}</td>
          <td>{{waybillInfo.totalPointFee}}</td>
          <td>{{waybillInfo.freight}}</td>
<!--          <td>{{waybillInfo.premiumFee}}</td>-->
<!--          <td>{{waybillInfo.loadingFee}}</td>-->
<!--          <td>{{waybillInfo.dischargeFee}}</td>-->
<!--          <td>{{waybillInfo.otherFee}}</td>-->
        </tr>
        </tbody>
      </table>
      <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
        <thead>
        <tr>
          <th width="13%">下单金额合计</th>
          <th width="13%">异动金额合计</th>
          <th width="13%">补费金额合计</th>
          <th width="13%">费用合计</th>
          <th width="12%">预付</th>
          <th width="12%">到付</th>
          <th width="12%">周期付</th>
          <th width="12%">周期天数</th>
          <th width="12%">是否同步</th>
          <th width="12%">油费（宝奇平台用）</th>
        </tr>
        </thead>
        <tbody>
        <tr>
          <td>{{waybillInfo.totalFee}}</td>
          <td>{{waybillInfo.statementFee}}</td>
          <td>{{waybillInfo.makeupFee}}</td>
          <td>{{waybillInfo.amount}}</td>
          <td>{{waybillInfo.prePay}}</td>
          <td>{{waybillInfo.afterPay}}</td>
          <td>{{waybillInfo.periodicalPay}}</td>
          <td>{{waybillInfo.periodicalDay}}</td>
          <td>{{waybillInfo.isSyncName}}</td>
          <td>{{waybillInfo.oilFee}}</td>
        </tr>
        </tbody>
      </table>
      <table class="fillTable" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td class="label" width="15%">备注</td>
          <td class="value">{{waybillInfo.remark}}</td>
          <td class="label" width="15%">结算主体</td>
          <td class="value" style="width: 50px!important;">{{waybillInfo.settleBodyName}}</td>
        </tr>
      </table>
    </div>

    <!-- 货物明细 -->
    <el-dialog title="查看运输实际件数" :visible.sync="showGoodsDetialDialog"  :close-on-click-modal="false" :close-on-press-escape="false"  width="1200px"  @close="showGoodsDetialDialog=false">
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
              <td>{{item.actualGoodsCount}}</td>
              <td>{{item.piecePrice}}</td>
              <td>{{item.pieceFee}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="page-bot-btn">
        <el-button size="mini" @click="showGoodsDetialDialog=false">关闭</el-button>
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
