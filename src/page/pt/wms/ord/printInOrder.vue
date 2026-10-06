<template>
    <div id="printInOrder" class="printInOrderPage">
        <div class="common-info" style="padding:0 0 50px;">        
        <innerTab v-if="hasNewQrcode&&info.scanCustQrcode==0" :tabs="tabs" @selectCallback="selectCallback"></innerTab>

        <div v-show="showType == 1">
            <div  id="printTable" class="printInOrder">
            <div style="text-align: center;height:70px;position:relative;">
                <img style="height: 50px;float: left;margin: 8px;position:absolute;top:0;left:0;" src="@/static/image/logo.png">
                <p style="font-weight: bold;font-size: 14px;color:#333;line-height: 1;padding-top:15px;">广东易迁易物流科技有限公司</p>
                <p style="font-weight: bold;font-size: 14px;color:#333;line-height: 1;margin-top: 8px;">入库作业单</p>
                <span style="    position: absolute; top: 10px; z-index: 9; right: 170px; padding: 7px 16px; line-height: 1; font-size: 30px; border: 2px solid red; border-radius: 5px; color: red; font-weight: bold;" v-if="hasNewQrcode">需扫码</span>
                <img style="height: 50px;float: right;position:absolute;top:15px;right:0px;" :src="info.qrImgPath">
                <!-- <img style="height: 70px;float: right;position:absolute;top:0;right:0;" :src="info.qrcode"> -->
            </div>
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;border-left: 1px solid #333;"> 
                <tr>
                    <td width="80" style="font-size:12px;;border-right: 1px solid #dbdbdb;border-top: 1px solid #333;text-align: center;height:30px;background: #f2f2f2;">货主</td>
                    <td width="200" style="font-size:12px;;border-right: 1px solid #dbdbdb;border-top: 1px solid #333;text-align: center;height:30px;">{{ info.srcTenantName }}</td>
                    <td width="100" style="font-size:12px;;border-right: 1px solid #dbdbdb;border-top: 1px solid #333;text-align: center;height:30px;background: #f2f2f2;">预计入库时间</td>
                    <td width="150" style="font-size:12px;;border-right: 1px solid #dbdbdb;border-top: 1px solid #333;text-align: center;height:30px;">{{ info.requireInDate }}</td>
                    <td width="100" style="font-size:12px;;border-right: 1px solid #dbdbdb;border-top: 1px solid #333;text-align: center;height:30px;background: #f2f2f2;">来料合计板数</td>
                    <td width="100" style="font-size:12px;;border-right: 1px solid #dbdbdb;border-top: 1px solid #333;text-align: center;height:30px;">{{info.totalPalletNums}}</td>
                    <td width="80" style="font-size:12px;;border-right: 1px solid #dbdbdb;border-top: 1px solid #333;text-align: center;height:30px;background: #f2f2f2;">入库单号</td>
                    <td width="120" style="font-size:12px;;border-right: 1px solid #333;border-top: 1px solid #333;text-align: center;height:30px;">{{ info.inOrderNum }}</td>
                </tr>
                <tr>
                    <td style="font-size:12px;;border-right: 1px solid #dbdbdb;border-top: 1px solid #dbdbdb;text-align: center;height:30px;background: #f2f2f2;">来货地址</td>
                    <td style="font-size:12px;;border-right: 1px solid #dbdbdb;border-top: 1px solid #dbdbdb;text-align: center;height:30px;">{{info.workAddressStr}}</td>
<!--                    <td style="font-size:12px;;border-right: 1px solid #dbdbdb;border-top: 1px solid #dbdbdb;text-align: center;height:30px;background: #f2f2f2;">ASN</td>-->
<!--                    <td style="font-size:12px;;border-right: 1px solid #dbdbdb;border-top: 1px solid #dbdbdb;text-align: center;height:30px;">{{ info.asn }}</td>-->
                    <td style="font-size:12px;;border-right: 1px solid #dbdbdb;border-top: 1px solid #dbdbdb;text-align: center;height:30px;background: #f2f2f2;">入库类型</td>
                    <td style="font-size:12px;;border-right: 1px solid #dbdbdb;border-top: 1px solid #dbdbdb;text-align: center;height:30px;">{{ info.rejectedStateName }}</td>
                    <td style="font-size:12px;;border-right: 1px solid #dbdbdb;border-top: 1px solid #dbdbdb;text-align: center;height:30px;background: #f2f2f2;">备注</td>
                    <td style="font-size:12px;;border-right: 1px solid #333;border-top: 1px solid #dbdbdb;text-align: center;height:30px;" colspan="3">{{ info.remark }}</td>
                </tr>
                <tr>
                    <td style="font-size:12px;;border-right: 1px solid #dbdbdb;border-top: 1px solid #dbdbdb;text-align: center;height:30px;background: #f2f2f2;">车牌号码</td>
                    <td style="font-size:12px;;border-right: 1px solid #dbdbdb;border-top: 1px solid #dbdbdb;text-align: center;height:30px;">{{info.plateNumber}}</td>
                    <td style="font-size:12px;;border-right: 1px solid #dbdbdb;border-top: 1px solid #dbdbdb;text-align: center;height:30px;background: #f2f2f2;">手机号码</td>
                    <td style="font-size:12px;;border-right: 1px solid #dbdbdb;border-top: 1px solid #dbdbdb;text-align: center;height:30px;">{{ info.linkPhone }}</td>
                    <td style="font-size:12px;;border-right: 1px solid #dbdbdb;border-top: 1px solid #dbdbdb;text-align: center;height:30px;background: #f2f2f2;">司机姓名</td>
                    <td style="font-size:12px;;border-right: 1px solid #333;border-top: 1px solid #dbdbdb;text-align: center;height:30px;" colspan="3">{{ info.linkman }}</td>
                </tr>
            </table>
            <div style="display:flex;border:1px solid #333;">
                <table border="0" cellspacing="0" cellpadding="0" style="width:90px;">
                    <tr>
                        <td style="font-size:12px;;text-align: center;color: #333;border-bottom: 1px solid #333;height:30px;;word-break: break-all;">入库作业流程</td>
                    </tr>
                    <tr>
                        <td style="text-align: center;color: #333;word-break: break-all;">
                            <img style="height:290px;margin-top: 2px;" src="@/static/image/orderInFlow.jpg" alt="">
                        </td>
                    </tr>
                </table>
                <div style="flex:1;border-left: 1px solid #333;">
                    <div style="display:flex;">
                        <table border="0" cellspacing="0" cellpadding="0" style="width: 100%;">
                            <tr>
                                <td colspan="11" style="font-size:12px;;text-align: center;color: #333;border-right: 1px solid #333;border-bottom: 1px solid #333;height:30px;;word-break: break-all;">步骤一：入库计划</td>
                                <td colspan="2" style="font-size:12px;;text-align: center;color: #333;border-right: 1px solid #333;border-bottom: 1px solid #333;height:30px;;word-break: break-all;">步骤二：作业内容</td>
                                <td colspan="4" style="font-size:12px;;text-align: center;color: #333;border-right: 1px solid #333;border-bottom: 1px solid #333;height:30px;;word-break: break-all;">步骤三：入库复核</td>
                                <td colspan="2" style="font-size:12px;;text-align: center;color: #333;border-bottom: 1px solid #333;height:30px;;word-break: break-all;">步骤四：入库</td>
                            </tr>
                            <tr>
                                <td style="font-size:12px;;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;;word-break: break-all;width: 35px;">序号</td>
                                <td style="font-size:12px;;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;;word-break: break-all;">物料编码</td>
<!--                                <td style="font-size:12px;;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;;word-break: break-all;">物料描述</td>-->
                                <td style="font-size:12px;;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;;word-break: break-all;">到货厂商</td>
                                <td style="font-size:12px;;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;;word-break: break-all;">批次</td>
                                <td style="font-size:12px;;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;;word-break: break-all;">供应商批次</td>
                                <td style="font-size:12px;;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;;word-break: break-all;">ASN</td>
                                <td style="font-size:12px;;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;;word-break: break-all;">生产日期</td>
                                <td style="font-size:12px;;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;;word-break: break-all;">计划数量</td>
                                <td style="font-size:12px;;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;;word-break: break-all;width: 35px;">管理单位</td>
                                <td style="font-size:12px;;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;;word-break: break-all;width: 35px;">计划箱数</td>
                                <td style="font-size:12px;;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-right: 1px solid #333;border-bottom: 1px solid #bdbdbd;height:30px;;word-break: break-all;width: 35px;">计划托数</td>
                                <td style="font-size:12px;;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;;border-bottom: 1px solid #bdbdbd;height:30px;;word-break: break-all;width: 35px;">实际箱数</td>
                                <td style="font-size:12px;;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-right: 1px solid #333;border-bottom: 1px solid #bdbdbd;height:30px;;word-break: break-all;width: 35px;">实际托数</td>
                                <td style="font-size:12px;;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;;word-break: break-all;width: 35px;">货差/货损</td>
                                <td style="font-size:12px;;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;;word-break: break-all;width: 35px;">货物污染</td>
                                <td style="font-size:12px;;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;;word-break: break-all;width: 35px;">其他</td>
                                <td style="font-size:12px;;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-right: 1px solid #333;border-bottom: 1px solid #bdbdbd;height:30px;;word-break: break-all;width: 45px;">无异常/已解决</td>
                                <td style="font-size:12px;;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;;word-break: break-all;width: 35px;">库区</td>
                                <td style="font-size:12px;;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;;word-break: break-all;width: 35px;">库位</td>
                            </tr>
                            <tr v-for="(item,index) in materialList" :key="index">
                                <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;">{{index+1}}</td>
                                <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;">{{item.materialNum}}</td>
<!--                                <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;">{{item.materialDesc}}</td>-->
                                <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;">{{item.fromTenantName}}</td>
                                <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;">{{item.batchNum}}</td>
                                <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;">{{item.supplierBatchNum}}</td>
                                <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;">{{item.asn}}</td>
                                <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;">{{item.produceDate}}</td>
                                <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;">{{item.nums}}</td>
                                <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;">{{item.unitName}}</td>
                                <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;">{{item.boxNums}}</td>
                                <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;;text-align: center;color: #333;padding:0 2px;border-right: 1px solid #333;height:30px;word-break: break-all;">{{item.palletNums}}</td>
                                <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;padding-left: 2px;"></td>
                                <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;;text-align: center;color: #333;padding:0 2px;border-right: 1px solid #333;height:30px;word-break: break-all;"></td>
                                <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;"></td>
                                <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;"></td>
                                <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;"></td>
                                <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;;text-align: center;color: #333;padding:0 2px;border-right: 1px solid #333;height:30px;word-break: break-all;"></td>
                                <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;"></td>
                                <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;"></td>
                            </tr>
                        </table>
                        <!-- <table border="0" cellspacing="0" cellpadding="0" style="width:200px;">
                            <tr>
                                <td colspan="3" style="font-size:12px;;text-align: center;color: #333;border-bottom: 1px solid #333;height:30px;;word-break: break-all;">入库作业内容操作明细</td>
                            </tr>
                            <tr>
                                <td style="font-size:12px;;background:#f2f2f2;text-align: center;color: #333;border-bottom: 1px solid #bdbdbd;height:30px;;word-break: break-all;">作业费用明细</td>
                                <td style="font-size:12px;;background:#f2f2f2;text-align: center;color: #333;border-bottom: 1px solid #bdbdbd;height:30px;;word-break: break-all;">计费单位</td>
                                <td style="font-size:12px;;background:#f2f2f2;text-align: center;color: #333;border-bottom: 1px solid #bdbdbd;height:30px;;word-break: break-all;">数量</td>
                            </tr>
                            <tr v-for="(item,index) in feeList" :key="index">
                                <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;;text-align: center;color: #333;height:30px;word-break: break-all;">{{item.itemName}}</td>
                                <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;;text-align: center;color: #333;height:30px;word-break: break-all;">{{item.unit}}</td>
                                <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;;text-align: center;color: #333;height:30px;word-break: break-all;"></td>
                            </tr>
                        </table> -->
                    </div>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #333;">
                        <tr>
                            <td style="font-size:12px;;background:#f2f2f2;text-align: center;color: #333;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;width: 35px;">序号</td>
                            <td style="font-size:12px;;background:#f2f2f2;text-align: center;color: #333;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">可回收器具</td>
                            <td style="font-size:12px;;background:#f2f2f2;text-align: center;color: #333;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">所属人</td>
                            <td style="font-size:12px;;background:#f2f2f2;text-align: center;color: #333;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">入库数量</td>
                            <td style="font-size:12px;;background:#f2f2f2;text-align: center;color: #333;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">实际入库数量</td>
                        </tr>
                        <tr v-for="(item,index) in packMaterialList" :key="index">
                            <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;;text-align: center;color: #333;height:30px;word-break: break-all;">{{index + 1}}</td>
                            <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;;text-align: center;color: #333;height:30px;word-break: break-all;">{{item.name}}</td>
                            <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;;text-align: center;color: #333;height:30px;word-break: break-all;">{{item.srcTenantName}}</td>
                            <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;;text-align: center;color: #333;height:30px;word-break: break-all;">{{item.nums}}</td>
                            <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;;text-align: center;color: #333;height:30px;word-break: break-all;"></td>
                        </tr>
                    </table>
                </div>
            </div>
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;border: 1px solid #333; margin-top: 5px;">   
                <tr>
                    <td width="120" rowspan="6" style="font-size:12px;;text-align: center;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">单据使用说明</td>
                    <td width="300" style="font-size:12px;;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;padding-left: 5px;">1、单号：系统自动生成</td>
                    <td width="100" rowspan="2" style="font-size:12px;;text-align: center;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;overflow:hidden;position:relative;">
                        <img class="zoomImg" style="height:56px;" src="@/static/image/orderPrintTxt.jpg" alt="" />
                    </td>
                    <td width="80" rowspan="2" style="font-size:12px;;text-align: center;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">叉车司机</td>
                    <td width="80" rowspan="2" style="font-size:12px;;text-align: center;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">出入库复核员</td>
                    <td width="80" rowspan="2" style="font-size:12px;;text-align: center;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">仓库班长</td>
                    <td width="80" rowspan="2" style="font-size:12px;;text-align: center;color: #333;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">仓库主管</td>
                </tr>
                <tr>
                    <td style="font-size:12px;;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;padding-left: 5px;">2、入库计划由仓储客服专员通过易迁易ITM系统生成入库单并打印</td>
                </tr>
                <tr>
                    <td style="font-size:12px;;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;padding-left: 5px;">3、实际箱数以及实际托数由备货操作员填写</td>
                    <td rowspan="2" style="font-size:12px;;text-align: center;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">作业人员签字</td>
                    <td rowspan="2" style="font-size:12px;;text-align: center;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;"></td>
                    <td rowspan="2" style="font-size:12px;;text-align: center;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;"></td>
                    <td rowspan="2" style="font-size:12px;;text-align: center;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;"></td>
                    <td rowspan="2" style="font-size:12px;;text-align: center;color: #333;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;"></td>
                </tr>
                <tr>
                    <td style="font-size:12px;;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;padding-left: 5px;">4、入库复核由出入库复核员填写</td>
                </tr>
                <tr>
                    <td style="font-size:12px;;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;padding-left: 5px;">5、库区库位由实际入库人员进行填写</td>
                    <td rowspan="2" style="font-size:12px;;text-align: center;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">作业时间填写</td>
                    <td rowspan="2" style="font-size:12px;;text-align: center;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;"></td>
                    <td rowspan="2" style="font-size:12px;;text-align: center;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;"></td>
                    <td rowspan="2" style="font-size:12px;;text-align: center;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;"></td>
                    <td rowspan="2" style="font-size:12px;;text-align: center;color: #333;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;"></td>
                </tr>
                <tr>
                    <td style="font-size:12px;;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;padding-left: 5px;">6、完成所有作业后，单据交仓储客服专员维护系统</td>
                </tr>
            </table>
            <table width="100%">
                <tr>
                    <td colspan="11" style="text-align:right;padding-right: 30px;line-height: 30px;font-size: 8px;color:#333;">
                        <span style="margin-right:30px;">打印人：{{userName}}</span><span style="margin-right:30px;">打印时间：{{ printDate }}</span><span>打印次数：{{ info.printTimes }}次</span>
                    </td>
                </tr>
            </table>
            </div>
            <div class="bot-btn">
                <el-button @click="close()">关闭</el-button>
                <el-button type="primary" @click="print()">打印</el-button>
                <el-button type="success" @click="printTag()" v-if="hasNewQrcode&&info.scanCustQrcode==0">标签预览</el-button>
            </div>
        </div>

        <div v-show="showType == 2">
            <printTagCode tagType="1"></printTagCode>
        </div>

        </div>
    </div>
</template>

<script>
    import printInOrder from './printInOrder.js'
    export default printInOrder
</script>
<style lang="scss" scoped>
.printInOrderPage{
    #printTable{
        
    }
    /deep/ .innerTab{
        border:none;
        border-bottom: $border;
    }
    /deep/ .common-info{
        border:none;
    }
}
</style>
