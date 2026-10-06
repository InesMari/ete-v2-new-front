<template>
  <div id="wmsStoreHouseFeeDetailManage">
    <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="wmsStoreHouseFeeDetailManageSearch"></searchList>

    <div class="table-content">
      <div class="table-title">
          <h3>
            <span>仓租租赁月费用列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
            <el-tooltip effect="light" content="仓租租赁月费用列表" placement="right">
              <img class="tip" src="@/static/image/tip.png" alt="">
            </el-tooltip>
          </h3>
          <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" @click="download()" v-entity="1002188">导出Excel</el-button>
        </div>
      </div>
      <tableCommon tableName="wmsStoreHouseFeeDetailManageTable" ref="table" :showNum="true" :showSetTable="true"
                   :head="head" :singleSelect="true" @dblclickItem="toDetail">
        <template v-slot:default="{item,code}">
          <div v-if="code=='workFeeExtNum'">
            <a href="javascript:void(0);" class="link" @click.stop="open(item)">{{ item.workFeeExtNum }}</a>
          </div>
        </template>
      </tableCommon>
    </div>
  </div>
</template>

<script>
import wmsStoreHouseFeeDetailManage from './wmsStoreHouseFeeDetailManage.js'
export default wmsStoreHouseFeeDetailManage
</script>

<style scoped>
/deep/ .trRed td{color:red}
</style>
