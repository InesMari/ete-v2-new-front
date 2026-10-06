<template>
    <div id="printWaybill" class="printWaybillPage">
        <div class="common-info" id="printTable" style="padding:0 0 50px;position:relative;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" class="fillTable">

                <caption style="text-align: center;font-weight: bold;font-size: 16px;line-height:70px;"><img style="height: 50px;position: absolute;left: 10px;top: 10px;" src="@/static/image/logo.png">短驳配送单（易迁易运输）</caption>
                <tr>
                    <td class="label">易迁易配送单号</td>
                    <td class="value" colspan="3">{{ info.waybillInfo.waybillNum }}</td>
                    <td class="label">配送托数</td>
                    <td class="value" colspan="2">{{ info.waybillInfo.palletNums }}</td>
                </tr>
                <tr>
                    <td class="label">起始地址</td>
                    <td class="value" colspan="3">{{ info.waybillInfo.workAddressStr }}</td>
                    <td class="label">要求送达时间</td>
                    <td class="value" colspan="2">{{ info.waybillInfo.requireDate }}</td>
                </tr>
            </table>
            <div style="display: flex;">
                <div class="tableTitle">出/入库单信息</div>
                <table width="100%" border="0" cellspacing="0" cellpadding="0" class="fillTable fillTable2" style="flex: 1;">
                    <template v-for="item in info.list">
                        <tr>
                            <!-- <td class="label" :rowspan="info.list.length">出/入库单信息</td> -->
                            <td style="width:110px;" class="value" rowspan="2">{{ item.outOrderNum }}</td>
                            <td style="width:90px;" class="label">货主</td>
                            <td style="width:300px;" class="value">{{ item.srcTenantName }}</td>
                            <td style="width:80px;" class="label">到货厂商</td>
                            <td style="width:300px;" class="value">{{ item.fromTenantName }}</td>
                        </tr>
                        <tr>
                            <td style="width:120px;" class="label">送货卸货地址</td>
                            <td class="value">{{ item.workNameDetail }}</td>
                            <td style="width:120px;" class="label">配送托数</td>
                            <td class="value">{{ item.palletNums2 }}</td>
                        </tr>
                    </template>
                </table>
            </div>
            <div class="fillTableTitle">运输信息</div>
            <table width="100%" border="0" cellspacing="0" cellpadding="0" class="fillTable">
                <tr>
                    <td style="width: 100px;" class="label">是否加急</td>
                    <td style="width: 100px;" class="value">{{ info.waybillInfo.isUrgentName }}</td>
                    <td style="width: 100px;" class="label">是否回单</td>
                    <td style="width: 100px;" class="value">{{ info.waybillInfo.haveReceiptName }}</td>
                    <td style="width: 100px;" class="label">备注</td>
                    <td style="width: 200px;" class="value" colspan="2">{{ info.waybillInfo.remark }}</td>
                </tr>
                <tr>
                    <td class="label" colspan="2">供应商</td>
                    <td class="label" colspan="2">配送司机</td>
                    <td class="label">司机电话</td>
                    <td class="label">车牌号码</td>
                    <td class="label">配送时间</td>
                </tr>
                <tr>
                    <td class="value" colspan="2">{{info.waybillInfo.tenantName}}</td>
                    <td class="value" colspan="2">{{info.waybillInfo.driverName}}</td>
                    <td class="value">{{info.waybillInfo.driverLinkPhone}}</td>
                    <td class="value">{{info.waybillInfo.plateNumber}}</td>
                    <td class="value">{{info.waybillInfo.deliveryDate}}</td>
                </tr>
            </table>
            <div style="text-align:right;padding-right: 30px;line-height: 50px;font-size: 14px;color:#333;">
                <span style="margin-right:30px;">打印人：{{userName}}</span><span>打印时间：{{ printDate }}</span>
            </div>
        </div>
        <div class="bot-btn">
            <el-button type="primary" @click="print">确认打印</el-button>
        </div>
    </div>
</template>

<script>
import printWaybill from './printWaybill.js'
export default printWaybill
</script>
<style lang="scss" scoped>
.printWaybillPage{
    .fillTable{
        width: 100%;
        border-top:$border;
        border-left: $border;
        table-layout: fixed;
        td{
            border-right: $border;
            border-bottom: $border;
            color: #333;
            text-align: center;
            height: 35px;
            .el-input,.el-select{
                width: 100%;
            }
            .el-input__inner{
                border:none;
            }
            &.label{
                background: #f5f5f5;
                width: 50px;
                em{
                    font-size: 20px;
                    font-weight: bold;
                    vertical-align: middle;
                }
            }
            &.value{
                width: 150px;
            }
        }
    }
    .fillTableTitle{
        font-weight:bold;
        text-align: left;
        padding-left: 30px;
        line-height: 30px;
    }
    .tableTitle{
        background: #f5f5f5;
        width: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: $border;
    }
}
</style>
