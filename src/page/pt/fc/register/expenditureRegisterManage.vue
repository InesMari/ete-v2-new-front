<template>
  <div id="expenditureRegisterManage">
    <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="expenditureRegisterManageSearch"></searchList>
    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>付款登记列表</span>
          <el-tooltip effect="light" content="付款登记列表" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" @click="toShowVerify(true,2)"  v-entity="1006084">付款登记</el-button>
          <el-button type="primary" plain size="mini" @click="toShowRegisterHis(true)" v-entity="1006085">付款记录</el-button>
          <el-button type="primary" plain  @click="download()" size="mini" v-entity="1006146">导出Excel</el-button>
        </div>
      </div>
      <tableCommon tableName="expenditureRegisterTable" ref="table" :head="head" :showNum="true"
                   :showSetTable="true" :singleSelect="false"></tableCommon>
    </div>

    <!-- 批量付款登记 begin-->
    <el-dialog title="批量付款登记" :visible.sync="registerShowBatch" width="500px" :close-on-click-modal="false"
               :close-on-press-escape="false" @close="showRegisterBatch(false)">
      <div class="fcCommonPage">
        <div class="common-info" style="border:none;padding:0;">
          <p style="text-align:center;margin: -15px 0 10px;">您正在批量付款登记处理：{{info.billNums}}共{{info.noPayFee}}元</p>
          <ul class="content clearfix;">
            <li class="item item100">
              <label class="label-term"><em>*</em>实际付款日期</label>
              <div class="input-text">
                <el-date-picker v-model="info.actualPayDate" type="date" placeholder="实际付款日期" value-format="yyyy-MM-dd" @blur="$forceUpdate();"></el-date-picker>
              </div>
            </li>
          </ul>
          <ul class="content clearfix">
            <li class="item item100">
              <label class="label-term">付款备注</label>
              <div class="input-text">
                <el-input v-model="info.remark" type="textarea" maxlength="200" placeholder="" @input="$forceUpdate();" ></el-input>
              </div>
            </li>
          </ul>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="showRegisterBatch(false)">关闭</el-button>
            <el-button type="primary" size="mini" @click="sureRegisterBatch()">确定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 批量付款登记 end-->

    <!-- 付款登记 begin-->
    <el-dialog :title="title" :visible.sync="showRegister" width="80%" :close-on-click-modal="false"
               :close-on-press-escape="false" @close="toShowVerify(false)">
      <div class="fcCommonPage">
        <div class="tagList clearfix">
          <div class="tag" style="width:33.333%;">
            <div class="tip"><span>供应商</span></div>
            <h3 class="title">账单信息</h3>
            <div class="contet">
              <div class="item">
                <div class="label">账单编号：</div>
                <div class="text fw">{{ bill.billNum }}</div>
              </div>
              <div class="item">
                <div class="label">供应商名称：</div>
                <div class="text fw">{{ bill.supplierName }}</div>
              </div>
              <div class="item">
                <div class="label">账单月份：</div>
                <div class="text fw">{{ bill.billMonth }}</div>
              </div>
              <div class="item">
                <div class="label">账单备注：</div>
                <div class="text fw">{{ bill.remark }}</div>
              </div>
            </div>
          </div>
          <div class="tag" style="width: 33.333%;">
            <div class="tip"><span>账单</span></div>
            <h3 class="title">账单金额</h3>
            <h5 class="cash">￥{{ bill.totalFee }} 元</h5>
            <div class="contet center">
              <div class="item">
                <div class="label fw">运输金额：</div>
                <div class="text">￥{{ bill.waybillFee }}元</div>
              </div>
              <div class="item">
                <div class="label fw">仓储金额：</div>
                <div class="text">￥{{ bill.storehouseFee }}元</div>
              </div>
              <div class="item">
                <div class="label fw">器具采购金额：</div>
                <div class="text">￥{{ bill.packCostFee }}元</div>
              </div>
              <div class="item">
                <div class="label fw">其他金额：</div>
                <div class="text">￥{{ bill.otherFee }}元</div>
              </div>
              <div class="item">
                <div class="label fw">补录金额：</div>
                <div class="text">￥{{ bill.makeupFee }}元</div>
              </div>
            </div>
          </div>
          <div class="tag" style="width: 33.334%;">
            <div class="tip"><span>应付</span></div>
            <h3 class="title">应付金额</h3>
            <h5 class="cash">￥{{ bill.payableFee }} 元</h5>
            <div class="definite">
              <div class="label">已付款</div>
              <div class="text">￥ {{ bill.payFee }} 元</div>
            </div>
            <div class="definite">
              <div class="label" style="background: #1990ff">未付款</div>
              <div class="text">￥ {{ bill.noPayFee }} 元</div>
            </div>
          </div>
<!--          <div class="tag" style="width: 25%;">-->
<!--            <div class="tip"><span>未付</span></div>-->
<!--            <h3 class="title">未付金额明细</h3>-->
<!--            <div class="contet center">-->
<!--              <div class="item">-->
<!--                <div class="label fw">运输金额：</div>-->
<!--                <div class="text">￥{{ bill.noWaybillFee }}元</div>-->
<!--              </div>-->
<!--              <div class="item">-->
<!--                <div class="label fw">仓库金额：</div>-->
<!--                <div class="text">￥{{ bill.noStorehouseFee }}元</div>-->
<!--              </div>-->
<!--              <div class="item">-->
<!--                <div class="label fw">其他金额：</div>-->
<!--                <div class="text">￥{{ bill.noOtherFee }}元</div>-->
<!--              </div>-->
<!--              <div class="item">-->
<!--                <div class="label fw">补录金额：</div>-->
<!--                <div class="text">￥{{ bill.noMakeupFee }}元</div>-->
<!--              </div>-->
<!--            </div>-->
<!--          </div>-->
        </div>

        <div style="text-align: right; margin: 10px 0;">
          <label class="label">付款金额:</label>
          <div class="input-text" style="width: 120px;display: inline-block;margin: 0 10px;">
            <el-input size="mini" v-mydoubleval v-model="totalFee" placeholder="" type="text"></el-input>
          </div>
          <el-button size="mini" @click="shareFee()">自动拆分</el-button>
        </div>
        <scrollTable v-if="showRegister" ref="invoiceTable" tableName="registerInvoiceTable" :head="registerInvoiceHead" @inputFn="inputFn" :doSum="true"></scrollTable>

      <div class="bot-btn" style="margin-top: 20px;">
        <el-button  @click="toShowVerify(false)">关闭</el-button>
        <el-button type="primary" @click="saveSupplierBillRegister()">确认提交</el-button>
      </div>
      </div>
  </el-dialog>
  <!-- 付款登记 end-->
  <!-- 发票申请明细 begin -->
  <el-dialog class="upInvoiceDetail" :title=hisTitle :visible.sync="showRegisterHis" width="80%"
             :close-on-click-modal="false" :close-on-press-escape="false" @close="toShowRegisterHis(false)">
    <div class="table-content">
      <h3 style="margin-bottom: 10px;margin-top: -30px;">
        <span style="color: red;font-size: 18px;">账单编号: {{bill.billNum}} 账单月份: {{bill.billMonth}} 客户名称: {{bill.supplierName}}</span>
      </h3>
      <!-- 表格 -->
      <tableCommon tableName="expenditureDetailTable" v-if="showRegisterHis" ref="detailTable" :showNum="true"
                   :showSetTable="false" :singleSelect="true" :head="detailHead">
        <template v-slot:default="{item}">
          <el-button type="primary" size="mini" @click="cancleSupplierInvoiceRegister(item)">撤销付款</el-button>
        </template>
      </tableCommon>
    </div>
    <div class="bot-btn" style="margin-top: 20px;">
      <el-button  @click="toShowRegisterHis(false)">关闭</el-button>
    </div>
  </el-dialog>
  <!-- 发票申请明细 end -->
  </div>
</template>

<script>
import expenditureRegisterManage from './expenditureRegisterManage.js'

export default expenditureRegisterManage
</script>
<style lang="scss">
@import '@/page/pt/fc/fc_common.scss';

#expenditureRegisterManage {
  .tagList .tag .contet .item .label {
    width: 100px;
  }
}
</style>

