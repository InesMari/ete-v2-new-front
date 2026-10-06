<template>
    <div id="supplierWmsWorkContractDetailManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="supplierWmsWorkContractDetailManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3><span>供应商外包作业成本对比列表<el-tooltip effect="light"
                                                content="注：所有价格均含税，为方便建立系统，数字和单位分离，抬头的字段不要重复"
                                                placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip></span></h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="downExcel">导出excel</el-button>
                </div>
            </div>
            <tableCommon tableName="supplierWmsWorkContractDetailManageTable" ref="table" :showNum="true"
                         :showSelect="false"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem"></tableCommon>
        </div>

    </div>
</template>

<script>
import supplierWmsWorkContractDetailManage from './supplierWmsWorkContractDetailManage.js'

export default supplierWmsWorkContractDetailManage
</script>
<style lang="scss" scoped>
</style>




