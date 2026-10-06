<template>
    <div id="ownVehicleRecord" class="ownVehicleRecordPage">
        <div class="common-info">
            <div id="printTable">
                <div class="tableTitle">
                    <img class="logo" src="@/static/image/logo.png" alt="">
                    <div class="title">车辆牵引车头技术档案卡</div>
                    <div class="num">档案编号：{{ info.fileNumber }}</div>
                </div>
                <h3 class="common-title"><span class="title-name">车辆基本信息</span></h3>
                <div class="imgTable">
                    <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                            <td class="label">车牌号码：</td>
                            <td class="value">{{ info.plateNumber }}</td>
                        </tr>
                        <tr>
                            <td class="label">品牌型号：</td>
                            <td class="value">{{ info.brand }}</td>
                        </tr>
                        <tr>
                            <td class="label">车辆识别代号(VIN)：</td>
                            <td class="value">{{ info.vin }}</td>
                        </tr>
                        <tr>
                            <td class="label">能源类型：</td>
                            <td class="value">{{ info.energyTypeName }}</td>
                        </tr>
                        <tr>
                            <td class="label">准牵引总质量：</td>
                            <td class="value">{{ info.tractionMass + "kg" }}</td>
                        </tr>
                        <tr>
                            <td class="label">购置来源：</td>
                            <td class="value">{{ info.purchaseSourceName }}</td>
                        </tr>
                        <tr>
                            <td class="label">绑定挂车：</td>
                            <td class="value">{{ info.trailerNumber }}</td>
                        </tr>
                    </table>
                    <div class="imgView">
                        <img :src="info.carBodyImgPath_big" @click="showBig">
                    </div>
                </div>

                <h3 class="common-title mt_20"><span class="title-name">技术参数</span></h3>
                <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td class="label">发动机号：</td>
                        <td class="value">{{ info.engineNumber }}</td>
                        <td class="label">变速箱类型：</td>
                        <td class="value">{{ info.gearboxTypeName }}</td>
                    </tr>
                    <tr>
                        <td class="label">排量(L)：</td>
                        <td class="value">{{ info.displacement }}</td>
                        <td class="label">额定功率(kw)：</td>
                        <td class="value">{{ info.ratedPower }}</td>
                    </tr>
                    <tr>
                        <td class="label">轮胎规格：</td>
                        <td class="value">{{ info.tireSpecification }}</td>
                        <td class="label">轮胎数量：</td>
                        <td class="value">{{ "前轮:" + info.tiresNumber + " 后轮:" + info.rearWheelNumber }}</td>
                    </tr>
                </table>

                <h3 class="common-title mt_20"><span class="title-name">关键日期</span></h3>
                <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td class="label">购买日期：</td>
                        <td class="value">{{ info.buyDate }}</td>
                        <td class="label">注册日期：</td>
                        <td class="value">{{ info.registerDate }}</td>
                    </tr>
                    <tr>
                        <td class="label">发证日期：</td>
                        <td class="value">{{ info.issueDate }}</td>
                        <td class="label"></td>
                        <td class="value">{{ }}</td>
                    </tr>
                    <tr>
                        <td class="label">最近年检日期：</td>
                        <td class="value">{{ info.lastAnnualInspection }}</td>
                        <td class="label">年检到期日期：</td>
                        <td class="value">{{ info.nextInspectionDate }}</td>
                    </tr>
                </table>

                <h3 class="common-title mt_20"><span class="title-name">保险记录(只显示最新一条记录)</span></h3>
                <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0"
                    v-show="insuranceInfoShow">
                    <tr>
                        <td class="label">保险公司：</td>
                        <td colspan="6" class="value">{{ insuranceInfo.insuranceCompany }}</td>
                    </tr>
                    <tr>
                        <td class="label">商业险：</td>
                        <td class="label">合同编号：</td>
                        <td class="value">{{ insuranceInfo.commercialInsuranceContractNum }}</td>
                        <td class="label">合同开始日期：</td>
                        <td class="value">{{ insuranceInfo.commercialInsuranceBeginDate }}</td>
                        <td class="label">结束日期：</td>
                        <td class="value">{{ insuranceInfo.commercialInsuranceEndDate }}</td>
                    </tr>
                    <tr>
                        <td class="label">交强险：</td>
                        <td class="label">合同编号：</td>
                        <td class="value">{{ insuranceInfo.heavyTrafficInsuranceContractNum }}</td>
                        <td class="label">合同开始日期：</td>
                        <td class="value">{{ insuranceInfo.heavyTrafficInsuranceBeginDate }}</td>
                        <td class="label">结束日期：</td>
                        <td class="value">{{ insuranceInfo.heavyTrafficInsuranceEndDate }}</td>
                    </tr>
                </table>
                <h3 class="common-title mt_20"><span class="title-name">保养记录(只显示最新一条记录)</span></h3>
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th>保养日期</th>
                            <th>下次保养日期</th>
                            <th>下次保养里程</th>
                            <th>供应商名称</th>
                            <th>维修联系人</th>
                            <th>维修联系电话</th>
                            <th>备注</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-show="maintenanceShow">
                            <td>{{ maintenance.maintenanceDate }}</td>
                            <td>{{ maintenance.nextMaintenanceDate }}</td>
                            <td>{{ maintenance.nextMaintenanceMileage }}</td>
                            <td>{{ maintenance.supplierName }}</td>
                            <td>{{ maintenance.linkMan }}</td>
                            <td>{{ maintenance.linkPhone }}</td>
                            <td>{{ maintenance.remark }}</td>
                        </tr>
                    </tbody>
                </table>
                <h3 class="common-title mt_20"><span class="title-name">维修事故记录(动态记录)</span></h3>
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th width="40">序号</th>
                            <th width="100">维护类型</th>
                            <th width="120">日期及时间</th>
                            <th width="150">修理项目名称</th>
                            <th width="150">供应商名称</th>
                            <th width="150">维修联系人</th>
                            <th width="150">维修联系电话</th>
                            <th width="200">备注</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in repairList">
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.repairTypeName }}</td>
                            <td>{{ item.feeDate }}</td>
                            <td>{{ item.feeProject }}</td>
                            <td>{{ item.supplierName }}</td>
                            <td>{{ item.linkMan }}</td>
                            <td>{{ item.linkPhone }}</td>
                            <td>{{ item.remark }}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="tipInfo">
                    说明：</br>
                    1、此档案卡是车辆所有信息的“总站”，将分散在《维修单》、《检查表》及各部门的信息汇总于一处，提供一站式查询。</br>
                    2、生命周期管理：从“出生”（购置）到“死亡”（报废/转卖），完整记录车辆的全生命周期，是资产管理和处置决策的权威依据、决策支持。</br>
                    3、“年度评估” 部分将技术数据转化为管理洞察，直接指导车辆的保留、大修或淘汰决策。</br>
                    4、“残值评估” 为财务核算和资产处置提供了关键数据。</br>
                    5、风险管控：清晰的 “事故记录” 和 “重大维修记录” 有助于评估车辆的安全风险和潜在责任。</br>
                </div>
            </div>
            <div class="page-bot-btn ">
                <el-button @click="print">打印</el-button>
            </div>
        </div>
        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>
    </div>
</template>

<script>
import ownVehicleRecord from './ownVehicleRecord.js'
export default ownVehicleRecord
</script>
<style lang="scss" scoped>
.ownVehicleRecordPage {
    .tableTitle {
        position: relative;
        padding: 10px 0 30px;

        .logo {
            position: absolute;
            top: 10px;
            left: 0;
            height: 50px;
        }

        .title {
            font-size: 24px;
            text-align: center;
            color: #333;
            line-height: 1;
            font-weight: bold;
        }

        .num {
            font-size: 14px;
            text-align: center;
            color: #333;
            margin-top: 13px;

        }
    }

    .imgTable {
        display: flex;
        border: $border;

        .fillTbale {
            flex: 1;
            border: none;

            tr:last-child {
                td {
                    border-bottom: none;
                }
            }
        }

        .imgView {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;

            img {
                max-width: 90%;
                max-height: 230px;
                object-fit: contain;
                cursor: pointer;
            }

        }
    }

    .fillTbale {
        .label {
            background: transparent;
            text-align: right;
            padding-right: 20px;
            width: 100px;
        }

        .value {
            background: #f5f5f5;
            text-align: center;
            width: 300px;
        }
    }

    .tableCommon {
        border: $border;
    }

    .tipInfo {
        margin-top: 40px;
        line-height: 24px;
    }
}
</style>