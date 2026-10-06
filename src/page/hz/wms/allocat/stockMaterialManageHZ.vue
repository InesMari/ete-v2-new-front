<template>
  <div id="stockMaterialManageHZ">
    <div class="search-list clearfix">
      <div class="search-form clearfix" @keyup.enter="doQuery()">
<!--        <div class="item">-->
<!--          <label class="label">所属货主：</label>-->
<!--          <div class="input-text">-->
<!--            <el-input v-model="loadParam.srcTenantName" placeholder="搜索所属货主" type="text"></el-input>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="item">-->
<!--          <label class="label">到货厂商：</label>-->
<!--          <div class="input-text">-->
<!--            <el-input v-model="loadParam.fromTenantName" placeholder="搜索到货厂商" type="text"></el-input>-->
<!--          </div>-->
<!--        </div>-->
        <div class="item">
          <label class="label">物料编码：</label>
          <div class="input-text">
            <el-input v-model="loadParam.materialNum" placeholder="搜索物料编码" type="text"></el-input>
          </div>
        </div>
        <div class="item">
          <label class="label">物料描述：</label>
          <div class="input-text">
            <el-input v-model="loadParam.materialDesc" placeholder="搜索物料描述" type="text"></el-input>
          </div>
        </div>
          <div class="item" style="width: 50%;">
              <label class="label">仓库：</label>
              <div class="input-text">
                  <el-select v-model="loadParam.workStoreId" filterable clearable collapse-tags multiple @change="doQuery" placeholder="仓库">
                      <el-option v-for="item in workList" :key="item.workId" :label="item.workName"
                                 :value="item.workId"></el-option>
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
          <span>在库管理列表</span>
          <el-tooltip effect="light" content="在库管理列表" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" v-entity="2003005" @click="download">导出Excel</el-button>
        </div>

      </div>
      <tableCommon tableName="stockMaterialManageHZTable" ref="table" :head="head" :showNum="true"
                   :showSetTable="true" single-select="true" ></tableCommon>
    </div>
  </div>
</template>

<script>
import stockMaterialManageHZ from './stockMaterialManageHZ.js'
export default stockMaterialManageHZ
</script>

<style scoped>

</style>
