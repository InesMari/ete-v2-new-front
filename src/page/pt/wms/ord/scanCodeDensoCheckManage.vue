<template>
    <div id="scanCodeDensoCheckManage">
        <select-work v-show="showSelWork"></select-work>
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="scanCodeDensoCheckManageSearch"
                  v-show="!showSelWork"></searchList>
        <div class="table-content" v-show="!showSelWork">
            <div class="table-title">
                <h3>
                    <span>扫码校验列表</span>
                    <el-tooltip effect="light" content="扫码校验列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" v-entity="1005269" @click="downloadExcel">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="scanCodeDensoCheckManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem" ></tableCommon>
        </div>
    </div>
</template>

<script>
import scanCodeDensoCheckManage from './scanCodeDensoCheckManage.js'
export default scanCodeDensoCheckManage
</script>
<style lang="scss">

</style>




