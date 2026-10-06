<template>
    <div id="warehouseCostIncome">
        <div class="chartView chartView1" >
            <div class="title clearfix">收入成本对比
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
        <div class="chartView chartView2" >
            <div class="item">
                <div class="title clearfix">仓库成本分析
                    <el-select v-model="chartQuery2.workId" placeholder="请选择" size="small" class="fr" @change="initEchart2();forceUpdate();" filterable clearable>
                        <el-option v-for="item in storeHouseData" :key="item.workId" :label="item.workName" :value="item.workId"></el-option>
                    </el-select>
                    <el-date-picker
                        class="fr"
                        style="margin-right:20px"
                        v-model="chartQuery2.billMonth"
                        @change="initEchart2"
                        size="small"
                        type="month"
                        value-format="yyyy-MM"
                        placeholder="选择月份">
                    </el-date-picker>
                </div>
                <!--饼图-->
                <div style="height:350px;width: 100%;" id="chart2"></div>
            </div>
            <div class="item">
                <div class="title clearfix">变动成本统计
                    <el-date-picker
                        class="fr"
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
                            <th>排名</th>
                            <th>仓库</th>
                            <th>成本项</th>
                            <th>金额</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(data,index) in listData">
                            <td>{{ index+1 }}</td>
                            <td>{{ data.workName }}</td>
                            <td>{{ data.typeName }}</td>
                            <td>{{ data.fee }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="chartView chartView1" >
            <div class="title clearfix">收入成本趋势                
                <el-select v-model="chartQuery3.workId" placeholder="请选择" size="small" class="fr" @change="initEchart3();forceUpdate();" filterable clearable>
                    <el-option v-for="item in storeHouseData" :key="item.workId" :label="item.workName" :value="item.workId"></el-option>
                </el-select>
            </div>
            <!--折线图-->
            <div style="height:350px;width: 100%;" id="chart3"></div>
        </div>
    </div>
</template>

<script>
import warehouseCostIncome from './warehouseCostIncome.js'

export default warehouseCostIncome
</script>

<style lang="scss" scoped>
#warehouseCostIncome{
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
    }
        .chartView2{
        display: flex;
        padding: 0;;
        .item{
            flex: 1;
            padding: 30px;
            border-right: $border;
            &:last-child{
                border:none
            }
            .tableCommon{
                border:$border;
                margin-top: 20px;
            }
        }
    }
}
</style>




