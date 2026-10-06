<template>
    <div id="deviceOpLog" >
      <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="deviceOpLogManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>操作记录</span>
                    <el-tooltip effect="light" content="操作记录" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" @click="download()" >导出</el-button>
                </div>
            </div>
            <tableCommon tableName="deviceOpLogTable" ref="table" :showNum="true" :showSetTable="true" :singleSelect="true" :head="head">
            </tableCommon>
        </div>
    </div>
</template>

<script>
	import deviceOpLog from './deviceOpLog.js'
	export default deviceOpLog
</script>
<style lang="scss">
@import '@/page/pt/fc/fc_common.scss';
#artificialOp {
    height: calc(100% - 41px) !important;
}
</style>
