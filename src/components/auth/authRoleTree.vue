<template>
  <div id="authRoleTree" ref="authRoleTree" class="authRoleTreePage">
      <div class="common-info" style="border:none;padding:0;position: sticky;top:0;z-index: 99;">
        <h3 class="common-title mb_20" v-if="title"><span class="title-name">{{title}}</span></h3>
        <ul class="content clearfix">
            <li class="item" v-show="isShowRole">
                <label class="label-term"><em>*</em>角色名称</label>
                <div class="input-text">
                    <el-input v-model="role.roleName" :disabled="isOnlySee" maxlength="50" show-word-limit></el-input>
                </div>
            </li>
            <li class="item" v-show="isShowRole">
                <label class="label-term">角色描述</label>
                <div class="input-text">
                    <el-input v-model="role.roleDescribe" :disabled="isOnlySee" maxlength="255" show-word-limit></el-input>
                </div>
            </li>
            <li class="item">
                <label class="label-term">搜索</label>
                <div class="input-text">
                    <el-input v-model="search" @input="doSearch" ></el-input>
                </div>
            </li>
            <li class="item" style="line-height:40px;">
                <el-checkbox class="fl" @change="doSelectSet($event,1)" style="margin-left:25px;">全选</el-checkbox>
                <el-checkbox class="fl" @change="doSelectSet($event,0)">不选</el-checkbox>
            </li>
          <li class="item item98" style="line-height:40px;display: flex; justify-content: center; align-items: center;">
            <el-button @click="toggleExpand">切换展开/收缩</el-button>
          </li>
        </ul>
      </div>
      <myElTree
          v-if="openPanel"
          :data="treeData"
          show-checkbox
          check-strictly
          node-key="id"
          ref="tree"
          :props="defaultProps"
          default-expand-all
          :check-on-click-node="true"
          :default-checked-keys="setCheckedKeys(treeDataArray)"
          @check="dealNode">
      </myElTree>
    <div class="page-bot-btn">
        <el-button size="small" @click="cancel()">取消</el-button>
        <el-button type="primary" size="small" @click="submit()">提交</el-button>
    </div>
  </div>
</template>

<script>
import authRoleTree from './authRoleTree.js'
export default authRoleTree
</script>
<style lang="scss" scoped>
.authRoleTreePage{
    height: 100%;
    box-sizing: border-box;
    overflow: auto;
    padding: 0 8px;
    .page-bot-btn{
        bottom: 0;
        left: 0;
        width: 100%;
        position: sticky;
        z-index: 9;
        background: #fff;
        padding: 10px 0;
    }
}
</style>
