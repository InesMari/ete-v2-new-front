<template>
    <div id="wmsWorkOrderManage">
      <select-work v-show="showSelWork"></select-work>
      <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="wmsWorkOrderManageSearch"></searchList>
      <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>外包作业管理列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="外包作业管理列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1005221" @click="confirm()">确认</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005222" @click="exportExcel()">导出</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005223" @click="print">打印</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005224" @click="settleSum">结算统计</el-button>
                </div>
            </div>
            <tableCommon tableName="wmsWorkOrderManageTable" ref="table" :showNum="true" :singleSelect="false"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" v-if="code=='count'" class="link" @click.stop="show(item)"
                       style="margin: 0 10px;">查看图片</a>
                    <a href="javascript:void(0);" v-if="code=='count2'" class="link" @click.stop="show2(item)"
                       style="margin: 0 10px;">查看图片</a>
                </template>
            </tableCommon>
        </div>

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

    </div>
</template>

<script>
import wmsWorkOrderManage from './wmsWorkOrderManage.js'
export default wmsWorkOrderManage
</script>
<style lang="scss">

</style>




