<template>
    <div id="purchaseOrderDtlManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam"
                    searchKey="purchaseOrderDtlManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>采购单明细列表<em>（--双击序号查看详情--）</em></span>
                    <el-tooltip effect="light" content="采购单明细列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" v-entity="1014020" @click="exportExcel">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="purchaseOrderDtlManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :single-select="true">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" class="link" v-if="code=='purchaseNum'"
                      @click.stop="toDetail(item)">{{item.purchaseNum}}</a>
                    <a href="javascript:void(0);" class="link" v-if="code=='applyNums'"
                       v-for="(data,index) in item.applyNumArray"
                       @click.stop="toApplyDetail(item, index)">{{index>0?','+data:data}}</a>
                    <a href="javascript:void(0);" class="link" v-if="code=='deliveryNums'"
                       v-for="(data,index) in item.deliveryNumArray"
                       @click.stop="toInOrderDetail(item, index)">{{index>0?','+data:data}}</a>
                </template>
            </tableCommon>
        </div>
    </div>
</template>

<script>
import purchaseOrderDtlManage from './purchaseOrderDtlManage.js'
export default purchaseOrderDtlManage
</script>
<style lang="scss" scoped>
#purchaseOrderDtlManage{
    /deep/ .inWarehouse{
        .tableCommon{
            border:$border;
            margin:20px 0;
            .del{
                vertical-align: middle;
                @include del;
            }
        }
    }

}
</style>

