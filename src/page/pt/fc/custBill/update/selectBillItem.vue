<template>
    <div id="selectBillItem" style="height: 100%">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <!--        运输订单-开始        -->
        <div id="orderList" class="selStockPage" style="height:100%;" v-show="showTabId === enumData.FC_CUST_BILL_ITEM_TYPE.ORDER">
            <searchList :formData="formDataOrder" @doQuery="doQueryOrder" :query="orderQuery" searchKey="orderListSearch"></searchList>

            <div class="table-content">
                <div class="table-title">
                    <h3>
                        <span>运输订单列表</span>
                        <el-tooltip effect="light" content="选择运输订单" placement="right">
                            <img class="tip" src="@/static/image/tip.png" alt="">
                        </el-tooltip>
                    </h3>
                    <div class="table-title-btn">
                        <el-button type="primary" plain size="mini" @click="generateBill">生成账单</el-button>
                    </div>
                </div>
                <dbTable tableName="fcOrderListTable" ref="orderListTable" :head="orderHead" @dataChange="dataChange" @filter="filter" onlyId="orderId" :isFilter="isFilter"></dbTable>
            </div>
        </div>
        <!--        运输订单-结束        -->

        <!--        仓储费用-开始        -->
        <div id="storehouseList" class="selStockPage" style="height:100%;" v-show="showTabId === enumData.FC_CUST_BILL_ITEM_TYPE.STOREHOUSE">
            <div class="search-list clearfix">
                <div class="search-form clearfix">
                    <div class="item">
                        <label class="label">客户名称</label>
                        <div class="input-text">
                            <el-input v-model="storehouseQuery.tenantName" :disabled="tenantDisabled" placeholder="客户名称" type="text"></el-input>
                        </div>
                    </div>
                    <div class="item">
                        <label class="label">仓库名称</label>
                        <div class="input-text">
                            <el-input v-model="storehouseQuery.workName" placeholder="仓库名称" type="text"></el-input>
                        </div>
                    </div>
                    <div class="item">
                        <label class="label">仓库地址</label>
                        <div class="input-text">
                            <el-input v-model="storehouseQuery.workAddressStr" placeholder="仓库地址" type="text"></el-input>
                        </div>
                    </div>
                    <div class="item">
                        <label class="label">费用产生月份</label>
                        <div class="input-text">
                            <el-date-picker v-model="storehouseQuery.billMonth" type="month" placeholder="费用产生月份" value-format="yyyy-MM"></el-date-picker>
                        </div>
                    </div>
                </div>
                <div class="search-btn clearfix">
                    <div class="btn">
                        <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery(enumData.FC_CUST_BILL_ITEM_TYPE.STOREHOUSE)">搜索</el-button>
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
                    <div class="table-title-btn">
                        <el-button type="primary" plain size="mini" @click="generateBill()">生成账单</el-button>
                    </div>
                </div>
                <dbTable tableName="fcStorehouseListTable" ref="storehouseListTable" :head="storehouseHead" @dataChange="dataChange" @filter="filter" onlyId="fId" :isFilter="isFilter"></dbTable>
            </div>
        </div>
        <!--        仓储费用-结束        -->

      <!--        项目其他费用-开始        -->
      <div id="projectsundryList" class="selStockPage" style="height:100%;" v-show="showTabId === enumData.FC_CUST_BILL_ITEM_TYPE.PROJECTSUNDRY">
        <div class="search-list clearfix">
          <div class="search-form clearfix">
            <div class="item">
              <label class="label">项目</label>
              <div class="input-text">
                <el-input v-model="projectsundryQuery.tenantName" :disabled="tenantDisabled" placeholder="项目" type="text"></el-input>
              </div>
            </div>
            <div class="item">
              <label class="label">费用类型</label>
              <div class="input-text">
                <el-select v-model="projectsundryQuery.feeType" placeholder="费用类型" clearable>
                  <el-option v-for="item in feeTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                </el-select>
              </div>
            </div>
            <div class="item">
              <label class="label">费用产生月份</label>
              <div class="input-text">
                <el-date-picker v-model="projectsundryQuery.billMonth" type="month" placeholder="费用产生月份" value-format="yyyy-MM"></el-date-picker>
              </div>
            </div>
            <div class="item">
              <label class="label">备注</label>
              <div class="input-text">
                <el-input v-model="projectsundryQuery.remark" placeholder="备注" type="text"></el-input>
              </div>
            </div>
          </div>
          <div class="search-btn clearfix">
            <div class="btn">
              <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery(enumData.FC_CUST_BILL_ITEM_TYPE.PROJECTSUNDRY)">搜索</el-button>
            </div>
            <div class="btn">
              <el-button type="danger" plain size="mini" icon="el-icon-close" @click="initProjectsundryQuery()">清空</el-button>
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
              <span>项目其他费用列表</span>
              <el-tooltip effect="light" content="选择项目其他费用" placement="right">
                <img class="tip" src="@/static/image/tip.png" alt="">
              </el-tooltip>
            </h3>
            <div class="table-title-btn">
              <el-button type="primary" plain size="mini" @click="generateBill()">生成账单</el-button>
            </div>
          </div>
          <dbTable tableName="fcProjectsundryListTable" ref="projectsundryListTable" :head="projectsundryHead" @dataChange="dataChange" @filter="filter" onlyId="fId" :isFilter="isFilter"></dbTable>
        </div>
      </div>
      <!--        项目其他费用-结束        -->

        <!--        开始        -->
        <div id="packLeaseList" class="selStockPage" v-show="showTabId === enumData.FC_CUST_BILL_ITEM_TYPE.PACKLEASE">
            <div class="search-list clearfix">
                <div class="search-form clearfix">
                    <div class="item">
                        <label class="label">项目</label>
                        <div class="input-text">
                            <el-input v-model="packLeaseQuery.tenantName" :disabled="tenantDisabled" placeholder="项目" type="text"></el-input>
                        </div>
                    </div>
                    <div class="item">
                        <label class="label">费用类型</label>
                        <div class="input-text">
                            <el-select v-model="packLeaseQuery.feeType" placeholder="费用类型" clearable filterable>
                                <el-option v-for="item in packFeeTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="item">
                        <label class="label">费用日期</label>
                        <div class="input-text">
                            <el-date-picker v-model="packLeaseQuery.billDate" type="daterange" range-separator="至" start-placeholder="开始日期"
                                            end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"
                                            unlink-panels></el-date-picker>
                        </div>
                    </div>
                </div>
                <div class="search-btn clearfix">
                    <div class="btn">
                        <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery(enumData.FC_CUST_BILL_ITEM_TYPE.PACKLEASE)">搜索</el-button>
                    </div>
                    <div class="btn">
                        <el-button type="danger" plain size="mini" icon="el-icon-close" @click="initPackLeaseQuery()">清空</el-button>
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
                        <el-tooltip effect="light" content="选择器具租赁费用" placement="right">
                            <img class="tip" src="@/static/image/tip.png" alt="">
                        </el-tooltip>
                    </h3>
                    <div class="table-title-btn">
                        <el-button type="primary" plain size="mini" @click="generateBill()">生成账单</el-button>
                    </div>
                </div>
                <dbTable tableName="fcPackLeaseListTable" ref="packLeaseListTable" :head="packLeaseHead" @dataChange="dataChange" @filter="filter" onlyId="fId" :isFilter="isFilter"></dbTable>
            </div>
        </div>
        <!--        结束        -->

    </div>
</template>

<script>
import selectBillItem from './selectBillItem.js'
export default selectBillItem
</script>

<style lang="scss" scoped>
  #selectBillItem{
    overflow: hidden;
  }
  /deep/ .selStockPage {
    .table-content {
    //   height: calc(100% - 57px) !important;

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
