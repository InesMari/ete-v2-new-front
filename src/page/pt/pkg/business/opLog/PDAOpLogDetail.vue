<template>
    <div id="PDAOpLogDetail" >
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">包装编号：</label>
                    <div class="input-text">
                        <el-input v-model="query.packObjectNum" placeholder="包装编号" type="text"></el-input>
                    </div>
                </div>
              <div class="item">
                <label class="label">客户：</label>
                <div class="input-text">
                  <el-select v-model="query.custTenantId" placeholder="客户" @change="changeCust" clearable filterable>
                    <el-option v-for="item in tenantData" :key="item.tenantId" :label="item.name"
                               :value="item.tenantId"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="item">
                <label class="label">包装名称：</label>
                <div class="input-text">
                  <el-select v-model="query.packId" placeholder="包装名称" @change="doQuery" clearable filterable>
                    <el-option v-for="item in packInfoData" :key="item.pkgId" :label="item.pkgName"
                               :value="item.pkgId"></el-option>
                  </el-select>
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
                <div class="table-title-btn" style="margin-right: 90px;">

                </div>
            </div>
            <tableCommon tableName="PDAOpLogDetailTable" ref="table" :showNum="true" :showSetTable="true" :singleSelect="true" :head="head">
            </tableCommon>
        </div>
    </div>
</template>

<script>
	import PDAOpLogDetail from './PDAOpLogDetail.js'
	export default PDAOpLogDetail
</script>
<style lang="scss">
@import '@/page/pt/fc/fc_common.scss';
#artificialOp {
    height: calc(100% - 41px) !important;
}
</style>
