<template>
    <div id="assetFeeManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam"
                    searchKey="assetFeeManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>资产费用列表</span>
                    <el-tooltip effect="light" content="资产费用列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" v-entity="1014063" @click="downloadExcel">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="assetFeeManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :single-select="true" @dblclickItem="dblclickAssetFeeInfo">
              <template v-slot:default="{item, code}">
                <a href="javascript:void(0);" class="link" @click.stop="toContract(item)" v-if="code=='contractNum'">{{item[code]}}</a>
              </template>
            </tableCommon>
        </div>
    </div>
</template>

<script>
import assetFeeManage from './assetFeeManage.js'
export default assetFeeManage
</script>
<style lang="scss" scoped>
#assetFeeManage{
    /deep/.search-list .search-form .item:nth-child(4n-3){
        .label{
            width: 124px;
        }
    } 
}
</style>

