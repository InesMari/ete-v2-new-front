<template>
    <div id="storehouseManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="storehouseManageSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>仓库列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="仓库列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn"  style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" @click="add()"  v-entity="1002033" >新增</el-button>
                  <el-button type="primary" plain size="mini" @click="update(2)" v-entity="1002034" >修改</el-button>
                  <el-button type="danger" plain size="mini" @click="del()" v-entity="1002035" >删除</el-button>
                  <el-button type="danger" plain size="mini" @click="disable()" v-entity="1002189" >启用/禁用</el-button>
                  <el-button type="primary" plain size="mini" @click="modifyMapDraw()" v-entity="1002036" >查看电子围栏</el-button>
<!--                  <el-button type="primary" plain size="mini" @click="showStoreHouseUserDialog(true)" v-entity="1002037" >仓库人员</el-button>-->
                </div>
            </div>
            <tableCommon tableName="storehouseManageTable" ref="table" :head="head" :showNum="true" :showSetTable="true"
                         @dblclickItem="dblclickItem" :singleSelect="true">
              <template v-slot:default="{item,code}">
                <div v-if="code=='viewPic'">
                  <a href="javascript:void(0);" :class="!item.businessLicenseUrl?'disabled':'link'" @click.stop="showImg(item.businessLicenseUrl)" style="margin: 0 10px;">营业执照</a>
                  <a href="javascript:void(0);" :class="!item.propertyRightCertificateUrl?'disabled':'link'" @click.stop="showImg(item.propertyRightCertificateUrl)" style="margin: 0 10px;">房地产权证</a>
                  <a href="javascript:void(0);" :class="!item.fireSafetyCertificateUrl?'disabled':'link'" @click.stop="showImg(item.fireSafetyCertificateUrl)" style="margin: 0 10px;">消防合格证</a>
                  <a href="javascript:void(0);" :class="!item.insurancePolicyUrl?'disabled':'link'" @click.stop="showImg(item.insurancePolicyUrl)" style="margin: 0 10px;">保险单</a>
                </div>
                <div v-if="code=='contractNum'">
                  <a href="javascript:void(0);" class="link" @click.stop="open(item)">{{ item.contractNum }}</a>
                </div>
                <div v-if="code=='workAddressStr'" style="text-align: left;padding:0 10px;">
                  {{ item.workAddressStr }}
                </div>
              </template>
                <template v-slot:diyColorTd="{item}">
                    <span :style="item.sts==9?'color:red!important':''">{{ item.stsName }}</span>
                </template>
            </tableCommon>
        </div>
      <!-- 查看大图 -->
      <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

        <map-dialog ref="mapDialogDraw" mapName="draw" :isShowMap="isShowMapDraw" :drawPoints="drawPoints" :mapPoint="mapPointDraw" :isDraw="isDraw" @sureCallback="sureWorkAddressDraw"
                    @hideMapBack="hideMapBackDraw" :modal="true" :centerPoint="centerPoint" :hideBtn="showMapBotton"></map-dialog>

      <!-- 仓库人员管理 -->
      <el-dialog :title="title" :visible.sync="isShowStoreHouseUserDialog" width="800px" :close-on-click-modal="false" :close-on-press-escape="false" @close="showStoreHouseUserDialog(false)">
        <div class="common-info" style="border:none;padding:0;">
          <div>
            <h3 class="common-title">
              <span class="title-name">仓库人员可登录仓储小程序</span>
            </h3>
            <div class="innerTable" style="height: 500px; overflow-y: scroll">
              <table class="fillTbale" width="100%"  style="overflow-y: auto;" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td class="label" width="10%">序号</td>
                  <td class="label" width="30%">名称</td>
                  <td class="label" width="25%">账号</td>
                  <td class="label" width="25%">操作员</td>
                  <td class="label" width="25%">操作时间</td>
                  <td class="label" width="10%">操作</td>
                </tr>
                <tr v-for="(userData,index) in storeHouseUserList" :key="index">
                  <td>{{index+1}}</td>
                  <td>
                    <el-select v-model="userData.userId" placeholder="请选择"  @change="selectUser(userData)" filterable clearable>
                      <el-option v-for="item in staffData" :key="item.userId" :label="item.staffName" :value="item.userId" >
                      </el-option>
                    </el-select>
                  </td>
                  <td>{{userData.billId}}</td>
                  <td>{{userData.createUserName}}</td>
                  <td>{{userData.createDate}}</td>
                  <td>
                    <a href="javascript:;" class="link"  @click="addStoreHouseUserRow">新增</a>
                    <a href="javascript:;" class="link red" @click="delStoreHouseUserRow(index,userData)" style="margin:0 5px;">删除</a>
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <div class="page-bot-btn ">
            <el-button size="mini" @click="showStoreHouseUserDialog(false)">关闭</el-button>
            <el-button type="primary" size="mini" @click="saveStoreHouseUser()" >提交</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    import storehouseManage from './storehouseManage.js'

    export default storehouseManage
</script>
<style lang="scss">
  .item33{
    width: 33% !important;
    margin-right: 0 !important;
  }
//.el-dialog__body {
//  padding: 2px 20px;
//  color: #606266;
//  font-size: 14px;
//  word-break: break-all;
//}


</style>
