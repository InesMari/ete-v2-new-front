<template>
  <div id="accrualStatisticsManage">
    <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="accrualStatisticsManageSearch"></searchList>

    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>仓储成本计提</span>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" @click="toAccrualInfo" v-entity="1007106">查看明细</el-button>
          <el-button type="primary" plain size="mini" @click="download" v-entity="1007107">导出</el-button>
        </div>
      </div>
      <tableCommon tableName="accrualStatisticsManageTable" ref="table" :showNum="true"
                   :showSetTable="true" :head="head" :singleSelect="true" @dblclickItem="dblclickItem">
      </tableCommon>
    </div>
  </div>
</template>

<script>
import accrualStatisticsManage from './accrualStatisticsManage.js'
export default accrualStatisticsManage
</script>

<style scoped>

</style>
