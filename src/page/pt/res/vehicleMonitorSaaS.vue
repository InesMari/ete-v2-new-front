<template>
    <div id="vehicleMonitorSaaS" class="vehicleMonitorSaaSPage">
        <div class="map-popup-top" @keyup.enter="doQuery()">
            <div class="fl" style="line-height: 30px;margin-right: 15px;">车牌号码:</div>
            <el-input class="queryIpt fl" v-model="query.plateNumber" placeholder="请输入车牌号查询" type="text"></el-input>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="doQuery()"></el-button>
        </div>
        <!-- 地图 -->
        <div id="mapId" class="bm-view"></div>
    </div>
</template>

<script>
	import vehicleMonitorSaaS from './vehicleMonitorSaaS.js'

	export default vehicleMonitorSaaS;
</script>
<style lang="scss">
  .vehicleMonitorSaaSPage {
    position: relative;
    height: 100%;
    border: $border;
    box-sizing: border-box;

    .map-popup-top {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 99;
      width: auto;
      padding: 5px 10px;
      border-bottom: $border;
      box-sizing: border-box;
      background: rgba(255, 255, 255, 0.8);

      .el-select {
        width: 100px;
        margin-left: 20px;
      }

      .queryIpt {
        width: 150px;
      }

      .el-input__inner {
        height: 30px;
      }

      .el-button {
        padding: 7px 10px;
        margin-left: 20px;
      }
    }

    .map-popup-bottom {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 99;
      width: 100%;
      border-top: $border;
      background: #fff;
      box-sizing: border-box;

      .item {
        float: left;
        line-height: 40px;
        font-size: 12px;
        padding: 0 30px 0 20px;
        position: relative;

        > span {
          font-weight: bold;
          margin-left: 20px;
        }

        &.all {
          color: #fff;
          background: red;
        }

        &::before {
          content: "";
          position: absolute;
          right: 0;
          top: 8px;
          border-right: $border;
          height: 24px;
        }

        &.all::before {
          display: none;
        }
      }
    }

    .bm-view {
      height: 100%;
      width: 100%;
    }
  }
</style>
