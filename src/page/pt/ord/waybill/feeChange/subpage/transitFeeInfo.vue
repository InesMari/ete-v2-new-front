<template>
    <div id="transitFeeInfo">
        <div class="common-info" style="border:none;padding:0;">
            <h3 class="common-title">
                <span class="title-name">费用异动变更&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red;">（注：费用异动填写的是费用变动值!）</span></span>
            </h3>
            <div class="tickManager">
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                    <tr>
                        <th width="15%">中转其他费</th>
                        <th width="40%">备注</th>
                        <th width="15%" v-show="false">费用合计</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            <el-input v-model="feeInfo.transitOtherFee" type="text" placeholder="" v-mypmdouble4val @input="updateFeeMoveTotal" :disabled="false"></el-input>
                        </td>
                        <td>
                            <el-input v-model="feeInfo.remark" type="text" placeholder="" :disabled="false"></el-input>
                        </td>
                        <td v-show="false">
                            <el-input v-model="feeInfo.totalTransitFee" type="text" placeholder="" :disabled="true"></el-input>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <h3 class="common-title mt_20">
                <span class="title-name">费用异动记录</span>
            </h3>
            <div class="innerTable">
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                    <tr>
                        <th width="10%">序号</th>
                        <th width="10%">中转其他费</th>
                        <th width="10%">费用合计</th>
                        <th width="10%">备注</th>
                        <th width="10%">审核状态</th>
                        <th width="10%">申请人</th>
                        <th width="10%">申请日期</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in statementList" style="text-align: center">
                        <td width="10%">{{ index + 1 }}</td>
                        <td width="10%">{{ item.transitOtherFee }}</td>
                        <td width="10%">{{ item.totalFee }}</td>
                        <td width="10%">{{ item.remark }}</td>
                        <td width="10%">{{ item.verifyStateName }}</td>
                        <td width="10%">{{ item.createUserName }}</td>
                        <td width="10%">{{ item.createDate }}</td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <td>合计</td>
                        <!-- 调度重量/kg -->
                        <td>{{ feeMoveTotalInfo.transitOtherFeeSum }}</td>
                        <td>{{ feeMoveTotalInfo.totalFeeSum }}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import transitFeeInfo from './transitFeeInfo.js'

export default transitFeeInfo
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>
