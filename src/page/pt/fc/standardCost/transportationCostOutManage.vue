<template>
    <div id="transportationCostOutManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="transportationCostOutManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>运输成本-外包列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="运输成本-外包列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="addInfo" v-entity="1006246">估算</el-button>
                    <el-button type="primary" plain size="mini" @click="updateInfo" v-entity="1006247">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteInfo" v-entity="1006248">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="download" v-entity="1006249">导出Excel</el-button>
                </div>
            </div>
            <tableCommon tableName="transportationCostOutManageTable" ref="table" :showNum="true" :showSetTable="true"
                         :singleSelect="true" :head="head" @dblclickItem="dblclickItem">
            </tableCommon>
        </div>
    </div>
</template>

<script>
import transportationCostOutManage from './transportationCostOutManage.js'

export default transportationCostOutManage
</script>

<style scoped>

</style>
