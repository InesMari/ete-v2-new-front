<template>
    <div id="packIncomeManage" style="height: 100%;">
      <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="packIncomeManageSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>包装收入列表</span>
                    <el-tooltip effect="light" content="包装收入列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
              <div class="table-title-btn" style="margin-right: 90px;">
                <el-button type="primary" plain size="mini" v-entity="1004019" @click="showDialog(true)">新增费用</el-button>
                <el-button type="primary" plain size="mini" v-entity="1004020" @click="downloadExcel">导出明细</el-button>
              </div>
            </div>
            <tableCommon tableName="packIncomeManageTable" ref="table" :head="head" :showNum="true" :singleSelect="true" :showSetTable="true"></tableCommon>
        </div>

      <el-dialog title="新增费用" :visible.sync="dialogShow" :close-on-click-modal="false" :close-on-press-escape="false" width="540px" @close="showDialog(false)">
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix">
            <li class="item">
              <label class="label-term"><em>*</em>客户名称</label>
              <div class="input-text">
                <el-select v-model="feeInfo.custTenantId" @change="changeCustTenant" @click="initCustTenantData" clearable filterable placeholder="请选择">
                  <el-option v-for="item in custTenantData" :key="item.custTenantId" :label="item.custName" :value="item.custTenantId" >
                  </el-option>
                </el-select>
              </div>
            </li>
            <li class="item">
              <label class="label-term"><em>*</em>费用类型</label>
              <div class="input-text">
                <el-select v-model="feeInfo.feeType" clearable filterable placeholder="请选择">
                  <el-option v-for="item in feeTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                  </el-option>
                </el-select>
              </div>
            </li>
            <li class="item">
              <label class="label-term"><em>*</em>含税价</label>
              <div class="input-text">
                <el-input v-mydoubleval v-model="feeInfo.totalFeeWithTax" @input="changeFee"></el-input>
              </div>
            </li>
            <li class="item">
              <label class="label-term"><em>*</em>费用日期</label>
              <div class="input-text">
                <el-date-picker @input="$forceUpdate" v-model="feeInfo.billDate" type="date"
                                placeholder="选择费用日期" align="right"
                                value-format="yyyy-MM-dd">
                </el-date-picker>
              </div>
            </li>
            <li class="item">
              <label class="label-term">税点</label>
              <div class="input-text">
                <el-input v-model="feeInfo.taxRateStr" disabled="true"></el-input>
              </div>
            </li>
            <li class="item">
              <label class="label-term">不含税价</label>
              <div class="input-text">
                <el-input v-model="feeInfo.totalFee" disabled="true"></el-input>
              </div>
            </li>
          </ul>
          <div class="page-bot-btn ">
            <el-button type="primary" plain size="mini" @click="showDialog(false)">关闭</el-button>
            <el-button type="primary" plain size="mini" @click="addFeeInfo()">提交</el-button>
          </div>
        </div>
      </el-dialog>

    </div>
</template>

<script>
    import packIncomeManage from './packIncomeManage.js'
    export default packIncomeManage
</script>
<style lang="scss">

</style>
