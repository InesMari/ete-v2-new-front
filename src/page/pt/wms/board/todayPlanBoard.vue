<template>
  <div id="todayPlanBoard" class="boardPage todayPlanBoardPage" :class="{ 'isFullScreen': isFullScreen }">
    <div class="title">
      <img class="logo" src="@/static/image/logo4.png" alt="">
      <h3>今日计划 - {{ workName ? workName : '仓库' }}</h3>
      <!-- <el-radio-group class="worklist" v-model="workId" @change="changeWork" v-show="workList.length > 2">
        <el-radio-button :label="item.workId" v-for="item in workList">{{ item.workName }}</el-radio-button>
      </el-radio-group> -->
      <span class="time">{{ dateTime }} {{ week }}</span>
      <i title="刷新页面" class="el-icon-refresh-right" @click="refreshPage"></i>
          <img v-show="!isFullScreen" title="全屏" src="@/static/image/fullScreen_white.png" class="fullscreenIcon" @click="fullScreen"/>
          <img v-show="isFullScreen" title="退出全屏" src="@/static/image/exit-fullscreen.png" class="fullscreenIcon exitFullscreen" @click="exitFullScreen"/>
    </div>
    <div class="line"></div>
    <div class="tableDiv" ref="tableDiv">
      <table class="appointTable" width="100%" border="0" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <th width="50">序号</th>
            <th width="150">出库单号</th>
            <th width="120">客户名称</th>
            <th width="130">物料名称</th>
            <th width="130">要求出库时间</th>
            <th width="130">配送地址</th>
            <th width="100">订单状态</th>
            <th width="110">距离超时时间</th>
          </tr>
        </thead>
        <tbody ref="dataDom" :style="'top:-' + top + 'px'">
          <tr v-for="(item, index) in tableData" :key="index">
            <td width="50">{{ index + 1 }}</td>
            <td width="150">{{ item.outOrderNum }}</td>
            <td width="120">{{ item.srcTenantName }}</td>
            <td width="130">{{ item.materialDesc }}</td>
            <td width="130">{{ item.requireOutDate ? item.requireOutDate : "--" }}</td>
            <td width="130">{{ item.workName }}</td>
            <td width="100">{{ item.stateName }}</td>
            <td width="110"><span :style="item.itemout == 1 ? 'color:red' : ''">{{ item.itemoutStr }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import todayPlanBoard from "./todayPlanBoard.js";
export default todayPlanBoard;
</script>
<style lang="scss" scoped src="./board.scss"></style>
<style lang="scss" scoped>
.todayPlanBoardPage {
  .appointTable {

    td,
    th {
      font-size: 1.5vw;
    }
  }
}
</style>ss