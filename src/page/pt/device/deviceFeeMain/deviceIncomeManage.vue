<template>
    <div id="deviceIncomeManage" style="height: 100%;">
      <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="deviceIncomeManageSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>器具收入列表</span>
                    <el-tooltip effect="light" content="器具收入列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
            </div>
            <tableCommon tableName="deviceIncomeManageTable" ref="table" :head="head" :showNum="true" :singleSelect="true" :showSetTable="true" v-slot="{item}" >
              <div>
                <a href="javascript:void(0);" class="link" @click.stop="toCustomerConfirmedBillDetail(item)" style="margin: 0 10px;">{{item.billNum}}</a>
              </div>
            </tableCommon>
        </div>

    </div>
</template>

<script>
    import deviceIncomeManage from './deviceIncomeManage.js'
    export default deviceIncomeManage
</script>
<style lang="scss">

</style>
