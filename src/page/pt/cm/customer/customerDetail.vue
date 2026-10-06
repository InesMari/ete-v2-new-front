<template>
    <div id="customerDetail" class="toMainHZPage clearfix">
        <div class="infoView fl">
            <div class="customerLabel"><span>客户</span></div>
            <div class="companyName">
                {{ tenantName }}
                <div class="block" style="
            display: inline-block;
            vertical-align: bottom;
            margin-left: 6px;">
                    <el-rate
                            v-model="collect.creditLevel"
                            :colors="colors" disabled
                            show-text :texts="texts" text-color="red">
                    </el-rate>
                </div>
                <div class="icons">
                    <!--            <img src="@/static/image/icons/title-icon1.png" alt="" title="收支预算配置" @click="toBudgetManage" v-entity="1001008"/>-->
                    <img src="@/static/image/icons/title-icon2.png" alt="" title="权限分配" @click="loadEntityTree"
                         v-entity="1001012"/>
                    <!--            <img src="@/static/image/icons/title-icon3.png" alt="" title="子公司" @click="toSubCustomerManage" v-entity="1001013"/>-->
                    <img src="@/static/image/icons/title-icon4.png" alt="" title="运作时间配置"
                         @click="toCustomerTimeManage" v-entity="1001019"/>
                    <img src="@/static/image/icons/title-icon5.png" alt="" title="应用管理" @click="applicationManage" v-entity="1001095"/>
                    <img src="@/static/image/icons/title-icon6.png" alt="" title="接口管理" @click="interfaceManage" v-entity="1001096"/>
                </div>
            </div>
            <div class="totalList clearfix">
                <div class="item">
                    <div class="iconView">
                        <img src="@/static/image/icons/total-icon1.png" alt="" style="width:25px;"/>
                    </div>
                    <p>今日订单</p>
                    <p><span class="num">{{ collect.orderCount }}</span>单</p>
                </div>
                <div class="item">
                    <div class="iconView iconView2">
                        <img src="@/static/image/icons/total-icon2.png" alt="" style="width:30px;"/>
                    </div>
                    <p>今日派车单</p>
                    <p><span class="num">{{ collect.waybillCount }}</span>单</p>
                </div>
                <div class="item">
                    <div class="iconView iconView3">
                        <img src="@/static/image/icons/total-icon3.png" alt="" style="width:25px;"/>
                    </div>
                    <p>本月累计订单</p>
                    <p><span class="num">{{ collect.orderMonCount }}</span>单</p>
                </div>
                <div class="item">
                    <div class="iconView iconView4">
                        <img src="@/static/image/icons/total-icon4.png" alt="" style="width:25px;"/>
                    </div>
                    <p>本月累计运费</p>
                    <p><span class="num">{{ collect.waybillFeeCount }}</span>元</p>
                </div>
            </div>
            <div class="orderDate">
                <div class="title clearfix">
                    <h4>订单日历</h4>
                    <i class="icon el-icon-arrow-left" @click="preWeek"></i>
                    <i class="icon el-icon-arrow-right" @click="nextWeek"></i>
                    <el-date-picker v-model="month" type="month" placeholder="选择月"
                                    @change="initWeek"></el-date-picker>
                </div>
                <ul class="weeks clearfix">
                    <li :class="{'active':item.date==currentDate}" v-for="(item,index) in weeks" :key="index"
                        @click="changeDay(item, index)">
                        <p class="week">{{ item.week }}</p>
                        <p class="date">{{ item.date }}</p>
                        <div class="tip" style="height: 20px;">
                            <i class="circle circle1" v-show="item.waitAppointCount > 0"></i>
                            <i class="circle circle2" v-show="item.inWayCount > 0"></i>
                            <i class="circle circle3" v-show="item.finishedCount > 0"></i>
                        </div>
                    </li>
                </ul>
                <ul class="orders clearfix">
                    <li @click="toWaybillAppoint">
                        <img src="@/static/image/icons/info-icon1.png" alt=""/>
                        <div class="info">
                            <div class="num">{{ sumDayData.waitAppointCount }}单</div>
                            <div class="state">待调度</div>
                        </div>
                    </li>
                    <li @click="toWaybillInway">
                        <img src="@/static/image/icons/info-icon2.png" alt=""/>
                        <div class="info">
                            <div class="num">{{ sumDayData.inWayCount }}单</div>
                            <div class="state">运作中</div>
                        </div>
                    </li>
                    <li @click="toWaybillFinished">
                        <img src="@/static/image/icons/info-icon3.png" alt=""/>
                        <div class="info">
                            <div class="num">{{ sumDayData.finishedCount }}单</div>
                            <div class="state">已完成</div>
                        </div>
                    </li>
                </ul>
            </div>
            <ul class="menuList clearfix">
                <li @click="toCustomerDetail" v-entity="1001023">
                    <img src="@/static/image/icons/menu-icon1.png" alt=""/>基础信息
                </li>
                <li @click="toCustomerGoods" v-entity="1001024">
                    <img src="@/static/image/icons/menu-icon2.png" alt=""/>货物信息
                </li>
                <li @click="toCustomerWork" v-entity="1001029">
                    <img src="@/static/image/icons/menu-icon3.png" alt=""/>作业信息
                </li>
                <li @click="toCustomerRoute" v-entity="1001035">
                    <img src="@/static/image/icons/menu-icon4.png" alt=""/>线路信息
                </li>
                <li @click="toCustomerQuoteZC" v-entity="1001041">
                    <img src="@/static/image/icons/menu-icon5.png" alt=""/>整车报价
                </li>
                <li @click="toCustomerQuoteLD" v-entity="1001047">
                    <img src="@/static/image/icons/menu-icon6.png" alt=""/>零担报价
                </li>
                <li @click="toCustomerStorehouse" v-entity="1001053">
                    <img src="@/static/image/icons/menu-icon7.png" alt=""/>仓储合同
                </li>
                <li @click="toCustomerPkg" v-entity="1001058">
                    <img src="@/static/image/icons/menu-icon8.png" alt=""/>器具合同
                </li>
            </ul>
        </div>
        <div class="menusView fr">
            <div class="menusItem">
                <div class="title">运输业务操作</div>
                <ul class="menus clearfix">
                    <li @click="toAddOrder" v-entity="1003020">
                        <img src="@/static/image/icons/menu-1-1.png" alt=""/>
                        <p>新增订单</p>
                    </li>
                    <li @click="toAddOrderPlan" v-entity="1003031">
                        <img src="@/static/image/icons/menu-1-2.png" alt=""/>
                        <p>新增计划</p>
                    </li>
                    <li @click="toDispatch" v-entity="1003018">
                        <img src="@/static/image/icons/menu-1-3.png" alt=""/>
                        <p>订单调度</p>
                    </li>
                    <li @click="toDispatchLD" v-entity="100301">
                        <img src="@/static/image/icons/menu-1-4.png" alt=""/>
                        <p>零担调度</p>
                    </li>
                    <li @click="toAddReceipt" v-entity="1001062">
                        <img src="@/static/image/icons/menu-1-5.png" alt=""/>
                        <p>上传单据</p>
                    </li>
                    <li @click="toIncomeFee" v-entity="1001063">
                        <img src="@/static/image/icons/menu-1-6.png" alt=""/>
                        <p>费用异动</p>
                    </li>
                </ul>
            </div>
            <div class="menusItem">
                <div class="title">运输汇总清单</div>
                <ul class="menus spec clearfix">
                    <li @click="toOrderManage" v-entity="1003005">
                        <img src="@/static/image/icons/menu-2-1.png" alt=""/>
                        <p>订单管理</p>
                    </li>
                    <li @click="toStockManage" v-entity="1003006">
                        <img src="@/static/image/icons/menu-2-2.png" alt=""/>
                        <p>库存管理</p>
                    </li>
                    <li @click="toPlanManage" v-entity="1003008">
                        <img src="@/static/image/icons/menu-2-3.png" alt=""/>
                        <p>订单包管理</p>
                    </li>
                    <li @click="toWaybillManage" v-entity="1003009">
                        <img src="@/static/image/icons/menu-2-4.png" alt=""/>
                        <p>派车单管理</p>
                    </li>
                    <li @click="toTransitManage" v-entity="1003010">
                        <img src="@/static/image/icons/menu-2-8.png" alt=""/>
                        <p>中转管理</p>
                    </li>
                    <li @click="toReceiptManage" v-entity="1003011">
                        <img src="@/static/image/icons/menu-2-5.png" alt=""/>
                        <p>单据管理</p>
                    </li>
                    <li @click="toIncomeFeeManage" v-entity="1003012">
                        <img src="@/static/image/icons/menu-2-6.png" alt=""/>
                        <p>异动管理</p>
                    </li>
                </ul>
            </div>
            <div class="dbMenusItem clearfix">
                <div class="menusItem fl">
                    <div class="title">器具业务</div>
                    <!--          <ul class="menus clearfix">-->
                    <!--            <li @click="toPackPurchaseManage" v-entity="1004002">-->
                    <!--              <img src="@/static/image/icons/menu-3-1.png" alt="" />-->
                    <!--              <p>采购管理</p>-->
                    <!--            </li>-->
                    <!--            <li @click="toPackBusinessManage" v-entity="1004004">-->
                    <!--              <img src="@/static/image/icons/menu-3-2.png" alt="" />-->
                    <!--              <p>租赁管理</p>-->
                    <!--            </li>-->
                    <!--            <li @click="toPackIncomeManage" v-entity="1004005">-->
                    <!--              <img src="@/static/image/icons/menu-3-3.png" alt="" />-->
                    <!--              <p>费用汇总</p>-->
                    <!--            </li>-->
                    <!--          </ul>-->
                </div>
                <div class="menusItem fr">
                    <div class="title">仓储业务</div>
                </div>
            </div>
            <div class="menusItem">
                <div class="title">费用相关操作</div>
                <ul class="menus spec clearfix">
                    <li @click="toAddCustBill" v-entity="1006039">
                        <img src="@/static/image/icons/menu-4-1.png" alt=""/>
                        <p>新增账单</p>
                    </li>
                    <!--          <li @click="toPrjSundryFeeManage" v-entity="1006031">-->
                    <!--            <img src="@/static/image/icons/menu-4-2.png" alt="" />-->
                    <!--            <p>其他费用</p>-->
                    <!--          </li>-->
                    <li @click="toStoreHouseShareManage" v-entity="1006034">
                        <img src="@/static/image/icons/menu-4-3.png" alt=""/>
                        <p>仓储费用</p>
                    </li>
                    <li @click="toCustBillManage" v-entity="1006011">
                        <img src="@/static/image/icons/menu-4-4.png" alt=""/>
                        <p>账单管理</p>
                    </li>
                    <li @click="toBillMakeupManage" v-entity="1006065">
                        <img src="@/static/image/icons/menu-4-5.png" alt=""/>
                        <p>费用补录</p>
                    </li>
                    <li @click="toApplyInvoiceManage" v-entity="1006015">
                        <img src="@/static/image/icons/menu-4-6.png" alt=""/>
                        <p>发票管理</p>
                    </li>
                    <li @click="toCollectionRegistration" v-entity="1006018">
                        <img src="@/static/image/icons/menu-4-7.png" alt=""/>
                        <p>收款登记</p>
                    </li>
                </ul>
            </div>
        </div>

        <!-- 权限配置 -->
        <div class="popup" :class="{'show':showEntityPage}">
            <div class="popup_bj" @click="isShowEntityPage(false)"></div>
            <div class="popup_content" style="width:40%">
                <authRoleTree ref="authRoleTree" :showRole="false"></authRoleTree>
            </div>
        </div>
    </div>
</template>

<script>
import customerDetail from "./customerDetail.js"

export default customerDetail
</script>
<style lang="scss" src="./customerDetail.scss"></style>
