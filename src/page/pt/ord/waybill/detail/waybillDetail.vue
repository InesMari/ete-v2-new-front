<template>
    <div id="waybillDetail" class="wayBillDetailPage dispatchPage orderPage">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <div class="detail" v-show="showType==1">
          <orderStock ref="orderStock"  :orderStockList="data.orderStockList" :dispatchType="data.waybillInfo.dispatchType"></orderStock>
          <waybillInfo ref="waybillInfo" :waybillInfo="data.waybillInfo" :dispatchType="data.waybillInfo.dispatchType"></waybillInfo>
          <feeInfo :statementList="data.statementList" :makeupList="data.makeupList"></feeInfo>
          <workInfo :workInfo="data.workInfoList"></workInfo>
          <receipts :ticketList="data.receiptList"></receipts>
        </div>

      <!--运单 操作日志 -->
      <div v-show="showType==2" class="waybillLog">
        <waybillLog ref="waybillLog" :opLogList="data.opLogList"></waybillLog>
      </div>
      <!--运单 操作日志 -->

        <!--运单 修改记录 -->
        <div v-show="showType==3" class="modifyRecord">
          <modifyRecord></modifyRecord>
        </div>
        <!--运单 修改记录 -->

        <!-- 地图轨迹 -->
        <div v-show="showType==4">
          <map-track ref="mapTrack" v-if="showType==4"></map-track>
        </div>

        <div class="bot-btn" v-if="showType!=4">
            <el-button @click="closePage">关闭</el-button>
        </div>
    </div>
</template>

<script>
	import waybillDetail from './waybillDetail.js'
	export default waybillDetail
</script>

<style lang="scss">
    @import '@/page/pt/ord/order.scss';
    .wayBillDetailPage {
        background: #fff;
        border: $border;
        box-sizing: border-box;
        padding-right: 0;
        height: 100%!important;
        .innerTab {
            border: none;
        }
        .waybillLog,.modifyRecord{
            height: calc(100% - 100px);
        }
        .logListCommon {
            margin-top: 20px;
            border-bottom: $border;
            .content_height {
                height: 150px;
                .el-scrollbar__wrap {
                    overflow-x: hidden;
                }
            }
        }
        .tableCommonComponents {
            .tableCommon {
                border: none;
                td, th {
                    height: 30px;
                }
            }
        }
        .bot-btn{
            margin-top: 20px;
        }
    }
</style>
