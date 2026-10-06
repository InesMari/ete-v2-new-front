<template>
    <div id="answerSheetStatisticsByCustomerService">
        <div class="search-list clearfix">
            <div class="search-form clearfix">
                <div class="item">
                    <label class="label">问卷有效时间段</label>
                    <div class="input-text">
                        <el-date-picker v-model="query.date" type="daterange" range-separator="至" start-placeholder="开始日期"
                                        end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions" unlink-panels>
                        </el-date-picker>
                    </div>
                </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" @click="doQuery" icon="el-icon-search">查询</el-button>
                </div>
                <div class="btn">
                    <el-button type="danger" plain size="mini" @click="initQuery" icon="el-icon-close">清空</el-button>
                </div>
            </div>
        </div>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>明细列表</span>
                    <el-tooltip effect="light" content="明细列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" :style="showList ? 'margin-right: 90px;' : ''">
                    <el-button type="primary" plain @click="changeShowStyle" size="mini" icon="el-icon-refresh">{{ text }}</el-button>
                </div>
            </div>
            <tableCommon tableName="answerSheetStatisticsByCustomerServiceTable" ref="table" :showNum="true" :showSetTable="true" :head="head"
                         v-show="showList">
            </tableCommon>
            <div class="clearfix" v-show="!showList" style="margin-top: 5px;">
                <div style="height:350px;width: 50%;" class="fl" id="chart1"></div>
                <div style="height:350px;width: 50%;" class="fl" id="chart2"></div>
                <div style="height:350px;width: 100%;" class="fl" id="chart3"></div>
            </div>
        </div>
    </div>
</template>

<script>
import answerSheetStatisticsByCustomerService from './answerSheetStatisticsByCustomerService.js'

export default answerSheetStatisticsByCustomerService
</script>

<style lang="scss" scoped>
#answerSheetStatisticsByCustomerService{

}
</style>
