<template>
    <div id="orderPrint" class="orderPrintPage">
        <div class="common-info" id="printTable" style="padding:0 0 50px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #e8e8e8;">
            <caption style="text-align: center;font-weight: bold;font-size: 16px;line-height:70px;">托运单（易迁易运输）</caption>
            <tr>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;background:#d1e9ff;">易迁易订单号</td>
                <td colspan="2" style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;">{{ order.orderNum }}</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;background:#d1e9ff;">客户单号</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;">{{ order.custOrderNum }}</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;background:#d1e9ff;">线路名称</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;">{{ order.routeName }}</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;background:#d1e9ff;">是否加急</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;">{{ order.isUrgentName }}</td>
            </tr>
            <tr>
                <td width="12%" style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;background:#d1e9ff;">货物名称</td>
                <td width="8%" style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;background:#d1e9ff;">包装</td>
                <td width="8%" style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;background:#d1e9ff;">件数</td>
                <td width="12%" style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;background:#d1e9ff;">重量</td>
                <td width="12%" style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;background:#d1e9ff;">体积</td>
                <td width="12%" style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;background:#d1e9ff;">规格</td>
                <td width="12%" style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;background:#d1e9ff;">提货点</td>
                <td width="12%" style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;background:#d1e9ff;">卸货点</td>
                <td width="12%" style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;background:#d1e9ff;">要求取货时间</td>
            </tr>
            <tr v-for="item in goodsList">
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;word-break: break-all;">{{item.goodsName}}</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;word-break: break-all;">{{item.packingTypeName}}</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;word-break: break-all;">{{item.goodsCount}}</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;word-break: break-all;">{{item.goodsWeight}}</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;word-break: break-all;">{{item.goodsVolume}}</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;word-break: break-all;">{{item.goodsModel}}</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;word-break: break-all;">{{item.beginWorkName}}</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;word-break: break-all;">{{item.endWorkName}}</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;word-break: break-all;">{{item.beginWorkDate}}</td>
            </tr>
            <tr>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;background:#d1e9ff;">卸货点</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;background:#d1e9ff;">收货人</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;background:#d1e9ff;">联系方式</td>
                <td colspan="5" style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;background:#d1e9ff;">收货地址</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;background:#d1e9ff;">要求送达时间</td>
            </tr>
            <tr v-for="item in workList">
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;word-break: break-all;">{{item.workName}}</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;word-break: break-all;">{{item.linkmanName}}</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;word-break: break-all;">{{item.bill}}</td>
                <td colspan="5" style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;word-break: break-all;">{{item.workAddressStr}}</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;word-break: break-all;">{{item.workDate}}</td>
            </tr>
            <tr>
                <td colspan="9" style="color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;background:#d1e9ff;padding-left:4%;">派车单信息</td>
            </tr>
            <tr>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;">序号</td>
                <td colspan="2" style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;">派车单号</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;">状态</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;">起始点</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;">目的地</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;">司机名称</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;">司机联系方式</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;">车牌号码</td>
            </tr>
            <tr v-for="(item,index) in dispatchList" v-if="dispatchList!=null&&dispatchList.length>0">
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;">{{index+1}}</td>
                <td colspan="2" style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;">{{item.waybillNum}}</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;">{{item.waybillStateName}}</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;word-break: break-all;">{{item.beginWorkName}}</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;word-break: break-all;">{{item.endWorkName}}</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;">{{item.driverName}}</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;">{{item.linkPhone}}</td>
                <td style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;">{{item.plateNumber}}</td>
            </tr>
            <tr v-if="dispatchList==null||dispatchList.length==0">
              <td colspan="9" style="text-align: center;color: #333;border-right: 1px solid #e8e8e8;border-bottom: 1px solid #e8e8e8;height:45px;">无</td>
            </tr>
            <tr>
                <td colspan="8" style="text-align:right;padding-right: 30px;line-height: 50px;font-size: 14px;color:#333;">
                        <span style="margin-right:30px;">打印人：{{userName}}</span><span>打印时间：{{ printDate }}</span>
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
import orderPrint from './orderPrint.js'
export default orderPrint
</script>
<style lang="scss">

</style>
