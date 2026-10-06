<template>
    <div id="inOrderManage">
        <select-work v-show="showSelWork"></select-work>
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="inOrderManageSearch" v-show="!showSelWork"></searchList>
        <div class="table-content" v-show="!showSelWork">
            <div class="table-title">
                <h3>
                    <span>入库单列表</span>
                    <el-tooltip effect="light" content="入库单列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1005022" @click="showDialog()">新增</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005023" @click="showUpdateDialog()">修改</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005239" @click="updateInOrderQrcode()">标签修改</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1005024" @click="delInOrder()">删除</el-button>
                    <el-button type="success" plain size="mini" v-entity="1005019" @click="updateInOrderState()">确认接收</el-button>
                    <el-button type="success" plain size="mini" v-entity="1005020" @click="deal()">确认入库</el-button>
                    <el-button type="success" plain size="mini" v-entity="1005226" @click="feeConfirm()">费用确认</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005021" @click="print()">打印</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005237" @click="printTagCode()">标签预览</el-button>
                    <!--          <el-button type="primary" plain size="mini" v-entity="1005113" @click="modify()">批次修改</el-button>-->
                    <el-button type="primary" plain size="mini" v-entity="1005018" @click="uploadOpen=true">批量导入</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005228" @click="uploadOpen2=true">导入入库单</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005092" @click="toDtl()">入库物料详情</el-button>
<!--                    <el-button type="primary" plain size="mini" v-entity="1005132" @click="go()">物料修改</el-button>-->
                    <el-button type="primary" plain size="mini" v-entity="1005149" @click="downloadExcel()">导出</el-button>

                </div>
            </div>
            <tableCommon tableName="inOrderManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" single-select="true" @dblclickItem="dblclickItem"></tableCommon>
        </div>

        <!-- 批量导入 -->
        <my-import :open.sync="uploadOpen" :handle-success="uploadSuccess" template="/download/inOrder.xlsx" title="入库单导入"
                   bean="wmsInOrderTF" method="impAddInOrderInfo" ></my-import>

        <!-- 导入入库单 -->
        <my-import ref="myImport" :open.sync="uploadOpen2" :setSureCallback="true" @sureCallback="uploadConfirm" :handle-success="uploadSuccess" template="/download/saveOrder.xlsx" title="导入入库单"
                   bean="wmsInOrderTF" method="impSaveInOrderInfo" ></my-import>
    </div>
</template>

<script>
import inOrderManage from './inOrderManage.js'
export default inOrderManage
</script>
<style lang="scss">
#inOrderManage{

}
</style>

