<template>
    <div id="sysLogInfoManage">
      <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" @clearFn="clearFn" searchKey="sysLogInfoManageSearch"></searchList>

      <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>系统日志列表(<span style="color: red;font-size: 12px;">--双击请求报文复制报文内容--</span>)</span>
                    <el-tooltip effect="light" content="系统日志列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                </div>
            </div>
            <tableCommon tableName="sysLogInfoManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head">
              <template v-slot:default="{item}">
                <span @dblclick="doCopy(item.reqParamStr)">{{item.reqParamStr}}</span>
              </template>
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




