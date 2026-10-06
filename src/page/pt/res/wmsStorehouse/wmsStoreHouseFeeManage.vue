<template>
  <div id="wmsStoreHouseFeeManage">
    <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="wmsStoreHouseFeeManageSearch"></searchList>

    <div class="table-content">
      <div class="table-title">
          <h3>
            <span>仓租租赁费用维护(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
            <el-tooltip effect="light" content="仓租租赁费用维护" placement="right">
              <img class="tip" src="@/static/image/tip.png" alt="">
            </el-tooltip>
          </h3>
          <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" @click="add" v-entity="1002181">新增</el-button>
          <el-button type="primary" plain size="mini" @click="update" v-entity="1002182">修改</el-button>
          <el-button type="danger"  plain size="mini" @click="del" v-entity="1002183">删除</el-button>
          <el-button type="primary" plain size="mini" @click="verify" v-entity="1002184">审核</el-button>
          <el-button type="primary" plain size="mini" @click="copyAdd()" v-entity="1002185" >复制</el-button>
          <el-button type="primary" plain size="mini" @click="download()" v-entity="1002186">导出Excel</el-button>
        </div>
      </div>
      <tableCommon tableName="wmsStoreHouseFeeManageTable" ref="table" :showNum="true"
                   :showSetTable="true" :head="head" :singleSelect="true" @dblclickItem="dblclickItem">
        <template v-slot:default="{item,code}">
          <div v-if="code=='contractNum'">
            <a href="javascript:void(0);" class="link" @click.stop="open(item)">{{ item.contractNum }}</a>
          </div>
        </template>
      </tableCommon>
    </div>
  </div>
</template>

<script>
import wmsStoreHouseFeeManage from './wmsStoreHouseFeeManage.js'
export default wmsStoreHouseFeeManage
</script>

<style scoped>
/deep/ .trRed td{color:red}
</style>
