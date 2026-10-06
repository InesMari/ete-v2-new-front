<template>
    <div id="commissionDtlManage" class="orderManagePage ">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="commissionDtlManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>提成明细管理列表</span>
                    <el-tooltip effect="light" content="提成明细管理列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain @click="download()" size="mini">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="commissionDtlManageTable" ref="table" :showNum="true" :singleSelect="false"
                         :showSetTable="true" :head="head">
              <template v-slot="{item,code}">
                <div v-if="'billNum'==code">
                  <a href="javascript:void(0);" class="link" @click.stop="toCustomerConfirmedBillDetail(item)" style="margin: 0 10px;">{{item.billNum}}</a>
                </div>
              </template>
            </tableCommon>
        </div>

    </div>
</template>

<script>
import commissionDtlManage from './commissionDtlManage.js'

export default commissionDtlManage
</script>
<style lang="scss">
@import '@/page/pt/fc/fc_common.scss';

#commissionDtlManage {

}
</style>





