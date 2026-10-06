<template>
    <div id="temporaryCustomerManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="temporaryCustomerManageSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>临时客户列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="临时客户列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="toUpdateCustomer" v-entity="1001099">修改</el-button>
                    <el-button type="primary" plain size="mini" @click="updateCustomerState(1)" v-entity="1001100">启用</el-button>
                    <el-button type="primary" plain size="mini" @click="updateCustomerState(0)" v-entity="1001101">禁用</el-button>
                    <el-button type="primary" plain size="mini" @click="toUpgradeCustomer" v-entity="1001106">升级合同客户</el-button>
                    <el-button type="primary" plain size="mini" @click="download" v-entity="1001102">导出Excel</el-button>
                </div>
            </div>
            <tableCommon tableName="customerManageTable" ref="table" :showNum="true" :showSetTable="true"
                         :singleSelect="true" :head="head" @dblclickItem="dblclickItem">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" v-if="code=='attachments'" class="link" @click.stop="showBusinessLicense(item)"
                       style="margin: 0 10px;">营业资料</a>
                </template>
                <template v-slot:diyColorTd="{item}">
                    <span :style="item.sts==0?'color:red!important':''">{{ item.stsName }}</span>
                </template>
            </tableCommon>
        </div>

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

    </div>
</template>

<script>
import temporaryCustomerManage from './temporaryCustomerManage.js'

export default temporaryCustomerManage
</script>

<style scoped>

</style>
