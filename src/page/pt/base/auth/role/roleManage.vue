<template>
  <div id="roleManage" class="roleManagePage">
    <div class="search-list clearfix">
      <div class="search-form clearfix" @keyup.enter="doQuery()">
        <div class="item">
          <label class="label">角色名称：</label>
          <div class="input-text">
            <el-input v-model="query.roleName" placeholder="请输入角色名称" type="text" autocomplete="new-password"></el-input>
          </div>
        </div>
      </div>
      <div class="search-btn clearfix">
        <div class="btn">
          <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery">查询</el-button>
        </div>
        <div class="btn">
          <el-button type="danger" plain size="mini" icon="el-icon-close" @click="clear()">清空</el-button>
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
          <span>角色列表</span>
          <el-tooltip effect="light" content="角色列表" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn">
          <el-button type="primary" plain size="mini" @click="addRole()" v-entity
            :entityId="[{ 1008003: 1008010 }]">新增角色</el-button>
          <el-button type="primary" plain size="mini" @click="copyRole()" v-entity
            :entityId="[{ 1008003: 1008033 }]">复制角色</el-button>
          <el-button type="primary" plain size="mini" @click="updateRole()" v-entity
            :entityId="[{ 1008003: 1008011 }]">修改角色</el-button>
          <el-button type="danger" plain size="mini" @click="deleteRole()" v-entity
            :entityId="[{ 1008003: 1008012 }]">删除角色</el-button>
        </div>
      </div>
      <tableCommon tableName="roleManageTable" ref="table" :showNum="true" :singleSelect="true" :showSetTable="false"
        :head="head" v-slot="{ item }">
        <div>
          <a href="javascript:void(0);" class="link" @click.stop="loadCurrentRoleBoundUser(item)"
            style="margin: 0 10px;">成员管理</a>
          <a href="javascript:void(0);" class="link" @click.stop="seeRoleAuth(item)" style="margin: 0 10px;">访问权限</a>
          <a href="javascript:void(0);" class="link" @click.stop="entityCompare(item)" style="margin: 0 10px;">权限对比</a>
        </div>
      </tableCommon>
    </div>

    <!-- 权限配置 -->
    <div class="popup" :class="{ 'show': showEntityPage }">
      <div class="popup_bj" @click="isShowEntityPage(false)"></div>
      <div class="popup_content" style="width:40%">
        <authRoleTree ref="authRoleTree" :title="authRoleTreeTitle"></authRoleTree>
      </div>
    </div>

    <!-- 用户角色列表 -->
    <div class="popup" :class="{ 'show': showUserRolePage }">
      <div class="popup_bj" @click="isShowUserRoleListPage(false)"></div>
      <div class="popup_content" style="width:50%">
        <userRoleList ref="userRoleList"></userRoleList>
      </div>
    </div>


    <!-- 选择对比角色 -->
    <el-dialog title="选择要对比的角色" :visible.sync="showDialog" width="340px" :close-on-click-modal="false"
      :close-on-press-escape="false">
      <div class="common-info" style="border:none;padding:0;">
        <ul class="content clearfix">
          <li class="item item100">
            <label class="label-term">角色</label>
            <div class="input-text">
              <el-select v-model="compareRoleId" clearable filterable placeholder="请选择">
                <el-option v-for="item in roleData" :disabled="item.roleId == currentItem.roleId" :key="item.roleId" :label="item.roleName" :value="item.roleId">
                </el-option>
              </el-select>
            </div>
          </li>
        </ul>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="showDialog = false">关闭</el-button>
          <el-button type="primary" size="mini" @click="sureRole">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import roleManage from './roleManage.js'
export default roleManage
</script>
<style lang="scss">
.roleManagePage {
  .popup_content {
    min-width: 550px;
  }
}
</style>
