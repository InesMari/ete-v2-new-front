<template>
    <div id="feeChangeBillMakeUpManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="feeChangeBillMakeUpManageSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>费用补录列表</span>
                </h3>
              <div class="table-title-btn" style="margin-right: 90px;">
                <el-button type="primary" plain size="mini" v-entity="1006069" @click="addMakeup(true)">修改补录</el-button>
                <el-button type="danger" plain size="mini" v-entity="1006070" @click="deleteFeeChange">删除补录</el-button>
                <el-button type="primary" plain size="mini" v-entity="1006163" @click="verifyMakeup(true)">审核补录</el-button>
                <el-button type="primary" plain size="mini" v-entity="1006164" @click="cancelVerifyMakeupInfo()">取消审核补录</el-button>
              </div>
            </div>
            <tableCommon tableName="feeChangeManageTable" ref="table" :head="head" :showNum="true" :showSetTable="true"  :singleSelect="true" @dblclickItem="viewMakeup">
              <template v-slot="{item,code}">
                <div v-if="'billNum'==code">
                  <a href="javascript:void(0);" class="link" @click.stop="toFcSupplierBillDetail(item)" style="margin: 0 10px;">{{item.billNum}}</a>
                </div>
              </template>
            </tableCommon>
        </div>

      <!-- 费用补录 begin -->
      <el-dialog  class="makeupDialog" title="供应商账单补录" :visible.sync="showAddMakeup" width="740px" :close-on-click-modal="false" :close-on-press-escape="false">
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix">
            <li class="item item50">
              <label class="label-term">供应商名称</label>
              <div class="input-text">
                <el-input v-model="makeupInfo.tenantName" :disabled="true"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">账单金额</label>
              <div class="input-text">
                <el-input v-model="makeupInfo.totalFee" :disabled="true"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term"><em>*</em>费用类型</label>
              <div class="input-text">
                <el-select v-model="makeupInfo.feeType" placeholder="请选择费用类型" @change="changeFeeType" filterable clearable :disabled="verifyFlg||viewFlg||feeTypeDisable">
                  <el-option v-for="item in feeTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                </el-select>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term"><em>*</em>补录金额</label>
              <div class="input-text">
                <el-input v-model="makeupInfo.makeupFee" maxlength="20" v-mypmdouble4val placeholder="请输入补录金额" @input="forceUpdate" :disabled="verifyFlg||viewFlg"></el-input>
              </div>
            </li>
            <li class="item item50" v-if="makeupInfo.feeType==2">
              <label class="label-term"><em>*</em>成本类型：</label>
              <div class="input-text">
                <el-cascader ref="cascader"
                             v-model="makeupInfo.accrualCostTypeData"
                             size="medium"
                             style="width: 100%;"
                             separator="-"
                             :options="accrualCostTypeTreeData"
                             :props="{ value: 'codeValue',label: 'codeName' }"
                             collapse-tags :disabled="verifyFlg||viewFlg"
                             clearable filterable>
                </el-cascader>
              </div>
            </li>
            <li class="item item50" v-if="makeupInfo.feeType==2">
              <label class="label-term"><em>*</em>成本月份</label>
              <div class="input-text">
                <el-date-picker v-model="makeupInfo.accrualMonth" type="month" value-format="yyyy-MM" :disabled="verifyFlg||viewFlg"
                                placeholder="请选择费用月份">
                </el-date-picker>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term"><em>*</em>税点</label>
              <div class="input-text">
                <el-input v-model="makeupInfo.taxRate" maxlength="10" v-mydouble4val placeholder="请输入税点" @input="forceUpdate" :disabled="verifyFlg||viewFlg"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">备注</label>
              <div class="input-text">
                <el-input v-model="makeupInfo.remark" maxlength="50" placeholder="请输入备注" @input="forceUpdate" :disabled="verifyFlg||viewFlg"></el-input>
              </div>
            </li>
          </ul>
          <h3 class="common-title mt_20"><span class="title-name">补录成本分摊</span></h3>
          <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
            <tr>
              <th><em>*</em>客户名称</th>
              <th><em>*</em>金额</th>
              <th width="50" v-if="!verifyFlg&&!viewFlg">
                <el-tooltip effect="dark" content="添加分摊" placement="top-start" :hide-after='1000'>
                  <span @click="addShareData()" class="add"></span>
                </el-tooltip>
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(shareData, index) in shareDatas">
              <td>
                <el-select v-model="shareData.custTenantId" placeholder="请选择客户" style="width: 100%;" filterable clearable :disabled="verifyFlg||viewFlg">
                  <el-option v-for="item in custTenantData" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId"></el-option>
                </el-select>
              </td>
              <td>
                <el-input v-model="shareData.makeupFee" maxlength="20" v-mypmdouble4val placeholder="请输入分摊金额" @input="forceUpdate" :disabled="verifyFlg||viewFlg"></el-input>
              </td>
              <td  v-if="!verifyFlg&&!viewFlg">
                <el-tooltip effect="dark" content="删除分摊" placement="top-start" :hide-after='1000'>
                  <span @click="removeShareData(index)" class="del"></span>
                </el-tooltip>
              </td>
            </tr>
            </tbody>
          </table>

          <div class="page-bot-btn ">
            <el-button type="primary" @click="verifyMakeupInfo(1)" v-if="verifyFlg">审核通过</el-button>
            <el-button @click="verifyMakeupInfo(2)"  v-if="verifyFlg">审核不通过</el-button>
            <el-button size="mini" @click="addMakeup(false)" v-if="!verifyFlg">关闭</el-button>
            <el-button type="primary" size="mini" @click="saveMakeupInfo()" v-if="!verifyFlg&&!viewFlg">确定保存</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 费用补录 end -->


    </div>
</template>

<script>
    import feeChangeManage from './feeChangeManage.js'
    export default feeChangeManage
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
#feeChangeBillMakeUpManage{
  .tableCommon{
    .el-input__inner{
      text-align: center;
    }
  }
  .makeupDialog{
    .tableCommon{
      .el-input__inner{
        text-align: center;
      }
    }
    .add{
      vertical-align: middle;
      @include add;
    }
    .del{
      vertical-align: middle;
      @include del;
    }
  }
}
</style>
