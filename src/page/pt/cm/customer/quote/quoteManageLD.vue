<template>
    <div id="quoteManageLD" class="quoteManageLDPage">
       <searchList :formData="formData" @doQuery="doQuery" @clearFn="clear()" :query="loadParam" searchKey="custQuoteManageLDSearch"></searchList>
        <div class="table-content clearfix">
            <div class="table-title">
                <h3>
                    <span>客户零担报价列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="客户零担报价列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn"  style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" @click="add()" v-entity="1001048">新增</el-button>
                  <el-button type="primary" plain size="mini" @click="copy()" v-entity="1001065">复制</el-button>
                  <el-button type="primary" plain size="mini" @click="modify()" v-entity="1001049">修改</el-button>
                  <el-button type="danger" plain size="mini" @click="del()" v-entity="1001050">删除</el-button>
                  <el-button type="primary" plain size="mini" @click="uploadOpen = true" v-entity="1001051">批量导入</el-button>
                  <el-button type="primary" plain size="mini" @click="download()" v-entity="1001052">导出Excel</el-button>
                  <el-button type="primary" plain size="mini" @click="cancelVerify()" v-entity="1001105">取消审核</el-button>
                </div>
            </div>
                <tableCommon  tableName="customerQuoteManage_LD" ref="table" :head="head" :showNum="true"
                             :showSetTable="true"  :singleSelect="true" @dblclickItem="dblclickItem">
                    <template v-slot:diyColorTd="{item}">
                        <span :style="item.validState==1?'color:red!important':''">{{item.validStateName}}</span>
                    </template>
                </tableCommon>
        </div>
        <!-- 批量导入 -->
        <my-import :open.sync="uploadOpen" :handle-success="doQuery" template="/download/customerQuoteLD.xlsx" title="客户零担报价导入"
                   bean="quoteLDNewTF" method="impCustomerQuoteLD" :param="impParam"></my-import>
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
