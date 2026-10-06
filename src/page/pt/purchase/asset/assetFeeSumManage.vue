<template>
    <div id="assetFeeSumManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam"
                    searchKey="assetFeeSumManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>资产费用汇总</span>
                    <el-tooltip effect="light" content="资产费用汇总" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" v-entity="1014066" @click="downloadExcel">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="assetFeeSumManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :single-select="true" @dblclickItem="dblclickAssetFeeInfo">
            </tableCommon>
        </div>
    </div>
</template>

<script>
import assetFeeSumManage from './assetFeeSumManage.js'
export default assetFeeSumManage
</script>
<style lang="scss" scoped>
#assetFeeSumManage{
    /deep/.search-list .search-form .item:nth-child(4n-3){
        .label{
            width: 124px;
        }
    } 
}
</style>

