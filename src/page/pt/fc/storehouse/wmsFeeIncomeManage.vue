<template>
  <div id="wmsFeeIncomeManage">
    <searchList :formData="formData" @doQuery="doQuery" @clearFn="initQuery" :query="query" searchKey="wmsFeeIncomeManageSearch"></searchList>

    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>仓库收入列表</span>
          <el-tooltip effect="light" content="仓库收入列表" placement="right">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" @click="displayDialog(1)" v-entity="1005103">新增月收入</el-button>
          <el-button type="primary" plain size="mini" @click="displayDialog(2)" v-entity="1005104">修改月收入</el-button>
          <el-button type="danger" plain size="mini" @click="deleteFee()" v-entity="1005105">删除月收入</el-button>
          <el-button type="primary" plain size="mini" @click="toDetail()" v-entity="1005263">查看明细</el-button>
          <el-button type="primary" plain size="mini" @click="downExcel()" v-entity="1005106">导出Excel</el-button>
            <el-button type="primary" plain size="mini" @click="gotoLog">查看日志</el-button>
        </div>
      </div>
      <tableCommon tableName="wmsFeeIncomeManageTable" ref="table" :showNum="true" v-slot="{item}" @dblclickItem="dblclickItem" :showSetTable="true" :head="head" :singleSelect="true">
        <div>
          <a href="javascript:void(0);" class="link" @click.stop="toCustomerConfirmedBillDetail(item)" style="margin: 0 10px;">{{item.billNum}}</a>
        </div>
      </tableCommon>
    </div>

    <!--    新增修改收入     -->
    <el-dialog :title="dialogTitle" :visible.sync="showDialog" :close-on-click-modal="false" :close-on-press-escape="false" width="580px" @close="closeDialog()">
      <div class="common-info" style="border:none;padding:0;margin-top: -20px;">
        <em>重要说明：次月的5日后，禁止提交上月月收入，例：1月的月收入，2月5日后将无法再新建！</em>
        <ul class="content clearfix" style="margin-top: 10px;">
          <li class="item" style="width:496px;">
            <label class="label-term"><em>*</em>客户</label>
            <div class="input-text"  v-if="add" >
              <el-select v-model="bizData.custTenantId" placeholder="请选择" @change="changeCustomer()" filterable clearable>
                <el-option v-for="item in leasingTenantOptions" :key="item.custTenantId" :label="item.custName" :value="item.custTenantId"  >
                </el-option>
              </el-select>
            </div>
            <div  class="input-text"  v-else><el-input v-model="bizData.custTenantName" :disabled="true"></el-input></div>
          </li>
        </ul>
        <ul class="content clearfix">
          <li class="item" style="width:496px;">
            <label class="label-term"><em>*</em>仓库名称</label>
            <div class="input-text"  v-if="add" >
              <el-select v-model="bizData.workStoreId" @change="storeHouseChange()" placeholder="请选择" filterable clearable>
                <el-option v-for="item in storeHouseOptions" :key="item.workId" :label="item.workName" :value="item.workId" >
                </el-option>
              </el-select>
            </div>
            <div  class="input-text"  v-else><el-input v-model="bizData.workName" :disabled="true"></el-input></div>
          </li>
        </ul>
        <ul class="content clearfix">
          <li class="item" style="width:496px;">
            <label class="label-term">仓库地址</label>
            <div class="input-text">
              <el-input v-model="bizData.workAddressStr" :disabled="true"></el-input>
            </div>
          </li>
        </ul>

        <ul class="content clearfix">
          <li class="item">
            <label class="label-term">仓库面积(㎡)</label>
            <div class="input-text">
              <el-input v-model="bizData.storeHouseArea" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term"><em>*</em>费用月份</label>
            <div class="input-text">
              <el-date-picker v-model="bizData.billMonth" type="month" placeholder="请选择月份"
                              value-format="yyyy-MM" :disabled="!detailDisableSwitch" :picker-options="pickerOptions">
              </el-date-picker>
            </div>
          </li>
        </ul>
        <ul class="content clearfix">
          <li class="item">
            <label class="label-term"><em>*</em>费用类型</label>
            <div class="input-text">
              <el-select v-model="bizData.itemType" placeholder="请选择" @change="itemTypeChange()"  :disabled="!detailDisableSwitch" filterable clearable>
                <el-option v-for="item in itemTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
              </el-select>
            </div>
          </li>
          <li class="item" >
            <label class="label-term"><em>*</em>含税费用</label>
            <div class="input-text">
              <el-input v-model="bizData.totalFeeWithTax" placeholder="元" @input="calculateFeeAmountExTax" v-mypmdouble4val :disabled="!detailDisableSwitch"></el-input>
            </div>
          </li>
        </ul>
        <ul class="content clearfix">
          <li class="item">
            <label class="label-term">税率（%）</label>
            <div class="input-text">
              <el-input v-model="bizData.tax" @input="calculateFeeAmountExTax" v-mypmdouble4val :disabled="!detailDisableSwitch"></el-input>
            </div>
          </li>
          <li class="item" >
            <label class="label-term">不含税费用</label>
            <div class="input-text">
              <el-input v-model="bizData.totalFee" v-mypmdouble4val :disabled="true"></el-input>
            </div>
          </li>
        </ul>

        <ul class="content clearfix" >
          <li class="item" style="width:496px;">
            <label class="label-term">备注</label>
            <div class="input-text" >
              <el-input v-model="bizData.remark" :disabled="!detailDisableSwitch"></el-input>
            </div>
          </li>
        </ul>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="closeDialog()">关闭</el-button>
          <el-button type="primary" size="mini" @click="save()" v-show="showCommitButton">提交</el-button>
        </div>
      </div>
    </el-dialog>
    <!--    新增修改收入     -->


    <!--    明细     -->
    <el-dialog title="查看收入明细" :visible.sync="showDetailDialog" :close-on-click-modal="false" :close-on-press-escape="false" width="80%" @close="closeDetailDialog()">
      <div class="common-info" style="border:none;padding:15px;">
        <tableCommon tableName="wmsFeeIncomeDetailManageTable" ref="detailTable" :showNum="true" :showSetTable="true" :head="detailHead">
        </tableCommon>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="closeDetailDialog()">关闭</el-button>
        </div>
      </div>
    </el-dialog>
    <!--    明细     -->

  </div>
</template>

<script>
import wmsFeeIncomeManage from './wmsFeeIncomeManage.js'
export default wmsFeeIncomeManage
</script>

<style scoped>

</style>
