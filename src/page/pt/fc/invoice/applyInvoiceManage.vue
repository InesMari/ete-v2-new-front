<template>
    <div id="applyInvoiceManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="applyInvoiceManageSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>开票申请列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="开票申请列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="toShowVerify3(3)" v-entity="1006071">开票处理</el-button>
                    <el-button type="primary" plain size="mini" @click="toShowVerify(true,4)" v-entity="1006072">修改发票</el-button>
                    <el-button type="primary" plain size="mini" @click="revokeInvoicing" v-entity="1006073">撤销开票</el-button>
                    <el-button type="primary" plain size="mini" @click="toShowVerify2(1)" v-entity="1006074">开票审核</el-button>
                    <el-button type="primary" plain size="mini" @click="cancleApplyInvoice()" v-entity="1006075">撤销申请</el-button>
                    <el-button type="primary" plain size="mini" @click="downloadExcel()" v-entity="1006173">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="applyInvoiceManageTable" ref="table" :head="head" :showNum="true" :showSetTable="true" @dblclickItem="dblclickItem" :singleSelect="false">
              <template v-slot="{item,code}">
              <div v-if="'imgUrl'==code">
                <a href="javascript:void(0);" :class="!item.imgUrl?'disabled':'link'"   class="link" @click.stop="showImg(item)" style="margin: 0 10px;">查看附件</a>
              </div>
              <div v-if="'billNum'==code">
                <a href="javascript:void(0);" class="link" @click.stop="toCustomerConfirmedBillDetail(item)" style="margin: 0 10px;">{{item.billNum}}</a>
              </div>
              </template>
            </tableCommon>
        </div>

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

        <!-- 开票审核 begin-->
        <el-dialog :title="title" :visible.sync="showVerify" width="800px" :close-on-click-modal="false" :close-on-press-escape="false" @close="toShowVerify(false)">
          <div class="fcCommonPage">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                  <li class="item item50">
                    <label class="label-term">账单编号</label>
                    <div class="input-text">
                        <el-input v-model="invoiceInfo.billNum" :disabled="true"></el-input>
                    </div>
                  </li>
                  <li class="item item50">
                    <label class="label-term">客户名称</label>
                    <div class="input-text">
                        <el-input v-model="invoiceInfo.custTenantName" :disabled="true"></el-input>
                    </div>
                  </li>
                </ul>
                <ul class="content clearfix">
                  <li class="item item50">
                    <label class="label-term">账单月份</label>
                    <div class="input-text">
                        <el-input v-model="invoiceInfo.billMonth" :disabled="true"></el-input>
                    </div>
                  </li>
                  <li class="item item50">
                    <label class="label-term">发票状态</label>
                    <div class="input-text">
                        <el-input v-model="invoiceInfo.invoiceStateName" :disabled="true"></el-input>
                    </div>
                  </li>
                </ul>
                <ul class="content clearfix">
                  <li class="item item50">
                    <label class="label-term">购买方名称</label>
                    <div class="input-text">
                       <el-input v-model="invoiceInfo.fcCustTenantName" :disabled="true"></el-input>
                    </div>
                  </li>
                  <li class="item item50">
                    <label class="label-term">纳税人识别号</label>
                    <div class="input-text">
                        <el-input v-model="invoiceInfo.taxNumber" :disabled="true"></el-input>
                    </div>
                  </li>
                </ul>
                <ul class="content clearfix">
                  <li class="item item50">
                    <label class="label-term">公司地址</label>
                    <div class="input-text">
                        <el-input v-model="invoiceInfo.address" :disabled="true"></el-input>
                    </div>
                  </li>
                  <li class="item item50">
                    <label class="label-term">公司电话</label>
                    <div class="input-text">
                        <el-input v-model="invoiceInfo.regPhone" :disabled="true"></el-input>
                    </div>
                  </li>
                </ul>
                <ul class="content clearfix">
                  <li class="item item50">
                    <label class="label-term">开户行</label>
                    <div class="input-text">
                        <el-input v-model="invoiceInfo.regBank" :disabled="true"></el-input>
                    </div>
                  </li>
                  <li class="item item50">
                    <label class="label-term">开户卡号</label>
                    <div class="input-text">
                        <el-input v-model="invoiceInfo.regAccount" :disabled="true"></el-input>
                    </div>
                  </li>
                </ul>
                <ul class="content clearfix">
                  <li class="item item50">
                    <label class="label-term">发票类型</label>
                    <div class="input-text">
                        <el-input v-model="invoiceInfo.invoiceTypeName" :disabled="true"></el-input>
                    </div>
                  </li>
                    <li class="item item50">
                        <label class="label-term">发票税率(%)</label>
                        <div class="input-text">
                            <el-input v-model="invoiceInfo.invoiceTax" :disabled="true"></el-input>
                        </div>
                    </li>
                </ul>
                <ul class="content clearfix">
                  <li class="item item50">
                    <label class="label-term">客户要求票面备注</label>
                    <div class="input-text">
                        <el-input v-model="invoiceInfo.customerRequestRemark" :disabled="true"></el-input>
                    </div>
                  </li>
                    <li class="item item50">
                        <label class="label-term">客户其他要求</label>
                        <div class="input-text">
                            <el-input v-model="invoiceInfo.otherCustomerRequest" :disabled="true"></el-input>
                        </div>
                    </li>
                </ul>
                <ul class="content clearfix">
                    <li class="item item50">
                        <label class="label-term">结算主体</label>
                        <div class="input-text">
                            <el-input v-model="invoiceInfo.invoicingCompanyName" :disabled="true"></el-input>
                        </div>
                    </li>
                  <li class="item item50">
                    <label class="label-term">开票金额(含税)</label>
                    <div class="input-text">
                      <el-input v-model="invoiceInfo.applyInvoiceFee" :disabled="true"></el-input>
                    </div>
                  </li>
                </ul>
                <ul class="content clearfix" v-if="invoiceDeal || upInvoiceDeal || (isLock&&invoiceInfo.invoiceState==1)">
                  <li class="item item50">
                    <label class="label-term"><em>*</em>发票号</label>
                    <div class="input-text">
                        <el-input v-model="invoiceInfo.invoiceNum" type="input" maxlength="200" placeholder="" :disabled="isLock"></el-input>
                    </div>
                  </li>
                  <li class="item item50">
                    <label class="label-term"><em>*</em>开票日期</label>
                    <div class="input-text">
                      <el-date-picker @input="$forceUpdate()" v-model="invoiceInfo.invoiceDate" type="date" :disabled="isLock"
                                      placeholder="选择日期" align="right"  format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                      </el-date-picker>
                    </div>
                  </li>
                </ul>
                <ul class="content clearfix" v-if="invoiceDeal || upInvoiceDeal || (isLock&&invoiceInfo.invoiceState==1)">
                  <li class="item " style="width: 98%;margin-right: 2%;">
                    <label class="label-term">开票备注</label>
                    <div class="input-text">
                        <el-input v-model="invoiceInfo.invoiceRemark" type="textarea" maxlength="200" placeholder="" :disabled="isLock"></el-input>
                    </div>
                  </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" type="danger" @click="verifyInvoice(2)" v-if="verify">审核不通过</el-button>
                    <el-button type="primary" size="mini" @click="verifyInvoice(1)" v-if="verify">审核通过</el-button>
                    <el-button size="mini" @click="toShowVerify(false)" v-if="isLock || invoiceDeal || upInvoiceDeal">关闭</el-button>
                    <el-button type="primary" size="mini" @click="verifySure(1)" v-if="invoiceDeal">确定</el-button>
                    <el-button type="primary" size="mini" @click="verifySure(2)" v-if="upInvoiceDeal">确定修改</el-button>
                </div>
            </div>
          </div>
        </el-dialog>
      <!-- 开票审核 end-->

        <!-- 开票审核 begin-->
        <el-dialog title="开票处理批量操作提示" :visible.sync="showVerifyBatch" width="800px" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="toShowVerifyBatch(false)">
            <div class="fcCommonPage">
                <div class="common-info" style="border:none;padding:0;">
                    <p style="text-align:center;margin: -15px 0 10px;">您正在批量开票处理：{{invoiceInfo.applyInvoiceNums}}等{{invoiceInfo.applyInvoiceNumsize}}条数据</p>
                    <ul class="content clearfix;">
                        <li class="item item50">
                            <label class="label-term"><em>*</em>发票号</label>
                            <div class="input-text">
                                <el-input v-model="invoiceInfo.invoiceNum" type="input" maxlength="200" placeholder="" @input="$forceUpdate();"></el-input>
                            </div>
                        </li>
                        <li class="item item50">
                          <label class="label-term"><em>*</em>开票日期</label>
                          <div class="input-text">
                            <el-date-picker @input="$forceUpdate()" v-model="invoiceInfo.invoiceDate" type="date"
                                            placeholder="选择日期" align="right"  format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                            </el-date-picker>
                          </div>
                        </li>
                    </ul>
                    <ul class="content clearfix">
                        <li class="item" style="width: 98%;margin-right: 2%;">
                            <label class="label-term">开票备注</label>
                            <div class="input-text">
                                <el-input v-model="invoiceInfo.invoiceRemark" type="textarea" maxlength="200" placeholder="" @input="$forceUpdate();" ></el-input>
                            </div>
                        </li>
                    </ul>
                    <div class="page-bot-btn ">
                        <el-button size="mini" @click="toShowVerifyBatch(false)">关闭</el-button>
                        <el-button type="primary" size="mini" @click="verifySureBatch()">确定</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
        <!-- 开票审核 end-->

    </div>
</template>

<script>
    import applyInvoiceManage from './applyInvoiceManage.js'

    export default applyInvoiceManage
</script>
<style lang="scss">
@import '@/page/pt/fc/fc_common.scss';
#applyInvoiceManage {
  .tagList .tag .contet .item .label{
    width: 100px;
  }
}
</style>

