<template>
    <div id="showSupplier" class="showSupplierPage">
        <div class="common-info" style="height: 100%;">
            <div class="clearfix">
                <div class="ipt-info fl">
                    <ul class="content clearfix">
                        <li class="item">
                            <label class="label-term"><em>*</em>供应商名称</label>
                            <div class="input-text">
                                <el-input v-model="supplier.supplierName" disabled placeholder="请填写供应商名称"></el-input>
                            </div>
                        </li>
                        <li class="item">
                          <label class="label-term"><em>*</em>供应商简称</label>
                          <div class="input-text">
                            <el-input v-model="supplier.abbreviationName" disabled maxlength="5" placeholder="请填写供应商简称"></el-input>
                          </div>
                        </li>
                        <li class="item">
                            <label class="label-term">地址</label>
                            <div class="input-text">
                                <el-input v-model="supplier.address" disabled placeholder="请填写供应商地址"></el-input>
                            </div>
                        </li>
                        <li class="item">
                            <label class="label-term"><em>*</em>供应商类型</label>
                            <div class="input-text">
                                <el-select v-model="supplier.supplierType" disabled clearable filterable placeholder="请选择供应商类型">
                                    <el-option v-for="item in supplierTypeData" :key="item.codeValue"
                                               :label="item.codeName"
                                               :value="item.codeValue">
                                    </el-option>
                                </el-select>
                            </div>
                        </li>
                        <li class="item">
                            <label class="label-term"><em>*</em>主营业务</label>
                            <div class="input-text">
                                <el-select v-model="supplier.mainBusiness" disabled clearable filterable placeholder="请选择主营业务">
                                    <el-option v-for="item in mainBusinessData" :key="item.codeValue"
                                               :label="item.codeName"
                                               :value="item.codeValue">
                                    </el-option>
                                </el-select>
                            </div>
                        </li>
                        <li class="item">
                            <label class="label-term"><em>*</em>{{ supplier.credentialNumberTitle }}</label>
                            <div class="input-text">
                                <el-input v-model="supplier.credentialNumber" disabled :placeholder="'请填写' + supplier.credentialNumberTitle"></el-input>
                            </div>
                        </li>
                        <li class="item">
                            <label class="label-term"><em>*</em>是否开票</label>
                            <div class="input-text">
                                <el-select v-model="supplier.invoiceFlg" disabled clearable filterable placeholder="请选择是否开票">
                                    <el-option v-for="item in invoiceFlgData" :key="item.codeValue"
                                               :label="item.codeName"
                                               :value="item.codeValue">
                                    </el-option>
                                </el-select>
                            </div>
                        </li>
                        <li class="item">
                            <label class="label-term"><em>*</em>供应商联系人</label>
                            <div class="input-text">
                                <el-input v-model="supplier.linkman" disabled placeholder="请填写供应商联系人"></el-input>
                            </div>
                        </li>
                        <li class="item">
                            <label class="label-term">登录手机号</label>
                            <div class="input-text">
                                <el-input v-model="supplier.linkPhone" disabled
                                          v-mynumval placeholder="请填写登录手机号"></el-input>
                            </div>
                        </li>
                        <li class="item">
                            <label class="label-term">Email</label>
                            <div class="input-text">
                                <el-input v-model="supplier.email" disabled v-mynumval placeholder="Email"></el-input>
                            </div>
                        </li>
<!--                    </ul>-->
<!--                    <ul class="content clearfix">-->
                        <li class="item">
                            <label class="label-term">运输票面税点</label>
                            <div class="input-text">
                                <el-input v-model="supplier.taxRate" disabled v-mypmdouble4val placeholder="请填写运输票面税点"></el-input>
                            </div>
                        </li>
                        <li class="item">
                            <label class="label-term">装卸票面税点</label>
                            <div class="input-text">
                                <el-input v-model="supplier.loadTaxRate" disabled v-mypmdouble4val placeholder="请填写装卸票面税点"></el-input>
                            </div>
                        </li>
                        <li class="item">
                          <label class="label-term">账期(天)</label>
                          <div class="input-text">
                            <el-input v-model="supplier.accountPeriod" disabled v-mynumval placeholder="请填写账期(天)"></el-input>
                          </div>
                        </li>
                      <li class="item">
                        <label class="label-term"><em>*</em>可服务区域</label>
                        <div class="input-text">
                          <el-select v-model="supplier.serviceAreas" disabled multiple clearable filterable placeholder="请选择可服务区域">
                            <el-option v-for="item in serviceAreasData" :key="item.codeValue"
                                       :label="item.codeName"
                                       :value="item.codeValue">
                            </el-option>
                          </el-select>
                        </div>
                      </li>
<!--                      <li class="item">-->
<!--                        <label class="label-term">-->
<!--                          关联主体-->
<!--                          <el-tooltip effect="dark" content="子公司之间结算关联主体用，每个主体只能关联一次！" placement="top">-->
<!--                            <i class="el-icon-question"></i>-->
<!--                          </el-tooltip>-->
<!--                        </label>-->
<!--                        <div class="input-text">-->
<!--                          <el-select v-model="supplier.settleBody" disabled clearable filterable placeholder="请选择">-->
<!--                            <el-option-->
<!--                                v-for="item in settleBodyData"-->
<!--                                :key="item.codeValue"-->
<!--                                :label="item.codeName"-->
<!--                                :value="item.codeValue">-->
<!--                            </el-option>-->
<!--                          </el-select>-->
<!--                        </div>-->
<!--                      </li>-->
<!--                        <li class="item">-->
<!--                            <label class="label-term"><em>*</em>是否仓储供应商</label>-->
<!--                            <div class="input-text">-->
<!--                                <el-select v-model="supplier.isStorehouseSupplier" disabled clearable placeholder="请选择是否仓储供应商">-->
<!--                                    <el-option v-for="item in whetherOptions"-->
<!--                                               :key="item.codeValue"-->
<!--                                               :label="item.codeName"-->
<!--                                               :value="item.codeValue">-->
<!--                                    </el-option>-->
<!--                                </el-select>-->
<!--                            </div>-->
<!--                        </li>-->
<!--                        -->
                        <li class="item item100">
                            <label class="label-term">服务物流中心</label>
                            <div class="input-text">
                                <el-select v-model="supplier.workIds" disabled multiple placeholder="请选择是否仓储供应商">
                                    <el-option v-for="item in workList" :key="item.workId"
                                               :label="item.workName" :value="item.workId"></el-option>
                                </el-select>
                            </div>
                        </li>

                        <li class="item item100">
                            <label class="label-term">备注</label>
                            <div class="input-text">
                                <el-input v-model="supplier.remark" disabled type="textarea" maxlength="200" placeholder="说点什么..."></el-input>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="upload-info fr">
                    <div class="label-term">营业执照</div>
                    <myFileModel ref="businessLicense" :disabled-del="true" :disabled-edit="true"></myFileModel>
                    <div><em>只能上传jpg/png文件，且不超过5000kb</em></div>
                </div>
            </div>
            <div class="bot-btn">
                <el-button @click="close()">关闭</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import showSupplier from './showSupplier.js'
export default showSupplier
</script>


<style lang="scss">
.showSupplierPage {
    .common-info
    {
        .content > .item .label-term {
            float: left;
            width: 100px;
            height: 40px;
            padding-right: 10px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            display: -webkit-flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: end;
            -ms-flex-pack: end;
            justify-content: flex-end;
            text-align: right;
        }
        .content > .item .input-text {
            float: left;
            width: calc(100% - 110px);
            line-height: 40px;
            position: relative;
        }
        .ipt-info {
            width: calc(100% - 270px);
            .item {
                width: 48%;
            }
            .item100 {
                width: 98%;
            }
            .el-textarea__inner {
                width: 100%;
            }
        }

        .upload-info {
            width: 250px;
            .label-term {
                line-height: 40px;
            }
            .myFileModel .avatar-uploader {
                .el-upload {
                    width: 250px;
                    height: 250px;
                }
                .avatar-uploader-icon {
                    width: 250px;
                    height: 250px;
                    line-height: 250px;
                    font-size: 70px;
                }
            }
        }
    }
}
</style>
