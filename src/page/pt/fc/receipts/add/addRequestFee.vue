<template>
    <div id="addRequestFee" class="addRequestFeePage">
        <table class="infoTable" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td colspan="8">
                    <el-select v-model="request.payTitle" placeholder="请选择报销公司" class="tl" filterable clearable>
                        <el-option v-for="item in titleData" :key="item.codeValue" :label="item.codeName"
                                   :value="item.codeValue"></el-option>
                    </el-select>
                </td>
            </tr>
            <tr>
                <td :colspan="isUpdate ? 2 : 8">请款单</td>
                <td v-show="isUpdate" :colspan= "isUpdate ? 6 : 2" class="blueFont">{{request.payNum}}</td>
            </tr>
            <tr>
                <td colspan="2">请款部门</td>
<!--                <td class="blueFont"><el-input v-model="request.orgName" placeholder="报销部门必填" type="text"></el-input></td>-->
              <td class="blueFont">
                <el-select v-model="request.relOrgId" placeholder="请选择请款部门" filterable clearable @change="changeOrg">
                  <el-option v-for="item in orgData" :key="item.id" :label="item.orgName" :value="item.id"></el-option>
                </el-select>
              </td>
              <td>请款人</td>
                <td class="blueFont">{{request.createUserName}}</td>
                <td>请款日期</td>
                <td class="blueFont" colspan="2">{{request.createDate}}</td>
            </tr>
            <tr>
                <td rowspan="3" colspan="2">用途</td>
                <td colspan="3">
<!--                    <el-select v-model="request.payProject" placeholder="请选择报销内容" class="tl" filterable clearable>-->
<!--                        <el-option v-for="item in typeData" :key="item.codeValue" :label="item.codeName"-->
<!--                                   :value="item.codeValue"></el-option>-->
<!--                    </el-select>-->
                      <el-cascader ref="cascader"
                                   v-model="request.payProjectData"
                                   size="medium"
                                   class="tl"
                                   separator="-"
                                   :options="treeData"
                                   @change="cascaderChange('cascader')"
                                   :props="{ value: 'codeValue',label: 'codeName'}"
                                   collapse-tags
                                   popper-class="addRequestFeeCascader"
                                   clearable filterable>
                      </el-cascader>
                </td>
                <td colspan="3" style="width: 40%">账户信息（正确填写）</td>
            </tr>
            <tr>
                <td colspan="3" rowspan="2" style="width: 50%">
                    <el-input v-model="request.payRemark" placeholder="请输入报销备注" style="font-size: 14px;font-weight: 700;" type="textarea" @input="forceUpdate"></el-input>
                </td>
                <td>收款方全称</td>
                <td colspan="2" style="position: relative;">
                    <scrollSelect 
                        style="flex: 1;"
                        :selectData="allSpBankData" 
                        label="bankAccountName" 
                        @selectItem="changeBankAccountNameNew" 
                        @clear="clearBankInfo" 
                        placeholder="请选择收款方"
                        v-if="!personalBankHaveEntity">
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
                    trigger="click">
                    <div slot="reference">                        
                        <input type="text" @input="inputBankData" @focus="filterBankDataMethod" @blur="blurBankAccountNameNew" v-model="request.bankAccountName" placeholder="请选择或输入收款方全称">
                        <i class="el-icon-circle-close delIcon" v-if="request.bankAccountName" @click="clearBankInfo" ></i>
                    </div>
                    <div class="searchList">
                        <div class="groupList" v-show="filterBankData.length>0">
                            <div class="title">手输银行卡</div>
                            <div class="list">
                                <div class="item" v-for="item in filterBankData" @click="changeBankAccountNameNew(item)">
                                    <span class="name">{{ item.bankAccountName }}/{{item.bankCard}}</span>
                                    <span class="unit" @click.stop="deleteBankAccountName(item)">删除</span>
                                </div>
                            </div>
                        </div>
                        <div class="groupList" v-show="filterAllSpBankData.length>0">
                            <div class="title">供应商关联银行卡</div>
                            <div class="list">
                                <div class="item" v-for="item in filterAllSpBankData" @click="changeBankAccountNameNew(item)">
                                    <span class="name">{{ item.bankAccountName }}/{{item.bankCard}}</span>
                                </div>
                            </div>
                        </div>                        
                        <div class="noData" v-show="filterBankData.length==0&&filterAllSpBankData.length==0">无匹配数据</div>
                    </div>
                  </el-popover>
                </td>
            </tr>
            <tr>
                <td>开户行</td>
                <td colspan="2">
                    <el-input v-model="request.bankDeposit" :disabled="hasSelectBank" placeholder="请输入开户银行以及支行" ></el-input>
                </td>
            </tr>
            <tr>
                <td rowspan="2">请款金额</td>
                <td>小写</td>
                <td colspan="3">
                    <el-input v-model="request.payFee" v-mydoubleval placeholder="请输入报销金额" @input="changeMoney" class="tl"></el-input>
                </td>
                <td>账号</td>
                <td colspan="2">
                    <el-input v-model="request.bankCard" :disabled="hasSelectBank" placeholder="请输入账户" ></el-input>
                </td>
            </tr>
            <tr>
                <td>大写</td>
                <td colspan="3">
                    <span class="blueFont inlineBlock" style="margin: 0 2% 0" >{{moneyArray[8]}}</span>佰
                    <span class="blueFont inlineBlock" style="margin: 0 2% 0" >{{moneyArray[7]}}</span>拾
                    <span class="blueFont inlineBlock" style="margin: 0 2% 0" >{{moneyArray[6]}}</span>万
                    <span class="blueFont inlineBlock" style="margin: 0 2% 0" >{{moneyArray[5]}}</span>仟
                    <span class="blueFont inlineBlock" style="margin: 0 2% 0" >{{moneyArray[4]}}</span>佰
                    <span class="blueFont inlineBlock" style="margin: 0 2% 0" >{{moneyArray[3]}}</span>拾
                    <span class="blueFont inlineBlock" style="margin: 0 2% 0" >{{moneyArray[2]}}</span>元
                    <span class="blueFont inlineBlock" style="margin: 0 2% 0" >{{moneyArray[1]}}</span>角
                    <span class="blueFont inlineBlock" style="margin: 0 2% 0" >{{moneyArray[0]}}</span>分
                </td>
                <td>联系人</td>
                <td colspan="2">
                    <el-input v-model="request.bankLinkman" :disabled="hasSelectBank" placeholder="非必填，请输入联系人" ></el-input>
                </td>
            </tr>
            <tr>
                <td colspan="2">支付方式</td>
                <td colspan="3">
                    <el-radio-group v-model="request.payType">
                        <el-radio :label="item.codeValue" v-for="item in payTypeData">{{item.codeName}}</el-radio>
                    </el-radio-group>
                </td>
                <td>电话</td>
                <td colspan="2">
                    <el-input v-model="request.bankPhone" v-mynumval :disabled="hasSelectBank" placeholder="非必填，请输入电话" ></el-input>
                </td>
            </tr>
            <tr>
                <td colspan="2">预计核销日期</td>
                <td>
                    <el-date-picker v-model="request.expectDate" type="date" class="tl" placeholder="默认当前日期"
                                    value-format="yyyy-MM-dd" @change="changeDate"></el-date-picker>
                </td>
                <td>采购费用申请</td>
                <td colspan="3">
                   <span v-for="(item, index) in request.applyArray">
                        <a href="javascript:void(0);" @click.stop="clickItem(item, index)" class="blueFont" v-if="index<3">{{index > 0 ? ',' + item.applyNum : item.applyNum}}</a>
                    </span>
                  <el-popover
                      placement="bottom"
                      width="200"
                      v-if="request.applyArray&&request.applyArray.length>3"
                      trigger="hover">
                    <div v-for="(item, index) in request.applyArray" style="text-align:center;border-bottom:1px dashed #eee;line-height: 30px;">
                      <a href="javascript:void(0);" style="font-weight:bold;" @click.stop="clickItem(item, index)" class="blueFont">{{item.applyNum}}</a>
                    </div>
                    <span class="blueFont" slot="reference" style="margin-left: 5px;font-size: 16px;letter-spacing: 2px;cursor: pointer;">...</span>
                  </el-popover>
<!--                    <a href="javascript:void(0);" @click.stop="clickItem(item, index)" class="blueFont" v-for="(item, index) in request.applyArray">{{index > 0 ? ',' + item.applyNum : item.applyNum}}</a>-->
                </td>
            </tr>
            <tr>
              <td colspan="2">合同编号</td>
              <td>
                <el-select v-model="request.contractId" placeholder="请选择合同编号" @change="changeContract" class="tl" filterable clearable>
                  <el-option v-for="item in contractData" :key="item.contractId" :label="item.contractName"
                             :value="item.contractId" :title="item.contractName" ></el-option>
                </el-select>
              </td>
              <td>付款条件</td>
              <td colspan="3" class="blueFont">
                <span v-show="request.accountPeriodName">账期见票结：{{request.accountPeriodName}}</span>
              </td>
            </tr>
            <tr>
                <td colspan="2">说明</td>
                <td colspan="6" style="padding:10px 20px;text-align:left;">
                    <span style="line-height: 30px">1、正确填写以上信息，如收款方信息错填而导致错转由请款人负责</span><br>
                    <span style="line-height: 30px">2、业务结束或对应发票到后需填写成本费用报销单核销</span><br>
                    <span style="line-height: 30px">3、所有签名必须自动带出审批日期</span><br>
                </td>
            </tr>
        </table>        
        <div class="uploadFile clearfix">
            <div class="fileListView">
                <div class="fileView">
                    <div class="label">附件：</div>
                    <div class="otherFile">
                        <my-simple-file-model-list ref="other" @successCallback="fileCallback" :switchFile="true" :success-callback-flag="true"></my-simple-file-model-list>
                    </div>
                </div>
                <div class="form fr">
                    部门审核人：
                    <el-select v-model="request.orgApplyUser"  placeholder="请选择部门审核人" filterable clearable>
                        <el-option v-for="item in orgUserData" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
                    </el-select>
                </div>
            </div>
            <div class="page-bot-btn" style="margin-top:40px;">
                <el-button @click="closePage()">关闭</el-button>
                <el-button type="primary" @click="saveOrUpdateRequestFee">提交</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import addRequestFee from './addRequestFee.js'

export default addRequestFee
</script>
<style scoped>
.mr_20{
    margin: 0 20px;
}
.blueFont{
    color: #0379FF;
}
</style>
<style lang="scss" src="./addRequestFee.scss" scoped></style>
