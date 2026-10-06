<template>
    <div id="contrastReport" class="contrastReportPage">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()" style="overflow:initial;">
                <div class="item" style="width:100%;">
                    <div class="input-text">
                        <monthsPicker></monthsPicker>
                    </div>
                </div>
                <div class="item" style="width:100%;height:auto;">
                    <!-- <label class="label">公司名称：</label> -->
                    <div class="input-text">
                        <el-select v-model="companyList" placeholder="请选择公司" multiple filterable>
                            <el-option
                                v-for="item in companyOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询</el-button>
                </div>
                <div class="btn">
                    <el-button type="danger" plain size="mini" icon="el-icon-close" @click="clear()">清空</el-button>
                </div>
            </div>
        </div>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>订单计划列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="订单计划列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn">
                    <el-button type="primary" plain size="mini" >导出Excel</el-button>
                </div>
            </div>
            <tableCommon tableName="ordPlanManageTable" ref="table" :head="head" :showSetTable="false" :doSum="true"></tableCommon>
        </div>

    </div>
</template>

<script>
    import contrastReport from './contrastReport.js'

    export default contrastReport
</script>
<style lang="scss">
.contrastReportPage{
    
}
</style>
