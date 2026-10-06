<template>
    <div id="workReport" class="workReportPage">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item" style="width:100%;">
                    <div class="input-text" style="width:150px;">
                         <el-date-picker  v-model="year"  type="year"  placeholder="选择年"></el-date-picker>
                    </div>
                    <div class="months clearfix">
                        <div class="month" :class="{'active':item.isSelect,'disabled':item.disabled}" v-for="item in monthArr" :key="item.value" @click="chooseMonth(item)">{{item.name}}</div>
                    </div>
                </div>
                <div class="item" style="width:100%;">
                    <!-- <label class="label">公司名称：</label> -->
                    <div class="input-text">
                        <el-select v-model="companyList" placeholder="请选择公司" multiple filterable>
                            <el-option
                                v-for="item in companyOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
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
        </div>
        <div class="table-content">
            <div class="table-title" style="overflow: hidden;">
                <h3>
                    <span>订单计划列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="订单计划列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn">
                    <el-button type="primary" plain size="mini" @click="planToOrder()" v-entity="82">领单</el-button>
                    <el-button type="primary" plain size="mini" @click="toAddOrdPlan()" v-entity="83">新增计划</el-button>
                    <el-button type="primary" plain size="mini" @click="toPlanDetail()" v-entity="84">查看计划</el-button>
                    <el-button type="primary" plain size="mini" @click="canclePlan()" v-entity="85">取消计划</el-button>
                </div>
            </div>
            <scrollTable tableName="ordPlanManageTable" ref="table" :head="head" :doSum="true"></scrollTable>
        </div>

    </div>
</template>

<script>
    import workReport from './workReport.js'

    export default workReport
</script>
<style lang="scss">
.workReportPage{
    .search-list{
        .search-form{
            .months{
                border:$border;
                // border-left: $border;
                // border-right: $border;
                height: 30px;
                margin-top: 1px;
                border-radius: 3px;
                float: left;
                width: calc(100% - 260px);
                // max-width: 1000px;
                .month{
                    cursor: pointer;
                    float: left;
                    line-height: 30px;
                    border-right: $border;
                    text-align: center;
                    width: 7.69%;
                    box-sizing: border-box;
                    &:last-child{
                        border:none;
                    }
                    &:hover{
                        color:$main-color;
                    }
                    &.active{
                        background: $main-color;
                        color:#fff;
                    }
                    &.disabled{
                        background: $bg-color!important;
                        color: #999;
                        cursor: not-allowed;
                    }
                }
            }
        }
    }
    .scrollTableComponents{
        height: calc(100% - 50px);
        .table_height{
            height: 100%;
            max-height: initial;
        }
    }
}
</style>
