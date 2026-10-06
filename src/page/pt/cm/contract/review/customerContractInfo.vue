<template>
  <div id="customerContractInfo" class="contractPage">
    <div id="printTable">
      <div class="tableTitleContainer">
        <h3 class="tableTitle">客户合同/协议评审记录</h3>
        <div class="contractNum" v-if="info.id&&type!=6">合同评审编号：{{info.contractNum}}</div>
      </div>
      <table class="contractTable" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td class="label" width="120">申请日期</td>
        <td class="blue">{{info.createDate}}</td>
        <td class="label" width="120">结算主体</td>
        <td>
          <el-select v-model="info.settleBody" placeholder="请选择结算主体" filterable clearable style="width: 100%;" :disabled="disabled" @change="getReviewUserList">
            <el-option v-for="item in payTitleOptions" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
          </el-select>
        </td>
      </tr>
      <tr>
        <td class="label" width="120"><em>*</em>客户名称</td>
        <td v-if="type==1||type==6||info.tenantId">
          <el-select v-model="info.tenantId" placeholder="请选择客户" @change="selTenant" filterable clearable style="width: 100%;" :disabled="disabled">
            <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name" :value="item.tenantId"></el-option>
          </el-select>
        </td>
        <td v-else>
          <el-input v-model="info.tenantName" maxlength="100" placeholder="客户名称" :disabled="disabled"></el-input>
        </td>
        <td class="label" width="120"><em>*</em>表单启用</td>
        <td>{{info.fromDate}}</td>
      </tr>
      <tr>
        <td class="label"><em>*</em>合同类型</td>
        <td colspan="3">
          <el-checkbox-group v-model="info.contractType" :disabled="disabled">
            <el-checkbox v-for="item in contractTypeDate" :label="item.codeValue" :key="item.codeValue" >{{item.codeName}}</el-checkbox>
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td class="label"><em>*</em>合同类别</td>
        <td colspan="3">
          <el-checkbox-group v-model="info.contractClass" :disabled="disabled">
            <el-checkbox v-for="item in contractClassData" :label="item.codeValue" :key="item.codeValue">{{item.codeName}}</el-checkbox>
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td class="label"><em>*</em>项目类别</td>
        <td colspan="3">
          <el-checkbox-group v-model="info.projectType" :disabled="disabled" @change="getReviewUserList" >
            <el-checkbox v-for="item in projectTypeData" :label="item.codeValue" :key="item.codeValue">{{item.codeName}}</el-checkbox>
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td class="label" rowspan="6">客户主体资质审核</td>
        <td colspan="3">
            1.运输区域：
          <el-checkbox-group v-model="info.transitAreas" style="margin-left:20px;" :disabled="disabled">
            <el-checkbox v-for="item in transitAreasData" :label="item.codeValue" :key="item.codeValue" >{{item.codeName}}</el-checkbox>
          </el-checkbox-group>
        </td>
      </tr>
        <tr>
            <td colspan="3">
                <em v-if="info.projectType.includes('1')">*</em>2.仓储区域：
                <el-select style="width: 90%" v-model="info.workAreas" clearable multiple filterable :disabled="disabled" @change="getReviewUserList" placeholder="请选择仓储区域">
                    <el-option v-for="item in workData" :key="item.workId" :label="item.workName"
                               :value="item.workId" :disabled="item.disabled">
                    </el-option>
                </el-select>
            </td>
        </tr>
      <tr>
        <td colspan="3">
            <em>*</em>3.相关证照：
          <el-checkbox-group v-model="info.certificate" style="margin-left:20px;" :disabled="disabled">
            <el-checkbox v-for="item in certificateData" :label="item.codeValue" :key="item.codeValue" >{{item.codeName}}</el-checkbox>
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td colspan="3">
            <em>*</em>4.成立日期：
          <el-date-picker v-model="info.establishmentDate" :disabled="disabled" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" style="margin-left:10px;">
          </el-date-picker>
        </td>
      </tr>
      <tr>
        <td colspan="3">
            <em>*</em>5.注册资本：
          <el-input v-model="info.registeredCapital" :disabled="disabled" placeholder="按营业执照填写" style="width:80%;margin-left:20px;"></el-input>
        </td>
      </tr>
      <tr>
        <td colspan="3">
            <em>*</em>6.注册地址：
          <el-input v-model="info.registeredAddress" :disabled="disabled" placeholder="按营业执照填写" style="width:80%;margin-left:20px;"></el-input>
        </td>
      </tr>

      <tr>
        <td class="label" rowspan="8">服务内容</td>
        <td colspan="3">
          1. 运输类：
            <el-checkbox-group v-model="info.transport" :disabled="disabled">
                <el-checkbox v-for="item in transportData" :label="item.codeValue" :key="item.codeValue" >{{item.codeName}}</el-checkbox>
            </el-checkbox-group>
            <div style="display:inline-block;margin-left:30px">
                请列出：
                <el-input v-model="info.transportName" :disabled="disabled" placeholder="请输入名称" style="width:250px;"></el-input>
            </div>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          2. 仓库类：
            <el-checkbox-group v-model="info.storage" :disabled="disabled">
                <el-checkbox v-for="item in storageData" :label="item.codeValue" :key="item.codeValue" >{{item.codeName}}</el-checkbox>
            </el-checkbox-group>
            <div style="display:inline-block;margin-left:30px">
                请列出：
                <el-input v-model="info.storageName" :disabled="disabled" placeholder="请输入名称" style="width:250px;"></el-input>
            </div>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          3. 包装类：
            <el-checkbox-group v-model="info.packing" :disabled="disabled">
                <el-checkbox v-for="item in packingData" :label="item.codeValue" :key="item.codeValue" >{{item.codeName}}</el-checkbox>
            </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td colspan="3">
            <em>*</em>4. 其他服务：
            <el-input v-model="info.otherService" :disabled="disabled" placeholder="请输入其他服务" style="width:250px;"></el-input>
        </td>
      </tr>
      <tr>
        <td colspan="3">
            <em>*</em>5. 服务的物料产品：
            <el-input v-model="info.serviceProducts" :disabled="disabled" placeholder="请输入服务的物料产品" style="width:250px;"></el-input>
        </td>
      </tr>
        <tr>
            <td colspan="3">
                <em>*</em>6. 其他注意事项：
                <el-input v-model="info.otherItem" :disabled="disabled" placeholder="请输入其他注意事项" style="width:250px;"></el-input>
            </td>
        </tr>
      <tr>
        <td colspan="3">
            <em>*</em>7.履约期限：
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
        <td colspan="3">
            <em>*</em>8. 合同纠纷法院：
          <el-input v-model="info.disputeCourt" :disabled="disabled" placeholder="请输入合作纠纷法院名称" style="width:80%;"></el-input>
        </td>
      </tr>
      <tr>
        <td class="label" :rowspan="info.creditLevel?7:6">结款条件</td>
        <td colspan="3">
          <span class="innerLable"><em>*</em>1. 付款方式：</span>
          <el-checkbox-group v-model="info.payMode" :disabled="disabled" >
            <el-checkbox v-for="item in payModeData" :label="item.codeValue" :key="item.codeValue" @change="checkbox('payMode',item.codeValue)">{{item.codeName}}</el-checkbox>
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <span class="innerLable"><em>*</em>2. 对账：</span>
          每月<el-input placeholder="请填写" v-model="info.reconciliationDate" class="innerIpt" :disabled="disabled"></el-input
          >号前对账，每月<el-input placeholder="请填写" v-model="info.invoiceDate" class="innerIpt" :disabled="disabled"></el-input>号前交发票
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <span class="innerLable"><em>*</em>3.发票：</span>
          <el-checkbox-group v-model="info.invoiceType" :disabled="disabled" >
            <el-checkbox v-for="item in invoiceTypeData" :label="item.codeValue" :key="item.codeValue" @change="checkbox('invoiceType',item.codeValue)">{{item.codeName}}</el-checkbox>
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <span class="innerLable"><em>*</em>4.税率：</span>
          <el-checkbox-group v-model="taxRate" :disabled="disabled">
            <el-checkbox v-for="item in taxRateData" :label="item.codeValue" :key="item.codeValue" @change="checkbox('taxRate',item.codeValue)">{{item.codeName}}</el-checkbox>
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <span class="innerLable"><em>*</em>5.账期见票结：</span>
          <el-checkbox-group v-model="info.accountPeriod" :disabled="disabled">
            <el-checkbox v-for="item in accountPeriodData" :label="item.codeValue" :key="item.codeValue" @change="checkbox('accountPeriod',item.codeValue)">{{item.codeName}}</el-checkbox>
          </el-checkbox-group>
            <div style="display:inline-block;margin-left:30px">
                请列出：
                <el-input v-model="info.accountPeriodValue" v-mynumval :disabled="disabled" placeholder="请输入天数" style="width:250px;"></el-input>
            </div>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <span class="innerLable"><em>*</em>6.押金：</span>
          <el-checkbox-group v-model="info.deposit" :disabled="disabled">
            <el-checkbox v-for="item in haveOrNotData" :label="item.codeValue" :key="item.codeValue" @change="checkbox('deposit',item.codeValue)">{{item.codeName}}</el-checkbox>
          </el-checkbox-group>
          <div style="display:inline-block;margin-left:30px">支付/退回期限<el-input v-model="info.returnDate" placeholder="请输入" class="innerIpt" :disabled="disabled"></el-input>天</div>
        </td>
      </tr>
      <tr v-if="info.creditLevel">
        <td colspan="3">
          <span class="innerLable" style="height: 28px;">7.结算信用：</span>
          <div class="block" style="display: inline-block">
            <el-rate
                v-model="info.creditLevel"
                :colors="colors" disabled
                show-text :texts="texts" text-color="red">
            </el-rate>
          </div>
        </td>
      </tr>
      <tr>
        <td class="label">申请人</td>
        <td class="blue">{{ info.createUserName }}</td>
        <td class="label">申请部门</td>
        <td class="blue">{{ info.orgName }}</td>
      </tr>
      <tr>
        <td class="label"><em>*</em>申请事由</td>
        <td colspan="3">
          <el-input v-model="info.remark" placeholder="请填写申请事由" :disabled="disabled"></el-input>
        </td>
      </tr>
      <tr>
        <td class="label">评审人员</td>
        <td colspan="3">
          <div style="float: left" v-for="item in info.saveReviewUserList">
            {{item.orgName}}：
            <el-select v-model="item.userId" placeholder="请选择负责人" :disabled="disabled||item.isWork" :multiple="item.isWork==1">
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
      <tr v-show="type>2 && type != 6">
        <td colspan="4" class="fw txt_c">评审记录（注意：当您评审时，应对以上审查事项重点核实，并对您的评审意见负责）</td>
      </tr>
    </table>
      <table class="contractTable" border="0" cellspacing="0" cellpadding="0">
      <tr v-show="type>2 && type != 6">
        <td class="label" width="120">评审中心</td>
        <td class="label" width="250">评审人</td>
        <td class="label" width="200">评审状态</td>
        <td class="label" width="200">评审日期</td>
        <td class="label">评审意见</td>
      </tr>
      <tr v-show="type>2 && type != 6" v-for="item in info.reviewUserList" style="height: 30px;">
        <td class="label" :rowspan="item.rowspan" v-if="item.show">{{ item.displayOrgName}}</td>
        <td class="label" :class="item.reviewSts<=2?'blue':'red'">{{ item.userName }}</td>
        <td class="label" :class="item.reviewSts<=2?'blue':'red'">{{item.reviewStsName}}</td>
        <td class="label" :class="item.reviewSts<=2?'blue':'red'">{{ item.reviewDate }}</td>
        <td class="label" :class="item.reviewSts<=2?'blue':'red'">{{ item.reviewRemark }}</td>
      </tr>
    </table>
    <div class="remarks" v-if="type<=2 || type == 6">
      <div>注：</div>
      <div>
        1.若属重大（或有特别要求）的合同/协议，合同签订主导部门应附市场背景及相关情况说明；<br />
        2.评审通过后，此记录与合同文件等同存公司；<br />
<!--        <span class="fw">3. 本表单财务编制，如有任何调整或修订由财务发布。</span>-->
      </div>
    </div>
      <div class="remarks" v-else>
        <div>注：</div>
        <div>
          1. 评审意见应客观填写；<br />
          2. 若属重大（或有特别要求）的合同/协议，合同签订主导部门应附市场背景及相关情况说明；<br />
          3.评审通过后，此记录与合同文件等同存公司；<br />
<!--          <span class="fw">4. 本表单财务编制，如有任何调整或修订由财务发布。</span>-->
        </div>
      </div>

    </div>
    <div class="uploadFile clearfix" v-if="type!=4">
      <div class="fl mr_10" style="max-width: 200px;" v-for="(item,index) in info.fileList">
        <myFileModel :ref="'file' + index" @successCallback="fileCallback" @delCallback="delCallback" :componentId="index" :disabledEdit="disabled" :disabledDel="disabled"></myFileModel>
        <p class="txt_overHide">{{ item.fileName}}</p>
        <p style="color:red;zoom:0.9;">只支持.jpg .png .pdf .xls .xlsx格式</p>
      </div>
    </div>

    <div class="bot-btn">      
        <el-button type="primary" @click="closePage">关闭</el-button>
        <el-button type="primary" @click="saveContractReviewInfo" v-if="type == 1 || type == 6">确定{{ type == 6 ? '复制' : '申请'}}</el-button>
        <el-button type="primary" @click="saveContractReviewInfo" v-if="type==2">保存修改</el-button>
        <el-button type="primary" @click="print" v-if="type==4">打印</el-button>
        <el-button type="primary" @click="review(1)" v-if="type==3">评审通过</el-button>
        <el-button type="danger" @click="review(2)" v-if="type==3">评审不通过</el-button>
    </div>
  </div>
      
</template>

<script>
import customerContractInfo from "./customerContractInfo.js";
export default customerContractInfo;
</script>
<style scoped src="./contract.scss" lang="scss" >
.blueFont{
  color: $main-color;
}
</style>
