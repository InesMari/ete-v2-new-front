<template>
      <div id="feeInfo">
        
        <h3 class="common-title mt_20">
          <span class="title-name">费用异动&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red;">注：费用异动填写变更变动值，已完成没进账单，创建派车单后的次月6日后不允许费用异动！</span></span>
          <span class="fr fw" style="width: 20%;text-align: center;line-height: 30px;font-size: 14px;">加上本次异动总金额：{{feeInfo.totalStatementFeeSum}}</span>
        </h3>
        <div class="tickManager" style="overflow: auto;">
          <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
            <tr>
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
              <th width="100">保险费</th>
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
              <td>
                <el-input v-model="item.premiumFee" type="text" placeholder="保险费"  @input="calculateStatementTotalFee" v-mypmdouble4val></el-input>
              </td>
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
              <!-- 保险费 -->
              <td>{{totalInfo.premiumFee}}</td>
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
        
      </div>

</template>

<script>
import feeInfo from './feeInfo.js'
export default feeInfo
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>
