<template>
  <div id="vehicleNoGpsManage">
    <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="vehicleNoGpsManageSearch"></searchList>

    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>无定位车辆列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
          <el-tooltip effect="light" content="无定位车辆列表" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
            <el-button plain size="mini" @click="uploadOpen = true" v-entity="1002251">导入定位</el-button>
            <el-button plain size="mini" @click="downloadExcel" v-entity="1002255">导出</el-button>
        </div>
      </div>
      <tableCommon tableName="vehicleNoGpsManageTable" ref="table" :showNum="true" :showSetTable="true" :head="head" :singleSelect="true">
        <template v-slot:default="{item,index}">
          <a href="javascript:void(0);" class="link" @click="openDetail(item)">{{item.orderNum}}</a>
        </template>
      </tableCommon>
    </div>

    <my-import :open.sync="uploadOpen" :handle-success="uploadSuccess" begin-row="1"
               template="/download/vehicleGps.xlsx" title="车辆定位导入" bean="resVehicleInfoTF"
               method="impAddVehicleGpsInfos"></my-import>
  </div>
</template>

<script>
import vehicleNoGpsManage from './vehicleNoGpsManage.js'
export default vehicleNoGpsManage
</script>

<style scoped>

</style>
