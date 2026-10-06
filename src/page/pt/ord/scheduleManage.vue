<template>
    <div id="scheduleManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="scheduleManageSearch"></searchList>
        <!-- 列表相关  开始 -->
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>订单计划列表
                        (<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)
                    </span>
                    <el-tooltip effect="light" content="订单计划列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" style="margin-left: 10px;" @click="go(0)">全部订单计划{{ info.scheduleTotal }}</el-button>
                    <el-button type="primary" plain size="mini" style="margin-left: 10px;" @click="go(1)">已匹配订单计划{{ info.scheduleMatch }}</el-button>
                    <el-button type="primary" plain size="mini" @click="go(2)">未匹配订单计划{{ info.scheduleUnMatch }}</el-button>
                    <el-button type="primary" plain size="mini" @click="go(3)">未匹配多余运力{{ info.vehicleScheduleUnMatch }}</el-button>
                    <el-button type="primary" plain @click="generateOrder" size="mini" v-entity="1003075">生成订单</el-button>
                    <el-button type="primary" plain @click="addSchedule" size="mini" v-entity="1003071">新增</el-button>
                    <el-button type="primary" plain @click="copySchedule" size="mini" v-entity="1003083">复制</el-button>
                    <el-button type="primary" plain @click="deleteSchedule" size="mini" v-entity="1003073">取消</el-button>
                    <el-button type="primary" plain @click="openMatch" size="mini" v-entity="1003074">手工匹配</el-button>
                    <el-button type="primary" plain @click="changeShowStyle" size="mini" icon="el-icon-refresh">{{ text }}</el-button>
                </div>
            </div>
            <div class="chart" v-if="showList">
                <div ref="mapChart" v-show="showMap" style="height:700px;width:100%;"></div>
                <div class="tip" v-show="showMap" >
                    <div>已匹配</div>
                    <div>未匹配</div>
                </div>           
                <div class="clearfix" v-show="!showMap" style="margin-top: 5px;">
                    <div style="height:350px;width: 30%;" class="fl" id="chart1"></div>
                    <div style="height:350px;width: 70%;" class="fl" id="chart2"></div>
                    <div style="height:350px;width: 100%;" class="fl" id="chart3"></div>
                </div>
                <div class="btn">
                    <div class="item" :class="showMap?'active':''" @click="changeEchart">地图</div>
                    <div class="item" :class="showMap?'':'active'" @click="changeEchart">图表</div>
                </div>
            </div>
            <tableCommon v-if="!showList" tableName="scheduleManageTable" ref="table" :head="head" :singleSelect="true" :showNum="true" :showSetTable="true" @dblclickItem="dblclickItem">
                <template v-slot:default="{item}">
                    <a href="javascript:void(0);" class="link" @click.stop="toOrderDetail(item)">{{item.orderNum}}</a>
                </template>
            </tableCommon>
        </div>
        <!-- 列表相关  结束 -->

        <!--  开始-->
        <el-dialog class="receiptsDialog" :title="title" :visible.sync="showSchedule" width="520px" :close-on-click-modal="false" :close-on-press-escape="false" >
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term">客户</label>
                        <div class="input-text">
                            <el-select v-model="schedule.orderCustId" filterable clearable @click.native="loadCustomerData" :disabled="isOnlySee"
                                       @change="changeTenant" placeholder="请选择客户" >
                                <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name"
                                           :value="item.tenantId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">线路名称</label>
                        <div class="input-text">
                            <el-select v-model="schedule.routeId" filterable clearable :disabled="isOnlySee" @change="changeRoute" placeholder="线路名称" >
                                <el-option v-for="item in routeData" :key="item.routeId" :label="item.routeName"
                                           :value="item.routeId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">线路始终城市</label>
                        <div class="input-text">
                            <el-input v-model="schedule.beginEndCity" maxlength="50" placeholder="线路始终城市" disabled></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">车长</label>
                        <div class="input-text">
                            <el-select v-model="schedule.vehicleLength"  filterable clearable :disabled="isOnlySee" placeholder="车长">
                                <el-option v-for="item in vehicleLengthData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">计划发货时间</label>
                        <div class="input-text">
                            <my-el-date-picker @input="$forceUpdate" v-model="schedule.scheduleTime" type="datetime" :disabled="isOnlySee"
                                               placeholder="选择日期时间" align="right" :picker-options="pickerOptions"
                                               format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm">
                            </my-el-date-picker>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">客户单号</label>
                        <div class="input-text">
                            <el-input v-model="schedule.custOrderNum" :disabled="isOnlySee" placeholder="客户单号"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">备注</label>
                        <div class="input-text">
                            <el-input v-model="schedule.remark" type="textarea" :disabled="isOnlySee" placeholder="备注"></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="showScheduleDialog(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="saveSchedule()">提交</el-button>
                </div>
            </div>
        </el-dialog>
        <!--  结束-->

        <!--  删除-->
        <el-dialog class="delScheduleDialog" :title="title" :visible.sync="delSchedule" width="800px" :close-on-click-modal="false" :close-on-press-escape="false" >
            <div class="info">
                <h3>订单信息:</h3>
                <div class="inner">
                    <div class="item">
                        <div class="label">客户名称:</div>
                        <div class="text">{{schedule.tenantName}}</div>
                    </div>
                    <div class="item">
                        <div class="label">订单计划编号:</div>
                        <div class="text">{{schedule.ordScheduleNum}}</div>
                    </div>
                    <div class="item">
                        <div class="label">计划发货时间:</div>
                        <div class="text">{{schedule.scheduleTime}}</div>
                    </div>
                </div>
                <h3 v-show="schedule.isMatchFlag">匹配运力信息:</h3>
                <div class="inner" v-show="schedule.isMatchFlag">
                    <div class="item">
                        <div class="label">供应商名称:</div>
                        <div class="text">{{schedule.supplierName}}</div>
                    </div>
                    <div class="item">
                        <div class="label">车牌号码:</div>
                        <div class="text">{{schedule.plateNumber}}</div>
                    </div>
                    <div class="item">
                        <div class="label">预计出车时间:</div>
                        <div class="text">{{schedule.scheduleTime2}}</div>
                    </div>
                </div>
                <h3>取消原因:</h3>
                <div>
                    <div class="item">
                        <el-input v-model="schedule.reason" style="width:100%; height:100%;" type="textarea" sty placeholder="请输入取消原因"></el-input>
                    </div>
                </div>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="showDelScheduleDialog(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="sureDeleteSchedule()">提交</el-button>
                </div>
            </div>
        </el-dialog>

        <!--  手工匹配-->
        <el-dialog class="" title="手工匹配" :visible.sync="showMatch" width="800px" :close-on-click-modal="false" :close-on-press-escape="false">
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">订单计划编号</td>
                    <td class="value">
                        <el-input v-model="scheduleData.ordScheduleNum" type="text"></el-input>
                    </td>
                    <td class="label">运力选择</td>
                    <td class="value">
                        <el-select v-model="scheduleData.vehicleScheduleId" placeholder="请选择未匹配的运力" @change="selectVehicleSchedule">
                            <el-option v-for="item in unMatchVehicleScheduleList" :key="item.id" :label="item.tip"
                                       :value="item.id"></el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <td class="label">客户</td>
                    <td class="value">
                        <el-input v-model="scheduleData.tenantName" type="text"></el-input>
                    </td>
                    <td class="label">供应商名称</td>
                    <td class="value">
                        <el-input v-model="scheduleData.supplierName2" type="text"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">线路名称</td>
                    <td class="value">
                        <el-input v-model="scheduleData.routeName" type="text"></el-input>
                    </td>
                    <td class="label">车牌号码</td>
                    <td class="value">
                        <el-input v-model="scheduleData.plateNumber2" type="text"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">车长</td>
                    <td class="value">
                        <el-input v-model="scheduleData.vehicleLengthName" type="text"></el-input>
                    </td>
                    <td class="label">车长</td>
                    <td class="value">
                        <el-input v-model="scheduleData.vehicleLengthName2" type="text"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">线路始终城市</td>
                    <td class="value">
                        <el-input v-model="scheduleData.beginEndCity" type="text"></el-input>
                    </td>
                    <td class="label">线路始终城市</td>
                    <td class="value">
                        <el-input v-model="scheduleData.beginEndCity2" type="text"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">计划发货时间</td>
                    <td class="value">
                        <el-input v-model="scheduleData.scheduleTime" type="text"></el-input>
                    </td>
                    <td class="label">预计达到起始点时间</td>
                    <td class="value">
                        <el-input v-model="scheduleData.scheduleTime2" type="text"></el-input>
                    </td>
                </tr>
            </table>
            <div class="page-bot-btn">
                <el-button size="mini" @click="showMatchDialog(false)">关闭</el-button>
                <el-button type="primary" size="mini" @click="syncMatch()">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
	import scheduleManage from './scheduleManage.js'
	export default scheduleManage
</script>
<style lang="scss" scoped>
#scheduleManage {
    /deep/ .delScheduleDialog {
        .el-dialog__body{
            padding:20px;
        }
        .info {
            h3{
                color: $main-color;
                line-height:30px;
                font-weight:bold;
            }
            .inner{
                border:$border;
                padding:10px 0;
                margin-bottom: 10px;
                .item{
                    display:flex;
                    .label{
                        width: 100px;
                        text-align:right;
                        line-height:30px;
                    }
                    .text{
                        flex: 1;
                        padding-left: 10px;
                        line-height:30px;
                    }
                }
            }
        }
    }
    .chart{
        .btn{
            position: absolute;
            right: 20px;
            top:50%;
            transform: translateY(-50%);
            writing-mode: tb-lr;
            width:32px;
            text-align: center;
            border:$border;
            border-radius: 4px;
            .item{
                cursor: pointer;
                padding:8px 10px;
                &:last-child{
                    border-top: $border;
                }
                &.active{
                    color: #fff;
                    background: $main-color;
                }
            }
        }
        .tip{
            position:absolute;
            right:100px;
            top:50%;
            div{
                position:relative;
                width:40px;
                text-align: center;
                margin-bottom:35px;
                &::after{
                    content:"";
                    height: 20px;
                    width: 100%;
                    position: absolute;
                    bottom:20px;
                    left:0;
                    background: #a6c84c;
                    border-radius: 4px;
                }
                &:last-child::after{
                    background: #ffa022;

                }
            }
        }
    }
}
</style>
