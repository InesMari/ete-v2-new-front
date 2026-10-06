<template>
    <div id="orderReturnFeeManage" class="orderManagePage">
      <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="orderReturnFeeManageSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>回程单收款记录列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="回程单收款记录列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain @click="cancleReceiveFee" size="mini" v-entity="1003096">撤销付款</el-button>
                    <el-button type="primary" plain @click="downloadExcel" size="mini" v-entity="1003097">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="orderReturnFeeManageTable" ref="table" :head="head" :showNum="true" :showSetTable="true"
                         :singleSelect="false">
                <template v-slot:default="{item, code}">
                  <a href="javascript:void(0);" class="link" v-for="(data,index) in item.waybillNumArray"
                     @click.stop="toDetail(item, code,index)"
                     v-if="code=='waybillNum'">{{ index > 0 ? ',' + data : data }}</a>
                    <a href="javascript:void(0);" class="link"  @click.stop="toDetail(item, code)" v-if="code=='orderNum'">{{item[code]}}</a>
                </template>
            </tableCommon>
        </div>
    </div>
</template>

<script>
	import orderReturnFeeManage from './orderReturnFeeManage.js'
	export default orderReturnFeeManage
</script>
<style lang="scss">

</style>





