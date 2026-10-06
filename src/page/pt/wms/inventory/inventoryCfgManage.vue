<template>
  <div id="inventoryCfgManage">
    <!-- 列表相关  开始 -->
    <div class="search-list clearfix">
      <div class="search-form clearfix" @keyup.enter="doQuery()">
        <div class="item">
          <label class="label">仓库名称：</label>
          <div class="input-text">
            <el-input v-model="query.workName" placeholder="仓库名称" type="text"
                      autocomplete="new-password"></el-input>
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
          <span>仓库点检配置列表</span>
          <el-tooltip effect="light" content="仓库点检配置列表" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" v-entity="1005080" @click="displayAdd">新增点检配置</el-button>
          <el-button type="primary" plain size="mini" v-entity="1005081" @click="displayUpdate">修改点检配置</el-button>
          <el-button type="danger" plain size="mini" v-entity="1005082" @click="toDel">删除点检配置</el-button>
        </div>
      </div>
      <tableCommon tableName="inventoryCfgManageTable" ref="table" :head="head" :showNum="true"
                   :showSetTable="true" :single-select="true" @dblclickItem="displayView"></tableCommon>
    </div>

    <el-dialog class="dialog" :title="title" :visible.sync="dialogShow" width="70%"
               :close-on-click-modal="false" :close-on-press-escape="false" @close="showDialog(false)">
      <div  class="table_height orderInfo">
        <div class="common-info" style="border:none;padding:0;margin-top: -15px;">
            <ul class="content clearfix">
              <li class="item item100">
                <label class="label-term">仓库：</label>
                <div class="input-text">
                  <el-select v-model="inventoryInfo.baseInfo.workStoreId" style="width: 30%;" :disabled="dialogType==3" filterable clearable placeholder="仓库">
                    <el-option v-for="item in workList" :key="item.workId" :label="item.workName"
                               :value="item.workId"></el-option>
                  </el-select>
                </div>
              </li>
            </ul>
            <ul class="content clearfix">
              <li class="item item100">
                <label class="label-term">出租方：</label>
                <div class="input-text">
                  <el-input v-model="inventoryInfo.baseInfo.leaser" placeholder="出租方" type="text"
                            autocomplete="new-password" style="width: 30%;" @input="forceUpdate" :disabled="dialogType==3"></el-input>
                </div>
              </li>
            </ul>
            <ul class="content clearfix" >
              <li class="item item100">
                <label class="label-term">地址：</label>
                <div class="input-text">
                  <el-input v-model="inventoryInfo.baseInfo.address" placeholder="地址" type="text"
                            autocomplete="new-password" style="width: 30%;" @input="forceUpdate" :disabled="dialogType==3"></el-input>
                </div>
              </li>
            </ul>
        </div>
        <table class="tableCommon mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
            <tr>
              <th width="100"><em>*</em>名称</th>
              <th width="100">规格型号</th>
              <th width="120">单位</th>
              <th width="100"><em>*</em>数量</th>
              <th width="90">生产厂家</th>
              <th width="90">备注</th>
              <th width="80">移交状态</th>
              <th width="50" v-show="dialogType!=3">
                <el-tooltip effect="dark" content="添加" placement="top-start" :hide-after='1000'>
                  <span @click="add()" class="add"></span>
                </el-tooltip>
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in inventoryInfo.dtlInfo">
              <td>
                <el-input v-model="item.name" type="text" maxlength="100" placeholder="" @input="forceUpdate"  :disabled="dialogType==3"></el-input>
              </td>
              <td>
                <el-input v-model="item.model" type="text" maxlength="50" placeholder="" @input="forceUpdate"  :disabled="dialogType==3"></el-input>
              </td>
              <td>
                <el-input v-model="item.unit" type="text" maxlength="50" placeholder="" @input="forceUpdate"  :disabled="dialogType==3"></el-input>
              </td>
              <td>
                <el-input v-model="item.nums" type="text" maxlength="50" placeholder="" @input="forceUpdate"  :disabled="dialogType==3"></el-input>
              </td>
              <td>
                <el-input v-model="item.manufacturer" type="text" maxlength="200" placeholder="" @input="forceUpdate"  :disabled="dialogType==3"></el-input>
              </td>
              <td>
                <el-input v-model="item.remark" type="text" maxlength="200" placeholder="" @input="forceUpdate"  :disabled="dialogType==3"></el-input>
              </td>
              <td>
                <el-switch v-model="item.transferState == 1" @change="changeSwitch(item)" active-color="#13ce66" inactive-color="#ff4949"  :disabled="dialogType==3"></el-switch>
                <span class="name">{{item.transferState == 1 ? "是" : "否"}}</span>
              </td>
              <td v-show="dialogType!=3">
                <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000'>
                  <span @click="remove(index)" class="del"></span>
                </el-tooltip>
              </td>
            </tr>
            </tbody>
          </table>
      </div>
      <div class="bot-btn">
        <el-button size="mini" @click="dialogShow=false">关闭</el-button>
        <el-button size="mini" type="primary" @click="toCommit" v-show="dialogType!=3">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import inventoryCfgManage from './inventoryCfgManage.js'
export default inventoryCfgManage
</script>

<style lang="scss">
#inventoryCfgManage{
  .dialog{
    .tableCommon{
      table-layout: fixed;
      .el-input__inner{
        text-align: center;
      }
      .el-date-editor.el-input{
        width: 100%;
      }
    }
    .add{
      vertical-align: middle;
      @include add;
    }
    .del{
      vertical-align: middle;
      @include del;
    }
    .switchDiv {
      padding: 2px 8px;
      border: 1px solid $main-color;
      border-radius: 3px;
      color: $main-color;
      display: inline-block;
      margin-left: 10px;
      vertical-align: top;
      cursor: pointer;

      .name {
        vertical-align: middle;
        margin-left: 8px;
      }

      // &:hover{
      //   color: #fff;
      //   background: $main-color;
      // }
    }
  }
}
</style>
