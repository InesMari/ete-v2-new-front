<template xmlns="http://www.w3.org/1999/html">
    <div id="lessThanTruckloadVehicleIncomeQuote" class="lessThanTruckloadVehicleIncomeQuote">
        <searchList :formData="formData" @doQuery="doQuery" @clearFn="initQuery()" :query="query"
                    searchKey="lessThanTruckloadVehicleIncomeQuoteSearch"></searchList>
        <div class="table-content clearfix">
            <div class="table-title">
                <h3>
                    <span>零担收入报价列表</span>
                    <el-tooltip effect="light" content="零担收入报价列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn"></div>
            </div>
            <tableCommon tableName="lessThanTruckloadVehicleIncomeQuoteTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :singleSelect="true" @dblclickItem="dblclickItem">
                <template v-slot:diyColorTd="{item}">
                    <span :style="item.validState==1?'color:red!important':''">{{ item.validStateName }}</span>
                </template>
            </tableCommon>
        </div>
    </div>
</template>

<script>
import lessThanTruckloadVehicleIncomeQuote from "./lessThanTruckloadVehicleIncomeQuote.js";

export default lessThanTruckloadVehicleIncomeQuote;
</script>
<style lang="scss">
.lessThanTruckloadVehicleIncomeQuote {

}
</style>
