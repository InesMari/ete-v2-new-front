<template>
    <div id="orderManage" class="orderManagePage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="orderManageSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3><span>订单列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span></h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain @click="toOrderPrint" size="mini" v-entity="1003028">打印托运单</el-button>
                    <el-button type="primary" plain @click="openReceipts" size="mini" v-entity="1003019">上传单据</el-button>
                    <el-button type="primary" plain @click="toAddOrder" size="mini" v-entity="1003020">新增订单</el-button>
                    <el-button type="primary" plain @click="toOrderDetail" size="mini" v-entity="1003021">查看订单</el-button>
                    <el-button type="primary" plain @click="toUpdateOrder" size="mini" v-entity="1003022">修改订单</el-button>
                    <el-button type="primary" plain @click="toCancelOrder" size="mini" v-entity="1003023">取消订单</el-button>
                    <el-button type="primary" plain @click="toCopyNewOrder" size="mini" v-entity="1003024">复制下单</el-button>
                    <el-tooltip effect="light" placement="right"
                                content="已完成没进账单，时间没超过次月15号，可以异动，时间超次月15号，不能异动！">
                        <el-button type="primary" plain @click="toIncomeChange" size="mini" v-entity="1003025">
                            费用异动
                        </el-button>
                    </el-tooltip>
                    <el-button type="primary" plain @click="exportDownload" size="mini" v-entity="1003026">导出Excel</el-button>
                    <el-button type="primary" plain @click="verifyOrder" size="mini" v-entity="1003076">入账审核</el-button>
                    <div class="switchDiv" v-entity="1003027">
                        <el-switch v-model="seeRepertory" @change="changeSwitch" active-color="#13ce66"></el-switch>
                        <span class="name">{{ seeRepertory ? "关闭" : "查看" }}订单库存</span>
                    </div>
                    <el-button type="primary" plain size="mini" @click="uploadOpen = true" v-entity="1003087">批量修改客户单号</el-button>
                    <el-button type="primary" plain size="mini" @click="uploadOpen2 = true" v-entity="1003094">订单导入</el-button>
                    <el-button type="primary" plain size="mini" @click="uploadOpen3 = true" v-entity="1003102">批量修改要求运作时间</el-button>
                    <el-button type="primary" plain @click="recycleWaybill" size="mini" v-entity="1003110">回收派车</el-button>
                </div>
            </div>
            <div class="clearfix" style="height: calc(100% - 60px);">
                <!-- 右侧库存信息 -->
                <div class="ordRepertoryTable" v-show="seeRepertory">
                    <h4 class="title">订单：{{ stock.orderNum }}
                        <span>库存<em>（<em>{{ orderStockData.length }}</em>）</em></span></h4>
                    <div class="repertory-search clearfix">
                        <label class="label">库存仓库</label>
                        <div class="input-text">
                            <el-input v-model="stockQuery.stockRepertory" placeholder="请输入仓库名称" type="text"
                                      autocomplete="new-password"></el-input>
                        </div>
                        <label class="label">库存状态</label>
                        <div class="input-text">
                            <el-select v-model="stockQuery.stockState" clearable @change="queryOrderStock"
                                       placeholder="请选择库存状态">
                                <el-option v-for="item in stockStateData" :key="item.codeValue" :label="item.codeName"
                                           :value="item.codeValue"></el-option>
                            </el-select>
                        </div>
                        <el-button size="mini" type="primary" style="margin-top:3px;" @click="queryOrderStock">查询
                        </el-button>
                    </div>
                    <div class="table_height">
                        <div class="noData" v-if="false">暂无库存信息</div>
                        <table class="tableCommon" ref="js_my_table" width="100%" border="0" cellspacing="0"
                               cellpadding="0">
                            <thead>
                            <tr>
                                <th rowspan="2">库存仓库</th>
                                <th colspan="3">库存数量</th>
                                <th rowspan="2">库存状态</th>
                            </tr>
                            <tr>
                                <th>件数（件）</th>
                                <th>重量（KG）</th>
                                <th>体积（m³）</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="stock in orderStockData">
                                <td>{{ stock.workName }}</td>
                                <td>{{ stock.goodsCount }}</td>
                                <td>{{ stock.goodsWeight }}</td>
                                <td>{{ stock.goodsVolume }}</td>
                                <td>{{ stock.stockStateName }}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <!-- 主体表格 -->
                <div :class="{'trunLeft':seeRepertory}" style="height:100%">
                    <tableCommon tableName="orderManageTable" ref="table" :showNum="true" :singleSelect="true"
                                 :showSetTable="showSetTable" :head="head" @clickItem="clickItem"
                                 @dblclickItem="dblclickItem" @selectAll="selectAll">
                        <template v-slot:diyColorTd="{item}">
                            <span :style="item.orderState==3?'color:red!important':''">{{ item.orderStateName }}</span>
                        </template>
                    </tableCommon>
                </div>
            </div>
        </div>

        <!-- 单据 开始-->
        <el-dialog title="上传单据" :visible.sync="showReceipts" width="680px" :close-on-click-modal="false"
                   :close-on-press-escape="false">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>订单号</label>
                        <div class="input-text">
                            <el-input v-model="receipts.orderNum" :disabled="true"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>派车单号</label>
                        <div class="input-text">
                            <el-select v-model="receipts.waybillId" placeholder="请选择派车单号" filterable clearable
                                       @change="changeWaybill">
                                <el-option v-for="item in waybillData" :key="item.waybillId" :label="item.waybillNum"
                                           :value="item.waybillId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">客户</label>
                        <div class="input-text">
                            <el-input v-model="receipts.tenantName" maxlength="100" placeholder="客户"
                                      :disabled="true"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>作业点</label>
                        <div class="input-text">
                            <el-select v-model="receipts.waybillWorkId" placeholder="请选择作业点"
                                       @change="changeWaybillWork" filterable clearable>
                                <el-option v-for="item in waybillWorkData" :key="item.waybillWorkId"
                                           :label="item.workName" :value="item.waybillWorkId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">详细地址</label>
                        <div class="input-text">
                            <el-input v-model="receipts.workAddressStr" maxlength="50" placeholder="详细地址"
                                      :disabled="true"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>单据类型</label>
                        <div class="input-text">
                            <el-radio v-model="receipts.receiptsType" @change="changeUpdate" label="1">回单</el-radio>
                            <el-radio v-model="receipts.receiptsType" @change="changeUpdate" label="2">过磅单</el-radio>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>单据图片</label>
                        <div class="input-text uploadFile clearfix">
                            <div class="fl mr_20 mb_20" v-for="(item,index) in list">
                                <myFileModel :ref="'file' + index" v-if="showReceipts" @successCallback="fileCallback"
                                             @delCallback="delCallback" :componentId="index"></myFileModel>
                                <p>只支持.jpg .png .pdf格式</p>
                            </div>
                        </div>
                        <!--                        <div class="input-text">-->
                        <!--                            <myFileModel v-if="showReceipts" ref="receiptsImg" @successCallback="setImgData" ></myFileModel>-->
                        <!--                        </div>-->
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="changeReceiptsShow(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="addReceipts()">确认</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 单据 结束-->

        <my-import :open.sync="uploadOpen" :handle-success="doQuery" repeatCheckNums="0"
                   template="/download/updateCustOrderNum.xls" title="批量修改客户单号" bean="orderTF"
                   method="impUpdateCustOrderNum"></my-import>

        <my-import :open.sync="uploadOpen2" :handle-success="doQuery" begin-row="1"
                 template="/download/orderTemp.xlsx" title="订单导入" bean="orderTF"
                 method="impAddOrderInfos"></my-import>

        <my-import :open.sync="uploadOpen3" :handle-success="doQuery" repeatCheckNums="0"
                   template="/download/updateOrderWorkTime.xls" title="批量修改要求运作时间" bean="orderTF"
                   method="impUpdateOrderWorkTime"></my-import>
    </div>
</template>

<script>
import orderManage from './orderManage.js'

export default orderManage
</script>
<style lang="scss">
.mr_20 {
    margin-right: 20px;
}

.orderManagePage {
    .tableCommonComponents {
        height: 100% !important;
    }

    .trunLeft {
        float: right;
        width: calc(100% - 500px);

        .table_height {
            border-right: $border;
        }
    }

    .ordRepertoryTable {
        margin-left: 50px;
        float: right;
        width: 450px;
        padding-right: 20px;
        box-sizing: border-box;
        height: 100%;

        .title {
            font-weight: bold;
            font-size: 14px;
            margin-bottom: 10px;
        }

        .repertory-search {
            .label {
                line-height: 35px;
                float: left;
                margin-right: 10px;
            }

            .input-text {
                width: 110px;
                float: left;
                margin-right: 15px;

                .el-input__inner {
                    height: 35px;
                    line-height: 35px;
                }
            }
        }

        .table_height {
            border: $border;
            margin-top: 10px;
            height: calc(100% - 120px);
            position: relative;

            .noData {
                position: absolute;
                width: 100%;
                font-size: 16px;
                color: #999;
                top: 100px;
                text-align: center;
            }
        }
    }

    .switchDiv {
        padding: 2px 8px;
        border: 1px solid $main-color;
        border-radius: 3px;
        color: $main-color;
        display: inline-block;
        margin-left: 10px;
        vertical-align: top;
        cursor: pointer;

        .name {
            vertical-align: middle;
            margin-left: 8px;
        }

        // &:hover{
        //   color: #fff;
        //   background: $main-color;
        // }
    }
}
</style>





