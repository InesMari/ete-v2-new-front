<template>
    <div id="printDevicePurOrder">
        <div class="common-info">
            <div id="printTable">
                <h3 class="title"><img src="@/static/image/logo.png" />采购订单</h3>
                <table class="table" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td width="50%" class="label" colspan="2" style="text-align:left;border-bottom:1px solid #000;">采购订单号：{{info.baseInfo.purchaseOrderNum}}</td>
                        <td width="50%" class="label" colspan="2" style="text-align:right;border-bottom:1px solid #000;">日期：{{info.baseInfo.createDate}}</td>
                    </tr>
                    <tr>
                        <td class="label" colspan="2" style="text-align:center;background:#efefef;">供应商</td>
                        <td class="label" colspan="2" style="text-align:center;background:#efefef;">采购方</td>
                    </tr>
                    <tr>
                      <td class="label" width="100">公司名称</td>
                      <td width="250">{{info.baseInfo.suppierName}}</td>
                      <td class="label" width="100">公司名称</td>
                      <td width="250" style="position:relative;">{{info.baseInfo.settleBodyName}}
                        <img class="seal" v-if="info.baseInfo.settleBody==1" src="@/static/image/seal_1.png" alt="">
                        <img class="seal" v-if="info.baseInfo.settleBody==3" src="@/static/image/seal_3.png" alt="">
                        <img class="seal" v-if="info.baseInfo.settleBody==5" src="@/static/image/seal_5.png" alt="">
                        <img class="seal" v-if="info.baseInfo.settleBody==6" src="@/static/image/seal_6.png" alt="">
                        <img class="seal" v-if="info.baseInfo.settleBody==8" src="@/static/image/seal_8.png" alt="">
                        <img class="seal" v-if="info.baseInfo.settleBody==9" src="@/static/image/seal_9.png" alt="">
                        <img class="seal" v-if="info.baseInfo.settleBody==10" src="@/static/image/seal_10.png" alt="">
                        <img class="seal" v-if="info.baseInfo.settleBody==11" src="@/static/image/seal_11.png" alt="">
                        <img class="seal" v-if="info.baseInfo.settleBody==12" src="@/static/image/seal_12.png" alt="">
                        <img class="seal" v-if="info.baseInfo.settleBody==13" src="@/static/image/seal_13.png" alt="">
                        <img class="seal" v-if="info.baseInfo.settleBody==14" src="@/static/image/seal_14.png" alt="">
                        <img class="seal" v-if="info.baseInfo.settleBody==15" src="@/static/image/seal_6.png" alt="">
                        <img class="seal" v-if="info.baseInfo.settleBody==17" src="@/static/image/seal_17.png" alt="">
                        <img class="seal" v-if="info.baseInfo.settleBody==18" src="@/static/image/seal_11.png" alt="">
                      </td>
                    </tr>
                    <tr>
                        <td class="label">公司地址</td>
                        <td>{{info.baseInfo.suppierAddress}}</td>
                        <td class="label">公司地址</td>
                        <td>{{info.baseInfo.address}}</td>
                    </tr>
                    <tr>
                        <td class="label">联系电话</td>
                        <td>{{info.baseInfo.suppierLinkPhone}}</td>
                        <td class="label">联系电话</td>
                        <td>{{info.baseInfo.linkBill}}</td>
                    </tr>
                    <tr>
                        <td class="label">传真</td>
                        <td>/</td>
                        <td class="label">传真</td>
                        <td>/</td>
                    </tr>
                    <tr>
                        <td class="label">联系人</td>
                        <td>{{info.baseInfo.suppierLinkman}}</td>
                        <td class="label">联系人</td>
                        <td>{{info.baseInfo.linkman}}</td>
                    </tr>
                    <tr>
                        <td class="label">电子邮箱</td>
                        <td>{{info.baseInfo.suppierEmail}}</td>
                        <td class="label">电子邮箱</td>
                        <td>{{info.baseInfo.email}}</td>
                    </tr>
                    <tr>
                        <td colspan="4" style="height:20px;"></td>
                    </tr>
                    <tr>
                        <td class="label" style="background:#efefef;">运输方式</td>
                        <td>{{info.baseInfo.transportModeName}}</td>
                        <td class="label" style="background:#efefef;">备货周期（天）</td>
                        <td>{{info.baseInfo.waitDay}}</td>
                    </tr>
                    <tr>
                        <td class="label" style="background:#efefef;">发货地址/提货地信息</td>
                        <td>{{info.baseInfo.pickAddress}}</td>
                        <td class="label" style="background:#efefef;">预计发货/提货时间</td>
                        <td>{{info.baseInfo.estimatedPickDate}}</td>
                    </tr>
                    <tr>
                        <td class="label" style="background:#efefef;">收货目的地及收货人信息</td>
                        <td>{{info.baseInfo.deliveryAddress}}</td>
                        <td class="label" style="background:#efefef;">付款方式</td>
                        <td>{{info.baseInfo.payRemark}}</td>
                    </tr>
                </table>
                <div class="infoTitle" style="background:#efefef;">订单信息</div>
                <table class="table table2" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top-width:1px;">
                    <tr>
                        <th colspan="5">物料信息</th>
                        <th colspan="2">价格（人民币：元）</th>
                        <th rowspan="2">期望交期</th>
                        <th rowspan="2">备注</th>
                    </tr>
                    <tr>
                        <th>序号</th>
                        <th>品名</th>
                        <th>规格型号</th>
                        <th>数量</th>
                        <th>单位</th>
                        <th>单价（含税）</th>
                        <th style="border-right: 1px solid #000;">小计（含税）</th>
                    </tr>
                    <tr v-for="(item,index) in info.dtlList">
                        <td>{{ index+1 }}</td>
                        <td>{{ item.deviceName }}</td>
                        <td>{{ item.spec }}</td>
                        <td>{{ item.purchaseNums }}</td>
                        <td>{{ item.unit }}</td>
                        <td>{{ item.priceWithTax }}</td>
                        <td>{{ item.totalFeeWithTax }}</td>
                        <td>{{ item.hopeDate }}</td>
                        <td>{{ item.remark }}</td>
                    </tr>
                    <tr>
                        <td colspan="3" style="font-weight:bold;background:#efefef;">总计数量及金额</td>
                        <td style="font-weight:bold;">{{totalInfo.purchaseNums}}</td>
                        <td></td>
                        <td></td>
                        <td style="font-weight:bold;">{{totalInfo.totalFeeWithTax}}</td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td colspan="3" style="font-weight:bold;background:#efefef;">总计金额大写（元）</td>
                        <td colspan="11" style="font-weight:bold;">{{totalInfo.totalFeeWithTaxChinese}}</td>
                    </tr>
                </table>
                <table class="table table3" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top:none;">
                    <tr>
                        <td width="50%">
                          <p>【付款信息】：</p>
                          <p>户名：{{ info.baseInfo.bankAccountName }}</p>
                          <p>开户行：{{ info.baseInfo.bankSubName }}</p>
                          <p>银行账号：{{ info.baseInfo.bankCard }}</p>
                        </td>
                        <td width="50%">
                          <p>订单备注：</p>
                          <div v-html="info.baseInfo.remark"></div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p>供应商：{{ info.baseInfo.suppierName }}</p>
                            <p style="line-height: 60px;">经办人签章：</p>
                            <p>日期：</p>
                        </td>
                        <td>
                            <p>采购方：{{ info.baseInfo.settleBodyName }}</p>
                            <p style="line-height: 60px;">经办人签章：</p>
                            <p>日期：</p>
                        </td>
                    </tr>
                </table>
            </div>
            
            <div class="bot-btn">
                <el-button type="primary" @click="print">打印</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import printDevicePurOrder from './printDevicePurOrder.js'
export default printDevicePurOrder
</script>
<style lang="scss" scoped>
#printDevicePurOrder{
    #printTable{
        border:2px solid #000;
        position: relative;
    }
    .seal{
        position: absolute;
        top: 15px;
        left: 20%;
        width: 150px;
    }
    h3.title{
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-weight: bold;
        font-size: 20px;
        position: relative;
        img{
            height: 30px;
            position: absolute;
            left: 20px;
            top: 10px;
        }
    }
    .infoTitle{
        line-height: 30px;
        text-align: center;
        border-top: 1px solid #000;
        font-weight: bold;
        margin-top: 20px;
    }
    .table{
        border-top:1px solid #000;
        .label{
            font-weight: bold;
        }
        th{
            font-weight: bold;
        }
        td,th{
            padding:0 10px;
            height: 32px;
            border-right:1px solid #000;
            border-bottom:1px solid #000;
            &:last-child{
                border-right: none;
            }
        }        
    }
    .table2{
        td{
            text-align: center;
        }
    }
    .table3{
        td{
            padding:10px;
            vertical-align: top;
        }
    }
}
</style>

