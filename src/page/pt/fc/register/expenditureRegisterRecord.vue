<template>
  <div id="expenditureRegisterRecord">
    <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="expenditureRegisterRecordSearch"></searchList>
    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>付款记录列表</span>
          <el-tooltip effect="light" content="付款记录列表" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" v-entity="1006205" @click="download">导出</el-button>
          <el-button type="primary" plain size="mini" @click="cancleSupplierInvoiceRegister()"  v-entity="1006086">撤销付款</el-button>
        </div>
      </div>
      <tableCommon tableName="expenditureRegisterRecordTable" ref="table" :head="head" :showNum="true"
                   :showSetTable="true" :singleSelect="true"></tableCommon>
    </div>
  </div>
</template>

<script>
import expenditureRegisterRecord from './expenditureRegisterRecord.js'

export default expenditureRegisterRecord
</script>
<style lang="scss">
@import '@/page/pt/fc/fc_common.scss';

#expenditureRegisterRecord {
  .tagList .tag .contet .item .label {
    width: 100px;
  }
}
</style>

