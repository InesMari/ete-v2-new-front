<template>
    <div id="exceptionManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam"
                    searchKey="exceptionManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>异常上报列表</span>
                    <el-tooltip effect="light" content="异常上报列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" v-entity="1013003" @click="addException">新增</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1013004" @click="updateException">修改</el-button>
                  <el-button type="danger"  plain size="mini" v-entity="1013005" @click="toDel">删除</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1013006" @click="exceptionHandle">处理异常</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1013007" @click="verifyException">审核</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1013009" @click="showSetUserDialog">设定接收人员</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1013008" @click="download">导出</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1013010" @click="print">打印</el-button>
                </div>
            </div>
            <tableCommon tableName="exceptionManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" single-select="true" @dblclickItem="viewException">
            </tableCommon>
        </div>
      <el-dialog :title="title" class="exceptionDialog" :visible.sync="isShowSetUserDialog" width="800px" :close-on-click-modal="false" :close-on-press-escape="false" @close="showSetUserDialog(false)">
        <div class="common-info" style="border:none;padding:0;">
          <div>
            <h3 class="common-title">
              <span class="title-name">异常邮件接收人员</span>
            </h3>
            <div class="innerTable" style="height: 500px; overflow-y: scroll">
              <table class="fillTbale" width="100%"  style="overflow-y: auto;" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td class="label" width="10%">序号</td>
                  <td class="label" width="30%">名称</td>
                  <td class="label" width="25%">账号</td>
                  <td class="label" width="25%">邮箱</td>
                  <td class="label" width="10%">操作</td>
                </tr>
                <tr v-for="(userData,index) in emailUserList" :key="index">
                  <td>{{index+1}}</td>
                  <td>
                    <el-select v-model="userData.userId" placeholder="请选择"  @change="selectUser(userData)" filterable clearable>
                      <el-option v-for="item in staffData" :key="item.userId" :label="item.staffName" :value="item.userId" >
                      </el-option>
                    </el-select>
                  </td>
                  <td>{{userData.billId}}</td>
                  <td>{{userData.email}}</td>
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
        </div>
      </el-dialog>

    </div>
</template>

<script>
import exceptionManage from './exceptionManage.js'
export default exceptionManage
</script>
<style lang="scss" scoped>
.exceptionDialog{
  /deep/ .innerTable{
    overflow-y: auto;
    position: relative;
    tr:first-child{
      position:sticky;
      z-index: 99;
      top: 0;
    }
  }
}

</style>

