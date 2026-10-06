<template xmlns="http://www.w3.org/1999/html">
    <div id="supplierZCQuoteVerify" class="supplierZCQuoteVerify">
        <searchList :formData="formData" @doQuery="doQuery" @clearFn="clearQuery" :query="query" searchKey="supplierZCQuoteVerifySearch"></searchList>

        <div class="table-content clearfix">
            <div class="table-title">
                <h3>
                    <span>待办事项-供应商新整车报价审核
                        (<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)
                    </span>
                    <el-tooltip effect="light" content="待办事件-供应商新整车报价处理" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn">
                    <el-button type="primary" plain size="mini" @click="verifyQuote(true)" v-entity="1002080">审核通过</el-button>
                    <el-button type="primary" plain size="mini" @click="verifyQuote(false)" v-entity="1002080">审核不通过</el-button>
                </div>
            </div>
                <tableCommon :class="{'table':showTableDetail}" tableName="supplierZCQuoteVerifyTable" ref="table" :head="head" :showNum="true"
                             :showSetTable="false" @dblclickItem="dblclickItem"  :singleSelect="true"></tableCommon>
                <div class="tableDetail" v-show="showTableDetail">
                    <div class="con" v-show="quoteData.quoteNum">
                        <label class="label">报价单号:</label>
                        <span style="color: red;">{{quoteData.quoteNum}}</span>
                        <label class="label">供应商:</label>
                        <span>{{quoteData.tenantName}}</span>
                        <label class="label">线路:</label>
                        <span>{{quoteData.routeName}}</span>
                    </div>
                    <div class="con" v-show="quoteData.createUserName">
                        <label class="label">创建人:</label>
                        <span>{{quoteData.createUserName}}</span>
                        <label class="label">创建时间:</label>
                        <span>{{quoteData.createDate}}</span>
                    </div>
                    <div class="table_height">
                        <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                            <thead>
                                <tr>
                                    <th>序号</th>
                                    <th>计费方式</th>
                                    <th>报价车型</th>
                                    <th>车长</th>
                                    <th>货物</th>
                                    <th>运费单价/元</th>
                                    <th>点位费单价/元</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(item,index) in quoteDetailData">
                                <td>{{ index }}</td>
                                <td>{{ item.billingTypeName }}</td>
                                <td>{{ item.quoteVehicleTypeName }}</td>
                                <td>{{ item.vehicleLengthName }}</td>
                                <td>{{ item.goodsName }}</td>
                                <td>{{ item.feePrice }}</td>
                                <td>{{ item.pointFee }}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
        </div>
    </div>
</template>

<script>
import supplierZCQuoteVerify from './supplierZCQuoteVerify.js'
export default supplierZCQuoteVerify
</script>
<style lang="scss">
.supplierZCQuoteVerify {
    .table {
        width: 40%;
        float: left;
    }
    .tableDetail {
        width: 59%;
        float: right;
        border:$border;
        padding: 10px 20px;
        box-sizing: border-box;
        .con{
            line-height: 24px;
            margin-bottom: 10px;
            span{
                margin-right: 20px;
            }
        }
    }
    .table_height {
        border: $border;
        border-bottom: none;
        overflow: auto;
    }
}
</style>
