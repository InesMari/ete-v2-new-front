<template>
  <div id="toMain" class="toMainHZPage clearfix">
      <div style="display: none;">
      <div class="infoView fl">
        <div class="customerLabel"><span>客户</span></div>
        <div class="companyName">广东凯金新能源科技股份有限公司
          <div class="icons">
            <img src="@/static/image/icons/title-icon1.png" alt="" title="收支预算配置" />
            <img src="@/static/image/icons/title-icon2.png" alt="" title="权限分配" />
            <img src="@/static/image/icons/title-icon3.png" alt="" title="子公司" />
            <img src="@/static/image/icons/title-icon4.png" alt="" title="运作时间配置" />
          </div>
        </div>
        <div class="totalList clearfix">
          <div class="item">
            <div class="iconView">
              <img src="@/static/image/icons/total-icon1.png" alt="" style="width:25px;" />
            </div>
            <p>今日订单</p>
            <p><span class="num">310</span>单</p>
          </div>
          <div class="item">
            <div class="iconView iconView2">
              <img src="@/static/image/icons/total-icon2.png" alt="" style="width:30px;" />
            </div>
            <p>今日派车单</p>
            <p><span class="num">310</span>单</p>
          </div>
          <div class="item">
            <div class="iconView iconView3">
              <img src="@/static/image/icons/total-icon3.png" alt="" style="width:25px;" />
            </div>
            <p>本月累计订单</p>
            <p><span class="num">310</span>单</p>
          </div>
          <div class="item">
            <div class="iconView iconView4">
              <img src="@/static/image/icons/total-icon4.png" alt="" style="width:25px;" />
            </div>
            <p>本月累计运费</p>
            <p><span class="num">310</span>元</p>
          </div>
        </div>
        <div class="orderDate">
          <div class="title clearfix">
            <h4>订单日历</h4>
            <i class="icon el-icon-arrow-left" @click="preWeek"></i>
            <i class="icon el-icon-arrow-right" @click="nextWeek"></i>
            <el-date-picker v-model="monthPicker" type="month" placeholder="选择月" @change="changeMonth"></el-date-picker>
          </div>
          <ul class="weeks clearfix">
            <li :class="{'active':item.data==currentDate}" v-for="(item,index) in weeks" :key="index" @click="selectDate(item.data)">
              <p class="week">{{item.week}}</p>
              <p class="date">{{item.date}}</p>
              <div class="tip">
                <i class="circle circle1"></i>
                <i class="circle circle2"></i>
                <i class="circle circle3"></i>
              </div>
            </li>
          </ul>
          <ul class="orders clearfix">
            <li>
              <img src="@/static/image/icons/info-icon1.png" alt="" />
              <div class="info">
                <div class="num">30单</div>
                <div class="state">待调度</div>
              </div>
            </li>
            <li>
              <img src="@/static/image/icons/info-icon2.png" alt="" />
              <div class="info">
                <div class="num">30单</div>
                <div class="state">运作中</div>
              </div>
            </li>
            <li>
              <img src="@/static/image/icons/info-icon3.png" alt="" />
              <div class="info">
                <div class="num">30单</div>
                <div class="state">已完成</div>
              </div>
            </li>
          </ul>
        </div>
        <ul class="menuList clearfix">
          <li>
              <img src="@/static/image/icons/menu-icon1.png" alt="" />基础信息
          </li>
          <li>
              <img src="@/static/image/icons/menu-icon2.png" alt="" />货物信息
          </li>
          <li>
              <img src="@/static/image/icons/menu-icon3.png" alt="" />作业信息
          </li>
          <li>
              <img src="@/static/image/icons/menu-icon4.png" alt="" />线路信息
          </li>
          <li>
              <img src="@/static/image/icons/menu-icon5.png" alt="" />整车合同
          </li>
          <li>
              <img src="@/static/image/icons/menu-icon6.png" alt="" />零担合同
          </li>
          <li>
              <img src="@/static/image/icons/menu-icon7.png" alt="" />仓储合同
          </li>
          <li>
              <img src="@/static/image/icons/menu-icon8.png" alt="" />包装合同
          </li>
        </ul>
      </div>
      <div class="menusView fr">
        <div class="menusItem">
          <div class="title">运输业务操作</div>
          <ul class="menus clearfix">
            <li>
              <img src="@/static/image/icons/menu-1-1.png" alt="" />
              <p>新增订单</p>
            </li>
            <li>
              <img src="@/static/image/icons/menu-1-2.png" alt="" />
              <p>新增订单包</p>
            </li>
            <li>
              <img src="@/static/image/icons/menu-1-3.png" alt="" />
              <p>订单调度</p>
            </li>
            <li>
              <img src="@/static/image/icons/menu-1-4.png" alt="" />
              <p>零担调度</p>
            </li>
            <li>
              <img src="@/static/image/icons/menu-1-5.png" alt="" />
              <p>上传单据</p>
            </li>
            <li>
              <img src="@/static/image/icons/menu-1-6.png" alt="" />
              <p>费用异动</p>
            </li>
          </ul>
        </div>
        <div class="menusItem">
          <div class="title">运输汇总清单</div>
          <ul class="menus spec clearfix">
            <li>
              <img src="@/static/image/icons/menu-2-1.png" alt="" />
              <p>订单管理</p>
            </li>
            <li>
              <img src="@/static/image/icons/menu-2-2.png" alt="" />
              <p>库存管理</p>
            </li>
            <li>
              <img src="@/static/image/icons/menu-2-3.png" alt="" />
              <p>订单包管理</p>
            </li>
            <li>
              <img src="@/static/image/icons/menu-2-4.png" alt="" />
              <p>派车单管理</p>
            </li>
            <li>
              <img src="@/static/image/icons/menu-2-7.png" alt="" />
              <p>中转管理</p>
            </li>
            <li>
              <img src="@/static/image/icons/menu-2-5.png" alt="" />
              <p>单据管理</p>
            </li>
            <li>
              <img src="@/static/image/icons/menu-2-6.png" alt="" />
              <p>异动管理</p>
            </li>
          </ul>
        </div>
        <div class="dbMenusItem clearfix">
          <div class="menusItem fl">
            <div class="title">包装业务</div>
            <ul class="menus clearfix">
              <li>
                <img src="@/static/image/icons/menu-3-1.png" alt="" />
                <p>采购管理</p>
              </li>
              <li>
                <img src="@/static/image/icons/menu-3-2.png" alt="" />
                <p>租赁管理</p>
              </li>
              <li>
                <img src="@/static/image/icons/menu-3-3.png" alt="" />
                <p>费用汇总</p>
              </li>
            </ul>
          </div>
          <div class="menusItem fr">
            <div class="title">仓储业务</div>
          </div>
        </div>
        <div class="menusItem">
          <div class="title">费用相关操作</div>
          <ul class="menus spec clearfix">
            <li>
              <img src="@/static/image/icons/menu-4-1.png" alt="" />
              <p>新增账单</p>
            </li>
            <li>
              <img src="@/static/image/icons/menu-4-2.png" alt="" />
              <p>其他费用</p>
            </li>
            <li>
              <img src="@/static/image/icons/menu-4-3.png" alt="" />
              <p>仓储费用</p>
            </li>
            <li>
              <img src="@/static/image/icons/menu-4-4.png" alt="" />
              <p>账单管理</p>
            </li>
            <li>
              <img src="@/static/image/icons/menu-4-5.png" alt="" />
              <p>费用补录</p>
            </li>
            <li>
              <img src="@/static/image/icons/menu-4-6.png" alt="" />
              <p>发票管理</p>
            </li>
            <li>
              <img src="@/static/image/icons/menu-4-7.png" alt="" />
              <p>收款登记</p>
            </li>
          </ul>
        </div>
      </div>
      </div>
  </div>
</template>

<script>
  import toMain from "./toMain.js"
  export default toMain
</script>
<style lang="scss" src="./toMain.scss"></style>
