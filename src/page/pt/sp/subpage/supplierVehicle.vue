<template>
  <div id="supplierVehicle">
    <div class="search-list clearfix">
      <div class="search-form clearfix" @keyup.enter="doQuery()">
        <div class="item" style="width: 250px">
          <label class="label">车牌号码：</label>
          <div class="input-text">
            <el-input v-model="vehicleQuery.plateNumber" placeholder="车牌号码" type="text"></el-input>
          </div>
        </div>
      </div>
      <div class="search-btn clearfix">
        <div class="btn">
          <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询</el-button>
        </div>
        <div class="btn">
          <el-button type="danger" plain size="mini" icon="el-icon-close" @click="clear()">清空</el-button>
        </div>
      </div>
    </div>
    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>供应商车辆列表</span>
          <el-tooltip effect="light" content="没有开票资质只能调度G7审核通过的车辆" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn">
          <el-button type="primary" plain size="mini" @click="showAddVehicle">添加</el-button>
          <el-button type="danger" plain size="mini" @click="delVehicle">删除</el-button>
        </div>
      </div>
      <tableCommon tableName="vehicleTable" ref="vehicleTable" :showNum="true" :showSetTable="false" :head="head"></tableCommon>
    </div>
    <el-dialog title="添加车辆"  :visible.sync="showDialog" :close-on-click-modal="false" :close-on-press-escape="false"
               :modal-append-to-body="true" :append-to-body="true"
               width="580px" @close="showDialog=false">
      <div class="common-info" style="border:none;padding:0;">
        <ul class="content clearfix">
          <li class="item" style="width:496px;">
            <label class="label-term"><em>*</em>车辆</label>
            <div class="input-text">
              <el-select v-model="selVehicleList" @change="$forceUpdate()" placeholder="请选择车辆" multiple filterable>
                <el-option
                    v-for="item in vehicleList"
                    :key="item.vehicleId"
                    :label="item.plateNumber"
                    :value="item.vehicleId">
                </el-option>
              </el-select>
            </div>
          </li>
        </ul>

        <div class="page-bot-btn ">
          <el-button size="mini" @click="showDialog=false;" >关闭</el-button>
          <el-button type="primary" size="mini" @click="addVehicle">提交</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import supplierVehicle from './supplierVehicle.js'
export default supplierVehicle
</script>

<style scoped>

</style>
