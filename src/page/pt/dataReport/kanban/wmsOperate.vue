<template>
    <div id="wmsOperate">
        <div class="chartView chartView1" >
            <div class="title clearfix">
                <el-select class="fl" style="width: 45%;" v-model="query.workId"
                           filterable clearable multiple size="small"
                           @change="changeWork">
                    <el-option v-for="item in workData"
                               :key="item.workId"
                               :label="item.workName"
                               :value="item.workId"
                               :disabled="item.disabled"></el-option>
                </el-select>
                <el-date-picker style="width: 45%"
                    class="fr"
                    v-model="query.month"
                    @change="changeDate"
                    size="small"
                    type="months"
                    value-format="yyyy-MM"
                    format="yyyy-MM"
                    placeholder="选择月份">
                </el-date-picker>
            </div>
            <div class="tableView">
            <table class="tableCommon" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th>序号</th>
                        <th width="180px">物流中心</th>
                        <th>发生月份</th> <!-- -->
                        <th>到仓预约</th><!-- -->
                        <th>入库（托）</th>
                        <th>出库（托）</th>
                        <th>良品在库（托）</th><!-- -->
                        <th>待检品在库（托）</th><!-- -->
                        <th>不合格在库（托）</th><!-- -->
                        <th>呆滞品在库（托）</th><!-- -->
                        <th>报废品在库（托）</th><!-- -->
                        <th>短驳（车次）</th>
                        <th>短驳（托）</th><!-- -->
                        <th>短驳平均装配率</th>
                        <th>器具入库</th><!-- -->
                        <th>器具出库</th><!-- -->
                        <th>需求盘点数</th>
                        <th>派车单（单）</th>
                        <th>回单（单）</th>
                        <th>当期异常上报件数</th>
                        <th>累计异常未处理件数</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item,index) in list">
                        <td>{{ index+1 }}</td>
                        <td>{{ item.workName }}</td>
                        <td>{{ item.month }}</td><!-- -->
                        <td>{{ item.appointNum }}</td><!-- -->
                        <td>{{ item.inOrderNum }}</td>
                        <td>{{ item.outOrderNum }}</td>
                        <td>{{ item.stockNum1 }}</td><!-- -->
                        <td>{{ item.stockNum2 }}</td><!-- -->
                        <td>{{ item.stockNum3 }}</td><!-- -->
                        <td>{{ item.stockNum5 }}</td><!-- -->
                        <td>{{ item.stockNum6 }}</td><!-- -->
                        <td>{{ item.wmsWaybillCount }}</td>
                        <td>{{ item.wmsWaybillPalletNums }}</td><!-- -->
                        <td>{{ item.wmsWaybillAverageLoadRate + "%" }}</td>
                        <td>{{ item.deviceInNum }}</td><!-- -->
                        <td>{{ item.deviceOutNum }}</td><!-- -->
                        <td>{{ item.inventoryNum }}</td><!-- -->
                        <td>{{ item.waybillNum }}</td><!-- -->
                        <td>{{ item.receiptsNum }}</td><!-- -->
                        <td>{{ item.exceptionNum }}</td><!-- -->
                        <td>{{ item.unDeaExceptionlNum }}</td><!-- -->
                    </tr>
                </tbody>
            </table>
            </div>

            <div style="height:400px;width: 100%;" id="chart1"></div>
            <div style="height:400px;width: 100%;margin-top:20px;" id="chart2"></div>
            <div style="height:400px;width: 100%;margin-top:20px;" id="chart3"></div>
            <div style="height:400px;width: 100%;margin-top:20px;" id="chart4"></div>
        </div>
    </div>
</template>

<script>
import wmsOperate from './wmsOperate.js'

export default wmsOperate
</script>

<style lang="scss" scoped>
#wmsOperate{
    background: #fff;
    border: $border;

    /deep/ .chartView{
        padding:30px;
        border-bottom: $border;
        background: #fff;
        .title{
            font-size: 16px;
            font-weight: bold;
            line-height: 32px;
        }
        .el-date-editor.el-input{
            width: 120px;
        }
        .el-range-editor.el-input__inner{
            width: 250px;
        }
        .tableView{
            overflow-x: auto;
            border:$border;
            margin: 20px 0;
        }
    }
}
</style>




