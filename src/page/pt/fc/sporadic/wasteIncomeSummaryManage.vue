<template>
    <div id="wasteIncomeSummaryManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="wasteIncomeSummaryManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>废品收入汇总列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="废品收入汇总列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="download" v-entity="1006226">导出Excel</el-button>
                    <el-button type="primary" plain size="mini" @click="detailIncome" v-entity="1006227">详情</el-button>
                </div>
            </div>
            <tableCommon tableName="wasteIncomeSummaryManageTable" ref="table" :showNum="true" :showSetTable="true"
                         :singleSelect="true" :head="head" @dblclickItem="dblclickItem">
            </tableCommon>
        </div>
    </div>
</template>

<script>
import wasteIncomeSummaryManage from './wasteIncomeSummaryManage.js'

export default wasteIncomeSummaryManage
</script>

<style scoped>

</style>
