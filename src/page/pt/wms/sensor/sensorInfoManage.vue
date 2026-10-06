<template>
    <div id="sensorInfoManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="sensorInfoManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>传感器列表</span>
                    <el-tooltip effect="light" content="传感器列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1005247" @click="showSensorAcctDialog(true)">传感器平台账号维护</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005248" @click="add()">新增</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005249" @click="modify()">修改</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1005250" @click="del()">删除</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005251" @click="uploadOpen=true">导入</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005252" @click="downloadExcel()">导出</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005253" @click="showSetUserDialog">基础设定</el-button>
                    <el-button type="primary" plain size="mini" @click="gotoLog">查看日志</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005267" @click="goPrint">打印</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005273" @click="goPrintCode">打印二维码</el-button>
                </div>
            </div>
            <tableCommon tableName="sensorInfoManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" single-select="true"></tableCommon>
        </div>
        <!-- 传感器平台账号维护 -->
        <el-dialog title="传感器平台账号维护" :visible.sync="showSensorAcctFlg" width="50%" :close-on-click-modal="false" :close-on-press-escape="false" @close="showSensorAcctDialog(false)">
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix">
            <li class="item item50">
              <label class="label-term"><em>*</em>账号</label>
              <div class="input-text">
                <el-input v-model="acctInfo.loginName" maxlength="20" placeholder="请输入账号"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term"><em>*</em>密码</label>
              <div class="input-text">
                <el-input placeholder="请输入密码" v-model="acctInfo.password" show-password></el-input>
              </div>
            </li>
          </ul>

          <div class="page-bot-btn ">
            <el-button size="mini" @click="showSensorAcctDialog(false)">关闭</el-button>
            <el-button type="primary" size="mini" @click="saveAcctInfo()">保存</el-button>
          </div>
        </div>
      </el-dialog>

      <!-- 传感器设备 -->
      <el-dialog title="传感器设备" :visible.sync="showSensorFlg" width="50%" :close-on-click-modal="false" :close-on-press-escape="false" @close="close()">
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix">
            <li class="item item50">
              <label class="label-term"><em>*</em>设备编号</label>
              <div class="input-text">
                <el-input v-model="sensorInfo.deviceAddress" maxlength="20" placeholder="请输入设备编号" :disabled="sensorInfoDisable"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term"><em>*</em>设备名称</label>
              <div class="input-text">
                <el-input v-model="sensorInfo.name" maxlength="20" placeholder="请输入设备名称" :disabled="sensorInfoDisable"></el-input>
              </div>
            </li>
            <li class="item item98">
              <label class="label-term">设备位置</label>
              <div class="input-text">
                <el-input v-model="sensorInfo.location" maxlength="20" placeholder="请输入设备位置" :disabled="sensorInfoDisable"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">温度上下限</label>
              <div class="input-text"  style="display: flex; align-items: center;">
                <el-input v-model="sensorInfo.remindMinTemperature" maxlength="20" placeholder="请输入报警下限" :disabled="sensorInfoDisable" style="display: flex; align-items: center;"></el-input>
                <span style="margin: 0 10px;">-</span>
                <el-input v-model="sensorInfo.remindMaxTemperature" maxlength="20" placeholder="请输入报警上限" :disabled="sensorInfoDisable" style="display: flex; align-items: center;"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">湿度上下限</label>
              <div class="input-text"  style="display: flex; align-items: center;">
                <el-input v-model="sensorInfo.remindMinHumidity" maxlength="20" placeholder="请输入报警下限" :disabled="sensorInfoDisable" style="display: flex; align-items: center;"></el-input>
                <span style="margin: 0 10px;">-</span>
                <el-input v-model="sensorInfo.remindMaxHumidity" maxlength="20" placeholder="请输入报警上限" :disabled="sensorInfoDisable" style="display: flex; align-items: center;"></el-input>
              </div>
            </li>
            <li class="item item98">
              <label class="label-term">备注</label>
              <div class="input-text">
                <el-input v-model="sensorInfo.remark" maxlength="20" placeholder="请输入备注" :disabled="sensorInfoDisable"></el-input>
              </div>
            </li>
          </ul>

          <div class="page-bot-btn ">
            <el-button size="mini" @click="close()">关闭</el-button>
            <el-button type="primary" size="mini" @click="saveSensorInfo()" v-if="!sensorInfoDisable">保存</el-button>
          </div>
        </div>
      </el-dialog>

      <el-dialog :title="title" class="exceptionDialog" :visible.sync="isShowSetUserDialog" width="800px" :close-on-click-modal="false" :close-on-press-escape="false" @close="showSetUserDialog(false)">
        <div class="common-info flex" style="border:none;padding:0;">
          <ul class="content clearfix" style="width:50%;margin:0 auto 10px;" v-if="regionId==1">
            <li class="item item100">
              <label class="label-term" style="width:80px;">所属物流基地</label>
              <div class="input-text">
                <el-select v-model="basicSettingsInfo.workId" @change="changeWork()" clearable filterable placeholder="请选择">
                  <el-option v-for="item in workData" :key="item.workId" :label="item.workName" :value="item.workId" >
                  </el-option>
                </el-select>
              </div>
            </li>
          </ul>
        <template v-if="regionId!=1||basicSettingsInfo.workId">
          <ul class="content clearfix">
            <li class="item item50">
              <label class="label-term"><em>*</em>提醒剩余电量（%）</label>
              <div class="input-text">
                <el-input v-model="basicSettingsInfo.remindElectricity" maxlength="20" placeholder="请输入提醒剩余电量,单位%"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term"><em>*</em>获取数据间隔（小时）</label>
              <div class="input-text">
                <el-input v-model="basicSettingsInfo.intervalHour" maxlength="3" v-mynumval placeholder="请输入获取数据间隔,单位小时"></el-input>
              </div>
            </li>
          </ul>
          <div>
            <h3 class="common-title">
              <span class="title-name">低电量提醒邮件接收人员</span>
            </h3>
            <div class="innerTable" style="height: 300px; overflow-y: scroll">
              <table class="fillTbale" width="100%"  style="overflow-y: auto;table-layout:fixed;" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td class="label" style="width:10%">序号</td>
                  <td class="label" style="width:30%">名称</td>
                  <td class="label" style="width:25%">账号</td>
                  <td class="label" style="width:25%">邮箱</td>
                  <td class="label" style="width:10%">操作</td>
                </tr>
                <tr v-for="(userData,index) in basicSettingsInfo.emailUserList" :key="index">
                  <td :style="userData.staffId?'':'color:red!important'">{{index+1}}</td>
                  <td :style="userData.staffId?'':'color:red!important'">
                    <el-select v-model="userData.userId" placeholder="请选择"  @change="selectUser(userData)" filterable clearable>
                      <el-option v-for="item in staffData" :key="item.userId" :label="item.staffName" :value="item.userId" >
                      </el-option>
                    </el-select>
                  </td>
                  <td :style="userData.staffId?'':'color:red!important'">{{userData.billId}}</td>
                  <td :style="userData.staffId?'':'color:red!important'">{{userData.email}}</td>
                  <td>
                    <a href="javascript:;" class="link"  @click="addRow">新增</a>
                    <a href="javascript:;" class="link red" @click="delRow(index)" style="margin:0 5px;">删除</a>
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <div class="page-bot-btn ">
            <el-button size="mini" @click="showSetUserDialog(false)">关闭</el-button>
            <el-button type="primary" size="mini" @click="saveEmailUser()" >提交</el-button>
          </div>
        </template>
        <template v-if="regionId==1&&!basicSettingsInfo.workId">
          <div style="height: 400px; overflow-y: auto">
            <div v-for="item in allSettingsInfoList" style="margin-bottom: 20px;">
              <h3 class="common-title">
                <span class="title-name">仓库：{{ item.workName }}</span>
                <div class="title-text">
                  <span>提醒剩余电量（%）：{{ item.remindElectricity }}</span>
                  <span>获取数据间隔（小时）：{{ item.intervalHour }}</span>
                </div>
              </h3>
              <div class="innerTable">
                <table class="fillTbale" width="100%"  style="overflow-y: auto;table-layout:fixed;" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td class="label" style="width:10%">序号</td>
                    <td class="label" style="width:30%">名称</td>
                    <td class="label" style="width:30%">账号</td>
                    <td class="label" style="width:30%">邮箱</td>
                  </tr>
                  <tr v-for="(userData,index) in item.emailUserList" :key="index" >
                    <td :style="userData.staffId?'':'color:red!important'">{{index+1}}</td>
                    <td :style="userData.staffId?'':'color:red!important'">{{userData.name}}</td>
                    <td :style="userData.staffId?'':'color:red!important'">{{userData.billId}}</td>
                    <td :style="userData.staffId?'':'color:red!important'">{{userData.email}}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>

          <div class="page-bot-btn ">
            <el-button size="mini" @click="showSetUserDialog(false)">关闭</el-button>
          </div>
        </template>
        </div>
      </el-dialog>

      <!-- 批量导入 -->
        <my-import :open.sync="uploadOpen" :handle-success="uploadSuccess" template="/download/sensorInfo.xlsx" title="传感器导入"
                   bean="sensorTF" method="impAddSensorInfo" ></my-import>
    </div>
</template>

<script>
import sensorInfoManage from './sensorInfoManage.js'
export default sensorInfoManage
</script>
<style lang="scss">
#sensorInfoManage{
  .common-info.flex .content>.item .label-term{
    width: 130px;
  }
  .common-title{
    .title-text{
      padding-right: 20px;
      line-height: 30px;
      font-weight: bold;
      float: right;
      span{
        margin-left: 20px;
      }
    }
  }
}
</style>

