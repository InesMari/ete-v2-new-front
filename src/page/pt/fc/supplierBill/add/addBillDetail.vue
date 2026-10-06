<template>
    <div id="billDetail" class="fcCommonPage">
        <div class="tagList clearfix">
            <div class="tag" style="width:50%">
                <div class="tip"><span>供应商</span></div>
                <h3 class="title">基本信息</h3>
                <div class="contet">
                    <div class="item">
                        <div class="label">供应商名称：</div>
                        <div class="text fw">{{ bill.supplierName }}</div>
                    </div>
                    <div class="item">
                        <div class="label"><em>*</em>账单月份：</div>
                        <div class="text fw">
                            <el-date-picker v-model="bill.billMonth" type="month" :picker-options="pickerOptions" @change="checkTip" placeholder="请选择账单月份" value-format="yyyy-MM"></el-date-picker>
                        </div>
                    </div>
                    <div class="item">
                        <div class="label">账单备注：</div>
                        <div class="text fw">
                            <el-input v-model="bill.remark" placeholder="请输入" type="text" autocomplete="new-password"></el-input>
                        </div>
                    </div>
                  <div class="item">
                    <div class="label"><em>*</em>结算主体：</div>
                    <div class="text fw">
                      <el-select v-model="bill.settleBody" placeholder="结算主体" clearable filterable>
                        <el-option v-for="item in settleBodyData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                      </el-select>
                    </div>
                </div>
                  <div class="item">
                    <div class="label">附件：</div>
                    <div class="text fw">
                      <myFileModel class="myfilemodel fl" style="margin-right: 20px;" ref="attach"></myFileModel>
                    </div>
                  </div>
                </div>
            </div>
            <div class="tag" style="width: 50%;">
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
                </div>
            </div>
        </div>
        <div class="table-content" style="margin:0;">
            <div class="table-title">
                <div class="tab-title clearfix">
                    <div class="tab" :class="{'active':tab.active}" @click="changeTab(tab)" v-for="(tab,index) in tabs" :key="index">{{ tab.name }}</div>
                </div>
                <div class="table-title-btn">
                    <el-button type="primary" plain size="mini" @click="toDetailFromSon()" v-show="showGotoDetail">查看详情</el-button>
                    <el-button type="primary" plain size="mini" @click="recheck()">重新勾选</el-button>
                </div>
            </div>
            <simpleTable ref="table" :head="head" :data="tableData" @dblclickItem="dblclickItem" :singleSelect="true"></simpleTable>
        </div>



    </div>
</template>

<script>
	import addBillDetail from './addBillDetail.js'

	export default addBillDetail
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
