<template>
    <div id="payApplyPrint" class="payApplyPrintPage">
        <div class="common-info" id="printTable">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <caption style="text-align: center;font-weight: bold;font-size: 18px;padding-bottom: 20px;">G7付款申请单</caption>
            <tr>
                <td style="display:table;border-collapse: collapse;width:100%;">
                    <tr>
                        <th width="5%" style="font-size: 12px;padding: 0 5px;text-align: center;box-sizing: border-box;white-space: nowrap;line-height: 30px;height: 30px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;border-top: 1px solid #c9d7ea;font-weight: bold;border-left: 1px solid #c9d7ea;">下单客户</th>
                        <th width="5%" style="font-size: 12px;padding: 0 5px;text-align: center;box-sizing: border-box;white-space: nowrap;line-height: 30px;height: 30px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;border-top: 1px solid #c9d7ea;font-weight: bold;">客户单号</th>
                        <th width="6%" style="font-size: 12px;padding: 0 5px;text-align: center;box-sizing: border-box;white-space: nowrap;line-height: 30px;height: 30px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;border-top: 1px solid #c9d7ea;font-weight: bold;">订单编号</th>
                        <th width="6%" style="font-size: 12px;padding: 0 5px;text-align: center;box-sizing: border-box;white-space: nowrap;line-height: 30px;height: 30px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;border-top: 1px solid #c9d7ea;font-weight: bold;">派车单号</th>
                        <th width="6%" style="font-size: 12px;padding: 0 5px;text-align: center;box-sizing: border-box;white-space: nowrap;line-height: 30px;height: 30px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;border-top: 1px solid #c9d7ea;font-weight: bold;">供应商</th>
                        <th width="6%" style="font-size: 12px;padding: 0 5px;text-align: center;box-sizing: border-box;white-space: nowrap;line-height: 30px;height: 30px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;border-top: 1px solid #c9d7ea;font-weight: bold;">发货日期</th>
                        <th width="6%" style="font-size: 12px;padding: 0 5px;text-align: center;box-sizing: border-box;white-space: nowrap;line-height: 30px;height: 30px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;border-top: 1px solid #c9d7ea;font-weight: bold;">完成天数</th>
                        <th width="6%" style="font-size: 12px;padding: 0 5px;text-align: center;box-sizing: border-box;white-space: nowrap;line-height: 30px;height: 30px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;border-top: 1px solid #c9d7ea;font-weight: bold;">起始地</th>
                        <th width="5%" style="font-size: 12px;padding: 0 5px;text-align: center;box-sizing: border-box;white-space: nowrap;line-height: 30px;height: 30px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;border-top: 1px solid #c9d7ea;font-weight: bold;">目的地</th>
<!--                        <th width="5%" style="font-size: 12px;padding: 0 5px;text-align: center;box-sizing: border-box;white-space: nowrap;line-height: 30px;height: 30px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;border-top: 1px solid #c9d7ea;font-weight: bold;">调度类型</th>-->
                        <th width="5%" style="font-size: 12px;padding: 0 5px;text-align: center;box-sizing: border-box;white-space: nowrap;line-height: 30px;height: 30px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;border-top: 1px solid #c9d7ea;font-weight: bold;">重量/KG</th>
                        <th width="5%" style="font-size: 12px;padding: 0 5px;text-align: center;box-sizing: border-box;white-space: nowrap;line-height: 30px;height: 30px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;border-top: 1px solid #c9d7ea;font-weight: bold;">件数/件</th>
                        <th width="5%" style="font-size: 12px;padding: 0 5px;text-align: center;box-sizing: border-box;white-space: nowrap;line-height: 30px;height: 30px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;border-top: 1px solid #c9d7ea;font-weight: bold;">体积/m³</th>
                        <th width="5%" style="font-size: 12px;padding: 0 5px;text-align: center;box-sizing: border-box;white-space: nowrap;line-height: 30px;height: 30px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;border-top: 1px solid #c9d7ea;font-weight: bold;">车长/m</th>
                        <th width="5%" style="font-size: 12px;padding: 0 5px;text-align: center;box-sizing: border-box;white-space: nowrap;line-height: 30px;height: 30px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;border-top: 1px solid #c9d7ea;font-weight: bold;">司机</th>
                        <th width="5%" style="font-size: 12px;padding: 0 5px;text-align: center;box-sizing: border-box;white-space: nowrap;line-height: 30px;height: 30px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;border-top: 1px solid #c9d7ea;font-weight: bold;">总运费</th>
<!--                        <th width="5%" style="font-size: 12px;padding: 0 5px;text-align: center;box-sizing: border-box;white-space: nowrap;line-height: 30px;height: 30px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;border-top: 1px solid #c9d7ea;font-weight: bold;">分摊运费</th>-->
<!--                        <th width="5%" style="font-size: 12px;padding: 0 5px;text-align: center;box-sizing: border-box;white-space: nowrap;line-height: 30px;height: 30px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;border-top: 1px solid #c9d7ea;font-weight: bold;">利润率/%</th>-->
                        <th width="5%" style="font-size: 12px;padding: 0 5px;text-align: center;box-sizing: border-box;white-space: nowrap;line-height: 30px;height: 30px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;border-top: 1px solid #c9d7ea;font-weight: bold;">收款人</th>
                        <th width="5%" style="font-size: 12px;padding: 0 5px;text-align: center;box-sizing: border-box;white-space: nowrap;line-height: 30px;height: 30px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;border-top: 1px solid #c9d7ea;font-weight: bold;">申请金额</th>
                        <th width="5%" style="font-size: 12px;padding: 0 5px;text-align: center;box-sizing: border-box;white-space: nowrap;line-height: 30px;height: 30px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;border-top: 1px solid #c9d7ea;font-weight: bold;">申请备注</th>
                        <th width="4%" style="font-size: 12px;padding: 0 5px;text-align: center;box-sizing: border-box;white-space: nowrap;line-height: 30px;height: 30px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;border-top: 1px solid #c9d7ea;font-weight: bold;">申请人</th>
                        <th width="4%" style="font-size: 12px;padding: 0 5px;text-align: center;box-sizing: border-box;white-space: nowrap;line-height: 30px;height: 30px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;border-top: 1px solid #c9d7ea;font-weight: bold;">平台基地</th>
                    </tr>
                    <tr v-for="item in printData">
                        <td style="font-size:12px;color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;border-left: 1px solid #c9d7ea;">{{ item.orderCustName }}</td>
                        <td style="font-size:12px;color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;">{{ item.custOrderNum }}</td>
                        <td style="font-size:12px;color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;">{{ item.orderNum }}</td>
                        <td style="font-size:12px;color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;">{{ item.waybillNum }}</td>
                        <td style="font-size:12px;color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;">{{ item.supplierName }}</td>
                        <td style="font-size:12px;color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;">{{ item.startWorkDate }}</td>
                        <td style="font-size:12px;color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;">{{ item.endDays }}</td>
                        <td style="font-size:12px;color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;">{{ item.startWorkAddress }}</td>
                        <td style="font-size:12px;color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;">{{ item.endWorkAddress }}</td>
<!--                        <td style="font-size:12px;color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;">{{ item.dispatchTypeName }}</td>-->
                        <td style="font-size:12px;color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;">{{ item.goodsWeight }}</td>
                        <td style="font-size:12px;color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;">{{ item.goodsCount }}</td>
                        <td style="font-size:12px;color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;">{{ item.goodsVolume }}</td>
                        <td style="font-size:12px;color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;">{{ item.vehicleLengthName }}</td>
                        <td style="font-size:12px;color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;">{{ item.driverName }}</td>
                        <td style="font-size:12px;color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;">{{ item.totalFee }}</td>
<!--                        <td style="font-size:12px;color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;">{{ item.shareTotalFee }}</td>-->
<!--                        <td style="font-size:12px;color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;">{{ item.rate }}</td>-->
                        <td style="font-size:12px;color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;">{{ item.receiveUserName }}</td>
                        <td style="font-size:12px;color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;">{{ item.fee }}</td>
                        <td style="font-size:12px;color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;">{{ item.remark }}</td>
                        <td style="font-size:12px;color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;">{{ item.createUserName }}</td>
                        <td style="font-size:12px;color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;">{{ item.g7NtoccGroundName }}</td>
                    </tr>
                    <tr>
                        <td style="color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;font-weight:bold;border-left: 1px solid #c9d7ea;">合计</td>
                        <td style="color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;font-weight:bold;"></td>
                        <td style="color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;font-weight:bold;"></td>
                        <td style="color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;font-weight:bold;"></td>
                        <td style="color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;font-weight:bold;"></td>
                        <td style="color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;font-weight:bold;"></td>
                        <td style="color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;font-weight:bold;"></td>
                        <td style="color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;font-weight:bold;"></td>
                        <td style="color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;font-weight:bold;"></td>
                        <td style="color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;font-weight:bold;"></td>
                        <td style="color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;font-weight:bold;"></td>
                        <td style="color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;font-weight:bold;"></td>
                        <td style="color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;font-weight:bold;"></td>
                        <td style="color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;font-weight:bold;"></td>
                        <td style="color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;font-weight:bold;"></td>
<!--                        <td style="color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;font-weight:bold;">{{totalShareFee}}</td>-->
<!--                        <td style="color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;font-weight:bold;"></td>-->
                        <td style="color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;font-weight:bold;"></td>
                        <td style="color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;font-weight:bold;">{{payFee}}</td>
                        <td style="color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;font-weight:bold;"></td>
                        <td style="color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;font-weight:bold;"></td>
                        <td style="color: #333;box-sizing: border-box;text-align: center;height: 30px;padding: 0 5px;border-right: 1px solid #c9d7ea;border-bottom: 1px solid #c9d7ea;font-weight:bold;"></td>
                    </tr>
                </td>
            </tr>
            <tr>
                <td style="display:table;width: 100%;padding-top: 10px;">
                    <tr>
                        <td style="font-weight: bold;padding: 5px;font-size: 15px;text-align: right;" colspan="3" width="150" class="label">请款部门：</td>
                        <td style="font-weight: bold;padding: 5px;font-size: 15px;text-align: left;" colspan="3" width="150" class="text">{{ orgName }}</td>
                        <td style="font-weight: bold;padding: 5px;font-size: 15px;text-align: right;" colspan="3" width="100" class="label">请款人：</td>
                        <td style="font-weight: bold;padding: 5px;font-size: 15px;text-align: left;" colspan="3" width="150" class="text">{{ userName }}</td>
                        <td style="font-weight: bold;padding: 5px;font-size: 15px;text-align: right;" colspan="3" width="150" class="label">打印时间：</td>
                        <td style="font-weight: bold;padding: 5px;font-size: 15px;text-align: left;" colspan="3" width="150" class="text">{{ printDate }}</td>
<!--                        <td style="font-weight: bold;padding: 5px;font-size: 15px;text-align: right;" colspan="2" width="100" class="label"></td>-->
<!--                        <td style="font-weight: bold;padding: 5px;font-size: 15px;text-align: left;" colspan="2" width="130" class="text"></td>-->
                    </tr>
                    <tr>
                        <td style="font-weight: bold;padding: 5px;font-size: 15px;text-align: right;" colspan="3" class="label">财务：</td>
                        <td style="font-weight: bold;padding: 5px;font-size: 15px;text-align: left;" colspan="3" class="text"> </td>
                        <td style="font-weight: bold;padding: 5px;font-size: 15px;text-align: right;" colspan="3" class="label">部门负责人：</td>
                        <td style="font-weight: bold;padding: 5px;font-size: 15px;text-align: left;" colspan="3" class="text"> </td>
                        <td style="font-weight: bold;padding: 5px;font-size: 15px;text-align: right;" colspan="3" class="label">总经理：</td>
                        <td style="font-weight: bold;padding: 5px;font-size: 15px;text-align: left;" colspan="3" class="text"> </td>
<!--                        <td style="font-weight: bold;padding: 5px;font-size: 15px;text-align: right;" colspan="2" class="label">总经理：</td>-->
<!--                        <td style="font-weight: bold;padding: 5px;font-size: 15px;text-align: left;" colspan="2" class="text"> </td>-->
                    </tr>
                </td>
            </tr>
        </table>

        <div class="bot-btn">
            <el-button @click="close()">取消</el-button>
            <el-button type="primary" @click="print()">确认打印</el-button>
            <el-button type="primary" plain @click="downloadFile()">导出Excel</el-button>
        </div>

        </div>
    </div>
</template>

<script>
    import payApplyPrint from './payApplyPrint.js'
    export default payApplyPrint
</script>
<style lang="scss">
.payApplyPrintPage{
    .titleTable{
        width: 100%;
        td{
            text-align: center;
            font-weight: bold;
            font-size: 18px;
            padding: 12px 0;
        }
    }
    .tableCommon{
        border:$border;
        border-bottom:none;
        tfoot{
            td{
                font-weight: bold;
            }
        }
    }
    .footerTable{
        width: 100%;
        margin-top:10px;
        td{
            font-weight: bold;
            padding: 5px;
            font-size: 15px;
        }
        .label{
            text-align: right;
        }
    }
}
</style>
