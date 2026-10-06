<template>
    <div id="uninventoryStockStorageManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam"
                    searchKey="uninventoryStockStorageManageSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>未盘点明细</span>
                    <el-tooltip effect="light" content="未盘点明细" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="download">导出Excel</el-button>
                </div>
            </div>
            <tableCommon tableName="uninventoryStockStorageManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" single-select="true">
            </tableCommon>
        </div>


    </div>
</template>

<script>
import uninventoryStockStorageManage from './uninventoryStockStorageManage.js'

export default uninventoryStockStorageManage
</script>

<style lang="scss">
#uninventoryStockStorageManage {

}
</style>
