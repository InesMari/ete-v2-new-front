<template>
    <div id="printFeeOp" class="printFeeOpPage">
        <div class="common-info" style="padding:0 0 50px;">
        <div id="printTable">
            <div style="text-align: center;height:70px;position:relative;">
                <img style="height: 50px;float: left;margin: 10px;position:absolute;top:0;left:0;" src="@/static/image/logo.png">
                <p style="font-weight: bold;font-size: 14px;color:#333;line-height: 1;padding-top:15px;">广东易迁易物流科技有限公司</p>
                <p style="font-weight: bold;font-size: 14px;color:#333;line-height: 1;margin-top: 8px;">操作凭据</p>
            </div>
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;border: 1px solid #dbdbdb;">
                <tr>
                  <td style="font-size:12px;text-align: center;height:40px;background: #f2f2f2;">供应商名称</td>
                  <td style="font-size:12px;text-align: center;height:40px;" colspan="3">{{ info.tenantName }}</td>
                </tr>
                <tr>
                    <td width="80" style="font-size:12px;border-top: 1px solid #dbdbdb;text-align: center;height:40px;background: #f2f2f2;">操作类型</td>
                    <td width="200" style="font-size:12px;border-top: 1px solid #dbdbdb;text-align: center;height:40px;">{{ info.itemTypeName}}</td>
                    <td width="80" style="font-size:12px;border-top: 1px solid #dbdbdb;text-align: center;height:40px;background: #f2f2f2;">计费方式</td>
                    <td width="200" style="font-size:12px;border-top: 1px solid #dbdbdb;text-align: center;height:40px;">{{ info.wmsBillingTypeName}}</td>
                </tr>
                <tr>
                  <td width="80" style="font-size:12px;border-top: 1px solid #dbdbdb;text-align: center;height:40px;background: #f2f2f2;">单价</td>
                  <td width="200" style="font-size:12px;border-top: 1px solid #dbdbdb;text-align: center;height:40px;">{{ info.price}}</td>
                  <td width="80" style="font-size:12px;border-top: 1px solid #dbdbdb;text-align: center;height:40px;background: #f2f2f2;">数量</td>
                  <td width="200" style="font-size:12px;border-top: 1px solid #dbdbdb;text-align: center;height:40px;">{{ info.sums}}</td>
                </tr>
                <tr>
                  <td width="80" style="font-size:12px;border-top: 1px solid #dbdbdb;text-align: center;height:40px;background: #f2f2f2;">金额</td>
                  <td width="200" style="font-size:12px;border-top: 1px solid #dbdbdb;text-align: center;height:40px;">{{ info.totalFee}}</td>
                  <td width="80" style="font-size:12px;border-top: 1px solid #dbdbdb;text-align: center;height:40px;background: #f2f2f2;">实际发生日期</td>
                  <td width="200" style="font-size:12px;border-top: 1px solid #dbdbdb;text-align: center;height:40px;">{{ info.actualDate}}</td>
                </tr>
                <tr>
                  <td style="font-size:12px;border-top: 1px solid #dbdbdb;text-align: center;height:80px;background: #f2f2f2;">备注</td>
                  <td style="font-size:12px;border-top: 1px solid #dbdbdb;text-align: center;height:80px;" colspan="3">{{ info.remark}}</td>
                </tr>
            </table>

            <div style="text-align: center;font-weight: bold;height:40px;line-height:40px;font-size: 12px;position:relative;border-left: 1px solid #dbdbdb;border-right: 1px solid #dbdbdb;">
                签名信息
            </div>
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;border: 1px solid #dbdbdb;">
              <tr>
                <td width="80" style="font-size:12px;text-align: center;height:40px;background: #f2f2f2;">供应商</td>
                <td width="200" style="font-size:12px;text-align: center;height:40px;"></td>
                <td width="80" style="font-size:12px;text-align: center;height:40px;background: #f2f2f2;">仓库班长</td>
                <td width="200" style="font-size:12px;text-align: center;height:40px;"></td>
                <td width="80" style="font-size:12px;text-align: center;height:40px;background: #f2f2f2;">仓库经理</td>
                <td width="200" style="font-size:12px;text-align: center;height:40px;"></td>
              </tr>
            </table>

            <table width="100%">
                <tr>
                    <td colspan="11" style="text-align:right;line-height: 30px;font-size: 12px;color:#333;">
                        <span style="margin-right:30px;">打印人：{{userName}}</span><span >打印时间：{{ printDate }}</span>
                    </td>
                </tr>
            </table>
        </div>
        <div class="bot-btn">
            <el-button @click="close()">取消</el-button>
            <el-button type="primary" @click="print()">确认打印</el-button>
        </div>

        </div>
    </div>
</template>

<script>
    import printFeeOp from './printFeeOp.js'
    export default printFeeOp
</script>
<style lang="scss">
.printFeeOpPage{
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
