<template>
    <div id="outOrderManage">
        <select-work v-show="showSelWork"></select-work>

        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="outOrderManageSearch"
                    v-show="!showSelWork"></searchList>

        <div class="table-content" v-show="!showSelWork">
            <div class="table-title">
                <h3>
                    <span>出库单列表</span>
                    <el-tooltip effect="light" content="出库单列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1005029" @click="showDialog">新增</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005030" @click="showUpdateDialog">修改</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1005031" @click="delOutOrder()">删除</el-button>
                    <el-button type="success" plain size="mini" v-entity="1005027" @click="outOrderDeal()">确认出库</el-button>
                    <el-button type="success" plain size="mini" v-entity="1005227" @click="feeConfirm()">费用确认</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005028" @click="print()">打印</el-button>
<!--                    <el-button type="primary" plain size="mini" v-entity="1005026" @click="showDealDialog(true)">确认分配</el-button>-->
<!--                    <el-button type="primary" plain size="mini" v-entity="1005091" @click="sureSorting()">确认分拣</el-button>-->
<!--                    <el-button type="primary" plain size="mini" v-entity="1005025" @click="uploadOpen=true">批量导入</el-button>-->
                    <el-button type="primary" plain size="mini" v-entity="1005238" @click="printTagCode()">拆单标签预览</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005093" @click="toDtl()">出库物料详情</el-button>
<!--                    <el-button type="primary" plain size="mini" v-entity="1005133" @click="goto()">物料修改</el-button>-->
                    <el-button type="primary" plain size="mini" v-entity="1005150" @click="downloadExcel()">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="outOrderManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" @dblclickItem="dblclickItem" :singleSelect="true" ></tableCommon>
        </div>

        <!-- 批量导入 -->
        <my-import :open.sync="uploadOpen" :handle-success="uploadSuccess" template="/download/outOrder.xlsx" title="出库单导入"
                   bean="wmsOutOrderTF" method="impAddOutOrderInfo"></my-import>
    </div>
</template>

<script>
import outOrderManage from './outOrderManage.js'

export default outOrderManage
</script>
<style lang="scss">
#outOrderManage {
    .outOrderDialog {
        .tableCommon {
            .el-input__inner {
                text-align: center;
            }
        }

        .add {
            vertical-align: middle;
            @include add;
        }

        .del {
            vertical-align: middle;
            @include del;
        }
    }
}
</style>

