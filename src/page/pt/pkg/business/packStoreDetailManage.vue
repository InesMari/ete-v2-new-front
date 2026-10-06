<template>
    <div id="packStoreDetailManage">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">使用客户：</label>
                  <div class="input-text">
                      <el-select v-model="query.custTenantId" placeholder="使用客户" @change="doQuery" clearable filterable>
                        <el-option v-for="item in tenantData" :key="item.tenantId" :label="item.name"
                                   :value="item.tenantId"></el-option>
                      </el-select>
                  </div>
                </div>
                <div class="item">
                    <label class="label">包装类型：</label>
                    <div class="input-text">
                        <el-select v-model="query.packType" placeholder="包装类型" @change="doQuery" clearable filterable>
                          <el-option v-for="item in packingTypeData" :key="item.codeValue" :label="item.codeName"
                                     :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <label class="label">作业点名称：</label>
                    <div class="input-text">
                        <el-input v-model="query.workName" placeholder="作业点名称"></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询</el-button>
                </div>
                <div class="btn">
                    <el-button type="danger" plain size="mini" icon="el-icon-close" @click="initQuery()">清空</el-button>
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
                    <span>包装库存明细列表</span>
                    <el-tooltip effect="light" content="包装库存明细列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn"  style="margin-right: 90px;">
                </div>
            </div>
            <tableCommon tableName="packStoreDetailManageTable" ref="table" :head="head" :showNum="true" :showSetTable="true"></tableCommon>
        </div>

    </div>
</template>

<script>
    import packStoreDetailManage from './packStoreDetailManage.js'
    export default packStoreDetailManage
</script>
<style lang="scss">
</style>
