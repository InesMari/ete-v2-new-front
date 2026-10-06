<template>
  <div id="roleManage">
    <div class="search-list clearfix">
      <div class="search-form clearfix"  @keyup.enter="doQuery()">
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
          <el-button type="danger" plain size="mini" icon="el-icon-close" @click="clear()" >清空</el-button>
        </div>
      </div>
    </div>
    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>角色列表</span>
          <el-tooltip effect="light" content="提示文字" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn">
          <el-button type="primary" plain size="mini" @click="addRole()" v-entity="1008046">新增角色</el-button>
          <el-button type="primary" plain size="mini" @click="updateRole()" v-entity="1008047">修改角色</el-button>
          <el-button type="danger" plain size="mini" @click="deleteRole()" v-entity="1008048">删除角色</el-button>
        </div>
      </div>
      <tableCommon tableName="roleManageTable" ref="table" :showNum="true" :singleSelect="true" :showSetTable="false" :head="head" v-slot="{item}">
        <div>
          <a href="javascript:void(0);" class="link" @click.stop="loadCurrentRoleBoundUser(item)" style="margin: 0 10px;">成员管理</a>
          <a href="javascript:void(0);" class="link" @click.stop="seeRoleAuth(item)" style="margin: 0 10px;">访问权限</a>
        </div>
      </tableCommon>

    </div>

    <!-- 权限配置 -->
    <div class="popup" :class="{'show':showEntityPage}">
      <div class="popup_bj" @click="isShowEntityPage(false)"></div>
      <div class="popup_content" style="width:40%">
        <authRoleTree ref="authRoleTree"></authRoleTree>
      </div>
    </div>

    <!-- 用户角色列表 -->
    <div class="popup" :class="{'show':showUserRolePage}">
      <div class="popup_bj" @click="isShowUserRoleListPage(false)"></div>
      <div class="popup_content" style="width:50%">
        <userRoleList ref="userRoleList"></userRoleList>
      </div>
    </div>

  </div>
</template>

<script>
import roleManage from './roleManage.js'
export default roleManage
</script>
<style lang="scss">

</style>
