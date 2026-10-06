<template>
    <div id="palletRecordManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="palletRecordManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>托盘管理台账列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="托盘管理台账列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1012036" @click="openAddPage()">新增</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1012037" @click="openUpdatePage">修改</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1012038" @click="deletePalletRecord">删除</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1012039" @click="download">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="palletRecordManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem"></tableCommon>
        </div>

    </div>
</template>

<script>
import palletRecordManage from './palletRecordManage.js'

export default palletRecordManage
</script>
<style lang="scss">

</style>




