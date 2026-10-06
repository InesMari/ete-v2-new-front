<template>
    <div id="scanCodeCheckManage">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">关键字：</label>
                    <div class="input-text">
                      <el-input v-model="query.searchStr" placeholder="登记单号或条码号" type="text"></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery">查询</el-button>
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
                    <span>扫码校验列表</span>
                    <el-tooltip effect="light" content="扫码校验列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" v-entity="1005191" @click="downloadExcel">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="scanCodeCheckManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head"></tableCommon>
        </div>
    </div>
</template>

<script>
import scanCodeCheckManage from './scanCodeCheckManage.js'
export default scanCodeCheckManage
</script>
<style lang="scss">

</style>




