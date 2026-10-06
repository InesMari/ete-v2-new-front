<template>
    <div id="custSensorDataInfoManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" @clearFn="clearFn" searchKey="custSensorDataInfoManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>传感器数据列表</span>
                    <el-tooltip effect="light" content="传感器数据列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="2003020" @click="downloadExcel()">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="custSensorDataInfoManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" single-select="true"></tableCommon>
        </div>
    </div>
</template>

<script>
import custSensorDataInfoManage from './custSensorDataInfoManage.js'
export default custSensorDataInfoManage
</script>
<style lang="scss">
#custSensorDataInfoManage{

}
</style>

