<template>
    <div id="positionManage" class="positionManagePage">
      <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="staffManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>岗位列表</span>
                    <el-tooltip effect="light" content="岗位列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="addPosition()" v-entity :entityId="1008030">新增岗位
                    </el-button>
                    <el-button type="primary" plain size="mini" @click="updatePosition()" v-entity :entityId="1008031">修改岗位
                    </el-button>
                    <el-button type="primary" plain size="mini" @click="deletePosition()" v-entity :entityId="1008032">删除岗位
                    </el-button>
                </div>
            </div>
            <tableCommon class="diyTable" tableName="positionManageTable" ref="table" :showSetTable="true" :head="head"
                         :singleSelect="true">
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
                        <div class="title">岗位人员：</div>
                        <div class="groupItem" v-for="(group,index) in item.positionStaffNames" :key="index">
                            {{ (index + 1) + ":" + group }}
                        </div>
                    </div>
                </template>
            </tableCommon>
        </div>

        <!--      新增修改岗位-->
        <el-dialog :title="title" :visible.sync="dialogShow" :close-on-click-modal="false"
                   :close-on-press-escape="false" width="450px" @close="openDialog(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>岗位名称</label>
                        <div class="input-text">
                            <el-input v-model="info.positionName"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">备注</label>
                        <div class="input-text">
                            <el-input v-model="info.remark"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">岗位人员</label>
                        <div class="input-text">
                            <el-select v-model="info.staffIds" clearable multiple filterable placeholder="请选择岗位人员">
                                <el-option v-for="item in staffData" :key="item.id" :label="item.staffName"
                                           :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="openDialog(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="saveOrUpdatePosition()">提交</el-button>
                </div>
            </div>
        </el-dialog>
        <!--      新增修改岗位-->

    </div>
</template>

<script>
import positionManage from './positionManage.js'

export default positionManage
</script>
<style lang="scss">
.positionManagePage {
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
