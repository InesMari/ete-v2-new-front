<template>
    <div id="fcExamineItemInfoManage">
      <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="fcExamineItemInfoSearch"></searchList>

      <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>财务绩效指标列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="财务绩效指标列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1007034" @click="addItem">新增</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1007035" @click="updateItem">修改</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1007036" @click="deleteItem">删除</el-button>
                </div>
            </div>
            <tableCommon tableName="fcExamineItemInfoManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem"></tableCommon>
        </div>

      <!--        新增/修改数据       -->
      <el-dialog :title="title" :visible.sync="showDialog" width="40%" :close-on-click-modal="false"
                 :close-on-press-escape="false" @close="openDialog(false)">
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix">
            <li class="item item50">
              <label class="label-term"><em>*</em>考核指标名称</label>
              <div class="input-text">
                <el-input v-model="item.itemName" maxlength="50" placeholder="请输入考核指标名称"
                          :disabled="isLock"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term"><em>*</em>数据来源</label>
              <div class="input-text">
                <el-select v-model="item.srcOrgId" placeholder="请选择类型" filterable clearable
                           :disabled="isLock">
                  <el-option v-for="item in srcOrgData" :key="item.id"
                             :label="item.orgName"
                             :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term"><em>*</em>一级部门</label>
              <div class="input-text">
                <el-select v-model="item.firstOrgId" placeholder="请选择一级部门" filterable clearable
                           @change="changeRegionSelect2"
                           :disabled="isLock">
                  <el-option v-for="item in regionData" :key="item.id"
                             :label="item.regionName"
                             :value="item.id">

                  </el-option>
                </el-select>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term"><em>*</em>二级部门</label>
              <div class="input-text">
                <el-select v-model="item.secondOrgId" placeholder="请选择二级部门" filterable clearable
                           :disabled="isLock">
                  <el-option v-for="item in secondOrgData" :key="item.id"
                             :label="item.orgName"
                             :value="item.id">

                  </el-option>
                </el-select>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">月度目标</label>
              <div class="input-text">
                <el-input v-model="item.monthTarget"  placeholder="请输入月度目标"
                          :disabled="isLock" maxlength="10"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">年度目标</label>
              <div class="input-text">
                <el-input v-model="item.yearTarget"  placeholder="请输入年度目标"
                          :disabled="isLock" maxlength="10"></el-input>
              </div>
            </li>
            <li class="item item100" style="width:98%;">
              <label class="label-term">备注</label>
              <div class="input-text">
                <el-input v-model="item.remark" maxlength="50" placeholder="写点什么?"
                          :disabled="isLock"></el-input>
              </div>
            </li>
          </ul>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="openDialog(false)">关闭</el-button>
            <el-button type="primary" size="mini" @click="saveOrUpdateItem()" v-if="!isLock">确认
            </el-button>
          </div>
        </div>
      </el-dialog>
      <!--        新增/修改数据       -->

    </div>
</template>

<script>
import fcExamineItemInfoManage from './fcExamineItemInfoManage.js'
export default fcExamineItemInfoManage
</script>
<style lang="scss">

</style>




