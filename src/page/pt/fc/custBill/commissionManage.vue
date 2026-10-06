<template>
    <div id="commissionManage" class="orderManagePage ">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="commissionManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>提成管理列表</span>
                    <el-tooltip effect="light" content="提成管理列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain @click="changeProfitState" size="mini" v-entity="1006200">利润达标</el-button>
                    <el-button type="primary" plain @click="payRegistration" size="mini" v-entity="1006201">发放登记</el-button>
                    <el-button type="primary" plain @click="download()" size="mini" v-entity="1006202">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="commissionManageManageTable" ref="table" :showNum="true" :singleSelect="false"
                         :showSetTable="true" :head="head" @dblclickItem="toDtlManage">
            </tableCommon>
        </div>

    </div>
</template>

<script>
import commissionManage from './commissionManage.js'

export default commissionManage
</script>
<style lang="scss">
@import '@/page/pt/fc/fc_common.scss';

#commissionManage {

}
</style>





