<template>
    <div id="wmsExamineItemCfgManage">
      <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" @clearFn="clearFn" searchKey="wmsExamineItemCfgManageSearch"></searchList>

      <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>核查项目维护列表</span>
                    <el-tooltip effect="light" content="核查项目维护列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" v-entity="1007054" @click="addCfg">新增</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1007055" @click="modifyCfg">修改</el-button>
                  <el-button type="danger" plain size="mini" v-entity="1007056" @click="delCfg">删除</el-button>
                </div>
            </div>
            <tableCommon tableName="wmsExamineItemCfgManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head">
            </tableCommon>
        </div>


      <el-dialog :title="title" :visible.sync="dialogShow" width="400px" :close-on-click-modal="false" :close-on-press-escape="false" @close="showDialog(false)">
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix">
            <li class="item" style="width: 100%;">
              <label class="label-term"><em>*</em>核查项目</label>
              <div class="input-text">
                <el-input v-model="info.itemName" placeholder="核查项目"></el-input>
              </div>
            </li>
            <li class="item"  style="width: 100%;">
              <label class="label-term"><em>*</em>使用场景</label>
              <div class="input-text">
                <el-checkbox-group v-model="info.relOperation">
                  <el-checkbox v-for="item in relOperationData" :label="item.codeValue" :key="item.codeValue">{{item.codeName}}</el-checkbox>
                </el-checkbox-group>
              </div>
            </li>
            <li class="item"  style="width: 100%;">
              <label class="label-term">备注</label>
              <div class="input-text">
                <el-input v-model="info.remark" placeholder="请输入备注"></el-input>
              </div>
            </li>
          </ul>

          <div class="page-bot-btn ">
            <el-button size="mini" @click="showDialog(false)">取消</el-button>
            <el-button type="primary" size="mini" @click="saveCfg()" >确定</el-button>
          </div>
        </div>
      </el-dialog>

    </div>
</template>

<script>
import wmsExamineItemCfgManage from './wmsExamineItemCfgManage.js'
export default wmsExamineItemCfgManage
</script>
<style lang="scss">

</style>




