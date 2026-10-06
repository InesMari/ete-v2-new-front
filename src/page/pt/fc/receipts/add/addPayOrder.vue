<template>
  <div id="addPayOrder" class="addPayOrderPage">
      <table class="infoTable" width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
        <tr>
          <td colspan="10">
            <el-select v-model="info.payTitle" placeholder="请选择报销公司" filterable clearable :disabled="writeOffFlag">
              <el-option v-for="item in payTitleOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td :colspan="isUpdate ? 1 : 10">付款单</td>
          <td v-show="isUpdate" :colspan= "isUpdate ? 9 : 1" class="blueFont">{{info.payNum}}</td>
        </tr>
        <tr>
            <td>报销部门</td>
            <td class="blueFont">
              <el-select v-model="info.relOrgId" placeholder="请选择报销部门" filterable clearable @change="changeOrg">
                <el-option v-for="item in orgData" :key="item.id" :label="item.orgName" :value="item.id"></el-option>
              </el-select>
<!--          <el-input v-model="info.orgName" placeholder="报销部门必填" type="text"></el-input>-->
            </td>
            <td>供应商账单</td>
            <td class="blueFont" colspan="3">
                <el-select v-model="info.billId" placeholder="请选择供应商账单"
                           filterable clearable multiple :disabled="disabledBill" :collapse-tags="collapseTags"
                           @change="changebill">
                    <el-option v-for="item in billData" :key="item.id" :label="item.billNum" :value="item.id">
                        <span style="float: left">{{ item.billNum }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">金额:{{ item.totalFee }}</span>
                    </el-option>
                </el-select>
            </td>
            <td>填写日期</td>
            <td class="blueFont" colspan="3">{{info.createDate}}</td>
        </tr>
        <tr>
<!--          <td>注意事项</td>-->
          <td>报销内容</td>
          <td>归集客户</td>
          <td>业务月份</td>
          <td>业务类型</td>
          <td>采购费用申请</td>
          <td>请款单号</td>
          <td>应付金额（元）</td>
          <td>扣款金额（元）</td>
          <td>实付金额（元）</td>
          <td>备注</td>
        </tr>
        <tr v-for="(item, index) in projects" :class="fromPaymentPlan&&!item.applyArray.length>0?'disabledTr':''">
<!--          <td rowspan="10" class="pd20" style="text-align:left;">-->
<!--            1、按税务需求提供正确发票；<br><br>-->
<!--            2、发票需加盖发票专用章；<br><br>-->
<!--            3、报销内容与支出用途一致；<br><br>-->
<!--            4、请附购买申请单、暂借(付)款单等；<br><br>-->
<!--            5、转账的需提供收款方开户行与账号。-->
<!--          </td>-->
          <td>
            <el-cascader :ref="'cascader'+index"
                         v-model="item.payProjectData"
                         size="medium"
                         class="tl"
                         separator="-"
                         :options="treeData"
                         @change="cascaderChange('cascader'+index)"
                         :props="{ value: 'codeValue',label: 'codeName'}"
                         collapse-tags
                         clearable filterable>
            </el-cascader>
          </td>
          <td>
            <el-select v-model="item.custTenantId" placeholder="请选择归属客户" filterable clearable @change="forceUpdate">
              <el-option v-for="item in custOptions" :key="item.tenantId" :label="item.abbreviationName" :value="item.tenantId"></el-option>
            </el-select>
          </td>
          <td>
            <el-date-picker @blur="forceUpdate" v-model="item.businessDate" type="month" placeholder="请选择业务月份" value-format="yyyy-MM" :picker-options="pickerOptions"></el-date-picker>
          </td>
          <td>
            <el-select v-model="item.payBizType" placeholder="请选择业务类型" filterable clearable @change="forceUpdate">
              <el-option v-for="item in payBizTypeOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
            </el-select>
          </td>
        <td>
            <a href="javascript:void(0);" @click="clickItem(item,1)" v-if="info.feeApplySrc!=2" class="blueFont" v-show="item.applyNum">{{item.applyNum}}</a>
          <span style="font-weight: bold;font-size: 14px;" v-for="(subItem, idx) in item.applyArray" >
                        <a href="javascript:void(0);" @click.stop="clickItem(subItem, 1)" class="blueFont" v-if="idx<1&&info.feeApplySrc==2">{{idx > 0 ? ',' + subItem.applyNum : subItem.applyNum}}</a>
          </span>
          <el-popover
              placement="bottom"
              width="200"
              v-if="item.applyArray&&item.applyArray.length>1&&info.feeApplySrc==2"
              trigger="hover">
            <div v-for="(subItem, idx) in item.applyArray" style="text-align:center;border-bottom:1px dashed #eee;line-height: 30px;">
              <a href="javascript:void(0);" style="font-weight:bold;" @click.stop="clickItem(subItem, 1)" class="blueFont">{{subItem.applyNum}}</a>
            </div>
            <span class="blueFont" slot="reference" style="margin-left: 5px;font-size: 16px;letter-spacing: 2px;cursor: pointer;">...</span>
          </el-popover>
        </td>
          <td>
            <span style="font-weight: bold;font-size: 14px;" v-for="(subItem, idx) in item.payNums">
              <a href="javascript:void(0);" @click="clickItem(item.ids[idx],2)" class="blueFont" v-if="idx<1">{{subItem}}</a>
            </span>
            <el-popover
                placement="bottom"
                width="200"
                v-if="item.payNums&&item.payNums.length>1"
                trigger="hover">
              <div v-for="(subItem, idx) in item.payNums" style="text-align:center;border-bottom:1px dashed #eee;line-height: 30px;">
                <a href="javascript:void(0);" style="font-weight:bold;" @click="clickItem(item.ids[idx],2)" class="blueFont">{{subItem}}</a>
              </div>
              <span class="blueFont" slot="reference" style="margin-left: 3px;font-size: 16px;letter-spacing: 2px;cursor: pointer;">...</span>
            </el-popover>

<!--           <p style="font-weight: bold;font-size: 14px;" v-for="(item, index) in project1.payNums"><a href="javascript:void(0);" @click="clickItem(project1.ids[index],2)" class="blueFont">{{item}}</a></p>-->
          </td>
          <td>
            <el-input v-model="item.mustPayFee" placeholder="请输入金额" type="text" @input="calPayFee(index)" v-mydoubleval ></el-input>
          </td>
          <td>
            <el-input v-model="item.deduction" placeholder="请输入金额" type="text" @input="calPayFee(index)" v-mydoubleval ></el-input>
          </td>
          <td>
            <el-input v-model="item.payFee" placeholder="请输入金额" type="text" @input="calTotalFee" v-mydoubleval disabled></el-input>
          </td>
          <td>
            <el-input v-model="item.payRemark" placeholder="备注非必填" type="text" @input="forceUpdate"></el-input>
          </td>
        </tr>
        <tr>
          <td colspan="3">合&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;计</td>
          <td colspan="3"></td>
          <td class="blueFont">￥{{ info.mustPayFee}}</td>
          <td class="blueFont">￥{{ info.deduction}}</td>
          <td class="blueFont">￥{{ info.payFee}}</td>
          <td></td>
        </tr>
        <tr>
          <td colspan="10" class="pd20">
            <div>金额大写：
              <span class="blueFont inlineBlock" style="margin: 0 3% 0 9%">{{chineseMoney[8]}}</span>佰
              <span class="blueFont inlineBlock" style="margin: 0 3% 0">{{chineseMoney[7]}}</span>拾
              <span class="blueFont inlineBlock" style="margin: 0 3% 0">{{chineseMoney[6]}}</span>万
              <span class="blueFont inlineBlock" style="margin: 0 3% 0">{{chineseMoney[5]}}</span>仟
              <span class="blueFont inlineBlock" style="margin: 0 3% 0">{{chineseMoney[4]}}</span>佰
              <span class="blueFont inlineBlock" style="margin: 0 3% 0">{{chineseMoney[3]}}</span>拾
              <span class="blueFont inlineBlock" style="margin: 0 3% 0">{{chineseMoney[2]}}</span>元
              <span class="blueFont inlineBlock" style="margin: 0 3% 0">{{chineseMoney[1]}}</span>角
              <span class="blueFont inlineBlock" style="margin: 0 3% 0">{{chineseMoney[0]}}</span>分
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="10" class="pd20">
            <div class="fl">暂借（付）款：<el-input class="specDisable" v-model="info.borrowFee" placeholder="非必填，暂借（付）款" type="text" style="display:inline-block;width:170px;" disabled @input="calActualPayFee"></el-input>元</div>
            <div class="fr">应补（退）金额：<span class="blueFont" >{{ info.actualPayFee }}</span>元</div>
          </td>
        </tr>
        <tr>
          <td colspan="10" class="pd20">
            <div class="fl" style="width:37%">
              付款方式：
              <el-radio-group v-model="info.payType">
                <el-radio v-for="it of payTypeOptions" :key="it.codeValue" :label="it.codeValue" :disabled="writeOffFlag||it.codeValue=='3'">
                  {{it.codeName}}
                </el-radio>
              </el-radio-group>
            </div>
            <div class="fl" style="margin-left:30px;">
              预计支付日期：<el-date-picker v-model="info.expectDate" type="date" placeholder="按合同填写" value-format="yyyy-MM-dd"></el-date-picker>
            </div>
            <div class="fr" style="margin-right:9%;">
              出纳盖章处
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="5" class="pd20">
            <div style="display: flex;position: relative;align-items: center;">
              <div style="width: 85px;">收款方全称：</div>
              <scrollSelect 
                  style="flex: 1;"
                  :selectData="allSpBankData" 
                  label="bankAccountName" 
                  @selectItem="changeBankAccountNameNew" 
                  @clear="clearBankInfo" 
                  placeholder="请选择收款方"
                  v-if="!personalBankHaveEntity"
              >
                <template v-slot:default="{ item }">
                  <span class="name">{{ item.bankAccountName }}/{{item.bankCard}}</span>
                </template>
              </scrollSelect>

              <el-popover
                    placement="bottom"
                    :append-to-body="false"
                    class="myAutocomplete"
                    v-model="showBankList"
                    v-if="personalBankHaveEntity"
                    :disabled="writeOffFlag"
                    trigger="click">
                    <div slot="reference">                        
                        <input type="text" @input="inputBankData" @focus="filterBankDataMethod" @blur="blurBankAccountNameNew" :disabled="writeOffFlag" v-model="info.bankAccountName" placeholder="请选择或输入收款方全称">
                        <i class="el-icon-circle-close delIcon" v-if="info.bankAccountName" @click="clearBankInfo" ></i>
                    </div>
                    <div class="searchList">
                        <div class="groupList" v-show="filterBankData.length>0">
                            <div class="title">手输银行卡</div>
                            <div class="list">
                                <div class="item" v-for="item in filterBankData" @click="changeBankAccountNameNew(item)">
                                    <span :title="item.bankAccountName + '/' + item.bankCard" class="name">{{ item.bankAccountName }}/{{item.bankCard}}</span>
                                    <span class="unit" @click.stop="deleteBankAccountName(item)">删除</span>
                                </div>
                            </div>
                        </div>
                        <div class="groupList" v-show="filterAllSpBankData.length>0">
                            <div class="title">供应商关联银行卡</div>
                            <div class="list">
                                <div class="item" v-for="item in filterAllSpBankData" @click="changeBankAccountNameNew(item)">
                                    <span :title="item.bankAccountName + '/' + item.bankCard" class="name">{{ item.bankAccountName }}/{{item.bankCard}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="noData" v-show="filterBankData.length==0&&filterAllSpBankData.length==0">无匹配数据</div>
                    </div>
                  </el-popover>
            </div>
          </td>
            <td colspan="5" class="pd20">
                <div class="fr" style="width:100%;">开户行：
                    <el-input v-model="info.bankDeposit" :disabled="hasSelectBank||writeOffFlag" placeholder="请输入开户银行以及支行" type="text" style="display:inline-block;width:85%;"></el-input>
                </div>
            </td>
        </tr>
        <tr>
          <td colspan="5" class="pd20">
            <div style="display: flex;">
              <div style="width: 85px;">账号：</div>
              <el-input v-model="info.bankCard" placeholder="请输入收款方账号" :disabled="hasSelectBank||writeOffFlag" type="text" style="flex: 1;"></el-input>
            </div>
          </td>
            <td colspan="5" class="pd20">
                <div class="fr" style="width:100%;">经办人：
                    <el-input v-model="info.payee" placeholder="请输入经办人" type="text" style="display:inline-block;width:85%;" :disabled="payeeDisable||hasSelectBank||writeOffFlag"></el-input>
                </div>
            </td>
        </tr>
        <tr>
          <td colspan="5" class="pd20">
            <div style="display: flex;">
              <div style="width: 85px;">合同编号：</div>
              <el-select v-model="info.contractId" placeholder="请选择合同编号" @change="changeContract" class="tl" style="flex: 1;" filterable clearable>
                <el-option v-for="item in contractData" :key="item.contractId" :label="item.contractName"
                           :value="item.contractId" style="max-width: 500px;"></el-option>
              </el-select>
            </div>
          </td>
          <td colspan="5" class="pd20">
            <div class="fr" style="width:100%;">付款条件：<span class="blueFont" v-show="info.accountPeriodName">账期见票结：{{info.accountPeriodName}}</span>
            </div>
          </td>
        </tr>
      </table>
      <div class="uploadFile clearfix">
        <div class="fileListView">
          <div class="fileView">
            <div class="label">发票附件：</div>
            <my-simple-file-model-list ref="invoiceNum" @successCallback="fileCallback($event,1)" fileLimit="15" :success-callback-flag="false"></my-simple-file-model-list>
          </div>
          <div class="fileView">
            <div class="label">其他附件：</div>
            <div class="otherFile">
              <my-simple-file-model-list ref="other" @successCallback="fileCallback($event,2)" :switchFile="true" :success-callback-flag="true">
                <template v-slot:default="{item, index}">
                  <el-tooltip content="点击修改为发票附件" placement="top" effect="light">
                    <div class="switchFile">
                      <i class="el-icon-back" @click="switchFile(item,index)"></i>
                    </div>
                  </el-tooltip>
                </template>
              </my-simple-file-model-list>
              <em class="tip fw">禁止在此上传发票</em>
            </div>
          </div>
          <div class="form fr">
            {{info.payType==3?'':'部门审核人：'}}
            <el-select v-model="info.orgApplyUser"  placeholder="请选择部门审核人" filterable clearable v-show="info.payType!=3">
              <el-option v-for="item in orgUserData" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
            </el-select>
          </div>
        </div>
        <div class="page-bot-btn" style="margin-top:40px;">          
          <el-button @click="closePage()">关闭</el-button>
          <el-button type="primary" @click="saveOrUpdatePayOrder">提交</el-button>
        </div>
      </div>
  </div>
</template>

<script>
import addPayOrder from './addPayOrder.js'
export default addPayOrder
</script>
<style lang="scss" src="./addPayOrder.scss" scoped>
</style>
<style lang="scss">
.customElLoadingStyle{
  .el-icon-loading{
    font-size: 30px;
    color: #fff;
  }
  .el-loading-text{
    color: #fff;
  }
}
</style>
