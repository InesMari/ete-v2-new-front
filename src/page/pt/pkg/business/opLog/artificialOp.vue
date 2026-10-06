<template>
    <div id="artificialOp" >
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">客户名称：</label>
                    <div class="input-text">
                        <el-input v-model="query.tenantName" placeholder="客户名称" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">交付地：</label>
                    <div class="input-text">
                        <el-input v-model="query.workName" placeholder="交付地" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">包装名称：</label>
                    <div class="input-text">
                        <el-input v-model="query.packName" placeholder="包装名称" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">操作类型：</label>
                    <div class="input-text">
                        <el-select v-model="query.opType" placeholder="操作类型" @change="doQuery" clearable filterable>
                            <el-option v-for="item in opTypeData" :key="item.codeValue" :label="item.codeName"
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
                    <span>人工操作列表</span>
                    <el-tooltip effect="light" content="人工操作列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">

                </div>
            </div>
            <tableCommon tableName="artificialOpTable" ref="table" :showNum="true" :showSetTable="true" :singleSelect="true" :head="head">
                <template v-slot:default="{item}">
                    <a href="javascript:void(0);" class="link" @click.stop="download(item)" style="margin: 0 10px;">{{ item.fileName }}</a>
                </template>
            </tableCommon>
        </div>
    </div>
</template>

<script>
	import artificialOp from './artificialOp.js'
	export default artificialOp
</script>
<style lang="scss">
@import '@/page/pt/fc/fc_common.scss';
#artificialOp {
    height: calc(100% - 41px) !important;
}
</style>
