<template>
    <div id="deviceAllocatePrint">
        <div class="common-info" style="padding: 30px 0;">
            <div id="printTable" style="margin-left: 10%;">
                <h3 class="title">器具调拨单</h3>
                <div class="tableInner">
                    <div style="margin: 8px 0 8px 20px;font-weight: bold;position: relative;">
                        调拨单号：{{info.transferOrderNum}}
                        <div class="state"><div class="text">{{ info.verifyState==1?"审核通过":"审核不通过" }}</div></div>
                    </div>
                    <table class="table table2" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top-width:1px;margin-bottom: 15px;">
                        <tr>
                            <th>器具名称</th>
                            <th>器具规格</th>
                            <th>调拨数量</th>
                            <th>交付地</th>
                            <th>开始计费日期</th>
                        </tr>
                        <tr>
                            <td>{{ info.deviceName }}</td>
                            <td>{{ info.spec }}</td>
                            <td>{{ info.nums }}</td>
                            <td>{{ info.deliveryWorkName }}</td>
                            <td>{{ info.chargeDate }}</td>
                        </tr>
                    </table>
                    <table class="table" width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                            <td class="label" colspan="2" style="text-align:center;background:#efefef;font-weight: bold;">调出仓库</td>
                            <td class="label" colspan="2" style="text-align:center;background:#efefef;font-weight: bold;">调入仓库</td>
                        </tr>
                        <tr>
                            <td class="label">仓库</td>
                            <td>{{info.fromWorkName}}</td>
                            <td class="label">仓库</td>
                            <td>{{info.toWorkName}}</td>
                        </tr>
                        <tr>
                            <td class="label">结算主体</td>
                            <td>{{info.fromSettleBody}}</td>
                            <td class="label">结算主体</td>
                            <td>{{info.toSettleBody}}</td>
                        </tr>
                        <tr>
                            <td class="label">使用客户</td>
                            <td>{{info.fromTenantName}}</td>
                            <td class="label">使用客户</td>
                            <td>{{info.toTenantName}}</td>
                        </tr>
                    </table>
                    <div class="botInfo">
                        <div style="float: left;margin-top: 8px;">审核人：{{ info.verifyUserName }} <span style="margin-left: 10px;">审核时间：{{ info.verifyDate }}</span></div>
                        <div style="float: right;margin-top: 8px;">操作人：{{ info.createUserName }} <span style="margin-left: 10px;">操作时间：{{ info.createDate }}</span></div>
                    </div>
                </div>
            </div>
            
            <div class="bot-btn" style="margin-left: 10%;">
                <el-button type="primary" @click="print">打印</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import deviceAllocatePrint from './deviceAllocatePrint.js'
export default deviceAllocatePrint
</script>
<style lang="scss" scoped>
#deviceAllocatePrint{
    #printTable{
        position: relative;
    }
    .tableInner{
        border:2px solid #000;
        border-bottom-width: 1px;
    }
    .state{
        position: absolute;
        top: -8px;
        right: 30px;
        border:3px solid red;
        padding:2px 5px;
        transform: rotate(15deg);
        .text{
            border:1px solid red;
            width: 70px;
            line-height: 25px;
            color: red;
            text-align: center;
        }
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
            width:100px;
        }
        th{
            font-weight: bold;
            background:#efefef;
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

