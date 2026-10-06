<template>
  <div id="ordWaybillVehicleManage">
    <searchList :formData="formData" @doQuery="doQuery" :query="query" :searchKey="'ordWaybillVehicleManageSearch'+query.type"></searchList>

    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>运单车型统计列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
          <el-tooltip effect="light" content="运单车型统计列表" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain @click="downloadExcel" size="mini" :v-entity="query.type==1?1003120:1003121">导出</el-button>
        </div>
      </div>
      <tableCommon :tableName="'ordWaybillVehicleManageTable'+query.type" ref="table" :showNum="true" :showSetTable="true" :head="head" :singleSelect="true">
      </tableCommon>
    </div>


  </div>
</template>

<script>
import ordWaybillVehicleManage from './ordWaybillVehicleManage.js'
export default ordWaybillVehicleManage
</script>

<style scoped>

</style>
