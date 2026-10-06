<template>
    <div id="overdueFeeDetailReport">
      <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="overdueFeeDetailReportSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>逾期明细汇总表</span>
                    <el-tooltip effect="light" content="逾期明细汇总表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" >
                    <el-button type="primary" plain size="mini" @click="download()" v-entity :entityId="[{1007015:1007025}]" >导出EXCEL</el-button>
                </div>
            </div>
            <tableCommon tableName="overdueFeeDetailReportTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="false" :do-qry-sum="true"></tableCommon>
        </div>
    </div>
</template>

<script>
	import overdueFeeDetailReport from './overdueFeeDetailReport.js'
	export default overdueFeeDetailReport
</script>
<style lang="scss">

</style>

