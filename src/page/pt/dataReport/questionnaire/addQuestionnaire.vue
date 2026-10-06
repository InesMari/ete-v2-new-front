<template>
    <div id="addQuestionnaire">
        <div class="common-info">
            <h3 class="common-title"><span class="title-name">基本信息</span></h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout:fixed;">
                <tr>
                    <td class="label" style="width:300px;">问卷名称</td>
                    <td class="value" style="width:auto;">
                        <el-input v-model="param.questionnaireName" type="text" placeholder="问卷名称"></el-input>
                    </td>
                    <td class="label">问卷有效期</td>
                    <td class="value" style="width: 350px;">
                        <el-date-picker v-model="param.date" type="daterange" range-separator="至" start-placeholder="开始日期"
                                        end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"
                                        unlink-panels></el-date-picker>
                    </td>
                    <td class="label">选择问卷模板</td>
                    <td class="value" style="width:auto;">
                        <el-select v-model="param.templateId" placeholder="请选择" @change="selectTemplate" filterable clearable>
                            <el-option v-for="item in questionnaireTemplateList" :key="item.id" :label="item.questionnaireName" :value="item.id"></el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <td class="label">异常反馈、投诉渠道</td>
                    <td class="value" colspan="5">
                         <el-input v-model="param.feedbackChannel" type="text" placeholder="异常反馈、投诉渠道"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">开始语</td>
                    <td class="value" colspan="5">
                        <el-input v-model="param.startWords" type="textarea" placeholder="开始语"></el-input>
                    </td>
                </tr>
            </table>
            <div class="quesItem" v-for="(item,index) in param.titleList" :key="index">
                <div class="itemTitle">
                    <el-input v-model="item.titleName" type="text" placeholder="请输入标题" :disabled="item.isCustomerType == 1"></el-input>
                    <el-button class="fr" type="danger" size="mini" icon="el-icon-delete-solid"
                               @click="delQues(index, item)" v-show="param.titleList.length != 1  && item.isCustomerType == 0" v-if="!pageDisable">删除标题</el-button>
                    <el-button class="fr" type="success" size="mini" icon="el-icon-circle-plus" style="margin-right: 10px;"
                               @click="addQues" v-if="index == param.titleList.length-1 && !pageDisable">添加标题</el-button>
                </div>
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th>问题名称</th>
                            <th>问题类型</th>
                            <th width="50">
                                <el-tooltip effect="dark" content="添加问题" placement="top-start" :hide-after='1000' v-if="!pageDisable">
                                    <span @click="addInnerQues(item)" class="add" v-show="item.isCustomerType == 0"></span>
                                </el-tooltip>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(innerItem,innerIndex) in item.questionList" :key="innerIndex">
                            <td>
                                <el-input v-model="innerItem.questionName" type="text" :disabled="innerItem.isCustomerType == 1" placeholder="请输入问题内容"></el-input>
                            </td>
                            <td>
                                <el-radio-group v-model="innerItem.questionType" :disabled="innerItem.isCustomerType == 1" @change="questionTypeChange(innerItem)">
                                    <el-radio :label="1">打分类</el-radio>
                                    <el-radio :label="2">建议类</el-radio>
                                </el-radio-group>
                                <span v-if="innerItem.questionType==1 && innerItem.isCustomerType == 0" style="margin-left:50px;">参与评分合计：</span>
                                <el-radio-group v-if="innerItem.questionType==1 && innerItem.isCustomerType == 0" :disabled="innerItem.isCustomerType == 1" v-model="innerItem.status">
                                    <el-radio :label="1">是</el-radio>
                                    <el-radio :label="0">否</el-radio>
                                </el-radio-group>
                                <el-radio-group v-if="innerItem.isCustomerType==1" disabled v-model="innerItem.isCustomerType" style="margin-left:50px;">
                                    <el-radio :label="1">客服类</el-radio>
                                </el-radio-group>
                            </td>
                            <td>
                                <el-tooltip effect="dark" content="删除问题" placement="top-start" :hide-after='1000' v-if="!pageDisable">
                                    <span @click="delInnerQues(item.questionList,innerIndex)" v-show="innerItem.isCustomerType == 0" class="del"></span>
                                </el-tooltip>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="bot-btn" v-if="!pageDisable">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" @click="save">保存</el-button>
            </div>
        </div>
        <!-- 禁止操作遮罩层 -->
        <div class="pageDisable" v-if="pageDisable"></div>
    </div>
</template>

<script>
import addQuestionnaire from './addQuestionnaire.js'
export default addQuestionnaire
</script>
<style lang="scss" scoped>
#addQuestionnaire{
    position: relative;
    .pageDisable{
        position: absolute;
        top:0;
        left:0;
        width:100%;
        height: 100%;
        z-index:99999;
    }
    .fillTbale{
        /deep/ .el-textarea__inner{
            border:none;
            resize:none;
            height: 100px;
        }
    }
    .quesItem{
        .itemTitle{
            padding: 10px 0;
            /deep/ .el-input{
                width: 500px;
                margin-right: 30px;
                .el-input__inner{
                    line-height: 30px;
                    height: 30px;
                }
            }
        }
    }
    .tableCommon{
        border:$border;
        .add{
            vertical-align: middle;
            @include add;
        }
        .del{
            vertical-align: middle;
            @include del;
        }
        /deep/ .el-input__inner{
            border:none;
        }
        /deep/ .el-radio__label{
            font-size: 12px;
        }
    }
}
</style>
