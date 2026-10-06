<template>
  <div id="inOrderManage">
    <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="inOrderManageSearch"></searchList>
    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>入库单列表</span>
          <el-tooltip effect="light" content="入库单列表" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" v-entity="2003009" @click="downloadExcel()">导出</el-button>
        </div>
      </div>
      <tableCommon tableName="inOrderManageTable" ref="table" :head="head" :showNum="true"
                   :showSetTable="true" single-select="true" @dblclickItem="view"></tableCommon>
    </div>
      </div>
</template>

<script>
import inOrderManage from './inOrderManage.js'
export default inOrderManage
</script>
<style lang="scss">
#inOrderManage{

}
</style>

