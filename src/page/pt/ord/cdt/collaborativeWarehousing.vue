<template>
    <div id="collaborativeWarehousing" >
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">客户名称：</label>
                    <div class="input-text">
                        <el-input v-model="query.tenantName" placeholder="客户名称" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">订单号：</label>
                    <div class="input-text">
                        <el-input v-model="query.orderNum" placeholder="订单号" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">订单状态：</label>
                    <div class="input-text">
                        <el-select v-model="query.orderState" placeholder="订单状态" @change="doQuery" clearable filterable>
                            <el-option v-for="item in orderStateData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
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
                    <span>区域协同管理列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="区域协同管理列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="toDispatchLD" v-entity="1003017">零担调度</el-button>
                    <el-button type="primary" plain size="mini" @click="toDispatch" v-entity="1003018">订单调度</el-button>
                </div>
            </div>
            <tableCommon tableName="collaborativeWarehousingTable" ref="table" :showNum="true" :showSetTable="true"
                         :singleSelect="true" :head="head" @dblclickItem="dblclickItem">
                <template v-slot:diyColorTd="{item}">
                    <span :style="item.orderState== enumData.orderState.CANCELLED?'color:red!important':''">{{item.orderStateName}}</span>
                </template>
            </tableCommon>
        </div>

    </div>
</template>

<script>
	import collaborativeWarehousing from './collaborativeWarehousing.js'
	export default collaborativeWarehousing
</script>
<style lang="scss">
@import '@/page/pt/fc/fc_common.scss';
#collaborativeWarehousing {

}
</style>
