<template>
  <div id="payApplyRegister">
    <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="gdPayApplyRegisterSearch"></searchList>

    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>待登记申请列表</span>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" v-entity="1006112" @click="showRegister">付款登记</el-button>
          <el-button type="primary" plain size="mini" v-entity="1006113" @click="download">导出Excel</el-button>
        </div>
      </div>
      <tableCommon tableName="payApplyRegisterTable" ref="table" :showNum="true" :showSetTable="true" :head="head" :doQrySum=true></tableCommon>
    </div>

    <el-dialog title="付款登记" :visible.sync="showDialog" :close-on-click-modal="false" :close-on-press-escape="false"
               :modal-append-to-body="false"
               width="80%" height="80%" @close="showDialog=false">
      <div  class="table_height orderInfo">
        <scrollTable ref="scrollTable" :head="headDetail" :doSum="true">
        </scrollTable>
      </div>
      <div class="bot-btn">
        <el-button size="mini" @click="showDialog=false">关闭</el-button>
        <el-button size="mini" type="primary" @click="confirmRegister">确认提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import payApplyRegister from './payApplyRegister.js'
export default payApplyRegister
</script>

<style scoped>

</style>
