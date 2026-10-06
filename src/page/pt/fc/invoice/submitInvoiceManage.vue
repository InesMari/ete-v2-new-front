<template>
    <div id="submitInvoiceManage">
      <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="submitInvoiceManageSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>发票提交列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="发票提交列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="toShowVerify(true,1)" v-entity="1006076">发票审核</el-button>
                    <el-button type="primary" plain size="mini" @click="cancleApplyInvoice()" v-entity="1006077">撤销审核</el-button>
                </div>
            </div>
            <tableCommon tableName="submitInvoiceManageTable" ref="table" :head="head" :showNum="true" :showSetTable="true"
                         @dblclickItem="dblclickItem" :singleSelect="false">
              <template v-slot:default="{item}">
                <a href="javascript:void(0);" class="link" @click.stop="toFcSupplierBillDetail(item)" style="margin: 0 10px;">{{item.billNum}}</a>
              </template>
            </tableCommon>
        </div>

        <!-- 查看发票 begin-->
        <div class="imageViewerOut" v-if="showVerify">
          <!-- 查看大图 -->
          <fileViewer ref="viewer" :url-list="srcList"></fileViewer>
          <div class="imageViewerInfo">
            <div class="tipbox" v-if="verify">
              <img class="tip" src="@/static/image/tip.png" alt="">
              <span class="text">请务必核对发票信息</span>
            </div>
            <div class="content">
              <div class="item">
                <div class="label">账单编号：</div>
                <div class="text">{{invoiceInfo.billNum}}</div>
              </div>
              <div class="item">
                <div class="label">发票类型：</div>
                <div class="text">{{invoiceInfo.invoiceType}}</div>
              </div>
              <div class="item">
                <div class="label">发票税率：</div>
                <div class="text">{{invoiceInfo.invoiceTax}}%</div>
              </div>
              <div class="item">
                <div class="label">发票金额（含税）：</div>
                <div class="text">{{invoiceInfo.invoiceFee}}</div>
              </div>
              <div class="item">
                <div class="label">供应商名称：</div>
                <div class="text">{{invoiceInfo.supplierName}}</div>
              </div>
              <div class="item">
                <div class="label">开户名字：</div>
                <div class="text">{{invoiceInfo.receiveUserName}}</div>
              </div>
              <div class="item">
                <div class="label">开户卡号：</div>
                <div class="text">{{invoiceInfo.bankCard}}</div>
              </div>
              <div class="item">
                <div class="label">开户行：</div>
                <div class="text">{{invoiceInfo.bankDepositName}}</div>
              </div>
              <div class="item">
                <div class="label">支行名称：</div>
                <div class="text">{{invoiceInfo.bankSubName}}</div>
              </div>
              <div class="item">
                <div class="label">银行卡类型：</div>
                <div class="text">{{invoiceInfo.bankTypeName}}</div>
              </div>
              <div class="item">
                <div class="label">备注：</div>
                <div class="text">{{invoiceInfo.remark}}</div>
              </div>
              <div class="item">
                <div class="label">提交人：</div>
                <div class="text">{{invoiceInfo.createUserName}}</div>
              </div>
              <div class="item">
                <div class="label">提交时间：</div>
                <div class="text">{{invoiceInfo.createDate}}</div>
              </div>
              <div class="item">
                <div class="label">审核备注：</div>
                <div class="text" v-if="isLock">{{invoiceInfo.verifyRemark}}</div>
                <div class="input-text" v-if="verify">
                  <el-input v-model="invoiceInfo.verifyRemark" type="textarea" maxlength="200" placeholder="" ></el-input>
                </div>
              </div>
            </div>
            <div class="page-bot-btn">
              <el-button size="mini" type="danger" @click="verifyInvoice(2)" v-if="verify">审核不通过</el-button>
              <el-button type="primary" size="mini" @click="verifyInvoice(1)" v-if="verify">审核通过</el-button>
              <el-button type="primary" @click="toShowVerify(false)" v-if="isLock">关闭</el-button>
            </div>
          </div>
        </div>
      <!-- 查看发票 end-->
      <!-- 修改提交发票 begin-->
<!--      <el-dialog :title="uptitle" :visible.sync="upInvoiceDeal" width="1100px" :close-on-click-modal="false"-->
<!--                 :close-on-press-escape="false" @close="toUpApplyInvoice(false)">-->
<!--        <div class="fcCommonPage">-->
<!--          <div class="common-info" style="padding:0;border:none;">-->
<!--            <div class="tagList clearfix">-->
<!--              <div class="tag" style="width:33.3333%">-->
<!--                <div class="tip"><span>资料</span></div>-->
<!--                <h3 class="title">基本信息</h3>-->
<!--                <div class="contet">-->
<!--                  <div class="item">-->
<!--                    <div class="label">供应商名称：</div>-->
<!--                    <div class="text fw">{{supplierBillInfo.supplierName}}</div>-->
<!--                  </div>-->
<!--                  <div class="item">-->
<!--                    <div class="label"><em>*</em>开户名字：</div>-->
<!--                    <el-select v-model="supplierBillInfo.receiveBankId" placeholder="开户名字" @change="selBank" filterable>-->
<!--                      <el-option v-for="j in supplierBankData" :key="j.receiveBankId" :label="j.label" :value="j.receiveBankId"></el-option>-->
<!--                    </el-select>-->
<!--                  </div>-->
<!--                  <div class="item">-->
<!--                    <div class="label">开户卡号：</div>-->
<!--                    <div class="text fw">{{supplierBillInfo.bankCard}}</div>-->
<!--                  </div>-->
<!--                  <div class="item">-->
<!--                    <div class="label">开户行：</div>-->
<!--                    <div class="text fw">{{supplierBillInfo.bankDepositName}}</div>-->
<!--                  </div>-->
<!--                  <div class="item">-->
<!--                    <div class="label">支行名称：</div>-->
<!--                    <div class="text fw">{{supplierBillInfo.bankSubName}}</div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="tag" style="width:33.3333%">-->
<!--                <div class="tip"><span>账单</span></div>-->
<!--                <h3 class="title">账单金额</h3>-->
<!--                <h5 style="text-align: center;font-size: 14px;margin-bottom: 10px;">账单月份：{{ supplierBillInfo.billMonth }} </h5>-->
<!--                <h5 class="cash">￥{{ supplierBillInfo.totalFee }} 元</h5>-->
<!--                <div class="contet center">-->
<!--                  <div class="item">-->
<!--                    <div class="label fw">运输金额：</div>-->
<!--                    <div class="text">￥{{ supplierBillInfo.waybillFee }}元</div>-->
<!--                  </div>-->
<!--                  <div class="item">-->
<!--                    <div class="label fw">仓储金额：</div>-->
<!--                    <div class="text">￥{{ supplierBillInfo.storehouseFee }}元</div>-->
<!--                  </div>-->
<!--                  <div class="item">-->
<!--                    <div class="label fw">其他金额：</div>-->
<!--                    <div class="text">￥{{ supplierBillInfo.otherFee }}元</div>-->
<!--                  </div>-->
<!--                  <div class="item">-->
<!--                    <div class="label fw">补录金额：</div>-->
<!--                    <div class="text">￥{{ supplierBillInfo.makeupFee }}元</div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--              <div class="tag" style="width:33.3333%">-->
<!--                <div class="tip"><span>发票</span></div>-->
<!--                <h3 class="title">未提交发票金额</h3>-->
<!--                <div class="contet center">-->
<!--                  <div class="item">-->
<!--                    <div class="label fw">运输金额：</div>-->
<!--                    <div class="text">￥{{ supplierBillInfo.noWaybillFee }}元</div>-->
<!--                  </div>-->
<!--                  <div class="item">-->
<!--                    <div class="label fw">仓储金额：</div>-->
<!--                    <div class="text">￥{{ supplierBillInfo.noStorehouseFee }}元</div>-->
<!--                  </div>-->
<!--                  <div class="item">-->
<!--                    <div class="label fw">其他金额：</div>-->
<!--                    <div class="text">￥{{ supplierBillInfo.noOtherFee }}元</div>-->
<!--                  </div>-->
<!--                  <div class="item">-->
<!--                    <div class="label fw">补录金额：</div>-->
<!--                    <div class="text">￥{{ supplierBillInfo.noMakeupFee }}元</div>-->
<!--                  </div>-->
<!--                </div>-->
<!--              </div>-->
<!--            </div>-->
<!--            <ul class="content clearfix">-->
<!--              <li class="item item50">-->
<!--                <label class="label-term">发票提交编号</label>-->
<!--                <div class="input-text">-->
<!--                  <el-input v-model="supplierBillInfo.submitInvoiceNum" :disabled="true"></el-input>-->
<!--                </div>-->
<!--              </li>-->
<!--              <li class="item item50">-->
<!--                <label class="label-term">发票号码</label>-->
<!--                <div class="input-text">-->
<!--                  <el-input v-model="supplierBillInfo.invoiceNum"></el-input>-->
<!--                </div>-->
<!--              </li>-->
<!--            </ul>-->
<!--            <ul class="content clearfix">-->
<!--              <li class="item item50">-->
<!--                <label class="label-term">开票金额类型</label>-->
<!--                <div class="input-text">-->
<!--                  <el-select v-model="supplierBillInfo.applyInvoiceType" placeholder="" @change="changeApplyInvoiceType">-->
<!--                    <el-option v-for="item in applyInvoiceTypeData" :key="item.codeValue" :label="item.codeName"-->
<!--                               :value="item.codeValue"></el-option>-->
<!--                  </el-select>-->
<!--                </div>-->
<!--              </li>-->
<!--              <li class="item item50">-->
<!--                <label class="label-term">发票类型</label>-->
<!--                <div class="input-text">-->
<!--                  <el-select v-model="supplierBillInfo.invoiceType" placeholder="" >-->
<!--                    <el-option v-for="item in invoiceTypeData" :key="item.codeValue" :label="item.codeName"-->
<!--                               :value="item.codeValue"></el-option>-->
<!--                  </el-select>-->
<!--                </div>-->
<!--              </li>-->
<!--            </ul>-->
<!--            <ul class="content clearfix">-->
<!--              <li class="item item50">-->
<!--                <label class="label-term">发票税率(%)</label>-->
<!--                <div class="input-text">-->
<!--                  <el-input v-model="supplierBillInfo.invoiceTax"></el-input>-->
<!--                </div>-->
<!--              </li>-->
<!--              <li class="item item50">-->
<!--                <label class="label-term">开票金额(含税)</label>-->
<!--                <div class="input-text">-->
<!--                  <el-input v-model="supplierBillInfo.invoiceFee" @input="changeApplyInvoiceType"></el-input>-->
<!--                </div>-->
<!--              </li>-->
<!--            </ul>-->
<!--            <ul class="content clearfix">-->
<!--              <li class="item" style="width: 98%;">-->
<!--                <label class="label-term">发票备注</label>-->
<!--                <div class="input-text">-->
<!--                  <el-input type="textarea" v-model="supplierBillInfo.remark"></el-input>-->
<!--                </div>-->
<!--              </li>-->
<!--            </ul>-->
<!--            <ul class="content clearfix">-->
<!--              <li class="item img-upload">-->
<!--                <label class="label-term"><em>*</em>发票图片</label>-->
<!--                <div class="input-text">-->
<!--                  <myFileModel ref="invoiceFile"></myFileModel>-->
<!--                </div>-->
<!--              </li>-->
<!--            </ul>-->
<!--            <div class="bot-btn" style="margin-top: 20px;">-->
<!--              <el-button @click="toUpApplyInvoice(false)">关闭</el-button>-->
<!--              <el-button type="primary" @click="saveUpApplyInvoice">确定修改</el-button>-->
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
<!--      </el-dialog>-->
      <!-- 修改提交发票 end-->
    </div>
</template>

<script>
    import submitInvoiceManage from './submitInvoiceManage.js'

    export default submitInvoiceManage
</script>
<style lang="scss">
@import '@/page/pt/fc/fc_common.scss';
#submitInvoiceManage {
  .tagList .tag .contet .item .label{
    width: 100px;
  }
  .imageViewerOut{
    .imageViewerInfo{
      .content{
        .item{
          .label{
            width: 140px;
          }
        }
      }
    }
  }
}
</style>

