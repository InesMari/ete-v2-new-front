<template>
    <div id="permissionManage">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">数据权限名称</label>
                    <div class="input-text">
                            <el-input v-model="query.name" placeholder="数据权限名称" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">用户名称</label>
                    <div class="input-text">
                        <el-input v-model="query.userName" placeholder="搜索关联用户" type="text"></el-input>
                    </div>
                </div>
            </div>

            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery">查询</el-button>
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
                    <span>数据权限列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="数据权限列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1008055" @click="addPermission">新增</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1008056" @click="copyPermission">复制</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1008057" @click="updatePermission">修改</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1008058" @click="deletePermission">删除</el-button>
                    <el-button type="success" plain size="mini" v-entity="1008059" @click="bindUser">绑定人员</el-button>
                </div>
            </div>
            <tableCommon tableName="permissionManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem">
            </tableCommon>
        </div>

        <el-dialog :title="title" :visible.sync="dialogShow" :close-on-click-modal="false"
                   :close-on-press-escape="false" width="450px" @close="openDialog(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>数据权限名称</label>
                        <div class="input-text">
                            <el-input v-model="info.authName" disabled></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">关联人员</label>
                        <div class="input-text">
                            <el-select v-model="info.userIds" clearable multiple filterable placeholder="请选择关联人员">
                                <el-option v-for="item in staffData" :key="item.userId" :label="item.staffName"
                                           :value="item.userId">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="openDialog(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="bindUserPermissionById()">提交</el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import permissionManage from './permissionManage.js'
export default permissionManage
</script>
<style lang="scss">

</style>




