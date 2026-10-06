<template>
  <div id="saveAssetInfo">
    <!-- 新增 仓库 -->
    <div class="common-info" style="padding-top: 10px;">
      <h3 class="common-title mb_10">
        <span class="title-name">基本信息</span>
        <span class="fr" style="width: 92%;text-align: right;" v-if="type!='1'&&type!='5'">设备资源编号：{{info.assetNum}}</span>
      </h3>
      <ul class="content clearfix">
        <li class="item item33">
          <label class="label-term"><em>*</em>资产名称</label>
          <div class="input-text">
            <el-select v-model="info.baseId" filterable clearable @change="changeFeeBase" :disabled="disabled">
              <el-option v-for="item in feeData" :key="item.baseId" :label="item.projectName" :value="item.baseId">
                <span style="float: left">{{ item.projectName }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.specification }}</span>
              </el-option>
            </el-select>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term">规格型号</label>
          <div class="input-text">
            <el-input v-model="info.model" maxlength="50" placeholder="请输入规格型号" :disabled="true" @input="forceUpdate"></el-input>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term"><em>*</em>资产采购类型</label>
          <div class="input-text">
            <el-select v-model="info.assetPurchaseType" filterable :disabled="disabled" @change="changeAssetPurchaseType(false)">
              <el-option v-for="item in assetPurchaseTypeData" :key="item.codeValue" :label="item.codeName"
                         :value="item.codeValue"></el-option>
            </el-select>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term"><em>*</em>资产类型</label>
          <div class="input-text">
            <el-select v-model="info.assetType" filterable clearable :disabled="disabled" @change="changeAssetType(false)">
              <el-option v-for="item in assetTypeData" :key="item.codeValue" :label="item.codeName"
                         :value="item.codeValue"></el-option>
            </el-select>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term"><em>*</em>资产类别</label>
          <div class="input-text">
            <el-select v-model="info.assetClass" filterable clearable :disabled="disabled" @change="changeAssetClass(false)">
              <el-option v-for="item in assetClassData" :key="item.codeValue" :label="item.codeName"
                         :value="item.codeValue"></el-option>
            </el-select>
          </div>
        </li>
        <li class="item item33" :style="assetSubClassData.length>0?'':'visibility: hidden'">
          <label class="label-term">资产子类别</label>
          <div class="input-text">
            <el-select v-model="info.assetSubClass" filterable clearable :disabled="disabled" @change="forceUpdate">
              <el-option v-for="item in assetSubClassData" :key="item.codeValue" :label="item.codeName"
                         :value="item.codeValue"></el-option>
            </el-select>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term">是否集采</label>
          <div class="input-text">
            <el-select v-model="info.isCentralPurchase" filterable :disabled="disabled" @change="forceUpdate">
              <el-option v-for="item in whetherData" :key="item.codeValue" :label="item.codeName"
                         :value="item.codeValue"></el-option>
            </el-select>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term"><em>*</em>所在地</label>
          <div class="input-text">
            <el-select v-model="info.locationId" filterable clearable :disabled="disabled" @change="forceUpdate">
              <el-option v-for="item in locationData" :key="item.workId" :label="item.workName"
                         :value="item.workId"></el-option>
            </el-select>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term">设备序列号</label>
          <div class="input-text">
            <el-input v-model="info.equipmentNum" maxlength="50" placeholder="请输入设备序列号" :disabled="disabled&&type!=6" @input="forceUpdate"></el-input>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term"><em>*</em>供应商</label>
          <div class="input-text">
            <el-select v-model="info.supplierTenantId" filterable clearable :disabled="disabled" @change="changeSupplier(false)">
              <el-option v-for="item in supplierTenantData" :key="item.tenantId" :label="item.supplierName"
                         :value="item.tenantId"></el-option>
            </el-select>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term">合同</label>
          <div class="input-text">
            <el-select v-model="info.contractId" filterable clearable :disabled="disabled" @change="forceUpdate">
              <el-option v-for="item in contractData" :key="item.id" :label="item.contractNum"
                         :value="item.id"></el-option>
            </el-select>
          </div>
        </li>
        <li class="item item33" :style="info.assetClass=='4'?'':'visibility: hidden'">
          <label class="label-term">器具合同</label>
          <div class="input-text">
            <el-select v-model="info.devContractId" filterable clearable :disabled="disabled" @change="changeDevContract">
              <el-option v-for="item in deviceContractData" :key="item.id" :label="item.devContractNum"
                         :value="item.id">
                <span style="float: left">{{ item.devContractNum }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.tenantName }}-{{item.businessModeName}}</span>
              </el-option>
            </el-select>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term"><em>*</em>部门</label>
          <div class="input-text">
            <el-select v-model="info.settleOrgId" filterable clearable :disabled="disabled" @change="forceUpdate">
              <el-option v-for="item in orgData" :key="item.id" :label="item.orgName"
                         :value="item.id"></el-option>
            </el-select>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term"><em>*</em>结算主体</label>
          <div class="input-text">
            <el-select v-model="info.settleBody" filterable clearable :disabled="disabled" @change="forceUpdate">
              <el-option v-for="item in settleBodyData" :key="item.codeValue" :label="item.codeName"
                         :value="item.codeValue"></el-option>
            </el-select>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term">存放位置</label>
          <div class="input-text">
            <el-input v-model="info.storageLocation" maxlength="50" placeholder="请输入存放位置" :disabled="disabled&&type!=6" @input="forceUpdate"></el-input>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term">采购单号</label>
          <div class="input-text">
            <el-select v-model="info.purchaseOrderId" filterable clearable :disabled="disabled" @change="forceUpdate">
              <el-option v-for="item in purchaseOrderData" :key="item.id" :label="item.purchaseNum"
                         :value="item.id"></el-option>
            </el-select>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term">库存数量</label>
          <div class="input-text">
            <el-input v-model="info.stockNum" maxlength="50" placeholder="请输入库存数量" :disabled="(disabled&&type!=6)||numsDisabled" @input="forceUpdate"></el-input>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term">备注</label>
          <div class="input-text">
            <el-input v-model="info.remark" maxlength="200" placeholder="请输入备注" :disabled="disabled&&type!=6" @input="forceUpdate"></el-input>
          </div>
        </li>
        <li class="item item33" v-if="info.assetPurchaseType=='3'">
          <label class="label-term">开始借用时间</label>
          <div class="input-text">
            <el-date-picker v-model="info.borrowStartDate" type="date" class="tl" placeholder="请选择开始借用时间" format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd" :disabled="disabled"></el-date-picker>
          </div>
        </li>
        <li class="item item33" v-if="info.assetPurchaseType=='3'">
          <label class="label-term">结束借用时间</label>
          <div class="input-text">
            <el-date-picker v-model="info.borrowEndDate" type="date" class="tl" placeholder="请选择结束借用时间" format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd" :disabled="true"></el-date-picker>
          </div>
        </li>
      </ul>
      <h3 class="common-title mb_10" v-if="info.assetPurchaseType!='3'"><span class="title-name">费用信息</span></h3>
      <ul class="content clearfix" v-if="info.assetPurchaseType!='3'">
        <li class="item item33">
          <label class="label-term"><em>*</em>付款类型</label>
          <div class="input-text">
            <el-select v-model="info.payType" filterable :disabled="disabled" @change="changePayType">
              <el-option v-for="item in payTypeData" :key="item.codeValue" :label="item.codeName"
                         :value="item.codeValue"></el-option>
            </el-select>
          </div>
        </li>
        <li class="item item33" :style="info.assetPurchaseType=='2'?'':'visibility: hidden'">
          <label class="label-term">计费周期</label>
          <div class="input-text">
            <el-select v-model="info.billingCycle" filterable :disabled="disabled" @change="calFeeList">
              <el-option v-for="item in billingCycleData" :key="item.codeValue" :label="item.codeName"
                         :value="item.codeValue"></el-option>
            </el-select>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term"><em>*</em>计费数量</label>
          <div class="input-text">
            <el-input v-model="info.billingNum" maxlength="50" placeholder="请输入计费数量" :disabled="disabled||numsDisabled" @input="calFeeList"></el-input>
          </div>
        </li>
        <li class="item item33" v-if="info.assetPurchaseType=='1'">
          <label class="label-term">计费起始月份</label>
          <div class="input-text">
            <el-date-picker v-model="info.billingStartDate" type="month" class="tl" placeholder="请选择计费起始月份" format="yyyy-MM"
                            value-format="yyyy-MM" :disabled="disabled" @input="calFeeList"></el-date-picker>
          </div>
        </li>
        <li class="item item33" v-if="info.assetPurchaseType=='1'"  :style="info.payType=='2'?'':'visibility: hidden'">
          <label class="label-term">计费结束月份</label>
          <div class="input-text">
            <el-date-picker v-model="info.billingEndDate" type="month" class="tl" placeholder="请选择计费结束月份" format="yyyy-MM"
                            value-format="yyyy-MM" :disabled="disabled" @input="calFeeList"></el-date-picker>
          </div>
        </li>
        <li class="item item33" v-if="info.assetPurchaseType=='2'">
          <label class="label-term">计费起始时间</label>
          <div class="input-text">
            <el-date-picker v-model="info.billingStartDate" type="date" class="tl" placeholder="请选择计费起始时间" format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd" :disabled="disabled" @input="calFeeList"></el-date-picker>
          </div>
        </li>
        <li class="item item33" v-if="info.assetPurchaseType=='2'">
          <label class="label-term">计费结束时间</label>
          <div class="input-text">
            <el-date-picker v-model="info.billingEndDate" type="date" class="tl" placeholder="请选择计费结束时间" format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd" :disabled="disabled&&type!=6" @input="calFeeList"></el-date-picker>
            <el-button class="unit" type="primary" size="mini" v-entity="1014069" style="line-height: 1;top:6px;"  @click="showDiscontinueAssetInfoDlg=true" v-if="type==3&&info.firstVerifyDate">租赁中止</el-button>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term">单位</label>
          <div class="input-text">
            <el-input v-model="info.unit" maxlength="50" placeholder="请输入单位" :disabled="disabled" @input="forceUpdate"></el-input>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term">总期数</label>
          <div class="input-text">
            <el-input v-model="info.billingPeriods" maxlength="50" :disabled="true" @input="forceUpdate"></el-input>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term">已付期数</label>
          <div class="input-text">
            <el-input v-model="info.paydBillingPeriods" maxlength="50" placeholder="请输入已付期数" :disabled="disabled" @input="calFeeList"></el-input>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term"><em>*</em>税点</label>
          <div class="input-text">
            <el-input v-model="info.tax" maxlength="50" placeholder="请输入税点" :disabled="disabled" @input="calFeeList"></el-input>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term"><em>*</em>单价</label>
          <div class="input-text">
            <el-input v-model="info.price" maxlength="50" placeholder="请输入单价" :disabled="disabled" @input="forceUpdate"></el-input>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term"><em>*</em>含税单价</label>
          <div class="input-text">
            <el-input v-model="info.priceWithTax" maxlength="50" placeholder="请输入含税单价" :disabled="disabled" @input="calFeeList"></el-input>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term">押金</label>
          <div class="input-text">
            <el-input v-model="info.deposit" maxlength="50" placeholder="请输入押金" :disabled="disabled" @input="forceUpdate"></el-input>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term"><em>*</em>总金额</label>
          <div class="input-text">
            <el-input v-model="info.totalFee" maxlength="50" placeholder="请输入总金额" :disabled="disabled" @input="forceUpdate"></el-input>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term"><em>*</em>含税总金额</label>
          <div class="input-text">
            <el-input v-model="info.totalFeeWithTax" maxlength="50" placeholder="请输入含税总金额" :disabled="disabled" @input="forceUpdate"></el-input>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term">违约金</label>
          <div class="input-text">
            <el-input v-model="info.liquidatedDamages" maxlength="50" placeholder="请输入违约金" :disabled="disabled" @input="forceUpdate"></el-input>
          </div>
        </li>
      </ul>
      <h3 class="common-title mb_10" v-if="showDepreciation"><span class="title-name">折旧信息</span></h3>
      <ul class="content clearfix"  v-if="showDepreciation">
        <li class="item item33">
          <label class="label-term">入库时间</label>
          <div class="input-text">
            <el-date-picker v-model="info.inStockDate" type="date" class="tl" placeholder="请选择入库时间" format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd" :disabled="disabled" @input="getAssetDepreciation(false)"></el-date-picker>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term">折旧开始月份</label>
          <div class="input-text">
            <el-date-picker v-model="info.depreciationStartDate" type="month" class="tl" placeholder="请选择折旧开始月份" format="yyyy-MM"
                            value-format="yyyy-MM" :disabled="true" @input="$forceUpdate"></el-date-picker>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term">折旧结束月份</label>
          <div class="input-text">
            <el-date-picker v-model="info.depreciationEndDate" type="month" class="tl" placeholder="请选择折旧结束月份" format="yyyy-MM"
                            value-format="yyyy-MM" :disabled="true" @input="$forceUpdate"></el-date-picker>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term">总成本</label>
          <div class="input-text">
            <el-input v-model="info.totalCost" maxlength="50" :disabled="true" @input="forceUpdate"></el-input>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term">折旧月份数</label>
          <div class="input-text">
            <el-input v-model="info.depreciationMonths" maxlength="50" :disabled="true" @input="forceUpdate"></el-input>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term"><em>*</em>每月折旧费用</label>
          <div class="input-text">
            <el-input v-model="info.monthDepreciation" maxlength="50" placeholder="请输入每月折旧费用" :disabled="disabled" @input="forceUpdate"></el-input>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term">已折旧月份数</label>
          <div class="input-text">
            <el-input v-model="info.depreciatedMonths" maxlength="50" :disabled="true" @input="forceUpdate"></el-input>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term">已折旧费用</label>
          <div class="input-text">
            <el-input v-model="info.depreciatedCost" maxlength="50" :disabled="true" @input="forceUpdate"></el-input>
          </div>
        </li>
        <li class="item item33">
          <label class="label-term">残值费用</label>
          <div class="input-text">
            <el-input v-model="info.residualCost" maxlength="50" :disabled="true" @input="forceUpdate"></el-input>
          </div>
        </li>
      </ul>
      <h3 class="common-title mb_10"><span class="title-name">附件信息</span></h3>
      <div class="uploadFile clearfix" style="margin-bottom:10px;">
        <div class="fl mr_20"  v-for="(item,index) in info.files">
          <myFileModel :ref="'file' + index" @successCallback="successCallback" @delCallback="delCallback" :componentId="index" :disabled="disabled&&type!=6" :disabled-edit="disabled&&type!=6" :disabled-del="disabled&&type!=6"></myFileModel>
          <p>只支持.jpg .png .pdf .xls .xlsx格式</p>
        </div>
      </div>

      <div class="state" v-if="info.verifyState!=undefined&&info.verifyState!=0&&type==3" :class="info.verifyState==1?'state1':'state0'"><div class="text">{{ info.verifyState==1?"审核通过":"审核不通过" }}</div></div>
      <h3 class="common-title mb_10" v-if="info.assetPurchaseType!='3'"><span class="title-name">月度费用</span></h3>
      <table ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" v-if="info.assetPurchaseType!='3'">
        <thead>
        <tr>
          <th width="60">序号</th>
          <th width="150">费用所属中心</th>
          <th width="120">费用月份</th>
          <th width="120" v-if="info.assetPurchaseType=='2'">计费起始日</th>
          <th width="120" v-if="info.assetPurchaseType=='2'">计费截止日</th>
          <th width="80" v-if="info.assetPurchaseType=='2'">租赁天数</th>
          <th width="80" v-if="info.assetPurchaseType=='2'">月天数</th>
          <th width="120">未税月费用</th>
          <th width="120">含税月费用</th>
          <th width="120" v-if="type!=1">异动费</th>
          <th width="120" v-if="type!=1">合计</th>
          <th width="120" v-if="type!=1">已付</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,idx) in info.feeDetails" :key="idx" :class="item.modifyDisabled==1?'disabled':''">
          <td width="60">{{idx+1}}</td>
          <td width="150">{{item.locationWorkName}}</td>
          <td width="120">{{item.billMonth}}</td>
          <td width="120" v-if="info.assetPurchaseType=='2'">{{item.billingStartDate}}</td>
          <td width="120" v-if="info.assetPurchaseType=='2'">{{item.billingEndDate}}</td>
          <td width="80" v-if="info.assetPurchaseType=='2'">{{item.leaseDays}}</td>
          <td width="80" v-if="info.assetPurchaseType=='2'">{{item.billMonthDays}}</td>
          <td width="120">{{item.totalFee}}</td>
          <td width="120">{{item.totalFeeWithTax}}</td>
          <td width="120" v-if="type!=1">{{item.changeFee}}</td>
          <td width="120" v-if="type!=1">{{item.amountWithTax}}</td>
          <td width="120" v-if="type!=1">{{item.payFee}}</td>
        </tr>
        </tbody>
      </table>

      <div class="page-bot-btn ">
        <el-button size="mini" @click="close">关闭</el-button>
        <el-button type="primary" v-show="!disabled||type==6" size="mini" @click="saveAssetInfo">提交</el-button>
        <el-button type="primary" v-show="type==4" size="mini" @click="verify">审核</el-button>
      </div>
    </div>

    <!-- 租赁中止-开始 -->
    <el-dialog title="租赁中止提示" :visible.sync="showDiscontinueAssetInfoDlg" width="420px" :close-on-click-modal="false"
               :close-on-press-escape="false">
      <div class="common-info" style="border:none;padding:20px;">
        <ul class="content clearfix">
          <li class="item" style="width: 100%;">
            <label class="label-term" style="width: 98px;">原计费结束时间</label>
            <div class="input-text" style="width: calc(100% - 108px);">
              <el-date-picker v-model="info.billingEndDate" type="date" class="tl" format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd" :disabled="true"></el-date-picker>
            </div>
          </li>
          <li class="item " style="width: 100%;">
            <label class="label-term" style="width: 98px;"><em>*</em>新计费结束时间</label>
            <div class="input-text" style="width: calc(100% - 108px);">
              <el-date-picker v-model="info.newBillingEndDate" type="date" class="tl" placeholder="请选择计费结束时间" format="yyyy-MM-dd"
                              value-format="yyyy-MM-dd" ></el-date-picker>
            </div>
          </li>
        </ul>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="closeDiscontinueAssetInfoDlg">取消</el-button>
          <el-button type="primary" size="mini" @click="discontinueAssetInfo">中止确认</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 租赁中止-结束 -->
  </div>
</template>

<script>
import saveAssetInfo from './saveAssetInfo.js'

export default saveAssetInfo
</script>
<style lang="scss" scoped>
#saveAssetInfo{

  .item33 {
    width: 31.3% !important;
    margin-right: 2% !important;
  }
  
  .item98 {
    width: 98% !important;
  }
  
  .common-info{
    position:relative;
    .mb_10{
      margin-bottom: 10px;
    }
    .state{
      position: absolute;
      top: 88px;
      right: 40px;
      border:3px solid red;
      padding:2px 5px;
      transform: rotate(30deg);
      .text{
          border:1px solid red;
          width: 100px;
          line-height: 40px;
          font-size: 18px;
          color: red;
          text-align: center;
        }
      &.state0{
        border-color: red;
        .text{
          border-color: red;
          color: red;
        }
      }
      &.state1{
        border-color: green;
        .text{
          border-color: green;
          color: green;
        }
      }
    }
    .uploadFile{
      padding: 20px;
      background: #fff;
      border:$border;
      p{
        text-align: center;
      }
      .imgList{
        img{
          width:110px;
          height: 110px;
          border-radius: 5px;
          overflow: hidden;
          float: left;
          margin-left: 20px;
        }
      }
      .form{
        line-height: 110px;
        font-weight: bold;
        font-size: 14px;
        button{
          margin-left: 20px;
        }
        .el-select .el-input input{
          color: #0379FF;
        }
      }
    }
  }
  
  .common-title{
    display: flex;
    align-items: center;
    .title-name::before{
      top:9px
    }
    .feeTime{
      display: flex;
      align-items: center;
      .label{
        margin-left: 20px;
      }
    }
  }

  .tableCommon{
    table-layout: initial;
    border-left: $border;
    border-right: $border;
    tbody{
      tr.disabled{
        td{
          color: #999!important;
        }
      }
    }
  }

  .timeline {
    position: fixed;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 999;
    padding: 10px;
    border-radius: 5px;
    transition: all .3s;

    .item {
        position: relative;
        padding-bottom: 20px;
        padding-right: 20px;
        text-align: center;
        min-height: 40px;
        cursor: pointer;

        .circle {
            position: absolute;
            background-color: #E4E7ED;
            border-radius: 50%;
            width: 12px;
            height: 12px;
            right: 0;
            top: 16px;
            margin-top: -6px;
            z-index: 9;
            &.active{
                background: #07c160;
            }
        }

        .line {
            position: absolute;
            right: 5px;
            top: 16px;
            height: 100%;
            border-left: 2px solid #E4E7ED;
        }

        .content {
            display: none;

        }

        &:last-child{
            padding-bottom: 0;
            .line{
                display: none;
            }
        }
        
        &:hover{
            p{
                color: #07c160;
            }
        }
    }
    &:hover{
        background: #fff;
        box-shadow: 0 0 4px rgba(0,0,0,0.2);
        right: 10px;
        .item{
            .content {
                display: block;
            }
        }
    }
  }
}
</style>
