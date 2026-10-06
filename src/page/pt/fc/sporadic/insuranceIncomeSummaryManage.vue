<template>
    <div id="insuranceIncomeSummaryManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="insuranceIncomeSummaryManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>保险收入汇总列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="保险收入汇总列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="download" v-entity="1006218">导出Excel</el-button>
                    <el-button type="primary" plain size="mini" @click="detailIncome" v-entity="1006219">详情</el-button>
                </div>
            </div>
            <tableCommon tableName="insuranceIncomeSummaryManageTable" ref="table" :showNum="true" :showSetTable="true"
                         :singleSelect="true" :head="head" @dblclickItem="dblclickItem">
            </tableCommon>
        </div>
    </div>
</template>

<script>
import insuranceIncomeSummaryManage from './insuranceIncomeSummaryManage.js'

export default insuranceIncomeSummaryManage
</script>

<style scoped>

</style>
