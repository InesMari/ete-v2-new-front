<template>
  <div id="customerSubCompany">
    <div class="search-list clearfix">
      <div class="search-form clearfix" @keyup.enter="doQuery()">
        <div class="item">
          <label class="label">公司名称：</label>
          <div class="input-text">
            <el-input v-model="query.custName" placeholder="公司名称" @keyup.enter.native="doQuery" type="text"></el-input>
          </div>
        </div>
        <div class="item">
          <label class="label">是否启用：</label>
          <div class="input-text">
            <el-select v-model="query.sts" placeholder="是否启用" clearable @change="doQuery">
              <el-option v-for="item in stsData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
            </el-select>
          </div>
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
    </div>
    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>子公司列表</span>
          <el-tooltip effect="light" content="子公司列表" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn"  style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" @click="displayAddCustomer(1)" v-entity="1001014">新增</el-button>
          <el-button type="primary" plain size="mini" @click="updateCustomerState(0)" v-entity="1001015">禁用</el-button>
          <el-button type="primary" plain size="mini" @click="updateCustomerState(1)" v-entity="1001016">启用</el-button>
          <el-button type="primary" plain size="mini" @click="displayAddCustomer(2)" v-entity="1001017">查看</el-button>
          <el-button type="primary" plain size="mini" @click="displayAddCustomer(3)" v-entity="1001018">修改</el-button>
        </div>
      </div>
      <tableCommon tableName="customerSubCompanyTable" ref="table" :showNum="true" :showSetTable="true" :head="head">
        <template v-slot:default="{item}">
          <a href="javascript:void(0);" class="link" @click.stop="showBusinessLicense(item)" style="margin: 0 10px;">营业资料</a>
          <a href="javascript:void(0);" class="link" @click.stop="showInvoiceInfo(item)" style="margin: 0 10px;">开票资料</a>
        </template>
      </tableCommon>
    </div>

    <!-- 查看大图 -->
    <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

    <el-dialog :title="dialogTitle" :visible.sync="showAddCustomer" :close-on-click-modal="false" :close-on-press-escape="false" width="840px" @close="closeAddCustomer()">
      <div class="common-info" style="border:none;padding:0;">
        <ul class="content clearfix">
          <li class="item">
            <label class="label-term"><em>*</em>公司名称</label>
            <div class="input-text">
              <el-input v-model="customer.custName" :disabled="!showCommitButton"></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term"><em>*</em>公司简称</label>
            <div class="input-text">
              <el-input v-model="customer.abbreviationName" maxlength="5" :disabled="!showCommitButton"></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term"><em>*</em>所属行业</label>
            <div class="input-text">
              <el-select v-model="customer.belongingIndustry" clearable filterable placeholder="请选择">
                <el-option v-for="item in belongingIndustryData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                </el-option>
              </el-select>
            </div>
          </li>
          <li class="item">
            <label class="label-term"><em>*</em>物流模式</label>
            <div class="input-text">
              <el-select v-model="customer.logisticsMode" clearable filterable placeholder="请选择">
                <el-option v-for="item in logisticsModeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                </el-option>
              </el-select>
            </div>
          </li>
          <li class="item">
            <label class="label-term"><em>*</em>客户联系人</label>
            <div class="input-text">
              <el-input v-model="customer.linkman" :disabled="!showCommitButton"></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term">登录账号</label>
            <div class="input-text">
              <el-input v-model="customer.linkPhone" :disabled="!showCommitButton" @change="checkBillId()" placeholder="手机号码或者邮箱"></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term"><em>*</em>公司地址</label>
            <div class="input-text">
              <el-input v-model="customer.address" :disabled="!showCommitButton"></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term">账期(天)</label>
            <div class="input-text">
              <el-input v-model="customer.accountPeriod" v-mynumval></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term">发票资质类型</label>
            <div class="input-text">
              <el-select v-model="customer.invoiceType" filterable clearable placeholder="请选择" :disabled="!showCommitButton" >
                <el-option v-for="item in invoiceTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                </el-option>
              </el-select>
            </div>
          </li>
          <li class="item">
            <label class="label-term">卡户名</label>
            <div class="input-text">
              <el-input v-model="customer.accountName" :disabled="!showCommitButton"></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term">纳税人识别号</label>
            <div class="input-text">
              <el-input v-model="customer.taxNumber" :disabled="!showCommitButton"></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term">注册银行</label>
            <div class="input-text">
              <el-input v-model="customer.regBank" :disabled="!showCommitButton"></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term">账号</label>
            <div class="input-text">
              <el-input v-model="customer.regAccount" :disabled="!showCommitButton"></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term">注册地址</label>
            <div class="input-text">
              <el-input v-model="customer.regAddress" :disabled="!showCommitButton"></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term">注册电话</label>
            <div class="input-text">
              <el-input v-model="customer.regPhone" :disabled="!showCommitButton"></el-input>
            </div>
          </li>
        </ul>
        <ul class="content clearfix">
          <li class="item">
            <label class="label-term">运输票面税点(%)</label>
            <div class="input-text">
              <el-input v-model="customer.taxRate" v-mypmdouble4val></el-input>
            </div>
          </li>
          <li class="item">
            <label class="label-term">装卸票面税点(%)</label>
            <div class="input-text">
              <el-input v-model="customer.loadTaxRate" v-mypmdouble4val></el-input>
            </div>
          </li>
        </ul>
        <ul class="content clearfix">
          <li class="item">
            <label class="label-term"><em>*</em>所属区域</label>
            <div class="input-text">
              <el-select v-model="customer.regionIds" clearable filterable multiple placeholder="请选择" @change="regionChange" :disabled="!showCommitButton">
                <el-option
                    v-for="item in regionData"
                    :key="item.id"
                    :label="item.regionName"
                    :value="item.id">
                </el-option>
              </el-select>
            </div>
          </li>
<!--          <li class="item">-->
<!--            <label class="label-term"><em>*</em>所属部门</label>-->
<!--            <div class="input-text">-->
<!--              <el-select v-model="customer.orgId" filterable clearable placeholder="请选择" @change="orgChange" :disabled="!showCommitButton">-->
<!--                <el-option-->
<!--                    v-for="item in regionOrgData"-->
<!--                    :key="item.id"-->
<!--                    :label="item.orgName"-->
<!--                    :value="item.id">-->
<!--                </el-option>-->
<!--              </el-select>-->
<!--            </div>-->
<!--          </li>-->
          <li class="item">
            <label class="label-term">业务员</label>
            <div class="input-text">
              <el-select v-model="customer.custManage" filterable clearable placeholder="请选择" :disabled="!showCommitButton">
                <el-option
                    v-for="item in orgStaffData"
                    :key="item.userId"
                    :label="item.staffName"
                    :value="item.userId">
                </el-option>
              </el-select>
            </div>
          </li>
          <li class="item">
            <label class="label-term">营业执照</label>
            <div class="input-text">
              <myFileModel ref="businessLicense" :disabled="!showCommitButton"></myFileModel>
            </div>
          </li>
          <li class="item">
            <label class="label-term">开票资料</label>
            <div class="input-text">
              <myFileModel ref="invoiceInfo" :disabled="!showCommitButton"></myFileModel>
            </div>
          </li>
        </ul>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="closeAddCustomer()">关闭</el-button>
          <el-button type="primary" size="mini" @click="addCustomer()" v-show="showCommitButton">提交</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import customerSubCompany from './customerSubCompany.js'
export default customerSubCompany
</script>

<style scoped>

</style>
