<template>
      <div id="feeInfo">
        <h3 class="common-title mt_20">
          <span class="title-name">费用异动&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red;">注：费用异动填写变更变动值，已完成没进账单，创建派车单后的次月15日后不允许费用异动！</span></span>
        </h3>
        <div class="tickManager" style="overflow: auto;">
          <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
            <tr>
<!--              <th width="70">净重(KG)</th>-->
<!--              <th width="70">毛重(KG)</th>-->
<!--              <th width="70">体积(m³)</th>-->
<!--              <th width="70">计费单价</th>-->
<!--              <th width="70">中途点数</th>-->
<!--              <th width="70">点位费</th>-->
<!--              <th width="80">点位费合计</th>-->
<!--              <th width="80">运费</th>-->
              <th width="80">保险费</th>
              <th width="80">装货费</th>
              <th width="80">卸货费</th>
              <th width="80">放空费</th>
              <th width="80">压夜费</th>
              <th width="80">其他费</th>
              <th width="80">费用合计</th>
              <th width="150">备注</th>
            </tr>
            </thead>
            <tbody>
            <tr>
<!--              <td>-->
<!--                <el-input v-model="feeInfo.netWeight" type="text" placeholder="净重(KG)" @input="changeFee('netWeight')" v-mypmdouble4val></el-input>-->
<!--              </td>-->
<!--              <td>-->
<!--                <el-input v-model="feeInfo.grossWeight" type="text" placeholder="毛重(KG)" @input="changeFee('grossWeight')" v-mypmdouble4val></el-input>-->
<!--              </td>-->
<!--              <td>-->
<!--                <el-input v-model="feeInfo.volume" type="text" placeholder="体积(m³)" @input="changeFee('volume')" v-mypmdouble4val></el-input>-->
<!--              </td>-->
<!--              <td>-->
<!--                <el-input v-model="feeInfo.freightPrice" type="text" placeholder="计费单价" @input="changeFee('freightPrice')" v-mypmdouble4val></el-input>-->
<!--              </td>-->
<!--              <td>{{waybillInfo.midwayPointNum}}-->
<!--              </td>-->
<!--              <td>-->
<!--                <el-input v-model="feeInfo.pointFee" type="text" placeholder="点位费" @input="changeFee('pointFee')" v-mypmdouble4val></el-input>-->
<!--              </td>-->
<!--              <td>{{feeInfo.totalPointFee}}</td>-->
<!--              <td>-->
<!--                <el-input v-model="feeInfo.freight" type="text" placeholder="运费" :disabled="waybillInfo.billingType!=1" @input="changeFee('freight')" v-mypmdouble4val></el-input>-->
<!--              </td>-->
              <td>
                <el-input v-model="feeInfo.premiumFee" type="text" placeholder="保险费" @input="changeFee('premiumFee')" v-mypmdouble4val></el-input>
              </td>
              <td>
                <el-input v-model="feeInfo.loadingFee" type="text" placeholder="装货费" @input="changeFee('loadingFee')" v-mypmdouble4val></el-input>
              </td>
              <td>
                <el-input v-model="feeInfo.dischargeFee" type="text" placeholder="卸货费" @input="changeFee('dischargeFee')" v-mypmdouble4val></el-input>
              </td>
              <td>
                <el-input v-model="feeInfo.emptyDrivingFee" type="text" placeholder="放空费" @input="changeFee('emptyDrivingFee')" v-mypmdouble4val></el-input>
              </td>
              <td>
                <el-input v-model="feeInfo.standbyFee" type="text" placeholder="压夜费" @input="changeFee('standbyFee')" v-mypmdouble4val></el-input>
              </td>
              <td>
                <el-input v-model="feeInfo.otherFee" type="text" placeholder="其他费" @input="changeFee('otherFee')" v-mypmdouble4val></el-input>
              </td>
              <td>{{feeInfo.totalFee}}</td>
              <td>
                <el-input v-model="feeInfo.remark" type="text" placeholder="备注" ></el-input>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <h3 class="common-title mt_20">
          <span class="title-name">费用异动分摊</span>
        </h3>
        <div class="tickManager" style="overflow: auto;">
          <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
            <tr>
              <th width="150">订单号</th>
              <th width="100">调度件数/件</th>
              <th width="100">调度重量/kg</th>
              <th width="100">调度体积/m³</th>
<!--              <th width="100">点位费</th>-->
<!--              <th width="100">运费</th>-->
              <th width="100">保险费</th>
<!--              <th width="100">提货费</th>-->
<!--              <th width="100">送货费</th>-->
              <th width="100">装货费</th>
              <th width="100">卸货费</th>
              <th width="100">放空费</th>
              <th width="100">压夜费</th>
              <th width="100">其他费</th>
              <th width="100">费用合计</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item) in orderStockStatementList">
              <!-- 订单号 -->
              <td>
                <a href="javascript:;" class="link" @click="toOrderDetail(item.orderId)">{{item.orderNum}}</a>
              </td>
              <!-- 调度件数/件 -->
              <td>{{item.goodsCount}}</td>
              <!-- 调度重量/kg -->
              <td>{{item.goodsWeight}}</td>
              <!-- 调度体积/m³ -->
              <td>{{item.goodsVolume}}</td>
<!--              <td>-->
<!--                <el-input v-model="item.totalPointFee" type="text" placeholder="点位费" @input="calculateStatementTotalFee" v-mypmdouble4val></el-input>-->
<!--              </td>-->
<!--              <td>-->
<!--                <el-input v-model="item.freight" type="text" placeholder="运费"  @input="calculateStatementTotalFee" v-mypmdouble4val></el-input>-->
<!--              </td>-->
              <td>
                <el-input v-model="item.premiumFee" type="text" placeholder="保险费"  @input="calculateStatementTotalFee" v-mypmdouble4val></el-input>
              </td>
<!--              <td>-->
<!--                <el-input v-model="item.pickupFee" type="text" placeholder="提货费"  @input="calculateStatementTotalFee" v-mypmdouble4val></el-input>-->
<!--              </td>-->
<!--              <td>-->
<!--                <el-input v-model="item.deliveryFee" type="text" placeholder="送货费" @input="calculateStatementTotalFee" v-mypmdouble4val></el-input>-->
<!--              </td>-->
              <td>
                <el-input v-model="item.loadingFee" type="text" placeholder="装货费" @input="calculateStatementTotalFee" v-mypmdouble4val></el-input>
              </td>
              <td>
                <el-input v-model="item.dischargeFee" type="text" placeholder="卸货费" @input="calculateStatementTotalFee" v-mypmdouble4val></el-input>
              </td>
              <td>
                <el-input v-model="item.emptyDrivingFee" type="text" placeholder="放空费" @input="calculateStatementTotalFee" v-mypmdouble4val></el-input>
              </td>
              <td>
                <el-input v-model="item.standbyFee" type="text" placeholder="压夜费" @input="calculateStatementTotalFee" v-mypmdouble4val></el-input>
              </td>
              <td>
                <el-input v-model="item.otherFee" type="text" placeholder="其他费" @input="calculateStatementTotalFee" v-mypmdouble4val></el-input>
              </td>
              <!-- 合计 -->
              <td>{{item.totalFee}}</td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
              <td>合计：</td>
              <!-- 调度件数/件 -->
              <td>{{totalInfo.goodsCount}}</td>
              <!-- 调度重量/kg -->
              <td>{{totalInfo.goodsWeight}}</td>
              <!-- 调度体积/m³ -->
              <td>{{totalInfo.goodsVolume}}</td>
<!--              &lt;!&ndash; 点位费 &ndash;&gt;-->
<!--              <td>{{totalInfo.totalPointFee}}</td>-->
<!--              &lt;!&ndash; 运费 &ndash;&gt;-->
<!--              <td>{{totalInfo.freight}}</td>-->
              <!-- 保险费 -->
              <td>{{totalInfo.premiumFee}}</td>
<!--              &lt;!&ndash; 提货费 &ndash;&gt;-->
<!--              <td>{{totalInfo.pickupFee}}</td>-->
<!--              &lt;!&ndash; 送货费 &ndash;&gt;-->
<!--              <td>{{totalInfo.deliveryFee}}</td>-->
              <!-- 装货费 -->
              <td>{{totalInfo.loadingFee}}</td>
              <!-- 卸货费 -->
              <td>{{totalInfo.dischargeFee}}</td>
              <!-- 放空费 -->
              <td>{{totalInfo.emptyDrivingFee}}</td>
              <!-- 压夜费 -->
              <td>{{totalInfo.standbyFee}}</td>
              <!-- 其他费 -->
              <td>{{totalInfo.otherFee}}</td>
              <!-- 合计 -->
              <td>{{totalInfo.totalFee}}</td>
            </tr>
            </tfoot>
          </table>
        </div>

        <h3 class="common-title mt_20">
          <span class="title-name">派车单费用异动记录</span>
        </h3>
        <div class="tickManager" style="overflow: auto;">
          <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
            <tr>
              <th width="50">序号</th>
<!--              <th width="60">净重(KG)</th>-->
<!--              <th width="60">毛重(KG)</th>-->
<!--              <th width="60">体积(m³)</th>-->
<!--              <th width="60">计费单价</th>-->
<!--              <th width="60">中途点数</th>-->
<!--              <th width="60">点位费</th>-->
<!--              <th width="80">点位费合计</th>-->
<!--              <th width="80">运费</th>-->
              <th width="80">保险费</th>
              <th width="80">装货费</th>
              <th width="80">卸货费</th>
              <th width="80">放空费</th>
              <th width="80">压夜费</th>
              <th width="80">其他费</th>
              <th width="80">费用合计</th>
              <th width="150">备注</th>
              <th width="60">审核状态</th>
              <th width="60">创建人</th>
              <th width="120">创建日期</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in statementList" :key="index">
              <td>{{index+1}}</td>
<!--              <td>{{item.netWeight}}</td>-->
<!--              <td>{{item.grossWeight}}</td>-->
<!--              <td>{{item.volume}}</td>-->
<!--              <td>{{item.freightPrice}}</td>-->
<!--              <td>{{item.midwayPointNum}}</td>-->
<!--              <td>{{item.pointFee}}</td>-->
<!--              <td>{{item.totalPointFee}}</td>-->
<!--              <td>{{item.freight}}</td>-->
              <td>{{item.premiumFee}}</td>
              <td>{{item.loadingFee}}</td>
              <td>{{item.dischargeFee}}</td>
              <td>{{item.emptyDrivingFee}}</td>
              <td>{{item.standbyFee}}</td>
              <td>{{item.otherFee}}</td>
              <td>{{item.totalFee}}</td>
              <td>{{item.remark}}</td>
              <td>{{item.verifyStateName}}</td>
              <td>{{item.createUserName}}</td>
              <td>{{item.createDate}}</td>
            </tr>
            </tbody>
          </table>
        </div>

      </div>

</template>

<script>
import feeInfo from './feeInfo.js'
export default feeInfo
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>
