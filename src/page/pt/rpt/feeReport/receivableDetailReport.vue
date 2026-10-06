<template>
    <div id="receivableDetailReport">
      <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="receivableDetailReportSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>应收明细列表</span>
                    <el-tooltip effect="light" content="应收明细列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="download()" v-entity :entityId="[{1007015:1007025}]" >导出EXCEL</el-button>
                </div>
            </div>
            <tableCommon tableName="receivableDetailReportTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" @dblclickItem="toCustomerConfirmedBillDetail" :do-select-sum="true"></tableCommon>
        </div>
    </div>
</template>

<script>
	import receivableDetailReport from './receivableDetailReport.js'
	export default receivableDetailReport
</script>
<style lang="scss">

</style>

