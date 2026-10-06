<template>
    <div id="inspectTaskDetail" class="inspectTaskDetailPage">
        <div class="common-info">
            <h3 class="common-title"><span class="title-name">基本信息</span></h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">巡检任务编号</td>
                    <td class="value">{{info.taskNum}}</td>
                    <td class="label">巡检事项</td>
                    <td class="value">{{info.inspectionItem}}</td>
                    <td class="label">任务状态</td>
                    <td class="value">{{info.taskStateName}}</td>
                </tr>
                <tr>
                    <td class="label">巡检设备</td>
                    <td class="value">{{info.equipment}}</td>
                    <td class="label">设备编号</td>
                    <td class="value">{{info.equipmentNum}}</td>
                    <td class="label">执行人</td>
                    <td class="value">{{info.executorStr}}</td>
                </tr>
                <tr>
                    <td class="label">规定巡检时间</td>
                    <td class="value">{{info.stipulateDate}}</td>
                    <td class="label">实际巡检时间</td>
                    <td class="value">{{info.actualDate}}</td>
                    <td class="label">实际巡检人</td>
                    <td class="value">{{info.actualUserName}}</td>
                </tr>
                <tr>
                    <td class="label">备注</td>
                    <td class="value" colspan="5">{{info.remark}}</td>
                </tr>
                <tr>
                    <td class="label">点检备注</td>
                    <td class="value" colspan="5">{{info.submitRemark}}</td>
                </tr>
            </table>
            <h3 class="common-title mt_20"><span class="title-name">巡检信息</span></h3> 
            <!-- 车辆            -->
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th width="80">序号</th>
                        <th width="120">巡检项目</th>
                        <th width="300">检查基准</th>
                        <th width="300">巡检要求</th>
                        <th width="150">巡检方法</th>
                        <th width="80">检查结果</th>
                        <th width="200">异常巡检情况</th>
                        <th width="80">图片</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in standardDtlList">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.inspectItem }}</td>
                        <td>{{ item.content }}</td>
                        <td>{{ item.inspectRequire }}</td>
                        <td>{{ item.inspectMethodName }}</td>
                        <td>
                          {{item.type == 1?item.contentAnswerName:item.contentAnswer}}
                        </td>
                        <td>{{ item.exceContent }}</td>
                        <td>
                          <a href="javascript:void(0);" :class="!item.fullPath?'disabled':'link'" @click.stop="seeBigImg(item)" style="margin: 0 10px;">查看</a>
                        </td>
                    </tr>
                </tbody>
            </table>
            <h3 class="common-title mt_20"><span class="title-name">附加图片</span></h3>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th width="80">序号</th>
                        <th>附加图片名称</th>
                        <th width="200">查看图片</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in imgList">
                        <td>{{ index + 1 }}</td>
                        <td> {{ item.imgName }}</td>
                        <td @click="seeBigImg(item)"><a href="javascript:;"  :class="!item.fullPath?'disabled':'link'" >查看图片</a></td>
                    </tr>
                </tbody>            
            </table>
            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
            </div>
        </div>
        <fileViewer v-if="isShowBigImg" :on-close="closeViewer" :url-list="[bigImageUrl]"></fileViewer>
    </div>
</template>

<script>
	import inspectTaskDetail from './inspectTaskDetail.js'
	export default inspectTaskDetail
</script>
<style lang="scss" scoped>
.inspectTaskDetailPage{
    .tableCommon{
        border:$border;
    }
}
</style>
