<template>
    <div id="inspectSummaryManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="inspectSummaryManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>巡检汇总列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                </div>
            </div>
            <tableCommon tableName="inspectSummaryManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" class="link"  @click.stop="dblclickItem(item)">{{'查看详情'}}</a>
                </template>
            </tableCommon>
        </div>
    </div>
</template>

<script>
import inspectSummaryManage from './inspectSummaryManage.js'
export default inspectSummaryManage
</script>
<style lang="scss">

</style>




