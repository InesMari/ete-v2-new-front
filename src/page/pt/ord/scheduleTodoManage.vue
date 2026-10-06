<template>
    <div id="scheduleTodoManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="scheduleTodoManageSearch"></searchList>
        <!-- 列表相关  开始 -->
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>运力&计划匹配列表</span>
                    <el-tooltip effect="light" content="运力&计划匹配列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                </div>
            </div>
            <tableCommon tableName="scheduleTodoManageTable" ref="table" :head="head" :showNum="true" :showSetTable="true">
                <template v-slot:default="{item}">
                    <a href="javascript:void(0);" class="link" @click.stop="gotoScheduleManage(item)">{{item.count}}</a>
                </template>
            </tableCommon>
        </div>
        <!-- 列表相关  结束 -->
    </div>
</template>

<script>
	import scheduleTodoManage from './scheduleTodoManage.js'
	export default scheduleTodoManage
</script>
<style lang="scss">
</style>
