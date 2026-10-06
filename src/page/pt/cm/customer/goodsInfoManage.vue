<template>
    <div id="goodsInfoManage">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">货物名称：</label>
                    <div class="input-text">
                        <el-input v-model="loadParam.goodsName" placeholder="货物名称" type="text"
                                  autocomplete="new-password"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">货物类别：</label>
                    <div class="input-text">
                        <el-select v-model="loadParam.classId" placeholder="" clearable filterable>
                          <el-option v-for="item in classData" :key="item.codeValue" :label="item.codeName"
                                     :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <label class="label">包装类型：</label>
                    <div class="input-text">
                        <el-select v-model="loadParam.packingType" placeholder="" clearable >
                          <el-option v-for="item in packingTypeData" :key="item.codeValue" :label="item.codeName"
                                     :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询</el-button>
                </div>
                <div class="btn">
                    <el-button type="danger" plain size="mini" icon="el-icon-close" @click="clear()">清空</el-button>
                </div>
            </div>
            <!-- 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 -->
            <div class="search-bot">
              <img src="@/static/image/search-bot.png" alt="">
              <i class="icon el-icon-arrow-down"></i>
              <i class="icon el-icon-arrow-up"></i>
            </div>
        </div>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>货物列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="货物列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn"  style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="add(true)" v-entity="1001025">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="modify()" v-entity="1001026">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="del()" v-entity="1001027">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="uploadOpen = true" v-entity="1001028">导入Excel</el-button>
                    <el-button type="primary" plain size="mini" @click="gotoLog">查看日志</el-button>
                </div>
            </div>
            <tableCommon tableName="goodsInfoManageTable" ref="table" :head="head" @dblclickItem="dblclickItem" :showNum="true" :showSetTable="true">
            </tableCommon>
        </div>
        <!-- 批量导入 -->
        <my-import :open.sync="uploadOpen" :handle-success="doQuery" template="/download/goods.xlsx" title="货物导入"
                   bean="workGoodsTF" method="impAddGoodsInfo" repeatCheckNums="0" :param="impParam"></my-import>
        <!-- 新增 货物 -->
        <el-dialog :title="title" :visible.sync="showModify" width="60%" :close-on-click-modal="false" :close-on-press-escape="false" @close="openDialog(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item50">
                        <label class="label-term"><em>*</em>货物名称</label>
                        <div class="input-text">
                            <el-input v-model="goodsInfo.goodsName" :disabled="isOnlySee" maxlength="20" placeholder="请输入货物名称"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>货物类别</label>
                        <div class="input-text">
                            <el-select v-model="goodsInfo.classId" placeholder="" filterable clearable :disabled="isOnlySee">
                                <el-option v-for="item in classData" :key="item.codeValue" :label="item.codeName"
                                           :value="item.codeValue"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>包装类型</label>
                        <div class="input-text">
                            <el-select v-model="goodsInfo.packingType" placeholder="" filterable clearable :disabled="isOnlySee">
                              <el-option v-for="item in packingTypeData" :key="item.codeValue" :label="item.codeName"
                                         :value="item.codeValue"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">规格</label>
                        <div class="input-text">
                            <el-input v-model="goodsInfo.goodsModel" :disabled="isOnlySee" maxlength="255" placeholder="请输入规格"></el-input>
                        </div>
                    </li>
                </ul>
                <ul class="content clearfix">
                    <li class="item item50">
                        <label class="label-term">长(m)</label>
                        <div class="input-text">
                            <el-input v-model="goodsInfo.goodsLength" :disabled="isOnlySee" @blur="changeProperty(1)" v-mydouble4val maxlength="19" placeholder="请输入货物长度"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">宽(m)</label>
                        <div class="input-text">
                            <el-input v-model="goodsInfo.goodsWidth" :disabled="isOnlySee" @blur="changeProperty(2)" v-mydouble4val maxlength="19" placeholder="请输入货物宽度"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">高(m)</label>
                        <div class="input-text">
                            <el-input v-model="goodsInfo.goodsHeight" :disabled="isOnlySee" @blur="changeProperty(3)" v-mydouble4val maxlength="19" placeholder="请输入货物高度"></el-input>
                        </div>
                    </li>
                    <li class="item item50" v-show="showSingleVolume">
                        <label class="label-term" style="width: 94px">单个货物体积(m³)</label>
                        <div class="input-text" style="width: calc(100% - 104px)">
                            <el-input v-model="goodsInfo.singleGoodsVolume" :disabled="true"></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="openDialog(false)">关闭</el-button>
                    <el-button type="primary" size="mini" v-show="!isOnlySee" @click="saveGoodsInfo()">提交</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import goodsInfoManage from './goodsInfoManage.js'

    export default goodsInfoManage
</script>
<style lang="scss">

</style>
