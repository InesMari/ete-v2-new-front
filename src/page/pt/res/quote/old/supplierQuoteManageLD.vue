<template>
    <div id="supplierQuoteManageLD" class="quoteManageLDPage">
        <div class="search-list clearfix">
            <div class="search-form clearfix">
                <div class="item">
                    <label class="label">供应商：</label>
                    <div class="input-text">
                      <el-select v-model="loadParam.tenantId" @change="doQuery" filterable clearable placeholder="选择供应商">
                        <el-option v-for="item in supplierData" :key="item.tenantId" :label="item.supplierName"
                                   :value="item.tenantId"></el-option>
                      </el-select>
                    </div>
                </div>
                <div class="item">
                    <label class="label">起始地：</label>
                    <div class="input-text">
                        <el-input v-model="loadParam.beginAddress" placeholder="起始地" type="text"
                                  autocomplete="new-password"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">目的地：</label>
                    <div class="input-text">
                        <el-input v-model="loadParam.endAddress" placeholder="目的地" type="text"
                                  autocomplete="new-password"></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">搜索</el-button>
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
                    <span>供应商零担报价列表</span>
                    <el-tooltip effect="light" content="供应商零担报价列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn">
                    <el-button type="primary" plain size="mini" @click="add()" v-entity="381">新增报价</el-button>
                  <el-button type="danger" plain size="mini" @click="del()" v-entity="382">删除报价</el-button>
                  <el-button type="primary" plain size="mini" @click="modify()" v-entity="383">修改报价</el-button>
                </div>
            </div>
            <div class="clearfix">
                <tableCommon class="tableLD" tableName="supplierQuoteManage_LD" ref="table" :head="head" :showNum="false"
                             :showSetTable="false" @clickItem="clickItem" :singleSelect="true"></tableCommon>
                <div class="tableDetail">
                    <div class="table_height">
                        <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                            <thead>
                                <tr>
                                    <th colspan="7">提货费</th>
                                </tr>
                                <tr>
                                    <th colspan="4">提货费/按重量/kg</th>
                                    <th colspan="3">提货费/按体积</th>
                                </tr>
                                <tr>
                                    <th>&gt;</th>
                                    <th>≤</th>
                                    <th>净重价格/元</th>
                                    <th>毛重价格/元</th>

                                    <th>&gt;</th>
                                    <th>≤</th>
                                    <th>价格/元</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(item,index) in quoteFeeData">
                                <td>{{item.beginPickupWeight}}</td>
                                <td>
                                    {{item.endPickupWeight}}
                                </td>
                                <td>
                                    {{item.pickupNetWeightFee}}
                                </td>
                                <td>
                                {{item.pickupGrossWeightFee}}
                                </td>

                                <td>{{item.beginPickupVolume}}</td>
                                <td>
                                    {{item.endPickupVolume}}
                                </td>
                                <td>
                                    {{item.pickupVolumeFee}}
                                </td>

                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="table_height">
                        <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                            <thead>
                                <tr>
                                    <th colspan="7">送货费</th>
                                </tr>
                                <tr>
                                    <th colspan="4">送货费/按重量/kg</th>
                                    <th colspan="3">送货费/按体积/m³</th>
                                </tr>
                                <tr>
                                    <th>&gt;</th>
                                    <th>≤</th>
                                    <th>净重价格/元</th>
                                    <th>毛重价格/元</th>

                                    <th>&gt;</th>
                                    <th>≤</th>
                                    <th>价格/元</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(item,index) in quoteFeeData">
                                <td>{{item.beginDeliveryWeight}}</td>
                                <td>
                                    {{item.endDeliveryWeight}}
                                </td>
                                <td>
                                    {{item.deliveryNetWeightFee}}
                                </td>
                                <td>
                                {{item.deliveryGrossWeightFee}}
                                </td>

                                <td>{{item.beginDeliveryVolume}}</td>
                                <td>
                                    {{item.endDeliveryVolume}}
                                </td>
                                <td>
                                    {{item.deliveryVolumeFee}}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="table_height">
                        <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                            <thead>
                                <tr>
                                    <th colspan="7">运费</th>
                                </tr>
                                <tr>
                                    <th colspan="4">按重量计费/kg</th>
                                    <th colspan="3">按体积计费/m³</th>
                                </tr>
                                <tr>
                                    <th>&gt;</th>
                                    <th>≤</th>
                                    <th>净重价格/元</th>
                                    <th>毛重价格/元</th>

                                    <th>&gt;</th>
                                    <th>≤</th>
                                    <th>价格/元</th>
                                </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(item,index) in quoteFeeData">
                                <td>{{item.beginFreightWeight}}</td>
                                <td>
                                    {{item.endFreightWeight}}
                                </td>
                                <td>
                                    {{item.freightNetWeightFee}}
                                </td>
                                <td>
                                {{item.freightGrossWeightFee}}
                                </td>

                                <td>{{item.beginFreightVolume}}</td>
                                <td>
                                    {{item.endFreightVolume}}
                                </td>
                                <td>
                                    {{item.freightVolumeFee}}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import supplierQuoteManageLD from './supplierQuoteManageLD.js'

    export default supplierQuoteManageLD
</script>
<style lang="scss">
.quoteManageLDPage{
    .tableLD{
        width: 600px;
        float: left;
    }
    .tableDetail{
        width: calc(100% - 620px);
        float:right;
    }
    .table_height{
        margin-bottom: 20px;
        border:$border;
        border-bottom: none;
    }
}
</style>
