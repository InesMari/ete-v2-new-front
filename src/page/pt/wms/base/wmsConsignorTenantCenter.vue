<template>
    <div id="wmsConsignorTenantCenter" class="wmsConsignorTenantCenterPage">
        <select-work v-show="showSelWork"></select-work>
        <div class="infoView clearfix" v-show="!showSelWork">
            <div class="item warehouse" style="width:33%;">
                <div class="title">
                    货主名称: {{ consignor.name }}
                    <img src="@/static/image/icons/storage-icon1.png" alt="" @click="showConsignor(true)"/>
                </div>
                <div class="name">联系人: {{ consignor.linkman }}</div>
                <div class="phone">联系手机: {{ consignor.linkPhone }}</div>
            </div>
            <!--            首页汇总数据-->
            <div class="item">
                <div class="title">待入库</div>
                <div class="data clearfix">
                    <div class="icon">
                        <img src="@/static/image/icons/storage-icon3.png" alt=""/>
                    </div>
                    <span class="num">{{ collectData.inOrderCount }}</span>
                    <span class="unit">单</span>
                </div>
                <div class="link" @click="go('/pt/wms/ord/inOrderManage.vue', null,  '入库单管理')">查看详情></div>
            </div>
            <div class="item">
                <div class="title">待出库</div>
                <div class="data clearfix">
                    <div class="icon">
                        <img src="@/static/image/icons/storage-icon4.png" alt=""/>
                    </div>
                    <span class="num">{{ collectData.outOrderCount }}</span>
                    <span class="unit">单</span>
                </div>
                <div class="link" @click="go('/pt/wms/ord/outOrderManage.vue', null,  '出库单管理')">查看详情 ></div>
            </div>
            <div class="item">
                <div class="title">未回收器具</div>
                <div class="data clearfix">
                    <div class="icon">
                        <img src="@/static/image/icons/storage-icon5.png" alt=""/>
                    </div>
                    <span class="num">{{ collectData.noRecoverCount }}</span>
                </div>
                <div class="link" @click="go('/pt/wms/device/deviceStockManege.vue?isRecover=1', null,  '器具库存')">查看详情 >
                </div>
            </div>
        </div>

        <div class="clearfix" v-show="!showSelWork">
            <div class="menusView clearfix">
                <div class="menusItem clearfix" v-entity="1005004">
                    <div class="title">基础信息</div>
                    <ul class="menus spec clearfix">
                        <li v-entity="1005016"
                            @click="go('/pt/wms/base/materialInfoManage.vue', 1005016,  '物料管理')">
                            <img src="@/static/image/icons/storage_list_i_2_3.png" alt=""/>
                            <p>物料管理</p>
                        </li>
                        <li v-entity="1005015"
                            @click="go('/pt/wms/base/wmsArrivalManufacturerTenantManage.vue', 1005015,  '到货厂商')">
                            <img src="@/static/image/icons/storage_list_i_2_5.png" alt=""/>
                            <p>到货厂商</p>
                        </li>
<!--                        <li v-entity="1005017"-->
<!--                            @click="go('/pt/wms/base/pickTacticsInfoManage.vue', 1005017,  '拣货策略')">-->
<!--                            <img src="@/static/image/icons/storage_list_i_2_6.png" alt=""/>-->
<!--                            <p>拣货策略</p>-->
<!--                        </li>-->
                    </ul>
                </div>
            </div>

            <div class="chartView clearfix">
                <div class="item">
                    <div class="title clearfix">
                        <h5>{{ moutn }}月入库量趋势图</h5>
                        <ul class="tab clearfix">
                            <li :class="{'active':inStokeType==1}" @click="initInStokeCharts(1)">数量</li>
                            <li :class="{'active':inStokeType==2}" @click="initInStokeCharts(2)">箱</li>
                            <li :class="{'active':inStokeType==3}" @click="initInStokeCharts(3)">托</li>
                        </ul>
                    </div>
                    <div id="warehousingCharts" class="lineCharts fl"></div>
                </div>
                <div class="item">
                    <div class="title clearfix">
                        <h5>{{ moutn }}月出库量趋势图</h5>
                        <ul class="tab clearfix">
                            <li :class="{'active':outStokeType==1}" @click="initOutStokeCharts(1)">数量</li>
                            <li :class="{'active':outStokeType==2}" @click="initOutStokeCharts(2)">箱</li>
                            <li :class="{'active':outStokeType==3}" @click="initOutStokeCharts(3)">托</li>
                        </ul>
                    </div>
                    <div id="deliveryCharts" class="lineCharts fl"></div>
                </div>
                <div class="item" style="margin-top:10px;">
                    <div class="title clearfix">
                        <h5>库存物料占比</h5>
                        <ul class="tab clearfix">
                            <li :class="{'active':stockMaterialType==1}" @click="initStockMaterialCharts(1)">本月</li>
                            <li :class="{'active':stockMaterialType==2}" @click="initStockMaterialCharts(2)">上月</li>
                        </ul>
                    </div>
                    <div id="warehousingStuffCharts" class="lineCharts fl"></div>
                </div>
                <div class="item " style="margin-top:10px;">
                    <div class="title clearfix">
                        <h5>出库物料占比</h5>
                        <ul class="tab clearfix">
                            <li :class="{'active':outMaterialType==1}" @click="initOutMaterialCharts(1)">本月</li>
                            <li :class="{'active':outMaterialType==2}" @click="initOutMaterialCharts(2)">上月</li>
                        </ul>
                    </div>
                    <div id="deliveryStuffCharts" class="lineCharts fl"></div>
                </div>
            </div>
        </div>

        <!-- 货主 开始-->
        <el-dialog class="consignorDialog" title="货主信息" :visible.sync="consignorShow" width="40%"
                   :close-on-click-modal="false" :close-on-press-escape="false" @close="showConsignor(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>货主名称</label>
                        <div class="input-text">
                            <el-input v-model="consignor.name" maxlength="20" placeholder="货主名称" disabled></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">关联客户</label>
                        <div class="input-text">
                            <el-input v-model="consignor.tenantName" maxlength="20" placeholder="货主名称" disabled></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">货主编码</label>
                        <div class="input-text">
                            <el-input v-model="consignor.code" maxlength="20" placeholder="货主编码" disabled></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">联系人</label>
                        <div class="input-text">
                            <el-input v-model="consignor.linkman" maxlength="20" placeholder="联系人" disabled></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">联系方式</label>
                        <div class="input-text">
                            <el-input v-model="consignor.linkPhone" maxlength="20" placeholder="联系方式" disabled></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">地址</label>
                        <div class="input-text">
                            <el-input v-model="consignor.address" maxlength="20" placeholder="地址" disabled></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="showConsignor(false)">关闭</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 货主 结束-->
    </div>
</template>

<script>
import wmsConsignorTenantCenter from "./wmsConsignorTenantCenter.js"

export default wmsConsignorTenantCenter
</script>
<style lang="scss" src="./wmsConsignorTenantCenter.scss"></style>
