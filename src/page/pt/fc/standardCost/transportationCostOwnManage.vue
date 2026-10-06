<template>
    <div id="transportationCostOwnManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="transportationCostOwnManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>运输成本列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="运输成本列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="addInfo" v-entity="1006242">估算</el-button>
                    <el-button type="primary" plain size="mini" @click="updateInfo" v-entity="1006243">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteInfo" v-entity="1006244">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="download" v-entity="1006245">导出Excel</el-button>
                </div>
            </div>
            <tableCommon tableName="transportationCostOwnManageTable" ref="table" :showNum="true" :showSetTable="true"
                         :singleSelect="true" :head="head" @dblclickItem="dblclickItem">
            </tableCommon>
        </div>
    </div>
</template>

<script>
import transportationCostOwnManage from './transportationCostOwnManage.js'

export default transportationCostOwnManage
</script>

<style scoped>

</style>
