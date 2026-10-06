<template>
    <div id="addSupplierBillMain">
        <!--        选择账单-开始        -->
        <selectBillItem ref="selectBillItem" v-show="showSelectBillItem" @generateBill="generateBill"></selectBillItem>
        <!--        选择账单-结束        -->

        <div v-show="!showSelectBillItem" class="showSelectBillItem" style="height: 100%;">
            <!--        生成账单-开始        -->
            <addBillDetail ref="addBillDetail" v-if="billDetailShow" @recheck="recheck"></addBillDetail>
            <!--        生成账单-结束        -->
            <!--        按钮-开始        -->
            <div class="bot-btn" style="margin-top: 65px;position: relative;z-index: 99;">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" @click="sureSaveBill">确认新增</el-button>
            </div>
            <!--        按钮-结束        -->
        </div>
    </div>
</template>

<script>
import addSupplierBillMain from './addSupplierBillMain.js'
export default addSupplierBillMain
</script>

<style lang="scss">
    .showSelectBillItem{
        height: calc(100% - 110px) !important;
    }
</style>
