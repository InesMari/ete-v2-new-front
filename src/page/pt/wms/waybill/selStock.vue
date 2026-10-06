<template>
    <div id="wmsWaybillSelStock" class="selStockPage" style="height:100%;">
        <searchList :formData="formData" @doQuery="doQuery" :query="param" searchKey="wmsWaybillSelStockSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>物料出库明细列表</span>
                    <el-tooltip effect="light" content="物料出库明细库存" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="next()">下一步</el-button>
                </div>
            </div>
            <dbTable tableName="wmsWaybillSelStockTable" ref="table" :head="head" onlyId="outOrderMaterialDtlId" :showSetTable="true"></dbTable>
        </div>
    </div>
</template>

<script>
import selStock from './selStock.js'

export default selStock
</script>
<style lang="scss">
.selStockPage {
    .table-content {
        .tableCommonDiv {
            height: calc(100% - 50px);
        }
    }
    .search-list {
        .search-form .item {
            .sel-ipt {
                & > .el-select {
                    float: left;
                    width: 40%;
                }
                & > .el-input {
                    float: left;
                    width: 60%;
                }
            }
        }
    }
}
</style>
