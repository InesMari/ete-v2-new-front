<template>
    <div id="applicationManage">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">客户名称：</label>
                    <div class="input-text">
                        <el-input v-model="query.tenantName" placeholder="客户名称" type="text"></el-input>
                    </div>
                </div>
                <div class="search-btn clearfix">
                    <div class="btn">
                        <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询
                        </el-button>
                    </div>
                    <div class="btn">
                        <el-button type="danger" plain size="mini" icon="el-icon-close" @click="initQuery()">清空
                        </el-button>
                    </div>
                </div>
                <!-- 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 -->
                <div class="search-bot">
                    <img src="@/static/image/search-bot.png" alt="">
                    <i class="icon el-icon-arrow-down"></i>
                    <i class="icon el-icon-arrow-up"></i>
                </div>
            </div>
        </div>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>应用管理列表</span>
                </h3>
                <div class="table-title-btn">
                    <el-button type="primary" plain size="mini" v-entity="1001020" @click="openAddDialog">新增</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1001021" @click="openUpdateDialog">修改</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1001022" @click="deleteApplication">删除</el-button>
                </div>
            </div>
            <tableCommon tableName="applicationManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="false" :head="head"></tableCommon>
        </div>

        <el-dialog :title="title" :visible.sync="showDialog" :close-on-click-modal="false"
                   :close-on-press-escape="false" width="600px" @close="showDialog=false">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100" >
                        <label class="label-term"><em>*</em>客户</label>
                        <div class="input-text">
                            <el-select v-model="info.tenantId" filterable clearable
                                       placeholder="请选择客户" >
                                <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name"
                                           :value="item.tenantId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100" >
                        <label class="label-term"><em>*</em>应用名称</label>
                        <div class="input-text">
                            <el-input v-model="info.name" placeholder="应用名称" type="text"></el-input>
                        </div>
                    </li>
                    <li class="item item100" >
                        <label class="label-term">备注</label>
                        <div class="input-text">
                            <el-input v-model="info.remark" placeholder="说点什么" type="textarea"></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="openDialog(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="saveOrUpdateApplication">提交</el-button>
                </div>
            </div>
        </el-dialog>
    </div>


</template>

<script>
import applicationManage from './applicationManage.js'

export default applicationManage
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>
