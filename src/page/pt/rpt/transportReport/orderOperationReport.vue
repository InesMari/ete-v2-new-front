<template>
    <div id="orderOperationReport" class="orderManagePage">
      <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="orderOperationReportSearch"></searchList>
<!--      <div class="search-list clearfix">-->
<!--            <div class="search-form clearfix" @keyup.enter="doQuery()">-->
<!--                <div class="item">-->
<!--                    <label class="label">客户</label>-->
<!--                    <div class="input-text">-->
<!--                        <el-input v-model="query.tenantName" placeholder="客户" type="text"></el-input>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="item">-->
<!--                    <label class="label">线路名称</label>-->
<!--                    <div class="input-text">-->
<!--                        <el-input v-model="query.routeName" placeholder="线路名称" type="text"></el-input>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="item">-->
<!--                    <label class="label">订单号</label>-->
<!--                    <div class="input-text">-->
<!--                        <el-input v-model="query.orderNum" placeholder="订单号" type="text"></el-input>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="item">-->
<!--                    <label class="label">供应商</label>-->
<!--                    <div class="input-text">-->
<!--                        <el-input v-model="query.supplierName" placeholder="供应商" type="text"></el-input>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="item">-->
<!--                    <label class="label">毛利额</label>-->
<!--                    <div class="input-text sel-ipt">-->
<!--                        <el-select v-model="query.grossProfitSymbol" placeholder="" clearable>-->
<!--                            <el-option v-for="item in symbolOptions" :key="item.value" :label="item.label"-->
<!--                                       :value="item.value"></el-option>-->
<!--                        </el-select>-->
<!--                        <el-input v-model="query.grossProfit" v-mypmdoubleval placeholder="毛利额" type="text"></el-input>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="item">-->
<!--                    <label class="label">毛利率</label>-->
<!--                    <div class="input-text sel-ipt">-->
<!--                        <el-select v-model="query.grossProfitRateSymbol" placeholder="" clearable>-->
<!--                            <el-option v-for="item in symbolOptions" :key="item.value" :label="item.label"-->
<!--                                       :value="item.value"></el-option>-->
<!--                        </el-select>-->
<!--                        <el-input v-model="query.grossProfitRate" v-mypmdoubleval placeholder="毛利率" type="text"></el-input>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="item">-->
<!--                    <label class="label">订单类型</label>-->
<!--                    <div class="input-text">-->
<!--                        <el-select v-model="query.orderType" @change="doQuery" clearable placeholder="订单类型">-->
<!--                          <el-option v-for="item in orderTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>-->
<!--                        </el-select>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="item">-->
<!--                    <label class="label">订单状态</label>-->
<!--                    <div class="input-text">-->
<!--                        <el-select v-model="query.orderState" @change="doQuery" clearable placeholder="订单状态" >-->
<!--                            <el-option v-for="item in orderStateData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>-->
<!--                        </el-select>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="item daterange">-->
<!--                    <label class="label">创建时间</label>-->
<!--                    <div class="input-text">-->
<!--                        <el-date-picker v-model="query.createDate" type="daterange" range-separator="至" start-placeholder="开始日期"-->
<!--                                        end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"-->
<!--                                        unlink-panels></el-date-picker>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="item daterange">-->
<!--                    <label class="label">完成时间</label>-->
<!--                    <div class="input-text">-->
<!--                        <el-date-picker v-model="query.finishDate" type="daterange" range-separator="至" start-placeholder="开始日期"-->
<!--                                        end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"-->
<!--                                        unlink-panels></el-date-picker>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="item daterange">-->
<!--                    <label class="label">要求运作时间</label>-->
<!--                    <div class="input-text">-->
<!--                        <el-date-picker v-model="query.workDate" type="daterange" range-separator="至" start-placeholder="开始日期"-->
<!--                                        end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"-->
<!--                                        unlink-panels></el-date-picker>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="item daterange">-->
<!--                  <label class="label">客户下单时间</label>-->
<!--                  <div class="input-text">-->
<!--                    <el-date-picker v-model="query.customerOrderDate" type="daterange" range-separator="至" start-placeholder="开始日期"-->
<!--                                    end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"-->
<!--                                    unlink-panels></el-date-picker>-->
<!--                  </div>-->
<!--                </div>-->
<!--            </div>-->
<!--            <div class="search-btn clearfix">-->
<!--                <div class="btn">-->
<!--                    <el-button type="primary" plain size="mini" @click="doQuery" icon="el-icon-search">查询</el-button>-->
<!--                </div>-->
<!--                <div class="btn">-->
<!--                    <el-button type="danger" plain size="mini" @click="initQuery()" icon="el-icon-close">清空</el-button>-->
<!--                </div>-->
<!--            </div>-->
<!--            &lt;!&ndash; 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 &ndash;&gt;-->
<!--            <div class="search-bot">-->
<!--                <img src="@/static/image/search-bot.png" alt="">-->
<!--                <i class="icon el-icon-arrow-down"></i>-->
<!--                <i class="icon el-icon-arrow-up"></i>-->
<!--            </div>-->
<!--        </div>-->

        <div class="table-content">
            <div class="table-title">
                <h3><span>订单运作报表列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span></h3>
                <div class="table-title-btn" style="margin-right: 90px;">
<!--                    <el-button type="primary" plain @click="toOrderDetail" size="mini" v-entity="312">查看订单</el-button>-->
                    <el-button type="primary" plain @click="exportDownload" size="mini" v-entity :entityId="[{1007006:1007016}]" >导出EXCEL</el-button>
                </div>
            </div>
            <!-- 主体表格 -->
            <tableCommon tableName="orderOperationReportTable" ref="table" :showNum="true" :singleSelect="false" :showSetTable="true" :head="head" @dblclickItem="dblclickItem">
                <template v-slot:diyColorTd="{item}">
                    <span :style="item.orderState==3?'color:red!important':''">{{item.orderStateName}}</span>
                </template>
            </tableCommon>
        </div>
    </div>
</template>

<script>
	import orderOperationReport from './orderOperationReport.js'
	export default orderOperationReport
</script>
<style lang="scss">
  #orderOperationReport {
    .search-list {
      .search-form .item {
        .sel-ipt {
          & > .el-select {
            float: left;
            width: 40%;
          }

          & > .el-input {
            float: left;
            width: 60%;
          }
        }
      }
    }
  }
</style>





