<template>
    <div id="collectionRegistration" class="orderManagePage ">
      <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="collectionRegistrationSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>收款登记列表</span>
                    <el-tooltip effect="light" content="收款登记列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain @click="showReceive(true)" size="mini" v-entity="1006081">收款登记</el-button>
                    <el-button type="primary" plain @click="showReceiveRecord" size="mini" v-entity="1006082">收款记录</el-button>
                    <el-button type="primary" plain @click="showUpdateDate(true)" size="mini" v-entity="1006266">修改预计收款日期</el-button>
                    <el-button type="primary" plain  @click="download()" size="mini" v-entity="1006145">导出Excel</el-button>
                </div>
            </div>
            <tableCommon tableName="collectionRegistrationManageTable" ref="table" :showNum="true" :singleSelect="false" :showSetTable="true" :head="head">
              <template v-slot:default="{item, code}">
                <span v-if="code=='isOverdueName'" :style="item.isOverdue>0?'color:red!important':''">{{ item.isOverdueName }}</span>
                <span v-if="code=='noReceiveFee'" :style="item.noReceiveFee>0?'color:red!important':''">{{ item.noReceiveFee }}</span>
              </template>
            </tableCommon>
        </div>


      <!-- 批量收款登记 begin-->
      <el-dialog title="批量收款登记" :visible.sync="receiveShowBatch" width="500px" :close-on-click-modal="false"
                 :close-on-press-escape="false" @close="showReceiveBatch(false)">
        <div class="fcCommonPage">
          <div class="common-info" style="border:none;padding:0;">
            <p style="text-align:center;margin: -15px 0 10px;">您正在批量收款登记处理：{{info.applyInvoiceNums}}共{{info.noReceiveFee}}元</p>
            <ul class="content clearfix">
              <li class="item item100">
                <label class="label-term"><em>*</em>实际收款日期</label>
                <div class="input-text">
                  <el-date-picker v-model="info.actualReceiveDate" type="date" placeholder="实际收款日期"  format="yyyy-MM-dd" value-format="yyyy-MM-dd" @blur="$forceUpdate();"></el-date-picker>
                </div>
              </li>
            </ul>
            <ul class="content clearfix">
              <li class="item item100">
                <label class="label-term">收款备注</label>
                <div class="input-text">
                  <el-input v-model="info.remark" type="textarea" maxlength="200" placeholder="" @input="$forceUpdate();" ></el-input>
                </div>
              </li>
            </ul>
            <div class="page-bot-btn ">
              <el-button size="mini" @click="showReceiveBatch(false)">关闭</el-button>
              <el-button type="primary" size="mini" @click="sureReceiveBatch()">确定</el-button>
            </div>
          </div>
        </div>
      </el-dialog>
      <!-- 批量收款登记 end-->

        <!--   收款登记-开始   -->
        <el-dialog :title="'发票申请编号【' + bill.applyInvoiceNum + '】收款登记'" :visible.sync="receiveShow" width="60%" :close-on-click-modal="false" :close-on-press-escape="false" >
            <div class="fcCommonPage">
            <div class="common-info" style="border:none;padding:0;">
              <ul class="content clearfix">
                <li class="item item50">
                  <label class="label-term">账单编号</label>
                  <div class="input-text">
                    <el-input v-model="bill.billNum" :disabled="true"></el-input>
                  </div>
                </li>
                <li class="item item50">
                  <label class="label-term">客户名称</label>
                  <div class="input-text">
                    <el-input v-model="bill.tenantName" :disabled="true"></el-input>
                  </div>
                </li>
              </ul>
              <ul class="content clearfix">
                <li class="item item50">
                  <label class="label-term">账单月份</label>
                  <div class="input-text">
                    <el-input v-model="bill.billMonth" :disabled="true"></el-input>
                  </div>
                </li>
                <li class="item item50">
                  <label class="label-term">购买方名称</label>
                  <div class="input-text">
                    <el-input v-model="bill.fcCustTenantName" :disabled="true"></el-input>
                  </div>
                </li>
              </ul>
              <ul class="content clearfix">
                <li class="item item50">
                  <label class="label-term">发票类型</label>
                  <div class="input-text">
                    <el-input v-model="bill.invoiceTypeName" :disabled="true"></el-input>
                  </div>
                </li>
                <li class="item item50">
                  <label class="label-term">发票税率(%)</label>
                  <div class="input-text">
                    <el-input v-model="bill.invoiceTax" :disabled="true"></el-input>
                  </div>
                </li>
              </ul>
              <ul class="content clearfix">
                <li class="item item50">
                  <label class="label-term">结算主体</label>
                  <div class="input-text">
                    <el-input v-model="bill.invoicingCompanyName" :disabled="true"></el-input>
                  </div>
                </li>
                <li class="item item50">
                  <label class="label-term">开票金额(含税)</label>
                  <div class="input-text">
                    <el-input v-model="bill.applyInvoiceFee" :disabled="true"></el-input>
                  </div>
                </li>
              </ul>
              <ul class="content clearfix">
                <li class="item item50">
                  <label class="label-term">发票号</label>
                  <div class="input-text">
                    <el-input v-model="bill.invoiceNum" :disabled="true"></el-input>
                  </div>
                </li>
                <li class="item item50">
                  <label class="label-term">开票日期</label>
                  <div class="input-text">
                    <el-date-picker v-model="bill.invoiceDate" type="date" :disabled="true" align="right"  format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                    </el-date-picker>
                  </div>
                </li>
              </ul>
              <ul class="content clearfix">
                <li class="item item50">
                  <label class="label-term">已收金额</label>
                  <div class="input-text">
                    <el-input v-model="bill.receivedFee" :disabled="true"></el-input>
                  </div>
                </li>
                <li class="item item50">
                  <label class="label-term">未收金额</label>
                  <div class="input-text">
                    <el-input v-model="bill.noReceiveFee" :disabled="true"></el-input>
                  </div>
                </li>
              </ul>
              <ul class="content clearfix;">
                <li class="item item50">
                  <label class="label-term">收款金额</label>
                  <div class="input-text">
                    <el-input v-model="bill.receivedAmount" v-mydoubleval @input="$forceUpdate();"></el-input>
                  </div>
                </li>
                <li class="item item50">
                  <label class="label-term"><em>*</em>实际收款日期</label>
                  <div class="input-text">
                    <el-date-picker v-model="bill.actualReceiveDate" type="date" placeholder="实际收款日期" format="yyyy-MM-dd"  value-format="yyyy-MM-dd" @blur="$forceUpdate();"></el-date-picker>
                  </div>
                </li>
              </ul>
              <ul class="content clearfix">
                <li class="item" style="width: 98%;right: 2%;">
                  <label class="label-term">收款备注</label>
                  <div class="input-text">
                    <el-input v-model="bill.remark" type="textarea" maxlength="200" placeholder="" @input="$forceUpdate();" ></el-input>
                  </div>
                </li>
              </ul>
              <div class="page-bot-btn ">
                <el-button @click="showReceive(false)">关闭</el-button>
                <el-button type="primary" @click="sureReceive">确认提交</el-button>
              </div>
            </div>
          </div>
        </el-dialog>

        <!--   列表  开始-->
        <el-dialog title="收款记录" :visible.sync="receiveRecord" width="80%" :close-on-click-modal="false" :close-on-press-escape="false" >
            <h3 style="margin-bottom: 10px;margin-top: -20px;">
                <span style="color: red;font-size: 18px;">发票号码: {{bill.invoiceNum}} 账单月份: {{bill.billMonth}} 客户名称: {{bill.tenantName}}</span>
            </h3>

            <tableCommon tableName="receiveRecordTable" v-if="receiveRecord" ref="receiveRecordTable" :showNum="true"
                         :showSetTable="false" :singleSelect="true" :head="receiveRecordHead">
                <template v-slot:default="{item}">
                    <el-button type="primary" size="mini" @click="cancelReceiveFee(item)">撤销收款</el-button>
                </template>
            </tableCommon>
            <div class="bot-btn" style="margin-top: 20px;">
                <el-button @click="showReceiveRecord(false)">关闭</el-button>
            </div>
        </el-dialog>
        <!--  列表  结束-->

        <el-dialog title="修改预计收款日期" :visible.sync="updateDateShow" width="500px" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="showUpdateDate(false)">
            <div class="fcCommonPage">
                <div class="common-info" style="border:none;padding:0;">
                    <ul class="content clearfix">
                        <li class="item item100">
                            <label class="label-term">账单编号</label>
                            <div class="input-text">
                                <el-input v-model="bill.billNum" disabled></el-input>
                            </div>
                        </li>
                        <li class="item item100">
                            <label class="label-term">发票金额</label>
                            <div class="input-text">
                                <el-input v-model="bill.applyInvoiceFee" disabled></el-input>
                            </div>
                        </li>
                        <li class="item item100">
                            <label class="label-term"><em>*</em>预计收款日期</label>
                            <div class="input-text">
                                <el-date-picker v-model="bill.lastReceiveDate" type="date" placeholder="预计收款日期"  format="yyyy-MM-dd" value-format="yyyy-MM-dd" @blur="$forceUpdate();"></el-date-picker>
                            </div>
                        </li>
                    </ul>
                    <div class="page-bot-btn ">
                        <el-button size="mini" @click="showUpdateDate(false)">关闭</el-button>
                        <el-button type="primary" size="mini" @click="updateLastReceiveDate()">确定</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
	import collectionRegistration from './collectionRegistration.js'
	export default collectionRegistration
</script>
<style lang="scss">
  @import '@/page/pt/fc/fc_common.scss';

  #collectionRegistration {
    .tagList .tag .contet .item .label {
      width: 80px;
    }
    .fcCommonPage .tagList {
      background: #fff;
      border: 1px solid #e8e8e8;
    }
    .table-content{
      height: calc(100% - 57px)!important;
    }
  }
</style>





