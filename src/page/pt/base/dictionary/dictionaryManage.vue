<template>
    <div id="dictionaryManage" class="dictionaryManageDialog">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">名称：</label>
                    <div class="input-text">
                        <el-input v-model="query.codeName" placeholder="名称"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">类型：</label>
                    <div class="input-text">
                        <el-select v-model="query.codeType" placeholder="类型" filterable clearable @change="doQuery">
                            <el-option v-for="item in codeTypeSelectData" :key="item.codeType" :label="item.codeTypeAlias" :value="item.codeType">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <label class="label">codeId：</label>
                    <div class="input-text">
                        <el-input v-model="query.codeId" placeholder="codeId"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">描述：</label>
                    <div class="input-text">
                        <el-input v-model="query.codeDesc" placeholder="描述"></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery">查询</el-button>
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
                    <span>字典列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="字典列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
<!--                    <el-button type="primary" plain size="mini" @click="switchFeeChange">{{ btnTitle }}</el-button>-->
                    <el-button type="primary" plain size="mini" v-entity="1008018" @click="addDictionary()">新增字典</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1008019" @click="updateDictionary">修改字典</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1008020" @click="deleteDictionary">删除字典</el-button>
                </div>
            </div>
            <tableCommon tableName="dictionaryManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem"></tableCommon>
        </div>

        <!--        新增/修改字典数据       -->
        <el-dialog :title="title" :visible.sync="showDialog" width="40%" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="openDialog(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>名称</label>
                        <div class="input-text">
                            <el-input v-model="dictionary.codeName" maxlength="50" placeholder="请输入名称" :disabled="isLock"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>类型</label>
                        <div class="input-text">
                            <el-select v-model="dictionary.codeType" placeholder="请选择类型" @change="changeCodeType" filterable clearable :disabled="isLock">
                                <el-option v-for="item in codeTypeSelectData" :key="item.codeType" :label="item.codeTypeAlias"
                                           :value="item.codeType"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">描述</label>
                        <div class="input-text">
                            <el-input v-model="dictionary.codeDesc" maxlength="50" placeholder="请输入字典的描述文本" :disabled="isLock"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">codeValue</label>
                        <div class="input-text">
                            <el-input v-model="dictionary.codeValue" maxlength="50" placeholder="不建议填写,系统会自动在类型上递增"
                                      :disabled="isLock"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">codeId</label>
                        <div class="input-text">
                            <el-input v-model="dictionary.codeId" maxlength="50" v-mynumval placeholder="不建议填写,某些特殊的又开发人员填写" :disabled="isLock"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">sortId</label>
                        <div class="input-text">
                            <el-input v-model="dictionary.sortId" maxlength="50" v-mynumval placeholder="不建议填写,某些特殊的又开发人员填写" :disabled="isLock"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">类型别名</label>
                        <div class="input-text">
                            <el-input v-model="dictionary.codeTypeAlias" placeholder="不建议填写,某些特殊的又开发人员填写" :disabled="isLock"></el-input>
                        </div>
                    </li>
                    <li class="item item100" v-show="showCityTip">
                        <label class="label-term"><em>*</em>城市编码辅助</label>
                        <div class="input-text">
                            <el-select v-model="dictionary.codeId" placeholder="请选择城市" filterable clearable :disabled="isLock">
                                <el-option v-for="item in cityData" :key="item.id" :label="item.name"
                                           :value="item.id"></el-option>
                            </el-select>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="openDialog(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="saveOrUpdateDictionary()" v-if="!isLock">确认</el-button>
                </div>
            </div>
        </el-dialog>
        <!--        新增/修改字典数据       -->

    </div>
</template>

<script>
import dictionaryManage from './dictionaryManage.js'

export default dictionaryManage
</script>
<style lang="scss">
.dictionaryManageDialog {
    .common-info {
        .content {
            >.item {
                display: block;
                margin-bottom: 10px;
                float: left;
                width: 23%;
                min-width: 240px;
                margin-right: 2%;

                .label-term {
                    float: left;
                    width: 94px;
                    height: 40px;
                    padding-right: 10px;
                    display: flex;
                    display: -webkit-flex;
                    align-items: center;
                    justify-content: flex-end;
                    text-align: right;
                }

                .input-text {
                    float: left;
                    width: calc(100% - 104px);
                    line-height: 40px;
                    position: relative;

                    .el-select {
                        width: 100%;
                        .el-input__icon{
                            line-height: 40px;
                        }
                    }

                    .lint {
                        position: absolute;
                        line-height: 40px;
                        color: $main-color;
                        text-decoration: underline;
                        top: 0;
                        right: 5px;
                    }
                    .unit {
                        position: absolute;
                        line-height: 40px;
                        top: 0;
                        right: 5px;
                    }

                    .el-checkbox-group{
                        line-height: 40px;
                    }
                    .el-date-editor.el-input{
                        width: 100%;
                    }
                }
                .input-range{
                    border:$border;
                    border-radius: 3px;
                    box-sizing: border-box;
                    .el-input{
                        width:auto;
                    }
                    .el-input__inner{
                        border:none;
                        width:120px;
                    }
                }
            }
            .item100{
                width: 100%;
            }
            .img-upload {
                .label-term {
                    line-height: 20px;
                    margin-top: 40px;
                }
            }
            &.content-text{
                .label-term{
                    text-align: right;
                }
            }
            .el-textarea__inner{
                width: 400px;
            }
        }
    }
}
</style>




