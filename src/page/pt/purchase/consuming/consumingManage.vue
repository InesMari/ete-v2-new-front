<template>
    <div id="consumingManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" @clearFn="clear"
                    searchKey="consumingManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>领用列表</span>
                    <el-tooltip effect="light" content="领用列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
<!--                  <el-button type="primary" plain size="mini" v-entity="1014039" @click="consumingBack">归还</el-button>-->
                  <el-button type="primary" plain size="mini" v-entity="1014043" @click="verifyConsuming">审核</el-button>
                  <el-button type="danger" plain size="mini" v-entity="1014044" @click="deleteConsuming">删除</el-button>
                </div>
            </div>
            <tableCommon tableName="consumingManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :single-select="true">
                <template v-slot:default="{item, code}">
                    <div v-if="code=='file'">
                        <a class="link" :class="!item.url?'disabled':'link'" href="javascript:;"
                           @click="showImg(item)">查看</a>
                    </div>
                </template>
            </tableCommon>
        </div>

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList" zIndex="10000"></fileViewer>

    </div>
</template>

<script>
import consumingManage from './consumingManage.js'
export default consumingManage
</script>
<style lang="scss" scoped>
#consumingManage{
    .dialogView{
        .tip{
            text-align: center;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            .el-icon-warning{
                font-size: 18px;
                margin-right: 10px;
                color: orange;
            }
        }
    }
}
</style>

