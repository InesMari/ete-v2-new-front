<template>
  <div id="dataReport" class="dataReportPage">
      <div class="reportList clearfix">
          <div class="item" v-entity :entityId="[{1007005:1007007}]" @click="go('/pt/rpt/transportReport/customerOperationSummary.vue', 1007007,  '客户运作汇总')">
              <div class="time"></div>
              <div class="con">
                <div class="name">客户运作汇总</div>
                <div class="introduce">所有客户的运作汇总数据，包括：总票数，准时率，延误率，总调度货物信息，总收入，总成本，总毛利。</div>
                <ul class="info clearfix">
                    <li class="fl">
                        <div class="icon">
                            <img src="@/static/image/icons/data-icon.png" alt="">
                        </div>
                        <p>客户数</p>
                        <p><span class="num">{{info.custNums}}</span>人</p>
                    </li>
                    <li class="fr">
                        <div class="icon">
                            <img src="@/static/image/icons/data-icon.png" alt="">
                        </div>
                        <p>上月累计订单</p>
                        <p><span class="num">{{info.lastMonthOrderNums}}</span>单</p>
                    </li>
                </ul>
              </div>
          </div>
          <div class="item" v-entity :entityId="[{1007005:1007008}]" @click="go('/pt/rpt/transportReport/customerOperationDetail.vue', 1007008,  '客户运作明细')">
              <div class="time"></div>
              <div class="con">
                <div class="name">客户运作明细</div>
                <div class="introduce">所有客户的运作明细数据，包括：每个作业点的要求到达时间，实际到达时间，准时/延误，操作方式，操作人。</div>
                <ul class="info clearfix">
                    <li class="fl">
                        <div class="icon">
                            <img src="@/static/image/icons/data-icon.png" alt="">
                        </div>
                        <p>上月准时率</p>
                        <p><span class="num">{{info.lastMonthOnTimeRate}}</span>%</p>
                    </li>
                    <li class="fr">
                        <div class="icon">
                            <img src="@/static/image/icons/data-icon.png" alt="">
                        </div>
                        <p>本月准时率</p>
                        <p><span class="num">{{info.currentMonthOnTimeRate}}</span>%</p>
                    </li>
                </ul>
              </div>
          </div>
          <div class="item" v-entity :entityId="[{1007005:1007009}]" @click="go('/pt/rpt/transportReport/supplierOperationSummary.vue', 1007009,  '供应商运作汇总')">
              <div class="time"></div>
              <div class="con">
                <div class="name">供应商运作汇总</div>
                <div class="introduce">统计所有供应商运作的总票数，准时票数，延误票数，准时率，延误率，提货/卸货准时率，提货/卸货延误率</div>
                <ul class="info clearfix">
                    <li class="fl">
                        <div class="icon">
                            <img src="@/static/image/icons/data-icon.png" alt="">
                        </div>
                        <p>供应商数</p>
                        <p><span class="num">{{info.supplierNums}}</span>个</p>
                    </li>
                    <li class="fr">
                        <div class="icon">
                            <img src="@/static/image/icons/data-icon.png" alt="">
                        </div>
                        <p>本月累计运单</p>
                        <p><span class="num">{{info.currentMonthWaybillNums}}</span>单</p>
                    </li>
                </ul>
              </div>
          </div>
          <div class="item" v-entity :entityId="[{1007005:1007010}]" @click="go('/pt/rpt/transportReport/supplierOperationDetail.vue', 1007010,  '供应商运作明细')">
              <div class="time"></div>
              <div class="con">
                <div class="name">供应商运作明细</div>
                <div class="introduce">所有供应商运作的派车单的作业点进行拆分计算，包括要求到达时间，实际到达时间，准时/延误，操作方式等</div>
                <ul class="info clearfix">
                    <li class="fl">
                        <div class="icon">
                            <img src="@/static/image/icons/data-icon.png" alt="">
                        </div>
                        <p>提货准时率</p>
                        <p><span class="num">{{info.pickupWaybilOnTimeRate}}</span>%</p>
                    </li>
                    <li class="fr">
                        <div class="icon">
                            <img src="@/static/image/icons/data-icon.png" alt="">
                        </div>
                        <p>卸货准时率</p>
                        <p><span class="num">{{info.deliveryWaybilOnTimeRate}}</span>%</p>
                    </li>
                </ul>
              </div>
          </div>
          <div class="item" v-entity :entityId="[{1007005:1007006}]" @click="go('/pt/rpt/transportReport/orderOperationReport.vue', 1007006,  '订单运作报表')">
            <div class="time"></div>
            <div class="con">
              <div class="name">订单运作报表</div>
              <div class="introduce">所有订单的运作数据，包括：客户，供应商，订单信息，费用信息，收入，成本，毛利。</div>
              <ul class="info clearfix">
                <li class="fl">
                  <div class="icon">
                    <img src="@/static/image/icons/data-icon.png" alt="">
                  </div>
                  <p>昨日订单</p>
                  <p><span class="num">{{info.yesterdayOrderNums}}</span>单</p>
                </li>
                <li class="fr">
                  <div class="icon">
                    <img src="@/static/image/icons/data-icon.png" alt="">
                  </div>
                  <p>累计订单</p>
                  <p><span class="num">{{info.totalOrderNums}}</span>单</p>
                </li>
              </ul>
            </div>
          </div>
          <div class="item" v-entity :entityId="[{1007005:1007011}]" @click="go('/pt/rpt/custOperation/custOperationReport.vue', 1007011,  '客户运作报表')">
              <div class="time"></div>
              <div class="con">
                <div class="name">客户运作报表</div>
                <div class="introduce">所有客户的全年收入，成本，毛利额，毛利率的统计，可查询全年内任意一个月的收入明细。</div>
                <ul class="info clearfix">
                    <li class="fl">
                        <div class="icon">
                            <img src="@/static/image/icons/data-icon.png" alt="">
                        </div>
                        <p>全年毛利率</p>
                        <p><span class="num">{{info.currentYearGrossProfitRate}}</span>%</p>
                    </li>
                    <li class="fr">
                        <div class="icon">
                            <img src="@/static/image/icons/data-icon.png" alt="">
                        </div>
                        <p>全年收入</p>
                        <p><span class="num">{{info.currentYearIncomeFee | numberToCurrencyNo}}</span>元</p>
                    </li>
                </ul>
              </div>
          </div>
          <div class="item" v-entity :entityId="[{1007005:1007014}]" @click="go('/pt/rpt/feeReport/meetReportMain.vue', 1007014,  '应付款管理')">
              <div class="time"></div>
              <div class="con">
                <div class="name">应付款管理</div>
                <div class="introduce">根据发票提交统计，包括相对应的供应商应付金额，已付金额，未付金额，最后付款日期以及应付账龄。</div>
                <ul class="info clearfix">
                    <li class="fl">
                        <div class="icon">
                            <img src="@/static/image/icons/data-icon.png" alt="">
                        </div>
                        <p>应付汇总</p>
                        <p><span class="num">{{info.totalNoInvoicePayFee | numberToCurrencyNo}}</span>元</p>
                    </li>
                    <li class="fr">
                        <div class="icon">
                            <img src="@/static/image/icons/data-icon.png" alt="">
                        </div>
                        <p>30天应付</p>
                        <p><span class="num">{{info.totalNoInvoicePayFee30 | numberToCurrencyNo}}</span>元</p>
                    </li>
                </ul>
              </div>
          </div>
          <div class="item" v-entity :entityId="[{1007005:1007015}]" @click="go('/pt/rpt/feeReport/receivableReportMain.vue', 1007015,  '应收款管理')">
              <div class="time"></div>
              <div class="con">
                <div class="name">应收款管理</div>
                <div class="introduce">根据发票申请统计，包括相对应的客户应收金额，已收金额，未收金额，最后收款日期以及应收账龄。</div>
                <ul class="info clearfix">
                    <li class="fl">
                        <div class="icon">
                            <img src="@/static/image/icons/data-icon.png" alt="">
                        </div>
                        <p>应收汇总</p>
                        <p><span class="num">{{info.totalNoReceiveFee | numberToCurrencyNo}}</span>元</p>
                    </li>
                    <li class="fr">
                        <div class="icon">
                            <img src="@/static/image/icons/data-icon.png" alt="">
                        </div>
                        <p>30天应收</p>
                        <p><span class="num">{{info.totalNoReceiveFee30 | numberToCurrencyNo}}</span>元</p>
                    </li>
                </ul>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
  import dataReport from "./dataReport.js"
  export default dataReport
</script>
<style lang="scss" src="./dataReport.scss"></style>
