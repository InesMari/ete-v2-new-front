<template>
    <div id="warehousingCostManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="warehousingCostManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>仓储成本列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="仓储成本列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="addInfo" v-entity="1006250">估算</el-button>
                    <el-button type="primary" plain size="mini" @click="updateInfo" v-entity="1006251">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteInfo" v-entity="1006252">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="download" v-entity="1006253">导出Excel</el-button>
                </div>
            </div>
            <tableCommon tableName="warehousingCostManageTable" ref="table" :showNum="true" :showSetTable="true"
                         :singleSelect="true" :head="head" @dblclickItem="dblclickItem">
            </tableCommon>
        </div>

    </div>
</template>

<script>
import warehousingCostManage from './warehousingCostManage.js'

export default warehousingCostManage
</script>

<style scoped>

</style>
