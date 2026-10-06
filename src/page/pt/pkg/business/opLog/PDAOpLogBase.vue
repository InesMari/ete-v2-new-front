<template>
    <div id="PDAOpLogBase" >
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">仓库名称：</label>
                    <div class="input-text">
                        <el-input v-model="query.workName" placeholder="仓库名称" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">操作人：</label>
                    <div class="input-text">
                        <el-input v-model="query.createUserName" placeholder="操作人" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">操作类型：</label>
                    <div class="input-text">
                        <el-select v-model="query.dealType" placeholder="操作类型" @change="doQuery" clearable filterable>
                            <el-option v-for="item in dealTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
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
                <h3>
                    <span>PDA操作列表</span>
                    <el-tooltip effect="light" content="PDA操作列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">

                </div>
            </div>
            <tableCommon tableName="PDAOpLogTable" ref="table" :showNum="true" :showSetTable="true" :singleSelect="true" :head="head"  @dblclickItem="toDetail">
            </tableCommon>
        </div>
    </div>
</template>

<script>
	import PDAOpLogBase from './PDAOpLogBase.js'
	export default PDAOpLogBase
</script>
<style lang="scss">
@import '@/page/pt/fc/fc_common.scss';
#artificialOp {
    height: calc(100% - 41px) !important;
}
</style>
