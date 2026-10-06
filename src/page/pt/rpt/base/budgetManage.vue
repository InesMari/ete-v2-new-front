<template>
  <div id="budgetManage">
    <div class="search-list clearfix">
      <div class="search-form clearfix" @keyup.enter="doQuery()">
        <div class="item">
          <label class="label">客户：</label>
          <div class="input-text">
            <el-select v-model="query.custTenantId" filterable clearable @click.native="loadCustomerData" placeholder="请选择客户">
              <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name" :value="item.tenantId"></el-option>
            </el-select>
          </div>
        </div>
        <div class="item">
          <label class="label">年份：</label>
          <div class="input-text">
            <el-date-picker v-model="query.year" type="year"  value-format="yyyy" placeholder="请选择年份"></el-date-picker>
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
    </div>
    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>收支预算配置列表&nbsp;</span>
        </h3>
        <div class="table-title-btn">
          <el-button type="primary" plain size="mini" v-entity :entityId="[{1001008:1001009}]" @click="displayBudgetDialog(2)">修改</el-button>
          <el-button type="primary" plain size="mini" v-entity :entityId="[{1001008:1001010}]" @click="displayBudgetDialog(1)">新增</el-button>
          <el-button type="primary" plain size="mini" v-entity="1001011" @click="downloadExcelFile">导出Excel</el-button>
        </div>
      </div>
      <tableCommon tableName="budgetManageTable" ref="table" :showNum="true" :showSetTable="false" :head="head" :doQrySum="true" :singleSelect="true"></tableCommon>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="showBudgetDialog" :close-on-click-modal="false" :close-on-press-escape="false" width="540px" @close="showBudgetDialog=false">
      <div class="common-info" style="border:none;padding:0;">
        <ul class="content clearfix">
          <li class="item">
            <label class="label-term"><em>*</em>客户</label>
            <div class="input-text">
              <el-select v-model="budgetInfo.custTenantId" filterable clearable @click.native="loadCustomerData" placeholder="请选择客户" :disabled="type==2">
                <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name" :value="item.tenantId"></el-option>
              </el-select>
            </div>
          </li>
          <li class="item">
            <label class="label-term"><em>*</em>年份</label>
            <div class="input-text">
              <el-date-picker v-model="budgetInfo.budgetYear" type="year"  value-format="yyyy" placeholder="请选择年份"  :disabled="type==2"></el-date-picker>
            </div>
          </li>
        </ul>
        <div class="tickManager">
          <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
            <tr>
              <th width="70">月份</th>
              <th width="70">收入额</th>
              <th width="70">成本额</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in details" >
              <td>
                {{item.budgetMonth}}
              </td>
              <td>
                <el-input v-model="item.incomeFee" type="text" placeholder="收入额" v-mypmdouble4val></el-input>
              </td>
              <td>
                <el-input v-model="item.costFee" type="text" placeholder="成本额" v-mypmdouble4val></el-input>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="showBudgetDialog=false">关闭</el-button>
          <el-button type="primary" size="mini" @click="doSaveBudget">提交</el-button>
        </div>
      </div>
    </el-dialog>

  </div>


</template>

<script>
import budgetManage from './budgetManage.js'
export default budgetManage
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>
