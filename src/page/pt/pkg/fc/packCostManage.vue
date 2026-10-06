<template>
    <div id="packCostManage" style="height: 100%;">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
              <div class="item">
                <label class="label">供应商名称：</label>
                <div class="input-text">
                  <el-input v-model="loadParam.supplierName" placeholder="供应商名称" type="text"></el-input>
                </div>
              </div>
              <div class="item">
                <label class="label">包装名称：</label>
                <div class="input-text">
                  <el-input v-model="loadParam.packName" placeholder="包装名称" type="text"></el-input>
                </div>
              </div>
              <div class="item">
                <label class="label">是否入账</label>
                <div class="input-text">
                  <el-select v-model="loadParam.billFlag" @change="doQuery" clearable placeholder="是否入账">
                    <el-option v-for="item in whetherData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="item">
                <label class="label">采购单号：</label>
                <div class="input-text">
                  <el-input v-model="loadParam.purchaseOrderNum" placeholder="采购单号" type="text"></el-input>
                </div>
              </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询</el-button>
                </div>
                <div class="btn">
                    <el-button type="danger" plain size="mini" icon="el-icon-close" @click="clear()">清空</el-button>
                </div>
            </div>
            <!-- 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 -->
            <div class="search-bot">
              <img src="@/static/image/search-bot.png" alt="">
              <i class="icon el-icon-arrow-down"></i>
              <i class="icon el-icon-arrow-up"></i>
            </div>
        </div>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>包装成本列表</span>
                    <el-tooltip effect="light" content="包装成本列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
              <div class="table-title-btn" style="margin-right: 90px;">
                <el-button type="primary" plain size="mini" v-entity="1004021" @click="showDialog(true)">成本分摊情况</el-button>
              </div>
            </div>
            <tableCommon tableName="packCostManageTable" ref="table" :head="head" :showNum="true" :singleSelect="true" :showSetTable="true"></tableCommon>
        </div>


      <el-dialog title="成本分摊情况" :visible.sync="dialogShow" :close-on-click-modal="false" :close-on-press-escape="false" width="640px" @close="showDialog(false)">
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix">
            <li class="item">
              <label class="label-term">采购单号:</label>
              <div class="input-text">
                {{feeInfo.purchaseOrderNum}}
              </div>
            </li>
            <li class="item">
              <label class="label-term">成本金额:</label>
              <div class="input-text">
                {{feeInfo.totalFeeWithTax}}
              </div>
            </li>
            <li class="item">
              <label class="label-term">客户名称:</label>
              <div class="input-text">
                {{feeInfo.custName}}
              </div>
            </li>
            <li class="item">
              <label class="label-term">开始计费时间:</label>
              <div class="input-text">
                {{feeInfo.chargeDate}}
              </div>
            </li>
            <li class="item">
              <label class="label-term">合同有效期:</label>
              <div class="input-text">
                {{feeInfo.validityPeriod}}月
              </div>
            </li>
          </ul>
        </div>
        <div style="overflow: auto;max-height: 400px;">
          <scrollTable ref="scrollTable" :head="headDetail"></scrollTable>
        </div>
        <div class="bot-btn">
          <el-button type="primary" plain size="mini" @click="showDialog(false)">返回</el-button>
        </div>
      </el-dialog>

    </div>
</template>

<script>
    import packCostManage from './packCostManage.js'
    export default packCostManage
</script>
<style lang="scss">
.common-info{
  .content{
    .item{
      .label-term{
        width:84px;
      }
      .input-text{
        width: calc(100% - 94px);
      }
    }
  }
}

</style>
