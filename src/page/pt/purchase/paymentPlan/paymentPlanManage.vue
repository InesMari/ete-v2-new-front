<template>
    <div id="paymentPlanManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam"
                    searchKey="paymentPlanManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>费用清单列表<em>（--双击序号查看详情--）</em></span>
                    <el-tooltip effect="light" content="费用清单列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
<!--                  <el-button type="primary" plain size="mini" v-entity="1014006" @click="deleteItem">生成账单</el-button>-->
                  <el-button type="primary" plain size="mini" v-entity="1014023" @click="generatePayApplyCheck(enumData.PAY_TYPE.REQ)">生成请款单</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014024" @click="generatePayApplyCheck(enumData.PAY_TYPE.PAY)">生成付款单</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014026" @click="download">导出</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014047" @click="toSummaryPage">汇总表</el-button>
                </div>
            </div>
            <tableCommon tableName="paymentPlanManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :single-select="false" @dblclickItem="dblclickItem">
              <template v-slot:default="{item, code}">
                <a href="javascript:void(0);" class="link"  v-for="(data,index) in item.reqNumArray" @click.stop="toDetail(item, code, index)" v-if="code=='reqNums'">{{index>0?','+data:data}}</a>
                <a href="javascript:void(0);" class="link"  v-for="(data,index) in item.payNumArray" @click.stop="toDetail(item, code, index)" v-if="code=='payNums'">{{index>0?','+data:data}}</a>
                <a href="javascript:void(0);" class="link"  @click.stop="toPurOrderDetail(item)" v-if="code=='purchaseNum'">{{item.purchaseNum}}</a>
                <a href="javascript:void(0);" class="link"  @click.stop="toApplyDetail(item)" v-if="code=='applyNum'">{{item.applyNum}}</a>
                <a href="javascript:void(0);" class="link"  @click.stop="toContractDetail(item)" v-if="code=='contractNum'">{{item.contractNum}}</a>
              </template>
            </tableCommon>
        </div>

      <el-dialog title="生成付款单" class="esignDialog" width="550px" :visible.sync="showViewDialog" :close-on-click-modal="false" :close-on-press-escape="false">
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix">
            <li class="item item100">
              <div class="input-text" style="margin: 0 auto; text-align: center;width: 100%;">
                <el-radio-group v-model="info.type">
                  <el-radio :label="1">合并</el-radio>
                  <el-radio :label="2">拆分</el-radio>
                </el-radio-group>
              </div>
            </li>
          </ul>
          <ul class="content clearfix" v-if="info.type == 2 && payPlanList.length > 2">
            <li class="item item100">
              <label class="label-term">费用一：</label>
              <div class="input-text">
                <el-select v-model="info.payPlanIds1" multiple placeholder="请选择" @change="payPlanIdsChange" clearable style="width: 100%;">
                  <el-option v-for="item in payPlanList" :disabled="item.disabled" :key="item.id" :label="item.planNum" :value="item.id"></el-option>
                </el-select>
              </div>
            </li>
            <li class="item item100">
              <label class="label-term">费用二：</label>
              <div class="input-text">
                <el-select v-model="info.payPlanIds2" multiple placeholder="请选择" @change="payPlanIdsChange" clearable style="width: 100%;">
                  <el-option v-for="item in payPlanList" :disabled="item.disabled" :key="item.id" :label="item.planNum" :value="item.id"></el-option>
                </el-select>
              </div>
            </li>
            <li class="item item100">
              <label class="label-term">费用三：</label>
              <div class="input-text">
                <el-select v-model="info.payPlanIds3" multiple placeholder="请选择" @change="payPlanIdsChange" clearable style="width: 100%;">
                  <el-option v-for="item in payPlanList" :disabled="item.disabled" :key="item.id" :label="item.planNum" :value="item.id"></el-option>
                </el-select>
              </div>
            </li>
          </ul>
          <ul class="content clearfix">
            <li class="item item100" style="margin-top: 20px;">
              <div class="input-text" style="margin: 0 auto; text-align: left;width: 100%;line-height: 25px;text-align: center;">
                <span class="name" style="display: inline-block;">合并：多个费用清单，金额合并为一条记录</span>
                <span class="name" style="display: inline-block;">拆分：费用一、二、三，分别对应付款单的1、2、3行</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="page-bot-btn">
          <el-button type="info" @click="showViewDialog=false">取消</el-button>
          <el-button type="primary" @click="addPayOrder">继续</el-button>
        </div>
      </el-dialog>

    </div>
</template>

<script>
import paymentPlanManage from './paymentPlanManage.js'
export default paymentPlanManage
</script>
<style lang="scss">
</style>

