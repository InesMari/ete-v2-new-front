<template>
    <div id="stockInventoryDetail" class="warehousingDetailPage">
        <div class="common-info">
            <h3 class="common-title"><span class="title-name">盘点单基础信息</span></h3>
            <table class="fillTbale">
                <tr>
                    <td class="label">盘点单号</td>
                    <td class="value">{{ info.inventoryNum }}</td>
                    <td class="label">审核状态</td>
                    <td class="value">{{ info.verifyStateName }}</td>
                    <td class="label">审核人</td>
                    <td class="value">{{ info.verifyUserName }}</td>
                    <td class="label">审核时间</td>
                    <td class="value">{{ info.verifyDate }}</td>
                </tr>
                <tr>
                    <td class="label">盘点人</td>
                    <td class="value">{{ info.inventoryUserName }}</td>
                    <td class="label">盘点日期</td>
                    <td class="value">{{ info.inventoryDate }}</td>
                    <td class="label">异常状态</td>
                    <td class="value" >{{ info.inventoryStateName }}</td>
                    <td class="label">备注</td>
                    <td class="value" >{{ info.inventoryRemark }}</td>
                </tr>
            </table>


            <h3 class="common-title mt_20"><span class="title-name fl" style="margin-right: 30px">盘点明细</span>
                <div class="item clearfix">
                    <label class="label fl" style="line-height: 30px;">筛选：</label>
                    <div class="input-text fl" style="line-height: 30px;">
                        <el-row>
                            <el-button round size="mini" @click="changeShow(-1)" >全部</el-button>
                            <el-button type="primary" size="mini" @click="changeShow(1)" round>盘盈</el-button>
                            <el-button type="danger" size="mini" @click="changeShow(2)" round>盘亏</el-button>
                        </el-row>
                    </div>
                </div>
            </h3>
            <div style="overflow: auto;">
                <table class="tableCommon" ref="orderDetail" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                    <tr>
                        <th width="150">物料编码</th>
                        <th width="120">物料描述</th>
                        <th width="120">批次号</th>
                        <th width="120">供应商批次号</th>
                        <th width="100">ASN</th>
                        <th width="250">到货厂商</th>
                        <th width="100">规格</th>
                        <th width="120">生产日期</th>
<!--                        <th width="120">入库日期</th>-->
                        <th width="120">库区</th>
                        <th width="120">库位</th>
                        <th width="80">管理单位</th>
                        <th width="80">库存数量</th>
                        <th width="80">预占数量</th>
                        <th width="100">库存箱数</th>
                        <th width="100">库存托数</th>
                        <th width="100">库存数量差异</th>
                        <th width="100">盘点数量</th>
                        <th width="200">盘盈盘亏条码</th>
                        <th width="200">每张条码数量</th>
                        <th width="100">盘点箱数</th>
                        <th width="100">盘点托数</th>
                        <th width="100">盘盈盘亏</th>
                        <th width="100">备注</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in list" v-show="item.show">
                            <td>{{item.materialNum}}</td>
                            <td>{{item.materialDesc}}</td>
                            <td>{{item.batchNum}}</td>
                            <td>{{item.supplierBatchNum}}</td>
                            <td>{{item.asn}}</td>
                            <td>{{item.fromTenantName}}</td>
                            <td>{{item.materialSpecsName}}</td>
                            <td>{{item.produceDate}}</td>
<!--                            <td>{{item.inDate}}</td>-->
                            <td>{{item.reservoirCode}}</td>
                            <td>{{item.storageCode}}</td>
                            <td>{{item.unitName }}</td>
                            <td>{{item.storeNums}}</td>
                            <td>{{item.expectNums}}</td>
                            <td>{{item.boxNums}}</td>
                            <td>{{item.palletNums}}</td>
                            <td>{{item.diffNums}}</td>
                            <td>{{item.inventoryNums}}</td>
                            <td>{{item.qrcodes}}</td>
                            <td>{{item.perNum}}</td>
                            <td>{{item.inventoryBoxNums}}</td>
                            <td>{{item.inventoryPalletNums}}</td>
                            <td>{{item.inventoryStateName}}</td>
                            <td>{{item.remark}}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <td width="150">合计:</td><!--物料编码-->
                        <td></td><!--物料描述-->
                        <td></td><!--批次号-->
                        <td></td><!--供应商批次号-->
                        <td></td><!--ASN-->
                        <td></td><!--到货厂商-->
                        <td></td><!--规格-->
                        <td></td><!--生产日期-->
<!--                        <td></td>&lt;!&ndash;入库日期&ndash;&gt;-->
                        <td></td><!--库区-->
                        <td></td><!--库位-->
                        <td></td><!--管理单位-->
                        <td style="color: red">{{ totalInfo.storeNums }}</td><!--库存数量-->
                        <td style="color: red">{{ totalInfo.expectNums }}</td><!--预占数量-->
                        <td style="color: red">{{ totalInfo.boxNums }}</td><!--库存箱数-->
                        <td style="color: red">{{ totalInfo.palletNums }}</td><!--库存托数-->
                        <td></td><!--库存数量差异-->
                        <td style="color: red">{{ totalInfo.inventoryNums }}</td><!--盘点数量-->
                        <td></td><!--盘盈盘亏条码-->
                        <td></td><!--每张条码数-->
                        <td style="color: red">{{ totalInfo.inventoryBoxNums }}</td><!--盘点箱数-->
                        <td style="color: red">{{ totalInfo.inventoryPalletNums }}</td><!--盘点托数-->
                        <td></td><!--盘盈盘亏-->
                        <td></td><!--备注-->
                    </tr>
                    </tfoot>
                </table>
            </div>
            <div class="bot-btn ">
                <el-button @click="closePage()">关闭</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import stockInventoryDetail from './stockInventoryDetail.js'

export default stockInventoryDetail
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';

.warehousingDetailPage {

}
</style>