<template>
  <div id="toMain" class="toMainPage" v-show="isPT">
    <div class="dataTotal clearfix">
      <div class="item">
        <div class="icon">
          <img src="@/static/image/icons/main-icon1.png" alt="">
        </div>
        <div class="total">
          <div class="label">总交易额</div>
          <div class="data">{{collectData.dealFeeSum}}</div>
        </div>
      </div>
      <div class="item">
        <div class="icon">
          <img src="@/static/image/icons/main-icon2.png" alt="">
        </div>
        <div class="total">
          <div class="label">总订单数</div>
          <div class="data">{{collectData.orderCount}}</div>
        </div>
      </div>
      <div class="item">
        <div class="icon">
          <img src="@/static/image/icons/main-icon3.png" alt="">
        </div>
        <div class="total">
          <div class="label">线路数</div>
          <div class="data">{{collectData.routeCount}}</div>
        </div>
      </div>
      <div class="item">
        <div class="icon">
          <img src="@/static/image/icons/main-icon4.png" alt="">
        </div>
        <div class="total">
          <div class="label">车辆数</div>
          <div class="data">{{collectData.vehicleCount}}</div>
        </div>
      </div>
      <div class="item">
        <div class="icon">
          <img src="@/static/image/icons/main-icon5.png" alt="">
        </div>
        <div class="total">
          <div class="label">器具数</div>
          <div class="data">{{collectData.packCount}}</div>
        </div>
      </div>
      <div class="item">
        <div class="icon">
          <img src="@/static/image/icons/main-icon6.png" alt="">
        </div>
        <div class="total">
          <div class="label">仓库面积</div>
          <div class="data">{{collectData.storeAreaSum}}</div>
        </div>
      </div>
    </div>
    <div class="chartView">
      <ul class="tab clearfix">
        <li :class="{'active':lineType==1}" @click="initLineChart(1)">订单数</li>
        <li :class="{'active':lineType==2}" @click="initLineChart(2)">派车单数</li>
        <li :class="{'active':lineType==3}" @click="initLineChart(3)">货运量</li>
        <li :class="{'active':lineType==4}" @click="initLineChart(4)">器具数</li>
      </ul>
      <div class="clearfix">
        <div id="lineCharts" class="lineCharts fl"></div>
        <div class="info fr">
          <p>今日汇总 <span>{{zcData.count11}}</span></p>
          <p>昨日同比 <span class="red">{{zcData.count12}}</span></p>
        </div>
      </div>
    </div>
    <div class="clearfix">
      <div class="fl pieView">
        <div class="chartTitle">
          运输业务对比
          <ul class="tab">
            <li :class="{'active':pieType==1}" @click="initPieChart(1)">本月</li>
            <li :class="{'active':pieType==2}" @click="initPieChart(2)">上月</li>
          </ul>
        </div>
        <div id="pieChart" class="pieChart"></div>
      </div>
      <div class="fr rankView">
        <div class="chartTitle">
          运输业务城市排行榜
          <ul class="tab">
            <li :class="{'active':trankType==1}" @click="initrankChart(1)">出发地</li>
            <li :class="{'active':trankType==2}" @click="initrankChart(2)">目的地</li>
          </ul>
        </div>
        <table class="rank" width="100%" border="0" cellspacing="0" cellpadding="0">
          <thead>
            <tr>
              <th width="40">排名</th>
              <th width="200">城市</th>
              <th width="50">占比</th>
              <th width="80"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in rankList" :key="index">
              <td>{{index+1}}</td>
              <td>{{item.city}}</td>
              <td>{{item.scale}}</td>
              <td>
                <el-progress type="circle" :percentage="item.progress" :width="40"></el-progress>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  import toMain from "./toMain.js"
  export default toMain
</script>
<style lang="scss" src="./toMain.scss"></style>
