<template>
  <div id="warningManage">
    <div class="search-list clearfix">
      <div class="search-form clearfix" @keyup.enter="doQuery()">
        <div class="item">
          <label class="label">物料编码：</label>
          <div class="input-text">
            <el-input v-model="loadParam.materialNum" placeholder="物料编码" type="text"
                      autocomplete="new-password"></el-input>
          </div>
        </div>
        <div class="item">
          <label class="label">物料描述：</label>
          <div class="input-text">
            <el-input v-model="loadParam.materialDesc" placeholder="物料描述" type="text"
                      autocomplete="new-password"></el-input>
          </div>
        </div>
        <div class="item">
          <label class="label">预警类型：</label>
          <div class="input-text">
            <el-select v-model="loadParam.warningType" @change="doQuery" clearable placeholder="预警类型">
              <el-option v-for="item in warningTypeData" :key="item.codeValue" :label="item.codeName"
                         :value="item.codeValue"></el-option>
            </el-select>
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
          <span>预警列表</span>
          <el-tooltip effect="light" content="预警列表" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" @click="toUpdateWarningState()" v-entity="1005072">标识已读</el-button>
          <el-button type="danger" plain size="mini" @click="toDelWarning()" v-entity="1005073">删除预警</el-button>
        </div>
      </div>
      <tableCommon tableName="warningManageTable" ref="table" :head="head" :showNum="true"
                   :showSetTable="true"></tableCommon>
    </div>
  </div>
</template>

<script>
import warningManage from './warningManage.js'
export default warningManage
</script>
<style lang="scss">

</style>

