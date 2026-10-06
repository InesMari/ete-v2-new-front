<template>
    <div id="answerSheetStatistics">
        <div class="search-list clearfix">
            <div class="search-form clearfix">
                <div class="item">
                    <label class="label">问卷报表名称：</label>
                    <div class="input-text">
                        <el-select v-model="query.questionnaireId" placeholder="问卷报表名称" @change="changeQuestionnaire" filterable>
                            <el-option v-for="item in questionnaireList" :key="item.id" :label="item.questionnaireName" :value="item.id"></el-option>
                        </el-select>
                    </div>
                </div>

                <div class="item">
                    <label class="label">问题名称：</label>
                    <div class="input-text">
                        <el-select v-model="query.questionId" placeholder="问题名称" @change="initEchart" filterable clearable>
                            <el-option v-for="item in questionnaireQuestionList" :key="item.id" :label="item.questionName" :value="item.id"></el-option>
                        </el-select>
                    </div>
                </div>

                <div class="item">
                    <label class="label">排序选择：</label>
                    <div class="input-text">
                        <el-select v-model="query.order" placeholder="问卷报表名称" @change="changeOrder">
                            <el-option v-for="item in orderList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>
        </div>

      <div class="chartList clearfix">
          <div class="item" :class="item.questionType == 2?'opinion':''" v-for="(item, index) in list">
            <!-- 评分 -->
            <div v-show="item.questionType == 1">
                <div class="title">{{item.questionName}}</div>
                <i class="el-icon-s-operation" @click="changeChartView(item)"></i>
                <div class="dataView" v-show="!item.showChart">
                    <div class="chart" id="chart" v-if="showChart"></div>
                    <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" v-if="!showChart">
                        <thead>
                            <tr>
                                <th>选项</th>
                                <th>次数</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item2, index) in item.list">
                                <td>{{ item2.name }}</td>
                                <td>{{ item2.value }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="chart" :id="'chart' + index" v-show="item.showChart"></div>                
                <div class="info">
                    <span>回答次数：{{item.answerCount}}</span>
                    <span>平均分： {{item.avgScore}}</span>
                    <span>满意率： {{item.satisfyRate + '%'}}</span>
                </div>
            </div>
            <!-- 建议 -->
            <div v-show="item.questionType == 2">
                <div class="title">{{item.questionName}}</div>
                <el-scrollbar class="dataView">
                    <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                        <thead>
                            <tr>
                                <th>答案</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item2, index) in item.list">
                                <td>{{ item2.questionAnswer }}</td>
                                <td><a href="javascript:;" class="link" @click="toAnswer(item2)">查看答案</a></td>
                            </tr>
                        </tbody>
                    </table>
                </el-scrollbar>
                <div class="info">
                    <span>回答次数：{{item.answerCount}}</span>
                    <span>平均分： {{item.avgScore}}</span>
                    <span>满意率： {{item.satisfyRate}}</span>
                </div>
            </div>
        </div>
      </div>
    </div>
</template>

<script>
import answerSheetStatistics from './answerSheetStatistics.js'
export default answerSheetStatistics
</script>
<style lang="scss" scoped>
#answerSheetStatistics{
    background: #fff;
    height: auto!important;
    .chartList{
        padding:0 10px;
        .item{
            width: 32%;
            border:$border;
            padding: 10px 20px;
            box-sizing: border-box;
            position: relative;
            margin:20px 2% 0 0;
            border-radius: 5px;
            float: left;
            &:nth-child(3n){
                margin-right: 0;
            }
            &.opinion{
                .dataView{
                    max-height: 200px;
                    /deep/ .el-scrollbar__wrap{
                        overflow-x: hidden;
                    }
                }
            }
            .title{
                font-size: 14px;
                font-weight: bold;
            }
            .el-icon-s-operation{
                font-size: 20px;
                color: $main-color;
                position: absolute;
                top: 10px;
                right: 20px;
                cursor: pointer;
            }
            .dataView{
                height:200px;
                overflow: hidden;
            }
            .chart{
                width:100%;
                height: 200px;
            }
            .tableCommon{
                border:$border;
                margin:10px 0;
            }
        }
        .info{
            text-align: center;
            line-height: 40px;
            span{
                margin:0 10px;
            }
        }
    }
}
</style>




