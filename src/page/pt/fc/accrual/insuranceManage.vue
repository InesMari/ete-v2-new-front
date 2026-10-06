<template>
  <div id="insuranceManage">
    <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="insuranceManageSearch"></searchList>

    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>保险费用列表</span>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" @click="add" v-entity="1006188">新增</el-button>
          <el-button type="primary" plain size="mini" @click="update" v-entity="1006189">修改</el-button>
          <el-button type="danger" plain size="mini" @click="del" v-entity="1006190">删除</el-button>
          <el-button type="primary" plain size="mini" @click="verify" v-entity="1006191">审核</el-button>
          <el-button type="primary" plain size="mini" @click="download" v-entity="1006192">导出</el-button>
        </div>
      </div>
      <tableCommon tableName="insuranceManageTable" ref="table" :showNum="true"
                   :showSetTable="true" :head="head" :singleSelect="true" @dblclickItem="dblclickItem">
        <template v-slot="{item,code}">
          <div v-if="code=='contractNum'">
            <a href="javascript:void(0);" class="link" @click.stop="toContractDetail(item)">{{item[code]}}</a>
          </div>
        </template>
      </tableCommon>
    </div>
  </div>
</template>

<script>
import insuranceManage from './insuranceManage.js'
export default insuranceManage
</script>

<style scoped>

</style>
