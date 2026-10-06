<template>
    <div id="addCustomerBillMain">
        <!--        选择账单-开始        -->
        <selectBillItem ref="selectBillItem" v-show="showSelectBillItem" @generateBill="generateBill"></selectBillItem>
        <!--        选择账单-结束        -->

        <div v-show="!showSelectBillItem" class="showSelectBillItem" style="height: 100%;">
            <!--        生成账单-开始        -->
            <updateBillDetail ref="updateBillDetail" v-if="billDetailShow" @recheck="recheck"></updateBillDetail>
            <!--        生成账单-结束        -->
            <!--        按钮-开始        -->
            <div class="bot-btn" style="margin-top: 90px;">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" @click="updateCustBill">确认修改</el-button>
            </div>
            <!--        按钮-结束        -->
        </div>
    </div>
</template>

<script>
import updateSupplierBillMain from './updateSupplierBillMain.js'
export default updateSupplierBillMain
</script>

<style lang="scss">
    .showSelectBillItem{
        height: calc(100% - 130px) !important;
    }
</style>
