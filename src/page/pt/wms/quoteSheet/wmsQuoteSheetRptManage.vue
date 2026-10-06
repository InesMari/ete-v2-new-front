<template>
    <div id="wmsQuoteSheetRptManage">
      <div class="search-list clearfix">
        <div class="search-form clearfix" @keyup.enter="doQuery()">
          <div class="item">
            <label class="label">物流中心</label>
            <div class="input-text">
              <el-select v-model="query.workId" @change="doQuery" clearable placeholder="物流中心">
                <el-option v-for="item in workList" :key="item.workId" :label="item.workName" :value="item.workId" >
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="item">
            <label class="label">客户</label>
            <div class="input-text">
              <el-select v-model="query.custTenantId" @change="doQuery" clearable placeholder="客户">
                <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name" :value="item.tenantId">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="search-btn clearfix">
          <div class="btn">
            <el-button type="primary" plain size="mini" @click="doQuery" icon="el-icon-search">查询</el-button>
          </div>
          <div class="btn">
            <el-button type="danger" plain size="mini" @click="initQuery()" icon="el-icon-close">清空</el-button>
          </div>
        </div>
        <div class="search-bot">
          <img src="@/static/image/search-bot.png" alt="">
          <i class="icon el-icon-arrow-down"></i>
          <i class="icon el-icon-arrow-up"></i>
        </div>
      </div>
      <div class="table-content">
        <div class="table-title">
          <h3><span>最终价格表<el-tooltip effect="light" content="注：所有价格均含税，为方便建立系统，数字和单位分离，抬头的字段不要重复" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip></span></h3>
          <div class="table-title-btn" style="margin-right: 90px;">
            <el-button type="primary" plain size="mini" @click="downExcel">导出excel</el-button>
          </div>
        </div>
            <tableCommon tableName="wmsQuoteSheetRptManageTable" ref="table" :showNum="true" :showSelect="false"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem"></tableCommon>
        </div>

    </div>
</template>

<script>
import wmsQuoteSheetRptManage from './wmsQuoteSheetRptManage.js'
export default wmsQuoteSheetRptManage
</script>
<style lang="scss" scoped>
</style>




