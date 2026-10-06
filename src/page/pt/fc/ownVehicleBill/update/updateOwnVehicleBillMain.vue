<template>
    <div id="updateOwnVehicleBillMain">
        <!--        选择账单-开始        -->
        <ownVehicleSelectBillItem ref="ownVehicleSelectBillItem" v-show="showSelectBillItem" @generateBill="generateBill"></ownVehicleSelectBillItem>
        <!--        选择账单-结束        -->

        <div v-show="!showSelectBillItem" class="showSelectBillItem" style="height: 100%;">
            <!--        生成账单-开始        -->
            <ownVehicleBillDetail ref="ownVehicleBillDetail" v-if="billDetailShow" @recheck="recheck"></ownVehicleBillDetail>
            <!--        生成账单-结束        -->

            <!--        按钮-开始        -->
            <div class="bot-btn" style="margin-top: 20px;">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" @click="sureUpdateBill">确认修改</el-button>
            </div>
            <!--        按钮-结束        -->
        </div>
    </div>
</template>

<script>
import updateOwnVehicleBillMain from './updateOwnVehicleBillMain.js'
export default updateOwnVehicleBillMain
</script>

<style lang="scss">
    .showSelectBillItem{
        height: calc(100% - 60px) !important;
    }
</style>
