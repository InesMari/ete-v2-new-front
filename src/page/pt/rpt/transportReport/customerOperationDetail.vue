<template>
    <div id="customerOperationDetail" class="orderManagePage">
      <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="customerOperationDetailSearch"></searchList>
<!--      <div class="search-list clearfix">-->
<!--            <div class="search-form clearfix" @keyup.enter="doQuery()">-->
<!--                <div class="item">-->
<!--                    <label class="label">客户</label>-->
<!--                    <div class="input-text">-->
<!--                        <el-input v-model="query.tenantName" placeholder="客户" type="text"></el-input>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="item">-->
<!--                    <label class="label">订单号</label>-->
<!--                    <div class="input-text">-->
<!--                        <el-input v-model="query.orderNum" placeholder="订单号" type="text"></el-input>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="item daterange">-->
<!--                  <label class="label">客户下单时间</label>-->
<!--                  <div class="input-text">-->
<!--                    <el-date-picker v-model="query.customerOrderDate" type="daterange" range-separator="至"-->
<!--                                    start-placeholder="开始日期"-->
<!--                                    end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"-->
<!--                                    unlink-panels></el-date-picker>-->
<!--                  </div>-->
<!--                </div>-->
<!--                <div class="item daterange">-->
<!--                    <label class="label">要求运作时间</label>-->
<!--                    <div class="input-text">-->
<!--                        <el-date-picker v-model="query.workDate" type="daterange" range-separator="至" start-placeholder="开始日期"-->
<!--                                        end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"-->
<!--                                        unlink-panels></el-date-picker>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="item">-->
<!--                    <label class="label">作业点</label>-->
<!--                    <div class="input-text">-->
<!--                        <el-input v-model="query.workName" placeholder="作业点" type="text"></el-input>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->
<!--            <div class="search-btn clearfix">-->
<!--                <div class="btn">-->
<!--                    <el-button type="primary" plain size="mini" @click="doQuery" icon="el-icon-search">查询</el-button>-->
<!--                </div>-->
<!--                <div class="btn">-->
<!--                    <el-button type="danger" plain size="mini" @click="initQuery()" icon="el-icon-close">清空</el-button>-->
<!--                </div>-->
<!--            </div>-->
<!--            &lt;!&ndash; 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 &ndash;&gt;-->
<!--            <div class="search-bot">-->
<!--                <img src="@/static/image/search-bot.png" alt="">-->
<!--                <i class="icon el-icon-arrow-down"></i>-->
<!--                <i class="icon el-icon-arrow-up"></i>-->
<!--            </div>-->
<!--        </div>-->
        <div class="table-content">
            <div class="table-title">
                <h3><span>客户运作明细列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span></h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain @click="exportDownload" size="mini"  v-entity :entityId="[{1007008:1007018}]">导出EXCEL</el-button>
                </div>
            </div>
            <!-- 主体表格 -->
            <tableCommon tableName="customerOperationDetailTable" ref="table" :showNum="true" :singleSelect="false" :showSetTable="true" :head="head" @dblclickItem="dblclickItem">
            </tableCommon>
        </div>
    </div>
</template>

<script>
	import customerOperationDetail from './customerOperationDetail.js'
	export default customerOperationDetail
</script>
<style lang="scss">

</style>





