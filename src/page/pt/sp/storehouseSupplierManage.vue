<template>
    <div id="storehouseSupplierManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="storehouseSupplierManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>仓储供应商列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="仓储供应商列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="openDialog(true)" v-entity="1002169">修改</el-button>
                    <el-button type="primary" plain size="mini" @click="download()" v-entity="1002170">导出Excel</el-button>
                </div>
            </div>
            <tableCommon tableName="storehouseSupplierManageTable" ref="table" :showNum="true" :showSetTable="true"
                         :head="head" :singleSelect="true" @dblclickItem="dblclickItem">
                <template v-slot:diyColorTd="{item}">
                    <span :style="item.sts==0?'color:red!important':''">{{ item.stsName }}</span>
                </template>
            </tableCommon>
        </div>

        <!-- begin -->
        <el-dialog :title="title" :visible.sync="showUpdate" width="540px" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="openDialog(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>供应商名称</label>
                        <div class="input-text">
                            <el-input v-model="supplier.supplierName" disabled></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>供应商简称</label>
                        <div class="input-text">
                            <el-input v-model="supplier.abbreviationName" disabled></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>供应商类型</label>
                        <div class="input-text">
                            <el-input v-model="supplier.supplierTypeName" disabled></el-input>
                        </div>
                    </li>

                    <li class="item item100">
                        <label class="label-term"><em>*</em>供应商联系人</label>
                        <div class="input-text">
                            <el-input v-model="supplier.adminUser" disabled></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>可服务区域</label>
                        <div class="input-text">
                            <el-select v-model="supplier.serviceAreas" multiple clearable filterable
                                       placeholder="请选择可服务区域">
                                <el-option v-for="item in serviceAreasData" :key="item.codeValue"
                                           :label="item.codeName"
                                           :value="item.codeValue">
                                </el-option>
                            </el-select>
                        </div>
                    </li>

                    <li class="item item100">
                        <label class="label-term">服务物流中心</label>
                        <div class="input-text">
                            <el-select v-model="supplier.workIds" clearable filterable multiple placeholder="请选择是否仓储供应商">
                                <el-option v-for="item in workList" :key="item.workId"
                                           :label="item.workName" :value="item.workId"></el-option>
                            </el-select>
                        </div>
                    </li>

                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="openDialog(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="updateSupplierData()">确认</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- end -->

    </div>
</template>

<script>
import storehouseSupplierManage from './storehouseSupplierManage.js'

export default storehouseSupplierManage
</script>

<style scoped>

</style>
