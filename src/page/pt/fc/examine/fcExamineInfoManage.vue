<template>
    <div id="fcExamineInfoManage">
      <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="fcExamineInfoSearch"></searchList>

      <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>财务绩效考核列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="财务绩效考核列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1007030" @click="toAdd">新增</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1007031" @click="toUpdate">修改</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1007032" @click="downloadExcel">导出</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1007033" @click="toFcExamineItemManage">指标维护</el-button>
                </div>
            </div>
            <tableCommon tableName="fcExamineInfoManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem"></tableCommon>
        </div>

    </div>
</template>

<script>
import fcExamineInfoManage from './fcExamineInfoManage.js'
export default fcExamineInfoManage
</script>
<style lang="scss">

</style>




