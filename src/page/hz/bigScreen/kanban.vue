<template>
    <div id="kanban" :class="{'isFullScreen':isFullScreen}">
      <div class="titbox">收发货管理看板<div style="margin-right: 50px;" class="timebox">{{date + timeData}}</div></div>
      <img class="fullScreen" @click="fullScreen" src="@/static/image/fullScreen.png" title="全屏/退出全屏" alt="" />
      <div class="numbox">
        <div class="item">
          <div class="text">累计</div>
          <div class="con">
            <p class="p1">{{sum.unloadingCount}}车</p>
            <p class="p2">未装货</p>
          </div>
        </div>
        <div class="item">
          <div class="text">今日</div>
          <div class="con">
            <p class="p1">{{sum.loadedCountToday}}车</p>
            <p class="p2">已装货</p>
          </div>
        </div>
        <div class="item">
          <div class="text">累计</div>
          <div class="con">
            <p class="p1">{{sum.unreceiptCount}}车</p>
            <p class="p2">未收货</p>
          </div>
        </div>
        <div class="item">
          <div class="text">今日</div>
          <div class="con">
            <p class="p1">{{sum.receiptCountToday}}车</p>
            <p class="p2">已收货</p>
          </div>
        </div>
      </div>
      <div class="phonelist clearfix" v-show="isShowStaticData">
        <div class="fl">发货人：{{consignee1}}&nbsp;&nbsp;&nbsp;&nbsp;{{consignee2}}</div>
        <div class="fl">收货人：{{consignor1}}&nbsp;&nbsp;&nbsp;&nbsp;{{consignor2}}</div>
      </div>
      <div class="tableback">
        .
        <div class="tablebox table_height_left js_my_fixtable" ref="table_height_left" v-myscrolled="{changeTop}">

          <table border="0" cellspacing="0" cellpadding="0" id="js_my_fixtable" style="width:100%;table-layout: fixed;border-collapse: collapse;">
            <thead style="width:100%;table-layout: fixed;">
            <tr style="table-layout: fixed;width:100%;">
              <th width="70">&nbsp;</th>
              <th width="250">线路名称</th>
              <th width="100">状态</th>
              <th width="140">车牌号码</th>
              <th width="160">车型</th>
              <th width="160">司机名称</th>
              <th width="180">司机手机号</th>
              <th width="160">预计到达时间</th>
              <th width="200">货物名称</th>
              <th width="100">货物重量吨</th>
            </tr>
            </thead>
            <tbody style="table-layout: fixed;width:100%;">
            <tr :class="t.changeBGColor == 1 ? 'redback' : ''" v-for="(t, index) in tableData">
              <td width="4%">
                <div class="status">{{t.workType == 2 ? "收货" : "发货"}}</div>
              </td>
              <td width="18%" style="position:relative;">
                {{t.routeName}}
                <img v-show="t.isUrgent == 1" src="@/static/image/urgent.png" class="urgentimg">
              </td>
              <td width="5%">{{t.entruckingStateName}}</td>
              <td width="8%">{{t.plateNumber}}</td>
              <td width="8%">{{t.vehicleTypeModelName}}</td>
              <td width="8%">{{t.driverName}}</td>
              <td width="9%">{{t.driverBill}}</td>
              <td width="16%">{{t.workDate}}</td>
              <td width="13%">{{t.goodsNames}}</td>
              <td width="8%">{{t.goodsWeightSum}}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 左侧弹框 -->
      <div class="showbtn" @click="showLeftBox" v-show="!isshowLeftBox">></div>
      <div class="leftbox" :class="{'leftboxOpen':isshowLeftBox}">
        <el-input class="input" v-model="query.workName" @input="loadWorkData(true)" placeholder="搜索作业点" style="text-align: center;"></el-input>
        <div class="title" style="background-color: #dc0427;color: #ffffff;">作业点名称</div>
        <ul class="list">
          <li v-for="w in workData">
            <div @click="selectWork(w)" style="font-size: 20px;">
              <label>{{w.workName}}<input type="radio" name="factoryId" v-model="query.workId" :value="w.workId" ></label>
            </div>

          </li>
        </ul>
      </div>
      <div class="hidebtn" @click="showLeftBox" v-show="isshowLeftBox"><</div>
      <!-- 左侧弹框 -->

    </div>
</template>

<script>
    import kanban from './kanban.js'
    export default kanban;
</script>

<style lang="scss">
#kanban {
  &.isFullScreen{
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999999;
    height: 100%;
    .showbtn{
      left:0!important;
    }
    .leftboxOpen{
      left: 0!important;
    }
    .hidebtn{
      left: 288px;
    }
  }
  background: url(../../../static/image/hzkb_back.png) no-repeat center top;
  background-size: 100% 100%;
  background-attachment: fixed;
  height: auto;
  .titbox {
    width: 100%;
    height: 107px;
    background: url(../../../static/image/hzkb_tit.png) no-repeat center top;
    background-size: 1596px 107px;
    font-size: 48px;
    line-height: 90px;
    color: #ffffff;
    text-align: center;
    position: relative;
  }

  .timebox {
    position: absolute;
    right: 0.8%;
    top: 10px;
    font-size: 25px;
    line-height: 36px;
    color: #d7d0d0;
  }

  .numbox {
    width: 100%;
    overflow: hidden;
    margin: 15px 0;
    .item {
      width: 24%;
      height: 120px;
      float: left;
      margin-left: 0.8%;
      background: rgba(255, 255, 255, 0.08);
      text-align: center;
      position: relative;
      display: flex;
      align-items: center;
      .text {
        height: 30px;
        font-size: 30px;
        color: #ffffff;
        font-weight: bold;
        line-height: 30px;
        // position: absolute;
        // top: 45px;
        // left: 60px;
        flex: 3;
        align-items: center;
      }
      .con{
        flex: 4;
        align-items: center;
        text-align: left;
      }
    }
  }

  .numbox .item .p1 {
    font-size: 48px;
    color: #E18D10;
    font-weight: bold;
    line-height: 70px;
  }

  .numbox .item .p2 {
    font-size: 30px;
    color: #ffffff;
    font-weight: bold;
    line-height: 30px;
  }

  .tableback {
    width: 98.4%;
    height: 750px;
    margin: 15px 0.8%;
    background: rgba(255, 255, 255, 0.08);
  }

  .tablebox {
    height: 100%;
    overflow: auto;
    position: relative;
  }

  .tablebox tr th, .tablebox tr td {
    table-layout: fixed;
    font-size: 30px;
    line-height: 40px;
    text-align: center;
    color: #ffffff;
    padding: 10px 0;
  }

  .status {
    width: 70px;
    height: 40px;
    border: 1px solid #ffffff;
    border-bottom-right-radius: 20px;
    border-top-right-radius: 20px;
    font-size: 24px;
    font-weight: bold;
    line-height: 40px;
    text-align: center;
    color: #ffffff;
  }

  .redback {
    background: rgba(255, 0, 0, 0.33);
  }

  .showbtn {
    width: 24px;
    height: 40px;
    border: 1px solid #bbbbbb;
    background: #ffffff;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    font-size: 20px;
    color: #101010;
    line-height: 40px;
    cursor: pointer;
    text-align: center;
    position: absolute;
    left: 25px;
    top: 265px;
  }

  .hidebtn {
    width: 24px;
    height: 40px;
    border: 1px solid #bbbbbb;
    background: #ffffff;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
    font-size: 20px;
    color: #101010;
    line-height: 40px;
    cursor: pointer;
    text-align: center;
    position: absolute;
    left: 313px;
    top: 265px;
  }

  .leftbox {
    width: 288px;
    height: calc(100% - 10px);
    border: 1px solid #bbbbbb;
    background: #ffffff;
    // transition: all .5s;
    position: absolute;
    left: -288px;
    top: 10px;
    &.leftboxOpen{
      left: 25px;
    }
    .el-input{
      display: block;
      padding:0;
      .el-input__inner{
        text-align: center;
      }
    }
  }

  // .leftbox .input {
  //   width: 266px;
  //   height: 40px;
  //   font-size: 20px;
  //   line-height: 40px;
  //   color: #888888;
  //   padding: 0 10px;
  //   border: 0;
  // }

  .leftbox .title {
    padding-left: 112px;
    height: 40px;
    font-size: 20px;
    line-height: 40px;
    color: #101010;
    border-top: 1px solid #bbbbbb;
    border-bottom: 1px solid #bbbbbb;
  }

  .leftbox .list {
    width: 288px;
    height: 88%;
    overflow: auto;
    padding: 10px 0;
  }

  .leftbox .list li {
    height: 30px;
    line-height: 30px;
    font-size: 20px;
    color: #101010;
    text-align: center;
  }

  .leftbox .list li input {
    width: 14px;
    height: 14px;
    margin-left: 20px;
  }

  .fullScreen {
    position: absolute;
    right: 10px;
    top: 20px;
    width: 30px;
    cursor: pointer;
  }

  // .tablebox thead tr th, .tablebox thead tr {
  //   display: inline-block;
  // }

  .urgentimg {
    width: 24px;
    height: 32px;
    position: absolute;
    right: 0;
    top: 10px;
  }

  .phonelist {
    padding-right: 0.8%;
    margin: 20px 0;
  }

  .phonelist div {
    font-size: 24px;
    color: #fff;
    box-sizing: border-box;
    padding-left: 60px;
    width: 49.2%;
    background: rgba(255, 255, 255, 0.08);
    line-height: 2;
    margin-left: 0.8%;
  }

}
</style>
