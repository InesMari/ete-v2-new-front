<template>
  <div id="inventoryManage">
    <select-work v-show="showSelWork"></select-work>
    <!-- 列表相关  开始 -->
    <div class="search-list clearfix" v-show="!showSelWork">
      <div class="search-form clearfix" @keyup.enter="doQuery()">
        <div class="item">
          <label class="label">点检月份：</label>
          <div class="input-text">
            <el-input v-model="query.month" placeholder="点检月份" type="text"
                      autocomplete="new-password"></el-input>
          </div>
        </div>
        <div class="item">
          <label class="label">点检名称：</label>
          <div class="input-text">
            <el-input v-model="query.inventoryName" placeholder="点检名称" type="text"
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

    <div class="table-content" v-show="!showSelWork">
      <div class="table-title">
        <h3>
          <span>仓库点检列表</span>
          <el-tooltip effect="light" content="仓库点检列表" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" v-entity="1005083" @click="displayAdd">新增点检</el-button>
          <el-button type="primary" plain size="mini" v-entity="1005084" @click="displayUpdate">修改点检</el-button>
          <el-button type="danger" plain size="mini" v-entity="1005085" @click="toDel">删除点检</el-button>
          <el-button type="primary" plain size="mini" v-entity="1005086" @click="displayComfirm">确认点检</el-button>
        </div>
      </div>
      <tableCommon tableName="inventoryManageTable" ref="table" :head="head" :showNum="true"
                   :showSetTable="true" :single-select="true" @dblclickItem="displayView"></tableCommon>
    </div>

    <el-dialog class="dialog" :title="title" :visible.sync="dialogShow" width="90%"
               :close-on-click-modal="false" :close-on-press-escape="false" @close="showDialog(false)">
      <div  class="table_height orderInfo" style="position: relative;z-index: 1000;">
        <div class="common-info" style="border:none;padding:0;margin-top: -15px;">
            <ul class="content clearfix">
              <li class="item item100">
                <label class="label-term">出租方：</label>
                <div class="input-text">{{ inventoryInfo.baseInfo.leaser }}
                </div>
              </li>
            </ul>
            <ul class="content clearfix" >
              <li class="item item100">
                <label class="label-term">地址：</label>
                <div class="input-text">{{ inventoryInfo.baseInfo.address }}
                </div>
              </li>
            </ul>
            <ul class="content clearfix" >
              <li class="item item100">
                <label class="label-term">点检月份：</label>
                <div class="input-text">
                  <el-input v-model="inventoryInfo.baseInfo.month" placeholder="点检月份" type="text"
                            autocomplete="new-password" style="width: 30%;" @input="forceUpdate" :disabled="dialogType==3||dialogType==4"></el-input>
                </div>
              </li>
            </ul>
            <ul class="content clearfix" >
              <li class="item item100">
                <label class="label-term">点检名称：</label>
                <div class="input-text">
                  <el-input v-model="inventoryInfo.baseInfo.inventoryName" placeholder="点检名称" type="text"
                            autocomplete="new-password"  style="width: 30%;" @input="forceUpdate" :disabled="dialogType==3||dialogType==4"></el-input>
                </div>
              </li>
            </ul>
        </div>
        <div style="overflow: auto;max-height: 400px;">
          <scrollTable ref="scrollTable" :head="headDtl">
            <template v-slot="{item,code,index}">
              <div v-if="code=='transferState'">
                <el-switch v-model="item.transferState == 1"  active-color="#13ce66" inactive-color="#ff4949" :disabled="true"></el-switch>
                <span class="name">{{item.transferState == 1 ? "是" : "否"}}</span>
              </div>
              <div v-if="code=='inventoryState'">
                <el-switch v-model="item.inventoryState == 1" @change="changeSwitch(item)" active-color="#13ce66" inactive-color="#ff4949"  :disabled="dialogType==3||dialogType==4"></el-switch>
                <span class="name">{{item.inventoryState == 1 ? "正常" : "异常"}}</span>
              </div>
              <div v-if="code=='inventoryFile'">
                  <a class="imgtxt link" v-for="(img,i) in item.imgs" @click="viewImage(item.imgs,i)">
                    图片{{ i+1 }}
                    <i class="el-icon-error red" @click.stop="delImg(item.imgs,i)" v-if="dialogType!=3&&dialogType!=4"></i>
                  </a>
                  <myFileModel v-show="!item.hidefilemodel" :ref="'inventoryFile'+index" clickType="txtOnlyUp" @successCallback="fileCallback($event,item)" :disabled="dialogType==3||dialogType==4"></myFileModel>
              </div>
              <div v-if="code=='inventoryRemark'">  
                <el-input v-model="item.inventoryRemark" type="text" placeholder=""  :disabled="dialogType==3||dialogType==4"></el-input>
              </div>
            </template>
          </scrollTable>
        </div>
      </div>
      <div class="bot-btn">
        <el-button size="mini" @click="dialogShow=false">关闭</el-button>
        <el-button size="mini" type="primary" @click="toCommit" v-show="dialogType!=4">确定</el-button>
      </div>
    </el-dialog>

    <fileViewer ref="viewer" :url-list="imageUrls" :initialIndex="imgViewIndex"></fileViewer>

  </div>
</template>

<script>
import inventoryManage from './inventoryManage.js'
export default inventoryManage
</script>

<style lang="scss" scoped>
#inventoryManage{
  /deep/ .el-image-viewer__wrapper{
    z-index: 99999!important;
  }
  .dialog{
    /deep/ .myFileModel{
      display: inline-block;
      vertical-align: middle;
    }
    /deep/ .tableCommon tbody tr td{
      height: 35px;
    }
    .imgtxt{
      position: relative;
      margin:0 8px;
      .el-icon-error{
        position: absolute;
        right: -10px;
        top: -6px;
        font-size: 16px;
        cursor: pointer;
        z-index: 9;
      }
    }
  }
}
</style>
