<template>
    <div id="addDevicePurchase">
        <div class="common-info">
            <ul class="content clearfix">
                <li class="item">
                    <label class="label-term"><em>*</em>供应商名称</label>
                    <div class="input-text">
                        <el-select v-model="purchase.suppierTenantId" @change="changeSuppier" filterable clearable :disabled="isOnlySee" placeholder="供应商">
                            <el-option v-for="supplier in supplierData" :key="supplier.tenantId" :label="supplier.tenantName"
                                        :value="supplier.tenantId"></el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">地址</label>
                    <div class="input-text">
                        <el-input v-model="purchase.suppierAddress" :disabled="true"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">联系电话</label>
                    <div class="input-text">
                        <el-input v-model="purchase.suppierLinkPhone" :disabled="true"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">联系人</label>
                    <div class="input-text">
                        <el-input v-model="purchase.suppierLinkman" :disabled="true"></el-input>
                    </div>
                </li>
                <li class="item">
                  <label class="label-term">电子邮箱</label>
                  <div class="input-text">
                    <el-input v-model="purchase.suppierEmail" :disabled="true"></el-input>
                  </div>
                </li>
                <li class="item">
                    <label class="label-term">费用申请单号</label>
                    <div class="input-text">
                      <el-select v-model="purchase.applyIds" filterable clearable multiple collapse-tags :disabled="isOnlySee" placeholder="费用申请单号">
                        <el-option v-for="supplier in applyData" :key="supplier.id" :label="supplier.applyNum"
                                   :value="supplier.id"></el-option>
                      </el-select>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix">
                <li class="item">
                    <label class="label-term">开户名字</label>
                    <div class="input-text">
                        <el-input v-model="purchase.bankAccountName" :disabled="true"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">支行名称</label>
                    <div class="input-text">
                        <el-input v-model="purchase.bankSubName" :disabled="true"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">开户卡号</label>
                    <div class="input-text">
                        <el-input v-model="purchase.bankCard" :disabled="true"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>采购方</label>
                    <div class="input-text">
                        <el-select v-model="purchase.settleBody" @change="changeSettleBody" filterable clearable :disabled="isOnlySee" placeholder="采购方">
                            <el-option v-for="supplier in settleBodyData" :key="supplier.codeValue" :label="supplier.codeName"
                                        :value="supplier.codeValue"></el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">地址</label>
                    <div class="input-text">
                        <el-input v-model="purchase.address" :disabled="isOnlySee"></el-input>
                    </div>
                </li>
                <li class="item">
                  <!-- 需要关联采购方 -->
                    <label class="label-term">仓库</label>
                    <div class="input-text">
                      <el-select v-model="purchase.workId" @change="initDeliveryWork"  :disabled="isOnlySee"
                                 clearable filterable placeholder="请选择仓库">
                        <el-option v-for="item in storeHouseData" :key="item.workId" :label="item.workName"
                                   :value="item.workId">
                        </el-option>
                      </el-select>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">联系电话</label>
                    <div class="input-text">
                        <el-input v-model="purchase.linkBill" :disabled="isOnlySee"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">联系人</label>
                    <div class="input-text">
                        <el-input v-model="purchase.linkman" :disabled="isOnlySee"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">电子邮箱</label>
                    <div class="input-text">
                        <el-input v-model="purchase.email" :disabled="isOnlySee"></el-input>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix" style="padding-top:20px;border-top:1px dashed #eee;margin-top: 10px;"  >
                <li class="item">
                    <label class="label-term"><em>*</em>运输方式</label>
                    <div class="input-text">
                    <el-select v-model="purchase.transportMode" filterable clearable :disabled="isOnlySee" placeholder="运输方式">
                        <el-option v-for="supplier in transportModeData" :key="supplier.codeValue" :label="supplier.codeName"
                                :value="supplier.codeValue"></el-option>
                    </el-select>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">备货周期</label>
                    <div class="input-text">
                        <el-input  v-model="purchase.waitDay" :disabled="isOnlySee"  placeholder="请输入备货天数"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>预计发货/提货时间</label>
                    <div class="input-text">
                        <el-date-picker v-model="purchase.estimatedPickDate" :disabled="isOnlySee" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"></el-date-picker>
                    </div>
                </li>
            </ul>
            <div class="clearfix">
                <div class="specView fl">
                    <ul class="content clearfix">
                        <li class="item item100">
                            <label class="label-term">发货地/提货地信息</label>
                            <div class="input-text">
                                <el-input v-model="purchase.pickAddress" :disabled="isOnlySee" placeholder="请输入地址、联系人、联系人手机号"></el-input>
                            </div>
                        </li>
                    </ul>
                    <ul class="content clearfix">
                        <li class="item">
                            <label class="label-term"><em>*</em>使用客户</label>
                            <div class="input-text">
                            <el-select v-model="purchase.custTenantId" @change="changeCustTenant" :disabled="isOnlySee" filterable clearable placeholder="使用客户">
                                <el-option v-for="item in customerData" :key="item.tenantId" :label="item.tenantName"
                                        :value="item.tenantId"></el-option>
                            </el-select>
                            </div>
                        </li>
                        <li class="item">
                            <label class="label-term"><em>*</em>交付地</label>
                            <div class="input-text">
                                <el-select v-model="purchase.deliveryWorkId" @change="changeDeliveryWork" :disabled="isOnlySee"  filterable clearable placeholder="请选择交付地">
                                    <el-option v-for="item in deliveryWorkData" :key="item.workId" :label="item.workName"
                                                :value="item.workId"></el-option>
                                </el-select>
                            </div>
                        </li>
                    </ul>
                    <ul class="content clearfix">
                        <li class="item item100">
                            <label class="label-term">收货目的地</label>
                            <div class="input-text">
                            <el-input v-model="purchase.deliveryAddress" :disabled="isOnlySee"></el-input>
                            </div>
                        </li>
            <!--                <li class="item">-->
            <!--                    <label class="label-term">收货人</label>-->
            <!--                    <div class="input-text">-->
            <!--                        <el-input v-model="purchase.purchaseNums" :disabled="true"></el-input>-->
            <!--                    </div>-->
            <!--                </li>-->
                    </ul>
                </div>
                <ul class="content fl clearfix specContent">
                    
                    <li class="item item100">
                        <label class="label-term">付款方式</label>
                        <div class="input-text">
                            <el-input type="textarea" v-model="purchase.payRemark" :disabled="isOnlySee" placeholder="请输入付款方式"></el-input>
                        </div>
                    </li>
                </ul>

            </div>
            <h3 class="common-title mt_20"><span class="title-name">订单信息</span>
                <el-button class="fr" size="mini" @click="chooseContract" v-if="!isOnlySee">选择合同</el-button>
            </h3>
            <div class="table" ref="listTable">
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout:fixed;">
                    <thead>
                    <tr>
                        <th width="50">序号</th>
                        <th width="120">器具名称</th>
                        <th width="150">器具规格</th>
                        <th width="120">业务模式</th>
                        <th width="100">待采购数量</th>
                        <th width="100"><em>*</em>采购数量</th>
                        <th width="100"><em>*</em>计费单位</th>
                        <th width="100"><em>*</em>采购单价（含税）</th>
                        <th width="100">增值税</th>
                        <th width="100"><em>*</em>小计（含税）</th>
                        <th width="100">租赁期（月份）</th>
                        <th width="150">期望交期</th>
<!--                        <th width="150">付款方式</th>-->
                        <th width="200">备注</th>
                        <th width="100">器具图片</th>
                        <th width="50" v-if="!isOnlySee">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(data,index) in dtls" :key="index">
                        <td>{{ index+1 }}</td>
                        <td>
                            {{data.deviceName}}
                        </td>
                        <td>
                          {{data.spec}}
                        </td>
                        <td>
                          {{data.businessModeName}}
                        </td>
                        <td>
                          {{data.remainPurchaseNums}}
                        </td>
                        <td>
                            <el-input v-mynumval v-model="data.purchaseNums" @input="calcFee1(index)" :disabled="(isOnlySee&&modiPurchaseNums)||disablePurchaseNums" placeholder="采购数量"></el-input>
                        </td>
                        <td>
                            <el-select v-model="data.unit"  clearable filterable :disabled="isOnlySee" placeholder="计费单位">
                                <el-option v-for="item in unitData" :key="item.codeValue" :label="item.codeName"
                                        :value="item.codeValue"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <!-- 采购单价（含税） -->
                            <el-input v-mydouble4val v-model="data.priceWithTax" @input="calcFee1(index)" :disabled="isOnlySee"  placeholder="请输入"></el-input>
                        </td>
                        <td>
                            <!-- 增值税 -->
                            <el-input v-mydouble4val v-model="data.taxRate" :disabled="isOnlySee"   placeholder="请输入"></el-input>
                        </td>  
                        <td>
                            <!-- 小计（含税） -->
                            <el-input v-mydouble4val v-model="data.totalFeeWithTax" @input="calcFee2(index)" :disabled="isOnlySee"  placeholder="请输入"></el-input>
                        </td> 
                        <td>
                            <!-- 租赁期（月份） -->
                            <el-input v-mynumval v-model="data.validityPeriod" @input="forceUpdate" :disabled="isOnlySee"   placeholder="请输入"></el-input>
                        </td> 
                        <td>
                            <!-- 期望交期 -->
                            <el-date-picker v-model="data.hopeDate" type="date" placeholder="期望交期" :disabled="isOnlySee"  value-format="yyyy-MM-dd"></el-date-picker>
                        </td> 
<!--                        <td>-->
<!--                            &lt;!&ndash; 付款方式 &ndash;&gt;-->
<!--                            <el-input  v-model="data.payRemark" @input="forceUpdate" :disabled="isOnlySee"  placeholder="请输入"></el-input>-->
<!--                        </td> -->
                        <td>
                            <!-- 备注 -->
                            <el-input v-model="data.remark" @input="forceUpdate" :disabled="isOnlySee"  placeholder="请输入"></el-input>
                        </td> 
                        <td>
                            <myFileModel :ref="'file' + index" clickType="text" :componentId="index" :disabled="isOnlySee"  ></myFileModel>
                        </td> 
                        <td v-if="!isOnlySee">
                            <el-tooltip effect="dark" content="删除器具" placement="top-start"  :hide-after='1000'>
                                <span @click="remove(index)" class="del"></span>
                            </el-tooltip>
                        </td>
                    </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>合计:</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{{totalInfo.purchaseNums}}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{{totalInfo.totalFeeWithTax}}</td>
                            <td></td>   
                            <td></td>
<!--                            <td></td>-->
                            <td></td>
                            <td></td>
                            <td v-if="!isOnlySee"></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <ul class="content clearfix mt_20">
                <li class="item" style="width:100%">
                    <label class="label-term">订单备注</label>
                    <div class="input-text">
                        <el-input type="textarea" v-model="purchase.remark" @input="forceUpdate" :disabled="isOnlySee"  placeholder="请输入订单备注"></el-input>
                    </div>
                </li>
            </ul>
            <div class="page-bot-btn ">
                <el-button size="mini" @click="closePage">关闭</el-button>
                <el-button type="primary" size="mini" @click="saveDevPurchaseOrder()" v-if="!isOnlySee||!modiPurchaseNums">保存</el-button>
            </div>
        </div>
        <el-dialog class="operateDialog" title="选择合同" :visible.sync="isShowDialog" width="1000px" >
            <dbTable tableName="contractTable" ref="table" :head="contractHead" onlyId="devContractDeviceId"></dbTable>
            <div class="bot-btn">
                <el-button @click="isShowDialog = false">取消</el-button>
                <el-button type="primary" @click="selContractDtl" >保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import addDevicePurchase from './addDevicePurchase.js'

export default addDevicePurchase
</script>
<style lang="scss" scoped>
#addDevicePurchase {
    .el-select,.el-input{
        width: 100%;
    }
    .common-info{
        .item{
            width: 31.3333%;
            /deep/ .el-textarea__inner{
                width: 100%;
            }
        }
        .item100{
            width: 98%!important;
        }
        .specView{
            width: 66%;
            .item{
                width: 48%;
            }
        }
        .specContent{
            width:32.2%;
            margin-left:0.6%;
            .item{
                height: 140px;
            }
            .label-term{
                height: 140px;
            }
            /deep/ .el-textarea__inner{
                height: 140px;
            }
        }
    } 
    .table{
        border:$border;
        overflow: auto;
        .add{
            vertical-align: middle;
            @include add;
        }
        .del{
            vertical-align: middle;
            @include del;
        }
    }
}
</style>