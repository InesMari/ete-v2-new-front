<template>
    <div id="requestFeeDetail" class="requestFeeDetailPage">
        <table class="infoTable" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td colspan="8" class="blueFont">{{request.payTitleName}}</td>
            </tr>
            <tr>
                <td colspan="2">请款单</td>
                <td colspan= "3" class="blueFont">{{request.payNum}}</td>

                <td >单据状态</td>
                <td colspan= "2" style="color: red;">
                    <a href="javascript:void(0);" style="color:red;" >{{request.stateName}}</a>
                </td>
            </tr>
            <tr>
                <td colspan="2">请款部门</td>
                <td class="blueFont" style="width: 16%">{{request.orgName}}</td>
                <td>请款人</td>
                <td class="blueFont">{{request.createUserName}}</td>
                <td>请款日期</td>
                <td class="blueFont" colspan="2">{{request.createDate}}</td>
            </tr>
            <tr>
                <td rowspan="3" colspan="2">用途</td>
                <td colspan="3">
                    <span class="blueFont">{{request.payProjectName}}</span>
                </td>
                <td colspan="3" style="width: 40%">账户信息（正确填写）</td>
            </tr>
            <tr>
                <td colspan="3" rowspan="2" style="width: 50%">
                    <span class="blueFont">{{request.payRemark}}</span>
                </td>
                <td>收款方全称</td>
                <td colspan="2">
                    <span class="blueFont">{{request.bankAccountName}}</span>
                </td>
            </tr>
            <tr>
                <td>开户行</td>
                <td colspan="2">
                    <span class="blueFont">{{request.bankDeposit}}</span>
                </td>
            </tr>
            <tr>
                <td rowspan="2">请款金额</td>
                <td>小写</td>
                <td colspan="3">
                    <span class="blueFont">￥{{request.payFee}}</span>
                </td>
                <td>账号</td>
                <td colspan="2">
                    <span class="blueFont">{{request.bankCard}}</span>
                </td>
            </tr>
            <tr>
                <td>大写</td>
                <td colspan="3">
                    <span class="blueFont" style="margin: 0 2% 0" >{{moneyArray[8]}}</span>佰
                    <span class="blueFont" style="margin: 0 2% 0" >{{moneyArray[7]}}</span>拾
                    <span class="blueFont" style="margin: 0 2% 0" >{{moneyArray[6]}}</span>万
                    <span class="blueFont" style="margin: 0 2% 0" >{{moneyArray[5]}}</span>仟
                    <span class="blueFont" style="margin: 0 2% 0" >{{moneyArray[4]}}</span>佰
                    <span class="blueFont" style="margin: 0 2% 0" >{{moneyArray[3]}}</span>拾
                    <span class="blueFont" style="margin: 0 2% 0" >{{moneyArray[2]}}</span>元
                    <span class="blueFont" style="margin: 0 2% 0" >{{moneyArray[1]}}</span>角
                    <span class="blueFont" style="margin: 0 2% 0" >{{moneyArray[0]}}</span>分
                </td>
                <td>联系人</td>
                <td colspan="2">
                    <span class="blueFont">{{request.bankLinkman}}</span>
                </td>
            </tr>
            <tr>
                <td colspan="2">支付方式</td>
                <td colspan="3">
                    <el-radio-group v-model="request.payType" disabled>
                        <el-radio :label="item.codeValue" v-for="item in payTypeData">{{item.codeName}}</el-radio>
                    </el-radio-group>
                </td>
                <td>电话</td>
                <td colspan="2">
                    <span class="blueFont">{{request.bankPhone}}</span>
                </td>
            </tr>
            <tr>
                <td colspan="2">预计核销日期</td>
                <td colspan="2">
                    <span class="blueFont">{{request.expectDate}}</span>
                </td>
                <td>采购费用申请</td>
                <td colspan="3">
                    <span v-for="(item, index) in request.applyArray">
                        <a href="javascript:void(0);" @click.stop="clickItem(item, index)" class="blueFont" v-if="index<3">{{index > 0 ? ',' + item.applyNum : item.applyNum}}</a>
                    </span>
                    <el-popover
                        placement="bottom"
                        width="200"
                        v-if="request.applyArray.length>3"
                        trigger="hover">
                        <div v-for="(item, index) in request.applyArray" style="text-align:center;border-bottom:1px dashed #eee;line-height: 30px;">
                            <a href="javascript:void(0);" style="font-weight:bold;" @click.stop="clickItem(item, index)" class="blueFont">{{item.applyNum}}</a>
                        </div>
                        <span class="blueFont" slot="reference" style="margin-left: 5px;font-size: 16px;letter-spacing: 2px;cursor: pointer;">...</span>
                    </el-popover>
                </td>
            </tr>
            <tr>
              <td colspan="2">合同编号</td>
              <td colspan="2">
                <a href="javascript:void(0);" @click.stop="viewContractReview(request)" class="blueFont">{{request.contractName}}</a>
              </td>
              <td>付款条件</td>
              <td colspan="3">
                <span class="blueFont">{{request.accountPeriodAllName}}</span>
              </td>
            </tr>
            <tr>
                <td colspan="2" rowspan="2" style="width: 10%">审批</td>
<!--                <td style="width: 16%">-->
<!--                    <div class="flexTd">-->
<!--                        <div v-if="request.hasCostApply">成本专员审核</div>-->
<!--                        <div>部门审核</div>-->
<!--                    </div>-->
<!--                </td>-->
<!--                <td style="width: 16%">财务审核</td>-->
<!--                <td style="width: 16%">总经理</td>-->
                <td style="width: 8%">出纳</td>
                <td style="width: 16%">领款人签字</td>
                <td style="width: 16%" colspan="4">备注</td>
            </tr>
            <tr>
<!--                <td>                 -->
<!--                    <div class="flexTd">-->
<!--                        <div v-if="request.hasCostApply"><span class="blueFont">{{type == 4 ? request.costApplyName : request.costApply}}</span></div>-->
<!--                        <div><span class="blueFont">{{type == 4 ? request.orgApplyName : request.orgApply}}</span></div>-->
<!--                    </div>-->
<!--                </td>-->
<!--                <td><span class="blueFont">{{type == 4 ? request.fcApplyName : request.fcApply}}</span></td>-->
<!--                <td><span class="blueFont">{{type == 4 ? request.gmoApplyName : request.gmoApply}}</span></td>-->
                <td></td>
                <td></td>
                <td colspan="4"></td>
            </tr>
            <tr>
                <td colspan="2">说明</td>
                <td colspan="6" style="padding:10px 20px;text-align:left;">
                    <span style="line-height: 22px">1、正确填写以上信息，如收款方信息错填而导致错转由请款人负责</span><br>
                    <span style="line-height: 22px">2、业务结束或对应发票到后需填写成本费用报销单核销</span><br>
                    <span style="line-height: 22px">3、所有签名必须自动带出审批日期</span>
                    <span style="float: right;margin-right: 20px;" v-show="type == 4 && request.state == stateEnumData.PRINTED">打印次数<span style="margin-left: 10px;color: red">{{request.printTimes}}</span></span><br>
                </td>
            </tr>
        </table>
      
        <table class="verifyTable" width="100%" border="0" cellspacing="0" cellpadding="0" style="">
            <tr>
              <td v-for="(subItem, index) in verifyList">{{subItem.verifyTitle}}审核</td>
                <td style="width:10%;">部门制成</td>
            </tr>
            <tr>
                <td v-for="(subItem, index) in verifyList">
                    <div>
                        <span class="blueFont" v-if="subItem">{{subItem.verifyUserName}}&nbsp;{{subItem.verifyDate}}</span>
                    </div>
                </td>
                <td>
                  <div ><span class="blueFont">{{request.createUserName}}</span></div>
                </td>
            </tr>
        </table>

        <div v-show="type == 3" style="display: flex;background: #fff;padding: 10px 20px 10px;border: 1px solid #e8e8e8;border-bottom:none;align-items: center;">
            <div style="width: 70px;text-align: right;margin-right: 10px;"><em>*</em>审核备注：</div>
            <el-input v-model="verifyRemark" style="border: 1px solid #efefef;flex: 1;" placeholder="请输入不通过原因"></el-input>
        </div>

        <div class="uploadFile clearfix" v-show="type != 4 && request.list.length > 0" style="border-top:none;">
            <div class="fileListView">
                <div class="fileView">
                    <div class="otherFile">
                        <div class="label">附件：</div>
                        <my-simple-file-model-list ref="other" :disabled="true"></my-simple-file-model-list>
                    </div>
                </div>
            </div>
        </div>
        <div class="page-bot-btn" style="margin: 15px 0;">
            <!-- 0 查看 3 审核 4 打印 -->
            <el-button v-show="type == 0 || type == 3" @click="closePage">关闭</el-button>
            <el-button v-show="type == 3" type="danger" @click="verifyRequestFee(2)">不通过</el-button>
            <el-button v-show="type == 3" type="primary" @click="verifyRequestFee(1)">通过</el-button>
        </div>
    </div>
</template>

<script>
import requestFeeDetail from './requestFeeDetail.js'

export default requestFeeDetail
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
<style lang="scss" src="./requestFeeDetail.scss" scoped></style>
