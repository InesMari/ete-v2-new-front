<template>
    <div id="orderManage">
        <!-- 列表相关  开始 -->
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                  <label class="label">订单号：</label>
                  <div class="input-text">
                    <el-input v-model="query.orderNum" placeholder="订单号/我的单号" type="text"
                              autocomplete="new-password"></el-input>
                  </div>
                </div>
                <div class="item">
                  <label class="label">线路名称：</label>
                  <div class="input-text">
                    <el-input v-model="query.routeName" placeholder="线路名称" type="text"
                              autocomplete="new-password"></el-input>
                  </div>
                </div>
                <div class="item">
                  <label class="label">货物名称：</label>
                  <div class="input-text">
                    <el-input v-model="query.goodsName" placeholder="货物名称" type="text"
                              autocomplete="new-password"></el-input>
                  </div>
                </div>
                <div class="item">
                    <label class="label">订单类型：</label>
                    <div class="input-text">
                        <el-select v-model="query.orderType" @change="doQuery" clearable placeholder="订单类型">
                            <el-option v-for="item in orderTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <label class="label">订单状态：</label>
                    <div class="input-text">
                        <el-select v-model="query.orderState" @change="doQuery" clearable placeholder="订单状态">
                            <el-option v-for="item in orderStateData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </div>

                <div class="item daterange">
                    <label class="label">完成时间</label>
                    <div class="input-text">
                        <el-date-picker v-model="query.finishDate" type="daterange" range-separator="至" start-placeholder="开始日期"
                                        end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"
                                        unlink-panels></el-date-picker>
                    </div>
                </div>
                <div class="item daterange">
                    <label class="label">要求运作时间</label>
                    <div class="input-text">
                        <el-date-picker v-model="query.workDate" type="daterange" range-separator="至" start-placeholder="开始日期"
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
                <h3><span>订单列表<el-tooltip effect="light" content="订单列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span></h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain @click="toOrderPrint" size="mini" v-entity="2001005">打印托运单</el-button>
                    <el-button type="primary" plain @click="toAddOrder" size="mini" v-entity="2001006">新增订单</el-button>
                    <el-button type="primary" plain @click="toCopyNewOrder" size="mini" v-entity="2001007">复制下单</el-button>
                    <el-button type="primary" plain @click="toUpdateOrder" size="mini" v-entity="2001008">修改订单</el-button>
                    <el-button type="primary" plain @click="toCancelOrder" size="mini" v-entity="2001009">取消订单</el-button>
                </div>
            </div>
            <tableCommon tableName="consignorOrderManageTable" ref="table" :head="head" :showNum="true" @dblclickItem="dblclickItem" :doQrySum="true" :showSetTable="true" :singleSelect="true">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" class="link" @click.stop="openDetail(item, code)" style="margin: 0 10px;">{{item[code]}}</a>
                </template>
                <template v-slot:diyColorTd="{item}">
                  <span :style="item.orderState==3?'color:red!important':''">{{item.orderStateName}}</span>
                </template>
            </tableCommon>
        </div>
        <!-- 列表相关  结束 -->
    </div>
</template>

<script>
	import orderManage from './orderManage.js'
	export default orderManage
</script>
<style lang="scss">

</style>
