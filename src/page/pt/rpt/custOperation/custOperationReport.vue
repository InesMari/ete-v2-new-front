<template>
    <div id="custOperationReport" class="workReportPage">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item" style="width:100%;">
                    <div class="input-text" style="width:150px;">
                         <el-date-picker  v-model="year"  type="year" placeholder="选择年" @change="initYearMonth"></el-date-picker>
                    </div>
                    <div class="months clearfix">
                        <div class="month" :class="{'active':item.isSelect,'disabled':item.disabled}" v-for="item in monthArr" :key="item.value" @click="chooseMonth(item)">{{item.name}}</div>
                    </div>
                </div>
                <div class="item" style="width:100%;">
                    <!-- <label class="label">公司名称：</label> -->
                    <div class="input-text">
                        <el-select v-model="custTenantIds" placeholder="请选择客户" multiple filterable>
                            <el-option
                                v-for="item in companyOptions"
                                :key="item.tenantId"
                                :label="item.name"
                                :value="item.tenantId">
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
          <!-- 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 -->
          <div class="search-bot">
            <img src="@/static/image/search-bot.png" alt="">
            <i class="icon el-icon-arrow-down"></i>
            <i class="icon el-icon-arrow-up"></i>
          </div>
        </div>
        <div class="table-content">
            <div class="table-title" style="overflow: hidden;">
                <h3>
                    <span>客户运作报表</span>
                </h3>
                <div class="table-title-btn">
                    <el-button type="primary" plain size="mini" @click="downloadExcelFile" v-entity :entityId="[{1007011:1007021}]">导出EXCEL</el-button>
                </div>
            </div>
            <scrollTable tableName="custOperationReportTable" ref="table" :head="head" :doQrySum="true"></scrollTable>
        </div>

    </div>
</template>

<script>
    import custOperationReport from './custOperationReport.js'

    export default custOperationReport
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
