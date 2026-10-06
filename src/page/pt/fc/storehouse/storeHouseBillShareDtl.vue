<template>
  <div id="storeHouseBillShareDtl">

    <div class="search-list clearfix">
      <div class="search-form clearfix">
<!--        <div class="item">-->
<!--          <label class="label">仓库名称：</label>-->
<!--          <div class="input-text">-->
<!--            <el-select v-model="query.storeHouseId" placeholder="仓库名称" filterable clearable>-->
<!--              <el-option v-for="item in storeHouseOptions" :key="item.workId" :label="item.workName" :value="item.workId" >-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--          </div>-->
<!--        </div>-->
        <div class="item">
          <label class="label">客户：</label>
          <div class="input-text">
            <el-select v-model="query.custId" placeholder="客户" filterable clearable>
              <el-option v-for="item in hzTenantOptions" :key="item.custId" :label="item.name" :value="item.custId" >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="item">
          <label class="label">供应商：</label>
          <div class="input-text">
            <el-select v-model="query.supplierTenantId" placeholder="供应商" filterable clearable>
              <el-option v-for="supplier in supplierData" :key="supplier.tenantId" :label="supplier.supplierName"
                         :value="supplier.tenantId"></el-option>
            </el-select>
          </div>
        </div>
        <div class="item">
          <label class="label">仓库地址：</label>
          <div class="input-text">
            <el-input v-model="query.workAddressStr" placeholder="仓库地址" type="text"></el-input>
          </div>
        </div>
        <div class="item">
          <label class="label">费用产生月份：</label>
          <div class="input-text">
            <el-date-picker v-model="query.billMonth" type="month" placeholder="请选择" value-format="yyyy-MM"></el-date-picker>
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
    </div>


    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>成本分摊明细列表</span>
          <el-tooltip effect="light" content="成本分摊明细列表" placement="right">
<!--            <img class="tip" src="@/static/image/tip.png" alt="">-->
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
<!--          <el-button type="primary" plain size="mini" @click="displayDialog(3)" v-entity="104">查看</el-button>-->
        </div>
      </div>
      <tableCommon tableName="storeHouseBillShareDtlTable" ref="table" :showNum="true" :showSetTable="true" :head="head" :singleSelect="true"></tableCommon>
    </div>

  </div>
</template>

<script>
import storeHouseBillShareDtl from './storeHouseBillShareDtl.js'
export default storeHouseBillShareDtl
</script>

<style scoped>

</style>
