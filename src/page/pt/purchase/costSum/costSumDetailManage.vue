<template>
    <div id="costSumDetailManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam"
                    searchKey="costSumDetailManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>实付汇总明细列表</span>
                    <el-tooltip effect="light" content="实付汇总明细列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" v-entity="1014041" @click="download">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="costSumDetailManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :single-select="true">
            </tableCommon>
        </div>
    </div>
</template>

<script>
import costSumDetailManage from './costSumDetailManage.js'
export default costSumDetailManage
</script>
<style lang="scss">
</style>

