<template>
    <div id="outDeviceStockManege">
        <select-work v-show="showSelWork"></select-work>

        <!-- 列表相关  开始 -->
        <div class="search-list clearfix" v-show="!showSelWork">
            <div class="search-form clearfix" @keyup.enter="doQuery">
                <div class="item">
                    <label class="label">器具名称：</label>
                    <div class="input-text">
                        <el-input v-model="query.deviceName" placeholder="器具名称" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">使用客户：</label>
                    <div class="input-text">
                        <el-input v-model="query.tenantName" placeholder="使用客户" type="text"></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询
                    </el-button>
                </div>
                <div class="btn">
                    <el-button type="danger" plain size="mini" icon="el-icon-close" @click="initQuery()">清空
                    </el-button>
                </div>
            </div>
            <!-- 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 -->
            <div class="search-bot">
                <img src="@/static/image/search-bot.png" alt="">
                <i class="icon el-icon-arrow-down"></i>
                <i class="icon el-icon-arrow-up"></i>
            </div>
        </div>

        <div class="table-content" v-show="!showSelWork">
            <div class="table-title">
                <h3>
                    <span>器具库存列表</span>
                    <el-tooltip effect="light" content="器具库存列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain @click="open(1)" size="mini" v-entity="1005198">客户器具维护</el-button>
                    <el-button type="primary" plain @click="open(2)" size="mini" v-entity="1005199">器具登记</el-button>
                    <el-button type="primary" plain @click="open(3)" size="mini" v-entity="1005200">器具登记明细</el-button>
                    <el-button type="primary" plain @click="open(4)" size="mini" v-entity="1005201">器具回收明细</el-button>
                    <el-button type="primary" plain @click="open(5)" size="mini" v-entity="1005202">器具整理明细</el-button>
                    <el-button type="primary" plain @click="open(10)" size="mini" v-entity="1005203">费用汇总</el-button>
                </div>
            </div>
            <tableCommon tableName="outDeviceStockManegeTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :singleSelect="true">
            </tableCommon>
        </div>
        <!-- 列表相关  结束 -->

    </div>
</template>

<script>
import outDeviceStockManege from './outDeviceStockManege.js'

export default outDeviceStockManege
</script>
<style lang="scss">
#outDeviceStockManege {

}
</style>
