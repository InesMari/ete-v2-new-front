<template>
    <div id="supplierDetail" class="supplierDetailPage clearfix">
        <div class="infoView fl">
            <div class="customerLabel"><span>供应商</span></div>
            <div class="companyName">{{ supplierInfo.supplierName }}
<!--                <img src="@/static/image/icons/bank-card.png" style="float: right;margin-top: -4px;height: 20px;" @click="go('/pt/res/bankManage.vue', 1002166,  '供应商银行卡管理')"/>-->
            </div>
            <div class="totalList clearfix">
                <div class="item">
                    <div class="iconView">
                        <img src="@/static/image/icons/total-icon1.png" alt="" style="width:25px;"/>
                    </div>
                    <p>今日派车单</p>
                    <p><span class="num">{{ sumData.todayWaybillCount }}</span>单</p>
                </div>
                <div class="item">
                    <div class="iconView iconView2">
                        <img src="@/static/image/icons/total-icon2.png" alt="" style="width:30px;"/>
                    </div>
                    <p>累计服务客户</p>
                    <p><span class="num">{{ sumData.totalServiceCustomerCount }}</span>个</p>
                </div>
                <div class="item">
                    <div class="iconView iconView3">
                        <img src="@/static/image/icons/total-icon3.png" alt="" style="width:25px;"/>
                    </div>
                    <p>本月累计派车单</p>
                    <p><span class="num">{{ sumData.monthWaybillCount }}</span>单</p>
                </div>
                <div class="item">
                    <div class="iconView iconView4">
                        <img src="@/static/image/icons/total-icon4.png" alt="" style="width:25px;"/>
                    </div>
                    <p>本月累计运费</p>
                    <p><span class="num">{{ sumData.monthWaybillCostSum }}</span>元</p>
                </div>
            </div>
            <div class="orderDate">
                <div class="title clearfix">
                    <h4>派车单日历</h4>
                    <i class="icon el-icon-arrow-left" @click="preWeek"></i>
                    <i class="icon el-icon-arrow-right" @click="nextWeek"></i>
                    <el-date-picker v-model="month" type="month" placeholder="请选择月"
                                    @change="initWeek"></el-date-picker>
                </div>
                <ul class="weeks clearfix">
                    <li :class="{'active':item.date == currentDate}" v-for="(item,index) in weeks" :key="index" @click="changeDay(item, index)">
                        <p class="week">{{ item.week }}</p>
                        <p class="date">{{ item.date }}</p>
                        <div class="tip" style="height: 20px;">
                            <i class="circle circle1" v-show="item.waitStartVehicleCount > 0"></i>
                            <i class="circle circle2" v-show="item.inWayCount > 0"></i>
                            <i class="circle circle3" v-show="item.finishedCount > 0"></i>
                        </div>
                    </li>
                </ul>
                <ul class="orders clearfix">
                    <li @click="go('/pt/ord/waybill/waybillManage.vue?currentDate=' + month + '-' + currentDate +'&waybillState='
                        + enumData.waybillState.waitAppointVehicle + ',' + enumData.waybillState.waitStartVehicle, null,  '派车单管理')">
                        <img src="@/static/image/icons/info-icon1.png" alt=""/>
                        <div class="info">
                            <div class="num">{{ sumDayData.waitStartVehicleCount }}单</div>
                            <div class="state">待出车</div>
                        </div>
                    </li>
                    <li @click="go('/pt/ord/waybill/waybillManage.vue?currentDate=' + month + '-' + currentDate +'&waybillState='
                        + enumData.waybillState.inWay, null,  '派车单管理')">
                        <img src="@/static/image/icons/info-icon2.png" alt=""/>
                        <div class="info">
                            <div class="num">{{ sumDayData.inWayCount }}单</div>
                            <div class="state">运作中</div>
                        </div>
                    </li>
                    <li @click="go('/pt/ord/waybill/waybillManage.vue?currentDate=' + month + '-' + currentDate +'&waybillState='
                        + enumData.waybillState.finished + ',' + enumData.waybillState.abort, null,  '派车单管理')">
                        <img src="@/static/image/icons/info-icon3.png" alt=""/>
                        <div class="info">
                            <div class="num">{{ sumDayData.finishedCount }}单</div>
                            <div class="state">已完成</div>
                        </div>
                    </li>
                </ul>
            </div>
            <ul class="menuList clearfix">
                <li v-entity="1002067" @click="go('/pt/sp/showSupplier.vue', null,  '供应商基础信息',1)">
                    <img src="@/static/image/icons/menu-icon1.png" alt=""/>基础信息
                </li>
                <li v-entity="1002068" @click="go('/pt/res/vehicleManage.vue', null,  '供应商车辆信息')">
                    <img src="@/static/image/icons/menu-icon2.png" alt=""/>车辆信息
                </li>
                <li v-entity="1002069" @click="go('/pt/res/driverManage.vue', null,  '供应商司机信息')">
                    <img src="@/static/image/icons/menu-icon3.png" alt=""/>司机信息
                </li>
                <li v-entity="1002070" @click="go('/pt/sp/supplierAddressManage.vue', null,  '供应商专线地址')">
                    <img src="@/static/image/icons/menu-icon4.png" alt=""/>仓库信息
                </li>
                <li v-entity="1002071" @click="go('/pt/res/quote/supplierZCQuoteManage.vue', null,  '供应商整车报价')">
                    <img src="@/static/image/icons/menu-icon5.png" alt=""/>整车报价
                </li>
                <li v-entity="1002072" @click="go('/pt/res/quote/quoteManageLD.vue', null,  '供应商零担报价')">
                    <img src="@/static/image/icons/menu-icon6.png" alt=""/>零担报价
                </li>
<!--                <li v-entity="1002091" @click="go('/pt/res/quote/supplierWMSQuoteManage.vue', null,  '供应商仓配报价')">-->
<!--                    <img src="@/static/image/icons/menu-icon5.png" alt=""/>仓配报价-->
<!--                </li>-->

                <li v-entity="1002171" @click="go('/pt/res/supplierWmsWorkContractManage.vue', null,  '供应商仓储作业合同')">
                    <img src="@/static/image/icons/menu-icon7.png" alt=""/>作业合同
                </li>
            </ul>
        </div>
        <div class="menusView fr">
            <div class="menusItem">
                <div class="title">运输业务操作</div>
                <ul class="menus clearfix">
                    <li v-entity="1003009" @click="go('/pt/ord/waybill/waybillManage.vue', 1003009,  '派车单管理')">
                        <img src="@/static/image/icons/menu-1-1.png" alt=""/>
                        <p>派车单管理</p>
                    </li>
                    <li v-entity="1003010" @click="go('/pt/ord/transit/transitList.vue', 1003010,  '中转管理')">
                        <img src="@/static/image/icons/menu-1-2.png" alt=""/>
                        <p>中转管理</p>
                    </li>
                    <li v-entity="1002087" @click="go('/pt/ord/receipts/addReceipt.vue', 1002087,  '上传单据')">
                        <img src="@/static/image/icons/menu-1-3.png" alt=""/>
                        <p>上传单据</p>
                    </li>
                    <li v-entity="1002088" @click="go('/pt/ord/waybill/feeChange/feeChange.vue', 1002088,  '费用异动')">
                        <img src="@/static/image/icons/menu-1-4.png" alt=""/>
                        <p>费用异动</p>
                    </li>
                    <li v-entity="1003013" @click="go('/pt/ord/waybill/feeChangeManage.vue', 1003013,  '异动管理','feeChangeManage1')">
                        <img src="@/static/image/icons/menu-1-5.png" alt=""/>
                        <p>异动管理</p>
                    </li>
                    <li v-entity :entityId="[{1002018:1002029}, 1002018]" @click="go('/pt/fc/invoice/costAccountManage.vue', 1002029,  '自有车成本记账')">
                        <img src="@/static/image/icons/menu-1-6.png" alt=""/>
                        <p>自有车成本记账</p>
                    </li>
                </ul>
            </div>
            <div class="dbMenusItem clearfix">
                <div class="menusItem fl">
                    <div class="title">器具业务</div>
<!--                    <ul class="menus clearfix">-->
<!--                        <li v-entity="1004002" @click="go('/pt/pkg/packPurchaseManage.vue', 1004002,  '供应商采购管理')">-->
<!--                            <img src="@/static/image/icons/menu-3-1.png" alt=""/>-->
<!--                            <p>采购管理</p>-->
<!--                        </li>-->
<!--                        <li v-entity="1004005" @click="go('/pt/pkg/fc/packCostManage.vue', 1004005,  '供应商费用明细')">-->
<!--                            <img src="@/static/image/icons/menu-3-3.png" alt=""/>-->
<!--                            <p>费用明细</p>-->
<!--                        </li>-->
<!--                    </ul>-->
                </div>
                <div class="menusItem fr">
                    <div class="title">仓储业务</div>
                </div>
            </div>
            <div class="menusItem">
                <div class="title">费用相关操作</div>
                <ul class="menus spec clearfix">
                    <li v-entity="1006049" @click="go('/pt/fc/supplierBill/add/addSupplierBillMain.vue', 1006049,  '供应商新增账单')">
                        <img src="@/static/image/icons/menu-4-1.png" alt=""/>
                        <p>新增账单</p>
                    </li>
                    <li v-entity="1006032" @click="go('/pt/fc/sundry/prjSundryFeeManage.vue?t=1&showTabs=1&supplierType=' + supplierInfo.supplierType, 1006032,  '供应商其他费用')">
                        <img src="@/static/image/icons/menu-4-2.png" alt=""/>
                        <p>其他费用</p>
                    </li>
                    <li v-entity="1006033" @click="go('/pt/fc/storehouse/storeHouseBillManage.vue?t=1', 1006033,  '供应商仓储费用')">
                        <img src="@/static/image/icons/menu-4-3.png" alt=""/>
                        <p>仓储费用</p>
                    </li>
                    <li v-entity="1006012" @click="go('/pt/fc/supplierBill/supplierBillManageMain.vue', 1006012,  '供应商账单管理')">
                        <img src="@/static/image/icons/menu-4-4.png" alt=""/>
                        <p>账单管理</p>
                    </li>
                    <li v-entity="1006013" @click="go('/pt/fc/ownVehicleBill/ownVehicleBillManageMain.vue', 1006013,  '供应商自有车账单管理')">
                        <img src="@/static/image/icons/fina_list_i_1_3.png" alt=""/>
                        <p>自有车账单</p>
                    </li>
                    <li v-entity="1006066" @click="go('/pt/fc/supplierBill/feeChangeManage.vue', 1006066,  '供应商费用补录','feeChangeManage2')">
                        <img src="@/static/image/icons/menu-4-5.png" alt=""/>
                        <p>费用补录</p>
                    </li>
                    <li v-entity="1006016" @click="go('/pt/fc/invoice/submitInvoiceManage.vue', 1006016,  '供应商发票管理')">
                        <img src="@/static/image/icons/menu-4-6.png" alt=""/>
                        <p>发票管理</p>
                    </li>
                    <li v-entity="1006020" @click="go('/pt/fc/register/expenditureRegisterManage.vue', 1006020,  '供应商付款登记')">
                        <img src="@/static/image/icons/menu-4-7.png" alt=""/>
                        <p>付款登记</p>
                    </li>
                </ul>
            </div>
        </div>


    </div>
</template>

<script>
import supplierDetail from "./supplierDetail.js"

export default supplierDetail
</script>
<style lang="scss" src="./supplierDetail.scss"></style>
