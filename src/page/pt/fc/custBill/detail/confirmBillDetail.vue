<template>
    <div id="confirmBillDetail" class="fcCommonPage">
        <div class="tagList clearfix">
            <div class="tag" style="width:30%;">
                <div class="tip"><span>客户</span></div>
                <h3 class="title">基本信息</h3>
                <div class="flexBox">             
                    <div class="contet">
                        <div class="item">
                            <div class="label">账单编号：</div>
                            <div class="text fw">{{ bill.billNum }}</div>
                        </div>
                        <div class="item">
                            <div class="label">客户名称：</div>
                            <div class="text fw">{{ bill.tenantName }}</div>
                        </div>
                        <div class="item">
                            <div class="label"><em>*</em>对账客户：</div>
                            <div class="text fw">{{ bill.custTenantName }}</div>
                        </div>
                        <div class="item">
                            <div class="label"><em>*</em>账单月份：</div>
                            <div class="text fw">{{ bill.billMonth }}</div>
                        </div>
                        <div class="item">
                            <div class="label">账单状态：</div>
                            <div class="text fw">{{ bill.confirmStateName }}</div>
                        </div>
                        <div class="item">
                            <div class="label">账单备注：</div>
                            <div class="text fw">{{ bill.remark }}</div>
                        </div>
                      <div class="item">
                        <div class="label">结算主体：</div>
                        <div class="text fw">{{ bill.settleBodyName }}</div>
                      </div>
                    </div>
                </div>
            </div>
            <div class="tag" style="width: 18%;">
                <div class="tip"><span>账单</span></div>
                <h3 class="title">账单金额</h3>
                <h5 class="cash">￥{{ bill.totalFee }} 元</h5>
                <div class="flexBox">             
                    <div class="contet center">
                        <div class="item">
                            <div class="label fw">运输金额：</div>
                            <div class="text">￥{{ bill.waybillFee }}元</div>
                        </div>
                        <div class="item">
                            <div class="label fw">仓储金额：</div>
                            <div class="text">￥{{ bill.storehouseFee }}元</div>
                        </div>
                        <div class="item">
                          <div class="label fw">其他金额：</div>
                          <div class="text">￥{{ bill.otherFee }}元</div>
                        </div>
                        <div class="item">
                            <div class="label fw">器具金额：</div>
                            <div class="text">￥{{ bill.packLeaseFee }}元</div>
                        </div>
                        <div class="item">
                            <div class="label fw">补录金额：</div>
                            <div class="text">￥{{ bill.makeupFee }}元</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tag" style="width: 18%;">
                <div class="tip"><span>发票</span></div>
                <h3 class="title">发票金额</h3>
                <div class="flexBox">             
                    <div class="contet center">
                        <div class="item">
                            <div class="label fw">已申请金额：</div>
                            <div class="text">￥{{ bill.applyInvoiceFee }}元</div>
                        </div>
                        <div class="item">
                            <div class="label fw">未申请金额：</div>
                            <div class="text">￥{{ bill.noApplyInvoiceFee }}元</div>
                        </div>
                        <div class="item">
                            <div class="label fw">已开具金额：</div>
                            <div class="text">￥{{ bill.issueInvoiceFee }}元</div>
                        </div>
                        <div class="item">
                            <div class="label fw">未开具金额：</div>
                            <div class="text">￥{{ bill.noIssueInvoiceFee }}元</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tag" style="width: 18%;">
                <div class="tip"><span>应收</span></div>
                <h3 class="title">应收金额</h3>
                <h5 class="cash">￥{{ bill.receivableFee }} 元</h5>
                <div class="definite">
                    <div class="label">已收款</div>
                    <div class="text">￥ {{ bill.receivedFee }}  元</div>
                </div>
                <div class="definite">
                    <div class="label" style="background: #1990ff">未收款</div>
                    <div class="text">￥ {{ bill.noReceiveFee }}  元</div>
                </div>
            </div>
            <div class="tag" style="width: 16%;">
                <div class="tip"><span>附件</span></div>c
                <table>
                    <tr>
                        <td><div class="label" style="font-size: 14px;font-weight: bold;">对账单附件：</div></td>
                        <td><myFileModel class="myfilemodel fl" :disabledEdit="true" :disabledDel="true" ref="attach"></myFileModel></td>
                    </tr>
                    <tr>
                        <td><div class="label" style="font-size: 14px;font-weight: bold;">回单附件：</div></td>
                        <td><myFileModel class="myfilemodel fl" :disabledEdit="true" :disabledDel="true" ref="receipt"></myFileModel></td>
                    </tr>
                </table>
            </div>

        </div>
        <div class="table-content" style="margin:0;">
          <myFileModel ref="img" style="width:0; height:0; overflow:hidden" @successCallback="successCallback" ></myFileModel>
          <div class="table-title">
                <div class="tab-title clearfix">
                    <div class="tab" :class="{'active':tab.active}" @click="changeTab(tab)" v-show="tab.show" v-for="(tab,index) in tabs" :key="index">{{ tab.name }}</div>
                </div>
                <div class="table-title-btn">
                    <el-button type="primary" plain size="mini" @click="toOrderDetail(false)" v-show="showGotoDetail">查看详情</el-button>
                    <el-button type="primary" plain size="mini" @click="downloadWaybill()" v-show="showGotoDetail">导出运单</el-button>
                    <el-button type="primary" plain size="mini" @click="download()">导出EXCEL</el-button>
                </div>
            </div>
            <simpleTable ref="table" tableName="billDetailTable" :head="head" :data="tableData" @dblclickItem="dblclickItem" :singleSelect="true">
              <template v-slot="{item,code}">
                <div v-if="code=='fileName'">
                  <a href="javascript:void(0);" class="link" @click.stop="showImg(item)">{{item[code]}}</a>
                </div>
              </template>
            </simpleTable>
        </div>

        <div class="bot-btn" style="margin-top: 20px;">
            <el-button @click="closePage">关闭</el-button>
        </div>

    </div>
</template>

<script>
	import confirmBillDetail from './confirmBillDetail.js'

	export default confirmBillDetail
</script>
<style lang="scss">
@import '@/page/pt/fc/fc_common.scss';
#confirmBillDetail {
  .tagList .tag .contet .item .label{
    width: 95px;
  }
  .table-content{
    height: calc(100% - 335px)!important;
  }
}
</style>
