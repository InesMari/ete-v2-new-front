<template>
    <div id="storehouseSupplierDetail" class="supplierDetailPage clearfix">
        <div class="infoView fl">
            <div class="customerLabel"><span>供应商</span></div>
            <div class="companyName">{{ supplierInfo.supplierName }}
            </div>
            <div class="totalList clearfix">
                <div class="item">
                    <div class="iconView">
                        <img src="@/static/image/icons/total-icon1.png" alt="" style="width:25px;"/>
                    </div>
                    <p>今日作业</p>
                    <p><span class="num">{{ sumData.todayWorkCount }}</span>单</p>
                </div>
                <div class="item">
                    <div class="iconView iconView2">
                        <img src="@/static/image/icons/total-icon2.png" alt="" style="width:30px;"/>
                    </div>
                    <p>累计作业</p>
                    <p><span class="num">{{ sumData.totalWorkCount }}</span>单</p>
                </div>
                <div class="item">
                    <div class="iconView iconView3">
                        <img src="@/static/image/icons/total-icon3.png" alt="" style="width:25px;"/>
                    </div>
                    <p>本月累计</p>
                    <p><span class="num">{{ sumData.monthWorkCount }}</span>单</p>
                </div>
                <div class="item">
                    <div class="iconView iconView4">
                        <img src="@/static/image/icons/total-icon4.png" alt="" style="width:25px;"/>
                    </div>
                    <p>本月累计费用</p>
                    <p><span class="num">{{ sumData.monthWorkSettleFeeSum }}</span>元</p>
                </div>
            </div>
            <div class="orderDate">
                <div class="title clearfix">
                    <h4>作业日历</h4>
                    <i class="icon el-icon-arrow-left" @click="preWeek"></i>
                    <i class="icon el-icon-arrow-right" @click="nextWeek"></i>
                    <el-date-picker v-model="month" type="month" placeholder="请选择月"
                                    @change="initWeek"></el-date-picker>
                </div>
                <ul class="weeks clearfix">
                    <li :class="{'active':item.date == currentDate}" v-for="(item,index) in weeks" :key="index"
                        @click="changeDay(item, index)">
                        <p class="week">{{ item.week }}</p>
                        <p class="date">{{ item.date }}</p>
                        <div class="tip" style="height: 20px;">
                            <i class="circle circle1" v-show="item.notRegisterCount > 0"></i>
                            <i class="circle circle2" v-show="item.registerCount > 0"></i>
                            <i class="circle circle3" v-show="item.confirmCount > 0"></i>
                        </div>
                    </li>
                </ul>
                <ul class="orders clearfix">
                    <li @click="go('/pt/wms/workOrder/wmsWorkOrderManage.vue?currentDate=' + month + '-' + currentDate +'&registerState=0'
                        , null,  '外包作业')">
                        <img src="@/static/image/icons/info-icon1.png" alt=""/>
                        <div class="info">
                            <div class="num">{{ sumDayData.notRegisterCount }}单</div>
                            <div class="state">未登记</div>
                        </div>
                    </li>
                    <li @click="go('/pt/wms/workOrder/wmsWorkOrderManage.vue?currentDate=' + month + '-' + currentDate +'&registerState=1'
                        , null,  '外包作业')">
                        <img src="@/static/image/icons/info-icon2.png" alt=""/>
                        <div class="info">
                            <div class="num">{{ sumDayData.registerCount }}单</div>
                            <div class="state">已登记</div>
                        </div>
                    </li>
                    <li @click="go('/pt/wms/workOrder/wmsWorkOrderManage.vue?currentDate=' + month + '-' + currentDate +'&confirmState=1'
                        , null,  '外包作业')">
                        <img src="@/static/image/icons/info-icon3.png" alt=""/>
                        <div class="info">
                            <div class="num">{{ sumDayData.confirmCount }}单</div>
                            <div class="state">已确认</div>
                        </div>
                    </li>
                </ul>
            </div>
            <ul class="menuList clearfix">
                <li v-entity="1002067" @click="go('/pt/sp/showSupplier.vue', null,  '供应商基础信息',1)">
                    <img src="@/static/image/icons/menu-icon1.png" alt=""/>基础信息
                </li>
                <li v-entity="1002171"
                    @click="go('/pt/res/supplierWmsWorkContractManage.vue', null,  '供应商仓储作业合同', 2)">
                    <img src="@/static/image/icons/menu-icon7.png" alt=""/>作业合同
                </li>
            </ul>
        </div>

        <!--        图形展示-->
        <div class="menusView fr">
            <div style="display: flex;">
                <div class="chartView" style="flex:1">
                    <!--柱形图-->
                    <div style="height:350px;" id="chart1"></div>
                </div>
                <div class="chartView" style="flex:1;">
                    <!--折线图-->
                    <div style="height:350px;" id="chart2"></div>
                </div>
            </div>
            <div style="display: flex;">
                <div class="chartView" style="flex:1">
                    <!--饼图-->
                    <div style="height:350px;" id="chart3"></div>
                </div>
                <div class="chartView" style="flex:1">
                    <!--折线图-->
                    <div style="height:350px;" id="chart4"></div>
                </div>
            </div>
        </div>
        <!--        图形展示-->


    </div>
</template>

<script>
import storehouseSupplierDetail from "./storehouseSupplierDetail.js"

export default storehouseSupplierDetail
</script>
<style lang="scss" src="./supplierDetail.scss"></style>


<style lang="scss" scoped>
#storehouseSupplierDetail {
    background: #fff;
    border: $border;

    /deep/ .chartView {
        padding: 30px;
        border-bottom: $border;
        background: #fff;

        .title {
            font-size: 16px;
            font-weight: bold;
            padding: 0 20px;
            line-height: 32px;
        }

        .el-date-editor.el-input {
            width: 120px;
        }
    }

    .chartView2 {
        display: flex;
        padding: 0;;

        .item {
            flex: 1;
            padding: 30px;
            border-right: $border;

            &:last-child {
                border: none
            }

            .tableCommon {
                border: $border;
                margin-top: 20px;
            }
        }
    }
}
</style>