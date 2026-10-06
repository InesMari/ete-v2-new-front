<template>
    <div id="outDeviceFeeSumManage">
        <!-- 列表相关  开始 -->
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery">
                <div class="item">
                    <label class="label">仓库名称：</label>
                    <div class="input-text">
                        <el-select v-model="query.workId" filterable clearable placeholder="仓库名称"
                                   @change="doQuery">
                            <el-option v-for="item in workData" :key="item.workId" :label="item.workName"
                                       :value="item.workId"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <label class="label">结算月份：</label>
                    <div class="input-text">
                        <el-date-picker v-model="query.month" type="month"
                                        value-format="yyyy-MM"
                                        unlink-panels></el-date-picker>
                    </div>
                </div>
                <div class="item">
                    <label class="label">客户名称：</label>
                    <div class="input-text">
                        <el-input v-model="query.tenantName" placeholder="客户名称" type="text"></el-input>
                    </div>
                </div>
                <div class="item daterange">
                    <label class="label">实际日期：</label>
                    <div class="input-text">
                        <el-date-picker v-model="query.createDate" type="daterange" range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期" value-format="yyyy-MM-dd"
                                        :picker-options="pickerOptions"
                                        unlink-panels></el-date-picker>
                    </div>
                </div>
                <div class="item">
                    <label class="label">使用客户：</label>
                    <div class="input-text">
                        <el-input v-model="query.useTenantName" placeholder="使用客户" type="text"></el-input>
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

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>费用汇总列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="费用汇总列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1005209" @click="open()">费用明细</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005210" @click="download">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="outDeviceFeeSumManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :singleSelect="true" >
            </tableCommon>
        </div>
        <!-- 列表相关  结束 -->

    </div>
</template>

<script>
import outDeviceFeeSumManage from './outDeviceFeeSumManage.js'

export default outDeviceFeeSumManage
</script>
<style lang="scss">
</style>
