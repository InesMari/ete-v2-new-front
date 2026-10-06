<template>
    <div id="receiveOrRefuseOrderManage" class="orderManagePage">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">客户</label>
                    <div class="input-text">
                        <el-input v-model="query.tenantName" placeholder="客户" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">线路名称</label>
                    <div class="input-text">
                        <el-input v-model="query.routeName" placeholder="线路名称" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">订单号</label>
                    <div class="input-text">
                        <el-input v-model="query.orderNum" placeholder="订单号/客户单号" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">订单状态</label>
                    <div class="input-text">
                        <el-select v-model="query.orderState" @change="doQuery" clearable placeholder="订单状态" >
                            <el-option v-for="item in orderStateData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <label class="label">订单类型</label>
                    <div class="input-text">
                        <el-select v-model="query.orderType" @change="doQuery" clearable placeholder="订单类型">
                          <el-option v-for="item in orderTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item daterange">
                    <label class="label">下单时间</label>
                    <div class="input-text">
                        <el-date-picker v-model="query.createDate" type="daterange" range-separator="至" start-placeholder="开始日期"
                                        end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"
                                        unlink-panels></el-date-picker>
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
                <h3><span>待办事件-新订单处理(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span></h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain @click="receiveOrder()" size="mini" v-entity :entityId="[{1010010: 1010026}]">接受订单</el-button>
                    <el-button type="primary" plain @click="refuseOrder()" size="mini" v-entity :entityId="[{1010010: 1010027}]">拒接订单</el-button>
                </div>
            </div>
            <tableCommon tableName="receiveOrRefuseOrderManageTable" ref="table" :showNum="true" :singleSelect="true" :doQrySum="true" :head="head" @dblclickItem="dblclickItem">
                <template v-slot:diyColorTd="{item}">
                    <span :style="item.orderState == 3?'color:red!important':''">{{item.orderStateName}}</span>
                </template>
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" class="link" @click.stop="openDetail(item, code)" style="margin: 0 10px;">{{item[code]}}</a>
                </template>
            </tableCommon>
        </div>

    </div>
</template>

<script>
	import receiveOrRefuseOrderManage from './receiveOrRefuseOrderManage.js'
	export default receiveOrRefuseOrderManage
</script>
<style lang="scss">
    .receiveOrRefuseOrderManage {
        .tableCommonComponents {
            height: 100% !important;
        }
    }
</style>





