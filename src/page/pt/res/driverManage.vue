<template>
  <div id="driverManage">
    <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="driverManageSearch"></searchList>

    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>司机列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
          <el-tooltip effect="light" content="司机列表" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
            <el-button type="primary" plain size="mini" @click="openPage(1)" v-entity="1002026">新增</el-button>
            <el-button type="primary" plain size="mini" @click="openPage(2)" v-entity="1002027">修改</el-button>
            <el-button type="primary" plain size="mini" @click="updateState()" v-entity="1002029">启用/禁用</el-button>
            <el-button type="danger" plain size="mini" @click="openPage(4)" v-entity="1002030">资质审核</el-button>
            <el-button type="primary" plain size="mini" @click="copyPassword" v-if="userId==2">复制密码</el-button>
            <el-button type="danger" plain size="mini" @click="openSync(true)" v-entity="1002219">同步司机</el-button>
            <el-button type="primary" plain size="mini" @click="uploadOpen = true" v-entity="1002253">批量导入</el-button>
        </div>
      </div>
      <tableCommon tableName="driverManageTable" ref="table" :showNum="true" :showSetTable="true" :head="head" @dblclickItem="dblclickItem" :singleSelect="true">
        <template v-slot:default="{item}">
          <a href="javascript:void(0);" :class="!item.idCardFrontImgPath && !item.idCardBackImgPath?'disabled':'link'" @click.stop="showIdCardImg(item)" style="margin: 0 10px;">身份证</a>
          <a href="javascript:void(0);" :class="!item.driverLicenceFrontImg && !item.idCardBackImgPath?'disabled':'link'" @click.stop="showDriverLicenceImg(item)" style="margin: 0 10px;">驾驶证</a>
          <a href="javascript:void(0);" :class="!item.qualifyCertImgUrl?'disabled':'link'" @click.stop="showQualifyCertImgUrl(item)" style="margin: 0 10px;">从业资格证</a>
        </template>
        <template v-slot:diyColorTd="{item}">
          <span :style="item.sts==0?'color:red!important':''">{{ item.stsName }}</span>
        </template>
      </tableCommon>
    </div>

    <!-- 查看大图 -->
    <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

    <my-import :open.sync="uploadOpen" :handle-success="doQuery" repeatCheckNums="0" :begin-row="1" :param="impParam"
               template="/download/driver.xlsx" title="司机导入"
               bean="driverTF" method="impAddDriverInfos" ></my-import>

    <!-- 同步 begin -->
    <el-dialog title="同步司机" :visible.sync="showSync" width="360px" :close-on-click-modal="false"
               :close-on-press-escape="false" @close="openSync(false)">
      <div class="common-info" style="border:none;padding:0;">
        <ul class="content clearfix">
          <li class="item item100">
            <label class="label-term"><em>*</em>身份证号</label>
            <div class="input-text">
              <el-input v-model="idCardNum" maxlength="30"  placeholder="请输入身份证号"></el-input>
            </div>
          </li>
        </ul>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="openSync(false)">关闭</el-button>
          <el-button type="primary" size="mini" @click="syncDriver()">确认</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 同步 end -->


  </div>
</template>

<script>
import driverManage from './driverManage.js'
export default driverManage
</script>

<style scoped>

</style>
