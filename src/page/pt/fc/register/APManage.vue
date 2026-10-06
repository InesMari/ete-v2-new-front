<template>
    <div id="APManage" class="orderManagePage ">
      <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="APManageSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>应付汇总列表</span>
                    <el-tooltip effect="light" content="应付汇总列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                </div>
            </div>
            <tableCommon tableName="APManageTable" ref="table" :showNum="true" :singleSelect="true" :showSetTable="true" :head="head"
                         @dblclickItem="dblclickItem">
            </tableCommon>
        </div>
    </div>
</template>

<script>
	import APManage from './APManage.js'
	export default APManage
</script>
<style lang="scss">
  @import '@/page/pt/fc/fc_common.scss';
</style>





