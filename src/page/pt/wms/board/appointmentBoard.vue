<template>
  <div id="appointmentBoard" class="appointmentBoardPage boardPage" :class="{'isFullScreen':isFullScreen}">
      <div class="title">
          <img class="logo" src="@/static/image/logo4.png" alt="">
          <h3>预约 - {{workName?workName:'仓库'}}</h3>
          <el-radio-group class="worklist" v-model="workId" @change="changeWork" v-show="workList.length>2">
            <el-radio-button  :label="item.workId" v-for="item in workList">{{ item.workName }}</el-radio-button>
          </el-radio-group>
          <span class="time">{{dateTime}} {{week}}</span>
          <i title="刷新页面" class="el-icon-refresh-right" @click="refreshPage"></i>
          <img v-show="!isFullScreen" title="全屏" src="@/static/image/fullScreen_white.png" class="fullscreenIcon" @click="fullScreen"/>
          <img v-show="isFullScreen" title="退出全屏" src="@/static/image/exit-fullscreen.png" class="fullscreenIcon exitFullscreen" @click="exitFullScreen"/>
      </div>
      <div class="line"></div>
      <div class="tableDiv" ref="tableDiv">
        <table class="appointTable" width="100%" border="0" cellspacing="0" cellpadding="0">
          <thead>
              <tr>
                  <th width="60">序号</th>
                  <th width="130">到货厂商</th>
                  <th width="120">车牌号码</th>
                  <th width="130">手机号</th>
                  <th width="130">预计到达时间</th>
                  <th width="130">实际报到时间</th>
                  <th width="150">货物</th>
                  <th width="100">卸货状态</th>
              </tr>
          </thead>
          <tbody ref="dataDom" :style="'top:-'+top+'px'">
              <tr v-for="(item,index) in tableData" :key="index">
                  <td width="60">{{index+1}}</td>
                  <td width="130">{{item.fromTenantName?item.fromTenantName:'--'}}</td>
                  <td width="120">{{item.plateNumber}}</td>
                  <td width="130">{{item.billId?item.billId:'--'}}</td>
                  <td width="130">{{item.expectArriveDate}}</td>
                  <td width="130">{{item.checkInDate}}</td>
                  <td width="150">{{item.goodsCount?item.goodsType+'/'+item.goodsCount+'托':item.goodsType}}</td>
                  <td width="100">{{item.stateName}}</td>
              </tr>
          </tbody>
        </table>
      </div>
  </div>
</template>

<script>
import appointmentBoard from "./appointmentBoard.js";
export default appointmentBoard;
</script>
<style lang="scss" scoped src="./board.scss"></style>