<template>
  <div id="stockDtlSummaryManage">
    <select-work v-show="showSelWork"></select-work>
    <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="stockDtlSummaryManageSearch" v-show="!showSelWork"></searchList>

    <div class="table-content" v-show="!showSelWork">
      <div class="table-title">
        <h3>
          <span>库存结余汇总列表</span>
          <el-tooltip effect="light" content="库存结余汇总列表" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" v-entity="1005218" @click="download">导出Excel</el-button>
        </div>
      </div>
      <tableCommon tableName="stockDtlSummaryManageTable" ref="table" :head="head" :showNum="true"
                   :showSetTable="true" single-select="true" ></tableCommon>
    </div>
  </div>
</template>

<script>
import stockDtlSummaryManage from './stockDtlSummaryManage.js'
export default stockDtlSummaryManage
</script>

<style scoped>

</style>
