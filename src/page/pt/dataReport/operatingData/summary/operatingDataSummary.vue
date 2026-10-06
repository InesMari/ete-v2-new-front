<template>
    <div id="operatingDataSummary">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="operatingDataSummarySearch">
        </searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>总运输项目营收预实汇总数据列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="总运输项目营收预实汇总数据列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    
                </div>
            </div>
            <tableCommon tableName="operatingDataSummaryTable" ref="table" :head="head" :showNum="true"
                :showSetTable="true" @dblclickItem="dblclickItem" :singleSelect="true"></tableCommon>
        </div>

    </div>
</template>

<script>
import operatingDataSummary from './operatingDataSummary.js'

export default operatingDataSummary
</script>
<style lang="scss" scoped>

</style>
