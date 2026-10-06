<template>
    <div id="answerSheetManager">
      <searchList :formData="formData" @doQuery="doQuery" :query="loadParam"></searchList>

      <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>答卷明细列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1007131" @click="downloadExcel">导出</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1007048" @click="toDetail">查看详情</el-button>
                </div>
            </div>
            <tableCommon tableName="answerSheetManagerTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem"></tableCommon>
        </div>

    </div>
</template>

<script>
import answerSheetManager from './answerSheetManager.js'
export default answerSheetManager
</script>
<style lang="scss">

</style>




