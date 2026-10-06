<template>
    <div id="supplierContractReviewManage" >

        <searchList :formData="formData" @doQuery="doQuery" @clearFn="initQuery()" :query="query" searchKey="supplierContractReviewManageSearch"/>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>供应商合同评审列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="供应商合同评审列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="reviewContract" v-entity="1011028">评审</el-button>
                    <el-button type="primary" plain size="mini" @click="addContractReview" v-entity="1011029">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="copyContractReview" v-entity="1011049">复制</el-button>
                    <el-button type="primary" plain size="mini" @click="updateContractReview" v-entity="1011030">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="delContractReviewInfo" v-entity="1011031">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="cancelReviewContractInfo" v-entity="1011032">取消评审</el-button>
                    <el-button type="primary" plain size="mini" @click="printContractReview" v-entity="1011033">打印</el-button>
                    <el-button type="primary" plain size="mini" @click="sendOffRegister" v-entity="1011056">寄出登记</el-button>
                    <el-button type="primary" plain size="mini" @click="revokeContractReviewInfo" v-entity="1011071">撤销申请</el-button>
                </div>
            </div>
            <tableCommon tableName="supplierContractReviewManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="viewContractReview">
            </tableCommon>
        </div>
    </div>
</template>

<script>
	import supplierContractReviewManage from './supplierContractReviewManage.js'
	export default supplierContractReviewManage
</script>
<style lang="scss">
@import '@/page/pt/fc/fc_common.scss';
#supplierContractReviewManage {
}
</style>
