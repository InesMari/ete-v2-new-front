<template>
    <div id="printOutOrder" class="printOutOrderPage">
        <div class="common-info" style="padding:0 0 50px;">
            
            <innerTab v-if="tabs.length > 1" ref="tabs" :tabs="tabs" @selectCallback="selectCallback"></innerTab>
            <div v-show="showType == 1">
                <div id="printTable" style="position: relative;">
                    <div style="text-align: center;height:70px;position:relative;">
                        <img style="height: 50px;float: left;margin: 10px;position:absolute;top:0;left:0;" src="@/static/image/logo.png">
                        <p style="font-weight: bold;font-size: 14px;color:#333;line-height: 1;padding-top:15px;">广东易迁易物流科技有限公司</p>
                        <p style="font-weight: bold;font-size: 14px;color:#333;line-height: 1;margin-top: 8px;">出库作业单({{info.orderTypeName}})</p>
                        <span style="    position: absolute; top: 10px; z-index: 9; right: 170px; padding: 7px 16px; line-height: 1; font-size: 30px; border: 2px solid red; border-radius: 5px; color: red; font-weight: bold;" v-if="newScanQrcode">需扫码</span>
                        <img style="height: 50px;float: right;position:absolute;top:15px;right:0px;" :src="info.qrImgPath">
                        <!-- <img style="height: 70px;float: right;position:absolute;top:0;right:0;" :src="info.qrcode"> -->
                    </div>
                    <!-- 加急 -->
                    <img style="height: 100px;position:absolute;top:50%;left:50%;transform: translateX(-50%) translateY(-50%);" src="@/static/image/urgent2.png" v-if="info.isEmergency==1"></img>

                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;border-left: 1px solid #333;"> 
                        <tr>
                            <td width="80" style="font-size:12px;border-right: 1px solid #dbdbdb;border-top: 1px solid #333;text-align: center;height:30px;background: #f2f2f2;">货主</td>
                            <td width="200" style="font-size:12px;border-right: 1px solid #dbdbdb;border-top: 1px solid #333;text-align: center;height:30px;">{{ info.srcTenantName?info.srcTenantName:'-' }}</td>
                            <td width="80" style="font-size:12px;border-right: 1px solid #dbdbdb;border-top: 1px solid #333;text-align: center;height:30px;background: #f2f2f2;">要求出库时间</td>
                            <td width="80" style="font-size:12px;border-right: 1px solid #dbdbdb;border-top: 1px solid #333;text-align: center;height:30px;">{{ info.requireOutDate }}</td>
                            <td width="80" style="font-size:12px;border-right: 1px solid #dbdbdb;border-top: 1px solid #333;text-align: center;height:30px;background: #f2f2f2;">出库合计板数</td>
                            <td width="80" style="font-size:12px;border-right: 1px solid #dbdbdb;border-top: 1px solid #333;text-align: center;height:30px;">{{ info.planPalletNums }}</td>
                            <td width="80" style="font-size:12px;border-right: 1px solid #dbdbdb;border-top: 1px solid #333;text-align: center;height:30px;background: #f2f2f2;">要求送达时间</td>
                            <td width="200" style="font-size:12px;border-right: 1px solid #333;border-top: 1px solid #333;text-align: center;height:30px;">{{ info.requireDoneTime }}</td>
                        </tr>
                        <tr>
                            <td style="font-size:12px;border-right: 1px solid #dbdbdb;border-top: 1px solid #dbdbdb;text-align: center;height:30px;background: #f2f2f2;">送货地址</td>
                            <td style="font-size:12px;border-right: 1px solid #dbdbdb;border-top: 1px solid #dbdbdb;text-align: center;height:30px;">{{info.workAddressStr}}</td>
                            <td style="font-size:12px;border-right: 1px solid #dbdbdb;border-top: 1px solid #dbdbdb;text-align: center;height:30px;background: #f2f2f2;">是否退货</td>
                            <td style="font-size:12px;border-right: 1px solid #dbdbdb;border-top: 1px solid #dbdbdb;text-align: center;height:30px;">{{ info.rejectedStateName }}</td>
                            <td style="font-size:12px;border-right: 1px solid #dbdbdb;border-top: 1px solid #dbdbdb;text-align: center;height:30px;background: #f2f2f2;">是否自提</td>
                            <td style="font-size:12px;border-right: 1px solid #dbdbdb;border-top: 1px solid #dbdbdb;text-align: center;height:30px;">{{ info.selfPickupName }}</td>
                            <td style="font-size:12px;border-right: 1px solid #dbdbdb;border-top: 1px solid #dbdbdb;text-align: center;height:30px;background: #f2f2f2;">出库备注</td>
                            <td style="font-size:12px;border-right: 1px solid #333;border-top: 1px solid #dbdbdb;text-align: center;height:30px;">{{ info.remark }}</td>
                        </tr>
                    </table>
                    <div style="display:flex;border:1px solid #333;">
                        <table border="0" cellspacing="0" cellpadding="0" style="width:120px;">
                            <tr>
                                <td style="font-size:12px;text-align: center;color: #333;border-bottom: 1px solid #333;height:30px;word-break: break-all;">出库作业流程</td>
                            </tr>
                            <tr>
                                <td style="text-align: center;color: #333;word-break: break-all;">
                                    <img style="height:350px;" src="@/static/image/orderOutFlow.jpg" alt="">
                                </td>
                            </tr>
                        </table>
                        <div style="flex:1;border-left: 1px solid #333;">
                            <div style="display:flex;">
                                <table border="0" cellspacing="0" cellpadding="0" style="flex:1;width:100%;">
                                    <tr>
                                        <td :colspan="info.orderType==2?15:14" style="font-size:12px;text-align: center;color: #333;border-right: 1px solid #333;border-bottom: 1px solid #333;height:30px;word-break: break-all;">步骤一：出库计划</td>
                                        <td colspan="2" style="font-size:12px;text-align: center;color: #333;border-right: 1px solid #333;border-bottom: 1px solid #333;height:30px;word-break: break-all;">步骤二：作业内容</td>
                                        <td colspan="2  " style="font-size:12px;text-align: center;color: #333;border-bottom: 1px solid #333;height:30px;word-break: break-all;">步骤三：出库复核</td>
                                    </tr>
                                    <tr>
                                        <td style="font-size:12px;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;width: 35px;">序号</td>
                                        <td style="font-size:12px;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">物料编码</td>
                                        <td style="font-size:12px;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">物料描述</td>
                                        <td style="font-size:12px;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;" v-show="info.orderType==2">货主</td>
                                        <td style="font-size:12px;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">到货厂商</td>
                                        <td style="font-size:12px;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">批次</td>
                                        <td style="font-size:12px;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">供应商批次</td>
                                        <td style="font-size:12px;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">ASN</td>
                                        <td style="font-size:12px;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">生产日期</td>
                                        <td style="font-size:12px;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">仓库内库位</td>
                                        <td style="font-size:12px;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">卸货点</td>
                                        <td style="font-size:12px;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">计划数量</td>
                                        <td style="font-size:12px;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;width: 35px;">管理单位</td>
                                        <td style="font-size:12px;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;width: 35px;">计划箱数</td>
                                        <td style="font-size:12px;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-right: 1px solid #333;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;width: 35px;">计划托数</td>
                                        <td style="font-size:12px;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;width: 35px;">实际箱数</td>
                                        <td style="font-size:12px;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-right: 1px solid #333;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;width: 35px;">实际托数</td>
                                        <td style="font-size:12px;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;width: 35px;">货物异常</td>
                                        <td style="font-size:12px;background:#f2f2f2;text-align: center;color: #333;padding:0 2px;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;width: 35px;">复核异常</td>
                                    </tr>
                                    <tr v-for="(item,index) in materialList" :key="index">
                                        <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;">{{index+1}}</td>
                                        <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;">{{item.materialNum}}</td>
                                        <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;">{{item.materialDesc}}</td>
                                        <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;" v-show="info.orderType==2">{{item.srcTenantName}}</td>
                                        <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;">{{item.fromTenantName}}</td>
                                        <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;">{{item.batchNum}}</td>
                                        <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;">{{item.supplierBatchNum}}</td>
                                        <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;">{{item.asn}}</td>
                                        <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;">{{item.produceDate}}</td>
                                        <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;">{{item.storageCode}}</td>
                                        <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;">{{item.workDetailName}}</td>
                                        <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;">{{item.planNums}}</td>
                                        <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;">{{item.unitName}}</td>
                                        <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;">{{item.planBoxNums}}</td>
                                        <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;text-align: center;color: #333;padding:0 2px;border-right: 1px solid #333;height:30px;word-break: break-all;">{{item.planPalletNums}}</td>
                                        <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;">{{item.boxNums}}</td>
                                        <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;text-align: center;color: #333;padding:0 2px;border-right: 1px solid #333;height:30px;word-break: break-all;">{{item.palletNums}}</td>
                                        <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;"></td>
                                        <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;text-align: center;color: #333;padding:0 2px;height:30px;word-break: break-all;"></td>
                                    </tr>
                                </table>
                                <!-- <table border="0" cellspacing="0" cellpadding="0" style="width:200px;">
                                    <tr>
                                        <td colspan="3" style="font-size:12px;text-align: center;color: #333;border-bottom: 1px solid #333;height:30px;word-break: break-all;">出库作业内容操作明细</td>
                                    </tr>
                                    <tr>
                                        <td style="font-size:12px;background:#f2f2f2;text-align: center;color: #333;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">作业费用明细</td>
                                        <td style="font-size:12px;background:#f2f2f2;text-align: center;color: #333;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">计费单位</td>
                                        <td style="font-size:12px;background:#f2f2f2;text-align: center;color: #333;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">数量</td>
                                    </tr>
                                    <tr v-for="(item,index) in feeList" :key="index">
                                        <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;text-align: center;color: #333;height:30px;word-break: break-all;">{{item.itemName}}</td>
                                        <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;text-align: center;color: #333;height:30px;word-break: break-all;">{{item.unit}}</td>
                                        <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;text-align: center;color: #333;height:30px;word-break: break-all;"></td>
                                    </tr>
                                </table> -->
                            </div>
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-top: 1px solid #333;">
                                <tr>
                                    <td style="font-size:12px;background:#f2f2f2;text-align: center;color: #333;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;width: 35px;">序号</td>
                                    <td style="font-size:12px;background:#f2f2f2;text-align: center;color: #333;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">可回收包材</td>
                                    <td style="font-size:12px;background:#f2f2f2;text-align: center;color: #333;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">所属用户</td>
                                    <td style="font-size:12px;background:#f2f2f2;text-align: center;color: #333;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">出库数量</td>
                                    <td style="font-size:12px;background:#f2f2f2;text-align: center;color: #333;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">实际出库数量</td>
                                </tr>
                                <tr v-for="(item,index) in packMaterialList" :key="index">
                                    <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;text-align: center;color: #333;height:30px;word-break: break-all;">{{index + 1}}</td>
                                    <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;text-align: center;color: #333;height:30px;word-break: break-all;">{{item.name}}</td>
                                    <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;text-align: center;color: #333;height:30px;word-break: break-all;">{{item.srcTenantName}}</td>
                                    <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;text-align: center;color: #333;height:30px;word-break: break-all;">{{item.nums}}</td>
                                    <td :style="index%2==0?'background:#f2f2f2;':''" style="font-size:12px;text-align: center;color: #333;height:30px;word-break: break-all;"></td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed;border: 1px solid #333; margin-top: 5px;">   
                        <tr>
                            <td rowspan="6" style="font-size:12px;text-align: center;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;width:150px;">单据使用说明</td>
                            <td style="font-size:12px;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;padding-left: 5px;width: 600px;">1、单号：系统自动生成</td>
                            <td rowspan="2" style="width:120px;font-size:12px;text-align: center;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">
                                <img style="height:50px;" src="@/static/image/orderPrintTxt.jpg" alt="" />
                            </td>
                            <td rowspan="2" style="font-size:12px;text-align: center;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">备注货操作员</td>
                            <td rowspan="2" style="font-size:12px;text-align: center;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">出入库复核员</td>
                            <td rowspan="2" style="font-size:12px;text-align: center;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">仓库班长</td>
                            <td rowspan="2" style="font-size:12px;text-align: center;color: #333;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">仓库主管</td>
                        </tr>
                        <tr>
                            <td style="font-size:12px;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;padding-left: 5px;">2、出库计划由仓储客服专员根据客户叫料计划，通过易迁易ITM系统生成出库单并打印</td>
                        </tr>
                        <tr>
                            <td style="font-size:12px;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;padding-left: 5px;">3、实际箱数以及实际托数由备货操作员填写</td>
                            <td rowspan="2" style="font-size:12px;text-align: center;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">作业人员签字</td>
                            <td rowspan="2" style="font-size:12px;text-align: center;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;"></td>
                            <td rowspan="2" style="font-size:12px;text-align: center;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;"></td>
                            <td rowspan="2" style="font-size:12px;text-align: center;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;"></td>
                            <td rowspan="2" style="font-size:12px;text-align: center;color: #333;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;"></td>
                        </tr>
                        <tr>
                            <td style="font-size:12px;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;padding-left: 5px;">4、作业内容根据物料维护系统后自动选择（换箱作业、贴标作业、托盘使用、打托作业）</td>
                        </tr>
                        <tr>
                            <td style="font-size:12px;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;padding-left: 5px;">5、出库复核由出入库复核员填写，复核没问题的打钩，有问题的需及时处理后再进行打钩</td>
                            <td rowspan="2" style="font-size:12px;text-align: center;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;">作业时间填写</td>
                            <td rowspan="2" style="font-size:12px;text-align: center;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;"></td>
                            <td rowspan="2" style="font-size:12px;text-align: center;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;"></td>
                            <td rowspan="2" style="font-size:12px;text-align: center;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;"></td>
                            <td rowspan="2" style="font-size:12px;text-align: center;color: #333;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;"></td>
                        </tr>
                        <tr>
                            <td style="font-size:12px;color: #333;border-right: 1px solid #bdbdbd;border-bottom: 1px solid #bdbdbd;height:30px;word-break: break-all;padding-left: 5px;">6、完成所有作业后，班长将出库作业单交仓库主管签名，仓库主管核对无误后交仓储客服专员维护系统</td>
                        </tr>
                    </table>
                    <table width="100%">
                        <tr>
                            <td colspan="11" style="text-align:right;padding-right: 30px;line-height: 30px;font-size: 12px;color:#333;">
                                <span style="margin-right:30px;">打印人：{{userName}}</span><span style="margin-right:30px;">打印时间：{{ printDate }}</span><span>打印次数：{{ info.printTimes }}次</span>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="bot-btn">
                    <el-button @click="close()">关闭</el-button>
                    <el-button type="primary" @click="print()">打印</el-button>
                    <el-button type="success" @click="printTag()" v-if="hasNewQrcode">标签预览</el-button>
                    <el-button type="success" @click="viewCustCode()" v-if="hasCustQrcode">客户码预览</el-button>
                </div>
            </div>
            
            <div v-show="showType == 2">
                <printTagCode tagType="2"></printTagCode>
            </div>
            
            <div v-show="showType == 3">
                <table id="custTable" class="custTable" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th width="100">序号</th>
                            <th>物料父标签</th>
                            <th>库区</th>
                            <th>库位</th>
                            <th>客户码</th>
                            <th>码类型</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in custQrcodeList">
                            <td>{{ index+1 }}</td>
                            <td>{{ item.parentCodeNum }}</td>
                            <td>{{ item.reservoirCode }}</td>
                            <td>{{ item.storageCode }}</td>
                            <td>{{ item.codeNum }}</td>
                            <td>{{ item.relCustQrcodeTypeName }}</td>
                        </tr>
                    </tbody>
                </table>
                <div class="bot-btn">
                    <el-button type="primary" @click="printCustCode()">打印</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import printOutOrder from './printOutOrder.js'
    export default printOutOrder
</script>
<style lang="scss">
.printOutOrderPage{
    .titleTable{
        width: 100%;
        td{
            text-align: center;
            font-weight: bold;
            font-size: 18px;
            padding: 12px 0;
        }
    }
    .tableCommon{
        border:$border;
        border-bottom:none;
        tfoot{
            td{
                font-weight: bold;
            }
        }
    }
    .footerTable{
        width: 100%;
        margin-top:10px;
        td{
            font-weight: bold;
            padding: 5px;
            font-size: 15px;
        }
        .label{
            text-align: right;
        }
    }
    .custTable{
        table-layout: fixed;
        thead {

                tr {
                    background: $border-color;
                    th {
                        font-size: 12px;
                        padding: 0 5px;
                        text-align: center;
                        box-sizing: border-box;
                        white-space: nowrap;
                        line-height: 30px;
                        height: 30px;
                        border-right: 1px solid #fff;
                        border-bottom: 1px solid #fff;
                        font-weight: bold;
                    }
                }
        }
        tbody,tfoot {

            tr {
                background: #fff;
                position: relative;
                cursor: pointer;

                &:hover,&.hover{
                    background: $hover-color;
                }

                td {
                    color: #333;
                    box-sizing: border-box;
                    text-align: center;
                    height: 30px;
                    padding: 0 5px;
                    text-align: center;
                    white-space: nowrap;
                    border-right: 1px solid #c9d7ea;
                    border-bottom: 1px solid #c9d7ea;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    &:last-child{
                    border-right: none;
                    }
                }
            }
        }
    }
}
</style>
