<template>
    <div id="budgetAchievement">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">年度：</label>
                    <div class="input-text">
                        <el-date-picker v-model="query.billMonth" type="year" placeholder="账单月份" value-format="yyyy"></el-date-picker>
                    </div>
                </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询</el-button>
                </div>
                <div class="btn">
                    <el-button type="danger" plain size="mini" icon="el-icon-close" @click="clear()">清空</el-button>
                </div>
            </div>
            <!-- 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 -->
            <div class="search-bot">
                <img src="@/static/image/search-bot.png" alt="">
                <i class="icon el-icon-arrow-down"></i>
                <i class="icon el-icon-arrow-up"></i>
            </div>
        </div>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>营收预算达成情况表</span>
                </h3>
                <el-radio-group v-model="showType" size="small" @change="initInnerInfo();">
                    <el-radio-button label="1">表格</el-radio-button>
                    <el-radio-button label="2">图表</el-radio-button>
                </el-radio-group>
                <div class="table-title-btn">
                    <el-button type="primary" plain size="mini" v-entity="1006042">导出</el-button>
                </div>
            </div>            
            <div class="innerInfo1" v-show="showType == '1'">
                <scrollTable tableName="budgetAchievementTable" :showSelect="false" ref="table" :showNum="true" :head="head"></scrollTable>
            </div>
            <div class="innerInfo2" v-show="showType == '2'">
                <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
                <!-- 年度趋势 -->
                <div class="tab_con tab1 clearfix" v-show="currentTab.id == 1">
                    <div class="fl" style="width:calc(100% - 220px);height:100%;">
                        <div class="yearChart" id="yearChart"></div>
                        <scrollTable tableName="budgetAchievementTable" :showSelect="false" ref="table" :showNum="true" :head="head"></scrollTable>
                    </div>
                    <div class="fr" style="width:200px;padding-right:10px;">
                        <div class="quarterInfo">
                            <div class="item">
                                <div class="label">第一季度预算：</div>
                                <div class="data">3256</div>
                            </div>
                            <div class="item">
                                <div class="label">第一季度实际：</div>
                                <div class="data">3256</div>
                            </div>
                            <div class="item">
                                <div class="label">达成率：</div>
                                <div class="data">30%</div>
                            </div>
                        </div>
                        <div class="quarterInfo">
                            <div class="item">
                                <div class="label">第一季度预算：</div>
                                <div class="data">3256</div>
                            </div>
                            <div class="item">
                                <div class="label">第一季度实际：</div>
                                <div class="data">3256</div>
                            </div>
                            <div class="item">
                                <div class="label">达成率：</div>
                                <div class="data">30%</div>
                            </div>
                        </div>
                        <div class="quarterInfo">
                            <div class="item">
                                <div class="label">第一季度预算：</div>
                                <div class="data">3256</div>
                            </div>
                            <div class="item">
                                <div class="label">第一季度实际：</div>
                                <div class="data">3256</div>
                            </div>
                            <div class="item">
                                <div class="label">达成率：</div>
                                <div class="data">30%</div>
                            </div>
                        </div>
                        <div class="quarterInfo">
                            <div class="item">
                                <div class="label">第一季度预算：</div>
                                <div class="data">3256</div>
                            </div>
                            <div class="item">
                                <div class="label">第一季度实际：</div>
                                <div class="data">3256</div>
                            </div>
                            <div class="item">
                                <div class="label">达成率：</div>
                                <div class="data">30%</div>
                            </div>
                        </div>
                        <div class="quarterInfo">
                            <div class="item">
                                <div class="label">第一季度预算：</div>
                                <div class="data">3256</div>
                            </div>
                            <div class="item">
                                <div class="label">第一季度实际：</div>
                                <div class="data">3256</div>
                            </div>
                            <div class="item">
                                <div class="label">达成率：</div>
                                <div class="data">30%</div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- 区域对比 -->
                <div class="tab_con" v-show="currentTab.id == 2">
                    <div class="regionChart" id="regionChart"></div>
                </div>
                <!-- 物流中心对比 -->
                <div class="tab_con" v-show="currentTab.id == 3">
                    <div class="logisticsChart" id="logisticsChart"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	import budgetAchievement from './budgetAchievement.js'
	export default budgetAchievement
</script>
<style lang="scss" scoped>
    #budgetAchievement{
        /deep/ .innerTab {
            border:none;
            border-bottom: $border;
            margin-bottom: 20px;
        }
        .innerInfo1{
            height: calc(100% - 50px);
            /deep/ .scrollTableComponents{
                height: 100%;
                .table_height{
                    height: 100%;
                    max-height: none;
                }
            }
        }
        .innerInfo2{
            height: calc(100% - 110px);
        }
        .tab_con{
            height: 100%;
            /deep/ .scrollTableComponents{
                height: calc(100% - 402px);
                border-right: $border;
                .table_height{
                    min-height: 150px;
                    height: 100%;
                }
            }
            .yearChart{
                width: 100%;
                height: 400px;
            }
            .regionChart,.logisticsChart{
                height: 100%;
            }
        }
        .table-title{
            .el-radio-group{
                left: 45%;
                position: absolute;
                top: 8px;
            }
        }
        .quarterInfo{
            border: $border;
            padding:10px;
            margin-bottom: 10px;
            border-radius: 6px;
            .item{
                height: 30px;
                align-items: center;
                display: flex;
                .label{
                    width: 100px;
                    text-align: right;
                }
                .data{
                    flex: 1;
                }
            }
        }
    }
</style>

