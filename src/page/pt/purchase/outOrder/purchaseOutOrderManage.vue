<template>
    <div id="purchaseOutOrderManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="purchaseOutOrderManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>出库管理列表<em>（--双击序号查看详情--）</em></span>
                    <el-tooltip effect="light" content="出库管理列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                </div>
            </div>
            <tableCommon tableName="purchaseOutOrderManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :single-select="true" @dblclickItem="dblclickItem">
            </tableCommon>
        </div>
    </div>
</template>

<script>
import purchaseOutOrderManage from './purchaseOutOrderManage.js'
export default purchaseOutOrderManage
</script>
<style lang="scss">
</style>

