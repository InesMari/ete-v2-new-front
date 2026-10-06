<template>
    <div id="printWarehousingOrder" class="printWarehousingOrderPage">
        <div class="common-info" id="printTable" style="padding:0 0 50px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #dbdbdb;">
            <caption style="text-align: center;font-weight: bold;font-size: 16px;line-height:70px;position:relative;"><img style="height: 50px;float: left;margin: 10px;position:absolute;top0;left:0;" src="@/static/image/logo.png">易迁易入库单</caption>
                <tr>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;background:#d1e9ff;">易迁易入库单号</td>
                    <td colspan="2" style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;">{{ order.orderNum }}</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;background:#d1e9ff;">货主</td>
                    <td colspan="2" style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;">{{ order.custOrderNum }}</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;background:#d1e9ff;">ASN</td>
                    <td colspan="2" style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;">{{ order.routeName }}</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;background:#d1e9ff;">是否为退货</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;">{{ order.isUrgentName }}</td>
                </tr>
                <tr>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;background:#d1e9ff;">到货厂商编码</td>
                    <td colspan="2" style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;">{{ order.orderNum }}</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;background:#d1e9ff;">到货厂商名称</td>
                    <td colspan="2" style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;">{{ order.custOrderNum }}</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;background:#d1e9ff;">备注</td>
                    <td colspan="4" style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;">{{ order.routeName }}</td>
                </tr>
                <tr>
                    <td colspan="11" style="height:12px;border-bottom: 1px solid #dbdbdb;"></td>
                </tr>
                <tr>
                    <td width="120" style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;background:#d1e9ff;">物料编码</td>
                    <td width="120" style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;background:#d1e9ff;">物料描述</td>
                    <td width="100" style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;background:#d1e9ff;">批次号</td>
                    <td width="100" style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;background:#d1e9ff;">入库数量</td>
                    <td width="100" style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;background:#d1e9ff;">管理单位</td>
                    <td width="60" style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;background:#d1e9ff;">箱数</td>
                    <td width="80" style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;background:#d1e9ff;">托数</td>
                    <td width="100" style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;background:#d1e9ff;">生产日期</td>
                    <td width="100" style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;background:#d1e9ff;">实际入库数量</td>
                    <td width="100" style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;background:#d1e9ff;">库区</td>
                    <td width="100" style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;background:#d1e9ff;">库位</td>
                </tr>
                <tr v-for="item in goodsList">
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;">{{item.goodsName}}</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;">{{item.packingTypeName}}</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;">{{item.goodsCount}}</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;">{{item.goodsWeight}}</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;">{{item.goodsVolume}}</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;">{{item.goodsModel}}</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;">{{item.beginWorkName}}</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;">{{item.endWorkName}}</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;">{{item.beginWorkDate}}</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;">{{item.endWorkName}}</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;">{{item.beginWorkDate}}</td>
                </tr>
                <tr>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;background:#d1e9ff;">汇总数据</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;">--</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;"></td>
                    <td style="text-align: center;color: #f00;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;">6488594</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;">--</td>
                    <td style="text-align: center;color: #f00;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;">167</td>
                    <td style="text-align: center;color: #f00;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;">69</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;">--</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;">--</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;">--</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;">--</td>
                </tr>
                <tr>
                    <td colspan="11" style="height:12px;border-bottom: 1px solid #dbdbdb;"></td>
                </tr>
                <tr>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;background:#d1e9ff;">可回收包材</td>
                    <td colspan="4" style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;background:#d1e9ff;">所属用户</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;background:#d1e9ff;">入库数量</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;background:#d1e9ff;">实际入库数量</td>
                    <td colspan="2" style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;background:#d1e9ff;">入库操作人签字</td>
                    <td colspan="2" style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;background:#d1e9ff;">复核签字</td>
                </tr>
                <tr>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;">托盘A</td>
                    <td colspan="4" style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;">肖某人福建总公司</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;">169</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;">167</td>
                    <td colspan="2" rowspan="2" style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;"></td>
                    <td colspan="2" rowspan="2" style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;"></td>
                </tr>
                <tr>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;">托盘A</td>
                    <td colspan="4" style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;">肖某人福建总公司</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;">169</td>
                    <td style="text-align: center;color: #333;border-right: 1px solid #dbdbdb;border-bottom: 1px solid #dbdbdb;height:45px;word-break: break-all;">167</td>
                </tr> 
                <tr>
                    <td colspan="11" style="text-align:right;padding-right: 30px;line-height: 50px;font-size: 14px;color:#333;">
                        <span style="margin-right:30px;">打印人：{{userName}}</span><span style="margin-right:30px;">打印时间：{{ printDate }}</span><span>打印次数：2次</span>
                    </td>
                </tr>    
        </table>

        <div class="bot-btn">
            <el-button @click="close()">取消</el-button>
            <el-button type="primary" @click="print()">确认打印</el-button>
        </div>

        </div>
    </div>
</template>

<script>
    import printWarehousingOrder from './printWarehousingOrder.js'
    export default printWarehousingOrder
</script>
<style lang="scss">
.printWarehousingOrderPage{
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
