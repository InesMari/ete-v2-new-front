<template>
  <div id="paymentRegist">
    <div class="table_height orderInfo" style="overflow:auto;">
      <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
        <thead>
        <tr>
          <th width="50">序号</th>
          <th width="150">客户</th>
<!--          <th width="100">供应商</th>-->
          <th width="100">费用</th>
          <th width="100">费用月份</th>
          <th width="100">费用类型</th>
          <th width="100">收款人</th>
          <th width="100">收款手机号</th>
          <th width="150">收款账号</th>
          <th width="100">开户行</th>
          <th width="150">支行名称</th>
          <th width="200">实际付款日期</th>
          <th width="100">备注</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index) in costBillList">
<!--        <tr>-->
          <!--          <td>{{item.remark}}</td>-->
          <!-- 序号 -->
          <td>{{ index + 1}}</td>
          <!-- 客户 -->
          <td>{{item.custName}}</td>
          <!-- 供应商 -->
<!--          <td>{{item.}}</td>-->
          <!-- 费用 -->
          <td>{{item.feeAmount}}</td>
          <!-- 费用月份 -->
          <td>{{item.billMonth}}</td>
          <!-- 费用类型 -->
          <td>{{item.feeTypeName}}</td>
          <!-- 收款人 -->
          <td>{{item.receiveAccount}}</td>
          <!-- 收款手机号 -->
          <td>{{item.bankPhone}}</td>
          <!-- 收款账号 -->
          <td>{{item.custName}}</td>
          <!-- 开户行 -->
          <td>{{item.bankAccountName}}</td>
          <!-- 支行名称 -->
          <td>{{item.bankBranchName}}</td>
          <!-- 实际付款日期 -->
          <td>
            <el-date-picker v-model="item.payTime" type="datetime" placeholder="请选择" :disabled="paySts == 1">
            </el-date-picker>
          </td>
          <!-- 备注 -->
          <td>{{item.remark}}</td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
          <td>合计：</td>
          <td></td>
<!--          <td></td>-->
          <td>{{totalCost}}</td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
        </tfoot>
      </table>
    </div>

    <div class="page-bot-btn ">
      <el-button size="mini" @click="closePaymentRegistDialog()">关闭</el-button>
      <el-button v-if="paySts == 1" type="danger" size="mini" @click="save('rev')" >撤销</el-button>
      <el-button v-if="paySts != 1" type="primary" size="mini" @click="save()" >提交</el-button>
    </div>

  </div>
</template>

<script>
import paymentRegist from './paymentRegist.js'
export default paymentRegist
</script>

