<template>
    <div id="billDetail" class="fcCommonPage">
        <div class="tagList clearfix">
            <div class="tag" style="width:50%">
                <div class="tip"><span>客户</span></div>
                <h3 class="title">基本信息</h3>
                <div class="flexBox">
                    <div class="contet center">
                        <div class="item">
                            <div class="label">账单编号：</div>
                            <div class="text fw">{{ bill.billNum }}</div>
                        </div>
                        <div class="item">
                            <div class="label">客户名称：</div>
                            <div class="text fw">{{ bill.tenantName }}</div>
                        </div>
                        <div class="item">
                            <div class="label">对账客户：</div>
                            <div class="text fw">{{ bill.custTenantName }}</div>
                        </div>
                        <div class="item">
                            <div class="label">账单月份：</div>
                            <div class="text fw">{{ bill.billMonth }}</div>
                        </div>
                        <div class="item">
                            <div class="label">账单状态：</div>
                            <div class="text fw">{{ bill.confirmStateName }}</div>
                        </div>
                        <div class="item">
                            <div class="label">账单备注：</div>
                            <div class="text fw">{{ bill.remark }}</div>
                        </div>
                        <div class="item">
                            <div class="label">结算主体：</div>
                            <div class="text fw">{{ bill.settleBodyName }}</div>
                        </div>
                        <div class="item">
                            <div class="label"><em>*</em>对账单附件：</div>
                            <div class="text fw">
                                <myFileModel class="myfilemodel fl" style="margin-right: 20px;" ref="attach"
                                             :disabledEdit="true" :disabledDel="true"></myFileModel>
                            </div>

                            <div class="label"><em>*</em>回单附件：</div>
                            <div class="text fw">
                                <myFileModel class="myfilemodel fl" style="margin-right: 20px;" ref="receipt"
                                             :disabledEdit="true" :disabledDel="true"></myFileModel>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="tag" style="width: 50%;">
                <div class="tip"><span>账单</span></div>
                <h3 class="title">账单金额</h3>
                <h5 class="cash">￥{{ bill.totalFee }} 元</h5>
                <div class="flexBox">
                    <div class="contet center">
                        <div class="item">
                            <div class="label fw">运输金额：</div>
                            <div class="text">￥{{ bill.waybillFee }}元</div>
                        </div>
                        <div class="item">
                            <div class="label fw">仓储金额：</div>
                            <div class="text">￥{{ bill.storehouseFee }}元</div>
                        </div>
                        <div class="item">
                            <div class="label fw">其他金额：</div>
                            <div class="text">￥{{ bill.otherFee }}元</div>
                        </div>
                        <div class="item">
                            <div class="label fw">器具金额：</div>
                            <div class="text">￥{{ bill.packLeaseFee }}元</div>
                        </div>
                        <div class="item">
                            <div class="label fw">补录金额：</div>
                            <div class="text">￥{{ bill.makeupFee }}元</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="table-content" style="margin:0;">
            <myFileModel ref="img" style="width:0; height:0; overflow:hidden"
                         @successCallback="successCallback"></myFileModel>
            <div class="table-title">
                <div class="tab-title clearfix">
                    <div class="tab" :class="{'active':tab.active}" @click="changeTab(tab)" v-show="tab.show"
                         v-for="(tab,index) in tabs" :key="index">{{ tab.name }}
                    </div>
                </div>
                <div class="table-title-btn">
                    <el-button type="primary" plain size="mini" @click="toOrderDetail(false)" v-show="showGotoDetail">
                        查看详情
                    </el-button>
                    <el-button type="primary" plain size="mini" @click="download()">导出EXCEL</el-button>
                </div>
            </div>
            <simpleTable ref="table" tableName="billDetailTable" :head="head" :data="tableData"
                         @dblclickItem="dblclickItem" :singleSelect="true">
                <template v-slot="{item,code}">
                    <div v-if="code=='fileName'">
                        <a href="javascript:void(0);" class="link" @click.stop="showImg(item)">{{ item[code] }}</a>
                    </div>
                </template>
            </simpleTable>

        </div>

        <div class="bot-btn" style="margin-top: 20px;">
            <el-button @click="closePage">关闭</el-button>
        </div>

    </div>
</template>

<script>
import billDetail from './billDetail.js'

export default billDetail
</script>
<style lang="scss">

@import '@/page/pt/fc/fc_common.scss';

#billDetail {
    .tagList .tag .contet .item .label {
        width: 120px !important;
    }

    .myfilemodel {
        .el-upload {
            width: 100px;
            height: 70px;

            .el-icon-plus {
                width: 100px;
                height: 70px;
                line-height: 70px;

            }
        }
    }
}
</style>
