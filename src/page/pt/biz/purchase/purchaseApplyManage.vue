<template>
    <div id="purchaseApplyManage">
      <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="purchaseApplyManageSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>采购费用申请列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="采购费用申请列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1009006" @click="verifyPurchaseApply">审核</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1009007" @click="addPurchaseApply">新增</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1009008" @click="updatePurchaseApply">修改</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1009009" @click="deletePurchaseApply">删除</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1009010" @click="generatePayApplyCheck(enumData.PAY_TYPE.REQ)">生成请款单</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1009019" @click="generatePayApplyCheck(enumData.PAY_TYPE.PAY)">生成付款单</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1009022" @click="donePurchaseApply">完结确认</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1009023" @click="printPurchaseApply">打印采购单</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1009024" @click="downloadExcel">导出</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1009020" @click="setProcess">审批流程设置</el-button>
                </div>
            </div>
            <tableCommon tableName="purchaseApplyManageTable" ref="table" :showNum="true" :singleSelect="false" :showSetTable="true" :head="head" @dblclickItem="dblclickItem">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" class="link"  v-for="(data,index) in item.reqNumArray" @click.stop="toDetail(item, code, index)" v-if="code=='reqNums'">{{index>0?','+data:data}}</a>
                    <a href="javascript:void(0);" class="link"  v-for="(data,index) in item.payNumArray" @click.stop="toDetail(item, code, index)" v-if="code=='payNums'">{{index>0?','+data:data}}</a>
                </template>
            </tableCommon>
        </div>
    </div>
</template>

<script>
import purchaseApplyManage from './purchaseApplyManage.js'
export default purchaseApplyManage
</script>
<style lang="scss">
.tickerLogDialog {
    .el-textarea {
        textarea {
            height: 89px;
        }
    }

    .table_height {
        border: $border;
    }
}
</style>




