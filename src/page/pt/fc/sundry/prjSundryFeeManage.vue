<template>
  <div id="prjSundryFeelManage">
    <innerTab :tabs="tabs" v-show="this.$route.query.t == 1 && this.$route.query.showTabs != 1" @selectCallback="selectCallback"></innerTab>
    <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="prjSundryFeelManageSearch"></searchList>

    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>项目费用列表</span>
          <el-tooltip effect="light" content="此费用在订单和派车单没有唯一关系才在这里新增！" placement="right">
              <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" v-show="this.$route.query.t == 1" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" @click="displayDialog(1)" v-entity="1006130">新增成本</el-button>
          <el-button type="primary" plain size="mini" @click="displayDialog(2)" v-entity="1006131">修改成本</el-button>
          <el-button type="primary" plain size="mini" @click="toPaymentRegist" v-show="!isCompany" v-entity="1006132">付款登记</el-button>
          <el-button type="primary" plain size="mini" @click="toPaymentRegist('rev')" v-show="!isCompany" v-entity="1006133">付款登记撤销</el-button>
          <el-button type="danger" plain size="mini" @click="updateStateToInvalid(0)" v-entity="1006134">删除成本</el-button>
          <el-button type="primary" plain size="mini" @click="download()" v-entity="1006135">导出Excel</el-button>
        </div>
        <div class="table-title-btn" v-show="this.$route.query.t == 2" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" @click="displayDialog(1)" v-entity="1006127">新增收入</el-button>
          <el-button type="primary" plain size="mini" @click="displayDialog(2)" v-entity="1006128">修改收入</el-button>
          <el-button type="danger" plain size="mini" @click="updateStateToInvalid(0)" v-entity="1006129">删除收入</el-button>
          <el-button type="primary" plain size="mini" @click="download()" v-entity="1006151">导出Excel</el-button>
        </div>
      </div>
      <tableCommon :tableName="'storeHouseBillManageTable' + this.$route.query.t + pageType" ref="table" :showNum="true"
                   :showSetTable="true" :head="head" :singleSelect="true" @dblclickItem="dblclickItem">
        <template v-slot="{item,code}">
          <div v-if="code=='fcBillNum'">
            <a href="javascript:void(0);" class="link" @click.stop="toBillDetail(item)">{{item[code]}}</a>
          </div>
        </template>
      </tableCommon>
    </div>

    <!--    新增修改成本/收入     -->
    <el-dialog :title="dialogTitle" :visible.sync="showDialog" :close-on-click-modal="false" :close-on-press-escape="false" width="650px" @close="closeDialog()">
      <div class="common-info" style="border:none;padding:0;">
        <ul class="content clearfix">
          <li class="item" style="width:496px;">
            <label class="label-term"><em>*</em>客户</label>
            <div class="input-text">
              <el-select v-model="bizData.custId" placeholder="请选择" :disabled="detailDisableSwitch" filterable clearable>
                <el-option v-for="item in hzTenantOptions" :key="item.custId" :label="item.name" :value="item.custId" >
                </el-option>
              </el-select>
            </div>
          </li>
        </ul>
        <ul class="content clearfix" v-show="billType == 1">
          <li class="item" style="width:496px;">
            <label class="label-term"><em>*</em>供应商</label>
            <div class="input-text">
              <el-select v-model="supplierTenantId" placeholder="请选择" @change="changeSupplier" :disabled="detailDisableSwitch" filterable clearable>
                <el-option v-for="supplier in supplierData" :key="supplier.tenantId" :label="supplier.supplierName"
                           :value="supplier.tenantId"></el-option>
              </el-select>
            </div>
          </li>
        </ul>

        <ul class="content clearfix">
          <li class="item">
            <label class="label-term"><em>*</em>费用月份</label>
            <div class="input-text">
              <el-date-picker v-model="bizData.billMonth" type="month" placeholder="请选择月份"
                              value-format="yyyy-MM" :disabled="detailDisableSwitch" :picker-options="pickerOptions">
              </el-date-picker>
            </div>
          </li>
          <li class="item">
            <label class="label-term"><em>*</em>费用类型</label>
            <div class="input-text">
              <el-select v-model="bizData.feeType" placeholder="请选择" :disabled="detailDisableSwitch" filterable clearable>
                <el-option v-for="item in dic_other_fee_item_type" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
              </el-select>
            </div>
          </li>
        </ul>

        <ul class="content clearfix">
          <li class="item" >
            <label class="label-term"><em>*</em>含税费用</label>
            <div class="input-text">
              <el-input v-model="bizData.feeAmount" placeholder="元" @input="calculateFeeAmountExTax" v-mypmdouble4val :disabled="detailDisableSwitch"></el-input>
            </div>
          </li>
          <li class="item" v-show="billType == 1 && !isCompany ">
          <label class="label-term"><em>*</em>收款人</label>
            <div class="input-text">
              <el-select v-model="bizData.payee" placeholder="请选择" @change="changePayee" :disabled="isCompany" @blur="inputPayee($event)" filterable clearable>
                <el-option v-for="item in payeeOptions" :key="item.bankCard" :label="item.bankAccountName" :value="item.bankCard"></el-option>
              </el-select>
            </div>
          </li>
          <li class="item" v-if="billType == 1 && isCompany || billType == 2">
            <label class="label-term">税率（%）</label>
            <div class="input-text">
              <el-input v-model="bizData.taxRate" @input="calculateFeeAmountExTax" v-mypmdouble4val :disabled="detailDisableSwitch"></el-input>
            </div>
          </li>
          <li class="item" >
            <label class="label-term">不含税费用</label>
            <div class="input-text">
              <el-input v-model="bizData.feeAmountExTax" v-mypmdouble4val :disabled="true"></el-input>
            </div>
          </li>
          <li class="item" v-show="billType == 1 && !isCompany ">
            <label class="label-term"><em>*</em>收款手机号</label>
            <div class="input-text">
              <el-input v-model="bizData.bankPhone" v-mynumval placeholder="本人实名认证手机号" :disabled="detailDisableSwitch"></el-input>
            </div>
          </li>
          <li class="item" v-show="billType == 1 && !isCompany ">
            <label class="label-term"><em>*</em>身份证号码</label>
            <div class="input-text">
              <el-input v-model="bizData.payeeIdCardNum" @input="forceInput" placeholder="收款人身份证号码" :disabled="detailDisableSwitch"></el-input>
            </div>
          </li>
        </ul>

        <ul class="content clearfix" v-show="billType == 1 && !isCompany">
          <li class="item">
            <label class="label-term"><em>*</em>收款账号</label>
            <div class="input-text">
              <el-input v-model="bizData.receiveAccount" v-mynumval :disabled="false"></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term"><em>*</em>开户行</label>
            <div class="input-text">
              <el-input v-model="bizData.bankAccountName" :disabled="false"></el-input>
            </div>
          </li>
        </ul>

        <ul class="content clearfix" v-show="billType == 1 && !isCompany">
          <li class="item" style="width:496px;">
            <label class="label-term"><em>*</em>支行名称</label>
            <div class="input-text">
              <el-input v-model="bizData.bankBranchName" :disabled="false"></el-input>
            </div>
          </li>
        </ul>

        <ul class="content clearfix" >
          <li class="item" style="width:496px;">
            <label class="label-term">备注</label>
            <div class="input-text" >
              <el-input v-model="bizData.remark" :disabled="detailDisableSwitch"></el-input>
            </div>
          </li>
        </ul>

        <ul class="content clearfix" v-show="billType == 2">
          <li class="item" style="width:496px;">
            <label class="label-term">附件</label>
            <div class="input-text">
              <myFileModel ref="img" :disabledEdit="disabledEdit" :disabledDel="disabledDel" @successCallback="setImgData" ></myFileModel>
            </div>
          </li>
        </ul>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="closeDialog()">关闭</el-button>
          <el-button type="primary" size="mini" @click="save()" v-show="showCommitButton">提交</el-button>
        </div>
      </div>
    </el-dialog>
    <!--    新增修改成本/收入     -->

    <el-dialog title="付款登记" :visible.sync="showPaymentRegistDialog.value" :close-on-click-modal="false" :close-on-press-escape="false"
               :modal-append-to-body="false" width="1000px" @close="showPaymentRegistDialog.value=false" >
      <paymentRegist ref="paymentRegist" :costBillIds="costBillIds" :showPaymentRegistDialog="showPaymentRegistDialog" @refreshData="refreshData">
      </paymentRegist>
    </el-dialog>

  </div>
</template>

<script>
import prjSundryFeeManage from './prjSundryFeeManage.js'
export default prjSundryFeeManage
</script>

<style scoped>

</style>
