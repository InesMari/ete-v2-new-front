<template>
    <div id="scrapManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="scrapManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>价格维护列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="价格维护列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="addInfo" v-entity="1006228">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="updateInfo" v-entity="1006229">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteIncome" v-entity="1006230">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="download" v-entity="1006231">导出Excel</el-button>
                    <el-button type="primary" plain size="mini" @click="detailIncome" v-entity="1006232">详情</el-button>
                </div>
            </div>
            <tableCommon tableName="scrapManageTable" ref="table" :showNum="true" :showSetTable="true"
                         :singleSelect="true" :head="head" @dblclickItem="dblclickItem">
            </tableCommon>
        </div>

    </div>
</template>

<script>
import scrapManage from './scrapManage.js'

export default scrapManage
</script>

<style scoped>

</style>
