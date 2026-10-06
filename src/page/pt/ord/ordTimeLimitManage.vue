<template>
    <div id="ordTimeLimitManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="ordTimeLimitManageSearch"></searchList>
        <!-- 列表相关  开始 -->
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>订单时效列表</span>
                    <el-tooltip effect="light" content="订单时效列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" v-entity="1003104"  @click="download()" >导出EXCEL</el-button>
                </div>
            </div>
            <tableCommon tableName="ordTimeLimitManageTable" ref="table" :head="head" :showNum="true" :showSetTable="true">
                <template v-slot:default="{item,code}">
                  <a href="javascript:void(0);" class="link" @click.stop="toDetail(item, code)" style="margin: 0 10px;" v-if="code=='orderNum'||code=='waybillNum'">{{item[code]}}</a>
                  <div v-for="n in 5" :key="n" >
                    <span :style="item[`timeLimit${n}`]==0?'color:red!important':''" v-if="code==`timeLimit${n}Name`">{{item[`timeLimit${n}Name`]}}</span>
                  </div>
                </template>
              <template v-slot:diyColorTd="{item,code}">
              </template>
            </tableCommon>
        </div>
        <!-- 列表相关  结束 -->
    </div>
</template>

<script>
	import ordTimeLimitManage from './ordTimeLimitManage.js'
	export default ordTimeLimitManage
</script>
<style lang="scss">
</style>
