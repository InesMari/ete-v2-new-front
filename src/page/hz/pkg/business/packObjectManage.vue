<template>
    <div id="packObjectManage">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">包装编号：</label>
                  <div class="input-text">
                    <el-input v-model="loadParam.packObjectNum" placeholder="包装编号" type="text"
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
                    <span>包装明细列表</span>
                    <el-tooltip effect="light" content="包装明细列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" @click="downExcel()">导出明细</el-button>
                </div>
            </div>
            <tableCommon tableName="pkgObjectManageHZTable" ref="table" :head="head" :showNum="true" :showSetTable="true"></tableCommon>
        </div>
    </div>
</template>

<script>
    import packObjectManage from './packObjectManage.js'

    export default packObjectManage
</script>
<style lang="scss">

</style>
