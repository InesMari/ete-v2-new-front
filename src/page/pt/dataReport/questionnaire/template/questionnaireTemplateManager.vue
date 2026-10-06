<template>
    <div id="questionnaireTemplateManager">
      <searchList :formData="formData" @doQuery="doQuery" :query="loadParam"></searchList>

      <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>问卷模板管理列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1007039" @click="toAdd">新增</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1007040" @click="toUpdate">修改</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1007041" @click="del">删除</el-button>
                </div>
            </div>
            <tableCommon tableName="questionnaireTemplateManagerTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem"></tableCommon>
        </div>
    </div>
</template>

<script>
import questionnaireTemplateManager from './questionnaireTemplateManager.js'
export default questionnaireTemplateManager
</script>
<style lang="scss" scoped>
#questionnaireTemplateManager{

}
</style>




