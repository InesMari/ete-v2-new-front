<template>
    <div id="stockInventoryManage">
        <select-work v-show="showSelWork"></select-work>
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="stockInventoryManageSearch" v-show="!showSelWork"></searchList>
        <!-- 列表相关  开始 -->
        <div class="table-content" v-show="!showSelWork">
            <div class="table-title">
                <h3>
                    <span>盘盈盘亏列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="盘盈盘亏列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1005135" @click="addStockInventory">新增</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005136" @click="updateStockInventory">修改</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1005137" @click="deleteStockInventory">删除</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1005189" @click="toUninventoryDetail">未盘点明细</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1005139" @click="verifyStockInventory">审核</el-button>
                </div>
            </div>
            <tableCommon tableName="stockInventoryManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" single-select="true" @dblclickItem="dblclickItem"></tableCommon>
        </div>

    </div>
</template>

<script>
import stockInventoryManage from './stockInventoryManage.js'
export default stockInventoryManage
</script>

<style lang="scss">
</style>
