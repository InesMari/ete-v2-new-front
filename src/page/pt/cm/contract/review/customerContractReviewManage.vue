<template>
    <div id="customerContractReviewManage">

        <searchList :formData="formData" @doQuery="doQuery" @clearFn="initQuery()" :query="query"
                    searchKey="customerContractReviewManageSearch"/>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>客户合同评审列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="客户合同评审列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="reviewContract" v-entity="1011040">评审
                    </el-button>
                    <el-button type="primary" plain size="mini" @click="addContractReview" v-entity="1011041">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="copyContractReview" v-entity="1011048">复制</el-button>
                    <el-button type="primary" plain size="mini" @click="updateContractReview" v-entity="1011042">修改
                    </el-button>
                    <el-button type="danger" plain size="mini" @click="delContractReviewInfo" v-entity="1011043">删除
                    </el-button>
                    <el-button type="primary" plain size="mini" @click="cancelReviewContractInfo" v-entity="1011044">取消评审
                    </el-button>
                    <el-button type="primary" plain size="mini" @click="printContractReview" v-entity="1011045">打印
                    </el-button>
                    <el-button type="primary" plain size="mini" @click="sendOffRegister" v-entity="1011055">寄出登记</el-button>
                </div>
            </div>
            <tableCommon tableName="customerContractReviewManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="viewContractReview">
            </tableCommon>
        </div>
    </div>
</template>

<script>
import customerContractReviewManage from './customerContractReviewManage.js'

export default customerContractReviewManage
</script>
<style lang="scss">
@import '@/page/pt/fc/fc_common.scss';

#customerContractReviewManage {
}
</style>
