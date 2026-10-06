<template>
    <div id="inspectStatisticsManageByMonth">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="inspectStatisticsManageByMonthSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>按月份巡检统计列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                </div>
            </div>
            <tableCommon tableName="inspectStatisticsManageByMonthTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem">
              <template v-slot:diyColorTd="{item}">
                <span style="color:red!important">{{item.ngNums}}</span>
              </template>
            </tableCommon>
        </div>
    </div>
</template>

<script>
import inspectStatisticsManageByMonth from './inspectStatisticsManageByMonth.js'
export default inspectStatisticsManageByMonth
</script>
<style lang="scss">

</style>




