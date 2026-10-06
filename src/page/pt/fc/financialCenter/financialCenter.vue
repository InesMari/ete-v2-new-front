<template>
  <div id="financialCenter" class="financialCenterPage clearfix">
    <div class="infoView fl">
      <div class="searchInfo clearfix">
          <label class="label-term fl">查询条件：</label>
          <el-select class="fl" v-model="dateType" placeholder="请选择" @change="dateTypeChange" style="width:120px;margin: 0 10px 0 5px;">
            <el-option v-for="item in dateOptions" :key="item.value" :label="item.label" :value="item.value" >
            </el-option>
          </el-select>
          <el-date-picker
              v-if="dateType!=2"
              class="fl sel2"
              v-model="qryDate"
              :type="uiType"
              :value-format="valueFormat"
              placeholder="请选择"
              @change="dateSel"
          ></el-date-picker>
        <seasonPicker v-if="dateType==2" ref="seasonPicker" @click="seasonSel"></seasonPicker>

        <el-button type="primary" plain size="mini" v-entity="1007027" style="float: right; margin-top: 6px; margin-right: 20px;">导出月运作汇总表</el-button>
      </div>
      <div class="totalList clearfix">
        <div class="item">
          <div class="iconView iconView4">
            <img src="@/static/image/icons/fina-icon4.png" alt="" style="width:25px;" />
          </div>
          <div class="amount">
            <p>收入（元）</p>
            <p><span class="num" :title="info.totalIncome">{{info.totalIncome | numberToCurrencyNo}}</span></p>
          </div>
        </div>
        <div class="item">
          <div class="iconView iconView5">
            <img src="@/static/image/icons/fina-icon5.png" alt="" style="width:25px;" />
          </div>
          <div class="amount">
            <p>成本（元）</p>
            <p><span class="num" :title="info.totalCost">{{info.totalCost | numberToCurrencyNo}}</span></p>
          </div>
        </div>
        <div class="item">
          <div class="iconView iconView6">
            <img src="@/static/image/icons/fina-icon6.png" alt="" style="width:25px;" />
          </div>
          <div class="amount">
            <p>毛利（%）</p>
            <p><span class="num" :title="info.grossProfitRate">{{info.grossProfitRate | numberToCurrencyNo}}</span></p>
          </div>
        </div>
      </div>
      <div class="orderDate">
        <h4 class="title">收入汇总明细</h4>
        <ul class="orders clearfix">
          <li @click="goByParam('/pt/ord/order/orderManage.vue', '订单管理')">
            <img src="@/static/image/icons/info-icon2.png" alt="" />
            <div class="info">
              <div class="num">{{info.orderIncome | numberToCurrencyNo}}</div>
              <div class="state">运输费用</div>
            </div>
          </li>
          <li @click="goByParam('/pt/fc/storehouse/wmsFeeIncomeManage.vue', '仓储收入')">
            <img src="@/static/image/icons/info-icon4.png" alt="" />
            <div class="info">
              <div class="num">{{info.storeIncome | numberToCurrencyNo}}</div>
              <div class="state">仓储费用</div>
            </div>
          </li>
          <li @click="goByParam('/pt/pkg/fc/packIncomeManage.vue', '包装收入')">
            <img src="@/static/image/icons/info-icon5.png" alt="" />
            <div class="info">
              <div class="num">{{info.pkgIncome | numberToCurrencyNo}}</div>
              <div class="state">器具费用</div>
            </div>
          </li>
          <li @click="goByParam('/pt/fc/sundry/prjSundryFeeManage.vue', '其他收入','',{t:2})">
            <img src="@/static/image/icons/info-icon6.png" alt="" />
            <div class="info">
              <div class="num">{{info.otherIncome | numberToCurrencyNo}}</div>
              <div class="state">其他费用</div>
            </div>
          </li>
        </ul>
        <h4 class="title">成本汇总明细</h4>
        <ul class="orders clearfix">
          <li @click="goByParam('/pt/ord/waybill/waybillManage.vue', '派车单管理')">
            <img src="@/static/image/icons/info-icon2.png" alt="" />
            <div class="info">
              <div class="num">{{info.orderCost | numberToCurrencyNo}}</div>
              <div class="state">运输费用</div>
            </div>
          </li>
          <li @click="goByParam('/pt/fc/storehouse/storeHouseBillManage.vue', '仓储成本','',{t:1})">
            <img src="@/static/image/icons/info-icon4.png" alt="" />
            <div class="info">
              <div class="num">{{info.storeCost | numberToCurrencyNo}}</div>
              <div class="state">仓储费用</div>
            </div>
          </li>
          <li @click="goByParam('/pt/pkg/fc/packCostManage.vue', '包装成本')">
            <img src="@/static/image/icons/info-icon5.png" alt="" />
            <div class="info">
              <div class="num">{{info.pkgCost | numberToCurrencyNo}}</div>
              <div class="state">器具费用</div>
            </div>
          </li>
          <li @click="goByParam('/pt/fc/sundry/prjSundryFeeManage.vue', '其他成本','',{t:1})">
            <img src="@/static/image/icons/info-icon6.png" alt="" />
            <div class="info">
              <div class="num">{{info.otherCost | numberToCurrencyNo}}</div>
              <div class="state">其他费用</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="menusView fr">
      <div class="menusItem clearfix">
        <div class="title">账单管理</div>
        <ul class="menus spec clearfix">
          <li v-entity="1006011" @click="go('/pt/fc/custBill/customerBillManageMain.vue', 1006011,  '客户账单')">
            <img src="@/static/image/icons/fina_list_i_1_1.png" alt="" />
            <p>客户账单</p>
          </li>
          <li v-entity="1006012" @click="go('/pt/fc/supplierBill/supplierBillManageMain.vue', 1006012,  '供应商账单')">
            <img src="@/static/image/icons/fina_list_i_1_2.png" alt="" />
            <p>供应商账单</p>
          </li>
          <li v-entity="1006013" @click="go('/pt/fc/ownVehicleBill/ownVehicleBillManageMain.vue', 1006013,  '自有车账单')">
            <img src="@/static/image/icons/fina_list_i_1_3.png" alt="" />
            <p>自有车账单</p>
          </li>
          <li  v-entity="1006014" @click="go('/pt/fc/financialCenter/feechangeMain.vue', 1006014,  '费用补录')">
            <img src="@/static/image/icons/fina_list_i_1_4.png" alt="" />
            <p>费用补录</p>
          </li>
        </ul>
      </div>
      <div class="menusItem clearfix">
        <div class="title">发票管理</div>
        <ul class="menus clearfix">
          <li v-entity="1006015" @click="go('/pt/fc/invoice/applyInvoiceManage.vue', 1006015,  '开票申请管理')">
            <img src="@/static/image/icons/fina_list_i_2_1.png" alt="" />
            <p>开票申请管理</p>
          </li>
          <li v-entity="1006016" @click="go('/pt/fc/invoice/submitInvoiceManage.vue', 1006016,  '发票提交管理')">
            <img src="@/static/image/icons/fina_list_i_2_2.png" alt="" />
            <p>发票提交管理</p>
          </li>
          <li v-entity="1006017" @click="go('/pt/fc/invoice/costAccountManage.vue', 1006017,  '自有车成本记账')">
            <img src="@/static/image/icons/fina_list_i_2_3.png" alt="" />
            <p>自有车成本记账</p>
          </li>
        </ul>
      </div>
      <div class="menusItem clearfix">
        <div class="title">收支登记</div>
        <ul class="menus spec5 clearfix">
          <li v-entity="1006018" @click="go('/pt/fc/register/collectionRegistration.vue', 1006018,  '收款登记')">
            <img src="@/static/image/icons/fina_list_i_3_1.png" alt="" />
            <p>收款登记</p>
          </li>
          <li v-entity="1006019" @click="go('/pt/fc/register/collectionRegistrationRecord.vue', 1006019,  '收款记录')">
            <img src="@/static/image/icons/fina_list_i_3_2.png" alt="" />
            <p>收款记录</p>
          </li>
          <li v-entity="1006020" @click="go('/pt/fc/register/expenditureRegisterManage.vue', 1006020,  '付款登记')">
            <img src="@/static/image/icons/fina_list_i_3_3.png" alt="" />
            <p>付款登记</p>
          </li>
          <li v-entity="1006021" @click="go('/pt/fc/register/expenditureRegisterRecord.vue', 1006021,  '付款记录')">
            <img src="@/static/image/icons/fina_list_i_3_4.png" alt="" />
            <p>付款记录</p>
          </li>
          <li v-entity="1006022" @click="go('/pt/fc/register/payReceiveManageMain.vue', 1006022,  '预收预付')">
            <img src="@/static/image/icons/fina_list_i_3_5.png" alt="" />
            <p>预收预付</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import financialCenter from "./financialCenter.js"
export default financialCenter
</script>
<style lang="scss" src="./financialCenter.scss"></style>
