<template>
    <div id="inspectRegIncome">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="inspectRegIncomeSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>来料事件登记列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1005182" @click="add()">新增</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005183" @click="update">修改</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1005184" @click="deleteStandard">删除</el-button>
                </div>
            </div>
            <tableCommon tableName="inspectRegIncomeTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem">
              <template v-slot:default="{item, code}">
                <a href="javascript:void(0);" class="link"  v-for="(data,index) in item.imgUrlList" @click.stop="toDetail(item, code, index)" v-if="code=='imgUrlList'">{{index>0?',图片' + (index + 1): '图片' + (index + 1)}}</a>
              </template>
            </tableCommon>
        </div>
      <!-- 查看大图 -->
      <fileViewer ref="viewer" :url-list="srcList"></fileViewer>
    </div>
</template>

<script>
import inspectRegIncome from './inspectRegIncome.js'
export default inspectRegIncome
</script>
<style lang="scss">

</style>




