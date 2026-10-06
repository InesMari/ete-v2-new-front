<template>
    <div id="inspectRegGoods">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="inspectRegGoodsSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>仓库异常品登记列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1005185" @click="add()">新增</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005186" @click="update">修改</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1005187" @click="deleteStandard">删除</el-button>
                </div>
            </div>
            <tableCommon tableName="inspectRegGoodsTable" ref="table" :showNum="true" :singleSelect="true"
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
import inspectRegGoods from './inspectRegGoods.js'
export default inspectRegGoods
</script>
<style lang="scss">

</style>




