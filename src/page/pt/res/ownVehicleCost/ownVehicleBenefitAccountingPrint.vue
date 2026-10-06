<template>
    <div id="ownVehicleBenefitAccountingPrint" class="ownVehicleBenefitAccountingPrint">
        <!-- 下一步 -->
        <div class="common-info">
            <div id="printTable">
                <h3 class="tableTitle">单车收益表<span class="time">核算期间：{{ info.billMonth }}</span></h3>
                <table class="ownVehicleBenefitAccountingTable" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td>所属公司：</td>
                        <td colspan="2">{{ info.tenantName }}</td>
                        <td>车牌号码：</td>
                        <td>{{ info.plateNumber }}</td>
                    </tr>
                    <tr>
                        <td>运作项目：</td>
                        <td colspan="2"></td>
                        <td>是否有押运员：</td>
                        <td>{{ info.supercargoName?'有':'无' }}</td>
                    </tr>
                    <tr>
                        <td rowspan="4">车辆信息：</td>
                        <td>能源类型：</td>
                        <td>{{info.energyTypeName}}</td>
                        <td>购买日期：</td>
                        <td>{{info.buyDate}}</td>
                    </tr>
                    <tr>
                        <td>发动机号：</td>
                        <td>{{info.engineNumber}}</td>
                        <td>车架号：</td>
                        <td>{{ info.vin }}</td>
                    </tr>
                    <tr>
                      <td>车型：</td>
                      <td>{{info.vehicleTypeName}}</td>
                      <td>车长：</td>
                      <td>{{ info.vehicleLengthName }}</td>
                    </tr>
                  <tr>
                    <td>品牌：</td>
                    <td>{{info.brand}}</td>
                    <td>核定载质量：</td>
                    <td>{{ info.loadWeight }}</td>
                  </tr>
                    <tr>
                        <td>司机信息：</td>
                        <td>姓名：</td>
                        <td>{{info.driverName}}</td>
                        <td>驾驶证号：</td>
                        <td>{{ info.driverIdCard }}</td>
                    </tr>
                    <tr>
                        <td>押运员信息：</td>
                        <td>姓名：</td>
                        <td>{{ info.supercargoName }}</td>
                        <td>身份证号：</td>
                        <td>{{ info.supercargoIdCard }}</td>
                    </tr>
                    <tr>
                        <td>运作数据：</td>
                        <td>运作车次：</td>
                        <td>{{ info.opTimes }}</td>
                        <td>有效公里数：</td>
                        <td>{{ info.totalMileage }}</td>
                    </tr>
                    <tr>
                        <td rowspan="7">减：固定成本</td>
                        <td>折旧：</td>
                        <td>{{ info.depreciation }}</td>
                        <td>交强险：</td>
                        <td>{{ info.heavyTrafficInsurance }}</td>
                    </tr>
                    <tr>
                        <td>商业险：</td>
                        <td>{{ info.commercialInsurance }}</td>
                        <td>车船税：</td>
                        <td>{{ info.vehicleVesselTax }}</td>
                    </tr>
                    <tr>
                        <td>GPS服务费：</td>
                        <td>{{ info.gpsServiceCharge }}</td>
                        <td>电池租金：</td>
                        <td>{{ info.batteryRent }}</td>
                    </tr>
                    <tr>
                        <td>司机工资：</td>
                        <td>{{ info.driverSalary }}</td>
                        <td>押运员工资：</td>
                        <td>{{ info.supercargoSalary }}</td>
                    </tr>
                    <tr>
                        <td>司机福利：</td>
                        <td></td>
                        <td>押运员福利：</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>司机社保：</td>
                        <td>{{ info.driverSocialSecurityTax }}</td>
                        <td>押运员社保：</td>
                        <td>{{ info.supercargoSocialSecurityTax }}</td>
                    </tr>
                    <tr>
                        <td>年审：</td>
                        <td>{{ info.inspectionFee }}</td>
                        <td>其他费用：</td>
                        <td></td>
                    </tr>
                    <tr style="background-color: #f5f5f5;">
                        <td>固定成本合计：</td>
                        <td colspan="4">{{ info.fixedCost }}</td>
                    </tr>
                    <tr>
                        <td rowspan="6">减：变动成本</td>
                        <td>油费：</td>
                        <td>{{ info.oilFee }}</td>
                        <td>尿素：</td>
                        <td>{{ info.ureaFee }}</td>
                    </tr>
                    <tr>
                        <td>电费：</td>
                        <td>{{ info.electricFee }}</td>
                        <td>保养：</td>
                        <td>{{ info.maintenanceFee }}</td>
                    </tr>
                    <tr>
                        <td>燃气费：</td>
                        <td>{{ info.gasFee }}</td>
                        <td>维修：</td>
                        <td>{{ info.repairFee }}</td>
                    </tr>
                    <tr>
                        <td>路桥费：</td>
                        <td>{{ info.roadBridgeFee }}</td>
                        <td>轮胎：</td>
                        <td>{{ info.tireFee }}</td>
                    </tr>
                    <tr>
                        <td>装卸费：</td>
                        <td>{{ info.loadingUnloadingFee }}</td>
                        <td>违章罚款：</td>
                        <td>{{ info.trafficViolationTicket }}</td>
                    </tr>
                    <tr>
                        <td>劳保用品：</td>
                        <td>{{ info.personalProtectiveEquipment }}</td>
                        <td>其他费用：</td>
                        <td>{{ info.otherFee }}</td>
                    </tr>
                    <tr style="background-color: #f5f5f5;">
                        <td>变动成本合计：</td>
                        <td colspan="4">{{ info.changeCost }}</td>
                    </tr>
                    <tr>
                        <td>订单收入：{{ info.contractOrderIncomeFee }}</td>
                        <td>外接收入：{{ info.tempOrderIncomeFee}}</td>
                        <td>收入合计：{{ info.orderIncomeFee }}</td>
                        <td>成本合计：{{ info.totalCost }}</td>
                        <td>毛利：{{ info.gross }}</td>
                    </tr>
                    <tr>
                        <td>考评指标</td>
                        <td colspan="4">司机考评</td>
                    </tr>
                    <tr>
                        <td>运作异常</td>
                        <td colspan="4">
                            {{info.driverAssessment.operationalData}}
<!--                            <span style="margin:0 20px;">车辆异常次数：1</span>-->
<!--                            <span style="margin:0 20px;">事故异常次数：2</span>-->
<!--                            <span style="margin:0 20px;">运作异常次数：3</span>-->
                        </td>
                    </tr>
                    <tr>
                        <td>车辆点检</td>
                        <td colspan="4">{{info.driverAssessment.vehicleInspection}}</td>
                    </tr>
                    <tr>
                        <td>工作态度</td>
                        <td colspan="4">{{info.driverAssessment.workAttitude}}</td>
                    </tr>
                    <tr>
                        <td>异常点</td>
                        <td colspan="4">{{info.driverAssessment.outlier}}</td>
                    </tr>
                    <tr style="background-color: #f5f5f5;">
                        <td colspan="5" style="text-align: left;padding-left: 18px;">注：</td>
                    </tr>
                    <tr>
                        <td colspan="5" style="text-align: left;">（1）系统在次月的16日0点生成上月的数据；</td>
                    </tr>
                    <tr>
                        <td colspan="5" style="text-align: left;">（2）作为单车运作效益横向或纵向对比；</td>
                    </tr>
                    <tr>
                        <td colspan="5" style="text-align: left;">（3）本表单也可作为司机考评依据。</td>
                    </tr>
                </table>
            </div>
            <div class="bot-btn">
                <el-button @click="close()">关闭</el-button>
                <el-button type="primary" @click="print()">打印</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import ownVehicleBenefitAccountingPrint from './ownVehicleBenefitAccountingPrint.js'

export default ownVehicleBenefitAccountingPrint
</script>
<style lang="scss" scoped>
.ownVehicleBenefitAccountingPrint {

    .tableTitle {
        background: #fff;
        line-height: 40px;
        text-align: center;
        font-weight: bold;
        font-size: 16px;
        color: #333;
        position: relative;
        margin-bottom: 10px;
        .time{
            position: absolute;
            right: 0;
            bottom: 0;
            font-size: 12px;
            font-weight: normal;
        }
    }

    .ownVehicleBenefitAccountingTable {
        border-left: $border;
        border-top: $border;
        width: 100%;
        table-layout: fixed;

        td {
            border-right: $border;
            border-bottom: $border;
            padding: 5px 10px;
            color: #333;
            text-align: center;
        }
    }
}
</style>

