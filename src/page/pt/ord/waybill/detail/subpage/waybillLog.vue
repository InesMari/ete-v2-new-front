<template>
  <div id="waybillLog" class="wayBillDetailPage dispatchPage orderPage">
      <div class="logListCommon">
        <div class="title clearfix">
          <div class="time1">时间</div>
          <div class="operator">操作人</div>
          <div class="time2">运作时间</div>
          <div class="news">最新动态</div>
          <div class="opAdress">打点地址</div>
          <div class="opState">打点状态</div>
        </div>
        <el-scrollbar class="content_height">
          <div class="content">
            <div class="item clearfix" :class="{'first':index==0}" v-for="(item,index) in opLogList" :key="index">
              <div class="time1">{{item.opTime}}</div>
              <div class="operator">{{item.createUserName}}</div>
              <div class="time2">{{item.workDate}}</div>
                <div class="news" v-html="item.opContent" @click="showBig" :data-id="item.imgId" :data-type="item.imgPath" :data-num="item.imgPathUrl"></div>
              <div class="opAdress">{{item.opAddressStr}}</div>
              <div class="opState">{{item.opStateName}}</div>
            </div>
          </div>
        </el-scrollbar>
      </div>

      <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

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
  border: none!important;
  .innerTab {
    border: none;
  }
  .logListCommon {
    margin-top: 20px;
    border: $border;
    height: 100%;
    overflow: hidden;
    padding-bottom: 20px;
    .content_height {
      height: 100%!important;
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
    }
    .content{
      position: relative;
      &::after{
        content: "";
        position: absolute;
        width: 0;
        height: calc(100% - 30px);
        top:11px;
        left: 30%;
        border-left: $border;
      }
    }
    .item{
      position: relative;
      z-index: 9;
      &>div{
        box-sizing: border-box;
        font-size: 14px;
        line-height: 24px;
        padding-top: 7px;
        padding-bottom: 7px;
      }
      &.first{
        &>div{
          font-weight: bold;
        }
        &::before{
          background: $main-color;
          width: 15px;
          height: 15px;
          left:calc(30% - 7px);
          top: 11px;
        }
      }
      &::before{
        content: "";
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: $border-color;
        position: absolute;
        top: 14px;
        left:calc(30% - 4px);
      }
    }
    .time1{
      float: left;
      width: calc(30% - 150px);
      text-align: right;
      padding-right: 60px;
    }
    .operator{
      float: left;
      width: 150px;
      font-size: 14px;
      padding-right: 50px;
    }
    .time2{
      float: left;
      width: 180px;
      text-align: right;
      padding-left: 20px;
      padding-right: 10px;
    }
    .news{
      float:left;
      width: calc(70% - 600px);
      font-size: 14px;
      padding-left: 20px;
        img{
            display: inline-block;
            width: 60px;
            vertical-align: middle;
            margin: 0 4px;
            border-radius: 3px;
        }
    }
    .opAdress{
      float: left;
      width: 320px;
      //text-align: right;
      padding-left: 10px;
      padding-right: 10px;
    }
    .opState{
      float: left;
      width: 100px;
      text-align: right;
      padding-left: 10px;
      padding-right: 10px;
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
}
</style>
