<template>
  <div id="pkgBusinessManage">

    <div class="search-list clearfix">
      <div class="search-form clearfix">
        <div class="item">
          <label class="label">包装名称：</label>
          <div class="input-text">
            <el-input v-model="query.packObjectNum" placeholder="包装名称" type="text"
                      autocomplete="new-password"></el-input>
          </div>
        </div>
        <div class="item">
          <label class="label">包装类型：</label>
          <div class="input-text">
            <el-select v-model="query.packType" placeholder="请选择"  clearable>
              <el-option v-for="item in packTypeOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
              </el-option>
            </el-select>
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
    </div>


    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>包装管理</span>
          <el-tooltip effect="light" content="包装管理列表" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" @click="toPackMonitor()" v-entity="2002003">查看库存位置</el-button>
<!--          <el-button type="primary" plain size="mini" @click="toDetail()" v-entity="465">查看明细</el-button>-->
        </div>
      </div>
      <tableCommon tableName="pkgBusinessManageHZTable" ref="table" :showNum="true" @dblclickItem="dblclickItem"
                   :showSetTable="true" :head="head" :singleSelect="true"></tableCommon>
    </div>
  </div>
</template>

<script>
import pkgBusinessManage from './pkgBusinessManage.js'
export default pkgBusinessManage
</script>

<style lang="scss">
.el-date-picker.has-sidebar.has-time {
  z-index: 3000 !important;
}
</style>