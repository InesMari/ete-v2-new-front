<template>
    <div id="billMakeupFeeList">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="billMakeupFeeListSearch"></searchList>

        <!--   列表  开始-->
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>账单费用补录列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="addMakeup(true)" v-entity="1006067">修改补录</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteBillMakeupFee()" v-entity="1006068">删除补录</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1006165" @click="verifyMakeup(true)">审核补录</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1006166" @click="cancelVerifyMakeupInfo()">取消审核补录</el-button>
                </div>
            </div>
            <tableCommon tableName="billMakeupFeeListTable" ref="table" :head="head" :showNum="true" :singleSelect="true" :showSetTable="true" @dblclickItem="viewMakeup">
              <template v-slot="{item,code}">
                <div v-if="'billNum'==code">
                  <a href="javascript:void(0);" class="link" @click.stop="openDetail(item)" style="margin: 0 10px;">{{item.billNum}}</a>
                </div>
              </template>
            </tableCommon>
        </div>
        <!--  列表  结束-->

      <!-- 费用补录 begin -->
      <el-dialog title="账单补录修改" :visible.sync="showAddMakeup" width="540px" :close-on-click-modal="false" :close-on-press-escape="false">
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
                <el-select v-model="makeupInfo.feeType" placeholder="请选择费用类型" filterable clearable   :disabled="verifyFlg||viewFlg">
                  <el-option v-for="item in feeTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                </el-select>
              </div>
            </li>
            <li class="item item100">
              <label class="label-term"><em>*</em>补录金额</label>
              <div class="input-text">
                <el-input v-model="makeupInfo.makeupFee" maxlength="20" v-mypmdouble4val placeholder="请输入补录金额" @input="forceUpdate"  :disabled="verifyFlg||viewFlg"></el-input>
              </div>
            </li>
            <li class="item item100">
              <label class="label-term"><em>*</em>税点</label>
              <div class="input-text">
                <el-input v-model="makeupInfo.taxRate" maxlength="10" v-mydouble4val placeholder="请输入税点" @input="forceUpdate"  :disabled="verifyFlg||viewFlg"></el-input>
              </div>
            </li>
            <li class="item item100">
              <label class="label-term">备注</label>
              <div class="input-text">
                <el-input v-model="makeupInfo.remark" maxlength="50" placeholder="请输入备注" @input="forceUpdate"  :disabled="verifyFlg||viewFlg"></el-input>
              </div>
            </li>
          </ul>
          <div class="page-bot-btn ">
            <el-button type="primary" @click="verifyMakeupInfo(1)" v-if="verifyFlg">审核通过</el-button>
            <el-button @click="verifyMakeupInfo(2)"  v-if="verifyFlg">审核不通过</el-button>
            <el-button size="mini" @click="addMakeup(false)" v-if="!verifyFlg">关闭</el-button>
            <el-button type="primary" size="mini" @click="saveMakeupInfo()" v-if="!verifyFlg&&!viewFlg">确定修改</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 费用补录 end -->
    </div>
</template>

<script>
	import billMakeupFeeList from './billMakeupFeeList.js'

	export default billMakeupFeeList
</script>
<style lang="scss">

</style>
