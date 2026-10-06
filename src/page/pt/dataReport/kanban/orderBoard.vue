<template>
  <div id="orderBoard" class="orderBoardPage" :class="{'isFullScreen':isFullScreen}">
      <div class="title">
          <img class="logo" src="@/static/image/logo4.png" alt="">
          <h3>易迁易订单数据中心</h3>
          <div class="timeBtns">
            <span class="time">{{dateTime}} {{week}}</span>
            <i title="刷新页面" class="el-icon-refresh-right" @click="refreshPage"></i>
            <img v-show="!isFullScreen" title="全屏" src="@/static/image/fullScreen_white.png" class="fullscreenIcon" @click="fullScreen"/>
            <img v-show="isFullScreen" title="退出全屏" src="@/static/image/exit-fullscreen.png" class="fullscreenIcon exitFullscreen" @click="exitFullScreen"/>
          </div>
      </div>
      <div class="line"></div>
      <div class="listChart">
        <!-- 左侧待调度订单表格 -->
        <div class="scheduled">
          <div class="panel-header">
            <span class="panel-title">待调度订单<span class="panel-count">({{scheduledList.length}})</span></span>            
          </div>
          <div class="table-wrapper">
            <table class="scheduledTable" width="100%" border="0" cellspacing="0" cellpadding="0">
              <thead>
                  <tr>
                      <th width="50">序号</th>
                      <th width="100">客户</th>
                      <th width="90">单号</th>
                      <th width="100">线路</th>
                      <th width="90">货物重量/kg</th>
                      <th width="70">货物件数</th>
                      <th width="80">报价车型</th>
                  </tr>
              </thead>
            </table>
            <div class="table-body-wrapper" ref="scheduledTableBody">
              <table class="scheduledTable" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tbody>
                  <tr v-for="(item,index) in scheduledList" :key="index">
                      <td width="50">{{index+1}}</td>
                      <td width="100" :title="item.tenantName">{{item.tenantName || '--'}}</td>
                      <td width="90" :title="item.orderNum">{{item.orderNum || '--'}}</td>
                      <td width="100" :title="item.routeName">{{item.routeName || '--'}}</td>
                      <td width="90">{{item.goodsWeight || '--'}}</td>
                      <td width="70">{{item.goodsCount || '--'}}</td>
                      <td width="80">{{item.quoteVehicleTypeName || '--'}}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <!-- 右侧图表区域 -->
        <div class="chart">
          <div class="panel-header">
            <span class="panel-title">订单状态分布</span>
          </div>
          <div class="state-summary">
            <div class="summary-item" v-for="(item, index) in stateList" :key="index">
              <span class="summary-dot" :style="{backgroundColor: pieColors[index % pieColors.length]}"></span>
              <span class="summary-label">{{item.stateName}}：</span>
              <span class="summary-value">{{item.stateCount || 0}}</span>
            </div>
          </div>
          <div class="pie-chart-container">
            <div id="pieChart" class="pie-chart"></div>
          </div>
        </div>
      </div>
      <div class="line"></div>
      <!-- 下方运作中订单表格 -->
      <div class="operation-section">
        <div class="panel-header">
          <span class="panel-title">运作中的订单<span class="panel-count">({{operation.list.length}})</span></span>          
          <div class="stateList">
            <span>待卸货：{{ operation.state2 }}</span>
            <span>将超时：{{ operation.state3 }}</span>
            <span>已超时：{{ operation.state4 }}</span>
          </div>
        </div>
        <div class="table-wrapper">
          <table class="appointTable" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
                <tr>
                    <th width="40">序号</th>
                    <th width="180">客户</th>
                    <th width="120">订单单号  </th>
                    <th width="120">客户单号</th>
                    <th width="150">线路</th>
                    <th width="100">货物重量/kg</th>
                    <th width="100">货物件数</th>
                    <th width="100">车型</th>
                    <th width="100">车牌</th>
                    <th width="80">车长</th>
                    <th width="100">派车状态</th>
                    <th width="130">实际离厂时间</th>
                    <th width="80">线路时效</th>
                    <th width="80">卸货状态</th>
                </tr>
            </thead>
          </table>
          <div class="table-body-wrapper" ref="operationTableBody">
            <table class="appointTable" width="100%" border="0" cellspacing="0" cellpadding="0">
              <tbody>
                <tr v-for="(item,index) in operation.list" :key="index" :class="{'state2': item.state == 2, 'state3': item.state == 3, 'state4': item.state == 4}">
                    <td width="40">{{index+1}}</td>
                    <td width="180">{{item.tenantName || '--'}}</td>
                    <td width="120">{{item.orderNum || '--'}}</td>
                    <td width="120">{{item.custOrderNum || '--'}}</td>
                    <td width="150">{{item.routeName || '--'}}</td>
                    <td width="100">{{item.goodsWeight || '--'}}</td>
                    <td width="100">{{item.goodsCount || '--'}}</td>
                    <td width="100">{{item.vehicleTypeName || '--'}}</td>
                    <td width="100">{{item.plateNumber || '--'}}</td>
                    <td width="80">{{item.vehicleLengthName || '--'}}</td>
                    <td width="100">{{item.waybillStateName || '--'}}</td>
                    <td width="130">{{item.opDate || '--'}}</td>
                    <td width="80">{{item.transportTimeliness || '--'}}</td>
                    <td width="80">{{item.stateName || '--'}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import orderBoard from "./orderBoard.js";
export default orderBoard;
</script>
<style lang="scss" scoped>
// 大屏整页样式
.orderBoardPage {
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #0a1f4d 0%, #0d2554 50%, #0a1f4d 100%);
  color: #fff;
  font-family: "Microsoft YaHei", "PingFang SC", sans-serif;

  // 标题栏
  .title {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    position: relative;
    background: linear-gradient(90deg, rgba(64, 158, 255, 0.2) 0%, rgba(64, 158, 255, 0.05) 50%, rgba(64, 158, 255, 0.2) 100%);

    .logo {
      height: 36px;
      margin-right: 15px;
    }

    h3 {
      font-size: 24px;
      font-weight: bold;
      color: #fff;
      margin: 0 20px 0 210px;
      letter-spacing: 3px;
      text-shadow: 0 0 10px rgba(64, 158, 255, 0.5);
    }

    .timeBtns{
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .time {
      font-size: 14px;
      color: #a0cfff;
      margin-left: 20px;
    }

    .el-icon-refresh-right {
      font-size: 20px;
      color: #fff;
      margin-left: 20px;
      cursor: pointer;
      transition: transform 0.3s;

      &:hover {
        transform: rotate(180deg);
        color: #409EFF;
      }
    }

    .fullscreenIcon {
      width: 24px;
      height: 24px;
      margin-left: 15px;
      cursor: pointer;
      opacity: 0.8;
      transition: opacity 0.3s;

      &:hover {
        opacity: 1;
      }
    }
  }

  // 分隔线
  .line {
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(64, 158, 255, 0.5), transparent);
    margin: 5px 20px;
  }

  // 左右分布区域
  .listChart {
    flex: 1;
    display: flex;
    padding: 10px 20px;
    gap: 20px;
    min-height: 0;

    // 待调度订单表格
    .scheduled {
      flex: 1.2;
      display: flex;
      flex-direction: column;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      border: 1px solid rgba(64, 158, 255, 0.3);
      overflow: hidden;
    }

    // 右侧图表区域
    .chart {
      flex: 0.8;
      display: flex;
      flex-direction: column;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 8px;
      border: 1px solid rgba(64, 158, 255, 0.3);
      overflow: hidden;
    }
  }

  // 面板标题
  .panel-header {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 15px;
    background: linear-gradient(90deg, rgba(64, 158, 255, 0.3), rgba(64, 158, 255, 0.1));
    border-bottom: 1px solid rgba(64, 158, 255, 0.3);

    .panel-title {
      font-size: 14px;
      font-weight: bold;
      color: #fff;
    }

    .panel-count {
      font-size: 12px;
      color: #fff;
      margin-left: 5px;
    }

    .stateList {
      display: flex;
      align-items: center;
      gap: 15px;
      font-size: 12px;
      color: #a0cfff;

      span {
        white-space: nowrap;
        display: block;
        padding:3px 10px;
        color: #fff;
        border-radius: 3px;
        &:nth-child(1){
          background-color: rgb(145, 204, 117);
        }
        &:nth-child(2){
          background-color: rgb(250, 200, 88);
        }
        &:nth-child(3){
          background-color: rgb(238, 102, 102);
        }
      }
    }
  }

  // 表格容器
  .table-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    table {
      table-layout: fixed;
    }

    thead {
      background: rgba(64, 158, 255, 0.15);

      th {
        padding: 8px 5px;
        font-size: 14px;
        font-weight: bold;
        color: #a0cfff;
        text-align: center;
        border-bottom: 1px solid rgba(64, 158, 255, 0.3);
        white-space: nowrap;
      }
    }

    .table-body-wrapper {
      flex: 1;
      overflow-y: auto;
      overflow-x: auto;

      // 隐藏滚动条但保留功能
      scrollbar-width: none; // Firefox
      -ms-overflow-style: none; // IE/Edge

      &::-webkit-scrollbar {
        width: 0;
        height: 0;
        display: none; // Chrome/Safari
      }

      tbody tr {
        &.state2{
          background-color: rgb(145, 204, 117);
        }
        &.state3{
          background-color: rgb(250, 200, 88);
        }
        &.state4{
          background-color: rgb(238, 102, 102);
        }
        td {
          padding: 8px 5px;
          font-size: 14px;
          color: #fff;
          text-align: center;
          border-bottom: 1px solid rgba(64, 158, 255, 0.1);
          word-break: break-all;
        }
      }
    }
  }

  // 文字省略
  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  // 饼图容器
  .pie-chart-container {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;

    .pie-chart {
      width: 100%;
      height: 100%;
      min-height: 200px;
    }
  }

  // 状态汇总
  .state-summary {
    padding: 10px 15px;
    background: rgba(0, 0, 0, 0.2);
    border-top: 1px solid rgba(64, 158, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;

    .summary-item {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 5px 0;
      font-size: 14px;
      flex: 1;

      .summary-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 8px;
      }

      .summary-label {
        color: #a0cfff;
      }

      .summary-value {
        color: #fff;
        font-weight: bold;
        margin-left: 5px;
      }
    }
  }

  // 运作中订单区域
  .operation-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin: 0 20px 10px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    border: 1px solid rgba(64, 158, 255, 0.3);
    overflow: hidden;
    min-height: 0;
  }

}

// 全屏模式适配
.orderBoardPage.isFullScreen {
  .title h3 {
    font-size: 28px;
  }

  .listChart {
    gap: 30px;
  }
}
</style>
