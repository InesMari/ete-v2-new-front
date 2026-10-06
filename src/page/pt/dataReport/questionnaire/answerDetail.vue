<template>
    <div id="answerDetail">
        <div class="common-info">
            <div id="printTable">
                <div class="detailTitle">{{param.questionnaireName}}</div>
                <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td class="label">答卷编号</td>
                        <td class="value">{{param.answerNum}}</td>
                        <td class="label">客户名称</td>
                        <td class="value">{{param.customerName}}</td>
                        <td class="label">答卷状投放时间</td>
                        <td class="value">{{param.putDate}}</td>
                    </tr>
                    <tr>
                        <td class="label">答卷开始</td>
                        <td class="value">{{param.startDate}}</td>
                        <td class="label">答卷结束</td>
                        <td class="value">{{param.endDate}}</td>
                        <td class="label">答卷耗时</td>
                        <td class="value">{{param.betweenTime}}</td>
                    </tr>
                    <tr>
                        <td class="label">客服联系人</td>
                        <td class="value">{{param.putUserName}}</td>
                        <td class="label">客户昵称</td>
                        <td class="value">{{param.customerUserBill}}</td>
                        <td class="label">客服所属仓库</td>
                        <td class="value">{{param.putUserWorkName}}</td>
                    </tr>
                </table>
                <div class="scoreTitle">答卷详情-总分:{{param.totalScore}}分，客户评分：{{param.score}}分</div>
                <div class="answerTable clearfix">
                    <div class="item thead">
                        <div class="td">调查内容</div>
                        <div class="td">满意度<br>很满意-5&nbsp;&nbsp;&nbsp;满意-4.75&nbsp;&nbsp;&nbsp;一般-4.5&nbsp;&nbsp;&nbsp;尚可-3&nbsp;&nbsp;&nbsp;差-0 </div>
                        <div class="td">客户评分</div>
                    </div>
                    <div class="item clearfix" v-for="(item,index) in param.titleList" :key="item.id">
                        <div class="innerTitle">{{index+1}}、{{item.titleName}}</div>    
                        <div class="innerItem" v-for="(innerItem,innerIndex) in item.questionList" :key="innerItem.id">
                            <div class="td left">{{innerIndex+1}}、{{innerItem.questionName}}</div>
                            <div class="td">
                                <el-radio-group style="pointer-events:none;" :value="innerItem.scoreLevel" v-if="innerItem.questionType==1">
                                    <el-radio :label="5">很满意</el-radio>
                                    <el-radio :label="4">满意</el-radio>
                                    <el-radio :label="3">一般</el-radio>
                                    <el-radio :label="2">尚可</el-radio>
                                    <el-radio :label="1">差</el-radio>
                                </el-radio-group>
                                <span v-if="innerItem.questionType==2">{{innerItem.questionAnswer}}</span>
                            </div>
                            <div class="td">{{innerItem.questionType==2?'-':innerItem.score}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" @click="print">打印</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import answerDetail from './answerDetail.js'
export default answerDetail
</script>
<style lang="scss" scoped>
#answerDetail{
    .detailTitle{
        text-align: center;
        font-weight: bold;
        font-size: 18px;
        margin-bottom: 20px;
    }
    .fillTbale{
        /deep/ .el-textarea__inner{
            border:none;
            resize:none;
        }
    }
    .scoreTitle{
        font-weight: bold;
        text-align: center;
        line-height: 40px;
        font-size: 14px;
    }
    .answerTable{
        border-left: $border;
        border-top: $border;
        box-sizing: border-box;
        .innerTitle{
            line-height: 40px;
            border-right: $border;
            border-bottom: $border;
            font-weight: bold;
            padding-left: 24px;
        }
        .thead{
            .td{
                text-align: center;
                height:50px;
            }
        }
        .td{
            width:40%;
            height: 40px;
            float: left;
            padding-left: 24px;
            border-right: $border;
            border-bottom: $border;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: center;
            &.left{                
                justify-content: left;
            }
            &:last-child{
                width:20%;
            }
        }
    }
}
</style>
