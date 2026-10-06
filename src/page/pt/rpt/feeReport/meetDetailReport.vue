<template>
  <div id="meetDetailReport">
    <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="meetDetailReportSearch"></searchList>

    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>应付明细列表</span>
          <el-tooltip effect="light" content="应付明细列表" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" @click="download()" v-entity :entityId="[{1007014:1007024}]" >导出EXCEL</el-button>
        </div>
      </div>
      <tableCommon tableName="meetDetailReportTable" ref="table" :head="head" :showNum="true"
                   :showSetTable="true" @dblclickItem="toFcSupplierBillDetail" :do-qry-sum="true">
        <template v-slot:default="{item, code}">
          <a href="javascript:void(0);" class="link" v-if="code=='payNum'"
             @click.stop="toDetail(item.payId)">{{item.payNum}}</a>
        </template>
      </tableCommon>
    </div>
  </div>
</template>

<script>
import meetDetailReport from './meetDetailReport.js'

export default meetDetailReport
</script>
<style lang="scss">

</style>

