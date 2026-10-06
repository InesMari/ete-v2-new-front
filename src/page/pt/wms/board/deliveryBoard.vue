<template>
  <div id="deliveryBoard" class="deliveryBoardPage boardPage" :class="{'isFullScreen':isFullScreen}">
      <div class="title">
          <img class="logo" src="@/static/image/logo4.png" alt="">
          <h3>配送 - {{workName?workName:'仓库'}}</h3>
          <!-- <el-radio-group class="worklist" v-model="workId" @change="changeWork" v-show="workList.length>2">
            <el-radio-button  :label="item.workId" v-for="item in workList">{{ item.workName }}</el-radio-button>
          </el-radio-group> -->
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
                  <th width="50">序号</th>
                  <th width="140">短驳单号</th>
                  <th width="120">客户名称</th>
                  <th width="160">配送时间</th>
                  <th width="130">配送地址</th>
                  <th width="160">到达时间</th>
                  <th width="50">托数</th>
                  <th width="100">车牌</th>
                  <th width="100">车辆状态</th>
              </tr>
          </thead>
          <tbody ref="dataDom" :style="'top:-'+top+'px'">
              <tr v-for="(item,index) in tableData" :key="index">
                  <td>{{index+1}}</td>
                  <td>{{item.waybillNum}}</td>
                  <td>{{item.tenantName}}</td>
                  <td>{{item.deliveryDate}}</td>
                  <td>{{item.workName}}</td>
                  <td>{{item.confirmDate}}</td>
                  <td>{{item.palletNums}}</td>
                  <td>{{item.plateNumber}}</td>
                  <td>{{item.stateName}}</td>
              </tr>
          </tbody>
        </table>
      </div>
  </div>
</template>

<script>
import deliveryBoard from "./deliveryBoard.js";
export default deliveryBoard;
</script>
<style lang="scss" scoped src="./board.scss"></style>
<style lang="scss" scoped>
.deliveryBoardPage {
  .appointTable {

    td,
    th {
      font-size: 1.5vw;
    }
  }
}
</style>