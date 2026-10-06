<template>
    <div id="itemClaimApplyManage" class="itemClaimApplyManage">
      <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="itemClaimApplyManageSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>物品领用申请单列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="物品领用申请单列表" placem ent="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1009011" @click="verifyClaimApply">审核</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1009012" @click="addClaimApply">新增</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1009013" @click="updateClaimApply">修改</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1009014" @click="deleteClaimApply">删除</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1009021" @click="setProcess">审批流程设置</el-button>
                </div>
            </div>
            <tableCommon tableName="itemClaimApplyManageTable" ref="table" :showNum="true" :showSetTable="true" :head="head"
                         :singleSelect="true" @dblclickItem="dblclickItem">
            </tableCommon>
        </div>
    </div>
</template>

<script>
import itemClaimApplyManage from './itemClaimApplyManage.js'

export default itemClaimApplyManage
</script>
<style lang="scss">
</style>
