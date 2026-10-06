<template>
    <div id="wmsPackMaterialRecordManage">
        <!-- 列表相关  开始 -->
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">登记单号：</label>
                    <div class="input-text">
                        <el-input v-model="query.recordNum" placeholder="登记单号" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">包材名称：</label>
                    <div class="input-text">
                        <el-input v-model="query.name" placeholder="包材名称" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">到货厂商：</label>
                    <div class="input-text">
                        <el-input v-model="query.tenantName" placeholder="到货厂商" type="text"></el-input>
                    </div>
                </div>
                <div class="item daterange">
                    <label class="label">实际日期</label>
                    <div class="input-text">
                        <el-date-picker v-model="query.date" type="daterange" range-separator="至" start-placeholder="开始日期"
                                        end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions">
						</el-date-picker>
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
                    <span>包材记录列表</span>
                    <el-tooltip effect="light" content="包材记录列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
				<div class="table-title-btn" style="margin-right: 90px;">
<!--					<el-button type="primary" plain @click="deletePackMaterialRecord" size="mini" v-entity="1005158">删除</el-button>-->
<!--					<el-button type="primary" plain @click="detailChange(1)" size="mini" v-entity="1005144">查看</el-button>-->
				</div>
            </div>
            <tableCommon tableName="wmsPackMaterialRecordManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :singleSelect="true">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" class="link" @click.stop="openDetail(item, code)" style="margin: 0 10px;">{{item[code]}}</a>
                </template>
            </tableCommon>
        </div>
        <!-- 列表相关  结束 -->

    </div>
</template>

<script>
import wmsPackMaterialRecordManage from './wmsPackMaterialRecordManage.js'
export default wmsPackMaterialRecordManage
</script>
<style lang="scss">
#wmsPackMaterialLogManage {

}
</style>
