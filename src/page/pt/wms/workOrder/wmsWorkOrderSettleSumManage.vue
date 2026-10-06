<template>
    <div id="wmsWorkOrderSettleSumManage">
      <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="wmsWorkOrderSettleSumManageSearch"></searchList>
      <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>外包作业结算汇总列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="外包作业结算汇总列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                </div>
            </div>
            <tableCommon tableName="wmsWorkOrderSettleSumManageTable" ref="table" :showNum="true" :singleSelect="false"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem">
            </tableCommon>
        </div>
    </div>
</template>

<script>
import wmsWorkOrderSettleSumManage from './wmsWorkOrderSettleSumManage.js'
export default wmsWorkOrderSettleSumManage
</script>
<style lang="scss">

</style>




