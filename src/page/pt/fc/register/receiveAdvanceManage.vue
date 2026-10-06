<template>
  <div id="receiveAdvanceManage">
    <div class="search-list clearfix">
      <div class="search-form clearfix" @keyup.enter="doQuery()">
        <div class="item">
          <label class="label">客户名称：</label>
          <div class="input-text">
            <el-input v-model="loadParam.customerName" placeholder="客户名称" type="text"
                      autocomplete="new-password"></el-input>
          </div>
        </div>
        <div class="item">
          <label class="label">收款日期：</label>
          <div class="input-text">
            <el-date-picker v-model="loadParam.daterange" type="daterange" range-separator="至" start-placeholder="开始日期"
                            end-placeholder="结束日期" value-format="yyyy-MM-dd" unlink-panel></el-date-picker>
          </div>
        </div>
        <div class="item">
          <label class="label">预收状态：</label>
          <div class="input-text">
            <el-select v-model="loadParam.advanceState" placeholder="预收状态" clearable>
              <el-option v-for="item in advanceStateData" :key="item.codeValue" :label="item.codeName"
                         :value="item.codeValue"></el-option>
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
      <!-- 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 -->
      <div class="search-bot">
        <img src="@/static/image/search-bot.png" alt="">
        <i class="icon el-icon-arrow-down"></i>
        <i class="icon el-icon-arrow-up"></i>
      </div>
    </div>
    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>预收列表</span>
          <el-tooltip effect="light" content="预收列表" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" @click="toAddVerification(true)"  v-entity="1006089">预收核销</el-button>
          <el-button type="primary" plain size="mini" @click="toShowVerificationDetail(true)" v-entity="1006091">核销明细</el-button>
          <el-button type="primary" plain size="mini" @click="toAddReceive(true)" v-entity="1006092">新增预收</el-button>
          <el-button type="primary" plain size="mini" @click="toUpReceive()" v-entity="1006093">修改预收</el-button>
          <el-button type="danger" plain size="mini" @click="delReceiveInfo()" v-entity="1006094">删除预收</el-button>
        </div>
      </div>
      <tableCommon tableName="receiveAdvanceTable" ref="table" :head="head" :showNum="true"
                   :showSetTable="true" :singleSelect="true"></tableCommon>
    </div>
    <!-- 新增 预收 -->
    <el-dialog :title="title" :visible.sync="showReceive" width="520px" :close-on-click-modal="false" :close-on-press-escape="false" @close="toAddReceive(false)">
      <div class="common-info" style="border:none;padding:0;">
        <ul class="content clearfix">
          <li class="item item100">
            <label class="label-term"><em>*</em>客户名称</label>
            <div class="input-text">
              <el-select v-model="receive.tenantId" placeholder="请选择客户名称" clearable filterable>
                <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name" :value="item.tenantId"></el-option>
              </el-select>
            </div>
          </li>
          <li class="item item100">
            <label class="label-term"><em>*</em>预收原因</label>
            <div class="input-text">
              <el-input v-model="receive.advanceCause" maxlength="255" placeholder="请输入预收原因" ></el-input>
            </div>
          </li>
          <li class="item item100">
            <label class="label-term"><em>*</em>收款金额</label>
            <div class="input-text">
              <el-input v-model="receive.advanceFee" v-mydouble4val placeholder="请输入收款金额" ></el-input>
            </div>
          </li>
          <li class="item item100">
            <label class="label-term"><em>*</em>收款日期</label>
            <div class="input-text">
              <el-date-picker v-model="receive.advanceDate" type="date" placeholder="请选择收款日期"
                              value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
            </div>
          </li>
        </ul>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="toAddReceive(false)">取消</el-button>
          <el-button type="primary" size="mini" @click="saveReceiveInfo()">确定</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 预收核销 -->
    <el-dialog title="预收核销" :visible.sync="showVerification" width="550px" :close-on-click-modal="false" :close-on-press-escape="false" @close="toAddVerification(false)">
      <div class="common-info" style="border:none;padding:0;">
        <ul class="content clearfix">
          <li class="item item50">
            <label class="label-term">客户名称</label>
            <div class="input-text">
              <el-input v-model="receive.tenantName" placeholder="" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">预收原因</label>
            <div class="input-text">
              <el-input v-model="receive.advanceCause" maxlength="255" placeholder="" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">收款金额</label>
            <div class="input-text">
              <el-input v-model="receive.advanceFee" v-mydouble4val placeholder="" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">收款日期</label>
            <div class="input-text">
              <el-input v-model="receive.advanceDate" placeholder="" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">已核销金额</label>
            <div class="input-text">
              <el-input v-model="receive.isVerificationFee" v-mydouble4val placeholder="" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">未核销金额</label>
            <div class="input-text">
              <el-input v-model="receive.noVerificationFee" v-mydouble4val placeholder="" :disabled="true"></el-input>
            </div>
          </li>
        </ul>
        <ul class="content clearfix" style="border-top: 1px solid #efefef;padding-top: 20px;margin-top: 15px;">
          <li class="item item50" style="float: initial;margin: 0 auto;">
            <label class="label-term">本次核销金额</label>
            <div class="input-text">
              <el-input v-model="verificationFee" v-mydouble4val placeholder="请输入本次核销金额" ></el-input>
            </div>
          </li>
        </ul>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="toAddVerification(false)">取消</el-button>
          <el-button type="primary" size="mini" @click="saveVerification()">确定</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 核销明细 -->
    <el-dialog title="核销明细" :visible.sync="showVerificationDetail" width="50%"
               :close-on-click-modal="false" :close-on-press-escape="false" @close="toShowVerificationDetail(false)">
      <div class="table-content common-info" style="border: none;padding: 0;">
        <h3 style="margin-bottom: 10px;margin-top: -30px;">
        </h3>
        <ul class="content clearfix">
          <li class="item item50">
            <label class="label-term">客户名称</label>
            <div class="input-text">
              <el-input v-model="receive.tenantName" placeholder="" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">预收原因</label>
            <div class="input-text">
              <el-input v-model="receive.advanceCause" maxlength="255" placeholder="" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">收款金额</label>
            <div class="input-text">
              <el-input v-model="receive.advanceFee" v-mydouble4val placeholder="" :disabled="true"></el-input>
            </div>
          </li>
          <li class="item item50">
            <label class="label-term">收款日期</label>
            <div class="input-text">
              <el-input v-model="receive.advanceDate" placeholder="" :disabled="true"></el-input>
            </div>
          </li>
        </ul>
        <!-- 表格 -->
        <scrollTable tableName="receiveAdvanceDetailTable" v-if="showVerificationDetail" ref="detailTable" :doSum="true"
                     :showSetTable="false" :singleSelect="true" :head="detailHead">
        </scrollTable>
      </div>
      <div class="bot-btn" style="margin-top: 20px;">
        <el-button  @click="toShowVerificationDetail(false)">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import receiveAdvanceManage from './receiveAdvanceManage.js'

export default receiveAdvanceManage
</script>
<style lang="scss">
@import '@/page/pt/fc/fc_common.scss';

#expenditureRegisterManage {
  .tagList .tag .contet .item .label {
    width: 100px;
  }
}
</style>

