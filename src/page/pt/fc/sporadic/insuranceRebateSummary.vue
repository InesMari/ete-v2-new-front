<template>
    <div id="insuranceRebateSummary" class="insuranceRebateSummaryPage">
        <div class="common-info">
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="value" colspan="4"><span style="text-align: center;font-size: large;">{{info.settleBodyName}}</span></td>
                </tr>
                <tr>
                    <td class="label">入账月份</td>
                    <td class="value">{{info.postedMonth}}</td>
                    <td class="label">确认状态</td>
                    <td class="value">{{info.confirmStateName_0}}</td>
                </tr>
                <tr>
                    <td class="label">金额</td>
                    <td class="value">{{info.sumInsured_0}}</td>
                    <td class="label">入账金额</td>
                    <td class="value">{{info.postedAmount_0}}</td>
                </tr>
                <tr>
                    <td class="value" colspan="4"></td>
                </tr>
                <tr>
                    <td class="label">入账月份</td>
                    <td class="value">{{info.postedMonth}}</td>
                    <td class="label">确认状态</td>
                    <td class="value">{{info.confirmStateName_1}}</td>
                </tr>
                <tr>
                    <td class="label">金额</td>
                    <td class="value">{{info.sumInsured_1}}</td>
                    <td class="label">入账金额</td>
                    <td class="value">{{info.postedAmount_1}}</td>
                </tr>
            </table>
            <div class="page-bot-btn ">
                <el-button @click="closePage">关闭</el-button>
            </div>
        </div>
    </div>
</template>
  
<script>
import insuranceRebateSummary from './insuranceRebateSummary.js'
export default insuranceRebateSummary
</script>
<style lang="scss" scoped>
.insuranceRebateSummaryPage {
    
}</style>