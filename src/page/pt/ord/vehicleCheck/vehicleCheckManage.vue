<template>
    <div id="vehicleCheckManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="vehicleCheckManageSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>点检管理列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="点检管理列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
              <div class="table-title-btn" style="margin-right: 90px;">
                <el-button type="primary" plain size="mini" v-entity="1003080" @click="confirmOrdWaybillVehicleCheck">点检确认</el-button>
                <el-button type="primary" plain size="mini" v-entity="1003081" @click="cancelConfirmOrdWaybillVehicleCheck">取消确认</el-button>
                <el-button type="primary" plain size="mini" v-entity="1003082" @click="toPrint">打印</el-button>
              </div>
            </div>
            <tableCommon tableName="vehicleCheckManageTable" ref="table" :head="head" :showNum="true" :singleSelect="true" :doSelectSum="true" :showSetTable="true" @dblclickItem="toDetail">
            </tableCommon>
        </div>
    </div>
</template>

<script>
    import vehicleCheckManage from './vehicleCheckManage.js'
    export default vehicleCheckManage
</script>
<style lang="scss">
#waybillCheckManage {

}
</style>
