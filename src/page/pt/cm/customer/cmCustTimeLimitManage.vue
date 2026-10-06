<template>
  <div id="cmCustTimeLimitManage">
    <div class="search-list clearfix">
      <div class="search-form clearfix" @keyup.enter="doQuery()">
        <div class="item">
          <label class="label">客户名称：</label>
          <div class="input-text">
            <el-input v-model="query.custName" placeholder="客户名称" type="text"></el-input>
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
      <!-- 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 -->
      <div class="search-bot">
        <img src="@/static/image/search-bot.png" alt="">
        <i class="icon el-icon-arrow-down"></i>
        <i class="icon el-icon-arrow-up"></i>
      </div>
    </div>
    </div>
    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>运作时间配置列表&nbsp;</span>
        </h3>
        <div class="table-title-btn">
          <el-button type="primary" plain size="mini" v-entity="1001020" @click="displayDialog(1)">新增</el-button>
          <el-button type="primary" plain size="mini" v-entity="1001021" @click="displayDialog(2)">修改</el-button>
          <el-button type="danger" plain size="mini" v-entity="1001022" @click="delCmCustTimeLimitInfo">删除</el-button>
        </div>
      </div>
      <tableCommon tableName="cmCustTimeLimitManageTable" ref="table" :showNum="true" :singleSelect="true" :showSetTable="false" :head="head"></tableCommon>
    </div>

    <el-dialog :title="dialogTitle" :visible.sync="showDialog" :close-on-click-modal="false" :close-on-press-escape="false" width="540px" @close="showDialog=false">
      <div class="common-info" style="border:none;padding:0;">
        <ul class="content clearfix">
          <li class="item" style="width: 75%;">
            <label class="label-term"><em>*</em>客户</label>
            <div class="input-text">
              <el-select v-model="cmCustTimeLimitInfo.custTenantId" filterable clearable @click.native="loadCustomerData" placeholder="请选择客户" :disabled="type==2">
                <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name" :value="item.tenantId"></el-option>
              </el-select>
            </div>
          </li>
        </ul>
        <div class="tickManager">
          <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
            <tr>
              <th width="70">作业类型</th>
              <th width="70">范围</th>
              <th width="70"><em>*</em>限定时间/分钟</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>提货</td>
              <td>
                <el-select v-model="cmCustTimeLimitInfo.pickupLimitType" filterable placeholder="请选择范围" @change="forupdate">
                  <el-option v-for="item in limitTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                </el-select>
              </td>
              <td>
                <el-input v-model="cmCustTimeLimitInfo.pickupLimitTime" type="text" placeholder="限定时间" v-mynumval></el-input>
              </td>
            </tr>
            <tr>
              <td>卸货</td>
              <td>
                <el-select v-model="cmCustTimeLimitInfo.deliveryLimitType" filterable placeholder="请选择范围" @change="forupdate">
                  <el-option v-for="item in limitTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                </el-select>
              </td>
              <td>
                <el-input v-model="cmCustTimeLimitInfo.deliveryLimitTime" type="text" placeholder="限定时间" v-mynumval></el-input>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="showDialog=false">关闭</el-button>
          <el-button type="primary" size="mini" @click="doSaveCmCustTimeLimit">提交</el-button>
        </div>
      </div>
    </el-dialog>
  </div>


</template>

<script>
import cmCustTimeLimitManage from './cmCustTimeLimitManage.js'
export default cmCustTimeLimitManage
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>
