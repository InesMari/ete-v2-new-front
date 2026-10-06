<template>
    <div id="paymentPlanSummaryWork">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="paymentPlanSummaryWorkSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>费用汇总-按物流中心<em>（--双击序号查看详情--）</em></span>
                    <el-tooltip effect="light" content="费用汇总-按物流中心" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn">
                    <el-radio-group v-model="showType" size="mini" style="vertical-align:top;" @change="changeShow">
                        <el-radio-button label="1">列表模式</el-radio-button>
                        <el-radio-button label="2">图表模式</el-radio-button>
                    </el-radio-group>
                    <el-button type="primary" plain size="mini" v-entity="1014050" @click="download">导出</el-button>
                </div>
            </div>
            <div v-show="showType == 1" style="height: 100%;">
                <tableCommon tableName="paymentPlanSummaryWorkTable" ref="table" :head="head" :showNum="true" :single-select="true" :showSetTable="false">
                </tableCommon>
            </div>
            <div class="rankView clearfix" v-if="showType == 2">
                <div class="rankItem fl">
                    <rankChart :data="chartData.dataList1" name="name" value="value"></rankChart>
                    <div class="rankTitle">合计：<span class="fr">{{chartData.totalFee1}}</span></div>
                </div>
                <div class="rankItem fr">
                    <rankChart :data="chartData.dataList2" name="name" value="value"></rankChart>
                    <div class="rankTitle txt_c">费用月份排名-前十</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import paymentPlanSummaryWork from './paymentPlanSummaryWork.js'
export default paymentPlanSummaryWork
</script>
<style lang="scss" scoped src="./paymentPlanSummary.scss"></style>

