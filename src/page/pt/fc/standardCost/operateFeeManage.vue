<template>
    <div id="operateFeeManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="operateFeeManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>工序维护列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="工序维护列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="addInfo" v-entity="1006258">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="updateInfo" v-entity="1006259">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteIncome" v-entity="1006260">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="download" v-entity="1006261">导出Excel</el-button>
                </div>
            </div>
            <tableCommon tableName="operateFeeManageTable" ref="table" :showNum="true" :showSetTable="true"
                         :singleSelect="true" :head="head" @dblclickItem="dblclickItem">
            </tableCommon>
        </div>

    </div>
</template>

<script>
import operateFeeManage from './operateFeeManage.js'

export default operateFeeManage
</script>

<style scoped>

</style>
