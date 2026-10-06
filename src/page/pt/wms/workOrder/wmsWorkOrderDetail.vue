<template>
    <div id="wmsWorkOrderDetail" class="orderDetailPage orderPage">
        <div class="common-info">
            <h3 class="common-title" style="text-align: center">
                <el-button @click="exportExcel" class="fl" size="mini" type="primary" plain>导出</el-button>
                <span class="titleName">外包作业明细表</span>
            </h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">仓库名称：</td>
                    <td class="value">
                        <el-input v-model="order.workName" disabled ></el-input>
                    </td>
                    <td class="label">供应商：</td>
                    <td class="value">
                        <el-input v-model="order.tenantName" disabled ></el-input>
                    </td>
                    <td class="label">登记月份：</td>
                    <td class="value">
                        <el-input v-model="order.month" disabled ></el-input>
                    </td>
                    <td class="label">计费单位：</td>
                    <td class="value">
                        <el-input v-model="order.unit" disabled ></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">费用类型：</td>
                    <td class="value">
                        <el-input v-model="order.itemTypeName" disabled ></el-input>
                    </td>
                    <td class="label">作业名称：</td>
                    <td class="value">
                        <el-input v-model="order.itemName" disabled ></el-input>
                    </td>
                    <td class="label">增值税率(%)：</td>
                    <td class="value">
                        <el-input v-model="order.tax" disabled ></el-input>
                    </td>
                    <td class="label">结算数量合计 ：</td>
                    <td class="value">
                        <el-input v-model="order.settleNumSum" disabled ></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">未税金额：</td>
                    <td class="value">
                        <el-input v-model="order.settleFeeSum" disabled ></el-input>
                    </td>
                    <td class="label">含税金额：</td>
                    <td class="value">
                        <el-input v-model="order.settleFeeWithTaxSum" disabled></el-input>
                    </td>
                </tr>
            </table>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th width="30" rowspan="2">序号</th>
                        <th width="60" rowspan="2">日期</th>
                        <th width="60" rowspan="2">期初未结算</th>
                        <th width="120" colspan="2">作业登记</th>
                        <th width="180" colspan="2">结算数据</th>
                        <th width="80" rowspan="2">结存未结算</th>
                    </tr>
                    <tr>
                        <th width="60">作业单号</th>
                        <th width="60">作业确认数量</th>
                        <th width="60">结算数量</th>
                        <th width="60">结算金额</th>
                    </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in monthList">
                    <td class="el-input-center">
                        <el-input :value="index + 1" disabled></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.day" disabled></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.lastNoSettleNum" disabled></el-input>
                    </td>
                    <td>
                        <a href="javascript:void(0);" class="link" @click="toOrderDetail(item)">{{item.orderNum}}</a>
                    </td>
                    <td>
                        <el-input v-model="item.confirmNum" disabled></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.settleNum" disabled></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.settleFeeWithTax" disabled></el-input>
                    </td>
                    <td>
                        <el-input v-model="item.noSettleNum" disabled></el-input>
                    </td>
                </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td>
                            合计
                        </td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>
                            <el-input v-model="total.confirmNum" disabled></el-input>
                        </td>
                        <td>
                            <el-input v-model="total.settleNum" disabled></el-input>
                        </td>
                        <td>
                            <el-input v-model="total.settleFeeWithTax" disabled></el-input>
                        </td>
                        <td>
                            <el-input v-model="total.noSettleNum" disabled></el-input>
                        </td>
                    </tr>
                </tfoot>
            </table>

            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
            </div>
        </div>
    </div>
</template>

<script>
	import wmsWorkOrderDetail from './wmsWorkOrderDetail.js'

	export default wmsWorkOrderDetail
</script>
<style lang="scss">
    #wmsWorkOrderDetail{
        .titleName{
            line-height: 30px;
            color:$main-color;
            position: relative;
            padding-left: 30px;
            font-size: 14px;
            font-weight: 700;
        }
        .el-input-center div input{
            text-align: center;
        }
    }
</style>
