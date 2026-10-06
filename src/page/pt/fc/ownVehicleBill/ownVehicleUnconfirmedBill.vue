<template>
    <div id="ownVehicleUnconfirmedBill">
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
                    <label class="label">供应商：</label>
                    <div class="input-text">
                        <el-select v-model="query.tenantId" placeholder="供应商" @change="doQuery" clearable filterable>
                            <el-option v-for="item in tenantData" :key="item.tenantId" :label="item.supplierName" :value="item.tenantId"></el-option>
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
                    <span>未确认账单列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="未确认账单列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="addOwnVehicleBill" v-entity="1006059">新增账单</el-button>
                    <el-button type="primary" plain size="mini" @click="sureOwnVehicleBill" v-entity="1006060">账单确认</el-button>
                    <el-button type="primary" plain size="mini" @click="updateOwnVehicleBill" v-entity="1006061">修改账单</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteOwnVehicleBill" v-entity="1006062">删除账单</el-button>
                </div>
            </div>
            <tableCommon tableName="ownVehicleUnconfirmedBillTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="toOwnVehicleBillDetail">
            </tableCommon>
        </div>
    </div>
</template>

<script>
	import ownVehicleUnconfirmedBill from './ownVehicleUnconfirmedBill.js'
	export default ownVehicleUnconfirmedBill
</script>
<style lang="scss">
    #ownVehicleUnconfirmedBill{
      height: calc(100% - 41px) !important;
    }
</style>

