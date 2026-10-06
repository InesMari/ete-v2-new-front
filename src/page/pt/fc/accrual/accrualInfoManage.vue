<template>
  <div id="accrualInfoManage">
    <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="accrualInfoManageSearch"></searchList>

    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>仓储成本计提</span>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" @click="download" v-entity="1007108">导出</el-button>
        </div>
      </div>
      <tableCommon tableName="accrualInfoManageTable" ref="table" :showNum="true"
                   :showSetTable="true" :head="head" :singleSelect="true">
      </tableCommon>
    </div>
  </div>
</template>

<script>
import accrualInfoManage from './accrualInfoManage.js'
export default accrualInfoManage
</script>

<style scoped>

</style>
