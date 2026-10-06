<template>
    <div id="orderMessageManage" class="orderManagePage">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">订单号</label>
                    <div class="input-text">
                        <el-input v-model="query.orderNum" placeholder="订单号" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">我的单号</label>
                    <div class="input-text">
                        <el-input v-model="query.custOrderNum" placeholder="我的单号" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">线路名称</label>
                    <div class="input-text">
                        <el-input v-model="query.routeName" placeholder="线路名称" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">消息状态</label>
                    <div class="input-text">
                        <el-select v-model="query.isRead" @change="doQuery" clearable placeholder="消息状态">
                          <el-option v-for="item in readStateData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" @click="doQuery" icon="el-icon-search">查询</el-button>
                </div>
                <div class="btn">
                    <el-button type="danger" plain size="mini" @click="initQuery()" icon="el-icon-close">清空</el-button>
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
                <h3><span>待办事件-订单消息列表<el-tooltip effect="light" content="订单消息列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip></span></h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain @click="batchReadMessage()" size="mini">批量已读</el-button>
                    <el-button type="primary" plain @click="batchDeleteMessage()" size="mini">批量删除</el-button>
                </div>
            </div>
            <tableCommon tableName="orderMessageManageTable" ref="table" :showNum="true" :singleSelect="false" :head="head">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" class="link" @click.stop="toDetail(item, code)" style="margin: 0 10px;">{{item[code]}}</a>
                </template>
            </tableCommon>
        </div>

    </div>
</template>

<script>
	import orderMessageManage from './orderMessageManage.js'
	export default orderMessageManage
</script>
<style lang="scss">
    .orderMessageManage {
        .tableCommonComponents {
            height: 100% !important;
        }
    }
</style>





