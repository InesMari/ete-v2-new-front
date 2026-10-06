<template>
    <div id="sensorDataInfoManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" @clearFn="clearFn" searchKey="sensorDataInfoManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>传感器数据列表</span>
                    <el-tooltip effect="light" content="传感器数据列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1005254" @click="downloadExcel()">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="sensorDataInfoManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" single-select="true"></tableCommon>
        </div>
    </div>
</template>

<script>
import sensorDataInfoManage from './sensorDataInfoManage.js'
export default sensorDataInfoManage
</script>
<style lang="scss">
#sensorDataInfoManage{

}
</style>

