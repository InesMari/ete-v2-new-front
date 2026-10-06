<template>
  <div id="payApplyManage">
    <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="gdPayApplyManageSearch"></searchList>

    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>付款申请列表&nbsp;<span style="color: red;font-size: 12px;">--未审核的付款申请可以撤销、修改--</span></span>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" v-entity="1006107" @click="toPayApplyPrint">打印付款申请单</el-button>
          <el-button type="primary" plain size="mini" v-entity="1006108" @click="showPayApplyModifyDialog">修改申请</el-button>
          <el-button type="primary" plain size="mini" v-entity="1006109" @click="cancelPayApply">撤销申请</el-button>
          <el-button type="primary" plain size="mini" v-entity="1006110" @click="download">导出Excel</el-button>
        </div>
      </div>
      <tableCommon tableName="payApplyManageTable" ref="table" :showNum="true" :showSetTable="true" :head="head" :doQrySum=true></tableCommon>
    </div>

    <el-dialog title="修改付款申请" :visible.sync="showDialog" :close-on-click-modal="false"
               :close-on-press-escape="false" width="540px" @close="showDialog=false">
      <div class="common-info" style="border:none;padding:0;">
        <ul class="content clearfix">
          <li class="item">
            <label class="label-term">付款申请编号</label>
            <div class="input-text">
              <el-input v-model="payInfo.applyPayNum" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term">派车单号</label>
            <div class="input-text">
              <el-input v-model="payInfo.waybillNum" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term">干线供应商</label>
            <div class="input-text">
              <el-input v-model="payInfo.supplierName" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term">干线运费</label>
            <div class="input-text">
              <el-input v-model="payInfo.freight"  :disabled="true"></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term">提货费</label>
            <div class="input-text">
              <el-input v-model="payInfo.pickupFee"  :disabled="true"></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term">送货费</label>
            <div class="input-text">
              <el-input v-model="payInfo.deliveryFee"  :disabled="true"></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term">异动费用</label>
            <div class="input-text">
              <el-input v-model="payInfo.statementFee"  :disabled="true"></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term">费用合计</label>
            <div class="input-text">
              <el-input v-model="payInfo.amount"  :disabled="true"></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term">已申请金额</label>
            <div class="input-text">
              <el-input v-model="payInfo.applyFee"  :disabled="true"></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term">可申请金额</label>
            <div class="input-text">
              <el-input v-model="payInfo.applyAbleFee"  :disabled="true"></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term">开户名字</label>
            <div class="input-text">
              <el-select v-model="payInfo.receiveBankId" placeholder="请选择" @change="selBank">
                <el-option
                    v-for="item in supplierBankData"
                    :key="item.receiveBankId"
                    :label="item.label"
                    :value="item.receiveBankId">
                </el-option>
              </el-select>
            </div>
          </li>
          <li class="item">
            <label class="label-term">开户卡号</label>
            <div class="input-text">
              <el-input v-model="payInfo.bankNum" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term">开户行</label>
            <div class="input-text">
              <el-input v-model="payInfo.bankName" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term">支行名称</label>
            <div class="input-text">
              <el-input v-model="payInfo.branchName" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term">身份证</label>
            <div class="input-text">
              <el-input v-model="payInfo.receiveUserIdCard" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term">申请金额</label>
            <div class="input-text">
              <el-input v-model="payInfo.fee" @input="checkFee"></el-input>
            </div>
          </li>
          <li class="item item100">
            <label class="label-term">备注</label>
            <div class="input-text">
              <el-input v-model="payInfo.remark"></el-input>
            </div>
          </li>

        </ul>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="showDialog=false">关闭</el-button>
          <el-button type="primary" size="mini" @click="modifyApplyPay">确认修改</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import payApplyManage from './payApplyManage.js'
export default payApplyManage
</script>

<style scoped>

</style>
