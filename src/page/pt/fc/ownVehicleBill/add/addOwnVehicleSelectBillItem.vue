<template>
    <div id="addOwnVehicleSelectBillItem" class="selStockPage" style="height:100%;">
        <div class="search-list clearfix">
            <div class="search-form clearfix">
                <div class="item">
                    <label class="label">派车单号</label>
                    <div class="input-text">
                        <el-input v-model="query.waybillNum" placeholder="派车单号" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">供应商</label>
                    <div class="input-text">
                        <el-input v-model="query.tenantName" :disabled="tenantDisabled" placeholder="供应商" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">司机</label>
                    <div class="input-text">
                        <el-input v-model="query.driverName" placeholder="司机" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">车牌号码</label>
                    <div class="input-text">
                        <el-input v-model="query.plateNumber" placeholder="车牌号码" type="text"></el-input>
                    </div>
                </div>
                <div class="item daterange">
                  <label class="label">客户下单时间</label>
                  <div class="input-text">
                    <el-date-picker v-model="query.customerOrderDate" type="daterange" range-separator="至" start-placeholder="开始日期"
                                    end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"
                                    unlink-panels></el-date-picker>
                  </div>
                </div>
                <div class="item daterange">
                    <label class="label">收车日期</label>
                    <div class="input-text">
                        <el-date-picker v-model="query.endCarDate" type="daterange" range-separator="至" start-placeholder="开始日期"
                                        end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"
                                        unlink-panels></el-date-picker>
                    </div>
                </div>
                <div class="item daterange">
                  <label class="label">要求运作时间</label>
                  <div class="input-text">
                    <el-date-picker v-model="query.workDate" type="daterange" range-separator="至" start-placeholder="开始日期"
                                    end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"
                                    unlink-panels></el-date-picker>
                  </div>
                </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery">搜索</el-button>
                </div>
                <div class="btn">
                    <el-button type="danger" plain size="mini" icon="el-icon-close" @click="initQuery()">清空</el-button>
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
                    <span>自有车派车单列表</span>
                    <el-tooltip effect="light" content="选择运输订单" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn">
                    <el-button type="primary" plain size="mini" @click="generateBill">生成账单</el-button>
                </div>
            </div>
            <dbTable tableName="addOwnVehicleSelectBillItemTable" ref="table" :head="head" @dataChange="dataChange" @filter="filter" onlyId="waybillId" :isFilter="isFilter"></dbTable>
        </div>
    </div>
</template>

<script>
import addOwnVehicleSelectBillItem from './addOwnVehicleSelectBillItem.js'
export default addOwnVehicleSelectBillItem
</script>

<style lang="scss">
  #addOwnVehicleSelectBillItem{
    overflow: hidden;
  }
  .selStockPage {
    .table-content {
      height: calc(100% - 57px) !important;

      .tableCommonDiv {
        height: calc(100% - 50px);
      }
    }
    .search-list {
      .search-form .item {
        .sel-ipt {
          & > .el-select {
            float: left;
            width: 40%;
          }

          & > .el-input {
            float: left;
            width: 60%;
          }
        }
      }
    }
  }
</style>
