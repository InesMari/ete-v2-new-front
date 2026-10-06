<template>
  <div id="orderScanQrcodeManage">
    <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="orderScanQrcodeManageSearch"></searchList>
    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>出入库扫码明细</span>
          <el-tooltip effect="light" content="出入库扫码明细" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" v-entity="1005258" @click="downloadExcel()">导出</el-button>
        </div>
      </div>
      <tableCommon tableName="orderScanQrcodeManageTable" ref="table" :head="head" :showNum="true"
                   :showSetTable="true" single-select="true"></tableCommon>
    </div>
  </div>
</template>

<script>
import orderScanQrcodeManage from './orderScanQrcodeManage.js'
export default orderScanQrcodeManage
</script>
<style lang="scss">
#orderScanQrcodeManage{

}
</style>

