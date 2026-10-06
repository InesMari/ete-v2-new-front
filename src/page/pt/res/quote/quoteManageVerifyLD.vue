<template>
    <div id="quoteManageVerifyLD" class="quoteManageVerifyLDPage">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="quoteManageVerifyLDSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>待办事项-供应商零担新增报价审核
                    (<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)
                    </span>
                    <el-tooltip effect="light" content="待办事项-供应商零担新增报价处理" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn">
                  <el-button type="primary" plain size="mini" @click="verify(1)"  v-entity :entityId="[{1010005: 1010020}]">审核通过</el-button>
                  <el-button type="primary" plain size="mini" @click="verify(2)"  v-entity :entityId="[{1010005: 1010021}]">审核不通过</el-button>
                </div>
            </div>
            <div class="clearfix">
                <tableCommon :class="{'tableLD':showTableDetail}" tableName="supplierQuoteManageVerify_LD" ref="table" :head="head" :showNum="true"
                             :showSetTable="false" @dblclickItem="dblclickItem"  :singleSelect="true"></tableCommon>
              <div class="tableDetail" v-show="showTableDetail">
                <div class="con" v-show="quoteData.quoteNum">
                  <label class="label">报价单号:</label>
                  <span>{{quoteData.quoteNum}}</span>
                  <label class="label">供应商:</label>
                  <span>{{quoteData.supplierName}}</span>
                  <label class="label">线路:</label>
                  <span>{{quoteData.indexSearchStr}}</span>
                </div>
                <div class="con" v-show="quoteData.createUserName">
                  <label class="label">创建人:</label>
                  <span>{{quoteData.createUserName}}</span>
                  <label class="label">创建时间:</label>
                  <span>{{quoteData.createDate}}</span>
                </div>
                <div class="table_height">
                  <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                    <tr>
                      <th>序号</th>
                      <th>费用方式</th>
                      <th>区间</th>
                      <th>区间单位</th>
                      <th>计费方式</th>
                      <th>货物</th>
                      <th>费用</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in quoteFeeData">
                      <td>{{ index+1 }}</td>
                      <td>{{ item.feeTypeName }}</td>
                      <td>{{ item.rangeStr }}</td>
                      <td>{{ item.rangeUnitName }}</td>
                      <td>{{ item.billingTypeName }}</td>
                      <td>{{ item.goodsNames }}</td>
                      <td>{{ item.fee }}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
    import quoteManageVerifyLD from './quoteManageVerifyLD.js'

    export default quoteManageVerifyLD
</script>
<style lang="scss">
.quoteManageVerifyLDPage{
    .tableLD{
      width: 40%;
      float: left;
    }
  .tableDetail {
    width: 59%;
    float: right;
    border:$border;
    padding: 10px 20px;
    box-sizing: border-box;
    .con{
      line-height: 24px;
      margin-bottom: 10px;
      span{
        margin-right: 20px;
      }
    }
  }
    .table-content{
        .clearfix{
            height: 100%;
        }
    }
    .table_height{
        margin-bottom: 20px;
        border:$border;
        border-bottom: none;
    }
}
</style>
