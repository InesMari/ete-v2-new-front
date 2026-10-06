<template>
    <div id="quoteManageLD" class="quoteManageLDPage">
        <searchList :formData="formData" @doQuery="doQuery" @clearFn="clear()" :query="loadParam" searchKey="quoteManageLDSearch"></searchList>

        <div class="table-content clearfix">
            <div class="table-title">
                <h3>
                    <span>供应商零担报价列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="供应商零担报价列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn"  style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="add()" v-entity="1002082">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="copy()" v-entity="1002090">复制</el-button>
                    <el-button type="primary" plain size="mini" @click="modify()" v-entity="1002084">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="del()" v-entity="1002083">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="download()" v-entity="1002085">导出Excel</el-button>
                    <el-button type="primary" plain size="mini" @click="uploadOpen = true" v-entity="1002086">批量导入</el-button>
                </div>
            </div>
                <tableCommon :class="{'tableLD':showTableDetail}" tableName="supplierQuoteManage_LD" ref="table" :head="head" :showNum="true"
                             :showSetTable="true" @dblclickItem="dblclickItem"  :singleSelect="true">
                    <template v-slot:diyColorTd="{item}">
                        <span :style="item.validState==1?'color:red!important':''">{{item.validStateName}}</span>
                    </template>
                </tableCommon>
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
                  <table class="tableCommon" ref="quoteDetail"  width="100%" border="0" cellspacing="0" cellpadding="0">
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
        <!-- 批量导入 -->
        <my-import :open.sync="uploadOpen" :handle-success="doQuery" template="/download/supplierQuoteLD.xlsx" title="供应商零担报价导入"
                   bean="quoteLDNewTF" method="impSupplierQuoteLD" :param="impParam"></my-import>
    </div>
</template>

<script>
    import quoteManageLD from './quoteManageLD.js'

    export default quoteManageLD
</script>
<style lang="scss">
.quoteManageLDPage{
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
    .table_height{
        border:$border;
        border-bottom: none;
        overflow: auto;
    }
}
</style>
