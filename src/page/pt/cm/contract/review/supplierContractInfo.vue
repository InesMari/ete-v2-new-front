<template>
    <div id="supplierContractInfo" class="contractPage">
        <div id="printTable">
          <div class="tableTitleContainer">
            <h3 class="tableTitle">供应商合同/协议评审记录</h3>
            <div class="contractNum" v-if="info.id&&type!=6">合同评审编号：{{info.contractNum}}</div>
          </div>
            <!--           公用基础信息             -->
            <table class="contractTable" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label" width="150px"><em>*</em>合同评审类型</td>
                    <td colspan="5">
                        <el-checkbox-group v-model="info.contractType" :disabled="disabled">
                            <el-checkbox v-for="item in contractTypeDate" :label="item.codeValue" :key="item.codeValue"
                                         @change="changeContractType(item.codeValue)">{{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <td class="label" width="150px"><em>*</em>合同类型</td>
                    <td colspan="5">
                        <el-radio-group v-model="info.contractParentType" disabled>
                            <el-radio v-for="item in contractParentTypeData" :label="item.codeValue" :key="item.codeValue">{{ item.codeName }}
                            </el-radio>
                        </el-radio-group>
                    </td>
                </tr>
                <tr>
                    <td class="label" width="150px">申请人</td>
                    <td class="blue">{{ info.createUserName }}</td>
                    <td class="label">申请部门</td>
                    <td class="blue">{{ info.orgName }}</td>
                    <td class="label">评审日期</td>
                    <td class="blue">{{ info.createDate }}</td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>{{info.contractType != 8 ? "供应商名称" : "保险公司名称"}}</td>
                    <td>
                        <el-input v-model="info.tenantName" maxlength="100" :placeholder="info.contractType != 8 ? '供应商名称' : '保险公司名称'"
                                  :disabled="disabled"></el-input>
                    </td>
                    <td class="label"><em>*</em>结算主体</td>
                    <td>
                        <el-select v-model="info.settleBody" placeholder="请选择结算主体" filterable clearable
                                   style="width: 100%;" :disabled="disabled">
                            <el-option v-for="item in payTitleOptions" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label"><em>*</em>表单启用</td>
                    <td>{{ info.fromDate }}</td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>评审人员</td>
                    <td class="reviewUserList" colspan="5">
                        <div style="float: left;margin-right: 20px;" v-for="item in info.reviewUserList">
                            {{ item.orgName }}：
                            <el-select v-model="item.userId" placeholder="请选择负责人" :disabled="disabled">
                                <el-option
                                        v-for="subItem in item.userData"
                                        :key="subItem.userId"
                                        :label="subItem.userName"
                                        :value="subItem.userId">
                                </el-option>
                            </el-select>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>申请事由</td>
                    <td colspan="5">
                        <el-input v-model="info.remark" placeholder="请填写申请事由" :disabled="disabled"></el-input>
                    </td>
                </tr>
            </table>
            <!--           公用基础信息             -->

            <!--            旧的合同类型            -->
            <table class="contractTable" v-show="(info.contractType != 9
                                                    && info.contractType != 3
                                                    && info.contractType != 4
                                                    && info.contractType != 5
                                                    && info.contractType != 6
                                                    && info.contractType != 7
                                                    && info.contractType != 8
                                                    && info.contractType != 12) || info.isOld"
                   border="0" cellspacing="0" cellpadding="0" style="border-top: 0;">
                <tr>
                    <td class="label" width="150px"><em>*</em>合同类别</td>
                    <td colspan="5">
                        <el-checkbox-group v-model="info.contractClass" :disabled="disabled">
                            <el-checkbox v-for="item in contractClassData" :label="item.codeValue"
                                         :key="item.codeValue">{{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
              <tr>
                <td class="label" width="150px"><em>*</em>{{info.workId>0?'关联中心':'关联部门'}}</td>
                <td colspan="5">
                  <el-select v-model="info.workId" placeholder="请选择关联中心" filterable clearable
                             style="width: 100%;" :disabled="disabled"
                             @change="changeStoreHouse" v-if="info.workId>0">
                    <el-option v-for="item in storeHouseData" :key="item.workId" :label="item.workName"
                               :value="item.workId"></el-option>
                  </el-select>
                  <el-select v-model="info.relOrgId" placeholder="请选择关联部门"
                             style="width: 100%;" :disabled="disabled"
                             filterable clearable @change="changeStoreHouse" v-else>
                    <el-option v-for="item in orgData" :key="item.id" :label="item.orgName"
                               :value="item.id" :disabled="item.disabled"></el-option>
                  </el-select>
                </td>
              </tr>
                <tr>
                    <td class="label" rowspan="7">供应商主体资质审核</td>
                    <td colspan="5">
                        <em>*</em> 1.运输区域：
                        <el-checkbox-group v-model="info.transitAreas" style="margin-left:20px;" :disabled="disabled">
                            <el-checkbox v-for="item in transitAreasData" :label="item.codeValue" :key="item.codeValue">
                                {{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <em>*</em>2.相关证照：
                        <el-checkbox-group v-model="info.certificate" style="margin-left:20px;" :disabled="disabled">
                            <el-checkbox v-for="item in certificateData" :label="item.codeValue" :key="item.codeValue">
                                {{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <em>*</em>3.相关资质：
                        <el-checkbox-group v-model="info.qualification" style="margin-left:20px;" :disabled="disabled">
                            <el-checkbox v-for="item in qualificationData" :label="item.codeValue"
                                         :key="item.codeValue">{{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <em>*</em>4.成立日期：
                        <el-date-picker v-model="info.establishmentDate" :disabled="disabled" type="date"
                                        placeholder="选择日期" value-format="yyyy-MM-dd" style="margin-left:10px;">
                        </el-date-picker>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <em>*</em>5.注册资本：
                        <el-input v-model="info.registeredCapital" :disabled="disabled" placeholder="按营业执照填写"
                                  style="width:80%;margin-left:20px;"></el-input>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <em>*</em>6.注册地址：
                        <el-input v-model="info.registeredAddress" :disabled="disabled" placeholder="按营业执照填写"
                                  style="width:80%;margin-left:20px;"></el-input>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <em>*</em>7.垫资能力：
                        <el-checkbox-group v-model="info.provideLoans" style="margin-left:20px;" :disabled="disabled">
                            <el-checkbox v-for="item in provideLoansData" :label="item.codeValue" :key="item.codeValue"
                                         @change="checkbox('provideLoans',item.codeValue)">{{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <td class="label" rowspan="7">服务或资质要求与风险防范</td>
                    <td colspan="5">
                        <span class="innerT"><em>*</em>1. 产品类：生产许可、产品检测报告、质量认证。</span>
                        <el-checkbox-group v-model="info.prods" :disabled="disabled">
                            <el-checkbox v-for="item in haveOrNotData" :label="item.codeValue" :key="item.codeValue"
                                         @change="checkbox('prods',item.codeValue)">{{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <span class="innerT"><em>*</em>2. 体系认证及安全：ISO 质量认证体系、安全、消防资质。</span>
                        <el-checkbox-group v-model="info.systemCertification" :disabled="disabled">
                            <el-checkbox v-for="item in haveOrNotData" :label="item.codeValue" :key="item.codeValue"
                                         @change="checkbox('systemCertification',item.codeValue)">{{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <span class="innerT"><em>*</em>3. 场地（厂房）房屋产权证。</span>
                        <el-checkbox-group v-model="info.certificateOfTitle" :disabled="disabled">
                            <el-checkbox v-for="item in haveOrNotData" :label="item.codeValue" :key="item.codeValue"
                                         @change="checkbox('certificateOfTitle',item.codeValue)">{{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <span class="innerT"><em>*</em>4. 是否相关保险（车辆险、运输险、货物险、财产险）。</span>
                        <el-checkbox-group v-model="info.insurance" :disabled="disabled">
                            <el-checkbox v-for="item in haveOrNotData" :label="item.codeValue" :key="item.codeValue"
                                         @change="checkbox('insurance',item.codeValue)">{{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <span class="innerT"><em>*</em>5. 合作风险防范措施/方案：</span>
                        <el-checkbox-group v-model="info.riskPlan" :disabled="disabled">
                            <el-checkbox v-for="item in haveOrNotData" :label="item.codeValue" :key="item.codeValue"
                                         @change="checkbox('riskPlan',item.codeValue)">{{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                        <div style="display:inline-block;margin-left:30px">
                            请列出：
                            <el-input v-model="info.riskPlanRemark" :disabled="disabled"
                                      placeholder="请输入合作风险防范措施" style="width:250px;"></el-input>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <em>*</em>6.履约期限：
                        <el-date-picker :disabled="disabled"
                                        v-model="info.keepDate"
                                        type="daterange"
                                        value-format="yyyy-MM-dd"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                        >
                        </el-date-picker>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <em>*</em>7. 合同纠纷法院：
                        <el-input v-model="info.disputeCourt" :disabled="disabled" placeholder="请输入合作纠纷法院名称"
                                  style="width:80%;"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label"
                        rowspan="6">结款条件
                    </td>
                    <td colspan="5">
                        <span class="innerLable"><em>*</em>1. 付款方式：</span>
                        <el-checkbox-group v-model="info.payMode" :disabled="disabled">
                            <el-checkbox v-for="item in payModeData" :label="item.codeValue" :key="item.codeValue"
                                         @change="checkbox('payMode',item.codeValue)">{{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <span class="innerLable">2. 对账：</span>
                        每月
                        <el-input placeholder="请填写" v-mynumval v-model="info.reconciliationDate" class="innerIpt"
                                  :disabled="disabled"></el-input
                        >
                        号前对账，每月
                        <el-input placeholder="请填写" v-mynumval v-model="info.invoiceDate" class="innerIpt"
                                  :disabled="disabled"></el-input>
                        号前交发票
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <span class="innerLable"><em>*</em>3.发票：</span>
                        <el-checkbox-group v-model="info.invoiceType" :disabled="disabled">
                            <el-checkbox v-for="item in invoiceTypeData" :label="item.codeValue" :key="item.codeValue"
                                         @change="checkbox('invoiceType',item.codeValue)">{{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <span class="innerLable"><em>*</em>4.税率：</span>
                        <el-checkbox-group v-model="info.taxRate" :disabled="disabled">
                            <el-checkbox v-for="item in taxRateData" :label="item.codeValue" :key="item.codeValue">
                                {{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <span class="innerLable"><em>*</em>5.账期见票结：</span>
                        <el-checkbox-group v-model="info.accountPeriod" :disabled="disabled">
                            <el-checkbox v-for="item in accountPeriodData" :label="item.codeValue" :key="item.codeValue"
                                         @change="checkbox('accountPeriod',item.codeValue)">{{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                        <div style="display:inline-block;margin-left:30px">
                            请列出：
                            <el-input v-model="info.accountPeriodValue" :disabled="disabled" placeholder="请输入"
                                      style="width:250px;"></el-input>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <span class="innerLable"><em>*</em>6.押金：</span>
                        <el-checkbox-group v-model="info.deposit" :disabled="disabled">
                            <el-checkbox v-for="item in haveOrNotData" :label="item.codeValue" :key="item.codeValue"
                                         @change="checkbox('deposit',item.codeValue)">{{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                        <div style="display:inline-block;margin-left:30px">支付/退回期限
                            <el-input v-model="info.returnDate" v-mynumval placeholder="请输入" class="innerIpt"
                                      :disabled="disabled"></el-input>天
                        </div>
                    </td>
                </tr>
            </table>
            <!--            旧的合同类型            -->

            <!--            仓储租赁            -->
            <table class="contractTable" v-if="info.contractType == 9 && !info.isOld"
                   border="0" cellspacing="0" cellpadding="0" style="border-top: 0;">
                <tr>
                    <td class="label" width="150px"><em>*</em>合同类别</td>
                    <td colspan="5">
                        <el-checkbox-group v-model="info.contractClass" :disabled="disabled">
                            <el-checkbox v-for="item in contractClassData" :label="item.codeValue"
                                         :key="item.codeValue">{{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>{{info.workId>0?'关联中心':'关联部门'}}</td>
                    <td>
                        <el-select v-model="info.workId" placeholder="请选择关联中心" filterable clearable
                                   style="width: 100%;" :disabled="disabled"
                                    @change="changeStoreHouse" v-if="info.workId>0">
                            <el-option v-for="item in storeHouseData" :key="item.workId" :label="item.workName"
                                       :value="item.workId"></el-option>
                        </el-select>

                      <el-select v-model="info.relOrgId" placeholder="请选择关联部门"
                                 style="width: 100%;" :disabled="disabled"
                                 filterable clearable @change="changeStoreHouse" v-else>
                        <el-option v-for="item in orgData" :key="item.id" :label="item.orgName"
                                   :value="item.id" :disabled="item.disabled"></el-option>
                      </el-select>
                    </td>
                    <td class="label"><em>*</em>租赁面积</td>
                    <td>
                        <el-input v-model="info.leaseArea" v-mydouble4val placeholder="租赁面积"
                                  :disabled="disabled"></el-input>
                    </td>
                    <td class="label"><em>*</em>租赁单价</td>
                    <td>
                        <el-input v-model="info.leasePrice" v-mydouble4val placeholder="租赁单价"
                                  :disabled="disabled"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">仓库总面积</td>
                    <td>
                        <el-input v-model="info.storeHouseArea" v-mydouble4val placeholder="仓库总面积"
                                  :disabled="disabled"></el-input>
                    </td>
                    <td class="label">管理费</td>
                    <td>
                        <el-input v-model="info.manageFee" v-mydouble4val placeholder="管理费"
                                  :disabled="disabled"></el-input>
                    </td>
                    <td class="label">其他费用</td>
                    <td>
                        <el-input v-model="info.otherFee" v-mydouble4val placeholder="其他费用"
                                  :disabled="disabled"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">月度费用</td>
                    <td colspan="5">
                        <el-input v-model="info.monthFee" v-mydouble4val placeholder="月度费用"
                                  :disabled="disabled"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>仓库消防等级</td>
                    <td colspan="5">
                        <el-checkbox-group v-model="info.storeHouseFireGrade" :disabled="disabled">
                            <el-checkbox v-for="item in storeHouseFireGradeData" :label="item.codeValue" :key="item.codeValue"
                                         @change="checkbox('storeHouseFireGrade',item.codeValue)">{{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>租赁合同期限</td>
                    <td colspan="2">
                        <el-date-picker v-model="info.keepDate" type="daterange" range-separator="至"
                                        start-placeholder="开始日期" end-placeholder="结束日期"
                                        value-format="yyyy-MM-dd" format="yyyy-MM-dd" unlink-panels>
                        </el-date-picker>
                    </td>
                    <td class="label"><em>*</em>客户合同期限</td>
                    <td colspan="2">
                        <el-date-picker v-model="info.customerContractDateRange" type="daterange" range-separator="至"
                                        start-placeholder="开始日期" end-placeholder="结束日期"
                                        value-format="yyyy-MM-dd" format="yyyy-MM-dd" unlink-panels>
                        </el-date-picker>
                    </td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>营业执照</td>
                    <td>
                        <div class="uploadFile clearfix" v-if="type!=4">
                            <div>
                                <myFileModel ref="businessLicense"
                                             @successCallback="successCallback"
                                             @delCallback="deleteCallback"
                                             componentId="businessLicense"
                                             :disabledEdit="disabled"
                                             :disabledDel="disabled">
                                </myFileModel>
                                <p>只支持.jpg .png .pdf .xls .xlsx格式</p>
                            </div>
                        </div>
                    </td>
                    <td class="label"><em>*</em>消防验收证明</td>
                    <td>
                        <div class="uploadFile clearfix" v-if="type!=4">
                            <div>
                                <myFileModel ref="fireInspectionCertificate"
                                             @successCallback="successCallback"
                                             @delCallback="deleteCallback"
                                             componentId="fireInspectionCertificate"
                                             :disabledEdit="disabled"
                                             :disabledDel="disabled">
                                </myFileModel>
                                <p>只支持.jpg .png .pdf .xls .xlsx格式</p>
                            </div>
                        </div>
                    </td>
                    <td class="label"><em>*</em>房产证</td>
                    <td>
                        <div class="uploadFile clearfix" v-if="type!=4">
                            <div>
                                <myFileModel ref="propertyOwnershipCertificate"
                                             @successCallback="successCallback"
                                             @delCallback="deleteCallback"
                                             componentId="propertyOwnershipCertificate"
                                             :disabledEdit="disabled"
                                             :disabledDel="disabled">
                                </myFileModel>
                                <p>只支持.jpg .png .pdf .xls .xlsx格式</p>
                            </div>
                        </div>
                    </td>
                </tr>
              <tr>
                <td class="label"><em>*</em>物品移交表</td>
                <td>
                  <div class="uploadFile clearfix" v-if="type!=4">
                    <div>
                      <myFileModel ref="deliveryMaterielList"
                                   @successCallback="successCallback"
                                   @delCallback="deleteCallback"
                                   componentId="deliveryMaterielList"
                                   :disabledEdit="disabled"
                                   :disabledDel="disabled">
                      </myFileModel>
                      <p>只支持.jpg .png .pdf .xls .xlsx格式</p>
                    </div>
                  </div>
                </td>
                <td class="label"><em>*</em>房东身份证复制件</td>
                <td>
                  <div class="uploadFile uploadFiles clearfix" v-if="type!=4">
                    <div style="margin-bottom:20px;">
                      <myFileModel ref="idCardFront"
                                   @successCallback="successCallback"
                                   @delCallback="deleteCallback"
                                   componentId="idCardFront"
                                   supportFiles="img"
                                   :disabledEdit="disabled"
                                   :disabledDel="disabled">
                      </myFileModel>
                      <p>身份证正面，只支持.jpg .png格式</p>
                    </div>
                    <div>
                      <myFileModel ref="idCardBack"
                                   @successCallback="successCallback"
                                   @delCallback="deleteCallback"
                                   componentId="idCardBack"
                                   supportFiles="img"
                                   :disabledEdit="disabled"
                                   :disabledDel="disabled">
                      </myFileModel>
                      <p>身份证反面，只支持.jpg .png格式</p>
                    </div>
                  </div>
                </td>
                <td class="label"><em>*</em>房屋布局图</td>
                <td>
                  <div class="uploadFile clearfix" v-if="type!=4">
                    <div>
                      <myFileModel ref="housePlan"
                                   @successCallback="successCallback"
                                   @delCallback="deleteCallback"
                                   componentId="housePlan"
                                   :disabledEdit="disabled"
                                   :disabledDel="disabled">
                      </myFileModel>
                      <p>只支持.jpg .png .pdf .xls .xlsx格式</p>
                    </div>
                  </div>
                </td>
              </tr>
                <tr>
                    <td class="label" rowspan="6">结款条件
                    </td>
                    <td colspan="5">
                        <span class="innerLable"><em>*</em>1. 付款方式：</span>
                        <el-checkbox-group v-model="info.payMode" :disabled="disabled">
                            <el-checkbox v-for="item in payModeData" :label="item.codeValue" :key="item.codeValue"
                                         @change="checkbox('payMode',item.codeValue)">{{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <span class="innerLable"><em>*</em>2. 对账：</span>
                        每月
                        <el-input placeholder="请填写" v-mynumval v-model="info.reconciliationDate"
                                  class="innerIpt" :disabled="disabled">
                        </el-input>
                        号前对账，每月
                        <el-input placeholder="请填写" v-mynumval v-model="info.invoiceDate"
                                  class="innerIpt" :disabled="disabled">
                        </el-input>
                        号前交发票
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <span class="innerLable"><em>*</em>3.发票：</span>
                        <el-checkbox-group v-model="info.invoiceType" :disabled="disabled">
                            <el-checkbox v-for="item in invoiceTypeData" :label="item.codeValue" :key="item.codeValue"
                                         @change="checkbox('invoiceType',item.codeValue)">{{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <span class="innerLable"><em>*</em>4.税率：</span>
                        <el-checkbox-group v-model="info.taxRate" :disabled="disabled">
                            <el-checkbox v-for="item in taxRateData" :label="item.codeValue" :key="item.codeValue">
                                {{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <span class="innerLable"><em>*</em>5.账期见票结：</span>
                        <el-checkbox-group v-model="info.accountPeriod" :disabled="disabled">
                            <el-checkbox v-for="item in accountPeriodData" :label="item.codeValue" :key="item.codeValue"
                                         @change="checkbox('accountPeriod',item.codeValue)">{{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                        <div style="display:inline-block;margin-left:30px">
                            请列出：
                            <el-input v-model="info.accountPeriodValue" :disabled="disabled" placeholder="请输入" style="width:250px;"></el-input>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <span class="innerLable"><em>*</em>6.押金：</span>
                        <el-checkbox-group v-model="info.deposit" :disabled="disabled">
                            <el-checkbox v-for="item in haveOrNotData" :label="item.codeValue" :key="item.codeValue"
                                         @change="checkbox('deposit',item.codeValue)">{{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                        <div style="display:inline-block;margin-left:30px">支付/退回期限
                            <el-input v-model="info.returnDate" v-mynumval placeholder="请输入" class="innerIpt" :disabled="disabled"></el-input>天
                        </div>
                    </td>
                </tr>
            </table>
            <!--            仓储租赁            -->

            <!--            仓储服务            -->
            <table class="contractTable" v-show="(info.contractType >= 3 && info.contractType <= 7)  && !info.isOld"
                   border="0" cellspacing="0" cellpadding="0" style="border-top: 0;">
                <tr>
                    <td class="label" width="150px"><em>*</em>合同类别</td>
                    <td colspan="5">
                        <el-checkbox-group v-model="info.contractClass" :disabled="disabled">
                            <el-checkbox v-for="item in contractClassData" :label="item.codeValue"
                                         :key="item.codeValue">{{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>{{info.workId>0?'关联中心':'关联部门'}}</td>
                    <td>
                        <el-select v-model="info.workId" placeholder="请选择关联中心" filterable clearable @change="changeStoreHouseBase"
                                   style="width: 100%;" :disabled="disabled" v-if="info.workId>0">
                            <el-option v-for="item in storeHouseData" :key="item.workId" :label="item.workName"
                                       :value="item.workId"></el-option>
                        </el-select>

                      <el-select v-model="info.relOrgId" placeholder="请选择关联部门"
                                 style="width: 100%;" :disabled="disabled"
                                 filterable clearable @change="changeStoreHouse" v-else>
                        <el-option v-for="item in orgData" :key="item.id" :label="item.orgName"
                                   :value="item.id" :disabled="item.disabled"></el-option>
                      </el-select>
                    </td>
                    <td class="label">月度费用</td>
                    <td colspan="3">
                        <el-input v-model="info.monthFee" maxlength="100" v-mydouble4val  placeholder="月度费用"
                                  :disabled="disabled"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>合同期限</td>
                    <td colspan="5">
                        <el-date-picker v-model="info.keepDate" type="daterange" range-separator="至"
                                        start-placeholder="开始日期" end-placeholder="结束日期" :disabled="disabled"
                                        value-format="yyyy-MM-dd" format="yyyy-MM-dd" unlink-panels>
                        </el-date-picker>
                    </td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>营业执照</td>
                    <td colspan="5">
                        <div class="uploadFile clearfix" v-if="type!=4">
                            <div class="fl mr_20" >
                                <myFileModel ref="businessLicense2"
                                             @successCallback="successCallback"
                                             @delCallback="deleteCallback"
                                             componentId="businessLicense2"
                                             :disabledEdit="disabled"
                                             :disabledDel="disabled">
                                </myFileModel>
                                <p>只支持.jpg .png .pdf .xls .xlsx格式</p>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="label" rowspan="6">结款条件
                    </td>
                    <td colspan="5">
                        <span class="innerLable"><em>*</em>1. 付款方式：</span>
                        <el-checkbox-group v-model="info.payMode" :disabled="disabled">
                            <el-checkbox v-for="item in payModeData" :label="item.codeValue" :key="item.codeValue"
                                         @change="checkbox('payMode',item.codeValue)">{{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <span class="innerLable"><em>*</em>2. 对账：</span>
                        每月
                        <el-input placeholder="请填写" v-model="info.reconciliationDate" v-mynumval class="innerIpt"
                                  :disabled="disabled">
                        </el-input>
                        号前对账，每月
                        <el-input placeholder="请填写" v-model="info.invoiceDate" v-mynumval class="innerIpt"
                                  :disabled="disabled">
                        </el-input>
                        号前交发票
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <span class="innerLable"><em>*</em>3.发票：</span>
                        <el-checkbox-group v-model="info.invoiceType" :disabled="disabled">
                            <el-checkbox v-for="item in invoiceTypeData" :label="item.codeValue" :key="item.codeValue"
                                         @change="checkbox('invoiceType',item.codeValue)">{{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <span class="innerLable"><em>*</em>4.税率：</span>
                        <el-checkbox-group v-model="info.taxRate" :disabled="disabled">
                            <el-checkbox v-for="item in taxRateData" :label="item.codeValue" :key="item.codeValue">
                                {{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <span class="innerLable"><em>*</em>5.账期见票结：</span>
                        <el-checkbox-group v-model="info.accountPeriod" :disabled="disabled">
                            <el-checkbox v-for="item in accountPeriodData" :label="item.codeValue" :key="item.codeValue"
                                         @change="checkbox('accountPeriod',item.codeValue)">{{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                        <div style="display:inline-block;margin-left:30px">
                            请列出：
                            <el-input v-model="info.accountPeriodValue" :disabled="disabled" placeholder="请输入" style="width:250px;"></el-input>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <span class="innerLable"><em>*</em>6.押金：</span>
                        <el-checkbox-group v-model="info.deposit" :disabled="disabled">
                            <el-checkbox v-for="item in haveOrNotData" :label="item.codeValue" :key="item.codeValue"
                                         @change="checkbox('deposit',item.codeValue)">{{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                        <div style="display:inline-block;margin-left:30px">支付/退回期限
                            <el-input v-model="info.returnDate" v-mynumval placeholder="请输入" class="innerIpt" :disabled="disabled"></el-input>天
                        </div>
                    </td>
                </tr>
            </table>
            <!--            仓储服务            -->

            <!--            保险            -->
            <table class="contractTable" v-if="info.contractType == 8 && !info.isOld"
                   border="0" cellspacing="0" cellpadding="0" style="border-top: 0;">
                <tr>
                    <td class="label" width="150px"><em>*</em>保险种类</td>
                    <td colspan="5">
                        <el-checkbox-group v-model="info.contractContent" :disabled="disabled">
                            <el-checkbox v-for="item in contractContentData" :label="item.codeValue"
                                         @change="checkbox('contractContent',item.codeValue)" :key="item.codeValue">{{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                        <div style="display:inline-block;margin-left:30px">
                            请列出：
                            <el-input v-model="info.contractContentValue" :disabled="disabled" placeholder="请输入" style="width:250px;"></el-input>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>{{info.workIds!=null&&info.workIds.length>0>0?'保险对象中心':'保险对象部门'}}</td>
                    <td colspan="5">
                        <el-select v-model="info.workIds" placeholder="请选择保险对象中心" filterable multiple clearable
                                   style="width: 100%;" :disabled="disabled" @change="$forceUpdate()" v-if="info.workIds!=null&&info.workIds.length>0">
                            <el-option v-for="item in storeHouseData" :key="item.workId" :label="item.workName"
                                       :value="item.workId"></el-option>
                        </el-select>

                      <el-select v-model="info.relOrgIds" placeholder="请选择关联保险部门"
                                 style="width: 100%;" :disabled="disabled" @change="$forceUpdate()"
                                 filterable multiple clearable v-else>
                        <el-option v-for="item in orgData" :key="item.id" :label="item.orgName"
                                   :value="item.id" :disabled="item.disabled"></el-option>
                      </el-select>
                    </td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>保险期限</td>
                    <td colspan="5">
                        <el-date-picker v-model="info.keepDate" type="daterange" range-separator="至"
                                        start-placeholder="开始日期" end-placeholder="结束日期" :disabled="disabled"
                                        value-format="yyyy-MM-dd" format="yyyy-MM-dd" unlink-panels>
                        </el-date-picker>
                    </td>
                </tr>
                <tr>
                    <td class="label" rowspan="3"><em>*</em>保险公司信息</td>
                    <td colspan="5">
                        <div class="uploadFile clearfix" v-if="type!=4">
                            <div class="fl mr_20">
                                <myFileModel ref="businessLicense9"
                                             @successCallback="successCallback"
                                             @delCallback="deleteCallback"
                                             componentId="businessLicense9"
                                             :disabledEdit="disabled"
                                             :disabledDel="disabled">
                                </myFileModel>
                                <p>营业执照</p>
                            </div>

                            <!--                                <div class="fl mr_20" >
                                                                <myFileModel ref="idCardFront"
                                                                             @successCallback="successCallback"
                                                                             @delCallback="deleteCallback"
                                                                             componentId="idCardFront"
                                                                             :disabledEdit="disabled"
                                                                             :disabledDel="disabled">
                                                                </myFileModel>
                                                                <p>身份证正面</p>
                                                            </div>
                                                            <div class="fl mr_20" >
                                                                <myFileModel ref="idCardBack"
                                                                             @successCallback="successCallback"
                                                                             @delCallback="deleteCallback"
                                                                             componentId="idCardBack"
                                                                             :disabledEdit="disabled"
                                                                             :disabledDel="disabled">
                                                                </myFileModel>
                                                                <p>身份证反面</p>
                                                            </div>
                                                            <div class="fl mr_20">
                                                                <myFileModel ref="certificateEmployment"
                                                                             @successCallback="successCallback"
                                                                             @delCallback="deleteCallback"
                                                                             componentId="certificateEmployment"
                                                                             :disabledEdit="disabled"
                                                                             :disabledDel="disabled">
                                                                </myFileModel>
                                                                <p>单位在职证明</p>
                                                            </div>-->

                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="label">法定代表人</td>
                    <td>
                        <el-input v-model="info.legalRepresentative" placeholder="请填写法定代表人" :disabled="disabled"></el-input>
                    </td>
                    <td class="label">经营范围</td>
                    <td colspan="2">
                        <el-input v-model="info.businessScope" placeholder="请填写经营范围" :disabled="disabled"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">成立日期</td>
                    <td>
                        <el-date-picker v-model="info.dateEstablishment" type="date" class="tl" placeholder="请选择成立日期"
                                        value-format="yyyy-MM-dd" format="yyyy-MM-dd" :disabled="disabled" @input="$forceUpdate"></el-date-picker>
                    </td>
                    <td class="label">注册地址</td>
                    <td colspan="2">
                        <el-input v-model="info.insuranceRegisteredAddress" placeholder="请填写注册地址" :disabled="disabled"></el-input>
                    </td>
                </tr>


                <tr>
                    <td class="label" rowspan="4"><em>*</em>保险代理机构信息</td>
                    <td colspan="2" rowspan="2">
                        <div class="uploadFile clearfix" v-if="type!=4">
                            <div class="fl mr_20">
                                <myFileModel ref="businessLicense3"
                                             @successCallback="successCallback"
                                             @delCallback="deleteCallback"
                                             componentId="businessLicense3"
                                             :disabledEdit="disabled"
                                             :disabledDel="disabled">
                                </myFileModel>
                                <p>营业执照</p>
                            </div>
                        </div>
                    </td>
                    <td class="label">代理机构姓名</td>
                    <td colspan="2">
                        <el-input v-model="info.agentName" placeholder="请填写代理机构姓名" :disabled="disabled"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">代理机构电话</td>
                    <td colspan="2">
                        <el-input v-model="info.agentBill" placeholder="请填写代理机构电话" :disabled="disabled"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">法定代表人</td>
                    <td>
                        <el-input v-model="info.agentLegalRepresentative" placeholder="请填写法定代表人" :disabled="disabled"></el-input>
                    </td>
                    <td class="label">经营范围</td>
                    <td colspan="2">
                        <el-input v-model="info.agentBusinessScope" placeholder="请填写经营范围" :disabled="disabled"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">成立日期</td>
                    <td>
                        <el-date-picker v-model="info.agentDateEstablishment" type="date" class="tl" placeholder="请选择成立日期"
                                        value-format="yyyy-MM-dd" format="yyyy-MM-dd" :disabled="disabled" @input="$forceUpdate"></el-date-picker>
                    </td>
                    <td class="label">注册地址</td>
                    <td colspan="2">
                        <el-input v-model="info.agentRegisteredAddress" placeholder="请填写注册地址" :disabled="disabled"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label" rowspan="6">结款条件
                    </td>
                    <td colspan="5">
                        <span class="innerLable"><em>*</em>1. 付款方式：</span>
                        <el-checkbox-group v-model="info.payMode" :disabled="disabled">
                            <el-checkbox v-for="item in payModeData" :label="item.codeValue" :key="item.codeValue"
                                         @change="checkbox('payMode',item.codeValue)">{{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <span class="innerLable"><em>*</em>2. 付款条件：</span>
                        <el-checkbox-group v-model="info.payCondition" :disabled="disabled">

                            <el-checkbox v-for="item in payConditionData" :label="item.codeValue" :key="item.codeValue"
                                         @change="checkbox('payCondition',item.codeValue)">{{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                        <div style="display:inline-block;margin-left:30px">
                            请列出：
                            <el-input v-model="info.payConditionValue" :disabled="disabled" placeholder="请输入" style="width:250px;"></el-input>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <span class="innerLable"><em>*</em>3.发票：</span>
                        <el-checkbox-group v-model="info.invoiceType" :disabled="disabled">
                            <el-checkbox v-for="item in invoiceTypeData" :label="item.codeValue" :key="item.codeValue"
                                         @change="checkbox('invoiceType',item.codeValue)">{{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
                <tr>
                    <td colspan="5">
                        <span class="innerLable"><em>*</em>4.税率：</span>
                        <el-checkbox-group v-model="info.taxRate" :disabled="disabled">
                            <el-checkbox v-for="item in taxRateData" :label="item.codeValue" :key="item.codeValue">
                                {{ item.codeName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </td>
                </tr>
            </table>
            <!--            保险            -->


          <!--            其他            -->
          <table class="contractTable" v-show="info.contractType == 12 && !info.isOld"
                 border="0" cellspacing="0" cellpadding="0" style="border-top: 0;">
            <tr>
              <td class="label" width="150px"><em>*</em>合同类别</td>
              <td colspan="5">
                <el-checkbox-group v-model="info.contractClass" :disabled="disabled">
                  <el-checkbox v-for="item in contractClassData" :label="item.codeValue"
                               :key="item.codeValue">{{ item.codeName }}
                  </el-checkbox>
                </el-checkbox-group>
              </td>
            </tr>
            <tr>
              <td class="label" width="150px"><em>*</em>{{info.workId>0?'关联中心':'关联部门'}}</td>
              <td colspan="5">
                <el-select v-model="info.workId" placeholder="请选择关联中心" filterable clearable
                           style="width: 100%;" :disabled="disabled"
                           @change="changeStoreHouse" v-if="info.workId>0">
                  <el-option v-for="item in storeHouseData" :key="item.workId" :label="item.workName"
                             :value="item.workId"></el-option>
                </el-select>
                <el-select v-model="info.relOrgId" placeholder="请选择关联部门"
                           style="width: 100%;" :disabled="disabled"
                           filterable clearable @change="changeStoreHouse" v-else>
                  <el-option v-for="item in orgData" :key="item.id" :label="item.orgName"
                             :value="item.id" :disabled="item.disabled"></el-option>
                </el-select>
              </td>
            </tr>
            <tr>
              <td class="label" rowspan="5">供应商主体资质审核</td>
              <td colspan="5">
                <em>*</em>1.相关证照：
                <el-checkbox-group v-model="info.certificate" style="margin-left:20px;" :disabled="disabled">
                  <el-checkbox v-for="item in certificateData" :label="item.codeValue" :key="item.codeValue">
                    {{ item.codeName }}
                  </el-checkbox>
                </el-checkbox-group>
              </td>
            </tr>
            <tr>
              <td colspan="5">
                <em>*</em>2.相关资质：
                <el-checkbox-group v-model="info.qualification" style="margin-left:20px;" :disabled="disabled">
                  <el-checkbox v-for="item in qualificationData" :label="item.codeValue"
                               :key="item.codeValue">{{ item.codeName }}
                  </el-checkbox>
                </el-checkbox-group>
              </td>
            </tr>
            <tr>
              <td colspan="5">
                <em>*</em>3.成立日期：
                <el-date-picker v-model="info.establishmentDate" :disabled="disabled" type="date"
                                placeholder="选择日期" value-format="yyyy-MM-dd" style="margin-left:10px;">
                </el-date-picker>
              </td>
            </tr>
            <tr>
              <td colspan="5">
                <em>*</em>4.注册资本：
                <el-input v-model="info.registeredCapital" :disabled="disabled" placeholder="按营业执照填写"
                          style="width:80%;margin-left:20px;"></el-input>
              </td>
            </tr>
            <tr>
              <td colspan="5">
                <em>*</em>5.注册地址：
                <el-input v-model="info.registeredAddress" :disabled="disabled" placeholder="按营业执照填写"
                          style="width:80%;margin-left:20px;"></el-input>
              </td>
            </tr>
            <tr>
              <td class="label" rowspan="2">服务或资质要求与风险防范</td>
              <td colspan="5">
                <em>*</em>1.履约期限：
                <el-date-picker :disabled="disabled"
                                v-model="info.keepDate"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                >
                </el-date-picker>
              </td>
            </tr>
            <tr>
              <td colspan="5">
                <em>*</em>2. 合同纠纷法院：
                <el-input v-model="info.disputeCourt" :disabled="disabled" placeholder="请输入合作纠纷法院名称"
                          style="width:80%;"></el-input>
              </td>
            </tr>
            <tr>
              <td class="label"
                  rowspan="6">结款条件
              </td>
              <td colspan="5">
                <span class="innerLable"><em>*</em>1. 付款方式：</span>
                <el-checkbox-group v-model="info.payMode" :disabled="disabled">
                  <el-checkbox v-for="item in payModeData" :label="item.codeValue" :key="item.codeValue"
                               @change="checkbox('payMode',item.codeValue)">{{ item.codeName }}
                  </el-checkbox>
                </el-checkbox-group>
              </td>
            </tr>
            <tr>
              <td colspan="5">
                <span class="innerLable"><em>*</em>2. 对账：</span>
                每月
                <el-input placeholder="请填写" v-mynumval v-model="info.reconciliationDate" class="innerIpt"
                          :disabled="disabled"></el-input
                >
                号前对账，每月
                <el-input placeholder="请填写" v-mynumval v-model="info.invoiceDate" class="innerIpt"
                          :disabled="disabled"></el-input>
                号前交发票
              </td>
            </tr>
            <tr>
              <td colspan="5">
                <span class="innerLable"><em>*</em>3.发票：</span>
                <el-checkbox-group v-model="info.invoiceType" :disabled="disabled">
                  <el-checkbox v-for="item in invoiceTypeData" :label="item.codeValue" :key="item.codeValue"
                               @change="checkbox('invoiceType',item.codeValue)">{{ item.codeName }}
                  </el-checkbox>
                </el-checkbox-group>
              </td>
            </tr>
            <tr>
              <td colspan="5">
                <span class="innerLable"><em>*</em>4.税率：</span>
                <el-checkbox-group v-model="info.taxRate" :disabled="disabled">
                  <el-checkbox v-for="item in taxRateData" :label="item.codeValue" :key="item.codeValue">
                    {{ item.codeName }}
                  </el-checkbox>
                </el-checkbox-group>
              </td>
            </tr>
            <tr>
              <td colspan="5">
                <span class="innerLable"><em>*</em>5.账期见票结：</span>
                <el-checkbox-group v-model="info.accountPeriod" :disabled="disabled">
                  <el-checkbox v-for="item in accountPeriodData" :label="item.codeValue" :key="item.codeValue"
                               @change="checkbox('accountPeriod',item.codeValue)">{{ item.codeName }}
                  </el-checkbox>
                </el-checkbox-group>
                <div style="display:inline-block;margin-left:30px">
                  请列出：
                  <el-input v-model="info.accountPeriodValue" :disabled="disabled" placeholder="请输入"
                            style="width:250px;"></el-input>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="5">
                <span class="innerLable"><em>*</em>6.押金：</span>
                <el-checkbox-group v-model="info.deposit" :disabled="disabled">
                  <el-checkbox v-for="item in haveOrNotData" :label="item.codeValue" :key="item.codeValue"
                               @change="checkbox('deposit',item.codeValue)">{{ item.codeName }}
                  </el-checkbox>
                </el-checkbox-group>
                <div style="display:inline-block;margin-left:30px">支付/退回期限
                  <el-input v-model="info.returnDate" v-mynumval placeholder="请输入" class="innerIpt"
                            :disabled="disabled"></el-input>天
                </div>
              </td>
            </tr>
          </table>
          <!--            旧的合同类型            -->

            <!--           公用评审记录信息             -->
            <table class="contractTable" v-show="type>2 && type != 6"
                   border="0" cellspacing="0" cellpadding="0" style="border-top: 0;">
                <tr>
                    <td colspan="6" class="fw txt_c">
                        评审记录（注意：当您评审时，应对以上审查事项重点核实，并对您的评审意见负责）
                    </td>
                </tr>
                <tr >
                    <td class="label">评审中心</td>
                    <td class="label" colspan="4">评审意见</td>
                    <td class="label">评审人/日期</td>
                </tr>
                <tr v-for="item in info.reviewUserList" style="height: 30px;">
                    <td class="label" :rowspan="item.rowspan" v-if="item.show">{{ item.displayOrgName }}</td>
                    <td class="label blue" colspan="4">{{ item.reviewRemark }}</td>
                    <td class="label blue">{{ item.reviewStr }}</td>
                </tr>
            </table>
            <!--           公用评审记录信息             -->

            <div class="remarks" v-if="type<=2 || type == 6">
                <div>注：</div>
                <div>
                    1.若属重大（或有特别要求）的合同/协议，合同签订主导部门应附市场背景及相关情况说明；<br/>
                    2.评审通过后，此记录与合同文件等同存公司；<br/>
<!--                    <span class="fw">3. 本表单财务编制，如有任何调整或修订由财务发布。</span>-->
                </div>
            </div>
            <div class="remarks" v-else>
                <div>注：</div>
                <div>
                    1. 评审意见应客观填写；<br/>
                    2. 若属重大（或有特别要求）的合同/协议，合同签订主导部门应附市场背景及相关情况说明；<br/>
                    3.评审通过后，此记录与合同文件等同存公司；<br/>
<!--                    <span class="fw">4. 本表单财务编制，如有任何调整或修订由财务发布。</span>-->
                </div>
            </div>

        </div>
        <div class="uploadFile clearfix" v-if="type!=4">
            <div class="fl mr_10" style="max-width: 200px;" v-for="(item,index) in info.fileList">
                <myFileModel :ref="'file' + index" @successCallback="fileCallback" @delCallback="delCallback"
                             :componentId="index" :disabledEdit="disabled" :disabledDel="disabled"></myFileModel>
                <p class="txt_overHide">{{ item.fileName}}</p>
                <p style="color:red;zoom:0.9;">只支持.jpg .png .pdf .xls .xlsx格式</p>
            </div>
        </div>

        <div class="bot-btn">
            <el-button @click="closePage">关闭</el-button>
            <el-button type="primary" @click="saveContractReviewInfo(1)" v-if="type == 1 || type == 6 || type==2">
              临时保存
            </el-button>
            <el-button type="primary" @click="saveContractReviewInfo" v-if="type == 1 || type == 6 || type==2">
                确定{{ type == 6 ? '复制' : '申请' }}
            </el-button>
<!--            <el-button type="primary" @click="saveContractReviewInfo" v-if="type==2">保存修改</el-button>-->
            <el-button type="primary" @click="print" v-if="type==4">打印</el-button>
            <el-button type="primary" @click="review(1)" v-if="type==3">评审通过</el-button>
            <el-button type="danger" @click="review(2)" v-if="type==3">评审不通过</el-button>
        </div>
    </div>

</template>

<script>
import supplierContractInfo from "./supplierContractInfo.js";

export default supplierContractInfo;
</script>
<style scoped src="./contract.scss" lang="scss">
.blueFont {
    color: $main-color;
}
</style>
