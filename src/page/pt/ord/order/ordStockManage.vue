<template>
    <div id="ordStockManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="ordStockManageSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>订单库存列表</span>
                    <el-tooltip effect="light" content="订单库存列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                </div>
            </div>
            <tableCommon tableName="ordStockManageTable" ref="table" :head="head" :showNum="true" :singleSelect="true" :showSetTable="true" :showSelect="false"></tableCommon>
        </div>

    </div>
</template>

<script>
    import ordStockManage from './ordStockManage.js'

    export default ordStockManage
</script>
<style lang="scss">

</style>
