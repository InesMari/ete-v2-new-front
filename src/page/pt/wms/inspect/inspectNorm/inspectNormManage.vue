<template>
    <div id="inspectNormManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="inspectNormManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>巡检标准列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1005172" @click="add()">新增</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005173" @click="update">修改</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1005174" @click="deleteStandard">删除</el-button>
                </div>
            </div>
            <tableCommon tableName="inspectNormManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem"></tableCommon>
        </div>
    </div>
</template>

<script>
import inspectNormManage from './inspectNormManage.js'
export default inspectNormManage
</script>
<style lang="scss">

</style>




