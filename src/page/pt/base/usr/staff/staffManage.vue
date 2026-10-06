<template>
    <div id="staffManage" class="staffManagePage">
      <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="staffManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>人员列表</span>
                    <el-tooltip effect="light" content="人员列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" @click="showStaffDialog(1)" v-entity :entityId="[{1008004:1008013}]">新增人员</el-button>
                  <el-button type="primary" plain size="mini" @click="showStaffDialog(2)" v-entity :entityId="[{1008004:1008014}]">修改人员</el-button>
                  <el-button type="danger" plain size="mini" @click="deleteStaff()" v-entity :entityId="[{1008004:1008015}]">删除人员</el-button>
                  <el-button type="danger" plain size="mini" @click="changeUserSts()" v-entity="1008066">启用/禁用</el-button>
                  <el-button type="danger" plain size="mini" @click="kickAllUserEnds()" v-entity="1008065">全员下线</el-button>
                </div>
            </div>
            <tableCommon class="diyTable" tableName="staffManageTable" ref="table" :showNum="true" :showSetTable="true" :head="head" :singleSelect="true" @changeRows="changeRows">
                <template v-slot:default="{item,index}">
                    <div v-if="!item.showInfo" @click.stop="showInfo(item,index)">
                        <i class="el-icon-arrow-right"></i>
                    </div>
                    <div v-if="item.showInfo" @click.stop="hideInfo(item,index)">
                        <i class="el-icon-arrow-down"></i>
                    </div>
                </template>
                <template v-slot:diytr="{item}">
                    <div class="diytr">
                        <div class="title">所属区域部门：</div>
                        <div class="groupItem" v-for="(group,index) in item.regionOrgInfoStr" :key="index">
              <span v-for="(g,$index) in group" :key="$index">
                {{ g }}
                <span v-if="$index!=group.length-1" style="margin:0 8px;">·</span>
              </span>
                        </div>
                    </div>
                </template>
                <template v-slot:diyColorTd="{item}">
                    <span :style="item.state==0?'color:red!important':''">{{ item.stateName }}</span>
                </template>
            </tableCommon>
        </div>

        <!--      新增修改人员-->
        <el-dialog :title="dialogTitle" :visible.sync="staffDialogShow" :close-on-click-modal="false"
                   :close-on-press-escape="false" width="450px" @close="close()">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>登录账号</label>
                        <div class="input-text">
                            <el-input v-model="form.billId" @change="checkBillId()" v-mynumval></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>使用人</label>
                        <div class="input-text">
                            <el-input v-model="form.userName"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">邮箱</label>
                        <div class="input-text">
                            <el-input v-model="form.email"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">备注</label>
                        <div class="input-text">
                            <el-input v-model="form.remark"></el-input>
                        </div>
                    </li>
                  <li class="item item100">
                    <label class="label-term">岗位</label>
                    <div class="input-text">
                      <el-select v-model="form.positionId" clearable filterable placeholder="请选择">
                        <el-option v-for="item in positionData" :key="item.id" :label="item.positionName"
                                   :value="item.id">
                        </el-option>
                      </el-select>
                    </div>
                  </li>
                    <li class="item item100">
                        <label class="label-term">角色</label>
                        <div class="input-text">
                            <el-select v-model="form.roleIds" clearable multiple filterable placeholder="请选择">
                                <el-option v-for="item in roleData" :key="item.roleId" :label="item.roleName"
                                           :value="item.roleId">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">数据权限</label>
                        <div class="input-text">
                            <el-select v-model="form.permissionId" clearable filterable placeholder="请选择">
                                <el-option v-for="item in permissionData" :key="item.id" :label="item.name"
                                           :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">区域部门</label>
                        <div class="input-text">
                            <el-tree ref="elTree" :data="orgData" show-checkbox check-strictly="true" node-key="elId"
                                     :default-expanded-keys="selData" :default-checked-keys="selData"
                                     @check-change="regionOrgReact"
                                     :props="{children: 'sonList',label: 'name'}">
                            </el-tree>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="close()">关闭</el-button>
                    <el-button type="primary" size="mini" @click="addStaff()">提交</el-button>
                </div>
            </div>
        </el-dialog>
        <!--      新增修改人员-->

    </div>
</template>

<script>
import staffManage from './staffManage.js'

export default staffManage
</script>
<style lang="scss">
.staffManagePage {
  .diyTable {
    [class^=el-icon-] {
      color: #333;
      font-weight: bold;
    }
  }

  .diytr {
    text-align: left;
    padding: 10px 0 15px 50px;

    .title {
      font-size: 14px;
      font-weight: bold;
      line-height: 30px;
    }

    .groupItem {
      font-size: 14px;
      font-weight: bold;
    }
  }
}
</style>
