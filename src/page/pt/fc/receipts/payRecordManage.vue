<template>
    <div id="payRecordManage" class="fcPayManagePage">
        <searchList :formData="formData" @doQuery="doQuery" @clearFn="initQuery" :query="query"
                    searchKey="payRecordManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>付款记录列表</span>
                    <el-tooltip effect="light" content="付款记录列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini"  @click="downloadExcel()">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="payRecordManageTable" ref="table" :showNum="true" :showSetTable="true" :head="head"
                         :singleSelect="false">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" class="link"
                       @click.stop="toDetail(item, code)" v-if="code=='payNum'">{{ item[code] }}</a>
                </template>
            </tableCommon>
        </div>
    </div>
</template>

<script>
import payRecordManage from './payRecordManage.js'

export default payRecordManage
</script>
<style lang="scss">
</style>
