<template xmlns="http://www.w3.org/1999/html">
    <div id="completeVehicleIncomeQuote" class="completeVehicleIncomeQuote">
        <searchList :formData="formData" @doQuery="doQuery" @clearFn="initQuery()" :query="query"
                    searchKey="completeVehicleIncomeQuoteSearch"></searchList>
        <div class="table-content clearfix">
            <div class="table-title">
                <h3>
                    <span>整车收入报价列表</span>
                    <el-tooltip effect="light" content="整车收入报价列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn"></div>
            </div>
            <tableCommon tableName="completeVehicleIncomeQuoteTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :singleSelect="true" @dblclickItem="dblclickItem">
                <template v-slot:diyColorTd="{item}">
                    <span :style="item.validState==1?'color:red!important':''">{{ item.validStateName }}</span>
                </template>
            </tableCommon>
        </div>
    </div>
</template>

<script>
import completeVehicleIncomeQuote from "./completeVehicleIncomeQuote.js";

export default completeVehicleIncomeQuote;
</script>
<style lang="scss">
.completeVehicleIncomeQuote {

}
</style>
