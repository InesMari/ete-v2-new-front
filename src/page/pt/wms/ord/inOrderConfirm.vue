<template>
    <div id="inOrderConfirm" class="warehousingDetailPage">
        <innerTab v-if="hasNewQrcode" :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <div class="common-info" v-show="showType == 1">
            <!--            基础信息-->
            <h3 class="common-title" style="margin-top: -20px;"><span class="title-name">基础信息</span></h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">入库单号</td>
                    <td class="value">{{ info.inOrderNum }}</td>
                    <td class="label">预计入库时间</td>
                    <td class="value">{{ info.requireInDate }}</td>
                    <td class="label">入库类型</td>
                    <td class="value">{{ info.rejectedStateName }}</td>

                    <td rowspan="4" class="label">
                        <p>附件</p><br/>
                        <p>只支持.jpg .png</p>
                    </td>
                    <td rowspan="4" width="110px;">
                        <div class="uploadFile clearfix">
                            <myFileModel ref="receiptsImg"></myFileModel>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td class="label">货主</td>
                    <td class="value">{{ info.srcTenantName }}</td>
                    <td class="label">来货地址</td>
                    <td class="value">{{ info.workName }}</td>
                    <td class="label">返程短驳单</td>
                    <td class="value">
                        <a href="javascript:void(0);" class="link" @click.stop="openDetail(info.waybillId)">{{ info.waybillNum }}</a>
                    </td>
                </tr>
                <tr>
                    <td class="label" >预约编号</td>
                    <td class="value" >{{ info.appointNum }}</td>
                    <td class="label" >车牌号码</td>
                    <td class="value" >{{ info.plateNumber }}</td>
                    <td class="label" >司机姓名</td>
                    <td class="value" >{{ info.linkman }}</td>
                </tr>
                <tr v-if="info.rejectedState==2">
                    <td class="label" >退货类型</td>
                    <td class="value" >{{ info.rejectedTypeName }}</td>
                    <td class="label" >退货责任方</td>
                    <td class="value" colspan="3">{{ info.rejectedDuty }}</td>
                </tr>
                <tr>
                    <td class="label" >手机号码</td>
                    <td class="value" >{{ info.linkPhone }}</td>
                    <td class="label" >备注</td>
                    <td class="value" colspan="3">{{ info.remark }}</td>
                </tr>

            </table>
            <!--            基础信息-->

            <!--            入库物料情况-->
            <h3 class="common-title mt_20">
                <span class="title-name">入库物料情况</span>
                <div class="fr">
                    批量选择库位：
                    <el-select v-model="storageIdsItem" @change="selectStorageIds" :disabled="info.state == 4"
                        filterable clearable placeholder="批量选择库位" value-key="storageCode" v-el-select-loadmore="loadMoreAll" @visible-change="refreshStorageListAll" :filter-method="filterStorageListAll">
                        <el-option v-for="data in storageListShow" :key="data.storageId"
                                    :label="data.storageCode" :value="data"/>
                    </el-select>
                </div>
            </h3>
            <div class="tableAuto">
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" ref="orderDetail">
                    <thead>
                    <tr>
                        <th width="50">序号</th>
                        <th width="120">批次号</th>
                        <th width="150">供应商批次号</th>
                        <th width="100">ASN</th>
                        <th width="180">物料编码</th>
                        <th width="100">物料描述</th>
                        <th width="250">到货厂商</th>
                        <th width="150">时代条码编号</th>
                        <th width="180">时代条码</th>
                        <th width="80">入库数量</th>
                        <th width="80">管理单位</th>
                        <th width="80">箱数</th>
                        <th width="80">托数</th>
                        <th width="120"><em>*</em>库区</th>
                        <th width="190"><em>*</em>库位</th>
                        <th width="120" v-show="info.scanQrcode==1">
                            每张条码数量
                            <el-tooltip class="item" effect="dark" placement="top-start">
                                <div style="color: #fff;"slot="content">每张条码包含的物料数量，一般为箱装容数或者托装容数。<br/>例：该处填写1000代表每张条码对应1000个物料。</div>
                                <i class="el-icon-question" style="color: red;"></i>
                            </el-tooltip>
                        </th>
                        <th width="80"><em>*</em>实际入库数量</th>
                        <th width="80"><em>*</em>实际入库箱数</th>
                        <th width="80"><em>*</em>实际入库托数</th>
                        <th width="100">是否冻结</th>
                        <th width="50">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index)  in materialList">
                        <td>{{index+1}}</td>
                        <td>{{ item.batchNum }}</td>
                        <td>{{ item.supplierBatchNum }}</td>
                        <td>{{ item.asn }}</td>
                        <td>{{ item.materialNum }}</td>
                        <td>{{ item.materialDesc }}</td>
                        <td>{{ item.fromTenantName }}</td>
                        <td>{{ item.codeNum }}</td>
                        <td><img :src="item.qrcodeUrl" alt="" width="100%" style="margin-top: 5px;height: 50px;"
                                 v-if="item.qrcodeUrl"></td>
                        <td>{{ item.nums }}</td>
                        <td>{{ item.unitName }}</td>
                        <td>{{ item.boxNums }}</td>
                        <td>{{ item.palletNums }}</td>
                        <td>
                            <el-select v-model="item.reservoirId" @change="loadStorageListByReservoirId(item, index)"
                                        v-if="!item.show"
                                       filterable clearable placeholder="请选择库区">
                                <el-option v-for="data in reservoirList" :key="data.reservoirId"
                                           :label="data.reservoirCode" :value="data.reservoirId"/>
                            </el-select>
                            <span v-if="item.show">{{ item.reservoirName }}</span>
                        </td>
                        <td v-el-select-loadmore="loadMore" :index="index">
                            <mySelect 
                                :model="item.storageId"
                                :multiple="workId==1345"
                                @visibleChange="loadStorageListByReservoirId2($event,item,index)" 
                                @change="changeStorageBack($event,item)"
                                :data="item.storageListShow"
                                :loading="storageLoading"
                                v-if="!item.show"
                                label="storageCode"
                                value="storageId"
                                placeholder="请选择库位"
                                @filterMethod="filterStorageList"
                                :index="index"
                            ></mySelect>
                            <span v-if="item.show">{{ item.storageName }}</span>
                        </td>
                        <td v-show="info.scanQrcode==1">
                            <el-input v-model="item.perNum" type="text" v-mydoubleval placeholder=""
                                      v-if="!item.show"></el-input>
                            <span v-if="item.show">{{ item.perNum }}</span>
                        </td>
                        <td>
                            <el-input v-model="item.realNums" type="text" v-mydouble4val placeholder=""
                                      @input="calcNums(index)" v-if="!item.show"></el-input>
                            <span v-if="item.show">{{ item.realNums }}</span>
                        </td>
                        <td>
                            <el-input v-model="item.realBoxNums" type="text" maxlength="10" v-mynumval placeholder=""
                                      @input="calcRealNums(1,index)" v-if="!item.show"></el-input>
                            <span v-if="item.show">{{ item.realBoxNums }}</span>
                        </td>
                        <td>
                            <el-input v-model="item.realPalletNums" type="text" maxlength="10" v-mynumval placeholder=""
                                      @input="calcRealNums(2,index)" v-if="!item.show"></el-input>
                            <span v-if="item.show">{{ item.realPalletNums }}</span>
                        </td>
                        <td>
                            <div class="switchDiv" v-if="!item.show">
                                <el-switch v-model="item.freezeState == 1" @change="changeSwitch(item)"                                           
                                           active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                                <span class="name">{{ item.freezeState == 1 ? "是" : "否" }}</span>
                            </div>
                            <span v-if="item.show">{{ item.freezeState == 1 ? "是" : "否" }}</span>
                        </td>
                        <td>
                            <el-tooltip effect="dark" content="添加" placement="top-start" :hide-after='1000'
                                        v-if="item.original&&!item.show">
                                <span @click="addDealMaterial(index)" class="add"></span>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000'
                                        v-if="!item.original&&!item.show">
                                <span @click="removeDealMaterial(index)" class="del"></span>
                            </el-tooltip>
                        </td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <td>合计：</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="red fw">{{ totalInfo.nums }}</td>
                        <td></td>
                        <td class="red fw">{{ totalInfo.boxNums }}</td>
                        <td class="red fw">{{ totalInfo.palletNums }}</td>
                        <td></td>
                        <td></td>
                        <td v-show="info.scanQrcode==1"></td>
                        <td class="red fw">{{ totalInfo.realNums }}</td>
                        <td class="red fw">{{ totalInfo.realBoxNums }}</td>
                        <td class="red fw">{{ totalInfo.realPalletNums }}</td>
                        <td></td>
                        <td></td>
                    </tr>
                    </tfoot>
                </table>
            </div>
            <!--            入库物料情况-->

            <!--            器具信息-->
            <h3 class="common-title mt_20"><span class="title-name">器具信息</span></h3>
            <div class="tableAuto">
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                    <tr>
                        <th width="200"><em>*</em>可回收器具</th>
                        <th width="280"><em>*</em>所属人</th>
                        <th width="280"><em>*</em>到货厂商</th>
                        <th width="120"><em>*</em>入库数量</th>
                        <th width="120"><em>*</em>实际入库数量</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in packMaterialList">
                        <td>{{ item.name }}</td>
                        <td>{{ item.srcTenantName }}</td>
                        <td>{{ item.useTenantName }}</td>
                        <td>{{ item.nums }}</td>
                        <td>
                            <el-input v-model="item.realNums" type="text" v-mydouble4val placeholder=""
                                    @input="$forceUpdate();" style="width: 100%"></el-input>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <!--            器具信息-->

            <!--            收入信息-->
            <h3 class="common-title mt_20">
                <span class="title-name">收入信息</span>
                <el-button class="fr" size="mini" type="primary" style="margin-top:6px;" @click="open()">选择收入</el-button>
            </h3>
            <div class="tableAuto">
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" ref="feeDetail">
                    <thead>
                    <tr>
                        <th width="100">序号</th>
                        <th width="120">费用类型</th>
                        <th width="120">费用项目名称</th>
                        <th width="100">单位</th>
                        <th width="100">不含税单价</th>
                        <th width="100">税率</th>
                        <th width="100">含税价</th>
                        <th width="100">数量</th>
                        <th width="100">不含税金额</th>
                        <th width="100">含税金额</th>
                        <th width="100">是否下次展示</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index)  in feeList">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.itemTypeName }}</td>
                        <td>{{ item.itemName }}</td>
                        <td>{{ item.unit }}</td>
                        <td>{{ item.price }}</td>
                        <td>{{ item.tax }}</td>
                        <td>{{ item.priceWithTax }}</td>
                        <td>
                            <el-input v-model="item.num" type="text" v-mydouble4val placeholder=""
                                    @input="calcFeeTotal(item)"></el-input>
                        </td>
                        <td>{{ item.totalFee }}</td>
                        <td>{{ item.totalFeeWithTax }}</td>
                        <td>
                            <el-switch v-model="item.isDefault == 1"
                                    @change="changeDefaultSwitch(item, index)"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    active-text="是"
                                    inactive-text="否">
                            </el-switch>
                        </td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <td>合计：</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="red fw">{{ totalInfo.num }}</td>
                        <td class="red fw">{{ totalInfo.totalFee }}</td>
                        <td class="red fw">{{ totalInfo.totalFeeWithTax }}</td>
                        <td></td>
                    </tr>
                    </tfoot>
                </table>
            </div>
            <!--            收入信息-->

            <!--            成本信息-->
            <h3 class="common-title mt_20"><span class="title-name">成本信息</span></h3>
            <div class="tableAuto">
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" ref="costDetail">
                    <thead>
                    <tr>
                        <th width="100">序号</th>
                        <th width="120">费用类型</th>
                        <th width="120">作业名称</th>
                        <th width="100">计费单位</th>
                        <th width="100">外包作业</th>
                        <th width="150">外包供应商</th>
                        <th width="100">未税单价</th>
                        <th width="100">税率(%)</th>
                        <th width="100">含税价</th>
                        <th width="100">数量</th>
                        <th width="100">未税金额</th>
                        <th width="100">含税金额</th>

                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index)  in costList">
                        <td>{{ index + 1 }}</td>
                        <td>{{ item.itemTypeName }}</td>
                        <td>{{ item.itemName }}</td>
                        <td>{{ item.unit }}</td>
                        <td>
                            <el-switch v-model="item.isWorkOrder == 1"
                                    @change="changeCostSwitch(item)"
                                    :disabled="item.disabled && item.flag"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    active-text="是"
                                    inactive-text="否">
                            </el-switch>
                        </td>
                        <td>
                            <el-select v-model="item.tenantId" placeholder="请选择供应商" filterable
                                    :disabled="item.disabled"
                                    @change="changeSupplier(item, index)">
                                <el-option v-for="supplier in item.supplierData" :key="supplier.tenantId"
                                        :label="supplier.tenantName"
                                        :value="supplier.tenantId"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-input v-model="item.price" type="text" disabled></el-input>
                        </td>
                        <td>
                            <el-input v-model="item.tax" type="text" disabled></el-input>
                        </td>
                        <td>
                            <el-input v-model="item.priceWithTax" type="text" disabled></el-input>
                        </td>
                        <td>
                            <el-input v-model="item.num" type="text" v-mydouble4val
                                    :placeholder="item.disabled ? '' : '请输入数量'"
                                    @input="calcCostTotal" :disabled="item.disabled"></el-input>
                        </td>
                        <td>
                            <el-input v-model="item.totalFee" type="text" disabled></el-input>
                        </td>
                        <td>
                            <el-input v-model="item.totalFeeWithTax" type="text" disabled></el-input>
                        </td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                        <td>合计：</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td class="red fw">{{ totalInfo.costNum }}</td>
                        <td class="red fw">{{ totalInfo.costTotalFee }}</td>
                        <td class="red fw">{{ totalInfo.costTotalFeeWithTax }}</td>
                    </tr>
                    </tfoot>
                </table>
            </div>
            <!--            成本信息-->

            <!--            入库附件-->
<!--            <h3 class="common-title mt_20"><span class="title-name">入库附件</span></h3>-->
<!--            <div class="uploadFile clearfix">-->
<!--                <div class="fl mr_20">-->
<!--                    <myFileModel ref="receiptsImg"></myFileModel>-->
<!--                    <p>只支持.jpg .png</p>-->
<!--                </div>-->
<!--            </div>-->
            <!--            入库附件-->

            <div class="bot-btn ">
                <el-button @click="closePage()">关闭</el-button>
                <el-button type="primary" @click="inOrderDeal()">确定入库</el-button>
            </div>
        </div>

        <!-- 标签详情 -->
        <tagTable :data="materialCodeList" :showTagBtn="false" v-show="showType==2" type="1"></tagTable>
        <tagTable :data="custQrcodeList" :head="custQrcodeHead" v-show="showType==3" :showTagBtn="false" type="1"></tagTable>


        <!--        计费项目操作-->
        <el-dialog class="operateDialog" title="计费项目操作" :visible.sync="isShowDialog" width="1200px">
            <div class="title">
                <div>不参与计费项目</div>
                <div>参与计费项目</div>
            </div>
            <dbTable ref="dbTable" :head="feeHead" onlyId="onlyId"></dbTable>
            <div class="bot-btn">
                <el-button @click="isShowDialog = false">关闭</el-button>
                <el-button type="primary" @click="saveChangeFeeItem">保存</el-button>
            </div>
        </el-dialog>
        <!--        计费项目操作-->

    </div>
</template>

<script>
import inOrderConfirm from './inOrderConfirm.js'

export default inOrderConfirm
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';

.warehousingDetailPage {
    position: relative;
    .fillTbale{
        .myFileModel{
            .avatar-uploader{
                .el-upload{
                    width:100%;
                    border:none;
                }
                .avatar-uploader-icon{
                    width: 100%;
                }
            }
        }
    }
    .tableAuto{
        overflow-x: auto;
    }
    .operateDialog {
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
    .common-title{
        .el-input__inner{
            height: 30px;
        }
        .el-input__icon{
            line-height: 30px;
        }
    }
    .tableCommon {
        border: $border;
    }

    .add {
        vertical-align: middle;
        @include add;
    }

    .del {
        vertical-align: middle;
        @include del;
    }

    .switchDiv {
        padding: 2px 8px;
        border: 1px solid $main-color;
        border-radius: 3px;
        color: $main-color;
        display: inline-block;
        margin-left: 10px;
        vertical-align: top;
        cursor: pointer;

        .name {
            vertical-align: middle;
            margin-left: 8px;
        }
    }
}

</style>
