<template>
    <div id="deviceStoreDetailHisManage">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
              <div class="item">
                <label class="label">记录日期</label>
                <div class="input-text">
                  <el-date-picker v-model="query.hisDate" type="daterange" range-separator="至" start-placeholder="开始日期"
                                  end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"
                                  :clearable="false"
                                  unlink-panels></el-date-picker>
                </div>
              </div>
                <div class="item">
                    <label class="label">作业点名称：</label>
                    <div class="input-text">
                        <el-input v-model="query.workName" placeholder="作业点名称"></el-input>
                    </div>
                </div>
              <div class="item">
                <label class="label">器具名称：</label>
                <div class="input-text">
                  <el-input v-model="query.deviceName" placeholder="器具名称"></el-input>
                </div>
              </div>
              <div class="item">
                <label class="label">客户名称：</label>
                <div class="input-text">
                  <el-input v-model="query.tenantName" placeholder="客户名称"></el-input>
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
                    <span>历史库存明细列表</span>
                    <el-tooltip effect="light" content="历史库存明细列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn"  style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" @click="download()" >
                    导出
                  </el-button>
                </div>
            </div>
            <tableCommon tableName="deviceStoreDetailHisManageTable" ref="table" :head="head" :showNum="true" :showSetTable="true"></tableCommon>
        </div>

    </div>
</template>

<script>
    import deviceStoreDetailHisManage from './deviceStoreDetailHisManage.js'
    export default deviceStoreDetailHisManage
</script>
<style lang="scss">
</style>
