<template>
    <div id="wmsInteriorMaterialLogManage">

        <!-- 列表相关  开始 -->
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">内材名称：</label>
                    <div class="input-text">
                        <el-input v-model="query.name" placeholder="内材名称" type="text" autocomplete="new-password"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">到货厂商：</label>
                    <div class="input-text">
                        <el-input v-model="query.tenantName" placeholder="到货厂商" type="text" autocomplete="new-password"></el-input>
                    </div>
                </div>
                <div class="item daterange">
                    <label class="label">实际日期</label>
                    <div class="input-text">
                        <el-date-picker v-model="query.date" type="daterange" range-separator="至" start-placeholder="开始日期"
                                        end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"
                                        unlink-panels></el-date-picker>
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
                    <span>内材记录列表</span>
                    <el-tooltip effect="light" content="内材记录列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
            </div>
            <tableCommon tableName="wmsInteriorMaterialLogManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :singleSelect="true">
            </tableCommon>
        </div>
        <!-- 列表相关  结束 -->

    </div>
</template>

<script>
import wmsInteriorMaterialLogManage from './wmsInteriorMaterialLogManage.js'
export default wmsInteriorMaterialLogManage
</script>
<style lang="scss">
#wmsInteriorMaterialLogManage {

}
</style>
