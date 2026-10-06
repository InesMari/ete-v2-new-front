<template>
    <div id="sectionQuoteManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="sectionQuoteManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>询价列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="询价列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="openAddPage()" v-entity="1002102">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="openUpdatePage()" v-entity="1002103">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteSectionQuote()" v-entity="1002104">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="batchSectionQuote()" v-entity="1002105">批量询价</el-button>
                    <el-button type="primary" plain size="mini" @click="initiateAudit()" v-entity="1002106">发起审计</el-button>
                    <el-button type="primary" plain size="mini" @click="audit()" v-entity="1002107">审计</el-button>
                    <el-button type="primary" plain size="mini" @click="generateQuote" v-entity="1002108">生成报价</el-button>
                </div>
            </div>
            <tableCommon tableName="sectionQuoteManageTable" ref="table" :head="head" :showNum="true" :showSetTable="true"
                         @dblclickItem="dblclickItem" :singleSelect="true">
                <template v-slot:diyColorTd="{item}">
                    <span :style="item.validState==1?'color:red!important':''">{{item.validStateName}}</span>
                </template>
            </tableCommon>
        </div>
    </div>
</template>

<script>
import sectionQuoteManage from './sectionQuoteManage.js'

export default sectionQuoteManage
</script>
<style lang="scss">
</style>
