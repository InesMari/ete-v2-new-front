<template>
    <div id="selectBillItem" style="height: 100%">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <!--        派车单-开始        -->
        <div id="orderList" class="selStockPage" style="height:100%;" v-show="showTabId === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.WAYBILL">
          <div class="search-list clearfix">
                <div class="search-form clearfix">
                  <div class="item">
                    <label class="label">派车单号</label>
                    <div class="input-text">
                      <el-input style="height: 30px;" :class="{'equipmentFocus':equipmentFocus}" @focus="setEquipmentFocus" @blur="setEquipmentFocus" v-model="waybillQuery.waybillNum" placeholder="派车单号(多个回车换行查询)" type="textarea"
                                autocomplete="new-password"></el-input>
<!--                      <el-input v-model="waybillQuery.waybillNum" placeholder="派车单号" type="text"></el-input>-->
                    </div>
                  </div>
                    <div class="item">
                        <label class="label">供应商</label>
                        <div class="input-text">
                          <el-select v-model="waybillQuery.supplierTenantId" :disabled="tenantDisabled" placeholder="供应商" @change="doQuery(enumData.FC_SUPPLIER_BILL_ITEM_TYPE.WAYBILL)" clearable filterable>
                            <el-option v-for="item in supplierData" :key="item.tenantId" :label="item.supplierName" :value="item.tenantId"></el-option>
                          </el-select>
                        </div>
                    </div>
                  <div class="item daterange">
                    <label class="label">客户下单时间</label>
                    <div class="input-text">
                      <el-date-picker v-model="waybillQuery.customerOrderDate" type="daterange" range-separator="至" start-placeholder="开始日期"
                                      end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"
                                      unlink-panels></el-date-picker>
                    </div>
                  </div>
                    <div class="item daterange">
                      <label class="label">系统录单时间</label>
                      <div class="input-text">
                        <el-date-picker v-model="waybillQuery.createDate" type="daterange" range-separator="至" start-placeholder="开始日期"
                                        end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"
                                        unlink-panels></el-date-picker>
                      </div>
                    </div>
                    <div class="item daterange">
                      <label class="label">要求运作时间</label>
                      <div class="input-text">
                        <el-date-picker v-model="waybillQuery.workDate" type="daterange" range-separator="至" start-placeholder="开始日期"
                                        end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"
                                        unlink-panels></el-date-picker>
                      </div>
                    </div>
                    <div class="item daterange">
                      <label class="label">收车时间</label>
                      <div class="input-text">
                        <el-date-picker v-model="waybillQuery.endCarDate" type="daterange" range-separator="至" start-placeholder="开始日期"
                                        end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"
                                        unlink-panels></el-date-picker>
                      </div>
                    </div>
                    <div class="item">
                        <label class="label">司机</label>
                        <div class="input-text">
                            <el-input v-model="waybillQuery.driverName" placeholder="司机" type="text"></el-input>
                        </div>
                    </div>
                    <div class="item">
                        <label class="label">车牌号码</label>
                        <div class="input-text">
                            <el-input v-model="waybillQuery.plateNumber" placeholder="车牌号码" type="text"></el-input>
                        </div>
                    </div>
                    <div class="item">
                      <label class="label">客户</label>
                      <div class="input-text">
                        <el-input v-model="waybillQuery.custName" placeholder="客户" type="text"></el-input>
                      </div>
                    </div>
                </div>
                <div class="search-btn clearfix">
                    <div class="btn">
                        <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery(enumData.FC_SUPPLIER_BILL_ITEM_TYPE.WAYBILL)">搜索</el-button>
                    </div>
                    <div class="btn">
                        <el-button type="danger" plain size="mini" icon="el-icon-close" @click="initWaybillQuery()">清空</el-button>
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
                        <span>派车单列表</span>
                        <el-tooltip effect="light" content="选择派车单、中转单" placement="right">
                            <img class="tip" src="@/static/image/tip.png" alt="">
                        </el-tooltip>
                    </h3>
                    <div class="table-title-btn" style="margin-right: 90px;">
                        <el-button type="primary" plain size="mini" @click="generateBill">生成账单</el-button>
                    </div>
                </div>
                <dbTable tableName="fcWaybillListTable" ref="waybillListTable" :head="waybillHead" @dataChange="dataChange" @filter="filter" onlyId="id" :isFilter="isFilter" :showSetTable="true"></dbTable>
            </div>
        </div>
        <!--        派车单-结束        -->

        <!--        仓储费用-开始        -->
        <div id="storehouseList" class="selStockPage" style="height:100%;" v-show="showTabId === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.STOREHOUSE">
           <div class="search-list clearfix">
                <div class="search-form clearfix">
                  <div class="item">
                    <label class="label">供应商</label>
                    <div class="input-text">
                      <el-select v-model="storehouseQuery.supplierTenantId" :disabled="tenantDisabled" placeholder="供应商" @change="doQuery(enumData.FC_SUPPLIER_BILL_ITEM_TYPE.STOREHOUSE)" clearable filterable>
                        <el-option v-for="item in supplierData" :key="item.tenantId" :label="item.supplierName" :value="item.tenantId"></el-option>
                      </el-select>
                    </div>
                  </div>
                    <div class="item">
                        <label class="label">仓库名称</label>
                        <div class="input-text">
                            <el-input v-model="storehouseQuery.storehouseName" placeholder="仓库名称" type="text"></el-input>
                        </div>
                    </div>
                    <div class="item">
                        <label class="label">仓库地址</label>
                        <div class="input-text">
                            <el-input v-model="storehouseQuery.storehouseAddress" placeholder="仓库地址" type="text"></el-input>
                        </div>
                    </div>
                    <div class="item">
                        <label class="label">费用产生月份</label>
                        <div class="input-text">
                            <el-date-picker v-model="storehouseQuery.billMonth" type="month" placeholder="费用产生月份" value-format="yyyy-MM"></el-date-picker>
                        </div>
                    </div>
                    <div class="item">
                      <label class="label">客户</label>
                      <div class="input-text">
                        <el-input v-model="storehouseQuery.custName" placeholder="客户" type="text"></el-input>
                      </div>
                    </div>
                  <div class="item">
                    <label class="label">费用类型</label>
                    <div class="input-text">
                      <el-select v-model="storehouseQuery.itemType" placeholder="费用类型" @change="doQuery(enumData.FC_SUPPLIER_BILL_ITEM_TYPE.STOREHOUSE)" clearable filterable>
                        <el-option v-for="item in itemTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                      </el-select>
                    </div>
                  </div>
                </div>
                <div class="search-btn clearfix">
                    <div class="btn">
                        <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery(enumData.FC_SUPPLIER_BILL_ITEM_TYPE.STOREHOUSE)">搜索</el-button>
                    </div>
                    <div class="btn">
                        <el-button type="danger" plain size="mini" icon="el-icon-close" @click="initStorehouseQuery()">清空</el-button>
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
                        <span>仓储费用列表</span>
                        <el-tooltip effect="light" content="选择仓储费用" placement="right">
                            <img class="tip" src="@/static/image/tip.png" alt="">
                        </el-tooltip>
                    </h3>
                    <div class="table-title-btn" style="margin-right: 90px;">
                        <el-button type="primary" plain size="mini" @click="generateBill()">生成账单</el-button>
                    </div>
                </div>
                <dbTable tableName="fcStorehouseListTable" ref="storehouseListTable" :head="storehouseHead" @dataChange="dataChange" @filter="filter" onlyId="id" :isFilter="isFilter" :showSetTable="true"></dbTable>
            </div>
        </div>
        <!--        仓储费用-结束        -->

      <!--        器具费用-开始        -->
      <div id="packCostList" class="selStockPage" style="height:100%;" v-show="showTabId === enumData.FC_SUPPLIER_BILL_ITEM_TYPE.PACKCOST">
        <div class="search-list clearfix">
          <div class="search-form clearfix">
            <div class="item">
              <label class="label">供应商</label>
              <div class="input-text">
                <el-select v-model="packCostQuery.supplierTenantId" :disabled="tenantDisabled" placeholder="供应商" @change="doQuery(enumData.FC_SUPPLIER_BILL_ITEM_TYPE.PACKCOST)" clearable filterable>
                  <el-option v-for="item in supplierData" :key="item.tenantId" :label="item.supplierName" :value="item.tenantId"></el-option>
                </el-select>
              </div>
            </div>
            <div class="item">
              <label class="label">费用产生月份</label>
              <div class="input-text">
                <el-date-picker v-model="packCostQuery.billMonth" type="month" placeholder="费用产生月份" value-format="yyyy-MM"></el-date-picker>
              </div>
            </div>
            <div class="item">
              <label class="label">仓库名称</label>
              <div class="input-text">
                <el-input v-model="packCostQuery.workName" placeholder="仓库名称" type="text"></el-input>
              </div>
            </div>
            <div class="item">
              <label class="label">采购单号</label>
              <div class="input-text">
                <el-input v-model="packCostQuery.purchaseOrderNum" placeholder="采购单号" type="text"></el-input>
              </div>
            </div>
            <div class="item">
              <label class="label">业务模式</label>
              <div class="input-text">
                <el-select v-model="packCostQuery.type" placeholder="业务模式" @change="doQuery(enumData.FC_SUPPLIER_BILL_ITEM_TYPE.PACKCOST)" clearable filterable>
                  <el-option v-for="item in typeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                </el-select>
              </div>
            </div>
            <div class="item">
              <label class="label">器具名称</label>
              <div class="input-text">
                <el-input v-model="packCostQuery.packName" placeholder="器具名称" type="text"></el-input>
              </div>
            </div>
            <div class="item">
              <label class="label">客户名称</label>
              <div class="input-text">
                <el-input v-model="packCostQuery.custName" placeholder="客户名称" type="text"></el-input>
              </div>
            </div>
          </div>
          <div class="search-btn clearfix">
            <div class="btn">
              <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery(enumData.FC_SUPPLIER_BILL_ITEM_TYPE.PACKCOST)">搜索</el-button>
            </div>
            <div class="btn">
              <el-button type="danger" plain size="mini" icon="el-icon-close" @click="initPackCostQuery()">清空</el-button>
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
              <span>器具费用列表</span>
              <el-tooltip effect="light" content="选择器具费用" placement="right">
                <img class="tip" src="@/static/image/tip.png" alt="">
              </el-tooltip>
            </h3>
            <div class="table-title-btn" style="margin-right: 90px;">
              <el-button type="primary" plain size="mini" @click="generateBill()">生成账单</el-button>
            </div>
          </div>
          <dbTable tableName="fcPackCostListTable" ref="packCostListTable" :head="packCostHead" @dataChange="dataChange" @filter="filter" onlyId="id" :isFilter="isFilter" :showSetTable="true"></dbTable>
        </div>
      </div>
      <!--        器具费用-结束        -->

    </div>
</template>

<script>
import selectBillItem from './selectBillItem.js'
export default selectBillItem
</script>

<style lang="scss" scoped>
#selectBillItem{
  overflow: hidden;
  /deep/ .search-form {
    .item {
      .el-textarea__inner {
        height: 30px;
        border:none;
        resize: none;
        line-height: 20px;
        &::placeholder{
          font-size: 12px;
          line-height: 24px;
        }
      }
    }
  }
  /deep/ .equipmentFocus{
    position: relative;
    z-index: 99;
    .el-textarea__inner {
      height: 60px!important;
      border: 1px solid #DCDFE6!important;
      box-sizing: border-box;
    }
  }
  /deep/ .selStockPage {
    .table-content {
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
}
</style>
