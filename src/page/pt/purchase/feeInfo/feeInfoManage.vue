<template>
    <div id="feeInfoManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam"
                    searchKey="feeInfoManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>费用信息列表</span>
                    <el-tooltip effect="light" content="费用信息列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" v-entity="1014004" @click="addItem">新增</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014077" @click="copyItem">复制新增</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014005" @click="updateItem">修改</el-button>
                  <el-button type="danger"  plain size="mini" v-entity="1014006" @click="deleteItem">启用禁用</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014007" @click="importExcel">导入Excel</el-button>
                </div>
            </div>
            <tableCommon tableName="feeInfoManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :single-select="true" @dblclickItem="dblclickItem">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" class="link" @click.stop="toContract(item)" v-if="code=='contractNum'">{{item[code]}}</a>
                </template>
<!--                <template v-slot:diyColorTd="{item}">-->
<!--                    <span :style="item.sts==1?'color:red!important':''">{{item.stsName}}</span>-->
<!--                </template>-->
            </tableCommon>
        </div>

        <!-- 批量导入 -->
        <my-import :open.sync="uploadOpen" :handle-success="handleSuccess" template="/download/purBaseFee.xlsx" title="费用信息导入"
                   bean="purFeeBaseService" method="importPurFee"></my-import>
    </div>
</template>

<script>
import feeInfoManage from './feeInfoManage.js'
export default feeInfoManage
</script>
<style lang="scss" scoped>
#feeInfoManage{
    /deep/.search-list .search-form .item:nth-child(4n-3){
        .label{
            width: 124px;
        }
    } 
}
</style>

