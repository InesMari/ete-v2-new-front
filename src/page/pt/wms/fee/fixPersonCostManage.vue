<template>
    <div id="fixPersonCostManage">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">核算月份：</label>
                    <div class="input-text">
                        <el-date-picker v-model="query.billMonth" type="month" placeholder="核算月份" value-format="yyyy-MM"></el-date-picker>
                    </div>
                </div>
                <div class="item">
                    <label class="label">部门名称：</label>
                    <div class="input-text">
                        <el-input v-model="query.orgName" ></el-input>
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
                    <span>固定人员成本列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="固定人员成本列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="openDialog(true,1)" v-entity="1009027">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="openDialog(true,2)" v-entity="1009028">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteWmsPersonCost" v-entity="1009029">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="importWmsPersonCost" v-entity="1009030">导入</el-button>
                    <el-button type="primary" plain size="mini" @click="exportWmsPersonCost" v-entity="1009031">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="fixPersonCostManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" @dblclickItem="dblclickItem"></tableCommon> 
        </div>

        <my-import :open.sync="uploadOpen" :handle-success="handlesuccess" template="/download/fixPersonCost.xlsx" title="固定人员成本导入"
                   bean="wmsPersonCostService" method="importWmsPersonCost" :param="param"></my-import>

        <!-- begin -->
        <el-dialog :title="title" :visible.sync="showDialog" width="800px" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="openDialog(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item50">
                        <label class="label-term"><em>*</em>核算月份</label>
                        <div class="input-text">
                            <el-date-picker v-model="info.billMonth" :disabled="isOnlySee" type="month" placeholder="核算月份" value-format="yyyy-MM"></el-date-picker>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>部门名称</label>
                        <div class="input-text">
                            <el-select v-model="info.orgId" filterable clearable :disabled="isOnlySee">
                                <el-option v-for="item in orgData" :key="item.id" :label="item.orgName"
                                           :value="item.id"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>人数</label>
                        <div class="input-text">
                            <el-input v-model="info.personCount" maxlength="10" v-mynumval placeholder="请输入人数"
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>固定人员成本</label>
                        <div class="input-text">
                            <el-input v-model="info.personCost" @input="calc" maxlength="10" v-mydoubleval placeholder="请输入金额"
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>社保公积金人数</label>
                        <div class="input-text">
                            <el-input v-model="info.socialPersonCount" maxlength="10" v-mynumval placeholder="请输入人数"
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>社保公积金</label>
                        <div class="input-text">
                            <el-input v-model="info.socialPersonCost" @input="calc" maxlength="10" v-mydoubleval placeholder="请输入金额"
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>合计人力成本</label>
                        <div class="input-text">
                            <el-input v-model="info.totalCost" maxlength="10" v-mydoubleval placeholder="请输入金额"
                                      disabled></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">备注</label>
                        <div class="input-text">
                            <el-input v-model="info.remark" :disabled="isOnlySee" type="textarea" placeholder="说点什么..."></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="openDialog(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="savePersonCost()" v-show="!isOnlySee">提交</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- end -->

    </div>
</template>

<script>
import fixPersonCostManage from './fixPersonCostManage.js'

export default fixPersonCostManage
</script>
<style lang="scss">

</style>

