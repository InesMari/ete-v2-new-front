<template>
      <div id="feeInfo" v-show="(makeupList!=null&&makeupList.length>0)||(statementList!=null&&statementList.length>0)">
        <h3 class="common-title mt_20" v-show="statementList!=null&&statementList.length>0">
          <span class="title-name">派车单费用异动记录</span>
        </h3>
        <div class="table_height orderInfo" v-show="statementList!=null&&statementList.length>0">
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
              <th width="200">备注</th>
              <th width="90">是否协同成本</th>
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
              <td>{{item.isCrossCostName}}</td>
              <td>{{item.verifyStateName}}</td>
              <td>{{item.createUserName}}</td>
              <td>{{item.createDate}}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <h3 class="common-title mt_20" v-show="makeupList!=null&&makeupList.length>0">
          <span class="title-name">派车单补费记录</span>
        </h3>
        <div class="table_height orderInfo" v-show="makeupList!=null&&makeupList.length>0">
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
              <th width="60">创建人</th>
              <th width="120">创建日期</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in makeupList" :key="index">
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
<!--              <td>{{item.statementFee}}</td>-->
<!--              <td>{{item.makeupFee}}</td>-->
<!--              <td>{{item.amount}}</td>-->
              <td>{{item.remark}}</td>
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
