<template>
    <div id="bugManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="bugManageSearch" @clearFn="initQuery"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>缺陷列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="缺陷列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                    <el-checkbox true-label="1" false-label="0" v-model="query.relatedToMe"  @change="doQuery(query)" border size="mini">与我相关</el-checkbox>
                    <div style="border-radius: 3px;line-height: 20px;padding: 3px 15px 3px 10px;float: right;margin-top:12px;margin-left: 10px; " :style="query.unfinished=='1'?'border: 1px solid  #409EFF;':'border: 1px solid #DCDFE6;'">
                      <el-checkbox true-label="1" false-label="0" v-model="query.unfinished"  @change="doQuery(query)" size="mini">未关闭</el-checkbox>
                    </div>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="add()" v-entity="1007098">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="update()" v-entity="1007099">修改</el-button>
                    <el-button type="primary" plain size="mini" @click="trans()" v-entity="1007099">类型转换</el-button>
                    <el-button type="primary" plain size="mini" @click="del()" v-entity="1007100">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="download()" v-entity="1007101">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="bugManageTable" ref="table" :showNum="true" :showSetTable="true" :head="head" :singleSelect="true"  @dblclickItem="dblclickItem">
              <template v-slot="{item,code}">
                <div v-if="code=='stateName'">
                  <div v-if="stateDisable||item.disabled" style="color: #999!important;">{{item.stateName}}</div>
                  <el-select v-model="item.state" placeholder="请选择" @change="updateBugInfoByField(item,'state')" v-else>
                    <el-option v-for="item in stateData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                  </el-select>
                </div>
                <div v-if="'relTaskNum'==code">
                  <a href="javascript:void(0);" class="link" @click.stop="gotoTask(item)">{{item[code]}}</a>
                </div>
                <div v-if="'parentBugNum'==code">
                  <a href="javascript:void(0);" class="link" @click.stop="gotoBug(item)">{{item[code]}}</a>
                </div>
                <div v-if="code=='iterationId'">
                  <div v-if="stateDisable||item.disabled" style="color: #999!important;">{{item.iterationName}}</div>
                  <el-select v-model="item.iterationId" placeholder="请选择" @change="updateBugInfoByField(item,'iterationId')" v-else>
                    <el-option v-for="item in iterationData" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    <el-option v-if="!iterationData.some(subItem=> subItem.id === item.iterationId)" :label="item.iterationName" :value="item.iterationId" :key="item.iterationId"/>
                  </el-select>
                </div>
              </template>
            </tableCommon>
        </div>
    </div>
</template>

<script>
import bugManage from './bugManage.js'

export default bugManage
</script>

<style lang="scss" scoped>
#bugManage{
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
