<template>
    <div id="diffCustReport" class="diffCustReportPage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="diffCustReportSearch"></searchList>
        <!-- <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item" style="width:100%;">
                    <div class="input-text">
                        <monthsPicker ref="picker" @changeData="chooseMonths"></monthsPicker>
                    </div>
                </div>
                <div class="item" style="width:100%;">
                  <div class="input-text">
                    <el-select v-model="custTenantIds" placeholder="请选择客户" multiple filterable>
                      <el-option
                          v-for="item in companyOptions"
                          :key="item.tenantId"
                          :label="item.name"
                          :value="item.tenantId">
                      </el-option>
                    </el-select>
                  </div>
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
          <div class="search-bot">
            <img src="@/static/image/search-bot.png" alt="">
            <i class="icon el-icon-arrow-down"></i>
            <i class="icon el-icon-arrow-up"></i>
          </div>
        </div> -->
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>预实对比列表（客户）</span>
                </h3>
                <div class="table-title-btn">
                    <el-button type="primary" plain size="mini" v-entity :entityId="[{1007013:1007023}]"  @click="downloadExcelFile">导出Excel</el-button>
                </div>
            </div>
            <scrollTable tableName="diffCustReportTable" ref="table" :head="head" :showSetTable="false" :doQrySum="true"></scrollTable>
        </div>

    </div>
</template>

<script>
    import diffCustReport from './diffCustReport.js'

    export default diffCustReport
</script>
<style lang="scss">
.diffCustReportPage{
    .scrollTableComponents{
        height: calc(100% - 50px);
        .table_height{
            height: 100%;
            max-height: initial;
        }
    }
}
</style>
