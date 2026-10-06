<template>
    <div id="sysLogInfoManage">
      <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" @clearFn="clearFn" searchKey="sysLogInfoManageSearch"></searchList>

      <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>系统日志列表</span>
                    <el-tooltip effect="light" content="系统日志列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                </div>
            </div>
            <tableCommon tableName="sysLogInfoManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head">
            </tableCommon>
        </div>

    </div>
</template>

<script>
import sysLogInfoManage from './sysLogInfoManage.js'
export default sysLogInfoManage
</script>
<style lang="scss">

</style>




