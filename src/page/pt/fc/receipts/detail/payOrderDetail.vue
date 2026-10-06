<template>
  <div id="payOrderDetail" class="payOrderDetailPage">
      <table class="infoTable" width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;">
        <tr>
          <td colspan="10" class="blueFont">{{info.payTitleName}}</td>
        </tr>
        <tr>
          <td>付款单</td>
          <td colspan="4" class="blueFont">{{info.payNum}}</td>

          <td >单据状态</td>
          <td colspan= "4" style="color: red;">
            <a href="javascript:void(0);" style="color:red;" >{{info.stateName}}</a>
          </td>
        </tr>
        <tr>
            <td>报销部门</td>
            <td class="blueFont">{{info.orgName}}</td>
            <td>供应商账单</td>
            <td class="blueFont" colspan="3">   
                <a href="javascript:void(0);" @click="goto(item)" class="blueFont" v-for="item in info.billNum" v-if="info.billNum && info.billNum.length==1">{{item.billNum}}</a>
                <el-popover
                    placement="bottom"
                    width="200"
                    v-if="info.billNum && info.billNum.length>1"
                    trigger="hover">
                  <div v-for="item in info.billNum" style="text-align:center;border-bottom:1px dashed #eee;line-height: 30px;">
                    <a href="javascript:void(0);" style="font-weight:bold;" @click.stop="goto(item)" class="blueFont">{{item.billNum}}</a>
                  </div>
                  <div class="blueFont" slot="reference" style="padding:0 8px;cursor: pointer;overflow: hidden; white-space: nowrap; text-overflow: ellipsis;text-align: center;">
                    <span v-for="(item, index) in info.billNum">{{item.billNum}}{{ index==info.billNum.length-1 ? '' : ','}}</span>
                  </div>
                </el-popover>
            </td>
            <td>填写日期</td>
            <td class="blueFont" colspan="3">{{info.createDate}}</td>
        </tr>
        <tr>
<!--          <td>注意事项</td>-->
          <td>报销内容</td>
          <td>归集客户</td>
          <td>业务月份</td>
          <td>业务类型</td>
          <td>采购费用申请</td>
          <td>请款单号</td>
          <td>应付金额（元）</td>
          <td>扣款金额（元）</td>
          <td>实付金额（元）</td>
          <td>备注</td>
        </tr>
        <tr>
<!--          <td rowspan="10" class="pd20" style="text-align:left;">-->
<!--            1、按税务需求提供正确发票；<br><br>-->
<!--            2、发票需加盖发票专用章；<br><br>-->
<!--            3、报销内容与支出用途一致；<br><br>-->
<!--            4、请附购买申请单、暂借(付)款单等；<br><br>-->
<!--            5、转账的需提供收款方开户行与账号。<br><br>-->
<!--          </td>-->
          <td class="blueFont">
            {{project1.payProjectName}}
          </td>
          <td class="blueFont">
            {{project1.custName}}
          </td>
          <td class="blueFont">
            {{project1.businessDate}}
          </td>
          <td class="blueFont">
            {{project1.payBizTypeName}}
          </td>
            <td>
              <span style="font-weight: bold;font-size: 14px;" v-for="(item, index) in project1.applyArray" >
                        <a href="javascript:void(0);" @click.stop="clickItem(item, 1)" class="blueFont" v-if="index<1">{{index > 0 ? ',' + item.applyNum : item.applyNum}}</a>
              </span>
              <el-popover
                  placement="bottom"
                  width="200"
                  v-if="project1.applyArray&&project1.applyArray.length>1"
                  trigger="hover">
                <div v-for="(item, index) in project1.applyArray" style="text-align:center;border-bottom:1px dashed #eee;line-height: 30px;">
                  <a href="javascript:void(0);" style="font-weight:bold;" @click.stop="clickItem(item, 1)" class="blueFont">{{item.applyNum}}</a>
                </div>
                <span class="blueFont" slot="reference" style="margin-left: 5px;font-size: 16px;letter-spacing: 2px;cursor: pointer;">...</span>
              </el-popover>
            </td>
          <td>
            <span style="font-weight: bold;font-size: 14px;" v-for="(item, index) in project1.payNums">
              <a href="javascript:void(0);" @click="clickItem(project1.ids[index],2)" class="blueFont" v-if="index<1">{{item}}</a>
            </span>
            <el-popover
                placement="bottom"
                width="200"
                v-if="project1.payNums&&project1.payNums.length>1"
                trigger="hover">
                <div v-for="(item, index) in project1.payNums" style="text-align:center;border-bottom:1px dashed #eee;line-height: 30px;">
                    <a href="javascript:void(0);" style="font-weight:bold;" @click="clickItem(project1.ids[index],2)" class="blueFont">{{item}}</a>
                </div>
                <span class="blueFont" slot="reference" style="margin-left: 3px;font-size: 16px;letter-spacing: 2px;cursor: pointer;">...</span>
            </el-popover>
          </td>
          <td class="blueFont">
            {{project1.mustPayFee}}
          </td>
          <td class="blueFont">
            {{project1.deduction}}
          </td>
          <td class="blueFont">
            {{project1.payFee}}
          </td>
          <td class="blueFont">
            {{project1.payRemark}}
          </td>
        </tr>
        <tr>
          <td class="blueFont">
            {{project2.payProjectName}}
          </td>
          <td class="blueFont">
            {{project2.custName}}
          </td>
          <td class="blueFont">
            {{project2.businessDate}}
          </td>
          <td class="blueFont">
            {{project2.payBizTypeName}}
          </td>
            <td>                
              <span style="font-weight: bold;font-size: 14px;" v-for="(item, index) in project2.applyArray" >
                        <a href="javascript:void(0);" @click.stop="clickItem(item, 1)" class="blueFont" v-if="index<1">{{index > 0 ? ',' + item.applyNum : item.applyNum}}</a>
              </span>
              <el-popover
                  placement="bottom"
                  width="200"
                  v-if="project2.applyArray&&project2.applyArray.length>1"
                  trigger="hover">
                <div v-for="(item, index) in project2.applyArray" style="text-align:center;border-bottom:1px dashed #eee;line-height: 30px;">
                  <a href="javascript:void(0);" style="font-weight:bold;" @click.stop="clickItem(item, 1)" class="blueFont">{{item.applyNum}}</a>
                </div>
                <span class="blueFont" slot="reference" style="margin-left: 5px;font-size: 16px;letter-spacing: 2px;cursor: pointer;">...</span>
              </el-popover>
            </td>
          <td>
            <span style="font-weight: bold;font-size: 14px;" v-for="(item, index) in project2.payNums">
              <a href="javascript:void(0);" @click="clickItem(project2.ids[index],2)" class="blueFont" v-if="index<1">{{item}}</a>
            </span>
            <el-popover
                placement="bottom"
                width="200"
                v-if="project2.payNums&&project2.payNums.length>1"
                trigger="hover">
                <div v-for="(item, index) in project2.payNums" style="text-align:center;border-bottom:1px dashed #eee;line-height: 30px;">
                    <a href="javascript:void(0);" style="font-weight:bold;" @click="clickItem(project2.ids[index],2)" class="blueFont">{{item}}</a>
                </div>
                <span class="blueFont" slot="reference" style="margin-left: 3px;font-size: 16px;letter-spacing: 2px;cursor: pointer;">...</span>
            </el-popover>
          </td>
          <td class="blueFont">
            {{project2.mustPayFee}}
          </td>
          <td class="blueFont">
            {{project2.deduction}}
          </td>
          <td class="blueFont">
            {{project2.payFee}}
          </td>
          <td class="blueFont">
            {{project2.payRemark}}
          </td>
        </tr>
        <tr>
          <td class="blueFont">
            {{project3.payProjectName}}
          </td>
          <td class="blueFont">
            {{project3.custName}}
          </td>
          <td class="blueFont">
            {{project3.businessDate}}
          </td>
          <td class="blueFont">
            {{project3.payBizTypeName}}
          </td>
            <td>
              <span style="font-weight: bold;font-size: 14px;" v-for="(item, index) in project3.applyArray" >
                        <a href="javascript:void(0);" @click.stop="clickItem(item, 1)" class="blueFont" v-if="index<1">{{index > 0 ? ',' + item.applyNum : item.applyNum}}</a>
              </span>
              <el-popover
                  placement="bottom"
                  width="200"
                  v-if="project3.applyArray&&project3.applyArray.length>1"
                  trigger="hover">
                <div v-for="(item, index) in project3.applyArray" style="text-align:center;border-bottom:1px dashed #eee;line-height: 30px;">
                  <a href="javascript:void(0);" style="font-weight:bold;" @click.stop="clickItem(item, 1)" class="blueFont">{{item.applyNum}}</a>
                </div>
                <span class="blueFont" slot="reference" style="margin-left: 5px;font-size: 16px;letter-spacing: 2px;cursor: pointer;">...</span>
              </el-popover>
            </td>
          <td>
            <span style="font-weight: bold;font-size: 14px;" v-for="(item, index) in project3.payNums">
              <a href="javascript:void(0);" @click="clickItem(project3.ids[index],2)" class="blueFont" v-if="index<1">{{item}}</a>
            </span>
            <el-popover
                placement="bottom"
                width="200"
                v-if="project3.payNums&&project3.payNums.length>1"
                trigger="hover">
                <div v-for="(item, index) in project3.payNums" style="text-align:center;border-bottom:1px dashed #eee;line-height: 30px;">
                    <a href="javascript:void(0);" style="font-weight:bold;" @click="clickItem(project3.ids[index],2)" class="blueFont">{{item}}</a>
                </div>
                <span class="blueFont" slot="reference" style="margin-left: 3px;font-size: 16px;letter-spacing: 2px;cursor: pointer;">...</span>
            </el-popover>
          </td>
          <td class="blueFont">
            {{project3.mustPayFee}}
          </td>
          <td class="blueFont">
            {{project3.deduction}}
          </td>
          <td class="blueFont">
            {{project3.payFee}}
          </td>
          <td class="blueFont">
            {{project3.payRemark}}
          </td>
        </tr>
        <tr>
          <td colspan="3">合&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;计</td>
          <!-- <td colspan="7" class="blueFont">￥{{ info.payFee}}</td> -->
          <td colspan="3"></td>
          <td class="blueFont">￥{{ info.mustPayFee}}</td>
          <td class="blueFont">￥{{ info.deduction}}</td>
          <td class="blueFont">￥{{ info.payFee}}</td>
          <td></td>
        </tr>
        <tr>
          <td colspan="10" class="pd20">
            <div>金额大写：
              <span class="blueFont" style="margin: 0 2% 0 9%">{{chineseMoney[8]}}</span>佰
              <span class="blueFont" style="margin: 0 2% 0">{{chineseMoney[7]}}</span>拾
              <span class="blueFont" style="margin: 0 2% 0">{{chineseMoney[6]}}</span>万
              <span class="blueFont" style="margin: 0 2% 0">{{chineseMoney[5]}}</span>仟
              <span class="blueFont" style="margin: 0 2% 0">{{chineseMoney[4]}}</span>佰
              <span class="blueFont" style="margin: 0 2% 0">{{chineseMoney[3]}}</span>拾
              <span class="blueFont" style="margin: 0 2% 0">{{chineseMoney[2]}}</span>元
              <span class="blueFont" style="margin: 0 2% 0">{{chineseMoney[1]}}</span>角
              <span class="blueFont" style="margin: 0 2% 0">{{chineseMoney[0]}}</span>分
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="10" class="pd20">
            <div class="fl">暂借（付）款：<span class="blueFont">{{ info.borrowFee }}</span>元</div>
            <div class="fr">应补（退）金额：<span class="blueFont">{{ info.actualPayFee }}</span>元</div>
          </td>
        </tr>
        <tr>
          <td colspan="10" class="pd20">
            <div class="fl" style="width:37%">
              付款方式：
              <el-radio-group v-model="info.payType" disabled>
                <el-radio v-for="it of payTypeOptions" :key="it.codeValue" :label="it.codeValue">
                  {{it.codeName}}
                </el-radio>
              </el-radio-group>
            </div>
            <div class="fl" style="margin-left:30px;">
              预计支付日期：<span class="blueFont">{{ info.expectDate}}</span>
            </div>
            <div class="fr" style="margin-right:9%;">
              出纳盖章处
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="5" class="pd20" style="width:100%;">
            <div class="fl">收款方全称：<span class="blueFont">{{ info.bankAccountName }}</span>
            </div>
          </td>
            <td colspan="5" class="pd20" style="width:100%;">
                <div class="fr" style="width:100%;">开户行：<span class="blueFont">{{ info.bankDeposit }}</span>
                </div>
            </td>
        </tr>
        <tr>
          <td colspan="5" class="pd20" style="width:100%;">
            <div class="fl">账号：<span class="blueFont">{{ info.bankCard }}</span>
            </div>
          </td>
            <td colspan="5" class="pd20" style="width:100%;">
                <div class="fr" style="width:100%;">经办人：<span class="blueFont">{{ info.payee }}</span></div>
            </td>
        </tr>
        <tr>
          <td colspan="5" class="pd20" style="width:100%;">
            <div class="fl">合同编号：<a href="javascript:void(0);" @click.stop="viewContractReview(info)" class="blueFont">{{info.contractName}}</a>
            </div>
          </td>
          <td colspan="5" class="pd20" style="width:100%;">
            <div class="fr" style="width:100%;">付款条件：<span class="blueFont">{{info.accountPeriodAllName}}</span></div>
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
          <div ><span class="blueFont">{{info.createUserName}}</span></div>
        </td>
      </tr>
    </table>

      <div v-show="type == 3" style="display: flex;background: #fff;padding: 10px 20px 10px;border: 1px solid #e8e8e8;align-items: center;">
          <div style="width: 70px;text-align: right;margin-right: 10px;"><em>*</em>审核备注：</div>
          <el-input v-model="verifyRemark" style="border: 1px solid #efefef;flex: 1;" placeholder="请输入不通过原因"></el-input>
      </div>

    <div class="uploadFile clearfix" style="border-top:none;">
      <div class="fileListView">
        <div class="fileView">
          <div class="label">发票附件：</div>
          <my-simple-file-model-list ref="invoiceNum" :disabled="true"></my-simple-file-model-list>
        </div>
        <div class="fileView">
          <div class="otherFile">
            <div class="label">其他附件：</div>
            <my-simple-file-model-list ref="other" :disabled="true"></my-simple-file-model-list>
            <em class="tip fw">此处不能为发票</em>
          </div>
        </div>
      </div>
    </div>
    <div class="page-bot-btn" style="margin: 15px 0;margin-top:40px;">
      <!-- 0 查看 3 审核 4 打印 -->
      <el-button v-show="type == 0 || type == 3" @click="closePage">关闭</el-button>
      <el-button v-show="type == 3" type="danger" @click="verifyRequestFee(2)">不通过</el-button>
      <el-button v-show="type == 3" type="primary" @click="verifyRequestFee(1)">通过</el-button>
    </div>
  </div>
</template>

<script>
import payOrderDetail from './payOrderDetail.js'
export default payOrderDetail
</script>
<style lang="scss" src="./payOrderDetail.scss" scoped>
</style>
<style lang="scss" scoped>
.mr_20{
  margin: 0 20px;
}
.redFont{
  color: red;
}
.blueFont{
  color: #0379FF;;
}
.payOrderDetailPage{
  .uploadFile{
    padding:0;
    .fileListView{
      .fileView{
        padding:20px;
        &:last-child{
          border-left: $border;
        }
        /deep/ .fileList{
          margin:0 0 0 10px!important;
        }
      }
    }
  }
}
</style>
