<template>
    <div id="inspectTaskManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="inspectTaskManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>巡检任务列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <!-- <el-button type="primary" plain size="mini" v-entity="1005265" @click="done()">巡检</el-button> -->
                  <el-button type="primary" plain size="mini" v-entity="1005178" @click="downloadExcel()">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="inspectTaskManageTable" ref="table" :showNum="true" :singleSelect="true"
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
import inspectTaskManage from './inspectTaskManage.js'
export default inspectTaskManage
</script>
<style lang="scss">

</style>




