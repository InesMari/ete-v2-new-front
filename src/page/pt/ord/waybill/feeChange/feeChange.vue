<template>
    <div id="feeChange" class="wayBillDetailPage dispatchPage orderPage">
        <waybillInfo v-show="$route.query.pId != 1002088" ref="waybillInfo" :waybillInfo="data.waybillInfo" :dispatchType="data.waybillInfo.dispatchType" style="margin-top: -41px;"></waybillInfo>

        <!--        新增          -->
        <div class="search-list clearfix" v-show="$route.query.pId == 1002088">
            <div class="search-form clearfix">
                <div class="item">
                    <label class="label">供应商名称:</label>
                    <div class="input-text">
                        <el-input v-model="query.supplierName" @change="changeSupplierName" placeholder="搜索供应商名称" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">客户名称:</label>
                    <div class="input-text">
                        <el-input v-model="query.tenantName" placeholder="搜索客户名称" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">线路名称:</label>
                    <div class="input-text">
                        <el-input v-model="query.routeName" placeholder="搜索线路名称" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">车牌号码:</label>
                    <div class="input-text">
                        <el-input v-model="query.plateNumber" placeholder="搜索车牌号码" type="text"></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" @click="loadWaybillDataByTenantId(query)" icon="el-icon-search">查询</el-button>
                </div>
                <div class="btn">
                    <el-button type="danger" plain size="mini" @click="initQuery()" icon="el-icon-close">清空</el-button>
                </div>
            </div>
            <!-- 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 -->
            <div class="search-bot">
                <img src="@/static/image/search-bot.png" alt="">
                <i class="icon el-icon-arrow-down"></i>
                <i class="icon el-icon-arrow-up"></i>
            </div>
        </div>
        <div v-show="$route.query.pId == 1002088" id="waybillInfo">
            <!--派车单基本数据 开始-->
            <table class="fillTbale mt_10" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">派车单号</td>
                    <td class="value input-text">
                        <el-select v-model="data.waybillInfo.waybillId" placeholder="请选择派车单号" filterable clearable
                                   @change="changeWaybill">
                            <el-option v-for="item in waybillData" :key="item.waybillId" :label="item.waybillNum" :value="item.waybillId"></el-option>
                        </el-select>
                    </td>
                    <td class="value" :colspan="isTransitShow ? 4 :6" style="text-align: left;padding-left: 20px;"><a class="link" @click="toWaybillDetail">查看派车单详情</a></td>
                </tr>
                <tr>
                    <td class="label">供应商名称</td>
                    <td class="value">{{data.waybillInfo.supplierName}}</td>
                    <td class="label">线路名称</td>
                    <td class="value">{{data.waybillInfo.routeName}}</td>
                    <td class="label">派车单状态</td>
                    <td class="value">{{data.waybillInfo.waybillStateName}}</td>
                    <td class="label" v-show="!isTransitShow">车牌号码</td>
                    <td class="value" v-show="!isTransitShow">{{data.waybillInfo.plateNumber}}</td>
                </tr>
                <tr v-show="isTransitShow">
                    <td class="label">提货车牌号</td>
                    <td class="value">{{data.waybillInfo.pickupPlateNumber}}</td>
                    <td class="label">干线车牌号</td>
                    <td class="value">{{data.waybillInfo.plateNumber}}</td>
                    <td class="label">送货车牌号</td>
                    <td class="value">{{data.waybillInfo.deliveryPlateNumber}}</td>
                </tr>
            </table>
        </div>
        <!--        新增          -->

        <feeInfo v-show="!isTransitShow" ref="feeInfo"  :statementList="data.statementList" :waybillInfo="data.waybillInfo" :orderStockStatementList="data.orderStockList" ></feeInfo>
        <transitFeeInfo v-show="isTransitShow" ref="transitFeeInfo"  :waybillInfo="data.waybillInfo" ></transitFeeInfo>

        <div class="bot-btn">
            <el-button @click="closePage">关闭</el-button>
            <el-button type="primary" @click="doFeeChange" v-show="!isTransitShow">确定提交</el-button>

            <el-button type="primary" @click="saveFeeMoveInfo" v-show="isTransitShow">确定提交</el-button>
        </div>
    </div>
</template>

<script>
	import feeChange from './feeChange.js'
	export default feeChange
</script>

<style lang="scss">
    @import '@/page/pt/ord/order.scss';
    .wayBillDetailPage {
        background: #fff;
        border: $border;
        box-sizing: border-box;
        padding-right: 0;
        .innerTab {
            border: none;
        }
        .logListCommon {
            margin-top: 20px;
            border-bottom: $border;
            .content_height {
                height: 150px;
                .el-scrollbar__wrap {
                    overflow-x: hidden;
                }
            }
        }
        .tableCommonComponents {
            .tableCommon {
                border: none;
                td, th {
                    height: 30px;
                }
            }
        }
    }
</style>
