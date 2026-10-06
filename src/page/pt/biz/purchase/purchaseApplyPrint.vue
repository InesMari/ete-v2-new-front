<template>
    <div id="purchaseApplyPrint" class="purchaseApplyPrintPage">
        <div id="printTable">
            <div class="title" style="padding-top: 30px;font-weight: bold;font-size: 16px;text-align: center;color: #000;">广东易迁易物流科技有限公司</div>
            <div class="type" style="line-height: 30px;font-weight: bold;text-align: center;color: #000;font-size:12px;">采购费用申请单</div>
            <div class="clearfix" style="overflow:hidden;">
                <div class="fl" style="line-height:40px;float:left;font-size:12px;">采购费用申请单号：{{apply.applyNum}}</div>
                <div class="fr" style="line-height:40px;float:right;font-size:12px;">申请日期 ： {{apply.applyDate}}</div>
            </div>
            <table class="infoTable" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:2px solid #333;">
                <tr>
                    <td style="border-right:1px solid #333;border-bottom:1px solid #333;height: 40px;font-size:12px;;text-align: center;color: #000;">采购标题</td>
                    <td style="border-right:1px solid #333;border-bottom:1px solid #333;height: 40px;font-size:12px;;text-align: center;color: #000;" colspan="3">{{apply.title}}</td>
                    <td style="border-right:1px solid #333;border-bottom:1px solid #333;height: 40px;font-size:12px;;text-align: center;color: #000;">申请部门</td>
                    <td style="border-bottom:1px solid #333;height: 40px;font-size:12px;;text-align: center;color: #000;">{{apply.applyUserOrg}}</td>
                </tr>
                <tr>
                    <td style="border-right:1px solid #333;border-bottom:1px solid #333;height: 40px;font-size:12px;;text-align: center;color: #000;">采购名称</td>
                    <td style="border-right:1px solid #333;border-bottom:1px solid #333;height: 40px;font-size:12px;;text-align: center;color: #000;" colspan="3">{{apply.purchaseName}}</td>
                    <td style="border-right:1px solid #333;border-bottom:1px solid #333;height: 40px;font-size:12px;;text-align: center;color: #000;">预计到达时间</td>
                    <td style="border-bottom:1px solid #333;height: 40px;font-size:12px;;text-align: center;color: #000;">{{apply.expectDate}}</td>
                </tr>
                <tr>
                    <td style="border-right:1px solid #333;border-bottom:1px solid #333;height: 40px;font-size:12px;;text-align: center;color: #000;">付款方式</td>
                    <td style="border-right:1px solid #333;border-bottom:1px solid #333;height: 40px;font-size:12px;;text-align: center;color: #000;">{{apply.payTypeName}}</td>
                    <td style="border-right:1px solid #333;border-bottom:1px solid #333;height: 40px;font-size:12px;;text-align: center;color: #000;">是否预算内</td>
                    <td style="border-right:1px solid #333;border-bottom:1px solid #333;height: 40px;font-size:12px;;text-align: center;color: #000;">{{apply.isWithinBudgetName}}</td>
                    <td style="border-right:1px solid #333;border-bottom:1px solid #333;height: 40px;font-size:12px;;text-align: center;color: #000;">紧急程度</td>
                    <td style="border-bottom:1px solid #333;height: 40px;font-size:12px;;text-align: center;color: #000;">{{apply.urgentLevelName}}</td>
                </tr>
                <tr>
                    <td style="border-right:1px solid #333;border-bottom:1px solid #333;height: 40px;font-size:12px;;text-align: center;color: #000;">采购类型</td>
                    <td style="border-right:1px solid #333;border-bottom:1px solid #333;height: 40px;font-size:12px;;text-align: center;color: #000;">{{apply.purchaseTypeName}}</td>
                    <td style="border-right:1px solid #333;border-bottom:1px solid #333;height: 40px;font-size:12px;;text-align: center;color: #000;">采购方式</td>
                    <td style="border-right:1px solid #333;border-bottom:1px solid #333;height: 40px;font-size:12px;;text-align: center;color: #000;">{{apply.purchasePayTypeName}}</td>
                    <td style="border-right:1px solid #333;border-bottom:1px solid #333;height: 40px;font-size:12px;;text-align: center;color: #000;">采购金额</td>
                    <td style="border-bottom:1px solid #333;height: 40px;font-size:12px;;text-align: center;color: #000;">{{apply.payFee}}</td>
                </tr>
                <tr>
                    <td style="border-right:1px solid #333;border-bottom:1px solid #333;height: 40px;font-size:12px;;text-align: center;color: #000;">采购原因描述</td>
                    <td style="border-bottom:1px solid #333;height: 40px;font-size:12px;;text-align: center;color: #000;" colspan="5">{{apply.purchaseReason}}</td>
                </tr>
                <tr>
                    <td style="border-right:1px solid #333;height: 40px;font-size:12px;;text-align: center;color: #000;">采购询价描述</td>
                    <td style="height: 40px;font-size:12px;;text-align: center;color: #000;" colspan="5">{{apply.purchaseInquiry}}</td>
                </tr>
            </table>
            <div class="person" style="display: flex;">
                <div class="item" style="flex: 1;line-height: 40px;text-align: center;color: #000;font-size:12px;">申请人：{{apply.applyUser}}</div>
                <div v-if="apply.orgVerifyUserId > 0" class="item" style="flex: 1;line-height: 40px;text-align: center;color: #000;font-size:12px;">{{apply.orgVerifyOrgName}}审核人：{{apply.orgVerifyName}}</div>
                <div v-if="apply.nextVerifyUserId > 0" class="item" style="flex: 1;line-height: 40px;text-align: center;color: #000;font-size:12px;">{{apply.nextVerifyOrgName}}审核人：{{apply.nextVerifyUserName}}</div>
                <div v-if="apply.gmoaVerifyUserId > 0" class="item" style="flex: 1;line-height: 40px;text-align: center;color: #000;font-size:12px;">{{apply.gmoaVerifyOrgName}}审核人：{{apply.gmoaVerifyUserName}}</div>
                <div v-if="apply.gmoVerifyUserId > 0" class="item" style="flex: 1;line-height: 40px;text-align: center;color: #000;font-size:12px;">{{apply.gmoVerifyOrgName}}审核人：{{apply.gmoVerifyUserName}}</div>
            </div>
        </div>
        <div class="bot-btn">
            <el-button type="primary" @click="print">打印采购费用申请单</el-button>
        </div>
    </div>
</template>

<script>
import purchaseApplyPrint from './purchaseApplyPrint.js'

export default purchaseApplyPrint
</script>
<style>
.blueFont {
    color: #0379FF;
}
</style>
<style lang="scss" scoped>
.purchaseApplyPrintPage{
    #printTable{
        padding: 0 30px;
        background: #fff;
        // .title{
        //     padding-top: 30px;
        //     font-weight: bold;
        //     font-size: 16px;
        //     text-align: center;
        //     color: #000;
        // }
        // .type{
        //     line-height: 30px;
        //     font-weight: bold;
        //     text-align: center;
        //     color: #000;
        // }
        // .infoTable{
        //     border-left:2px solid #333;
        //     border-top:2px solid #333;
        //     tr{
        //         td{
        //             border-right:1px solid #333;
        //             border-bottom:1px solid #333;
        //             height: 40px;font-size:12px;;
        //             text-align: center;
        //             color: #000;
        //             &:last-child{
        //                 
        //             }
        //         }
        //         &:last-child{
        //             td{
        //                 
        //             }
        //         }
        //     }
        // }
        // .person{
        //     display: flex;
        //     .item{
        //         flex: 1;
        //         line-height: 40px;
        //         text-align: center;
        //         color: #000;
        //     }
        // }
    }
}
</style>
