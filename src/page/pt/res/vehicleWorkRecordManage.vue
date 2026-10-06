<template>
    <div id="vehicleWorkRecordManage">
        <select-work v-show="showSelWork"></select-work>

        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">车牌号码：</label>
                    <div class="input-text">
                        <el-input v-model="query.plateNumber" ></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">作业点名称：</label>
                    <div class="input-text">
                        <el-input v-model="query.workName" ></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">进入时间：</label>
                    <div class="input-text">
                        <el-date-picker v-model="query.enterDate" type="daterange"
                                        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                        value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                    </div>
                </div>
                <div class="item">
                    <label class="label">离开时间：</label>
                    <div class="input-text">
                        <el-date-picker v-model="query.leaveDate" type="daterange"
                                        range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                                         value-format="yyyy-MM-dd" format="yyyy-MM-dd" ></el-date-picker>
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
                    <span>车辆监控管理列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="车辆监控管理列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="goto" v-entity="1005232">监控维护</el-button>
                    <el-button type="primary" plain size="mini" @click="exportWmsPersonCost" v-entity="1005233">导出Excel</el-button>
                </div>
            </div>
            <tableCommon tableName="vehicleWorkRecordManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" @dblclickItem="dblclickItem"></tableCommon>
        </div>
    </div>
</template>

<script>
import vehicleWorkRecordManage from './vehicleWorkRecordManage.js'

export default vehicleWorkRecordManage
</script>
<style lang="scss">

</style>

