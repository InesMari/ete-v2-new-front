<template>
    <div id="customerManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="customerManageSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>合同客户列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="合同客户列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="toUpdateCustomer" v-entity="1001004">修改</el-button>
                    <el-button type="primary" plain size="mini" @click="updateCustomerState(1)" v-entity="1001005">启用</el-button>
                    <el-button type="primary" plain size="mini" @click="updateCustomerState(0)" v-entity="1001006">禁用</el-button>
                    <el-button type="primary" plain size="mini" @click="uploadOpen = true" v-entity="1001092">导入提成人员</el-button>
                    <el-button type="primary" plain size="mini" @click="downloadCustomerCommission" v-entity="1001094">导出提成人员</el-button>
                    <el-button type="primary" plain size="mini" @click="download" v-entity="1001093">导出Excel</el-button>
                </div>
            </div>
            <tableCommon tableName="customerManageTable" ref="table" :showNum="true" :showSetTable="true"
                         :singleSelect="true" :head="head" @dblclickItem="dblclickItem">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" v-if="code=='attachments'" class="link" @click.stop="showBusinessLicense(item)"
                       style="margin: 0 10px;">营业资料</a>
                    <a href="javascript:void(0);" v-if="code=='attachments'" class="link" @click.stop="showInvoiceInfo(item)"
                       style="margin: 0 10px;">开票资料</a>
                    <div class="block" v-if="code=='creditLevel'">
                        <el-rate
                                v-model="item.creditLevel"
                                :colors="colors" disabled
                                show-text :texts="texts" text-color="red">
                        </el-rate>
                    </div>
                </template>
                <template v-slot:diyColorTd="{item}">
                    <span :style="item.sts==0?'color:red!important':''">{{ item.stsName }}</span>
                </template>
            </tableCommon>
        </div>

        <!-- 权限配置 -->
        <div class="popup" :class="{'show':showEntityPage}">
            <div class="popup_bj" @click="isShowEntityPage(false)"></div>
            <div class="popup_content" style="width:40%">
                <authRoleTree ref="authRoleTree" :showRole="false"></authRoleTree>
            </div>
        </div>

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>
      <!-- 批量导入 -->
      <my-import :open.sync="uploadOpen" :handle-success="uploadSuccess" template="/download/customerCommission.xls" title="导入提成人员"
                 bean="customerTF" method="impSaveCustomerCommission" ></my-import>
    </div>
</template>

<script>
import customerManage from './customerManage.js'

export default customerManage
</script>

<style scoped>

</style>
