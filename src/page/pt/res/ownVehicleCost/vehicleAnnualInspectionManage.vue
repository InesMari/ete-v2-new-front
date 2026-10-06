<template>
    <div id="vehicleAnnualInspectionManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="vehicleAnnualInspectionManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>车辆年检记录列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="车辆年检记录列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="openPage(1, null)" v-entity="1002202">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="openPage(2, null)" v-entity="1002203">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteInfo()" v-entity="1002204">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="openPage(3, null)" v-entity="1002205">审核</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1002248" @click="download">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="vehicleAnnualInspectionManageTable" ref="table" :showNum="true" :showSetTable="true" :head="head"
                         @dblclickItem="dblclickItem" :singleSelect="true">
            </tableCommon>
        </div>
    </div>
</template>

<script>
import vehicleAnnualInspectionManage from './vehicleAnnualInspectionManage.js'

export default vehicleAnnualInspectionManage
</script>

<style scoped>

</style>
