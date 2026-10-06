<template>
    <div id="wmsQuoteSheetManage">
      <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="wmsQuoteSheetSearch"></searchList>

      <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>客户仓储报价单列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="客户仓储报价单列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1001067" @click="toAdd()">新增</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1001068" @click="toUpdate()">修改</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1001074" @click="toCopy()">复制</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1001069" @click="delQuoteSheet">删除</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1001070" @click="confirmQuoteSheet">客户已确认</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1001075" @click="cancelConfirmQuoteSheet">撤销确认</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1001071" @click="verifyQuoteSheet">审核</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1001072" @click="downloadPdf(1)">导出PDF</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1001076" @click="downloadPdf(2)">导出Excel</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1001073" @click="toAll">批量查看</el-button>
                </div>
            </div>
            <tableCommon tableName="wmsQuoteSheetManageTable" ref="table" :showNum="true" :singleSelect="false"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem"></tableCommon>
        </div>

    </div>
</template>

<script>
import wmsQuoteSheetManage from './wmsQuoteSheetManage.js'
export default wmsQuoteSheetManage
</script>
<style lang="scss">

</style>




