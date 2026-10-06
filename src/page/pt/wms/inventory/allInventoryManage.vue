<template>
  <div id="allInventoryManage">
    <!-- 列表相关  开始 -->
    <div class="search-list clearfix">
      <div class="search-form clearfix" @keyup.enter="doQuery()">
        <div class="item">
          <label class="label">点检月份：</label>
          <div class="input-text">
            <el-input v-model="query.month" placeholder="点检月份" type="text"
                      autocomplete="new-password"></el-input>
          </div>
        </div>
        <div class="item">
          <label class="label">点检名称：</label>
          <div class="input-text">
            <el-input v-model="query.inventoryName" placeholder="点检名称" type="text"
                      autocomplete="new-password"></el-input>
          </div>
        </div>
        <div class="item">
          <label class="label">仓库名称：</label>
          <div class="input-text">
            <el-input v-model="query.workName" placeholder="仓库名称" type="text"
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
          <span>仓库点检列表</span>
          <el-tooltip effect="light" content="仓库点检列表" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
        </div>
      </div>
      <tableCommon tableName="allInventoryManageTable" ref="table" :head="head" :showNum="true"
                   :showSetTable="true" :single-select="true" @dblclickItem="displayView"></tableCommon>
    </div>

    <el-dialog class="dialog" :title="title" :visible.sync="dialogShow" width="80%"
               :close-on-click-modal="false" :close-on-press-escape="false" @close="showDialog(false)">
      <div  class="table_height orderInfo" style="position: relative;z-index: 1000;">
        <div class="common-info" style="border:none;padding:0;margin-top: -15px;">
            <ul class="content clearfix">
              <li class="item item100">
                <label class="label-term">出租方：</label>
                <div class="input-text">{{ inventoryInfo.baseInfo.leaser }}
                </div>
              </li>
            </ul>
            <ul class="content clearfix">
              <li class="item item100" style="margin-top: -20px">
                <label class="label-term">地址：</label>
                <div class="input-text">{{ inventoryInfo.baseInfo.address }}
                </div>
              </li>
            </ul>
            <ul class="content clearfix" >
              <li class="item item100" style="margin-top: -20px">
                <label class="label-term">点检月份：</label>
                <div class="input-text">{{ inventoryInfo.baseInfo.month }}
                </div>
              </li>
            </ul>
            <ul class="content clearfix" >
              <li class="item item100" style="margin-top: -20px">
                <label class="label-term">点检名称：</label>
                <div class="input-text">{{ inventoryInfo.baseInfo.inventoryName }}
                </div>
              </li>
            </ul>
        </div>
        <div style="overflow: auto;max-height: 400px;">
          <scrollTable ref="scrollTable" :head="headDtl">
            <template v-slot="{item,code,index}">
              <div v-if="code=='transferState'">
                <el-switch v-model="item.transferState == 1"  active-color="#13ce66" inactive-color="#ff4949" :disabled="true"></el-switch>
                <span class="name">{{item.transferState == 1 ? "是" : "否"}}</span>
              </div>
              <div v-if="code=='inventoryState'">
                <el-switch v-model="item.inventoryState == 1" @change="changeSwitch(item)" active-color="#13ce66" inactive-color="#ff4949" :disabled="true"></el-switch>
                <span class="name">{{item.inventoryState == 1 ? "正常" : "异常"}}</span>
              </div>
              <div v-if="code=='inventoryFile'">
                <myFileModel :ref="'inventoryFile'+index" clickType="text" :disabled="true"></myFileModel>
              </div>
            </template>
          </scrollTable>
        </div>
      </div>
      <div class="bot-btn">
        <el-button size="mini" @click="dialogShow=false">关闭</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import allInventoryManage from './allInventoryManage.js'
export default allInventoryManage
</script>

<style scoped>

</style>
