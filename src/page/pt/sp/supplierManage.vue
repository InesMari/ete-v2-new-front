<template>
    <div id="supplierManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="supplierManageSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>供应商列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="供应商列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="toUpdatePage()" v-entity="1002010">修改</el-button>
                    <el-button type="primary" plain size="mini" @click="uploadOpen = true" v-entity="1002011">批量导入</el-button>
                    <el-button type="primary" plain size="mini" @click="download()" v-entity="1002012">导出Excel</el-button>
                    <el-button type="primary" plain size="mini" @click="updateSupplierState()" v-entity="1002013">启用/禁用</el-button>
                    <el-button type="danger" plain size="mini" @click="verifySupplier()" v-entity="1002190">审核</el-button>
                </div>
            </div>
            <tableCommon tableName="supplierManageTable" ref="table" :head="head"
                         :showNum="true" :showSetTable="true" :singleSelect="true"  @dblclickItem="dblclickItem">
              <template v-slot:diyColorTd="{item}">
                <span :style="item.sts==0?'color:red!important':''">{{ item.stsName }}</span>
              </template>
            </tableCommon>
        </div>

        <my-import :open.sync="uploadOpen" :handle-success="uploadSuccess" repeatCheckNums="0"
                   template="/download/supplier.xlsx" title="供应商导入" bean="supplierTF"
                   method="impAddSupplierInfo"></my-import>

    </div>
</template>

<script>
import supplierManage from './supplierManage.js'

export default supplierManage
</script>

<style scoped>

</style>
