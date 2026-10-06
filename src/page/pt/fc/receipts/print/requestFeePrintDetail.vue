<template>
    <div id="requestFeePrintDetail" class="requestFeePrintDetailPage">
        <div id="printTable" style="background:#fff;">
        <div class="A5H" v-for="(item,index) in requestDatas" :key="index" :class="index%2==0?'A5bottom':''">
        <div style="height: 20px;line-height: 1;font-weight:bold;text-align: center;font-size: 20px;width:90%;margin-left:10%;padding:29px 0 9px;position:relative;">
            {{item.payTitleName}}
            <div style="position:absolute;top:30px;right:0;font-weight:bold;font-size:24px;letter-spacing: 8px;" v-show="item.payType==3">核销</div>
        </div>
        <div style="height: 34px;line-height: 34px;font-weight:bold;text-align: center;font-size: 18px;width:90%;margin-left:10%;">请 款 单</div>
        <div style="height: 30px;line-height: 34px;margin-left: 10%;font-size: 12px;font-weight: bold;text-align: left;">单据编码：<span class="blueFont">{{item.payNum}}</span></div>
        <table class="infoTable" width="90%" border="0" cellspacing="0" cellpadding="0" style="background: #fff;border-top:3px solid #333;border-left: 3px solid #333;margin-left:10%;">
            <tr>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;"  colspan="2">请款部门</td>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;"  class="blueFont">{{item.orgName}}</td>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;" >请款人</td>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;"  class="blueFont">{{item.createUserName}}</td>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;" >请款日期</td>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 3px solid #333;"  class="blueFont" colspan="2">{{item.createDate}}</td>
            </tr>
            <tr>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;" rowspan="3" colspan="2">用途</td>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;" colspan="3">
                    <span class="blueFont">{{item.payProjectName}}</span>
                </td>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 3px solid #333;width: 40%" colspan="3">账户信息（正确填写）</td>
            </tr>
            <tr>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;" colspan="3" rowspan="2">
                    <span class="blueFont">{{item.payRemark}}</span>
                </td>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;">
                    收款方全称
                </td>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 3px solid #333;" colspan="2">
                    <span class="blueFont">{{item.bankAccountName}}</span>
                </td>
            </tr>
            <tr>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;">
                    开户行
                </td>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 3px solid #333;" colspan="2">
                    <span class="blueFont">{{item.bankDeposit}}</span>
                </td>
            </tr>
            <tr>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;" rowspan="2">
                    请款金额
                </td>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;">
                    小写
                </td>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;" colspan="3">
                    <span class="blueFont">￥{{item.payFee}}</span>
                </td>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;">账号</td>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 3px solid #333;" colspan="2">
                    <span class="blueFont">{{item.bankCard}}</span>
                </td>
            </tr>
            <tr>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;">
                    大写
                </td>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;" colspan="3">
                    <span class="blueFont" style="margin: 0 1% 0" >{{item.moneyArray[8]}}</span>佰
                    <span class="blueFont" style="margin: 0 1% 0" >{{item.moneyArray[7]}}</span>拾
                    <span class="blueFont" style="margin: 0 1% 0" >{{item.moneyArray[6]}}</span>万
                    <span class="blueFont" style="margin: 0 1% 0" >{{item.moneyArray[5]}}</span>仟
                    <span class="blueFont" style="margin: 0 1% 0" >{{item.moneyArray[4]}}</span>佰
                    <span class="blueFont" style="margin: 0 1% 0" >{{item.moneyArray[3]}}</span>拾
                    <span class="blueFont" style="margin: 0 1% 0" >{{item.moneyArray[2]}}</span>元
                    <span class="blueFont" style="margin: 0 1% 0" >{{item.moneyArray[1]}}</span>角
                    <span class="blueFont" style="margin: 0 1% 0" >{{item.moneyArray[0]}}</span>分
                </td>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;">联系人</td>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 3px solid #333;" colspan="2">
                    <span class="blueFont">{{item.bankLinkman}}</span>
                </td>
            </tr>
            <tr>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;" colspan="2">
                    支付方式
                </td>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;" colspan="3">
                    <!-- <span class="blueFont" v-if="item.payType==1">现金</span>
                    <span class="blueFont" v-if="item.payType==2">银行转账</span>
                    <span class="blueFont" v-if="item.payType==3">其他</span> -->
                    <div style="display:inline-block;margin-top:4px;margin-left:10px;">
                        <div style="float:left;display:inline-block;width:12px;height:12px;font-size:12px;border:1px solid #333;text-align: center;line-height:1;border-radius:3px;"><span v-show="item.payType==1">√</span></div>
                        <span style="font-weight:bold;float:left;margin:0 8px 0 3px;line-height:14px;">现金</span>
                        <div style="float:left;display:inline-block;width:12px;height:12px;font-size:12px;border:1px solid #333;text-align: center;line-height:1;border-radius:3px;"><span v-show="item.payType==2">√</span></div>
                        <span style="font-weight:bold;float:left;margin:0 8px 0 3px;line-height:14px;">银行转账</span>
<!--                        <div style="float:left;display:inline-block;width:12px;height:12px;font-size:12px;border:1px solid #333;text-align: center;line-height:1;border-radius:3px;"><span v-show="item.payType==3">√</span></div>-->
<!--                        <span style="font-weight:bold;float:left;margin:0 8px 0 3px;line-height:14px;">核销</span>-->
                    </div>
                </td>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;">
                    电话
                </td>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 3px solid #333;" colspan="2">
                    <span class="blueFont">{{item.bankPhone}}</span>
                </td>
            </tr>
            <tr>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;" colspan="2">
                    预计核销日期
                </td>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 3px solid #333;" colspan="6">
                    <span class="blueFont">{{item.expectDate}}</span>
                </td>
                <!-- <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;">采购申请单</td>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 3px solid #333;" colspan="3">{{item.applyNums}}</td> -->
            </tr>
            <tr>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;" colspan="2" rowspan="2">审批</td>
<!--                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;">-->
<!--                    <div style="display: flex;align-items: center;vertical-align: middle;">-->
<!--                        <div v-if="item.hasCostApply" style="flex: 1;text-align: center;border-right: 2px solid #333;font-weight:bold;">成本专员审核</div>-->
<!--                        <div style="flex: 1;text-align: center;font-weight:bold;">部门审核</div>-->
<!--                    </div>-->
<!--                </td>-->
<!--                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;">财务审核</td>-->
<!--                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;">总经理</td>-->
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;">出纳</td>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;" colspan="2">领款人签字</td>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 3px solid #333;" colspan="3">备注</td>
            </tr>
            <tr>
<!--                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;">-->
<!--                    <div style="display: flex;align-items: center;vertical-align: middle;">-->
<!--                        <div v-if="item.hasCostApply" style="flex: 1;text-align: center;border-right: 2px solid #333;font-weight:bold;font-size: 12px;"><span class="blueFont">{{item.costApplyName}}</span></div>-->
<!--                        <div style="flex: 1;text-align: center;font-weight:bold;font-size: 12px;"><span class="blueFont">{{item.orgApplyName}}</span></div>-->
<!--                    </div>-->
<!--                </td>-->
<!--                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;"><span class="blueFont">{{item.fcApplyName}}</span></td>-->
<!--                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;"><span class="blueFont">{{item.gmoApplyName}}</span></td>-->
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;"></td>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 2px solid #333;" colspan="2"></td>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 2px solid #333;border-right: 3px solid #333;" colspan="3"></td>
            </tr>
            <tr>
                <td style="height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 3px solid #333;border-right: 2px solid #333;" colspan="2">
                    说明
                </td>
                <td style="position:relative;height: 34px;text-align: center;font-weight:bold;font-size: 12px;border-bottom: 3px solid #333;border-right: 3px solid #333;padding:0 10px;text-align:left;" colspan="6">
                    <span style="line-height: 22px">1、正确填写以上信息，如收款方信息错填而导致错转由请款人负责</span><br>
                    <span style="line-height: 22px">2、业务结束或对应发票到后需填写成本费用报销单核销</span><br>
                    <span style="line-height: 22px">3、所有签名必须自动带出审批日期</span>
                    <span style="position: absolute;right: 20px;bottom:0;">打印次数<span style="margin-left: 10px;color: red;font-size: 50px;">{{item.printTimes+1}}</span></span><br>
                </td>
            </tr>
        </table>
<!--        <table class="verifyTable" width="90%" border="0" cellspacing="0" cellpadding="0" style="">-->
<!--            <tr>-->
<!--                <td>总经理审核</td>-->
<!--                <td>副总经理审核</td>-->
<!--                <td>股东审核</td>-->
<!--                <td>财务审核</td>-->
<!--                <td>物流中心审核</td>-->
<!--                <td>部门审核</td>-->
<!--                <td>成本专员审核</td>-->
<!--                <td style="width:10%;">部门制成</td>-->
<!--            </tr>-->
<!--            <tr>-->
<!--                <td v-for="(subItem, index) in item.verifyList">-->
<!--                    <div v-if="index!=7">-->
<!--                        <span class="blueFont" v-if="subItem">{{subItem.verifyUserName}}&nbsp;{{subItem.verifyDate}}</span>-->
<!--                        <span v-if="!subItem">-</span>-->
<!--                    </div>-->
<!--                    <div v-if="index==7"><span class="blueFont">{{subItem.createUserName}}</span></div>-->
<!--                </td>-->
<!--            </tr>-->
<!--        </table>-->


          <table class="verifyTable" width="90%" border="0" cellspacing="0" cellpadding="0" style="">
            <tr>
              <td v-for="(subItem, index) in item.verifyList">{{subItem.verifyTitle}}审核</td>
              <td style="width:10%;">部门制成</td>
            </tr>
            <tr>
              <td v-for="(subItem, index) in item.verifyList">
                <div>
                  <span class="blueFont" v-if="subItem">{{subItem.verifyUserName}}&nbsp;{{subItem.verifyDate}}</span>
                </div>
              </td>
              <td>
                <div ><span class="blueFont">{{item.createUserName}}</span></div>
              </td>
            </tr>
          </table>
        </div>
        </div>
        <div class="page-bot-btn">
            <el-button @click="print('A5')" type="primary" style="margin-left:10%;">打印A5请款单</el-button>
            <el-button @click="print('A4')" type="primary" style="margin-left:10%;">打印A4请款单</el-button>
        </div>
    </div>
</template>

<script>
import requestFeePrintDetail from './requestFeePrintDetail.js'

export default requestFeePrintDetail
</script>
<style scoped>
#autocompleteId div{
    width: 100%;
}
.mr_20{
    margin: 0 20px;
}
.textAlign div div input{
    text-align: center;
}
.blueFont{
    color: #0379FF;
}
</style>
<style lang="scss" src="./requestFeePrintDetail.scss" scoped></style>
