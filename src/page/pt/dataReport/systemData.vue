<template>
  <div id="systemData" class="dataReportPage systemData">
      <div class="reportList clearfix">
          <div class="item" v-entity="1007133"
               @click="go('/pt/ord/order/orderManage.vue',
               1003005,
               '订单管理',
               {
                   'day': query.orderDay1,
                   'orderState': 0,
                   'isUnDispatch': 1,
               })">
              <div class="time"></div>
              <div class="con">
                  <div class="name">已下单未调度</div>
                  <div class="introduce">已下单超{{ query.orderDay1 }}天未调度的订单数</div>
                  <ul class="info clearfix">
                      <li >
                          <p><span class="num">{{info.orderCount1}}</span></p>
                      </li>
                  </ul>
              </div>
          </div>
          <div class="item" v-entity="1007134"
               @click="go('/pt/ord/order/orderManage.vue',
               1003005,
               '订单管理',
               {
                   'day': query.orderDay2,
                   'orderState': 1,
                   'isUnStartCar': 1,
               })">
              <div class="time"></div>
              <div class="con">
                  <div class="name">已调度未出车</div>
                  <div class="introduce">已调度超{{ query.orderDay2 }}天未出车的订单数</div>
                  <ul class="info clearfix">
                      <li >
                          <p><span class="num">{{info.orderCount2}}</span></p>
                      </li>
                  </ul>
              </div>
          </div>
          <div class="item" v-entity="1007135"
               @click="go('/pt/ord/waybill/waybillManage.vue',
               1003009,
               '派车单管理',
               {
                   'day': query.waybillDay1,
                   'waybillState': 2,
                   'isStartCar': 1,
               })">
              <div class="time"></div>
              <div class="con">
                  <div class="name">已出车未收车</div>
                  <div class="introduce">已出车超{{ query.waybillDay1 }}天未收车的派车单数</div>
                  <ul class="info clearfix">
                      <li >
                          <p><span class="num">{{info.waybillCount1}}</span></p>
                      </li>
                  </ul>
              </div>
          </div>
          <div class="item" v-entity="1007136"
               @click="go('/pt/ord/waybill/waybillManage.vue',
               1003009,
               '派车单管理',
               {
                   'day': query.waybillDay2,
                   'isAbnormalOp': 1,
               })">
              <div class="time"></div>
              <div class="con">
                  <div class="name">司机异常打点</div>
                  <div class="introduce">最近{{ query.waybillDay2 }}天司机异常打点的派车单</div>
                  <ul class="info clearfix">
                      <li >
                          <p><span class="num">{{info.waybillCount2}}</span></p>
                      </li>
                  </ul>
              </div>
          </div>
          <div class="item" v-entity="1007137"
               @click="go('/pt/ord/waybill/waybillManage.vue',
               1003009,
               '派车单管理',
               {
                   'day': query.waybillDay3,
                   'isNormalOp': 1,
               })">
              <div class="time"></div>
              <div class="con">
                  <div class="name">司机正常打点</div>
                  <div class="introduce">最近{{ query.waybillDay3 }}天司机正常打点的派车单</div>
                  <ul class="info clearfix">
                      <li >
                          <p><span class="num">{{info.waybillCount3}}</span></p>
                      </li>
                  </ul>
              </div>
          </div>
          <div class="item" v-entity="1007138"
               @click="go('/pt/ord/waybill/waybillManage.vue',
               1003009,
               '派车单管理',
               {
                   'day': query.waybillDay4,
                   'isAbnormalEndCar': 1,
               })">
              <div class="time"></div>
              <div class="con">
                  <div class="name">收车异常</div>
                  <div class="introduce">收车日期-出车日期大于{{ query.waybillDay4 }}天</div>
                  <ul class="info clearfix">
                      <li >
                          <p><span class="num">{{info.waybillCount4}}</span></p>
                      </li>
                  </ul>
              </div>
          </div>
          <div class="item" v-entity="1007139"
               @click="go('/pt/ord/order/orderManage.vue',
               1003005,
               '订单管理',
               {
                   'day': query.orderDay3,
                   'isUnEntryBill': 1,
               })">
              <div class="time"></div>
              <div class="con">
                  <div class="name">订单完成未入账</div>
                  <div class="introduce">超过{{ query.orderDay3 }}天仍未未入账的订单数</div>
                  <ul class="info clearfix">
                      <li >
                          <p><span class="num">{{info.orderCount3}}</span></p>
                      </li>
                  </ul>
              </div>
          </div>
          <div class="item" v-entity="1007140"
               @click="go('/pt/ord/waybill/waybillManage.vue',
               1003009,
               '派车单管理',
               {
                   'day': query.waybillDay5,
                   'waybillState': 3,
                   'isUnEntryBill': 1,
               })">
              <div class="time"></div>
              <div class="con">
                  <div class="name">派车单完成未入账</div>
                  <div class="introduce">已完成派车单{{ query.waybillDay5 }}天以上未入账</div>
                  <ul class="info clearfix">
                      <li >
                          <p><span class="num">{{info.waybillCount5}}</span></p>
                      </li>
                  </ul>
              </div>
          </div>
          <div class="item" v-entity="1007141"
               @click="go('/pt/rpt/feeReport/receivableReportMain.vue',
               1007015,
               '应收款管理',
               {
                   'day': query.receivableDay,
               })">
              <div class="time"></div>
              <div class="con">
                  <div class="name">逾期未收款客户应收列表</div>
                  <div class="introduce">逾期{{ query.receivableDay }}内天未收款客户账单</div>
                  <ul class="info clearfix">
                      <li class="fl">
                          <p><span>应收记录</span><span class="num">{{info.receivableCount}}</span></p>
                      </li>
                      <li class="fr">
                          <p><span></span>未收金额</span><span class="num">{{info.receivableAmount}}</span></p>
                      </li>
                  </ul>
              </div>
          </div>
          <div class="item" v-entity="1007142"
               @click="go('/pt/rpt/feeReport/meetReportMain.vue',
               1007014,
               '应付款管理',
               {
                   'day': query.payableDay,
               })">
              <div class="time"></div>
              <div class="con">
                  <div class="name">逾期未付款供应商应付列表</div>
                  <div class="introduce">逾期{{ query.payableDay }}内天未付款供应商账单</div>
                  <ul class="info clearfix">
                      <li class="fl">
                          <p><span>应付记录</span><span class="num">{{info.payableCount}}</span></p>
                      </li>
                      <li class="fr">
                          <p><span>未付金额</span><span class="num">{{info.payableAmount}}</span></p>
                      </li>
                  </ul>
              </div>
          </div>
          <div class="item" v-entity="1007145"
               @click="go('/pt/ord/order/orderManage.vue',
               1003005,
               '订单管理',
               {
                   'day': query.orderDay,
                   'orderState': 2,
                   'isNoIncome': 1,
               })">
              <div class="time"></div>
              <div class="con">
                <div class="name">订单收入金额为0的记录</div>
                <div class="introduce">{{ query.orderDay }}内创建且已完成订单且金额为0的总单数</div>
                <ul class="info clearfix">
                    <li >
                        <p><span class="num">{{info.orderCount}}</span></p>
                    </li>
                </ul>
              </div>
          </div>
          <div class="item" v-entity="1007146"
               @click="go('/pt/ord/waybill/waybillManage.vue',
               1003009,
               '派车单管理',
               {
                   'day': query.waybillDay,
                   'waybillState': 3,
                   'isNoCost': 1,
                   'vehicleAttribution': 1,
               })">
              <div class="time"></div>
              <div class="con">
                  <div class="name">派车单成本金额为0的记录</div>
                  <div class="introduce">{{ query.waybillDay }}内创建且已完成非自有车派车单金额为0的总单数</div>
                  <ul class="info clearfix">
                      <li >
                          <p><span class="num">{{info.waybillCount}}</span></p>
                      </li>
                  </ul>
              </div>
          </div>
      </div>

      <div class="reportList clearfix">
          <div class="item" v-entity="1007143"
               @click="seeBigger()">
              <div class="time"></div>
              <div class="con">
                  <div class="name">自有车出勤率</div>
                  <div class="introduce">近30天</div>
                  <div class="chart" id="chart1" style="height: 300px; width: 300px;"></div>
              </div>
          </div>
          <div class="item" v-entity="1007144"
               @click="seeBigger()">
              <div class="time"></div>
              <div class="con">
                  <div class="name">车辆保险有效数量</div>
                  <div class="introduce"></div>
                  <div class="chart" id="chart2" style="height: 300px; width: 300px;"></div>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
  import systemData from "./systemData.js"
  export default systemData
</script>
<style lang="scss" src="./dataReport.scss"></style>
