<template>
  <div id="payAdvanceManage">
    <div class="search-list clearfix">
      <div class="search-form clearfix" @keyup.enter="doQuery()">
        <div class="item">
          <label class="label">供应商名称：</label>
          <div class="input-text">
            <el-select v-model="loadParam.tenantId" placeholder="请选择供应商名称" clearable filterable @change="doQuery">
              <el-option v-for="item in supplierData" :key="item.tenantId" :label="item.supplierName" :value="item.tenantId"></el-option>
            </el-select>
<!--            <el-input v-model="loadParam.supplierName" placeholder="供应商名称" type="text"-->
<!--                      autocomplete="new-password"></el-input>-->
          </div>
        </div>
        <div class="item">
          <label class="label">付款日期：</label>
          <div class="input-text">
            <el-date-picker v-model="loadParam.daterange" type="daterange" range-separator="至" start-placeholder="开始日期"
                            end-placeholder="结束日期" value-format="yyyy-MM-dd" unlink-panel></el-date-picker>
          </div>
        </div>
        <div class="item">
          <label class="label">预付状态：</label>
          <div class="input-text">
            <el-select v-model="loadParam.advanceState" placeholder="预付状态" clearable>
              <el-option v-for="item in advanceStateData" :key="item.codeValue" :label="item.codeName"
                         :value="item.codeValue"></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="search-btn clearfix">
        <div class="btn">
          <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询</el-button>
        </div>
        <div class="btn">
          <el-button type="danger" plain size="mini" icon="el-icon-close" @click="clear()">清空</el-button>
        </div>
      </div>
      <!-- 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 -->
      <div class="search-bot">
        <img src="@/static/image/search-bot.png" alt="">
        <i class="icon el-icon-arrow-down"></i>
        <i class="icon el-icon-arrow-up"></i>
      </div>
    </div>
    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>预付列表</span>
          <el-tooltip effect="light" content="预付列表" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" @click="toAddVerification(true)"  v-entity="1006095">预付核销</el-button>
          <el-button type="primary" plain size="mini" @click="toShowVerificationDetail(true)" v-entity="1006096">核销明细</el-button>
          <el-button type="primary" plain size="mini" @click="toAddPay(true)" v-entity="1006097">新增预付</el-button>
          <el-button type="primary" plain size="mini" @click="toUpPay()" v-entity="1006098">修改预付</el-button>
          <el-button type="danger" plain size="mini" @click="delPayInfo()" v-entity="1006099">删除预付</el-button>
        </div>
      </div>
      <tableCommon tableName="payAdvanceTable" ref="table" :head="head" :showNum="true"
                   :showSetTable="true" :singleSelect="true"></tableCommon>
    </div>
    <!-- 新增 预付 -->
    <el-dialog :title="title" :visible.sync="showPay" width="520px" :close-on-click-modal="false" :close-on-press-escape="false" @close="toAddPay(false)">
      <div class="common-info" style="border:none;padding:0;">
        <ul class="content clearfix">
          <li class="item item100">
            <label class="label-term"><em>*</em>供应商名称</label>
            <div class="input-text">
              <el-select v-model="pay.tenantId" placeholder="请选择供应商名称" clearable filterable>
                <el-option v-for="item in supplierData" :key="item.tenantId" :label="item.supplierName" :value="item.tenantId"></el-option>
              </el-select>
            </div>
          </li>
          <li class="item item100">
            <label class="label-term"><em>*</em>预付原因</label>
            <div class="input-text">
              <el-input v-model="pay.advanceCause" maxlength="255" placeholder="请输入预付原因" ></el-input>
            </div>
          </li>
          <li class="item item100">
            <label class="label-term"><em>*</em>付款金额</label>
            <div class="input-text">
              <el-input v-model="pay.advanceFee" v-mydouble4val placeholder="请输入付款金额" ></el-input>
            </div>
          </li>
          <li class="item item100">
            <label class="label-term"><em>*</em>付款日期</label>
            <div class="input-text">
              <el-date-picker v-model="pay.advanceDate" type="date" placeholder="请选择付款日期"
                              value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
            </div>
          </li>
        </ul>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="toAddPay(false)">取消</el-button>
          <el-button type="primary" size="mini" @click="savePayInfo()">确定</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 预付核销 -->
    <el-dialog title="预付核销" :visible.sync="showVerification" width="550px" :close-on-click-modal="false" :close-on-press-escape="false" @close="toAddVerification(false)">
      <div class="common-info" style="border:none;padding:0;">
        <ul class="content clearfix">
          <li class="item item50">
            <label class="label-term">供应商名称</label>
            <div class="input-text">
              <el-input v-model="pay.tenantName" placeholder="" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">预付原因</label>
            <div class="input-text">
              <el-input v-model="pay.advanceCause" maxlength="255" placeholder="" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">付款金额</label>
            <div class="input-text">
              <el-input v-model="pay.advanceFee" v-mydouble4val placeholder="" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">付款日期</label>
            <div class="input-text">
              <el-input v-model="pay.advanceDate" placeholder="" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">已收票金额</label>
            <div class="input-text">
              <el-input v-model="pay.isVerificationFee" v-mydouble4val placeholder="" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">未收票金额</label>
            <div class="input-text">
              <el-input v-model="pay.noVerificationFee" v-mydouble4val placeholder="" :disabled="true"></el-input>
            </div>
          </li>
        </ul>
        <ul class="content clearfix" style="border-top: 1px solid #efefef;padding-top: 20px;margin-top: 15px;">
          <li class="item item50">
            <label class="label-term">发票提交编号</label>
            <div class="input-text">
              <el-select v-model="invoice.invoiceId" placeholder="请选择供应商发票提交编号" clearable filterable @change="changeInvoice">
                <el-option v-for="item in supplierInvoiceData" :key="item.invoiceId" :label="item.invoiceNum" :value="item.invoiceId"></el-option>
              </el-select>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">发票未付金额</label>
            <div class="input-text">
              <el-input v-model="invoice.noPayFee" v-mydouble4val placeholder="" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item item50" style="float: initial;margin: 0 auto;">
            <label class="label-term">本次核销金额</label>
            <div class="input-text">
              <el-input v-model="verificationFee" v-mydouble4val placeholder="请输入本次核销金额" ></el-input>
            </div>
          </li>
        </ul>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="toAddVerification(false)">取消</el-button>
          <el-button type="primary" size="mini" @click="saveVerification()">确定</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 核销明细 -->
    <el-dialog title="核销明细" :visible.sync="showVerificationDetail" width="50%"
               :close-on-click-modal="false" :close-on-press-escape="false" @close="toShowVerificationDetail(false)">
      <div class="table-content common-info" style="border: none;padding: 0;">
        <h3 style="margin-bottom: 10px;margin-top: -30px;">
        </h3>
        <ul class="content clearfix">
          <li class="item item50">
            <label class="label-term">供应商名称</label>
            <div class="input-text">
              <el-input v-model="pay.tenantName" placeholder="" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">预付原因</label>
            <div class="input-text">
              <el-input v-model="pay.advanceCause" maxlength="255" placeholder="" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">付款金额</label>
            <div class="input-text">
              <el-input v-model="pay.advanceFee" v-mydouble4val placeholder="" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">付款日期</label>
            <div class="input-text">
              <el-input v-model="pay.advanceDate" placeholder="" :disabled="true"></el-input>
            </div>
          </li>
        </ul>
        <!-- 表格 -->
        <scrollTable tableName="payAdvanceDetailTable" v-if="showVerificationDetail" ref="detailTable" :doSum="true"
                     :showSetTable="false" :singleSelect="true" :head="detailHead">
        </scrollTable>
      </div>
      <div class="bot-btn" style="margin-top: 20px;">
        <el-button  @click="toShowVerificationDetail(false)">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import payAdvanceManage from './payAdvanceManage.js'

export default payAdvanceManage
</script>
<style lang="scss">
@import '@/page/pt/fc/fc_common.scss';

#expenditureRegisterManage {
  .tagList .tag .contet .item .label {
    width: 100px;
  }
}
</style>

