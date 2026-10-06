<template>
    <div id="ownVehicleStatistics">
        <div class="topView">
            <div class="leftView">
                <div class="innerView">
                    <div class="title">30天内将到期或已到期统计数据</div>
                    <div class="totalList">
                        <div class="item" @click="toInsurance">
                            <div class="num">{{ info.insuranceExpireNum }}</div>
                            <div class="name">保险到期</div>
                        </div>
                        <div class="item" @click="toAnnual">
                            <div class="num">{{ info.annualInspectionExpireNum }}</div>
                            <div class="name">年检到期</div>
                        </div>
                        <div class="item" @click="toMaintenance">
                            <div class="num">{{ info.maintenanceExpireNum }}</div>
                            <div class="name">保养到期</div>
                        </div>
                    </div>
                </div>
                <div class="innerView">
                    <div class="title">里程统计
                        <el-select class="mileageType" v-model="mileageType" @change="loadVehicleMileageSumData">
                            <el-option label="昨天" value="1"></el-option>
                            <el-option label="上月" value="2"></el-option>
                        </el-select>
                    </div>
                    <div class="totalList mileage">
                        <div class="item" @click="toOwnVehicleMileage">
                            <div class="num">{{ info.sumMileageSum }}</div>
                            <div class="name">总行驶里程（km）</div>
                        </div>
                        <div class="item" @click="toOwnVehicleMileage">
                            <div class="num">{{ info.effectiveMileageSum }}</div>
                            <div class="name">有效里程（km）</div>
                        </div>
                        <div class="item" @click="toOwnVehicleMileage">
                            <div class="num">{{ info.deadheadMileageSum }}</div>
                            <div class="name">空驶里程（km）</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="centerView">
                <div class="title">
                    <span>出勤统计</span>
                </div>
                <div class="chartView">
                    <div id="pieChart0" class="pieChart"></div>
                </div>
            </div>
            <div class="rightView">
                <div class="title">车辆总数：{{ info.stateNums1[0] + info.stateNums1[1] }}</div>
                <div class="chartView">
                    <div id="pieChart1" class="pieChart"></div>
                    <div id="pieChart2" class="pieChart"></div>
                </div>
            </div>
        </div>
        <div class="tableChartView">
            <div class="leftView">
                <div class="title clearfix">
                    收入成本对比表
                    <!-- <el-date-picker class="fr" v-model="chartQuery1.billMonth" @change="initEchart1" size="small"
                        type="month" value-format="yyyy-MM" placeholder="选择月份">
                    </el-date-picker> -->
                </div>
                <div class="chartView">
                    <div style="height:290px;width: 100%;" id="lineChart"></div>
                </div>
            </div>
            <div class="rightView">
                <div class="title">运作车次TOP10</div>
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th>排名</th>
                            <th>车牌号码</th>
                            <th>运作累计数</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(data, index) in waybillRankList">
                            <td>{{ index + 1 }}</td>
                            <td>{{ data.plateNumber }}</td>
                            <td>{{ data.count }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="tableView">
            <div class="leftView">
                <div class="title">疲劳驾驶列表</div>
                <div class="nodata" v-if="fatigueDrivingList.length == 0">暂无数据</div>
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th>序号</th>
                            <th>车牌号码</th>
                            <th>司机</th>
                            <th>状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(data, index) in fatigueDrivingList">
                            <td>{{ index + 1 }}</td>
                            <td>{{ data.plateNumber }}</td>
                            <td>{{ data.driverUserName }}</td>
                            <td>{{ data.content }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="rightView">
                <div class="title">长时间离线列表</div>
                <div class="nodata" v-if="offLineList.length == 0">暂无数据</div>
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th>序号</th>
                            <th>车牌号码</th>
                            <th>状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(data, index) in offLineList">
                            <td>{{ index + 1 }}</td>
                            <td>{{ data.plateNumber }}</td>
                            <td>{{ data.content }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import ownVehicleStatistics from './ownVehicleStatistics.js'

export default ownVehicleStatistics
</script>

<style lang="scss" scoped>
#ownVehicleStatistics {
    background: #fff;
    border: $border;
    height: auto;
    padding-bottom: 30px;

    .topView {
        padding: 30px;
        display: flex;

        .rightView,
        .centerView {
            border: $border;
            border-radius: 6px;
        }

        .title {
            font-size: 16px;
            font-weight: bold;
            padding: 5px 20px;
            line-height: 32px;
            text-align: center;
            color: #333;
        }

        .leftView {
            margin-right: 20px;
            width: 30%;
            display: flex;
            flex-direction: column;

            .title {
                font-size: 14px;
            }
            
            /deep/ .innerView {
                border: $border;
                border-radius: 6px;
                flex: 1;
                position: relative;

                &:first-child {
                    margin-bottom: 20px;
                }
                .mileageType{
                    position: absolute;
                    right:20px;
                    .el-input__inner{
                        height: 30px;
                        width: 100px;
                        line-height: 30px;
                    }
                    .el-input__icon{
                        line-height: 30px;
                    }
                }
            }


            .totalList {
                display: flex;
                padding: 0 20px 20px;

                .item {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #007aff;
                    flex-direction: column;
                    border-radius: 6px;
                    height: 5vw;
                    cursor: pointer;

                    &:nth-child(2) {
                        margin-left: 1.5vw;
                        background: #af52de;
                    }

                    &:nth-child(3) {
                        margin-left: 1.5vw;
                        background: #ff9502;
                    }

                    .num {
                        font-size: 1.2vw;
                        font-weight: bold;
                        color: #fff;
                        margin-bottom: 0.4vw;
                    }

                    .name {
                        font-size: 0.7vw;
                        color: #fff;
                    }

                }
                &.mileage{
                    .item{
                        &:first-child {
                            background: #5756d7;
                        }

                        &:nth-child(2) {
                            margin-left: 1.5vw;
                            background: #34c758;
                        }
        
                        &:nth-child(3) {
                            margin-left: 1.5vw;
                            background: #ff2d55;
                        }
                    }

                }
            }
        }

        .centerView {
            margin-right: 20px;
            width: 30%;
        }

        .rightView {
            flex: 1;
        }

        .chartView {
            display: flex;

            .pieChart {
                height: 15vw;
                flex: 1;
            }
        }
    }

    .tableChartView {
        padding: 0 30px;
        display: flex;
        background: #fff;


        .leftView {
            flex: 1;
            margin-right: 20px;

            .chartView {
                border: $border;
                margin-bottom: 20px;
                border-radius: 6px;
                padding: 20px 0;
            }
        }

        .rightView {
            width: 400px;

            .tableCommon {
                border: $border;
            }
        }

        .title {
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            color: #333;
            margin-bottom: 15px;
        }
    }

    .tableView {
        padding: 0 30px;
        display: flex;
        background: #fff;


        .leftView,
        .rightView {
            flex: 1;
            position: relative;
        }

        .leftView {
            margin-right: 20px;
        }

        .nodata {
            position: absolute;
            width: 100%;
            text-align: center;
            top: 100px;
            font-size: 16px;
        }

        .title {
            font-size: 14px;
            font-weight: bold;
            text-align: center;
            color: #333;
            margin-bottom: 15px;
        }

        .tableCommon {
            border: $border;
        }
    }
}
</style>
