<template>
    <div id="inspectNormDetail" class="inspectNormDetailPage">
        <div class="common-info">
            <h3 class="common-title"><span class="title-name">基本信息</span></h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">巡检事项编号</td>
                    <td class="value">{{info.inspectionNum}}</td>
                    <td class="label">巡检事项</td>
                    <td class="value">{{info.inspectionItem}}</td>
                </tr>
                <tr>
                    <td class="label">创建人</td>
                    <td class="value">{{info.createUserName}}</td>
                    <td class="label">创建时间</td>
                    <td class="value">{{info.createDate}}</td>
                </tr>
                <tr>
                    <td class="label">设备类别</td>
                    <td class="value">{{info.equipmentTypeName}}</td>
                    <td class="label">设备扫码</td>
                    <td class="value">{{info.scanQrcodeName}}</td>
                </tr>
                <tr>
                  <td class="label">备注</td>
                  <td class="value" colspan="3">{{info.remark}}</td>
                </tr>
            </table>
            <h3 class="common-title mt_20"><span class="title-name">巡检基准</span></h3>            
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th width="80">序号</th>
                        <th  width="120">巡检项目</th>
                        <th>检查基准</th>
                        <th>巡检要求</th>
                        <th width="150">巡检方法</th>
                        <th v-show="info.type == 2" width="150">上限
                            <el-tooltip class="item" effect="light" placement="top-start">
                                <div slot="content">设置了上限巡检提交的数值超过上限则该项为异常项</div>
                                <i class="el-icon-question pointer"></i>
                            </el-tooltip>
                        </th>
                        <th v-show="info.type == 2" width="150">下限
                            <el-tooltip class="item" effect="light" placement="top-start">
                                <div slot="content">设置了下限巡检提交的数值超过下限则该项为异常项</div>
                                <i class="el-icon-question pointer"></i>
                            </el-tooltip>
                        </th>
                        <th width="150">检查结果填写方式</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in list">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.inspectItem }}</td>
                        <td>{{ item.content }}</td>
                        <td>{{ item.inspectRequire }}</td>
                        <td>{{ item.inspectMethodName }}</td>
                        <td v-show="info.type == 2">{{ item.up }}</td>
                        <td v-show="info.type == 2">{{ item.floor }}</td>
                        <td>{{ item.typeName }}</td>
                    </tr>
                </tbody>            
            </table>
        </div>
    </div>
</template>

<script>
	import inspectNormDetail from './inspectNormDetail.js'
	export default inspectNormDetail
</script>
<style lang="scss" scoped>
.inspectNormDetailPage{
    .tableCommon{
        border:$border;
    }
    .remarkView{
        border:$border;
        display: flex;
        // min-height: 80px;
        .label{
            display: flex;
            width: 100px;
            justify-content: center;
            align-items: center;
            border-right: $border;
        }
        .remarkList{
            padding: 10px 20px;
            .item{
                line-height: 20px;
            }
        }
    }
}
</style>
