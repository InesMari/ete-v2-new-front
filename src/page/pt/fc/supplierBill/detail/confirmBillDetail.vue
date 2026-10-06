<template>
    <div id="confirmBillDetail" class="fcCommonPage">
        <div class="tagList clearfix">
            <div class="tag" style="width:33%;">
                <div class="tip"><span>供应商</span></div>
                <h3 class="title">基本信息</h3>
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
                  <div class="label"><em>*</em>账单月份：</div>
                  <div class="text fw">{{ bill.billMonth }}</div>
                </div>
                <div class="item">
                  <div class="label">账单备注：</div>
                  <div class="text fw">{{ bill.remark }}</div>
                </div>
                <div class="item">
                  <div class="label">结算主体：</div>
                  <div class="text fw">{{ bill.settleBodyName }}</div>
                </div>
              </div>
            </div>
            <div class="tag" style="width: 33%;">
                <div class="tip"><span>账单</span></div>
                <h3 class="title">账单金额</h3>
                <h5 class="cash">￥{{ bill.totalFee }} 元</h5>
                <div class="contet" style="padding-left:80px;">
                  <div class="item">
                    <div class="label fw">运输金额：</div>
                    <div class="text">￥{{ bill.waybillFee }}元</div>
                  </div>
                  <div class="item">
                    <div class="label fw">仓储金额：</div>
                    <div class="text">￥{{ bill.storehouseFee }}元</div>
                  </div>
                  <div class="item">
                    <div class="label fw">器具金额：</div>
                    <div class="text">￥{{ bill.packCostFee }}元</div>
                  </div>
<!--                  <div class="item">-->
<!--                    <div class="label fw">其他金额：</div>-->
<!--                    <div class="text">￥{{ bill.otherFee }}元</div>-->
<!--                  </div>-->
                  <div class="item">
                    <div class="label fw">补录金额：</div>
                    <div class="text">￥{{ bill.makeupFee }}元</div>
                  </div>
                </div>
            </div>

<!--            <div class="tag" style="width: 25%;">-->
<!--                <div class="tip"><span>发票</span></div>-->
<!--                <h3 class="title">发票金额</h3>-->
<!--                <div class="contet" style="padding-left:80px;">-->
<!--                    <div class="item">-->
<!--                        <div class="label fw">已提交金额：</div>-->
<!--                        <div class="text">￥{{ bill.supplyInvoiceFee }}元</div>-->
<!--                    </div>-->
<!--                    <div class="item">-->
<!--                        <div class="label fw">未提交金额：</div>-->
<!--                        <div class="text">￥{{ bill.noSupplyInvoiceFee }}元</div>-->
<!--                    </div>-->
<!--                    <div class="item">-->
<!--                        <div class="label fw">已审核金额：</div>-->
<!--                        <div class="text">￥{{ bill.verifyInvoiceFee }}元</div>-->
<!--                    </div>-->
<!--                    <div class="item">-->
<!--                        <div class="label fw">未审核金额：</div>-->
<!--                        <div class="text">￥{{ bill.noVerifyInvoiceFee }}元</div>-->
<!--                    </div>-->
<!--                    <div class="item">-->
<!--                      <div class="label fw">审核不通过金额：</div>-->
<!--                      <div class="text">￥{{ bill.verifyOutInvoiceFee }}元</div>-->
<!--                    </div>-->
<!--                </div>-->
<!--            </div>-->

            <div class="tag" style="width: 33%;">
                <div class="tip"><span>应付</span></div>
                <h3 class="title">应付金额</h3>
                <h5 class="cash">￥{{ bill.payableFee }} 元</h5>
                <div class="definite">
                    <div class="label">已付款</div>
                    <div class="text">￥ {{ bill.payFee }}  元</div>
                </div>
                <div class="definite">
                    <div class="label" style="background: #1990ff">未付款</div>
                    <div class="text">￥ {{ bill.noPayFee }}  元</div>
                </div>
<!--                <div class="txt_c"><a href="javascript:void(0);" class="link" @click="">查看收款明细></a></div>-->
            </div>
        </div>

        <div class="table-content" style="margin:0;">
            <div class="table-title">
                <div class="tab-title clearfix">
                    <div class="tab" :class="{'active':tab.active}" @click="changeTab(tab)" v-show="tab.show" v-for="(tab,index) in tabs" :key="index">{{ tab.name }}</div>
                </div>
                <div class="table-title-btn">
                  <el-button type="primary" plain size="mini" @click="toDetail(false)" v-show="showGotoDetail">查看详情</el-button>
                  <el-button type="primary" plain size="mini" @click="downloadOrder()" v-show="showGotoDetail">导出订单</el-button>
                  <el-button type="primary" plain size="mini" @click="download()">导出EXCEL</el-button>
                </div>
            </div>
            <simpleTable ref="table" tableName="billDetailTable" :head="head" :data="tableData" @dblclickItem="dblclickItem" :singleSelect="true">
              <template v-slot="{item, code}">
                <a href="javascript:void(0);" v-if="code='submitInvoiceNum'" class="link" @click.stop="toSubmitInvoice(item)" style="margin: 0 10px;">{{item[code]}}</a>
              </template>
            </simpleTable>
        </div>

        <div class="bot-btn" style="margin-top: 20px;">
            <el-button @click="closePage">关闭</el-button>
        </div>

    </div>
</template>

<script>
	import confirmBillDetail from './confirmBillDetail.js'

	export default confirmBillDetail
</script>
<style lang="scss">
@import '@/page/pt/fc/fc_common.scss';
#confirmBillDetail {
  .tagList .tag .contet .item .label{
    width: 115px;
  }
}
</style>
