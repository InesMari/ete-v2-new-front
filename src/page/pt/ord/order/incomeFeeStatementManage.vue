<template>
    <div id="incomeFeeStatementManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="incomeFeeStatementManageSearch"></searchList>
        <!-- 列表相关  开始 -->
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>费用异动审核列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="费用异动审核列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
<!--                    <el-button type="primary" plain @click="toSeeIncomeChange()" size="mini" v-entity :entityId="[{1001111:1001112}]">查看异动</el-button>-->
                    <el-button type="primary" plain @click="toUpdateIncomeChange()" size="mini" v-entity="1003059">修改异动</el-button>
                    <el-button type="primary" plain @click="cancelStatement()" size="mini" v-entity="1003060">撤销异动</el-button>
                    <el-button type="primary" plain @click="verifyPass()" size="mini" v-entity="1003061">审核通过</el-button>
                    <el-button type="primary" plain @click="verifyNoPass()" size="mini" v-entity="1003062">审核不通过</el-button>
                </div>
            </div>
            <tableCommon tableName="incomeFeeStatementManageTable" ref="table" :head="head" :showNum="true" :showSetTable="true"
                         :singleSelect="true" @dblclickItem="dblclickItem">
                <template v-slot:default="{item,index}">
                    <a href="javascript:void(0);" class="link" @click="openDetail(item)">{{item.orderNum}}</a>
                </template>
            </tableCommon>
        </div>
        <!-- 列表相关  结束 -->

        <el-dialog :title="title" :visible.sync="isShow" width="80%" :close-on-click-modal="false" :close-on-press-escape="false" >
            <!--     费用异动-开始       -->
            <h3 class="common-title" ><span class="title-name">费用异动&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:red;">注：费用异动填写的是费用变动值!</span></span></h3>
            <table class="tableCommon" style="table-layout:fixed" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th>保险费</th>
                        <th>提货费</th>
                        <th>送货费</th>
                        <th>装货费</th>
                        <th>卸货费</th>
                        <th>放空费</th>
                        <th>压夜费</th>
                        <th>其他费</th>
                        <th>异动合计
                            <el-tooltip class="item" effect="light" placement="top-start">
                                <div slot="content">=保险费+提货费+送货费+装卸费+卸货费+放空费+压夜费+其他费</div>
                                <i class="el-icon-question pointer"></i>
                            </el-tooltip>
                        </th>
                        <th width="150">异动备注</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <el-input v-model="change.premiumFee" v-mypmdoubleval @input="calcChangeTotalFee()" :disabled="isOnlySee" ></el-input>
                        </td>
                        <td>
                            <el-input v-model="change.pickupFee" v-mypmdoubleval @input="calcChangeTotalFee()" :disabled="isOnlySee" ></el-input>
                        </td>
                        <td>
                            <el-input v-model="change.deliveryFee" v-mypmdoubleval @input="calcChangeTotalFee()" :disabled="isOnlySee" ></el-input>
                        </td>
                        <td>
                            <el-input v-model="change.loadingFee" v-mypmdoubleval @input="calcChangeTotalFee()" :disabled="isOnlySee" ></el-input>
                        </td>
                        <td>
                            <el-input v-model="change.dischargeFee" v-mypmdoubleval @input="calcChangeTotalFee()" :disabled="isOnlySee" ></el-input>
                        </td>
                        <td>
                            <el-input v-model="change.emptyDrivingFee" v-mypmdoubleval @input="calcChangeTotalFee()" :disabled="isOnlySee" ></el-input>
                        </td>
                        <td>
                            <el-input v-model="change.standbyFee" v-mypmdoubleval @input="calcChangeTotalFee()" :disabled="isOnlySee" ></el-input>
                        </td>
                        <td>
                            <el-input v-model="change.otherFee" v-mypmdoubleval @input="calcChangeTotalFee()" :disabled="isOnlySee" ></el-input>
                        </td>
                        <td>
                            <el-input v-model="change.totalFee" :disabled="true" ></el-input>
                        </td>
                        <td>
                            <el-input v-model="change.remark" :disabled="isOnlySee"  maxlength="255"></el-input>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!--     费用异动-结束       -->
            <!--     订单费用异动记录-开始       -->
            <h3 class="common-title mt_20"><span class="title-name">订单费用异动记录&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span v-show="isOnlySee" style="color:red;">注：列表数据为该订单费用异动记录(不包含未审核和审核不通过的)</span></span></h3>
            <div class="table_height">
                <table class="tableCommon" style="table-layout:fixed" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                    <tr>
                        <th>序号</th>
                        <th>保险费</th>
                        <th>提货费</th>
                        <th>送货费</th>
                        <th>装货费</th>
                        <th>卸货费</th>
                        <th>放空费</th>
                        <th>压夜费</th>
                        <th>其他费</th>
                        <th>费用合计</th>
                        <th>创建人</th>
                        <th width="90">创建日期</th>
                        <th width="150">备注</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in changeList">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.premiumFee }}</td>
                        <td>{{ item.pickupFee }}</td>
                        <td>{{ item.deliveryFee }}</td>
                        <td>{{ item.loadingFee }}</td>
                        <td>{{ item.dischargeFee }}</td>
                        <td>{{ item.emptyDrivingFee }}</td>
                        <td>{{ item.standbyFee }}</td>
                        <td>{{ item.otherFee }}</td>
                        <td>{{ item.totalFee }}</td>
                        <td>{{ item.createUserName }}</td>
                        <td>{{ item.createDate }}</td>
                        <td>{{ item.remark }}</td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <td>合计：</td>
                        <td>{{changeSum.premiumFeeSum}}</td>
                        <td>{{changeSum.pickupFeeSum}}</td>
                        <td>{{changeSum.deliveryFeeSum}}</td>
                        <td>{{changeSum.loadingFeeSum}}</td>
                        <td>{{changeSum.dischargeFeeSum}}</td>
                        <td>{{changeSum.emptyDrivingFeeSum}}</td>
                        <td>{{changeSum.standbyFeeSum}}</td>
                        <td>{{changeSum.otherFeeSum}}</td>
                        <td>{{changeSum.totalFeeSum}}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    </tfoot>
                </table>
            </div>
            <!--     订单费用异动记录-结束       -->

            <!--     提交关闭       -->
            <div class="bot-btn">
                <el-button plain size="mini" @click="closePage(false)">关闭</el-button>
                <el-button plain size="mini" type="primary" v-show="!isOnlySee" @click="sureChange">确认修改</el-button>
            </div>
            <!--     提交关闭       -->
        </el-dialog>

    </div>
</template>

<script>
	import incomeFeeStatementManage from './incomeFeeStatementManage.js'
	export default incomeFeeStatementManage
</script>
<style lang="scss">
  .el-dialog__body {
    padding: 15px 20px 30px;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
</style>
