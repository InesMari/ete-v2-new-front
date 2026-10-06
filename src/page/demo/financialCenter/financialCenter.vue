<template>
  <div id="financialCenter" class="financialCenterPage clearfix">
      <div class="infoView fl">
        <div class="totalList clearfix">
          <div class="item">
            <div class="iconView">
              <img src="@/static/image/icons/fina-icon1.png" alt="" style="width:25px;" />
            </div>
            <p>昨日收入（元）</p>
            <p><span class="num">4496787.55</span></p>
          </div>
          <div class="item">
            <div class="iconView iconView2">
              <img src="@/static/image/icons/fina-icon2.png" alt="" style="width:30px;" />
            </div>
            <p>昨日成本（元）</p>
            <p><span class="num">310</span></p>
          </div>
          <div class="item">
            <div class="iconView iconView3">
              <img src="@/static/image/icons/fina-icon3.png" alt="" style="width:25px;" />
            </div>
            <p>昨日毛利（%）</p>
            <p><span class="num">310</span></p>
          </div>
          <div class="item">
            <div class="iconView iconView4">
              <img src="@/static/image/icons/fina-icon4.png" alt="" style="width:25px;" />
            </div>
            <p>本月收入（元）</p>
            <p><span class="num">310</span></p>
          </div>
          <div class="item">
            <div class="iconView iconView5">
              <img src="@/static/image/icons/fina-icon5.png" alt="" style="width:25px;" />
            </div>
            <p>本月成本（元）</p>
            <p><span class="num">310</span></p>
          </div>
          <div class="item">
            <div class="iconView iconView6">
              <img src="@/static/image/icons/fina-icon6.png" alt="" style="width:25px;" />
            </div>
            <p>本月毛利（元）</p>
            <p><span class="num">310</span></p>
          </div>
        </div>
        <div class="orderDate">
          <h4 class="title">本月收入汇总明细</h4>
          <ul class="orders clearfix">
            <li>
              <img src="@/static/image/icons/info-icon2.png" alt="" />
              <div class="info">
                <div class="num">123565</div>
                <div class="state">运输费用</div>
              </div>
            </li>
            <li>
              <img src="@/static/image/icons/info-icon4.png" alt="" />
              <div class="info">
                <div class="num">87524.55</div>
                <div class="state">仓储费用</div>
              </div>
            </li>
            <li>
              <img src="@/static/image/icons/info-icon5.png" alt="" />
              <div class="info">
                <div class="num">57777.55</div>
                <div class="state">包装费用</div>
              </div>
            </li>
            <li>
              <img src="@/static/image/icons/info-icon6.png" alt="" />
              <div class="info">
                <div class="num">96695</div>
                <div class="state">其他费用</div>
              </div>
            </li>
          </ul>
          <h4 class="title">本月成本汇总明细</h4>
          <ul class="orders clearfix">
            <li>
              <img src="@/static/image/icons/info-icon2.png" alt="" />
              <div class="info">
                <div class="num">123565</div>
                <div class="state">运输费用</div>
              </div>
            </li>
            <li>
              <img src="@/static/image/icons/info-icon4.png" alt="" />
              <div class="info">
                <div class="num">87524.55</div>
                <div class="state">仓储费用</div>
              </div>
            </li>
            <li>
              <img src="@/static/image/icons/info-icon5.png" alt="" />
              <div class="info">
                <div class="num">57777.55</div>
                <div class="state">包装费用</div>
              </div>
            </li>
            <li>
              <img src="@/static/image/icons/info-icon6.png" alt="" />
              <div class="info">
                <div class="num">96695</div>
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
            <li>
              <img src="@/static/image/icons/fina_list_i_1_1.png" alt="" />
              <p>客户账单</p>
            </li>
            <li>
              <img src="@/static/image/icons/fina_list_i_1_2.png" alt="" />
              <p>供应商账单</p>
            </li>
            <li>
              <img src="@/static/image/icons/fina_list_i_1_3.png" alt="" />
              <p>自有车账单</p>
            </li>
            <li>
              <img src="@/static/image/icons/fina_list_i_1_4.png" alt="" />
              <p>费用补录</p>
            </li>
          </ul>
        </div>
        <div class="menusItem clearfix">
          <div class="title">发票管理</div>
          <ul class="menus clearfix">
            <li>
              <img src="@/static/image/icons/fina_list_i_2_1.png" alt="" />
              <p>开票申请管理</p>
            </li>
            <li>
              <img src="@/static/image/icons/fina_list_i_2_2.png" alt="" />
              <p>交票提交管理</p>
            </li>
            <li>
              <img src="@/static/image/icons/fina_list_i_2_3.png" alt="" />
              <p>自有车成本记账</p>
            </li>
          </ul>
        </div>
        <div class="menusItem clearfix">
          <div class="title">收支登记</div>
          <ul class="menus spec clearfix">
            <li>
              <img src="@/static/image/icons/fina_list_i_3_1.png" alt="" />
              <p>收款登记</p>
            </li>
            <li>
              <img src="@/static/image/icons/fina_list_i_3_2.png" alt="" />
              <p>收款记录</p>
            </li>
            <li>
              <img src="@/static/image/icons/fina_list_i_3_3.png" alt="" />
              <p>付款登记</p>
            </li>
            <li>
              <img src="@/static/image/icons/fina_list_i_3_4.png" alt="" />
              <p>付款记录</p>
            </li>
          </ul>
        </div>
        <div class="menusItem clearfix">
          <div class="title">G7付款管理</div>
          <ul class="menus clearfix">
            <li>
              <img src="@/static/image/icons/fina_list_i_4_1.png" alt="" />
              <p>付款申请管理</p>
            </li>
            <li>
              <img src="@/static/image/icons/fina_list_i_4_2.png" alt="" />
              <p>付款申请审核</p>
            </li>
            <li>
              <img src="@/static/image/icons/fina_list_i_3_3.png" alt="" />
              <p>G7付款登记</p>
            </li>
          </ul>
        </div>
        <div class="menusItem clearfix">
          <div class="title">高灯付款管理</div>
          <ul class="menus clearfix">
            <li>
              <img src="@/static/image/icons/fina_list_i_4_1.png" alt="" />
              <p>付款申请管理</p>
            </li>
            <li>
              <img src="@/static/image/icons/fina_list_i_4_2.png" alt="" />
              <p>付款申请审核</p>
            </li>
            <li>
              <img src="@/static/image/icons/fina_list_i_3_3.png" alt="" />
              <p>高灯付款登记</p>
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
