<template>
    <div id="workContractInfo" class="workContractInfo">
        <div class="common-info clearfix">
            <div>
                <h3 class="common-title"><span class="title-name">基本信息</span></h3>
                <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td class="label"><em>*</em>物流中心</td>
                        <td class="value">
                            <el-select v-model="info.workId" @change="changeBeginWork"
                                       filterable clearable :disabled="isOnlySee" placeholder="请选择物流中心">
                                <el-option v-for="item in workList" :key="item.workId" :label="item.workName"
                                           :value="item.workId">
                                </el-option>
                            </el-select>
                        </td>
                        <td class="label"><em>*</em>供应商</td>
                        <td class="value">
                            <el-select v-model="info.tenantId" @change="changeTenant"
                                       filterable clearable :disabled="isOnlySee" placeholder="供应商名称">
                                <el-option v-for="item in supplierData" :key="item.tenantId" :label="item.supplierName"
                                           :value="item.tenantId"></el-option>
                            </el-select>
                        </td>
                        <td class="label">客户</td>
                        <td class="value">
                            <el-select v-model="info.custTenantId"
                                       clearable filterable :disabled="isOnlySee" placeholder="请选择客户">
                                <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name"
                                           :value="item.tenantId">
                                </el-option>
                            </el-select>
                        </td>
                    </tr>
                    <tr>
                        <td class="label">合同编号</td>
                        <td class="value">
                            <el-select v-model="info.cmContractId" @change="changeContract"
                                       filterable clearable :disabled="isOnlySee" placeholder="请选择合同编号">
                                <el-option v-for="item in contractData" :key="item.id" :label="item.contractNum"
                                           :value="item.id">
                                    <span style="float: left">{{ item.contractNum }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{item.tenantName }}</span>
                                </el-option>
                            </el-select>
                        </td>
                        <td class="label"><em>*</em>有效期</td>
                        <td class="value" colspan="3">
                            <el-date-picker v-model="info.daterange" :disabled="isOnlySee"
                                            type="daterange" @input="forceUpdate"
                                            range-separator="-"
                                            start-placeholder="开始日期"
                                            end-placeholder="结束日期" value-format="yyyy-MM-dd"
                                            unlink-panels></el-date-picker>
                        </td>
                    </tr>
                    <tr>
                        <td class="label">备注</td>
                        <td class="value" colspan="5">
                            <el-input type="textarea" :disabled="isOnlySee" v-model="info.remark"
                                      placeholder="说点什么?"></el-input>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="tableItem mt_20">
                <h3 class="common-title">
                    <span class="title-name">费用信息</span>
                    <el-button v-show="type != 0" class="fr" size="mini" type="primary" style="margin-top:6px;"
                               @click="open(true)">操作
                    </el-button>
                </h3>

                <table ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                    <tr>
                        <th width="50">序号</th>
                        <th width="110">费用类型</th>
                        <th width="110">费用项目</th>
                        <th width="110">计费单位</th>
                        <th width="110">未税单价(元)</th>
                        <th width="110">增值税率(%)</th>
                        <th width="110">价税合计(元)</th>
                        <th width="110">备注</th>
                        <th width="50" v-show="type != 0">操作</th>
                    </tr>
                    </thead>
                    <tr v-for="(item, index) in details" class="item">
                        <td>
                            <el-input :value="index + 1" disabled></el-input>
                        </td>
                        <td>
                            <el-input v-model="item.itemTypeName" disabled></el-input>
                        </td>
                        <td>
                            <el-input v-model="item.name" disabled></el-input>
                        </td>
                        <td>
                            <el-input v-model="item.unit" disabled></el-input>
                        </td>
                        <td>
                            <el-input v-model="item.price" v-mydouble5val v-show="item.itemType != 104"
                                      @input="changePrice(item, 1)"
                                      :disabled="type == 0 || item.itemType == 104">
                            </el-input>

                            <el-tooltip v-show="item.itemType == 104" effect="dark" content="报价明细" placement="top-start" :hide-after='1000' style="margin-left: 22px;">
                                <img @click="openItemDetail(item, index)" src="@/static/image/list.png" class="list_icon" alt="">
                            </el-tooltip>
                        </td>
                        <td>
                            <el-input v-model="item.tax" v-mynumval :disabled="type == 0"></el-input>
                        </td>
                        <td>
                            <el-input v-model="item.priceWithTax" v-mydouble5val  v-show="item.itemType != 104"
                                      @input="changePrice(item, 2)"
                                      :disabled="type == 0 || item.itemType == 104">
                            </el-input>

                            <el-tooltip v-show="item.itemType == 104" effect="dark" content="报价明细" placement="top-start" :hide-after='1000' style="margin-left: 22px;">
                                <img @click="openItemDetail(item, index)" src="@/static/image/list.png" class="list_icon" alt="">
                            </el-tooltip>
                        </td>
                        <td>
                            <el-input v-model="item.remark" disabled></el-input>
                        </td>
                        <td width="50" v-show="type != 0">
                            <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000'>
                                <span @click="del(item, index)" class="del"></span>
                            </el-tooltip>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" @click="submit" v-show="type != 0">提交</el-button>
            </div>
        </div>

        <!--   选择费用项目     -->
        <el-dialog class="operateDialog" title="操作" :visible.sync="isShowDialog" width="1000px">
            <div class="filterView" @keydown.enter="doQuery">
                <el-input v-model="query.name" size="small" placeholder="费用名称"></el-input>
                <el-select v-model="query.feeTypeName" size="small" @change="filterTableData" placeholder="请选择费用类型" filterable clearable>
                    <el-option v-for="item in itemTypeData" :key="item.codeName" :label="item.codeName" :value="item.codeName">
                    </el-option>
                </el-select>
                <el-select v-model="query.custTenantId" size="small" @change="doQuery" clearable filterable placeholder="请选择客户">
                    <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name" :value="item.tenantId">
                    </el-option>
                </el-select>
                <el-button type="danger" size="small" @click="clearFilter">清空</el-button>
                <el-button type="primary" size="small" @click="doQuery">筛选</el-button>
            </div>
            <div class="title mt_20">
                <div>费用项目</div>
                <div>已选择项目</div>
            </div>
            <dbTable tableName="workContractInfoTable" ref="table" :head="head" onlyId="itemId"></dbTable>
            <div class="bot-btn">
                <el-button @click="open(false)">关闭</el-button>
                <el-button type="primary" @click="sure">确认</el-button>
            </div>
        </el-dialog>
        <!--   选择费用项目 end    -->

        <!--        短驳配送报价维护 begin-->
        <el-dialog title="短驳配送报价维护" :visible.sync="showDetailDialog"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   width="1000px"
                   @close="showDetailDialog=false">
          <span slot="title">短驳配送报价维护<span style="color: red;">（{{ title }}）</span></span>
          <div class="common-info" style="border:none;padding:0;">
                <div>
                    <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                        <thead>
                        <tr>
                            <th>序号</th>
                            <th>作业点</th>
                            <th>计费单位</th>
                            <th>报价车型</th>
                            <th>报价车长</th>
                            <th colspan="2">区间数量</th>
                            <th>未税单价</th>
                            <th>含税单价</th>
                            <th v-show="type != 0">
                                <el-tooltip effect="dark" content="增加" placement="top-start" :hide-after='1000'>
                                    <span @click="addDetailItem()" class="add"></span>
                                </el-tooltip>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for="(item,index) in detailList">
                            <td>{{ index + 1 }}</td>
                            <td>
                                <el-select v-model="item.endWorkId" @change="changeEndWork(item)"
                                           clearable filterable :disabled="type == 0" placeholder="请选择作业点">
                                    <el-option v-for="item in endWorkData" :key="item.workId" :label="item.workName"
                                               :value="item.workId"></el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-select v-model="item.unit" @change="changeUnit(item)"
                                           filterable clearable :disabled="type == 0" placeholder="请选择价格单位">
                                    <el-option v-for="item in unitData" :key="item.codeId" :label="item.codeName"
                                               :value="item.codeName"></el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-select v-model="item.quoteVehicleType" @change="changeQuoteVehicleType(item)"
                                           filterable multiple clearable :disabled="type == 0" placeholder="请选择报价车型">
                                    <el-option v-for="v in item.quoteVehicleTypeData" :key="v.codeValue"
                                               :label="v.codeName" :value="v.codeValue"
                                               :disabled="v.disabled"></el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-select v-model="item.vehicleLength" @change="changeVehicleLength(item)"
                                           filterable multiple clearable
                                           :disabled="type == 0" placeholder="请选择车长">
                                    <el-option v-for="v in item.vehicleLengthData" :key="v.codeValue"
                                               :label="v.codeName" :value="v.codeValue"
                                               :disabled="v.disabled"></el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-input v-model="item.beginRange" :disabled="type == 0 || item.beginRangeDisabled" placeholder="起始区间" v-mydouble4val></el-input>
                            </td>
                            <td>
                                <el-input v-model="item.endRange" :disabled="type == 0 || item.endRangeDisabled" placeholder="结束区间" v-mydouble4val></el-input>
                            </td>
                            <td>
                                <el-input v-model="item.price" :disabled="type == 0" v-mydouble4val
                                          @input="changeDetailPrice(item, 1)" placeholder="未税单价"></el-input>
                            </td>
                            <td>
                                <el-input v-model="item.priceWithTax" :disabled="type == 0" v-mydouble4val
                                          @input="changeDetailPrice(item, 2)" placeholder="含税单价"></el-input>
                            </td>
                            <td v-show="type != 0">
                                <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000'>
                                    <span @click="delDetailItem(item, index)" class="del"></span>
                                </el-tooltip>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="page-bot-btn">
                <el-button size="mini" @click="showDetailDialog=false">关闭</el-button>
                <el-button type="primary" v-show="type != 0" size="mini" @click="sureItemDetail">确认</el-button>
            </div>
        </el-dialog>
        <!--        短驳配送报价维护 end-->

        <!-- 版本选择悬浮窗 -->
        <div class="timeline" v-show="hisList.length > 1">
            <div class="item" v-for="item in hisList" :key="item.hisId"
                 @click="changeHisVer(item.hisId)">
                <div class="circle" :class="item.hisId == currentHisId ? 'active' : '' "></div>
                <div class="content">
                    <p>{{ item.title }}</p>
                    <p>{{ item.date }}</p>
                </div>
                <div class="line"></div>
            </div>
        </div>
        <!-- 版本选择悬浮窗 -->

    </div>
</template>

<script>
import workContractInfo from "./workContractInfo.js";

export default workContractInfo;
</script>
<style lang="scss" scoped>
.workContractInfo {
    .common-info {
        padding: 30px 20px;

        .fillTbale {
            .labelSpec {
                background: #f3f9ff;
                font-weight: bold;
            }

            /deep/ .el-textarea__inner {
                border: none;
                resize: none;
                height: 115px;
                text-align: center;
            }
        }

        h3 {
            line-height: 40px;
            font-weight: bold;
            color: #333;
            font-size: 14px;

            em {
                font-size: 12px;
            }

            /deep/ .el-checkbox__label {
                font-size: 14px;
                font-weight: bold;
                color: #333;
            }
        }

        /deep/ .tableCommon {
            border: $border;

            td {
                text-align: center;
            }

            .el-input__inner {
                text-align: center;
                height: 30px;
                line-height: 30px;
            }

        }

        .add {
            vertical-align: middle;
            @include add;
        }

        .del {
            vertical-align: middle;
            @include del;
        }

        .list_icon {
            width: 20px;
            position: relative;
            top: 7px;
            margin-right: 20px;
        }

        .tableFlex {
            display: flex;
        }
    }

    /deep/ .dbTable {
        max-height: 500px;

        .table_height {
            border: $border;
        }

        .tfoot {
            display: none;
        }
    }

    /deep/ .operateDialog {
        .el-dialog {
            height: 70%;

            .el-dialog__body {
                height: calc(100% - 55px);

                .dbTable {
                    height: calc(100% - 230px);
                }
                .filterView{
                    margin-bottom: 20px;
                    display: flex;
                    .el-input{
                        width: 150px;
                        margin-right: 10px;
                    }
                    .el-select{
                        width: 150px;
                        margin-right: 10px;
                    }
                    .el-button{
                        margin-left: 10px;
                    }
                }
            }
        }

        .title {
            display: flex;

            > div {
                flex: 1;
                font-size: 14px;
                font-weight: bold;
                text-align: center;
                margin-bottom: 10px;
            }
        }
    }

    .timeline {
        position: fixed;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 999;
        padding: 10px;
        border-radius: 5px;
        transition: all .3s;

        .item {
            position: relative;
            padding-bottom: 20px;
            padding-right: 20px;
            text-align: center;
            min-height: 40px;
            cursor: pointer;

            .circle {
                position: absolute;
                background-color: #E4E7ED;
                border-radius: 50%;
                width: 12px;
                height: 12px;
                right: 0;
                top: 16px;
                margin-top: -6px;
                z-index: 9;

                &.active {
                    background: #07c160;
                }
            }

            .line {
                position: absolute;
                right: 5px;
                top: 16px;
                height: 100%;
                border-left: 2px solid #E4E7ED;
            }

            .content {
                display: none;

            }

            &:last-child {
                padding-bottom: 0;

                .line {
                    display: none;
                }
            }

            &:hover {
                p {
                    color: #07c160;
                }
            }
        }

        &:hover {
            background: #fff;
            box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
            right: 10px;

            .item {
                .content {
                    display: block;
                }
            }
        }
    }
}
</style>
