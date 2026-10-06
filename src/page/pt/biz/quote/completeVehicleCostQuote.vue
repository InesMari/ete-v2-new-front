<template xmlns="http://www.w3.org/1999/html">
    <div id="completeVehicleCostQuote" class="completeVehicleCostQuote">
        <searchList :formData="formData" @doQuery="doQuery" @clearFn="initQuery()" :query="query"
                    searchKey="completeVehicleCostQuoteSearch"></searchList>
        <div class="table-content clearfix">
            <div class="table-title">
                <h3>
                    <span>整车成本报价列表</span>
                    <el-tooltip effect="light" content="整车成本报价列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn"></div>
            </div>
            <tableCommon tableName="completeVehicleCostQuoteTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :singleSelect="true" @dblclickItem="dblclickItem">
                <template v-slot:diyColorTd="{item}">
                    <span :style="item.validState==1?'color:red!important':''">{{ item.validStateName }}</span>
                </template>
            </tableCommon>
        </div>
    </div>
</template>

<script>
import completeVehicleCostQuote from "./completeVehicleCostQuote.js";

export default completeVehicleCostQuote;
</script>
<style lang="scss">
.completeVehicleCostQuote {

}
</style>
