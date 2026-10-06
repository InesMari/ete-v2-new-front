<template>
    <div id="unconfirmedBill">
      <searchList :formData="formData" @doQuery="doQuery" @clearFn="initQuery" :query="query" searchKey="unconfirmedBillSearch"/>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>未审核客户账单列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="未审核客户账单列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="addFcCustomerBill" v-entity="1006039">新增账单</el-button>
                    <el-button type="primary" plain size="mini" @click="sureFcCustomerBill" v-entity="1006040">账单审核</el-button>
                    <el-button type="primary" plain size="mini" @click="updateCustomerBill" v-entity="1006041">修改账单</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteFcCustomerBill" v-entity="1006042">删除账单</el-button>
                    <el-button type="primary" plain size="mini" @click="addMakeup(true)" v-entity="1006159">账单补录</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1006168" @click="exportExcel()">账单Excel导出</el-button>
                </div>
            </div>
            <tableCommon tableName="unconfirmedBillTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="toCustomerBillDetail">
                <template v-slot:default="{item}">
                    <a href="javascript:void(0);" :class="!item.imgUrl?'disabled':'link'"  @click.stop="showImg(item)" style="margin: 0 10px;">查看附件</a>
                </template>
            </tableCommon>
        </div>

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>


        <!-- 费用补录 begin -->
      <el-dialog title="客户账单补录" :visible.sync="showAddMakeup" width="540px" :close-on-click-modal="false" :close-on-press-escape="false">
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix">
            <li class="item item100">
              <label class="label-term">客户名称</label>
              <div class="input-text">
                <el-input v-model="makeupInfo.tenantName" :disabled="true"></el-input>
              </div>
            </li>
            <li class="item item100">
              <label class="label-term">账单金额</label>
              <div class="input-text">
                <el-input v-model="makeupInfo.totalFee" :disabled="true"></el-input>
              </div>
            </li>
            <li class="item item100">
              <label class="label-term"><em>*</em>费用类型</label>
              <div class="input-text">
                <el-select v-model="makeupInfo.feeType" placeholder="请选择费用类型" filterable clearable>
                  <el-option v-for="item in feeTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                </el-select>
              </div>
            </li>
            <li class="item item100">
              <label class="label-term"><em>*</em>补录金额</label>
              <div class="input-text">
                <el-input v-model="makeupInfo.makeupFee" maxlength="20" v-mypmdouble4val placeholder="请输入补录金额" @input="forceUpdate"></el-input>
              </div>
            </li>
            <li class="item item100">
              <label class="label-term"><em>*</em>税点</label>
              <div class="input-text">
                <el-input v-model="makeupInfo.taxRate" maxlength="10" v-mydouble4val placeholder="请输入税点" @input="forceUpdate"></el-input>
              </div>
            </li>
            <li class="item item100">
              <label class="label-term">备注</label>
              <div class="input-text">
                <el-input v-model="makeupInfo.remark" type="textarea" maxlength="250" placeholder="请输入备注" @input="forceUpdate"></el-input>
              </div>
            </li>
          </ul>
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

    }
</style>

