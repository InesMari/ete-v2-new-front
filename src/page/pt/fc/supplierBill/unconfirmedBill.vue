<template>
    <div id="unconfirmedBill">
      <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="supplierBillUnConfirmedBillSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>未审核供应商账单列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="未审核供应商账单列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1006049" @click="addFcSupplierBill">新增账单</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1006050" @click="sureFcSupplierBill">账单审核</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1006051" @click="updateFcSupplierBill">修改账单</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1006052" @click="deleteFcSupplierBill">删除账单</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1006160" @click="addMakeup(true)">账单补录</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1006161" @click="exportExcel()">账单Excel导出</el-button>
                </div>
            </div>
            <tableCommon tableName="unconfirmedBillManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem">
                <template v-slot:default="{item}">
                    <a href="javascript:void(0);" :class="!item.imgUrl?'disabled':'link'"  class="link" @click.stop="showImg(item)" style="margin: 0 10px;">查看附件</a>
                </template>
            </tableCommon>
        </div>

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>


        <!-- 费用补录 begin -->
      <el-dialog  class="makeupDialog" title="供应商账单补录" :visible.sync="showAddMakeup" width="840px" :close-on-click-modal="false" :close-on-press-escape="false">
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix">
            <li class="item item50">
              <label class="label-term">供应商名称</label>
              <div class="input-text">
                <el-input v-model="makeupInfo.supplierName" :disabled="true"></el-input>
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
                <el-select v-model="makeupInfo.feeType" placeholder="请选择费用类型" filterable clearable @change="changeFeeType" :disabled="feeTypeDisable">
                  <el-option v-for="item in feeTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                </el-select>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term"><em>*</em>补录金额</label>
              <div class="input-text">
                <el-input v-model="makeupInfo.makeupFee" maxlength="20" v-mypmdouble4val placeholder="请输入补录金额" @input="forceUpdate"></el-input>
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
                             collapse-tags
                             clearable filterable>
                </el-cascader>
              </div>
            </li>
            <li class="item item50" v-if="makeupInfo.feeType==2">
              <label class="label-term"><em>*</em>成本月份</label>
              <div class="input-text">
                <el-date-picker v-model="makeupInfo.accrualMonth" type="month" value-format="yyyy-MM"  format="yyyy-MM" :disabled="true"
                                placeholder="请选择费用月份">
                </el-date-picker>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term"><em>*</em>税点</label>
              <div class="input-text">
                <el-input v-model="makeupInfo.taxRate" maxlength="10" v-mydouble4val placeholder="请输入税点" @input="forceUpdate"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">备注</label>
              <div class="input-text">
                <el-input v-model="makeupInfo.remark" type="textarea" maxlength="250" placeholder="请输入备注" @input="forceUpdate"></el-input>
              </div>
            </li>
          </ul>
          <h3 class="common-title mt_20"><span class="title-name">补录成本分摊</span></h3>
          <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
            <tr>
              <th><em>*</em>客户名称</th>
              <th><em>*</em>金额</th>
              <th width="50">
                <el-tooltip effect="dark" content="添加分摊" placement="top-start" :hide-after='1000'>
                  <span @click="addShareData()" class="add"></span>
                </el-tooltip>
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(shareData, index) in shareDatas">
              <td>
                <el-select v-model="shareData.custTenantId" placeholder="请选择客户" style="width: 100%;" filterable clearable>
                  <el-option v-for="item in custTenantData" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId"></el-option>
                </el-select>
              </td>
              <td>
                <el-input v-model="shareData.makeupFee" maxlength="20" v-mypmdouble4val placeholder="请输入分摊金额" @input="forceUpdate"></el-input>
              </td>
              <td>
                <el-tooltip effect="dark" content="删除分摊" placement="top-start" :hide-after='1000'>
                  <span @click="removeShareData(index)" class="del"></span>
                </el-tooltip>
              </td>
            </tr>
            </tbody>
          </table>

          <div class="page-bot-btn ">
            <el-button size="mini" @click="addMakeup(false)">关闭</el-button>
            <el-button type="primary" size="mini" @click="saveMakeupInfo()">确定新增</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 费用补录 end -->
    </div>
</template>

<script>
	import unconfirmedBill from './unconfirmedBill.js'
	export default unconfirmedBill
</script>
<style lang="scss">
    #unconfirmedBill{
      height: calc(100% - 41px) !important;
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

