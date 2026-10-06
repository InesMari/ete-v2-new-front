<template>
    <div id="feeApplyManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="feeApplyManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>费用申请单列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="费用申请单列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" v-entity="1014008" @click="addFeeApply">新增</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014009" @click="updateFeeApply">修改</el-button>
                  <el-button type="danger"  plain size="mini" v-entity="1014010" @click="toDel">删除</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014011" @click="examFeeApply">审核</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014012" @click="addPurOrder">进行采购</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014046" @click="writeOffPurOrder">核销</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014045" @click="setProcess">审批流程设置</el-button>
                </div>
            </div>
            <tableCommon tableName="feeApplyManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :single-select="true" @dblclickItem="toDetail">
              <template v-slot:default="{item, code}">
                <a href="javascript:void(0);" class="link"  v-for="(data,index) in item.purchaseNumArray" @click.stop="toPurOrderDetail(item, index)" v-if="code=='purchaseNums'">{{index>0?','+data:data}}</a>
                <a href="javascript:void(0);" class="link"  v-for="(data,index) in item.allocatNumArray" @click.stop="toAllocatDetail(item, index)" v-if="code=='allocatNums'">{{index>0?','+data:data}}</a>
              </template>
            </tableCommon>
        </div>
    </div>
</template>

<script>
import feeApplyManage from './feeApplyManage.js'
export default feeApplyManage
</script>
<style lang="scss" scoped>
#feeApplyManage{
    /deep/.search-list .search-form .item{
        .label{
            width: 124px;
        }
    }
}
</style>

