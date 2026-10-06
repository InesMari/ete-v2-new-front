<template>
  <div id="userRoleList" class="userRoleListPage">
      <div class="common-info" style="border:none;padding:0;">
         <h3 class="common-title mb_20"><span class="title-name">成员管理</span></h3>
          <div class="search-list clearfix">
              <div class="search-form clearfix" style="border-right: 0;" @keyup.enter="loadCurrentRoleBoundUser(query)">
                  <div class="item" style="width: 90%">
                      <label class="label">登录账号：</label>
                      <div class="input-text">
                          <el-input v-model="query.billIdOrUserName" placeholder="登录账号/用户名称" type="text" autocomplete="new-password"></el-input>
                      </div>
                  </div>
              </div>
              <div class="search-btn clearfix">
                  <div class="btn">
                      <el-button type="primary" plain size="mini" icon="el-icon-search"  @click="loadCurrentRoleBoundUser(query)">查询</el-button>
                  </div>
                  <div class="btn">
                      <el-button type="danger" plain size="mini" icon="el-icon-close" @click="clear()">清空</el-button>
                  </div>
              </div>
          </div>
      </div>
      <div class="table-content">
          <div class="table-title">
              <div class="table-title-btn">
                  <el-button type="primary" plain size="mini" @click="isShowAddUserPage(true)">新增成员</el-button>
                  <el-button type="primary" plain size="mini" @click="deleteUserRoleRel()">删除成员</el-button>
              </div>
          </div>
          <tableCommon tableName="userRoleListTable" ref="table" :singleSelect="true" :showNum="true" :showSetTable="false" :head="head"></tableCommon>

          <!-- 新增人员 -->
          <el-dialog title="新增人员" :visible.sync="showAddUserPage" width="300px" style="position: absolute;transform: translateY(-40%);top: 50%;height: 100%;">
              <div class="common-info" style="border:none;padding: 0 30px 20px 0;margin-bottom: 20px;">
                  <ul class="content clearfix">
                      <li class="item">
                          <label class="label-term"><em>*</em>登录账号</label>
                          <el-select v-model="user.billId" style="width: 150px;" @change="changeUser" filterable clearable placeholder="请选择用户">
                              <el-option
                                      v-for="item in users"
                                      :key="item.userId"
                                      :label="item.displayName"
                                      :value="item.billId"
                                      :disabled="item.disabled">
                              </el-option>
                          </el-select>

                      </li>
                      <li class="item">
                          <label class="label-term">角色</label>
                          <div class="input-text">
                              <el-input v-model="user.roleName" disabled></el-input>
                          </div>
                      </li>
                      <li class="item">
                          <label class="label-term">使用人</label>
                          <div class="input-text">
                              <el-input v-model="user.userName" disabled></el-input>
                          </div>
                      </li>
                  </ul>
              </div>
              <div class="page-bot-btn" style="bottom: 20px;margin-left: 10px;">
                  <el-button size="mini" @click="isShowAddUserPage(false)">取消</el-button>
                  <el-button type="primary" size="mini" @click="saveUserRoleRel">提交</el-button>
              </div>
          </el-dialog>
      </div>
  </div>
</template>

<script>
import userRoleList from './userRoleList.js'
export default userRoleList
</script>
<style lang="scss">
.userRoleListPage{
    height: calc(100% - 67px);
    padding: 8px;
    .page-bot-btn{
        position: absolute;
        bottom:30px;
        left: 0;
        width: 100%;
    }
}
.v-modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 0!important;
    height: 0!important;
}
</style>
