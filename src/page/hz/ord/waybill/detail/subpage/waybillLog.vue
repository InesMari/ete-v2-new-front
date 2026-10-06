<template>
  <div id="waybillLog" class="wayBillDetailPage dispatchPage orderPage">
      <div class="logListCommon">
        <div class="title clearfix">
          <div class="time">时间</div>
          <div class="operator">操作人</div>
          <div class="news">最新动态</div>
        </div>
        <el-scrollbar class="content_height">
          <div class="content">
            <div class="item clearfix" :class="{'first':index==0}" v-for="(item,index) in opLogList" :key="index">
              <div class="time">{{item.opTime}}</div>
              <div class="operator">{{item.createUserName}}</div>
              <div class="news">{{item.opContent}}</div>
            </div>
          </div>
        </el-scrollbar>
      </div>
  </div>
</template>

<script>
import waybillLog from './waybillLog.js'
export default waybillLog
</script>

<style lang="scss">
@import '@/page/pt/ord/order.scss';
.wayBillDetailPage {
  background: #fff;
  border: $border;
  box-sizing: border-box;
  padding-right: 0;
  .innerTab {
    border: none;
  }
  .tableCommonComponents {
    .tableCommon {
      border: none;
      td, th {
        height: 30px;
      }
    }
  }
}
</style>
