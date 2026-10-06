<template>
    <div id="quoteManageVerifyLD" class="quoteManageVerifyLDPage">
        <div class="search-list clearfix">
            <div class="search-form clearfix">
                <div class="item">
                  <label class="label">报价单号：</label>
                  <div class="input-text">
                    <el-input v-model="loadParam.quoteNum" placeholder="报价单号" type="text"
                              autocomplete="new-password"></el-input>
                  </div>
                </div>
                <div class="item">
                  <label class="label">客户名称：</label>
                  <div class="input-text">
                    <el-select v-model="loadParam.tenantId" clearable placeholder="状态" @change="doQuery">
                      <el-option v-for="item in tenantData" :key="item.tenantId" :label="item.name" :value="item.tenantId"></el-option>
                    </el-select>
                  </div>
                </div>
                <div class="item">
                  <label class="label">状态：</label>
                  <div class="input-text">
                    <el-select v-model="loadParam.verifyState" clearable placeholder="状态" @change="doQuery">
                      <el-option v-for="item in verifyStateData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                    </el-select>
                  </div>
                </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">搜索</el-button>
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
                    <span>待办事项-客户零担新增报价审核
                        (<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)
                    </span>
                    <el-tooltip effect="light" content="待办事项-客户零担新增报价审核" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn">
                    <el-button type="primary" plain size="mini" @click="verify(1)" v-entity="1010024">审核通过</el-button>
                    <el-button type="primary" plain size="mini" @click="verify(2)" v-entity="1010025">审核不通过</el-button>
                </div>
            </div>
            <div class="clearfix" style="height:calc(100% - 35px);">
                <tableCommon :class="{'tableLD':showTableDetail}" tableName="customerQuoteManageVerify_LD" ref="table" :head="head" :showNum="true"
                             :showSetTable="false" @dblclickItem="dblclickItem"  :singleSelect="true"></tableCommon>
              <div class="tableDetail" v-show="showTableDetail">
                <div class="con" v-show="quoteData.quoteNum">
                  <label class="label">报价单号:</label>
                  <span>{{quoteData.quoteNum}}</span>
                  <label class="label">客户:</label>
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
    .table_height{
        margin-bottom: 20px;
        border:$border;
        border-bottom: none;
    }
}
</style>
