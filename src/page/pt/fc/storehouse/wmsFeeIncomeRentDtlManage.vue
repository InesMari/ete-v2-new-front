<template>
  <div id="wmsFeeIncomeRentDtlManage">
    <searchList :formData="formData" @doQuery="doQuery" @clearFn="initQuery" :query="query" searchKey="wmsFeeIncomeRentDtlManageSearch"></searchList>

    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>仓库收入明细列表</span>
          <el-tooltip effect="light" content="仓库收入明细列表" placement="right">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" @click="downExcel()" v-entity="1005106">导出Excel</el-button>
        </div>
      </div>
      <tableCommon tableName="wmsFeeIncomeRentDtlManageTable" ref="table" :showNum="true" v-slot="{item}" :showSetTable="true" :head="head" :singleSelect="true">
      </tableCommon>
    </div>
  </div>
</template>

<script>
import wmsFeeIncomeRentDtlManage from './wmsFeeIncomeRentDtlManage.js'
export default wmsFeeIncomeRentDtlManage
</script>

<style scoped>

</style>
