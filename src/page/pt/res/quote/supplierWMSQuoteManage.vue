<template xmlns="http://www.w3.org/1999/html">
    <div id="supplierWMSQuoteManage" class="supplierWMSQuoteManage">
        <searchList :formData="formData" @doQuery="doQuery" @clearFn="initQuery()" :query="query" searchKey="supplierWMSQuoteManageSearch"></searchList>

        <div class="table-content clearfix">
            <div class="table-title">
                <h3>
                    <span>供应商仓配报价列表</span>
                    <el-tooltip effect="light" content="供应商仓配报价列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn">
                    <el-button type="primary" plain size="mini" @click="addWMSQuote()" v-entity="1002092">新增报价</el-button>
                    <el-button type="primary" plain size="mini" @click="copyWMSQuote()" v-entity="1002093">复制报价</el-button>
                    <el-button type="primary" plain size="mini" @click="updateWMSQuote()" v-entity="1002094">修改报价</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteWMSQuote()" v-entity="1002095">删除报价</el-button>
                    <el-button type="primary" plain size="mini" @click="verifyQuote" v-entity="1002096">审核</el-button>
<!--                    <el-button type="primary" plain size="mini" @click="showUpload(true)" v-entity="1002097">导入报价</el-button>-->
<!--                    <el-button type="primary" plain size="mini" @click="exportData()" v-entity="1002098">导出报价</el-button>-->
                </div>
            </div>
                <tableCommon :class="{'table':showTableDetail}" tableName="supplierWMSQuoteManageTable" ref="table" :head="head" :showNum="true"
                             :showSetTable="false" @clickItem="clickItem" :singleSelect="true">
                    <template v-slot:diyColorTd="{item}">
                        <span :style="item.validState==1?'color:red!important':''">{{item.validStateName}}</span>
                    </template>
                </tableCommon>
                <div class="tableDetail" v-show="showTableDetail">
                    <div class="con" v-show="quoteData.quoteNum">
                        <label class="label">报价单号:</label>
                        <span style="color: red;">{{quoteData.quoteNum}}</span>
                        <label class="label">供应商:</label>
                        <span>{{quoteData.tenantName}}</span>
                        <label class="label">线路:</label>
                        <span>{{quoteData.routeName}}</span>
                    </div>
                    <div class="con" v-show="quoteData.createUserName">
                        <label class="label">创建人:</label>
                        <span>{{quoteData.createUserName}}</span>
                        <label class="label">创建时间:</label>
                        <span>{{quoteData.createDate}}</span>
                    </div>
                    <div class="table_height">
                        <table class="tableCommon" ref="quoteDetail" width="100%" border="0" cellspacing="0" cellpadding="0">
                            <thead>
                                <tr>
                                    <th>序号</th>
                                    <th>计费方式</th>
                                    <th>报价车型</th>
                                    <th>车长</th>
                                    <th>单价金额</th>
                                    <th>返程单价金额</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(item,index) in quoteDetailData">
                                <td>{{ index }}</td>
                                <td>{{ item.billingTypeName }}</td>
                                <td>{{ item.quoteVehicleTypeName }}</td>
                                <td>{{ item.vehicleLengthName }}</td>
                                <td>{{ item.feePrice }}</td>
                                <td>{{ item.returnFeePrice }}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
        </div>
        <!-- 报价导入 开始-->
        <el-dialog title="报价导入" :visible.sync="showUploadPage" :close-on-click-modal="false" :close-on-press-escape="false"
                   width="600px" @close="showUpload(false)">
            <div class="common-info" style="border:none;padding:0;">
                <div style="padding: 0 22px;">
                    <em style="font-size:14px;">
                        注：<br/>
                        1、计费方式：按趟，按件，按月。<br/>
                        2、报价车型，没有限定的情况，请输入'通用'，多个的情况请用英文逗号隔开或者新增一行数据。<br/>
                        3、同一供应商下,相同的起始地、目的地、计费方式、报价车型、车长、只能存在一条。通用等于全选。<br/>
                    </em>
                </div>
                <ul class="content clearfix" style="margin-top:10px;">
                    <li class="item item100" style="margin-top:10px;margin-left: 24px;">
                        <my-import ref="myImport" :handle-success="uploadSuccess" :noneDialog="true" template="/download/supplierWmsQuote.xlsx" title="报价导入"
                                   tip="仅允许导入“xls”或“xlsx”格式文件！" bean="quoteService" method="importWmsQuote" :param="uploadParam"></my-import>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="showUpload(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="upload()">确认</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 报价导入 结束-->

    </div>
</template>

<script>
import supplierWMSQuoteManage from './supplierWMSQuoteManage.js'
export default supplierWMSQuoteManage
</script>
<style lang="scss">
.supplierWMSQuoteManage {
    .table {
        width: 40%;
        float: left;
    }
    .tableDetail {
        width: 59%;
        float: right;
        border:$border;
        padding: 10px 20px;
        box-sizing: border-box;
        .con{
            line-height: 24px;
            margin-bottom: 10px;
            span{
                margin-right: 20px;
            }
        }
    }
    .table_height {
        border: $border;
        border-bottom: none;
        overflow: auto;
    }
}
</style>
