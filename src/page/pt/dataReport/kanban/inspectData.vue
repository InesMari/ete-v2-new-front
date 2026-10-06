<template>
    <div id="inspectData">
        <div class="chartView chartView1" >
            <div class="title clearfix">巡检设备统计
                <el-date-picker
                    class="fr"
                    v-model="chartQuery1.billMonth"
                    @change="initEchart1"
                    size="small"
                    type="month"
                    value-format="yyyy-MM"
                    placeholder="选择月份">
                </el-date-picker>
            </div>
            <div style="height:350px;width: 100%;" id="chart1"></div>
        </div>
        <div class="chartView chartView1" >
            <div class="item">
                <div class="title clearfix">巡检任务完成情况
                    <el-select v-model="listQuery.workId" size="small" class="fr"
                               @change="initList();forceUpdate();"
                               filterable clearable placeholder="请选择" >
                        <el-option v-for="item in storeHouseData" :key="item.workId" :label="item.workName" :value="item.workId"></el-option>
                    </el-select>
                    <el-date-picker
                        class="fr"
                        style="margin-right:20px"
                        v-model="listQuery.billMonth"
                        @change="initList"
                        size="small"
                        type="month"
                        value-format="yyyy-MM"
                        placeholder="选择月份">
                    </el-date-picker>
                </div>
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th>序号</th>
                            <th>巡检事项</th>
                            <th>待巡检</th>
                            <th>已巡检</th>
                            <th>未巡检</th>
                            <th>累计巡检天数</th>
                            <th>上次巡检时间</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in listData">
                            <td>{{ index+1 }}</td>
                            <td>{{ item.inspectionItem }}</td>
                            <td>
                                <el-progress type="circle" width="40" :percentage="item.countRate0" stroke-width="3"></el-progress>
                            </td>
                            <td>
                                <el-progress type="circle" width="40" :percentage="item.countRate1" stroke-width="3" color="#13ce66"></el-progress>
                            </td>
                            <td>
                                <el-progress type="circle" width="40" :percentage="item.countRate2" stroke-width="3" color="#ff4949"></el-progress>
                            </td>
                            <td>
                                {{ item.taskContinuousInspectionDays }}
                            </td>
                            <td>{{ item.lastInspectionDate }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="chartView chartView1" >
            <div class="title clearfix">巡检任务统计                
                <el-select v-model="chartQuery3.workId" size="small" class="fr"
                           @change="initEchart3();forceUpdate();"
                           filterable clearable placeholder="请选择">
                    <el-option v-for="item in storeHouseData" :key="item.workId" :label="item.workName" :value="item.workId"></el-option>
                </el-select>
            </div>
            <!--折线图-->
            <div style="height:350px;width: 100%;" id="chart3"></div>
        </div>
    </div>
</template>

<script>
import inspectData from './inspectData.js'

export default inspectData
</script>

<style lang="scss" scoped>
#inspectData{
    background: #fff;
    border: $border;

    /deep/ .chartView{
        padding:30px;
        border-bottom: $border;
        background: #fff;
        .title{
            font-size: 16px;
            font-weight: bold;
            padding: 0 20px;
            line-height: 32px;
        }
        .el-date-editor.el-input{
            width: 120px;
        }
        .tableCommon{
            border:$border;
            margin-top: 20px;
        }
    }
}
</style>




