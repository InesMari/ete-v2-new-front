<template>
    <div id="driverAssessmentManage">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">司机姓名：</label>
                    <div class="input-text">
                        <el-input v-model="query.driverName" placeholder="司机姓名" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">考评月份：</label>
                    <div class="input-text">
                        <el-date-picker v-model="query.assessmentMonth" type="month" placeholder="考评月份" value-format="yyyy-MM"></el-date-picker>
                    </div>
                </div>
                <div class="item">
                    <label class="label">手机号码：</label>
                    <div class="input-text">
                        <el-input v-model="query.driverPhone" placeholder="手机号码" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">所属公司：</label>
                    <div class="input-text">
                        <el-input v-model="query.supplierName" placeholder="所属公司" type="text"></el-input>
                    </div>
                </div>

            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询</el-button>
                </div>
                <div class="btn">
                    <el-button type="danger" plain size="mini" icon="el-icon-close" @click="initQuery()">清空</el-button>
                </div>
            </div>
            <!-- 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 -->
            <div class="search-bot">
                <img src="@/static/image/search-bot.png" alt="">
                <i class="icon el-icon-arrow-down"></i>
                <i class="icon el-icon-arrow-up"></i>
            </div>
        </div>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>司机考评列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="司机考评列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="openPage(1, null)" v-entity="1002125">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="openPage(2, null)" v-entity="1002126">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteDriverAssessment()" v-entity="1002127">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="uploadOpen = true" v-entity="1002207">批量导入</el-button>
                    <el-button type="primary" plain size="mini" @click="download" v-entity="1002217">批量导出</el-button>
                </div>
            </div>
            <tableCommon tableName="driverAssessmentManageTable" ref="table" :showNum="true" :showSetTable="true" :head="head"
                         @dblclickItem="dblclickItem" :singleSelect="true">
            </tableCommon>
        </div>

      <my-import :open.sync="uploadOpen" :handle-success="doQuery" repeatCheckNums="0,1,2"
                 template="/download/driverAssessment.xls" title="司机考评导入" bean="driverAssessmentService"
                 method="impAddDriverAssessment"></my-import>
    </div>
</template>

<script>
import driverAssessmentManage from './driverAssessmentManage.js'

export default driverAssessmentManage
</script>

<style scoped>

</style>
