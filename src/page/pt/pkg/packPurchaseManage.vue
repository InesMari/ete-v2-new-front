<template>
    <div id="packPurchaseManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="packPurchaseManageSearch"></searchList>
        <!-- 列表相关  开始 -->
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>采购单列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="采购单列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain @click="showPurchase(true, 1)" size="mini" v-entity="1004006">新增采购单
                    </el-button>
                    <el-button type="primary" plain @click="showPurchase(true, 2)" size="mini" v-entity="1004007">修改采购单
                    </el-button>
                    <el-button type="danger" plain @click="deletePurchase" size="mini" v-entity="1004008">删除采购单
                    </el-button>
                    <el-button type="primary" plain @click="showUpload(true)" size="mini" v-entity="1004009">确认收货</el-button>

                    <el-button type="primary" plain @click="showBeginCalculateFeeDialog(true)" size="mini" v-entity="1004025">开始计费</el-button>
                </div>
            </div>
            <tableCommon tableName="packPurchaseManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :singleSelect="true" @dblclickItem="dblclickItem">
            </tableCommon>
        </div>
        <!-- 列表相关  结束 -->
        <!-- 采购单 开始-->
        <el-dialog class="packPurchaseDialog" :title="title" :visible.sync="purchaseShow" width="70%"
                   :close-on-click-modal="false" :close-on-press-escape="false">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item50">
                        <label class="label-term"><em>*</em>供应商</label>
                        <div class="input-text">
                            <el-select v-model="purchase.suppierTenantId" filterable clearable :disabled="isOnlySee" placeholder="供应商">
                                <el-option v-for="supplier in supplierData" :key="supplier.tenantId" :label="supplier.supplierName"
                                           :value="supplier.tenantId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>客户</label>
                        <div class="input-text">
                            <el-select v-model="purchase.tenantId" @click.native="selectCustomerTip" @change="changeCustomer" :disabled="isOnlySee" filterable clearable placeholder="客户">
                                <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name"
                                           :value="item.tenantId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>包装名称</label>
                        <div class="input-text">
                            <el-select v-model="purchase.packId" @click.native="selectPackTip" clearable filterable :disabled="isOnlySee" placeholder="包装名称">
                                <el-option v-for="item in tenantPackNameData" :key="item.packId" :label="item.packName"
                                           :value="item.packId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>采购数量</label>
                        <div class="input-text">
                            <el-input v-mynumval v-model="purchase.purchaseNums" @input="calcFee(1)" maxlength="20" placeholder="采购数量"
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>含税单价</label>
                        <div class="input-text">
                            <el-input v-mydoubleval v-model="purchase.price" @input="calcFee(2)" maxlength="20" placeholder="含税单价"
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>税点(%)</label>
                        <div class="input-text">
                            <el-input v-mydoubleval v-model="purchase.taxRate" @input="calcFee(3)" maxlength="10" placeholder="税点"
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>含税价</label>
                        <div class="input-text">
                            <el-input v-model="purchase.totalFeeWithTax" placeholder="含税价"
                                      :disabled="true"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>不含税价</label>
                        <div class="input-text">
                            <el-input v-model="purchase.totalFee" placeholder="不含税价"
                                      :disabled="true"></el-input>
                        </div>
                    </li>
                </ul>
                <div class="table" ref="listTable" style="padding-top: 20px;margin-top: 20px; border-top: 1px dashed #4a5f6d;">
                    <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                        <thead>
                        <tr>
                            <th>交付地</th>
                            <th>配送数量</th>
                            <th>要求交货日期</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(data,index) in tableData" :key="index">
                            <td>
                                <el-select v-model="data.workId" @change="initWorkDisabled" :disabled="isOnlySee" filterable clearable placeholder="请选择交付地">
                                    <el-option v-for="item in workData" :key="item.workId" :label="item.workName"
                                               :value="item.workId" :disabled="item.disabled">
                                    </el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-input v-mynumval @input="forceUpdate" v-model="data.deliverNums" :disabled="isOnlySee" placeholder="输入整数的配送数量"></el-input>
                            </td>
                            <td>
                                <el-date-picker v-model="data.requireDeliverDate" type="date" placeholder="选择日期"
                                                :disabled="isOnlySee" value-format="yyyy-MM-dd"></el-date-picker>
                            </td>
                            <td v-show="!isOnlySee">
                                <i class="el-icon-circle-plus-outline" style="margin-right:5px;" @click="addData()"></i>
                                <i class="el-icon-remove-outline icon icon" @click="removeData(index)" v-show="index !== 0 && index === tableData.length - 1"></i>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div class="page-bot-btn ">
                    <el-button size="mini" @click="showPurchase(false)">关闭</el-button>
                    <el-button type="primary" v-show="showAddButton" size="mini" @click="sureAddPurchase()">确认新增</el-button>
                    <el-button type="primary" v-show="showUpdateButton" size="mini" @click="sureUpdatePurchase()">确认修改</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 采购单 结束-->

        <!-- 确认收货 开始-->
        <el-dialog class="sureReceivedDialog" title="确认收货" :visible.sync="showUploadPage" :close-on-click-modal="false" :close-on-press-escape="false"
                   width="700px" @close="showUpload(false)">
            <div class="common-info" style="border:none;padding:0;">
                <em style="font-size:18px;padding-left:22px;">注：确定收货之后会更新包装库存,右边按钮可切换确认收货方式</em>
                <img class="switch rotate" src="@/static/image/switch.png" alt="" @click="doSwitch">

                <div class="table" ref="listTable" style="margin-top: 20px; " v-show="!sureReceivedWay">
                    <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                        <thead>
                        <tr>
                            <th>交付地</th>
                            <th>起始编码</th>
                            <th>结束编码</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(data,index) in sureReceivedTableData" :key="index">
                            <td>
                                <el-select v-model="data.workId" @change="initSureReceivedWorkDisabled" filterable clearable placeholder="请选择交付地">
                                    <el-option v-for="item in sureReceivedWorkData" :key="item.workId" :label="item.workName" :value="item.workId" ></el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-input v-model="data.begin" placeholder="输入E开头的12位开始编码"></el-input>
                            </td>
                            <td>
                                <el-input v-model="data.end" placeholder="输入E开头的12位结束编码"></el-input>
                            </td>
                            <td>
                                <i class="el-icon-circle-plus-outline" style="margin-right:5px;" @click="addSureReceivedData()"></i>
                                <i class="el-icon-remove-outline icon icon" @click="removeSureReceivedData(index)" v-show="index !== 0 && index === sureReceivedTableData.length - 1"></i>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <ul class="content clearfix" style="margin-top:10px;" v-show="sureReceivedWay">
                    <li class="item item100">
                        <label class="label-term2"><em>*</em>请上传采购单:
                            <em style="font-size:14px;">{{uploadParam.purchaseOrderNum}}</em>的
                            <em style="font-size:14px;">{{uploadParam.purchaseNums - uploadParam.hasPurchaseNums}}</em>个包装的编码</label>
                    </li>
                    <li class="item item100" style="width: 360px;margin: 0 auto;float: inherit">
                        <my-import ref="myImport" :handle-success="sureReceivedSuccess" :noneDialog="true" template="/download/sureReceived.xlsx" title="确认收货"
                                  tip="仅允许导入“xls”或“xlsx”格式文件！" bean="purchaseTF" method="sureReceived" :param="uploadParam"></my-import>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="showUpload(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="sureReceived()">确认收货</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 确认收货 结束-->

        <!-- 开始计费 开始-->
        <el-dialog class="sureBeginCalculateFeeDialog" title="确认开始计费" :visible.sync="showBeginCalculateFee" :close-on-click-modal="false" :close-on-press-escape="false"
                   width="30%" @close="showBeginCalculateFeeDialog(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix" style="margin-top:10px;">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>开始计费日期</label>
                        <div class="input-text">
                            <el-date-picker v-model="calculateFeeParam.changeDate" type="date" placeholder="开始计费日期"
                                            value-format="yyyy-MM-dd"></el-date-picker>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="showBeginCalculateFeeDialog(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="beginCalculateFee()">确认</el-button>
                </div>
            </div>
        </el-dialog>

        <!-- 开始计费 结束-->


    </div>
</template>

<script>
import packPurchaseManage from './packPurchaseManage.js'

export default packPurchaseManage
</script>
<style lang="scss">
#packPurchaseManage {
    .packPurchaseDialog {
        .el-select,.el-input{
            width: 100%;
        }
        .el-icon-remove-outline {
            color: red;
            font-size: 18px;
        }

        .el-icon-circle-plus-outline {
            color: $main-color;
            font-size: 18px;
        }
    }
    .sureReceivedDialog{
        .el-dialog__body {
            padding: 20px 20px 30px !important;
        }
        .el-select,.el-input{
            width: 100%;
        }
        .el-icon-remove-outline {
            color: red;
            font-size: 18px;
        }

        .el-icon-circle-plus-outline {
            color: $main-color;
            font-size: 18px;
        }
        .common-info .content > .item {
            .el-input__inner {
                width: 78%;
            }
            .label-term {
                width: 100px;
            }
            .label-term2 {
                width: 100%;
                height: 40px;
                padding-left: 23px;
            }
            .input-text {
                width: calc(100% - 110px);
            }
        }
        .common-info .rotate{
            -ms-transform:rotate(90deg); /* IE 9 */
            -moz-transform:rotate(90deg); /* Firefox */
            -webkit-transform:rotate(90deg); /* Safari and Chrome */
            -o-transform:rotate(90deg); /* Opera */
            float: right;
            height: 30px;
        }
    }
    .sureBeginCalculateFeeDialog{
        .el-dialog__body {
            padding: 20px 20px 30px !important;
        }
        .common-info .content > .item {
            .el-input__inner {
                width: 78%;
            }
            .label-term {
                width: 100px;
            }
            .label-term2 {
                width: 100%;
                height: 40px;
                padding-left: 23px;
            }
            .input-text {
                width: calc(100% - 110px);
            }
        }
    }
}
.el-date-picker.has-sidebar.has-time {
    z-index: 3000 !important;
}
</style>
