<template>
  <div id="payApplyVerify">
    <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="gdPayApplyVerifySearch"></searchList>

    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>待审核申请列表</span>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini"  v-entity="1006111" @click="payApplyVerify">申请审核</el-button>
        </div>
      </div>
      <tableCommon tableName="payApplyVerifyTable" ref="table" :showNum="true" :showSetTable="true" :head="head" :doQrySum=true>
        <template v-slot:default="{item,index}">
          <a href="javascript:;" class="link" @click="openDetail(item)">{{item.waybillNum}}</a>
        </template>
      </tableCommon>
    </div>

    <!-- 付款申请 -->
    <el-dialog title="申请审核" :visible.sync="showDialog" :close-on-click-modal="false" :close-on-press-escape="false"
               :modal-append-to-body="false"
               width="80%" height="80%" @close="showDialog=false">
      <div  class="table_height orderInfo">
        <scrollTable ref="scrollTable" :head="headDetail" :doSum="true">
        </scrollTable>
      </div>
      <div class="bot-btn">
        <el-button size="mini" @click="showDialog=false">取消</el-button>
        <el-button size="mini" type="primary" @click="syncPay">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import payApplyVerify from './payApplyVerify.js'
export default payApplyVerify
</script>

<style scoped>

</style>
