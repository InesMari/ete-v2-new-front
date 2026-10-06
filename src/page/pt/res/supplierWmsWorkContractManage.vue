<template>
    <div id="supplierWmsWorkContractManage">
      <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="supplierWmsWorkContractManageSearch"></searchList>
      <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>供应商仓储作业合同列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="供应商仓储作业合同列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1002172" @click="toAdd()">新增</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1002173" @click="toUpdate()">修改</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1002174" @click="toCopy()">复制</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1002175" @click="toDel">删除</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1002176" @click="verify">审核</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1002177" @click="downloadPdf(1)">导出PDF</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1002178" @click="costCompare">成本对比</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1002179" @click="downloadPdf(2)">导出Excel</el-button>
                </div>
            </div>
            <tableCommon tableName="supplierWmsWorkContractManageTable" ref="table" :showNum="true" :singleSelect="false"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem"></tableCommon>
        </div>
    </div>
</template>

<script>
import supplierWmsWorkContractManage from './supplierWmsWorkContractManage.js'
export default supplierWmsWorkContractManage
</script>
<style lang="scss">

</style>




