<template>
    <div id="confirmedBill" >

        <searchList :formData="formData" @doQuery="doQuery" @clearFn="initQuery" :query="query" searchKey="confirmedBillSearch"/>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>已审核客户账单列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="已审核客户账单列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="showInvoice(true, true)" v-entity="1006043">开票申请</el-button>
                    <el-button type="primary" plain size="mini" @click="showInvoice(true, false)" v-entity="1006044">账单核销</el-button>
                    <el-button type="danger" plain size="mini" @click="revokeBillConfirm" v-entity="1006045">撤销审核</el-button>
                    <el-button type="primary" plain size="mini" @click="showUpInvoiceDetailDialog(true)" v-entity="1006046">发票申请明细</el-button>
                    <el-button type="primary" plain size="mini" @click="downExcel()" v-entity="1006148">导出Excel</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1006169" @click="exportExcel()">账单Excel导出</el-button>
                </div>
            </div>
            <tableCommon tableName="confirmedBillTable" ref="table" :showNum="true" :showSetTable="true"
                         :singleSelect="true" :head="head" @dblclickItem="toCustomerConfirmedBillDetail">
                <template v-slot:default="{item}">
                    <a href="javascript:void(0);" :class="!item.imgUrl?'disabled':'link'"  @click.stop="showImg(item)" style="margin: 0 10px;">查看附件</a>
                </template>
            </tableCommon>
        </div>

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>


        <el-dialog class="ddddddddddd" :title="'账单【' + billNum + '】' + tip" :visible.sync="invoiceShow" width="80%" :close-on-click-modal="false" :close-on-press-escape="false" >
            <div class="fcCommonPage">
            <div class="common-info " style="padding:0;border:none;" >
                <div class="tagList clearfix">
                    <div class="tag" style="width:50%;">
                        <div class="tip"><span>资料</span></div>
                        <h3 class="title">开票资料</h3>
                        <div class="contet center">
                            <div class="item">
                                <div class="label">发票资质类型：</div>
                                <div class="text fw">{{ custBillInfo.invoiceTypeTenantName}}</div>
                            </div>
                            <div class="item">
                                <div class="label">购买方名称：</div>
                                <div class="text fw">{{custBillInfo.tenantName}}</div>
                            </div>
                            <div class="item">
                                <div class="label">纳税人识别号：</div>
                                <div class="text fw">{{custBillInfo.taxNumber}}</div>
                            </div>
                            <div class="item">
                                <div class="label">注册地址：</div>
                                <div class="text fw">{{custBillInfo.address}}</div>
                            </div>
                            <div class="item">
                                <div class="label">注册电话：</div>
                                <div class="text fw">{{custBillInfo.regPhone}}</div>
                            </div>
                            <div class="item">
                                <div class="label">注册银行：</div>
                                <div class="text fw">{{custBillInfo.regBank}}</div>
                            </div>
                            <div class="item">
                                <div class="label">账号：</div>
                                <div class="text fw">{{custBillInfo.regAccount}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="tag" style="width:50%">
                        <div class="tip"><span>账单</span></div>
                        <h3 class="title">账单金额</h3>
                        <div style="text-align:center;margin-bottom:15px;font-size:14px">账单月份：{{ custBillInfo.billMonth }}</div>
                        <h5 class="cash">￥{{ custBillInfo.totalFee }} 元</h5>
                        <div class="contet center">
                            <div class="item">
                                <div class="label fw">运输金额：</div>
                                <div class="text">￥{{ custBillInfo.waybillFee }}元</div>
                            </div>
                            <div class="item">
                                <div class="label fw">仓储金额：</div>
                                <div class="text">￥{{ custBillInfo.storehouseFee }}元</div>
                            </div>
                            <div class="item">
                                <div class="label fw">器具金额：</div>
                                <div class="text">￥{{ custBillInfo.packLeaseFee }}元</div>
                            </div>
                            <div class="item">
                                <div class="label fw">其他金额：</div>
                                <div class="text">￥{{ custBillInfo.otherFee }}元</div>
                            </div>
                            <div class="item">
                                <div class="label fw">补录金额：</div>
                                <div class="text">￥{{ custBillInfo.makeupFee }}元</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="table_height" v-if="showTable">
                    <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                        <thead >
                            <tr>
                                <th width="60">序号</th>
                                <th width="120">发票税率（%）</th>
                                <th width="150">发票类型</th>
                                <th width="120">可开票金额（含税）</th>
                                <th width="120">申请开票金额</th>
                                <th width="120">开票公司</th>
                                <th width="300">客户要求票面备注</th>
                                <th width="150">客户其他要求</th>
                                <th width="120">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in billInvoiceData" >
                                <td>{{index + 1}}</td>
                                <td>
                                    <div>{{item.invoiceTax}}</div>
                                </td>
                                <td>
                                  <el-select v-model="item.invoiceType" placeholder="请选择发票类型" filterable>
                                    <el-option v-for="item in invoiceTypeData" :key="item.codeName" :label="item.codeName" :value="item.codeName"></el-option>
                                  </el-select>
                                </td>
                                <td>
                                    <div>{{item.applyInvoiceFeeTotal}}</div>
                                </td>
                                <td>
                                    <el-input type="text" v-mydouble4val v-model="item.applyInvoiceFee" @blur="changeApplyInvoiceFee(item, true)"></el-input>
                                </td>
                                <td>
                                    <el-select v-model="item.invoicingCompany" placeholder="开票公司" filterable :disabled="invoicingCompanyDisable">
                                        <el-option v-for="item in invoicingCompanyData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                                    </el-select>
                                </td>
                                <td>
                                    <el-row class="demo-autocomplete">
                                        <el-col>
                                            <el-autocomplete
                                                    class="inline-input"
                                                    v-model="item.customerRequestRemark"
                                                    :fetch-suggestions="querySearch2"
                                                    placeholder="请输入客户要求票面备注"
                                                    @select="handleSelect"
                                            ></el-autocomplete>
                                        </el-col>
                                    </el-row>
                                </td>
                                <td>
                                    <el-input type="text" autocomplete="off" v-model="item.otherCustomerRequest" maxlength="255"></el-input>
                                </td>
                              <td>
                                <el-tooltip effect="dark" content="添加" placement="top-start" :hide-after='1000' v-if="item.baseFlg">
                                  <span @click="add(index,item)" class="add"></span>
                                </el-tooltip>
                                <el-tooltip effect="dark" content="删除作业要求" placement="top-start" :hide-after='1000' v-if="!item.baseFlg">
                                  <span @click="del(index)" class="del"></span>
                                </el-tooltip>
                              </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="table_height" v-if="!showTable">
                    <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                        <thead >
                        <tr>
                            <th width="60">序号</th>
                            <th width="120">发票税率（%）</th>
                            <th width="120">可开票金额（含税）</th>
                            <th width="120">核销金额</th>
                            <th width="300">备注</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item, index) in billInvoiceData" >
                            <td>{{index + 1}}</td>
                            <td>
                                <div>{{item.invoiceTax}}</div>
                            </td>
                            <td>
                                <div>{{item.applyInvoiceFeeTotalSrc}}</div>
                            </td>
                            <td>
                                <el-input type="text" v-mydouble4val v-model="item.writeoffFee" @blur="changeApplyInvoiceFee(item, false)"></el-input>
                            </td>
                            <td>
                                <el-input type="text" v-model="item.remark" maxlength="255"></el-input>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div class="bot-btn" style="margin-top: 20px;">
                    <el-button @click="showInvoice(false)">关闭</el-button>
                    <el-button type="primary" @click="sureSubmit" v-show="showTable">确定申请</el-button>
                    <el-button type="primary" @click="sureWriteoffFee" v-show="!showTable">确定核销</el-button>
                </div>
            </div>
            </div>
        </el-dialog>

        <!-- 发票申请明细 -->
        <el-dialog class="upInvoiceDetail" :title="'账单【' + billNum + '】发票申请明细'" :visible.sync="upInvoiceDetailDialog" width="80%" :close-on-click-modal="false" :close-on-press-escape="false" >
            <div class="table-content">
                <!-- 条件 -->
                <div class="table-title">
                    <div class="searchInfo fl">
                        <label class="label fl">审核状态：</label>
                        <div class="input-text fl">
                            <el-select v-model="queryDetail.verifyState" placeholder="审核状态" @change="loadBillInvoiceDetail" clearable>
                                <el-option v-for="item in verifyStateData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                            </el-select>
                        </div>
                        <el-button class="fl" type="primary" size="mini" @click="loadBillInvoiceDetail">查询</el-button>
                        <em class="fl">注：未审核、不通过的发票申请可以撤销</em>
                    </div>
                    <div class="table-title-btn">
                        <el-button type="primary" plain size="mini" @click="revokeBillApplyInvoice">撤销申请</el-button>
                    </div>
                </div>
                <!-- 表格 -->
                <tableCommon tableName="confirmedBillInvoiceDetailListTable" v-if="upInvoiceDetailDialog" ref="detailTable" :showNum="true" :showSetTable="false"
                            :singleSelect="true" :head="detailHead" >
                </tableCommon>
            </div>
            <div class="bot-btn" style="margin-top: 20px;">
                <el-button @click="showUpInvoiceDetailDialog(false, true)">关闭</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
	import confirmedBill from './confirmedBill.js'
	export default confirmedBill
</script>
<style lang="scss">
@import '@/page/pt/fc/fc_common.scss';
#confirmedBill {
    .el-dialog{
        .table_height{
            overflow:auto;
            min-height:200px;
            max-height:300px;
            border:$border;
            .tableCommon{
                .el-select,.el-input{
                    width: 100%;
                }
            }
        }
    }
    .ddddddddddd{
        .el-autocomplete {
            width: 100%;
        }
        .el-input__inner{
            width: 100%;
        }
    }
    .upInvoiceDetail{
        .el-dialog__body{
            padding-top: 0;
        }
        .table-content{
            border:none;
            .searchInfo{
                line-height: 30px;
              .el-input__inner{
                height: 30px;
                line-height: 30px;
              }
              .el-input__icon{
                line-height: 30px;
              }
                .el-button{
                    margin:0 15px;
                }
            }
        }
    }
    .special
    {
      width: calc(100% - 90px)!important;
    }
    .el-icon-remove-outline{
        color: red;
        font-size: 18px;
    }
    .el-icon-circle-plus-outline{
        color: $main-color;
        font-size: 18px;
    }
    .tagList .tag .contet .item .label{
        width: 120px!important;
    }
    .tagList .tag{
      min-height: 300px;
    }
  .add{
    vertical-align: middle;
    @include add;
  }
  .del{
    vertical-align: middle;
    @include del;
  }
}
</style>
