<template>
    <div id="deviceCostManage" style="height: 100%;">
      <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="deviceIncomeManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>器具成本列表</span>
                    <el-tooltip effect="light" content="器具成本列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
            </div>
            <tableCommon tableName="deviceCostManageTable" ref="table" :head="head" :showNum="true" :singleSelect="true" :showSetTable="true"></tableCommon>
        </div>
    </div>
</template>

<script>
    import deviceCostManage from './deviceCostManage.js'
    export default deviceCostManage
</script>
<style lang="scss">
.common-info{
  .content{
    .item{
      .label-term{
        width:84px;
      }
      .input-text{
        width: calc(100% - 94px);
      }
    }
  }
}

</style>
