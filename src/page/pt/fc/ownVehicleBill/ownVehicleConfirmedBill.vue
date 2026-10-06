<template>
    <div id="ownVehicleConfirmedBill" >
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">账单编号：</label>
                    <div class="input-text">
                        <el-input v-model="query.billNum" placeholder="账单编号" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">账单月份：</label>
                    <div class="input-text">
                        <el-date-picker v-model="query.billMonth" type="month" placeholder="账单月份" value-format="yyyy-MM"></el-date-picker>
                    </div>
                </div>
                <div class="item">
                    <label class="label">供应商：</label>
                    <div class="input-text">
                        <el-select v-model="query.tenantId" placeholder="供应商" @change="doQuery" clearable filterable>
                            <el-option v-for="item in tenantData" :key="item.tenantId" :label="item.supplierName" :value="item.tenantId"></el-option>
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
                    <span>已确认账单列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="已确认账单列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="payRecord(true)" v-entity="1006063">付款记录</el-button>
                    <el-button type="primary" plain size="mini" @click="payRegister(true)" v-entity="1006064">付款登记</el-button>
                </div>
            </div>
            <tableCommon tableName="ownVehicleConfirmedBillTable" ref="table" :showNum="true" :showSetTable="true"
                         :singleSelect="true" :head="head" @dblclickItem="toOwnVehicleBillDetail">
            </tableCommon>
        </div>

        <!--   付款登记  开始-->
        <el-dialog title="付款登记" :visible.sync="showPay" width="80%">
            <div style="line-height:50px;color:red;font-size:16px;margin-top: -30px;">账单编号: {{show.billNum}} 账单月份: {{show.billMonth}} 供应商: {{show.tenantName}}</div>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #e8e8e8;">
                <thead>
                <tr>
                    <th width="20%">收款人</th>
                    <th width="20%">开户卡号</th>
                    <th width="20%">开户行</th>
                    <th width="20%">支行名称</th>
                    <th width="20%">手机号码</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>{{show.receiveUserName}}</td>
                    <td>{{show.bankCard}}</td>
                    <td>{{show.bankDepositName}}</td>
                    <td>{{show.bankSubName}}</td>
                    <td>{{show.bankPhone}}</td>
                </tr>
                </tbody>
            </table>

            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" style="border:1px solid #e8e8e8;margin-top:15px;">
                <thead>
                    <tr>
                        <th width="20%">付款渠道</th>
                        <th width="20%">需付款金额</th>
                        <th width="20%">付款金额</th>
                        <th width="20%">实际付款日期</th>
                        <th width="20%">备注</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in list">
                        <td>{{item.payChannelName}}</td>
                        <td>{{item.sumFee}}</td>
                        <td class="textCenter">
                            <el-input size="mini" v-mydoubleval v-model="item.payFee" @input="changePayFee(item)" placeholder="" type="text"></el-input>
                        </td>
                        <td>
                            <el-date-picker style="width: 100%" v-model="item.payDate" type="date" placeholder="实际付款日期" value-format="yyyy-MM-dd"></el-date-picker>
                        </td>
                        <td class="textCenter">
                            <el-input size="mini" v-model="item.remark" placeholder="" type="text"></el-input>
                        </td>
                    </tr>
                </tbody>
                <tfoot>
                <tr>
                    <td class="fw red">合计</td>
                    <td>{{show.needPayFee}}</td>
                    <td>{{show.sumPayFee}}</td>
                    <td></td>
                    <td></td>
                </tr>
                </tfoot>
            </table>
            <div class="page-bot-btn ">
                <el-button size="mini" @click="payRegister(false)">关闭</el-button>
                <el-button type="primary" size="mini" @click="submitPay">提交</el-button>
            </div>
        </el-dialog>
        <!--  付款登记  结束-->

        <!--   列表  开始-->
        <el-dialog title="付款记录" :visible.sync="showPayRecord" width="80%" :close-on-click-modal="false" :close-on-press-escape="false" >
            <h3 style="margin-bottom: 10px;margin-top: -20px;">
                <span style="color: red;font-size: 18px;">账单编号: {{show.billNum}} 账单月份: {{show.billMonth}} 供应商: {{show.tenantName}}</span>
            </h3>
            <tableCommon tableName="receiveRecordTable" v-if="payRecordShow" ref="ownVehiclePayRecordTable" :showNum="true"
                         :showSetTable="false" :singleSelect="true" :head="recordHead">
                <template v-slot:default="{item}">
                    <el-button type="primary" size="mini" @click="revokePayRecord(item)">撤销付款</el-button>
                </template>
            </tableCommon>
            <div class="bot-btn" style="margin-top: 20px;">
                <el-button @click="payRecord(false)">关闭</el-button>
            </div>
        </el-dialog>
        <!--  列表  结束-->
    </div>
</template>

<script>
	import ownVehicleConfirmedBill from './ownVehicleConfirmedBill.js'
	export default ownVehicleConfirmedBill
</script>
<style lang="scss">
@import '@/page/pt/fc/fc_common.scss';
#ownVehicleConfirmedBill {
    height: calc(100% - 41px) !important;

    .el-dialog{
        .table_height{
            overflow:auto;
            min-height:200px;
            max-height:300px;
            border:$border;
        }
        .tableCommon{
            .textCenter input{
              text-align: center;
            }
        }
    }
    .upInvoiceDetail{
        .el-dialog__body{
            padding-top: 0;
        }
        .table-content{
            border:none;
            .searchInfo{
                line-height: 30px;
              .el-input__inner{
                height: 30px;
                line-height: 30px;
              }
              .el-input__icon{
                line-height: 30px;
              }
                .el-button{
                    margin:0 15px;
                }
            }
        }
    }
    .special
    {
      width: calc(100% - 90px)!important;
    }
    .el-icon-remove-outline{
        color: red;
        font-size: 18px;
    }
    .el-icon-circle-plus-outline{
        color: $main-color;
        font-size: 18px;
    }
    .tagList .tag .contet .item .label{
        width: 100px;
    }
    .tagList .tag{
      min-height: 300px;
    }
}
</style>
