<template>
    <div id="deviceInventoryManage">
        <select-work v-show="showSelWork"></select-work>

        <div class="search-list clearfix" v-show="!showSelWork">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">器具名称：</label>
                    <div class="input-text">
                        <el-input v-model="query.deviceName" placeholder="器具名称" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">使用客户：</label>
                    <div class="input-text">
                        <el-input v-model="query.tenantName" placeholder="使用客户" type="text"></el-input>
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
        <div class="table-content" v-show="!showSelWork">
            <div class="table-title">
                <h3>
                    <span>器具盘点列表</span>
                    <el-tooltip effect="light" content="器具盘点列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1005160" @click="openStockInventory">库存盘点</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005161" @click="goStockInventoryLog">盘点记录</el-button>
                </div>
            </div>
            <tableCommon tableName="deviceInventoryManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" single-select="true"></tableCommon>
        </div>

        <!--        库存盘点-->
        <el-dialog title="库存盘点" :visible.sync="showDialog" width="600px" :close-on-click-modal="false" :close-on-press-escape="false" @close="openDialog(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item90">
                        <label class="label-term">器具名称</label>
                        <div class="input-text">
                            <el-input v-model="info.deviceName" disabled></el-input>
                        </div>
                    </li>
                    <li class="item item90">
                        <label class="label-term">器具规格</label>
                        <div class="input-text">
                            <el-input v-model="info.spec" disabled></el-input>
                        </div>
                    </li>
                    <li class="item item90">
                        <label class="label-term">所属人</label>
                        <div class="input-text">
                            <el-input v-model="info.srcTenantName" disabled></el-input>
                        </div>
                    </li>
                    <li class="item item90">
                        <label class="label-term">使用客户</label>
                        <div class="input-text">
                            <el-input v-model="info.tenantName" disabled></el-input>
                        </div>
                    </li>
                    <li class="item item90">
                        <label class="label-term">在库数量</label>
                        <div class="input-text">
                            <el-input v-model="info.nums" disabled></el-input>
                        </div>
                    </li>
                    <li class="item item90">
                        <label class="label-term"><em>*</em>盘点数量</label>
                        <div class="input-text">
                            <el-input v-model="info.actualNum" v-mynumval></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="openDialog(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="saveInventory">确定</el-button>
                </div>
            </div>
        </el-dialog>
        <!--        库存盘点-->

    </div>
</template>

<script>
import deviceInventoryManage from './deviceInventoryManage.js'
export default deviceInventoryManage
</script>

<style lang="scss">
</style>
