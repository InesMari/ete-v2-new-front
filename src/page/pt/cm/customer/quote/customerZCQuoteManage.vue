<template xmlns="http://www.w3.org/1999/html">
    <div id="customerZCQuoteManage" class="customerZCQuoteManage">
        <searchList :formData="formData" @doQuery="doQuery" @clearFn="initQuery()" :query="query" searchKey="customerZCQuoteManageSearch"></searchList>
        <div class="table-content clearfix">
            <div class="table-title">
                <h3>
                    <span>{{isVerify ? '待办事件-客户新整车报价处理' : '客户整车报价列表'}}
                        (<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)
                    </span>
                    <el-tooltip effect="light" :content="isVerify ? '待办事件-客户新整车报价处理' : '客户整车报价列表'" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn"  style="margin-right: 90px;">
                    <el-button type="primary" v-show="!isVerify" plain size="mini" @click="addZCQuote()" v-entity="1001042">新增</el-button>
                    <el-button type="primary" v-show="!isVerify" plain size="mini" @click="copyZCQuote()" v-entity="1001064">复制</el-button>
                    <el-button type="primary" v-show="!isVerify" plain size="mini" @click="updateZCQuote()" v-entity="1001043">修改</el-button>
                    <el-button type="danger" v-show="!isVerify" plain size="mini" @click="deleteZCQuote()" v-entity="1001044">删除</el-button>
                    <el-button type="primary" v-show="!isVerify" plain size="mini" @click="showUpload(true)" v-entity="1001045">批量导入</el-button>
                    <el-button type="primary" v-show="!isVerify" plain size="mini" @click="exportData()" v-entity="1001046">导出Excel</el-button>

                    <el-button type="primary" v-show="isVerify" plain size="mini" @click="verifyQuote(true)" v-entity="1010022">审核通过</el-button>
                    <el-button type="primary" v-show="isVerify" plain size="mini" @click="verifyQuote(false)" v-entity="1010023">审核不通过</el-button>

                    <el-button type="primary" v-show="!isVerify" plain size="mini" @click="cancelVerifyQuote()" v-entity="1001104">取消审核</el-button>
                </div>
            </div>
                <tableCommon :class="{'table':showTableDetail}" :tableName="isVerify ? 'customerZCQuoteVerifyTable' : 'customerZCQuoteManageTable'" ref="table" :head="head" :showNum="true"
                             :showSetTable="true" :singleSelect="true" @dblclickItem="dblclickItem" >
                    <template v-slot:diyColorTd="{item}">
                        <span :style="item.validState==1?'color:red!important':''">{{item.validStateName}}</span>
                    </template>
                </tableCommon>
        </div>
        <!-- 报价导入 开始-->
        <el-dialog title="报价导入" :visible.sync="showUploadPage" :close-on-click-modal="false" :close-on-press-escape="false"
                   width="500px" @close="showUpload(false)">
            <div class="common-info" style="border:none;padding:0;">
                <div style="padding: 0 22px;">
                    <em style="font-size:14px;">
                        注：<br/>
                        1、报价级别：按作业点，按区域。<br/>
                        2、中途点1，中途点2，点位费单价没有的情况，不填为空。<br/>
                        3、计费方式：按整车，按毛重，按净重，按体积，按件数。<br/>
                        4、报价车型，车长，货物，没有限定的情况，请输入'通用'，多个的情况请用英文逗号隔开或者新增一行数据。<br/>
                        5、同一客户下,相同的起始点、中途点、目的地、计费方式、报价车型、车长、货物、只能存在一条。通用等于全选。<br/>
                    </em>
                </div>
                <ul class="content clearfix" style="margin-top:10px;">
                    <li class="item item100" style="margin-top:10px;margin-left: 24px;">
                        <my-import ref="myImport" :handle-success="uploadSuccess" :noneDialog="true" template="/download/customerZcQuote.xlsx" title="报价导入"
                                   tip="仅允许导入“xls”或“xlsx”格式文件！" bean="ZCQuoteNewTF" method="importQuote" :param="param"></my-import>
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
import customerZCQuoteManage from './customerZCQuoteManage.js'
export default customerZCQuoteManage
</script>
<style lang="scss">
.customerZCQuoteManage {
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
