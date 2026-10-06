<template>
    <div id="visitManage">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">来访人姓名</label>
                    <div class="input-text">
                        <el-input v-model="query.visitName" placeholder="来访人姓名" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">来访人车牌</label>
                    <div class="input-text">
                            <el-input v-model="query.plateNumber" placeholder="来访人车牌" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label" style="width: 150px">来访所属客户/供应商</label>
                    <div class="input-text">
                        <el-input v-model="query.visitCustomer" placeholder="来访所属客户/供应商" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">基地：</label>
                    <div class="input-text">
                        <el-select v-model="query.workStoreId" filterable collapse-tags clearable @change="doQuery" placeholder="基地">
                            <el-option v-for="item in workList" :key="item.workId" :label="item.workName"
                                       :value="item.workId"></el-option>
                        </el-select>
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
                    <span>来访登记管理列表</span>
                    <el-tooltip effect="light" content="来访登记管理列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1005243" @click="exportExcel">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="visitManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head">
            </tableCommon>
        </div>

    </div>
</template>

<script>
import visitManage from './visitManage.js'
export default visitManage
</script>
<style lang="scss">

</style>


