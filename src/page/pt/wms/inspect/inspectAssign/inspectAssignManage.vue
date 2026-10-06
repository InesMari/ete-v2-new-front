<template>
    <div id="inspectAssignManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="inspectAssignManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>指定巡检列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1005175" @click="add">新增</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005176" @click="update">修改</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1005177" @click="deleteQa">删除</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005264" @click="print">打印二维码</el-button>
                </div>
            </div>
            <tableCommon tableName="inspectAssignManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem">
                <template v-slot:default="{item}">
                    <span v-for="(name,index) in item.executorStrArray" :style="!item.executorArray[index]?'color:red!important':''">
                        {{ name }}
                        <span v-if="index<item.executorStrArray.length-1">,</span>
                    </span>
                </template>          
            </tableCommon>
        </div>
    </div>
</template>

<script>
import inspectAssignManage from './inspectAssignManage.js'
export default inspectAssignManage
</script>
<style lang="scss">

</style>




