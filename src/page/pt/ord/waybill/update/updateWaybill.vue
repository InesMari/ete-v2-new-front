<template>
  <div id="updateWaybill">
    <div v-show="isShowMain" style="height:100%;">
      <selStock ref="selStock" :dispatchType="dispatchType"  @next="next"></selStock><!-- 选择库存单 -->
    </div>
    <div v-show="!isShowMain"  class="dispatchPage orderPage">
      <orderStock ref="orderStock" :dispatchType="dispatchType"  :recycleWaybill="allData.waybillInfo.isRecycleWaybill"></orderStock>  <!-- 库存单 -->
      <waybillInfo ref="waybillInfo" :waybillInfo="allData.waybillInfo" :dispatchType="dispatchType"></waybillInfo>  <!-- 供应商-->
      <feeInfo :statementList="allData.statementList" :makeupList="allData.makeupList"></feeInfo>
      <workInfo ref="workInfo" :workInfo="allData.workInfoList"></workInfo> <!-- 作业点 阿涛说的中转也要这个 -->
      <receipts ref="receipts" :ticketList="allData.receiptList"></receipts>  <!--票据 -->
      <div class="bot-btn">
        <el-button @click="quit()" >退出调度</el-button>
        <el-button type="primary" @click="updateWaybill()">确定修改</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import updateWaybill from './updateWaybill.js'
export default updateWaybill
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>
