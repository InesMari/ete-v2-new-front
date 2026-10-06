<template>
  <div id="supplierOperationDetail">
    <div class="search-list clearfix">
      <div class="search-form clearfix" @keyup.enter="doQuery()">
        <div class="item">
          <label class="label">供应商：</label>
          <div class="input-text">
            <el-input v-model="loadParam.supplierName" placeholder="供应商" type="text"
                      autocomplete="new-password"></el-input>
          </div>
        </div>
        <div class="item">
          <label class="label">派车单号：</label>
          <div class="input-text">
            <el-input v-model="loadParam.waybillNum" placeholder="派车单号" type="text"
                      autocomplete="new-password"></el-input>
          </div>
        </div>
        <div class="item daterange">
          <label class="label">要求到达时间：</label>
          <div class="input-text">
            <el-date-picker v-model="loadParam.createDaterange" type="daterange" range-separator="至" start-placeholder="开始日期"
                            end-placeholder="结束日期" value-format="yyyy-MM-dd" unlink-panel></el-date-picker>
          </div>
        </div>
        <div class="item">
          <label class="label">作业点：</label>
          <div class="input-text">
            <el-input v-model="loadParam.workName" placeholder="作业点" type="text"
                      autocomplete="new-password"></el-input>
          </div>
        </div>
      </div>
      <div class="search-btn clearfix">
        <div class="btn">
          <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询</el-button>
        </div>
        <div class="btn">
          <el-button type="danger" plain size="mini" icon="el-icon-close" @click="clear()">清空</el-button>
        </div>
      </div>
      <!-- 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 -->
      <div class="search-bot">
        <img src="@/static/image/search-bot.png" alt="">
        <i class="icon el-icon-arrow-down"></i>
        <i class="icon el-icon-arrow-up"></i>
      </div>
    </div>
    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>供应商运作明细列表</span>
          <el-tooltip effect="light" content="供应商运作明细列表" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" @click="download()" v-entity :entityId="[{1007010:1007020}]">导出EXCEL</el-button>
        </div>
      </div>
      <tableCommon tableName="supplierOperationDetailTable" ref="table" :head="head" :showNum="true"
                   :showSetTable="true" :singleSelect="true"></tableCommon>
    </div>
  </div>
</template>

<script>
import supplierOperationDetail from './supplierOperationDetail.js'

export default supplierOperationDetail
</script>
<style lang="scss">

</style>

