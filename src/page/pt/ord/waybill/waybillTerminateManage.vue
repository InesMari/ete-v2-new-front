<template>
    <div id="waybillTerminateManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="waybillTerminateManageSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>派车单异常终止申请列表</span>
                    <el-tooltip effect="light" content="派车单异常终止申请列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
              <div class="table-title-btn" style="margin-right: 90px;">
                <el-button type="primary" plain size="mini" v-entity="1003108" @click="verifyOrdWaybillFeeCostApply(1)">审核通过</el-button>
                <el-button type="primary" plain size="mini" v-entity="1003109" @click="verifyOrdWaybillFeeCostApply(2)">审核不通过</el-button>
              </div>
            </div>
            <tableCommon tableName="waybillTerminateManageTable" ref="table" :head="head" :showNum="true" :showSetTable="true" singleSelect="true">
              <template v-slot:default="{item}">
                <a href="javascript:void(0);" class="link" @click.stop="toWaybillDetail(item)" style="margin: 0 10px;">{{item.waybillNum}}</a>
              </template>
            </tableCommon>
        </div>
    </div>
</template>

<script>
    import waybillTerminateManage from './waybillTerminateManage.js'
    export default waybillTerminateManage
</script>
<style lang="scss">
#waybillTerminateManage{
  .tableCommon{
    .el-input__inner{
      text-align: center;
    }
  }
}

</style>
