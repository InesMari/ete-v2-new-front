<template>
  <div id="allocatScanQrcodeManage">
    <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="allocatScanQrcodeManageSearch"></searchList>
    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>移库扫码明细</span>
          <el-tooltip effect="light" content="移库扫码明细" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" v-entity="1005259" @click="downloadExcel()">导出</el-button>
        </div>
      </div>
      <tableCommon tableName="allocatScanQrcodeManageTable" ref="table" :head="head" :showNum="true"
                   :showSetTable="true" single-select="true"></tableCommon>
    </div>
  </div>
</template>

<script>
import allocatScanQrcodeManage from './allocatScanQrcodeManage.js'
export default allocatScanQrcodeManage
</script>
<style lang="scss">
#allocatScanQrcodeManage{

}
</style>

