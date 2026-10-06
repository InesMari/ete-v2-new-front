<template>
    <div id="addCustomerBillMain">
        <!--        选择账单-开始        -->
        <selectBillItem ref="selectBillItem" v-show="showSelectBillItem" @generateBill="generateBill"></selectBillItem>
        <!--        选择账单-结束        -->

        <div v-show="!showSelectBillItem" class="showSelectBillItem" style="height: 100%;">
            <!--        生成账单-开始        -->
            <addBillDetail ref="addBillDetail" v-if="billDetailShow" @recheck="recheck"></addBillDetail>
            <!--        生成账单-结束        -->
            <!--        按钮-开始        -->
            <div class="bot-btn" style="margin-top: 115px;position: relative;z-index: 99;">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" @click="sureSaveBill">确认新增</el-button>
            </div>
            <!--        按钮-结束        -->
        </div>
    </div>
</template>

<script>
import addCustomerBillMain from './addCustomerBillMain.js'
export default addCustomerBillMain
</script>

<style lang="scss">
    .showSelectBillItem{
        height: calc(100% - 160px) !important;
    }
</style>
