<template>
    <div id="receiptsManage">
        <!-- 列表相关  开始 -->
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                  <label class="label">订单号：</label>
                  <div class="input-text">
                    <el-input v-model="query.custOrderNum" placeholder="订单号/我的单号" type="text"
                              autocomplete="new-password"></el-input>
                  </div>
                </div>
                <div class="item">
                  <label class="label">车牌号码：</label>
                  <div class="input-text">
                    <el-input v-model="query.plateNumber" placeholder="车牌号码" type="text"
                              autocomplete="new-password"></el-input>
                  </div>
                </div>
                <div class="item">
                  <label class="label">司机：</label>
                  <div class="input-text">
                    <el-input v-model="query.driverName" placeholder="司机" type="text"
                              autocomplete="new-password"></el-input>
                  </div>
                </div>
                <div class="item">
                    <label class="label">派车单号：</label>
                    <div class="input-text">
                        <el-input v-model="query.waybillNum" placeholder="派车单号" type="text"
                                  autocomplete="new-password"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">单据状态：</label>
                    <div class="input-text">
                        <el-select v-model="query.receiptState" @change="doQuery" clearable placeholder="单据状态">
                            <el-option v-for="item in receiptStateData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <label class="label">单据类型：</label>
                    <div class="input-text">
                        <el-select v-model="query.receiptType" @change="doQuery" clearable placeholder="单据类型">
                            <el-option v-for="item in receiptTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询</el-button>
                </div>
                <div class="btn">
                    <el-button type="danger" plain size="mini" icon="el-icon-close" @click="initQuery()">清空</el-button>
                </div>
            </div>
        </div>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>单据列表</span>
                    <el-tooltip effect="light" content="单据列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
            </div>
            <tableCommon tableName="custReceiptManageTable" ref="table" :head="head" :showNum="true" :showSetTable="true" :singleSelect="true">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" class="link" @click.stop="toDetail(item, code)" style="margin: 0 10px;">{{item[code]}}</a>
                </template>
            </tableCommon>
        </div>
        <!-- 列表相关  结束 -->
      <!-- 查看大图 -->
      <fileViewer ref="viewer" :url-list="srcList"></fileViewer>
    </div>
</template>

<script>
	import receiptsManage from './receiptsManage.js'
	export default receiptsManage
</script>
<style lang="scss">

</style>
