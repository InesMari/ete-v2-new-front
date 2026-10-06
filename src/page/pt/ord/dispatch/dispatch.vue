<template>
  <div id="dispatch">
    <div v-show="isShowMain" style="height:100%;">
      <selStock ref="selStock" :dispatchType="dispatchType" :tenantName="tenantName" @next="next"></selStock><!-- 选择库存单 -->
    </div>
    <div v-show="!isShowMain"  class="dispatchPage orderPage">
      <orderStock ref="orderStock" v-if="orderStockShow" :dispatchType="dispatchType" :recycleWaybill="recycleWaybill"></orderStock>  <!-- 库存单 -->
<!--      <div style="margin: 10px 0px -10px 60px;" v-if="dispatchType!=2">-->
<!--        <el-radio-group v-model="payMode" @change="changePayMode" >-->
<!--          <el-radio label="1" v-if="dispatchType==1||dispatchType==3||dispatchType==4">供应商月结</el-radio>-->
<!--          <el-radio label="2" v-if="dispatchType==1||dispatchType==3">自有车月结</el-radio>-->
<!--          <el-radio label="3" v-if="dispatchType==1||dispatchType==3">G7支付</el-radio>-->
<!--          <el-radio label="4" v-if="dispatchType==4">高灯支付</el-radio>-->
<!--        </el-radio-group>-->
<!--      </div>-->
      <sectionFee ref="sectionFee" v-if="dispatchType!=2"></sectionFee>
      <transitWaybillInfo ref="transitWaybillInfo" v-if="transitWaybillInfoShow"></transitWaybillInfo>
      <waybillInfo ref="waybillInfo" v-if="waybillInfoShow" :dispatchType="dispatchType"></waybillInfo>  <!-- 供应商-->
      <feeInfo ref="feeInfo"  v-if="waybillInfoShow" ></feeInfo>
      <workInfo ref="workInfo" v-if="workInfoShow" :dispatchType="dispatchType"></workInfo> <!-- 作业点 阿涛说的中转也要这个 -->
      <receipts ref="receipts" v-if="receiptsShow"></receipts>  <!--票据 -->
      <div class="bot-btn">
        <el-button @click="quit()" >退出调度</el-button>
        <el-button type="primary" @click="dispatch()">确定调度</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import dispatch from './dispatch.js'
export default dispatch
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>
