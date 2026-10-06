<template>
  <div id="hzStaffManage">
    <div class="search-list clearfix">
      <div class="search-form clearfix" @keyup.enter="doQuery()">
        <div class="item">
          <label class="label">登录账号：</label>
          <div class="input-text">
            <el-input v-model="query.keyword" placeholder="请输入登录账号或使用人" type="text"></el-input>
          </div>
        </div>
      </div>
      <div class="search-btn clearfix">
        <div class="btn">
          <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询</el-button>
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
          <span>人员列表</span>
          <el-tooltip effect="light" content="人员列表" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn">
          <el-button type="primary" plain size="mini" @click="showStaffDialog(1)" v-entity="1008050">新增人员</el-button>
          <el-button type="primary" plain size="mini" @click="showStaffDialog(2)" v-entity="1008051">修改人员</el-button>
          <el-button type="danger" plain size="mini" @click="deleteStaff()" v-entity="1008052">删除人员</el-button>
        </div>
      </div>
      <tableCommon tableName="hzStaffManageTable" ref="table" :showNum="true" :showSetTable="false" :head="head"></tableCommon>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="staffDialogShow" :close-on-click-modal="false" :close-on-press-escape="false" width="450px" @close="close()">
      <div class="common-info" style="border:none;padding:0;">
        <ul class="content clearfix">
          <li class="item item100">
            <label class="label-term"><em>*</em>登录账号</label>
            <div class="input-text">
              <el-input v-model="form.billId" @change="checkBillId()"></el-input>
            </div>
          </li>
          <li class="item item100">
            <label class="label-term"><em>*</em>使用人</label>
            <div class="input-text">
              <el-input v-model="form.userName"></el-input>
            </div>
          </li>
          <li class="item item100">
            <label class="label-term">角色</label>
            <div class="input-text">
              <el-select v-model="form.roleIds" multiple filterable placeholder="请选择">
                <el-option
                    v-for="item in roleData"
                    :key="item.roleId"
                    :label="item.roleName"
                    :value="item.roleId">
                </el-option>
              </el-select>
            </div>
          </li>
        </ul>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="close()">关闭</el-button>
          <el-button type="primary" size="mini" @click="addStaff()">提交</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import hzStaffManage from './staffManage.js'
export default hzStaffManage
</script>
<style lang="scss">

</style>
