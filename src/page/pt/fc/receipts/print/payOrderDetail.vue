<template>
  <div id="payOrderDetail" class="payOrderDetailPage">
      <div id="printTable" style="background:#fff;padding-right:20px;">
        <div class="A5H" v-for="(item,index) in payOrderDatas" :key="index" :class="index%2==0?'A5bottom':''">
        <div style="height: 20px;line-height: 1;font-weight:bold;text-align: center;font-size: 20px;width:90%;margin-left:10%;padding:29px 0 9px;position:relative;">
          {{ item.payTitleName }}
          <div style="position:absolute;top:30px;right:0;font-weight:bold;font-size:24px;letter-spacing: 8px;" v-show="item.payType==3">核销</div>
        </div>
        <div style="height: 30px;line-height: 30px;font-weight:bold;text-align: center;font-size: 18px;width:90%;margin-left:10%;">付 款 单</div>
        <div style="height: 30px;line-height: 30px;font-size: 12px;margin-left:10%;font-weight: bold;text-align: left;">单据编码：<span class="blueFont">{{item.payNum}}</span></div>
          <table class="infoTable" style="background: #fff;border-top:3px solid #333333;border-left: 3px solid #333333;table-layout: fixed;margin-left:10%;" width="90%" border="0" cellspacing="0" cellpadding="0">
        <!-- <tr>
          <td width="1000" style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;" colspan="6">广东易迁易物流科技有限公司</td>
        </tr>
        <tr>
          <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;" colspan="6">付款单</td>
        </tr> -->
        <tr>
            <td>
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 3px solid #333333;padding:0 20px;" class="pd20">
                        <div style="float:left;" class="fl">报销部门：<span class="blueFont">{{ item.orgName }}</span></div>
                        <div style="float:right;" class="fr">填写日期：<span class="blueFont">{{ item.createDate }}</span></div>
                      </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td>
                <table style="table-layout: fixed;" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <!-- width总和660 -->
<!--                      <td width="130" style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;">注意事项</td>-->
                      <td width="100" style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;">报销内容</td>
                      <td width="100" style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;">归集客户</td>
                      <td width="70" style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;">业务月份</td>
                      <td width="70" style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;">业务类型</td>
                      <td width="60" style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;">应付金额</td>
                      <td width="60" style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;">扣款金额</td>
                      <td width="60" style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;">实付金额</td>
                      <td width="185" style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 3px solid #333333;">备注</td>
                    </tr>
                    <tr>
<!--                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 3px solid #333333;border-right: 2px solid #333333;text-align:left;padding:0 10px;" rowspan="9" class="pd20">-->
<!--                        <br>-->
<!--                        1、按税务需求提供正确发票；<br><br>-->
<!--                        2、发票需加盖发票专用章；<br><br>-->
<!--                        3、报销内容与支出用途一致；<br><br>-->
<!--                        4、请附购买申请单、暂借(付)款单等；<br><br>-->
<!--                        5、转账的需提供收款方开户行与账号。<br><br><br><br>-->
<!--                        <span v-show="item.printTimes>=1">当前打印次数：<span style="margin-left: 10px;color: red;font-size: 50px;">{{item.printTimes+1}}</span></span><br>-->
<!--                      </td>-->
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;" class="blueFont">
                        {{item.project1.payProjectName}}
                      </td>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;" class="blueFont">
                        {{item.project1.custName}}
                      </td>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;" class="blueFont">
                        {{item.project1.businessDate}}
                      </td>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;" class="blueFont">
                        {{item.project1.payBizTypeName}}
                      </td>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;" class="blueFont">
                        {{item.project1.mustPayFee}}
                      </td>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;" class="blueFont">
                        {{item.project1.deduction}}
                      </td>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;" class="blueFont">
                        {{item.project1.payFee}}
                      </td>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 3px solid #333333;" class="blueFont">
                        {{item.project1.payRemark}}
                      </td>
                    </tr>
                    <tr>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;" class="blueFont">
                        {{item.project2.payProjectName}}
                      </td>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;" class="blueFont">
                        {{item.project2.custName}}
                      </td>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;" class="blueFont">
                        {{item.project2.businessDate}}
                      </td>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;" class="blueFont">
                        {{item.project2.payBizTypeName}}
                      </td>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;" class="blueFont">
                        {{item.project2.mustPayFee}}
                      </td>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;" class="blueFont">
                        {{item.project2.deduction}}
                      </td>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;" class="blueFont">
                        {{item.project2.payFee}}
                      </td>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 3px solid #333333;" class="blueFont">
                        {{item.project2.payRemark}}
                      </td>
                    </tr>
                    <tr>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;" class="blueFont">
                        {{item.project3.payProjectName}}
                      </td>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;" class="blueFont">
                        {{item.project3.custName}}
                      </td>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;" class="blueFont">
                        {{item.project3.businessDate}}
                      </td>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;" class="blueFont">
                        {{item.project3.payBizTypeName}}
                      </td>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;" class="blueFont">
                        {{item.project3.mustPayFee}}
                      </td>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;" class="blueFont">
                        {{item.project3.deduction}}
                      </td>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;" class="blueFont">
                        {{item.project3.payFee}}
                      </td>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 3px solid #333333;" class="blueFont">
                        {{item.project3.payRemark}}
                      </td>
                    </tr>
                    <tr>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;" colspan="4">合&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;计</td>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;" class="blueFont">￥{{ item.mustPayFee}}</td>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;" class="blueFont">￥{{ item.deduction}}</td>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;" class="blueFont">￥{{ item.payFee}}</td>
                      <td style="border-bottom: 2px solid #333333;border-right: 3px solid #333333;"></td>
                    </tr>
                    <tr>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 3px solid #333333;padding:0 20px;" colspan="8" class="pd20">
                        <div>金额大写：
                            <span class="blueFont" style="margin: 0 2% 0 9%">{{item.chineseMoney[8]}}</span>佰
                            <span class="blueFont" style="margin: 0 2% 0">{{item.chineseMoney[7]}}</span>拾
                            <span class="blueFont" style="margin: 0 2% 0">{{item.chineseMoney[6]}}</span>万
                            <span class="blueFont" style="margin: 0 2% 0">{{item.chineseMoney[5]}}</span>仟
                            <span class="blueFont" style="margin: 0 2% 0">{{item.chineseMoney[4]}}</span>佰
                            <span class="blueFont" style="margin: 0 2% 0">{{item.chineseMoney[3]}}</span>拾
                            <span class="blueFont" style="margin: 0 2% 0">{{item.chineseMoney[2]}}</span>元
                            <span class="blueFont" style="margin: 0 2% 0">{{item.chineseMoney[1]}}</span>角
                            <span class="blueFont" style="margin: 0 2% 0">{{item.chineseMoney[0]}}</span>分
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 3px solid #333333;padding:0 20px;" colspan="8" class="pd20">
                        <div style="float:left;" class="fl">暂借（付）款：<span class="blueFont">{{ item.borrowFee }}</span>元</div>
                        <div style="float:right;" class="fr">应补（退）金额：<span class="blueFont">{{ item.actualPayFee }}</span>元</div>
                      </td>
                    </tr>
                    <tr>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 3px solid #333333;padding:0 20px;" colspan="8" class="pd20">
                        <div class="fl" style="float:left;width:48%;text-align:left;line-height:30px;">
                          <span style="float:left;line-height:1;margin-top:5px;">付款方式：</span>
                          <div style="float:left;margin-top:5px;">
                            <div style="float:left;display:inline-block;width:12px;height:12px;font-size:12px;border:1px solid #333;text-align: center;line-height:1;border-radius:3px;"><span v-show="item.payType==1">√</span></div>
                            <span style="float:left;margin:0 5px 0 3px;line-height:1;">现金</span>
                            <div style="float:left;display:inline-block;width:12px;height:12px;font-size:12px;border:1px solid #333;text-align: center;line-height:1;border-radius:3px;"><span v-show="item.payType==2">√</span></div>
                            <span style="float:left;margin:0 5px 0 3px;line-height:1;">银行转账</span>
                            <div style="float:left;display:inline-block;width:12px;height:12px;font-size:12px;border:1px solid #333;text-align: center;line-height:1;border-radius:3px;"><span v-show="item.payType==3">√</span></div>
                            <span style="float:left;margin:0 5px 0 3px;line-height:1;">核销</span>
                          </div>
                          <!-- <label style="margin-right:5px;"><input type="checkbox" style="vertical-align: text-bottom;margin: 0 3px 0 0;" /><span style="vertical-align: middle;">现金</span></label>
                          <label style="margin-right:5px;"><input type="checkbox" style="vertical-align: text-bottom;margin: 0 3px 0 0;" /><span style="vertical-align: middle;">银行转账</span></label>
                          <label style="margin-right:5px;"><input type="checkbox" style="vertical-align: text-bottom;margin: 0 3px 0 0;" /><span style="vertical-align: middle;">其他</span></label> -->
                          <!-- <el-checkbox-group v-model="item.payType" style="display:inline-block;">
                            <el-checkbox>现金</el-checkbox>
                            <el-checkbox>银行转账</el-checkbox>
                            <el-checkbox>其他</el-checkbox>
                          </el-checkbox-group> -->
                          <!-- <span class="blueFont" v-if="item.payType==1">现金</span>
                          <span class="blueFont" v-if="item.payType==2">银行转账</span>
                          <span class="blueFont" v-if="item.payType==3">其他</span> -->
                        </div>
                        <div class="fl" style="float:left;text-align:left;line-height:1;margin-top:5px;">
                          预计支付日期：<span class="blueFont">{{ item.expectDate}}</span>
                        </div>
                        <div class="fr" style="float:right;margin-right:9%;text-align:left;line-height:1;margin-top:5px;">
                          出纳盖章处
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 2px solid #333333;padding:0 20px;" colspan="4" class="pd20">
                        <div class="fl" style="width:100%;float:left;text-align:left;line-height:30px;">收款方全称：<span class="blueFont">{{ item.bankAccountName }}</span>
                        </div>
            <!--            <div class="fr" style="width:52%;float:right;text-align:left;line-height:30px;">开户行：<span class="blueFont">{{ item.bankDeposit }}</span>-->
            <!--            </div>-->
                      </td>
                        <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 2px solid #333333;border-right: 3px solid #333333;padding:0 20px;" colspan="4" class="pd20">
            <!--                <div class="fl" style="width:48%;float:left;text-align:left;line-height:30px;">收款方全称：<span class="blueFont">{{ item.bankAccountName }}</span>-->
            <!--                </div>-->
                            <div class="fr" style="width:100%;float:right;text-align:left;line-height:30px;">开户行：<span class="blueFont">{{ item.bankDeposit }}</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                      <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 3px solid #333333;border-right: 2px solid #333333;padding:0 20px;" colspan="4" class="pd20">
                        <div class="fl" style="width:100%;float:left;text-align:left;line-height:30px;">账号：<span class="blueFont">{{ item.bankCard }}</span>
                        </div>
            <!--            <div class="fr" style="width:52%;float:right;text-align:left;line-height:30px;">领款人：<span class="blueFont">{{ item.payee }}</span></div>-->
                      </td>
                        <td style="height: 30px;text-align: center;font-weight: bold;font-size: 12px;border-bottom: 3px solid #333333;border-right: 3px solid #333333;padding:0 20px;" colspan="4" class="pd20">
            <!--                <div class="fl" style="width:48%;float:left;text-align:left;line-height:30px;">账号：<span class="blueFont">{{ item.bankCard }}</span>-->
            <!--                </div>-->

                          <div class="fl" style="float:left;text-align:left;line-height:1;margin-top:5px;">
                            经办人：<span class="blueFont">{{ item.payee}}</span>
                          </div>
                          <div class="fr" style="float:right;text-align:left;line-height:1;margin-top:-2px;" v-show="item.printTimes>=1">
                            当前打印次数：<span style="margin-left: 10px;color: red;font-size: 23px;">{{item.printTimes+1}}</span>
                          </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
      </table>
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
      <el-button @click="print('A5')" type="primary" style="margin-left:10%;">打印A5付款单</el-button>
      <el-button @click="print('A4')" type="primary" style="margin-left:10%;">打印A4付款单</el-button>
    </div>
  </div>
</template>

<script>
import payOrderDetail from './payOrderDetail.js'
export default payOrderDetail
</script>
<style scoped>
.mr_20{
  margin: 0 20px;
}
.redFont{
  color: red;
}
.blueFont{
  color: #0379FF;;
}
</style>
<style lang="scss" src="./payOrderDetail.scss" scoped>
</style>
