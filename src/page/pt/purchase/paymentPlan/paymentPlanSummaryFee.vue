<template>
    <div id="paymentPlanSummaryFee">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="paymentPlanSummaryFeeSearch"></searchList>
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
                    <el-button type="primary" plain size="mini" v-entity="1014051" @click="download">导出</el-button>
                </div>
            </div>
            <div v-show="showType == 1" style="height: 100%;">
                <tableCommon tableName="paymentPlanSummaryFeeTable" ref="table" :head="head" :showNum="true" :single-select="true" :showSetTable="false">
                </tableCommon>
            </div>
            <div class="rankView clearfix" v-if="showType == 2">
                <div class="rankItem">
                    <rankChart :data="chartData.dataList1" name="name" value="value"></rankChart>
                    <div class="rankTitle txt_c">费用类型排名-前十</div>
                </div>
                <div class="rankItem">
                    <rankChart :data="chartData.dataList2" name="name" value="value"></rankChart>
                    <div class="rankTitle">合计：<span class="fr">{{chartData.totalFee2}}</span></div>
                </div>
                <div class="rankItem">
                    <rankChart :data="chartData.dataList3" name="name" value="value"></rankChart>
                    <div class="rankTitle txt_c">费用月份排名-前十</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import paymentPlanSummaryFee from './paymentPlanSummaryFee.js'
export default paymentPlanSummaryFee
</script>

<style lang="scss" scoped src="./paymentPlanSummary.scss"></style>

