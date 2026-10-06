<template>
    <div id="ownVehicleCheckManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="ownVehicleCheckManageSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>自有车点检管理列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="自有车点检管理列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
              <div class="table-title-btn" style="margin-right: 90px;">
                <el-button type="primary" plain size="mini" v-entity="1002240" @click="confirmOrdWaybillVehicleCheck">确认处理</el-button>
                <el-button type="primary" plain size="mini" v-entity="1002241" @click="toPrint">打印</el-button>
                <el-button type="primary" plain size="mini" v-entity="1002243" @click="download">导出Excel</el-button>
              </div>
            </div>
            <tableCommon tableName="ownVehicleCheckManageTable" ref="table" :head="head" :showNum="true" :singleSelect="true" :doSelectSum="true" :showSetTable="true" @dblclickItem="toDetail">
              <template v-slot:default="{item, code}">
                <a href="javascript:void(0);" class="link" @click.stop="toWaybillDetail(item)" style="margin: 0 10px;">{{item[code]}}</a>
              </template>
            </tableCommon>
        </div>
    </div>
</template>

<script>
    import ownVehicleCheckManage from './ownVehicleCheckManage.js'
    export default ownVehicleCheckManage
</script>
<style lang="scss">
#ownVehicleCheckManage {

}
</style>
