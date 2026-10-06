<template>
    <div id="confirmedBillHZ" >
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">账单编号：</label>
                    <div class="input-text">
                        <el-input v-model="query.billNum" placeholder="账单编号" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">账单月份：</label>
                    <div class="input-text">
                        <el-date-picker v-model="query.billMonth" type="month" placeholder="账单月份" value-format="yyyy-MM"></el-date-picker>
                    </div>
                </div>
                <div class="item">
                    <label class="label">发票申请状态：</label>
                    <div class="input-text">
                        <el-select v-model="query.applyInvoiceState" placeholder="发票申请状态" @change="doQuery" clearable filterable>
                            <el-option v-for="item in applyInvoiceStateData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
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
                    <span>已确认账单列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="已确认账单列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
<!--                    <el-button type="primary" plain size="mini" @click="toCustomerConfirmedBillDetail()" v-entity="472">账单明细</el-button>-->
                </div>
            </div>
            <tableCommon tableName="confirmedBillHZTable" ref="table" :showNum="true" :showSetTable="true"
                         :singleSelect="true" :head="head" @dblclickItem="toCustomerConfirmedBillDetail">
            </tableCommon>
        </div>
    </div>
</template>

<script>
	import confirmedBill from './confirmedBill.js'
	export default confirmedBill
</script>
<style lang="scss">
@import '@/page/pt/fc/fc_common.scss';
#confirmedBillHZ{
    height: calc(100% - 41px) !important;
}
</style>
