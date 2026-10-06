<template>
    <div id="costSumManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam"
                    searchKey="costSumManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>实付汇总列表</span>
                    <el-tooltip effect="light" content="实付汇总列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" v-entity="1014040" @click="toDetail">实付汇总明细</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014028" @click="download">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="costSumManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :single-select="true">
            </tableCommon>
        </div>
    </div>
</template>

<script>
import costSumManage from './costSumManage.js'
export default costSumManage
</script>
<style lang="scss">
</style>

