<template>
    <div id="workCostManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="workCostManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>仓储作业成本管理列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="仓储作业成本管理列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="addInfo" v-entity="1006254">估算</el-button>
                    <el-button type="primary" plain size="mini" @click="updateInfo" v-entity="1006255">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteCost" v-entity="1006256">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="download" v-entity="1006257">导出Excel</el-button>
                </div>
            </div>
            <tableCommon tableName="workCostManageTable" ref="table" :showNum="true" :showSetTable="true"
                         :singleSelect="true" :head="head" @dblclickItem="dblclickItem">
            </tableCommon>
        </div>

    </div>
</template>

<script>
import workCostManage from './workCostManage.js'

export default workCostManage
</script>

<style scoped>

</style>
