<template>
    <div id="warehousingCenterBoard" class="warehousingCenterBoardPage">
        <div class="title">
            <img class="logo" src="@/static/image/logo4.png" alt="">
            <h3>{{ workName }}</h3>
            <span class="time">{{ dateTime }} {{ week }}</span>
            <i title="刷新页面" class="el-icon-refresh-right" @click="refreshPage"></i>
            <i :title="isFullScreen?'退出全屏':'全屏'" class="el-icon-full-screen" @click="fullScreen"></i>
        </div>
        <div class="materialView">
            <div class="infoView clearfix">
                <div class="contentTitle">今日统计</div>
                <div class="dataView">
                    <div class="itemView">
                        <div class="item">
                            <div class="title">待入库</div>
                            <div class="num">{{ collectData.inOrderCount }}</div>
                        </div>
                        <div class="item">
                            <div class="title">待出库</div>
                            <div class="num">{{ collectData.outOrderCount }}</div>
                        </div>
                    </div>
                    <div class="itemView">
                        <div class="item">
                            <div class="title">库位（空闲/总）</div>
                            <div class="num">{{ collectData.storageCount }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="chartView">
                <div class="contentTitle">库存物料占比</div>
                <div id="warehousingStuffCharts" class="lineCharts"></div>
            </div>
            <div class="chartView">
                <div class="contentTitle">出库物料占比</div>
                <div id="deliveryStuffCharts" class="lineCharts"></div>
            </div>
        </div>
        <div class="trendView">
            <div class="chartView">
                <div class="contentTitle">{{ moutn }}月入库量趋势图</div>
                <div id="warehousingCharts" class="lineCharts"></div>
            </div>
            <div class="chartView">
                <div class="contentTitle">{{ moutn }}月出库量趋势图</div>
                <div id="deliveryCharts" class="lineCharts"></div>
            </div>
        </div>

        <div class="bottomView">
            <div class="chartView">
                <div class="contentTitle">物料出库流向（作业点订单量）</div>
                <div id="chart1" class="lineCharts"></div>
            </div>

        </div>
    </div>
</template>

<script>
import warehousingCenterBoard from "./warehousingCenterBoard.js"

export default warehousingCenterBoard
</script>
<style lang="scss" src="./warehousingCenterBoard.scss" scoped></style>
