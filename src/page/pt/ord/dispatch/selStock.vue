<template>
  <div id="selStock" class="selStockPage" style="height:100%;">
      <searchList :formData="formData" @doQuery="doQuery" :query="param" searchKey="selStockSearch" @clearFn="clear"></searchList>

      <div class="table-content">
        <div class="table-title">
          <h3>
            <span>库存单列表</span>
            <el-tooltip effect="light" :content="tips" placement="right">
              <img class="tip" src="@/static/image/tip.png" alt="">
            </el-tooltip>
          </h3>
          <div class="table-title-btn" style="margin-right: 90px;">
            <el-button type="primary" plain size="mini" @click="next()">下一步</el-button>
          </div>
        </div>
        <dbTable :tableName="selStockTable" ref="table" :head="head" onlyId="orderStockId" :showSetTable="true" relatedId="orderId" v-if="dispatchType==3"></dbTable>
        <dbTable :tableName="selStockTable" ref="table" :head="head" onlyId="orderStockId" :showSetTable="true" v-if="dispatchType!=3"></dbTable>
      </div>
    </div>
</template>

<script>
import selStock from './selStock.js'
export default selStock
</script>
<style lang="scss">
.selStockPage{
  .table-content{
    // height: calc(100% - 95px)!important;
    .tableCommonDiv{
      height: calc(100% - 50px);
    }
  }
  .search-list{
    .search-form .item {
      .sel-ipt{
        &>.el-select{
          float: left;
          width: 40%;
        }
        &>.el-input{
          float: left;
          width: 60%;
        }
      }
    }
  }
}
</style>
