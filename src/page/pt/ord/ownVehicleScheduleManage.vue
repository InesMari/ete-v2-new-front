<template>
    <div id="ownVehicleScheduleManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="ownVehicleScheduleManageSearch"></searchList>
        <!-- 列表相关  开始 -->
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>自有动态运力管理列表</span>
                    <el-tooltip effect="light" content="自有动态运力管理列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" style="margin-left: 10px;" v-entity="1003092" @click="toAddOrder">下单调度</el-button>
                </div>
            </div>
            <tableCommon tableName="ownVehicleScheduleManageTable" ref="table" :singleSelect="true" :head="head" :showNum="true" :showSetTable="true"
                         @dblclickItem="dblclickItem" >
                <template v-slot:default="{item,code}">
                  <div v-if="code=='relOrderNum'">
                    <a href="javascript:void(0);" class="link"   @click.stop="toOrderDetail(item)">{{item.relOrderNum}}</a>
                  </div>
                  <div v-if="code=='relWaybillNum'">
                    <a href="javascript:void(0);" class="link"   @click.stop="toWaybillDetail(item)">{{item.relWaybillNum}}</a>
                  </div>
                </template>
            </tableCommon>
        </div>
        <!-- 列表相关  结束 -->

      <el-dialog title="详情" :visible.sync="showDialog" :close-on-click-modal="false" :close-on-press-escape="false" width="850px" @close="closeDialog()">
        <div class="common-info" style="border:none;padding:0;margin-top: -20px">
          <h3 class="common-title">
            <span class="title-name">自有车信息</span>
          </h3>
          <ul class="content clearfix" style="margin-top: 10px;">
            <li class="item item50">
              <label class="label-term">车牌号码</label>
              <div class="input-text">
                <el-input v-model="info.plateNumber" disabled="true"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">司机姓名</label>
              <div class="input-text">
                <el-input v-model="info.driverName" disabled="true"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">车长</label>
              <div class="input-text">
                <el-input v-model="info.vehicleLengthName" disabled="true"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">司机手机</label>
              <div class="input-text">
                <el-input v-model="info.driverPhone" disabled="true"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">车型</label>
              <div class="input-text">
                <el-input v-model="info.vehicleTypeName" disabled="true"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">申请时间</label>
              <div class="input-text">
                <el-input v-model="info.scheduleTime" disabled="true"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">收车时间</label>
              <div class="input-text">
                <el-input v-model="info.endCarDate" disabled="true"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">等待时间</label>
              <div class="input-text">
                <el-input v-model="info.duration" disabled="true"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">回程起始地</label>
              <div class="input-text">
                <el-input v-model="info.beginAddress" disabled="true"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">当前位置</label>
              <div class="input-text">
                <el-input v-model="info.curLocation" disabled="true"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">距离</label>
              <div class="input-text">
                <el-input v-model="info.distance" disabled="true"></el-input>
              </div>
            </li>
          </ul>
          <h3 class="common-title" style="margin-top: 10px">
            <span class="title-name">当前派车信息</span>
          </h3>
          <ul class="content clearfix" style="margin-top: 10px;">
            <li class="item item50">
              <label class="label-term">调度人</label>
              <div class="input-text">
                <el-input v-model="info.createUserName" disabled="true"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">调度时间</label>
              <div class="input-text">
                <el-input v-model="info.createDate" disabled="true"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">订单号</label>
              <div class="input-text">
                <el-input v-model="info.relOrderNum" disabled="true"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">派车单号</label>
              <div class="input-text">
                <el-input v-model="info.relWaybillNum" disabled="true"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">是否回程单</label>
              <div class="input-text">
                <el-input v-model="info.isReturnTripName" disabled="true"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">线路</label>
              <div class="input-text">
                <el-input v-model="info.routeName" disabled="true"></el-input>
              </div>
            </li>
          </ul>


          <div class="page-bot-btn ">
            <el-button size="mini" @click="closeDialog()">关闭</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
</template>

<script>
	import ownVehicleScheduleManage from './ownVehicleScheduleManage.js'
	export default ownVehicleScheduleManage
</script>
<style lang="scss">
</style>
