<template>
  <div id="inOrderDtlManage">
      <select-work v-show="showSelWork"></select-work>
    <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="inOrderDtlManageSearch" v-show="!showSelWork"></searchList>
    <div class="table-content" v-show="!showSelWork">
      <div class="table-title">
        <h3>
          <span>入库物料列表</span>
          <el-tooltip effect="light" content="入库物料列表" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" @click="downloadExcel()">导出</el-button>
        </div>
      </div>
      <tableCommon tableName="inOrderDtlManageTable" ref="table" :head="head" :showNum="true"
                   :showSetTable="true" single-select="true">
        <template v-slot:default="{item,index}">
          <a href="javascript:void(0);" class="link" @click="view(item)">{{item.inOrderNum}}</a>
        </template>
      </tableCommon>
    </div>
  </div>
</template>

<script>
import inOrderDtlManage from './inOrderDtlManage.js'
export default inOrderDtlManage
</script>
<style lang="scss">
</style>

