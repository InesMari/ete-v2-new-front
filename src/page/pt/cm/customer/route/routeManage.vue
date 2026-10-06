<template>
  <div id="routeManage">
    <searchList :formData="formData" @doQuery="doQuery" @clearFn="init()" :query="query" searchKey="routeManageSearch"></searchList>
    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>线路列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
          <el-tooltip effect="light" content="线路列表" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" @click="toAddRoutePage()" v-entity="1001036">新增</el-button>
          <el-button type="primary" plain size="mini" @click="toUpdateRoute()" v-entity="1001038">修改</el-button>
          <el-button type="primary" plain size="mini" @click="changeRouteSts(1)" v-entity="1001039">启用</el-button>
          <el-button type="danger" plain size="mini" @click="changeRouteSts(0)" v-entity="1001040">禁用</el-button>
          <el-button type="primary" plain size="mini" @click="toOrderManage()" v-entity="1003005">查看订单</el-button>
          <el-button type="primary" plain size="mini" @click="uploadOpen = true" v-entity="1001107">导入线路里程</el-button>
            <el-button type="primary" plain size="mini" @click="download" >导出</el-button>

        </div>
      </div>
      <tableCommon tableName="routeManageTable" ref="table" :showNum="true" :singleSelect="true" :showSetTable="true" :head="head" @dblclickItem="dblclickItem">
        <template v-slot:diyColorTd="{item}">
          <span :style="item.sts==0?'color:red!important':''">{{item.stsName}}</span>
        </template>
      </tableCommon>
    </div>

      <my-import :open.sync="uploadOpen" :handle-success="doQuery" template="/download/routeMileage.xlsx" title="导入线路里程"
                 bean="routeTF" method="importRouteMileage"></my-import>
  </div>
</template>

<script>
import routeManage from './routeManage.js'
export default routeManage
</script>
<style lang="scss">

</style>
