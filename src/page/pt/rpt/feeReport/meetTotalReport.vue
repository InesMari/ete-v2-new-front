<template>
  <div id="meetTotalReport">
    <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="meetTotalReportSearch"></searchList>

    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>应付汇总表</span>
          <el-tooltip effect="light" content="应付汇总表" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" @click="download()" v-entity :entityId="[{1007014:1007024}]" >导出EXCEL</el-button>
        </div>
      </div>
      <tableCommon tableName="meetTotalReportTable" ref="table" :head="head" :showNum="true"
                   :showSetTable="true" :do-qry-sum="true">
      </tableCommon>
    </div>
  </div>
</template>

<script>
import meetTotalReport from './meetTotalReport.js'

export default meetTotalReport
</script>
<style lang="scss">

</style>

