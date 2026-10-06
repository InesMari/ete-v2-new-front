<template>
    <div id="orderDetail" class="orderDetailPage orderPage">
        <div class="common-info">
            <h3 class="common-title"><span class="title-name">基本信息</span></h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label"><em>*</em>回程单号</td>
                    <td class="value">
                        <el-input v-model="order.orderReturnNum" disabled ></el-input>
                    </td>
                    <td class="label"><em>*</em>回程单状态</td>
                    <td class="value">
                        <el-input v-model="order.orderStateName" disabled ></el-input>
                    </td>
                    <td class="label">订单类型</td>
                    <td class="value">
                        <el-input v-model="order.orderTypeName" disabled ></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>客户</td>
                    <td class="value">
<!--                        <el-input v-model="order.tenantName" disabled ></el-input>-->
                        <el-select v-model="order.tenantId" filterable clearable
                                   placeholder="请选择客户"  disabled>
                            <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name"
                                       :value="item.tenantId"></el-option>
                        </el-select>
                    </td>
                    <td class="label"><em>*</em>业务类型</td>
                    <td class="value">
                        <el-input v-model="order.bizTypeName" disabled ></el-input>
                    </td>
                    <td class="label">客户下单时间</td>
                    <td class="value">
                        <el-input v-model="order.customerOrderDate" disabled></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label" ><em>*</em>装货时间</td>
                    <td class="value">
                        <el-input v-model="order.loadingTime" disabled></el-input>
                    </td>
                    <td class="label"><em>*</em>是否含税</td>
                    <td class="value">
                        <el-input v-model="order.isInvoiceName" disabled></el-input>

                    </td>
                    <td class="label">是否回单</td>
                    <td class="value">
                        <el-input v-model="order.haveReceiptName" disabled></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">客户填写公司名称</td>
                    <td class="value">
                        <el-input v-model="order.companyName" disabled></el-input>
                    </td>
                    <td class="label">备注</td>
                    <td class="value" :colspan="3">
                        <el-input v-model="order.remark" disabled type="text"></el-input>
                    </td>
                </tr>
            </table>


            <h3 class="common-title mt_20">
                <span class="title-name">作业点信息</span>
                <div style="display: inline-block;color:red;margin:5px 0 0 10px;font-weight: bold;" v-show="farthestDistanceShow">作业点距离：{{ order.farthestDistanceInfo }}</div>
            </h3>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th width="80">作业点顺序</th>
                        <th width="180"><em>*</em>详细地址</th>
                        <th width="100">作业内容</th>
                        <th width="80">联系人</th>
                        <th width="120">联系电话</th>

                    </tr>
                </thead>
                <tbody>
                <tr v-for="(work, index) in workList">
                    <td>{{index + 1}}</td>
                    <td>
                        <el-input v-model="work.workAddressStr" disabled :title="work.workAddressStr"></el-input>
                    </td>
                    <td>
                        <el-input v-model="work.workTypeName" disabled :title="work.workAddressStr"></el-input>
                    </td>
                    <td>
                        <el-input v-model="work.linkmanName" disabled></el-input>
                    </td>
                    <td>
                        <el-input v-model="work.phone" disabled></el-input>
                    </td>
                </tr>
                </tbody>
            </table>
            <h3 class="common-title mt_20"><span class="title-name">货物明细</span></h3>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th><em>*</em>货物名称</th>
                        <th>货物重量（吨）</th>
                        <th>货物体积（立方）</th>
                        <th><em>*</em>车型</th>
                        <th><em>*</em>车长(m)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(goods, index) in goodsList">
                        <td>
                            <el-input v-model="goods.goodsName" disabled ></el-input>
                        </td>
                        <td>
                            <el-input v-model="goods.goodsWeight" disabled ></el-input>
                        </td>
                        <td>
                            <el-input v-model="goods.goodsVolume" disabled ></el-input>
                        </td>
                        <td>
                            <el-input v-model="goods.vehicleTypeName" disabled ></el-input>
                        </td>
                        <td>
                            <el-input v-model="goods.vehicleLengthName" disabled ></el-input>
                        </td>
                    </tr>
                </tbody>
            </table>
            <h3 class="common-title mt_20"><span class="title-name">收入信息</span></h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0" >
                <tr>
                    <td class="label">结算方式</td>
                    <td class="value">
                        <el-input v-model="fee.payModeName" disabled ></el-input>
                    </td>
                    <td class="label"><em>*</em>货主出价(元/趟)</td>
                    <td class="value">
                        <el-input v-model="fee.freight" disabled ></el-input>
                    </td>
                    <td class="label"><em>*</em>实际金额(元/趟)</td>
                    <td class="value">
                        <el-input v-model="fee.totalFee" v-mydouble4val :disabled="type != 1"></el-input>
                    </td>
                </tr>
            </table>

            <h3 class="common-title mt_20" v-show="type != 2 && show1"><span class="title-name">接单信息</span></h3>
            <table class="fillTbale" v-show="type != 2 && show1" width="100%" border="0" cellspacing="0" cellpadding="0" >
                <tr>
                    <td class="label">接单备注</td>
                    <td class="value">
                        <el-input v-model="order.receiveRemark" :disabled="type == 0" ></el-input>
                    </td>
                </tr>
            </table>
            <h3 class="common-title mt_20" v-show="type != 1 && show2"><span class="title-name">拒单信息</span></h3>
            <table class="fillTbale" v-show="type != 1 && show2" width="100%" border="0" cellspacing="0" cellpadding="0" >
                <tr>
                    <td class="label">拒单备注</td>
                    <td class="value">
                        <el-input v-model="order.refuseRemark" :disabled="type == 0" ></el-input>
                    </td>
                </tr>
            </table>

            <h3 class="common-title mt_20" v-show="type == 0"><span class="title-name">运输信息</span></h3>
            <div class="table_height" v-show="type == 0">
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th width="50">序号</th>
                            <th width="200">派车单号</th>
                            <th width="200">供应商</th>
                            <th width="100">联系人</th>
                            <th width="100">联系电话</th>
                            <th width="100">车牌号码</th>
                            <th width="100">司机</th>
                            <th width="100">司机电话</th>
                            <th width="100">备注</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in dispatchList">
                            <td>{{ index + 1 }}</td>
                            <td><a class="link" @click="toWaybillDetail(item)">{{ item.waybillNum }}</a></td>
                            <td>{{ item.tenantName }}</td>
                            <td>{{ item.supplierLinkman }}</td>
                            <td>{{ item.supplierLinkPhone }}</td>
                            <td>{{ item.plateNumber }}</td>
                            <td>{{ item.driverName }}</td>
                            <td>{{ item.linkPhone }}</td>
                            <td>{{ item.remark }}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <td>合计：</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    </tfoot>
                </table>
            </div>
            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" @click="rceiveOrder" v-show="type == 1">接单</el-button>
                <el-button type="primary" @click="refuseOrder" v-show="type == 2">拒单</el-button>
            </div>
        </div>

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

    </div>
</template>

<script>
	import orderInfo from './orderInfo.js'

	export default orderInfo
</script>
<style lang="scss">
    @import '@/page/pt/ord/order.scss';
    #orderInfo{
        .detailTable{
            .el-input__inner{
                padding:0;
            }
        }
    }
</style>
