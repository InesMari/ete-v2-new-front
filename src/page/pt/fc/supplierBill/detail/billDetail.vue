<template>
    <div id="billDetail" class="fcCommonPage">
        <div class="tagList clearfix">
            <div class="tag" style="width:50%;">
                <div class="tip"><span>供应商</span></div>
                <h3 class="title">基本信息</h3>
                <div class="contet">
                    <div class="item">
                        <div class="label">账单编号：</div>
                        <div class="text fw">{{ bill.billNum }}</div>
                    </div>
                  <div class="item">
                    <div class="label">供应商名称：</div>
                    <div class="text fw">{{ bill.supplierName }}</div>
                  </div>
                    <div class="item">
                        <div class="label"><em>*</em>账单月份：</div>
                        <div class="text fw">{{ bill.billMonth }}</div>
                    </div>
                    <div class="item">
                        <div class="label">账单备注：</div>
                        <div class="text fw">{{ bill.remark }}</div>
                    </div>
                  <div class="item">
                    <div class="label">结算主体：</div>
                    <div class="text fw">{{ bill.settleBodyName }}</div>
                  </div>
                  <div class="item">
                    <div class="label">附件：</div>
                    <div class="text fw">
                      <myFileModel class="myfilemodel fl" style="margin-right: 20px;" ref="attach"  :disabledEdit="true" :disabledDel="true" ></myFileModel>
                    </div>
                  </div>
                </div>
            </div>
            <div class="tag" style="width: 50%;;">
                <div class="tip"><span>账单</span></div>
                <h3 class="title">账单金额</h3>
                <h5 class="cash">￥{{ bill.totalFee }} 元</h5>
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
                      <div class="label fw">器具金额：</div>
                      <div class="text">￥{{ bill.packCostFee }}元</div>
                    </div>
                    <div class="item">
                        <div class="label fw">补录金额：</div>
                        <div class="text">￥{{ bill.makeupFee }}元</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="table-content" style="margin:0;">
            <div class="table-title">
                <div class="tab-title clearfix">
                    <div class="tab" :class="{'active':tab.active}" @click="changeTab(tab)" v-show="tab.show" v-for="(tab,index) in tabs" :key="index">{{ tab.name }}</div>
                </div>
                <div class="table-title-btn">
                    <el-button type="primary" plain size="mini" @click="toDetail(false)" v-show="showGotoDetail">查看详情</el-button>
                    <el-button type="primary" plain size="mini" @click="download()">导出EXCEL</el-button>
                </div>
            </div>
            <simpleTable ref="table" tableName="billDetailTable" :head="head" :data="tableData" @dblclickItem="dblclickItem" :singleSelect="true"></simpleTable>
<!--            <tableCommon tableName="orderManageTable" ref="table" :showNum="true" :singleSelect="false" :showSetTable="false" :head="head" @dblclickItem="dblclickItem"></tableCommon>-->

        </div>

        <div class="bot-btn" style="margin-top: 20px;">
            <el-button @click="closePage">关闭</el-button>
        </div>

    </div>
</template>

<script>
	import billDetail from './billDetail.js'

	export default billDetail
</script>
<style lang="scss">
@import '@/page/pt/fc/fc_common.scss';
#billDetail {
  .tagList .tag .contet .item .label{
    width: 120px!important;
  }
  .myfilemodel{
    .el-upload{
      width: 100px;
      height: 70px;
      .el-icon-plus{
        width: 100px;
        height: 70px;
        line-height: 70px;

      }
    }
  }
}
</style>
