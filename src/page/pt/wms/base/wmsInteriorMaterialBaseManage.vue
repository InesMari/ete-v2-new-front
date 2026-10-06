<template>
    <div id="wmsInteriorMaterialBaseManage">

        <!-- 列表相关  开始 -->
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">内材名称：</label>
                    <div class="input-text">
                        <el-input v-model="query.name" placeholder="内材名称" type="text"
                                  autocomplete="new-password"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">内材类型：</label>
                    <div class="input-text">
                        <el-select v-model="query.type" @change="doQuery(query)" clearable filterable
                                   placeholder="内材类型">
                            <el-option v-for="item in typeData" :key="item.codeValue" :label="item.codeName"
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
                    <el-button type="danger" plain size="mini" icon="el-icon-close" @click="initQuery()">清空</el-button>
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
                    <span>内材维护列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="内材维护列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain @click="showInteriorMaterial(true, 1)" size="mini" v-entity="1005048">新增内材
                    </el-button>
                    <el-button type="primary" plain @click="showInteriorMaterial(true, 2)" size="mini" v-entity="1005049">修改内材
                    </el-button>
                    <el-button type="danger" plain @click="deleteInteriorMaterial()" size="mini" v-entity="1005050">删除内材
                    </el-button>
                </div>
            </div>
            <tableCommon tableName="wmsInteriorMaterialBaseManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :singleSelect="true" @dblclickItem="dblclickItem">
            </tableCommon>
        </div>
        <!-- 列表相关  结束 -->

        <!-- 内材 开始-->
        <el-dialog class="interiorMaterialDialog" :title="title" :visible.sync="interiorMaterialShow" width="40%"
                   :close-on-click-modal="false" :close-on-press-escape="false" @close="showInteriorMaterial(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>内材名称</label>
                        <div class="input-text">
                            <el-input v-model="interiorMaterial.name" maxlength="50" placeholder="内材名称"
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>管理单位</label>
                        <div class="input-text">
                            <el-select v-model="interiorMaterial.unit" :disabled="isOnlySee" filterable
                                       clearable placeholder="管理单位">
                                <el-option v-for="item in unitData" :key="item.codeValue" :label="item.codeName"
                                           :value="item.codeValue"></el-option>
                            </el-select>
                        </div>
                    </li>

                    <li class="item item100">
                        <label class="label-term">备注</label>
                        <div class="input-text">
                            <el-input v-model="interiorMaterial.remark" maxlength="255" placeholder="备注"
                                      :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="showInteriorMaterial(false)">关闭</el-button>
                    <el-button type="primary" v-show="showAddButton" size="mini" @click="sure(1)">确认新增</el-button>
                    <el-button type="primary" v-show="showUpdateButton" size="mini" @click="sure(2)">确认修改
                    </el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 内材 结束-->

    </div>
</template>

<script>
import wmsInteriorMaterialBaseManage from './wmsInteriorMaterialBaseManage.js'

export default wmsInteriorMaterialBaseManage
</script>
<style lang="scss">
#wmsInteriorMaterialBaseManage {

}
</style>
