<template>
  <div id="storeHouseBillManage">
    <searchList :formData="formData" @doQuery="doQuery" @clearFn="initQuery" :query="query" searchKey="storeHouseBillManageSearch"></searchList>

    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>仓库费用列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
          <el-tooltip effect="light" content="仓库费用列表" placement="right">
          </el-tooltip>
        </h3>
        <div class="table-title-btn"  style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" @click="openPage(1)" v-entity="1005107">新增月成本</el-button>
          <el-button type="primary" plain size="mini" @click="openPage(2)" v-entity="1005108">修改月成本</el-button>
          <el-button type="danger" plain size="mini" @click="deleteWmsFeeCost()" v-entity="1005109">删除月成本</el-button>
          <el-button type="primary" plain size="mini" @click="downExcel()" v-entity="1005110">导出Excel</el-button>
        </div>
      </div>
      <tableCommon tableName="storeHouseBillManageTable" ref="table" :showNum="true" v-slot="{item}" :showSetTable="true" @dblclickItem="dblclickItem" :head="head" :singleSelect="true">
          <div>
              <a href="javascript:void(0);" class="link" @click.stop="toFcSupplierBillDetail(item)" style="margin: 0 10px;">{{item.billNum}}</a>
          </div>
      </tableCommon>
    </div>

  </div>
</template>

<script>
import storeHouseBillManage from './storeHouseBillManage.js'
export default storeHouseBillManage
</script>

<style scoped>

</style>
