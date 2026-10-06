<template>
    <div id="warehousingCenter" class="warehousingCenterPage">
        <select-work v-show="showSelWork"></select-work>
        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>
        <div class="infoView clearfix" v-show="!showSelWork">
            <div class="item warehouse">
                <div class="title">
                    {{ userInfo.workName }}
                </div>
                <div class="iconList">
                    <el-tooltip effect="dark" content="仓储预警" placement="top">
                        <div class="wanring">
                            <div class="numTip" v-entity="1005071" v-show="warningSum>0"
                                @click="go('/pt/wms/base/warningManage.vue', null,  '仓储预警')">
                                {{ warningSum }}
                            </div>
                            <img class="icon" src="@/static/image/icons/storage-icon1.png" alt="" v-entity="1005071"
                                @click="go('/pt/wms/base/warningManage.vue', null,  '仓储预警')"/>
                        </div>
                    </el-tooltip>

                    <el-tooltip effect="dark" content="到仓预约报到" placement="top" v-show="!collectData.hasChildWork">
                        <img class="icon qrCodeIcon" src="@/static/image/icons/storage-icon7.png" alt="" title="到仓预约报到"
                             @click="showQrcode()"/>
                    </el-tooltip>

                    <el-popover
                        placement="bottom"
                        :append-to-body="false"
                        trigger="hover">
                        <div class="worklist">
                            <div class="workItem" @click="showQrcode(item)" v-for="(item,index) in collectData.workList">{{item.workName}}</div>
                        </div>
                        <img v-show="collectData.hasChildWork" slot="reference" class="icon qrCodeIcon"
                             src="@/static/image/icons/storage-icon7.png" alt="" title="到仓预约报到"/>
                    </el-popover>

                    <el-tooltip effect="dark" content="切换仓库" placement="top">
                        <img class="icon changeIcon" src="@/static/image/icons/storage-icon2.png" alt="" title="切换仓库"
                             @click="changeWork" v-show="showChangeWork"/>
                    </el-tooltip>

                    <el-popover
                        placement="bottom"
                        width="150"
                        trigger="click">
                        <ul class="content clearfix" style="height: 55px;">
                          <li class="item">
                            <label class="label-term">是否使用SAP库存</label>
                            <div class="input-text" style="position: absolute;transform: translateX(-50%);left: 50%;margin-top: 10px;">
                              <el-switch v-model="useSapStockNums" @change="changeInfoSwitch"
                                         active-color="#13ce66" inactive-color="#ff4949"/>
                              <span class="name">{{ useSapStockNums? "是" : "否" }}</span>
                            </div>
                          </li>
                        </ul>
                      <el-tooltip effect="dark" content="SAP库存设置" placement="top" slot="reference">
                        <img class="icon" src="@/static/image/icons/storage-icon8.png" alt="" title="SAP库存设置"/>
                      </el-tooltip>
                    </el-popover>

                    <el-tooltip effect="dark" content="来访登记" placement="top" v-show="!collectData.hasChildWork">
                        <img class="icon qrCodeIcon" src="@/static/image/icons/visitionRegCode.png" alt="" title="来访登记"
                             @click="showVisitQrcode()"/>
                    </el-tooltip>

                </div>
            </div>
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
                <div class="link" @click="go('/pt/wms/ord/outOrderManage.vue', null,  '出库单管理')">查看详情></div>
            </div>
            <div class="item">
                <div class="title">未回收器具</div>
                <div class="data clearfix">
                    <div class="icon">
                        <img src="@/static/image/icons/storage-icon5.png" alt=""/>
                    </div>
                    <span class="num">{{ collectData.noRecoverCount }}</span>
                </div>
                <div class="link" @click="go('/pt/wms/device/deviceStockManege.vue?isRecover=1', null,  '器具库存')">
                    查看详情>
                </div>
            </div>
            <div class="item">
                <div class="title">库位（空闲/总）</div>
                <div class="data clearfix">
                    <div class="icon">
                        <img src="@/static/image/icons/storage-icon6.png" alt=""/>
                    </div>
                    <span class="num">{{ collectData.storageCount }}</span>
                </div>
                <div class="link"
                     @click="go('/pt/wms/allocat/capaStockManageMain.vue?path=stockStorageManage', null,  '在库管理')">
                    查看详情 >
                </div>
            </div>
        </div>

        <div class="clearfix" v-show="!showSelWork">
            <div class="menusView clearfix">
                <div class="menusItem clearfix" v-entity="1005003">
                    <div class="title">仓储管理</div>
                    <ul class="menus spec clearfix">
                        <li v-entity="1005005"
                            @click="go('/pt/wms/ord/inOrderManage.vue', 1005005,  '入库单管理')">
                            <img src="@/static/image/icons/storage_list_i_1_1.png" alt=""/>
                            <p>入库单管理</p>
                        </li>
                        <li v-entity="1005006"
                            @click="go('/pt/wms/ord/outOrderManage.vue', 1005006,  '出库单管理')">
                            <img src="@/static/image/icons/storage_list_i_1_2.png" alt=""/>
                            <p>出库单管理</p>
                        </li>
                        <li v-entity="1005074"
                            @click="go('/pt/wms/allocat/stockDtlManageMain.vue', 1005074,  '库存结余')">
                          <img src="@/static/image/icons/storage_list_i_1_3.png" alt=""/>
                          <p>库存结余</p>
                        </li>
                        <li v-entity="1005007"
                            @click="go('/pt/wms/allocat/capaStockManageMain.vue', 1005007,  '在库管理')">
                            <img src="@/static/image/icons/storage_list_i_1_3.png" alt=""/>
                            <p>在库管理</p>
                        </li>
                        <li v-entity="1005121"
                            @click="go('/pt/wms/allocat/qrcode/qrcodeManage.vue', 1005121,  '条码管理')">
                            <img src="@/static/image/icons/storage_list_i_1_10.png" alt=""/>
                            <p>条码管理</p>
                        </li>
                        <li v-entity="1005008"
                            @click="go('/pt/wms/allocat/wmsAllocatMaterialManage.vue', 1005008,  '移库管理')">
                            <img src="@/static/image/icons/storage_list_i_1_4.png" alt=""/>
                            <p>移库管理</p>
                        </li>
                        <li v-entity="1005009"
                            @click="go('/pt/wms/device/deviceStockManege.vue', 1005009,  '器具库存')">
                            <img src="@/static/image/icons/storage_list_i_1_5.png" alt=""/>
                            <p>器具库存</p>
                        </li>
                        <li v-entity="1005011"
                            @click="go('/pt/wms/monitor/deviceMonitorManage.vue', 1005011,  '视频管理')">
                          <img src="@/static/image/icons/storage_list_i_1_7.png" alt="" height="36px"/>
                          <p>视频管理</p>
                        </li>
                        <!--                  <li v-entity="1005010"-->
                        <!--                      @click="go('/pt/wms/base/wmsInteriorMaterialManage.vue', 1005010,  '内材管理')">-->
                        <!--                      <img src="@/static/image/icons/storage_list_i_1_6.png" alt=""/>-->
                        <!--                      <p>内材管理</p>-->
                        <!--                  </li>-->

                        <li v-entity="1005094"
                            @click="go('/pt/wms/waybill/wmsWaybillManage.vue', 1005094,  '短驳配送管理')">
                            <img src="@/static/image/icons/storage_list_i_1_8.png" alt=""/>
                            <p>短驳配送</p>
                        </li>
                        <li v-entity="1005154"
                            @click="go('/pt/wms/fee/feeOpManage.vue', 1005154,  '操作登记')">
                          <img src="@/static/image/icons/storage_list_i_3_3_1.png" alt="" height="36px"/>
                          <p>操作登记</p>
                        </li>

                      <li v-entity="1005111"
                          @click="go('/pt/wms/appoint/appointManage.vue', 1005111,  '仓库预约')">
                        <img src="@/static/image/icons/storage_list_i_1_9.png" alt="" height="36px"/>
                        <p>仓库预约</p>
                      </li>
                        <li v-entity="1005127"
                            @click="go('/pt/wms/receipts/receiptsManage.vue', 1005127,  '单据管理')">
                            <img src="@/static/image/icons/storage_list_i_3_2_1.png" alt="" height="36px"/>
                            <p>单据管理</p>
                        </li>
                    </ul>
                </div>
                <div class="menusItem clearfix" v-entity="1005004">
                    <div class="title">基础信息</div>
                    <ul class="menus spec clearfix">
                        <li v-entity="1005012"
                            @click="go('/pt/wms/base/reservoirInfoManage.vue', 1005012,  '库区管理')">
                            <img src="@/static/image/icons/storage_list_i_2_1.png" alt=""/>
                            <p>库区管理</p>
                        </li>
                        <li v-entity="1005013"
                            @click="go('/pt/wms/base/storageInfoManage.vue', 1005013,  '库位管理')">
                            <img src="@/static/image/icons/storage_list_i_2_2.png" alt=""/>
                            <p>库位管理</p>
                        </li>
                        <li v-entity="1005014"
                            @click="go('/pt/wms/base/wmsConsignorTenantManage.vue', 1005014,  '货主管理')">
                            <img src="@/static/image/icons/storage_list_i_2_4.png" alt=""/>
                            <p>货主管理</p>
                        </li>
                        <li v-entity="1005015"
                            @click="go('/pt/wms/base/wmsArrivalManufacturerTenantManage.vue', 1005015,  '到货厂商')">
                            <img src="@/static/image/icons/storage_list_i_2_5.png" alt=""/>
                            <p>到货厂商</p>
                        </li>
                        <li v-entity="1005016"
                            @click="go('/pt/wms/base/materialInfoManage.vue', 1005016,  '物料管理')">
                          <img src="@/static/image/icons/storage_list_i_2_3.png" alt=""/>
                          <p>物料管理</p>
                        </li>
                        <li v-entity="1005017"
                            @click="go('/pt/wms/base/pickTacticsInfoManage.vue', 1005017,  '拣货策略')">
                            <img src="@/static/image/icons/storage_list_i_2_6.png" alt=""/>
                            <p>拣货策略</p>
                        </li>
                        <li v-entity="1001029"
                            @click="go('/pt/cm/customer/workInfoManage.vue', 1001029,  '作业信息', 'customer')">
                            <img src="@/static/image/icons/storage_list_i_2_7.png" alt=""/>
                            <p>作业点管理</p>
                        </li>
                        <li v-entity="1005090"
                            @click="go('/pt/cm/customer/workInfoManageDetail.vue', 1005090,  '卸货点管理')">
                            <img src="@/static/image/icons/storage_list_i_2_8.png" alt=""/>
                            <p>卸货点管理</p>
                        </li>

                        <li v-entity="1005225"
                            @click="go('/pt/sp/storehouseSupplierManage.vue', 1005225,  '供应商管理')">
                            <img src="@/static/image/icons/storage_list_i_2_9.png" alt=""/>
                            <p>供应商管理</p>
                        </li>

                    </ul>
                </div>
                <div class="menusItem clearfix" v-entity="1005100">
                    <div class="title">仓储费用</div>
                    <ul class="menus spec clearfix">
                        <li v-entity="1005101"
                            @click="go('/pt/fc/storehouse/wmsFeeIncomeManage.vue', 1005101,  '仓储月收入')">
                            <img src="@/static/image/icons/storage_list_i_3_1.png" alt=""/>
                            <p>仓储收入</p>
                        </li>
                        <li v-entity="1005102"
                            @click="go('/pt/fc/storehouse/storeHouseBillManage.vue', 1005102,  '仓储月成本')">
                            <img src="@/static/image/icons/storage_list_i_3_2.png" alt=""/>
                            <p>仓储成本</p>
                        </li>
                    </ul>
                </div>
                <div class="menusItem clearfix">
                    <div class="title">看板</div>
                    <ul class="menus spec clearfix">
                        <li v-entity="1005101" @click="toTodayPlanBoard">
                            <img src="@/static/image/icons/storage_list_i_4_1.png" alt=""/>
                            <p>今日计划看板</p>
                        </li>
                        <li v-entity="1005102" @click="toAppointmentBoard">
                            <img src="@/static/image/icons/storage_list_i_4_2.png" alt=""/>
                            <p>预约看板</p>
                        </li>
                        <li v-entity="1005102" @click="toWarehousingCenterBoard">
                            <img src="@/static/image/icons/storage_list_i_4_3.png" alt=""/>
                            <p>仓储看板</p>
                        </li>
                        <li v-entity="1005102" @click="toDeliveryBoard">
                            <img src="@/static/image/icons/storage_list_i_4_4.png" alt=""/>
                            <p>配送看板</p>
                        </li>
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
                <div class="item">
                    <div class="title clearfix">
                        <h5>库存物料占比</h5>
                        <ul class="tab clearfix">
                            <li :class="{'active':stockMaterialType==1}" @click="initStockMaterialCharts(1)">本月</li>
                            <li :class="{'active':stockMaterialType==2}" @click="initStockMaterialCharts(2)">上月</li>
                        </ul>
                    </div>
                    <div id="warehousingStuffCharts" class="lineCharts fl"></div>
                </div>
                <div class="item">
                    <div class="title clearfix">
                        <h5>出库物料占比</h5>
                        <ul class="tab clearfix">
                            <li :class="{'active':outMaterialType==1}" @click="initOutMaterialCharts(1)">本月</li>
                            <li :class="{'active':outMaterialType==2}" @click="initOutMaterialCharts(2)">上月</li>
                        </ul>
                    </div>
                    <div id="deliveryStuffCharts" class="lineCharts fl"></div>
                </div>

                <div class="item" style="height:auto;width: 100%;">
                    <div class="title clearfix">
                        <h5>物料出库流向（作业点订单量）</h5>
                        <ul class="tab clearfix">
                            <li :class="{'active':outMaterialType2==1}" @click="initEchart1(1)">按天</li>
                            <li :class="{'active':outMaterialType2==2}" @click="initEchart1(2)">按月</li>
                            <li :class="{'active':outMaterialType2==3}" @click="initEchart1(3)">按年</li>
                        </ul>
                    </div>
                    <div id="chart1" class="lineCharts fl"></div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import warehousingCenter from "./warehousingCenter.js"

export default warehousingCenter
</script>
<style lang="scss" src="./warehousingCenter.scss" scoped></style>
