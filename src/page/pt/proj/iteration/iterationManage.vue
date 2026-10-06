<template>
    <div id="iterationManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="iterationManageSearch" @clearFn="initQuery"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                    <el-checkbox true-label="1" false-label="0" v-model="query.relatedToMe"  @change="doQuery(query)" border size="mini">与我相关</el-checkbox>
                    <div style="border-radius: 3px;line-height: 20px;padding: 3px 15px 3px 10px;float: right;margin-top:12px;margin-left: 10px; "
                         :style="query.requirement=='1'||query.task=='1'||query.bug=='1'?'border: 1px solid  #409EFF;':'border: 1px solid #DCDFE6;'">
                      <el-checkbox true-label="1" false-label="0" v-model="query.requirement"  @change="doQuery(query)" size="mini">需求</el-checkbox>
                      <el-checkbox true-label="1" false-label="0" v-model="query.task"  @change="doQuery(query)"  size="mini">任务</el-checkbox>
                      <el-checkbox true-label="1" false-label="0" v-model="query.bug"  @change="doQuery(query)"  size="mini">缺陷</el-checkbox>
                    </div>
                    <div style="border-radius: 3px;line-height: 20px;padding: 3px 15px 3px 10px;float: right;margin-top:12px;margin-left: 10px; " :style="query.unfinished=='1'?'border: 1px solid  #409EFF;':'border: 1px solid #DCDFE6;'">
                      <el-checkbox true-label="1" false-label="0" v-model="query.unfinished"  @change="doQuery(query)" size="mini">未关闭</el-checkbox>
                    </div>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">

<!--                  <el-button type="primary" plain size="mini" @click="add()" v-entity="1007089">新增</el-button>-->
                  <el-dropdown trigger="click" v-entitys="'1007089,1007094,1007098'">
                    <el-button type="primary" plain size="mini" >
                      新增<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>

                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item v-entity="1007089" @click.native="addRequirement">新增需求</el-dropdown-item>
                      <el-dropdown-item v-entity="1007094" @click.native="addTask">新增任务</el-dropdown-item>
                      <el-dropdown-item v-entity="1007098" @click.native="addBug">新增缺陷</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>

                </div>
            </div>
            <tableCommon tableName="iterationManageTable" ref="table" :showNum="true" :showSetTable="true" :head="head" :singleSelect="true"  @dblclickItem="dblclickItem">
              <template v-slot="{item,code}">
                <div v-if="code=='stateName'">
                  <div v-if="stateDisable||item.disabled" style="color: #999!important;">{{item.stateName}}</div>
                  <el-select v-model="item.state" placeholder="请选择" @change="updateRelItemInfoByField(item,'state')" v-else>
                    <el-option v-for="item in stateData['stateData'+item.type]" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                  </el-select>
                </div>
              </template>
            </tableCommon>
        </div>
    </div>
</template>

<script>
import iterationManage from './iterationManage.js'

export default iterationManage
</script>

<style lang="scss" scoped>
#iterationManage{
    .table-content{
      .table-title{
        h3{
          /deep/ .el-checkbox__label {
            line-height: 20px;
            font-size: 12px;
          }
      }
    }
  }
  /deep/ .tableCommonComponents .tableCommon tr td p{
    color: #333333
  }
}

</style>
