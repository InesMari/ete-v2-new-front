<template>
    <div id="customerOperationSummary" class="orderManagePage">
      <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="customerOperationSummarySearch"></searchList>
<!--      <div class="search-list clearfix">-->
<!--            <div class="search-form clearfix" @keyup.enter="doQuery()">-->
<!--                <div class="item">-->
<!--                    <label class="label">客户</label>-->
<!--                    <div class="input-text">-->
<!--                        <el-input v-model="query.tenantName" placeholder="客户" type="text"></el-input>-->
<!--                    </div>-->
<!--                </div>-->
<!--                <div class="item daterange">-->
<!--                    <label class="label">下单时间</label>-->
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
<!--                    <label class="label">客户下单时间</label>-->
<!--                    <div class="input-text">-->
<!--                        <el-date-picker v-model="query.customerOrderDate" type="daterange" range-separator="至" start-placeholder="开始日期"-->
<!--                                        end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"-->
<!--                                        unlink-panels></el-date-picker>-->
<!--                    </div>-->
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
                <h3><span>客户运作汇总列表</span></h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain @click="exportDownload" size="mini"  v-entity :entityId="[{1007007:1007017}]" >导出EXCEL</el-button>
                    <el-button type="primary" plain @click="showDownload(1)" size="mini" v-entity="1007027">导出月运作汇总表</el-button>
                    <el-button type="primary" plain @click="showDownload(2)" size="mini" v-entity="1007076">导出月度成本差异</el-button>
                    <el-button type="primary" plain @click="showDownload(3)" size="mini" v-entity="1007077">导出月度收入差异</el-button>
                    <el-button type="primary" plain @click="showDownload(4)" size="mini" v-entity="1007078">导出供应商月度成本报表</el-button>
                </div>
            </div>
            <!-- 主体表格 -->
            <tableCommon tableName="customerOperationSummaryTable" ref="table" :showNum="true" :singleSelect="false" :showSetTable="true" :head="head">
            </tableCommon>
        </div>

      <!-- 导出运作状况-开始 -->
      <el-dialog :title="title" :visible.sync="downloadShowFlag" width="420px" :close-on-click-modal="false"
                 :close-on-press-escape="false">
        <div style="position: relative;padding-left: 45px;margin-bottom: 15px;">
          <img class="tip" src="@/static/image/tip.png" alt="" style="width:24px;position: absolute;top:50%;margin-top:-12px;left: 10px">
          请选择导出数据月份
        </div>
        <div class="common-info" style="border:none;padding:20;">
          <ul class="content clearfix">
            <li class="item" style="width: 80%;">
              <label class="label-term"><em>*</em>数据月份</label>
              <div class="input-text">
                <el-date-picker v-model="billMonth" :default-value="preMonth" type="month" placeholder="数据月份" value-format="yyyy-MM"></el-date-picker>
              </div>
            </li>
          </ul>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="closeDownload()">关闭</el-button>
            <el-button type="primary" size="mini" @click="downloadExcel">提交</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 导出运作状况-结束 -->
    </div>
</template>

<script>
	import customerOperationSummary from './customerOperationSummary.js'
	export default customerOperationSummary
</script>
<style lang="scss">

</style>





