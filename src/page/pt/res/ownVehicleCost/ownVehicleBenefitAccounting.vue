<template>
    <div id="ownVehicleBenefitAccounting">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="ownVehicleBenefitAccountingSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>单车收益核算列表</span>
                    <el-tooltip effect="light" content="单车收益核算列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="downloadExcel()" v-entity="1002156">导出Excel</el-button>
                    <el-button type="primary" plain size="mini" @click="print()" v-entity="1002156">打印</el-button>
                </div>
            </div>
            <tableCommon tableName="ownVehicleBenefitAccountingTable" ref="table" :showNum="true" :showSetTable="true" :head="head"
                         :singleSelect="false">
            </tableCommon>
        </div>
        
    </div>
</template>

<script>
import ownVehicleBenefitAccounting from './ownVehicleBenefitAccounting.js'

export default ownVehicleBenefitAccounting
</script>

<style scoped lang="scss">
    #ownVehicleBenefitAccounting{
        .common-info .content > .item .label-term {
            width: 118px;
        }
        .common-info .content > .item .input-text {
            width: calc(100% - 128px);
        }
    }
</style>
