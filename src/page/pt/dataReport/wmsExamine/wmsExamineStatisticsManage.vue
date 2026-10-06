<template>
    <div id="wmsExamineStatisticsManage">
      <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" @clearFn="clearFn" searchKey="wmsExamineStatisticsManageSearch"></searchList>

      <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>核查统计列表</span>
                    <el-tooltip effect="light" content="核查统计列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" v-entity="1007051" @click="viewExamineDetail">核查明细</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1007052" @click="viewDetail">核查统计详情</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1007053" @click="doItemCfg">核查项目维护</el-button>
                </div>
            </div>
            <tableCommon tableName="wmsExamineStatisticsManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head">
              <template v-slot="{item,code}">
                <div>
                  <a href="javascript:void(0);" class="link" @click.stop="goto(item,code)">{{item[code]}}</a>
                </div>
              </template>
            </tableCommon>
        </div>

    </div>
</template>

<script>
import wmsExamineStatisticsManage from './wmsExamineStatisticsManage.js'
export default wmsExamineStatisticsManage
</script>
<style lang="scss">

</style>




