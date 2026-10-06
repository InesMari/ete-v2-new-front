<template>
    <div id="inspectSummaryDetail" class="inspectSummaryDetailPage">
        <div class="common-info">
            <h4 class="title">{{info.workName}}<span class="date">巡检时间：{{info.inspectionDate}}</span></h4>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th width="80">序号</th>
                        <th width="200">日常巡查事项</th>
                        <th>执行要求</th>
                        <th width="200">图片</th>
                        <th width="100">状态</th>
                        <th width="120">累计连续巡检天数</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(task, index) in taskList">
                        <td>{{index + 1}}</td>
                        <td>{{task.inspectionItem}}</td>
                        <td v-show="task.type == 1">
                            <p v-for="(standard,index) in task.taskStandardDtlList">{{(index + 1) + '、' + standard.content}}</p>
                        </td>
                        <td v-show="task.type == 1">
                            <a href="javascript:;" @click="seeBigImg(img.fullPath)" v-for="(img,index) in task.taskImgList" class="link" >
                                {{img.imgName}}<br/></a>
                        </td>
                        <td v-show="task.type == 1">{{task.taskStateName}}</td>
                        <td v-show="task.type == 1">{{task.taskContinuousInspectionDays}}</td>
                        <!--           来料事件登记             -->
                        <td v-show="task.type == 2" colspan="4" style="padding:0;">
                            <table class="tableCommon innerTable" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:none;">
                                <tbody>
                                <tr>
                                    <td style="background-color: darkseagreen" width="80">序号</td>
                                    <td style="background-color: darkseagreen" width="170">客户名称</td>
                                    <td style="background-color: darkseagreen">事件描述</td>
                                    <td style="background-color: darkseagreen">临时措施</td>
                                    <td style="background-color: darkseagreen">原因分析</td>
                                    <td style="background-color: darkseagreen">改善措施</td>
                                </tr>
                                <tr v-for="(record,index) in task.inspectionIncomeRecordList">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{record.customerName}}</td>
                                    <td>{{record.exceptionDescribe}}</td>
                                    <td>{{record.tempDealMeasure}}</td>
                                    <td>{{record.causeAnalysis}}</td>
                                    <td>{{record.improveCounterplan}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                        <!--            仓库异常品登记            -->
                        <td v-show="task.type == 3" colspan="4" style="padding:0;">
                            <table class="tableCommon innerTable" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:none;">
                                <tbody>
                                <tr>
                                    <td style="background-color: darkseagreen" width="80">序号</td>
                                    <td style="background-color: darkseagreen" width="170">客户名称</td>
                                    <td style="background-color: darkseagreen">料号</td>
                                    <td style="background-color: darkseagreen">批次</td>
                                    <td style="background-color: darkseagreen">数量</td>
                                    <td style="background-color: darkseagreen">计划处理时间</td>
                                    <td style="background-color: darkseagreen">异常品存放区域图片</td>
                                </tr>
                                <tr v-for="(record,index) in task.inspectionExceptionRecordList">
                                    <td>{{ index + 1 }}</td>
                                    <td>{{record.customerName}}</td>
                                    <td>{{record.materialNum}}</td>
                                    <td>{{record.batchNum}}</td>
                                    <td>{{record.count}}</td>
                                    <td>{{record.planDealDate}}</td>
                                    <td>
                                        <a href="javascript:;" @click="seeBigImg(url)" v-for="(url,index) in record.imgUrlList" class="link">图片{{(index + 1)}}<br/></a>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>

                    </tr>
                </tbody>            
            </table>
        </div>
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>
    </div>
</template>

<script>
	import inspectSummaryDetail from './inspectSummaryDetail.js'
	export default inspectSummaryDetail
</script>
<style lang="scss" scoped>
.inspectSummaryDetailPage{
    .tableCommon{
        border:$border;
        td{
            white-space: inherit;
            word-break: break-all;
            padding:5px;
            height: auto!important;;
        }
        &.innerTable{
            tr:last-child{
                td{
                    border-bottom: none!important;
                }
            }
        }
    }
    .title{
        text-align: center;
        line-height: 50px;
        font-weight: bold;
        font-size: 16px;
        .date{
            font-size: 12px;
            float:right;
        }
    }
}
</style>
