<template>
    <div id="addPurOrder" style="height: 100%">
<!--        选择数据-->
        <div style="height:100%;" v-show="step == 1">
            <searchList :formData="formData" @doQuery="doQuery" :query="query" @clearFn="initQuery" searchKey="purPurchaseSearch"></searchList>
            <div class="table-content">
                <div class="table-title">
                    <h3>
                        <span>采购明细列表</span>
                    </h3>
                    <div class="table-title-btn"  style="margin-right: 90px;">
                        <el-button type="primary" plain size="mini" @click="next">下一步</el-button>
                    </div>
                </div>
                <dbTable tableName="purPurchaseTable" ref="table" :head="head" showSetTable="true"
                         @dataChange="dataChange" @filter="filter" :isFilter="isFilter"
                         onlyId="applyDtlId"></dbTable>
            </div>
        </div>
<!--        详情-->
        <div class="common-info flex" v-show="step == 2">
            <div class="baseInfo">
                <div class="baseItem" style="margin-right:20px;">
                <h3 class="common-title"><span class="title-name">采购方资料</span></h3>
                <ul class="content clearfix mt_20">
                  <li class="item item100">
                    <label class="label-term">采购方名称</label>
                    <div class="input-text">
                      <el-select v-model="info.settleBody" placeholder="请选择" @change="changeSettleBody"
                                 :disabled="isOnlySee" filterable clearable >
                        <el-option v-for="item in settleBodyData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                      </el-select>
                    </div>
                  </li>
                  <li class="item item100">
                    <label class="label-term">公司地址</label>
                    <div class="input-text">
                        <el-input v-model="info.companyAddress" disabled></el-input>
                    </div>
                  </li>
                  <li class="item item100">
                    <label class="label-term">采购员</label>
                    <div class="input-text">
                      <el-select v-model="info.purchaseUserId" placeholder="请选择"
                                 :disabled="isOnlySee" filterable clearable >
                        <el-option v-for="item in userData" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
                      </el-select>
                    </div>
                  </li>
                  <li class="item item100">
                    <label class="label-term">采购员名称</label>
                    <div class="input-text">
                      <el-input v-model="info.purchaseLinkman" :disabled="isOnlySee"  placeholder="请输入"></el-input>
                    </div>
                  </li>
                  <li class="item item100">
                    <label class="label-term">采购员电话</label>
                    <div class="input-text">
                      <el-input v-model="info.purchaseBillId" :disabled="isOnlySee"  placeholder="请输入"></el-input>
                    </div>
                  </li>
                  <li class="item item100">
                    <label class="label-term">采购员电子邮箱</label>
                    <div class="input-text">
                      <el-input v-model="info.purchaseEmail" :disabled="isOnlySee"  placeholder="请输入"></el-input>
                    </div>
                  </li>
                  <li class="item item100">
                    <label class="label-term">采购时间</label>
                    <div class="input-text">
                      <el-date-picker v-model="info.purchaseDate"
                                      :disabled="isOnlySee" type="date" class="tl" placeholder="默认当前日期"
                                      value-format="yyyy-MM-dd"></el-date-picker>
                    </div>
                  </li>
<!--                    <li class="item item100">-->
<!--                        <label class="label-term">采购类型</label>-->
<!--                        <div class="input-text">-->
<!--                            <el-input v-model="info.purchaseTypeName" disabled></el-input>-->
<!--                        </div>-->
<!--                    </li>-->
                    <li class="item item100" v-show="id > 0">
                        <label class="label-term">采购单号</label>
                        <div class="input-text">
                            <el-input v-model="info.purchaseNum" disabled></el-input>
                        </div>
                    </li>
                </ul>
              </div>
                <div class="baseItem" >
                    <h3 class="common-title"><span class="title-name">供应商资料</span></h3>                    
                    <ul class="content clearfix mt_20">
                        <li class="item item100">
                            <label class="label-term">供应商名称</label>
                            <div class="input-text">
                              <el-select v-model="info.tenantId" @input="$forceUpdate"
                                         @change="changeSupplier" placeholder="请选择"
                                         filterable clearable :disabled="isOnlySee" >
                                <el-option v-for="item in supplierData" :key="item.tenantId" :label="item.supplierName"
                                           :value="item.tenantId"></el-option>
                              </el-select>
<!--                              {{ info.tenantName }}-->
                            </div>
                        </li>
                        <li class="item item100">
                            <label class="label-term">供应商地址</label>
                            <div class="input-text">{{ info.tenantAddress }}</div>
                        </li>
                        <li class="item item100">
                            <label class="label-term">联系人</label>
                            <div class="input-text">{{ info.tenantLinkman }}</div>
                        </li>
                        <li class="item item100">
                            <label class="label-term">联系人电话</label>
                            <div class="input-text">{{ info.tenantLinkPhone }}</div>
                        </li>
                        <li class="item item100">
                            <label class="label-term">联系人电子邮箱</label>
                            <div class="input-text">{{ info.tenantEmail }}</div>
                        </li>
                        <li class="item item100">
                            <label class="label-term">银行卡账号</label>
                            <div class="input-text">
                                <el-select v-model="info.bankCard" @change="changeBankCard"
                                           :disabled="isOnlySee" filterable clearable placeholder="请选择" >
                                    <el-option v-for="item in bankCardData" :key="item.bankCard" :label="item.bankCard" :value="item.bankCard"></el-option>
                                </el-select>
                            </div>
                        </li>
                        <li class="item item100">
                            <label class="label-term">户名</label>
                            <div class="input-text">
                                <el-input v-model="info.bankAccountName" disabled></el-input>
                            </div>
                        </li>
                        <li class="item item100">
                            <label class="label-term">开户行</label>
                            <div class="input-text">
                                <el-input v-model="info.bankDeposit" disabled></el-input>
                            </div>
                        </li>
                    </ul>
                </div>

            </div>
            <div class="otherInfo">
                <h3 class="common-title"><span class="title-name">其他信息</span></h3>
                <div class="inner mt_20">   
                    <ul class="content clearfix">
                        <li class="item item100">
                            <label class="label-term">运输方式</label>
                            <div class="input-text">              
                                <el-select v-model="info.transportMode" placeholder="请选择"
                                           :disabled="isOnlySee" filterable clearable >
                                    <el-option v-for="item in transportModeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                                </el-select>
                            </div>
                        </li>
                        <li class="item item100">
                            <label class="label-term">发货地/提货点信息</label>
                            <div class="input-text">
                                <el-input v-model="info.deliverInfo" :disabled="isOnlySee" placeholder="请输入地址、联系人、联系人电话"></el-input>
                            </div>
                        </li>
                        <li class="item item100">
                            <label class="label-term">预计发货/提货时间</label>
                            <div class="input-text">
                                <el-date-picker v-model="info.deliverDate" type="date" class="tl"
                                                :disabled="isOnlySee" value-format="yyyy-MM-dd"></el-date-picker>
                            </div>
                        </li>
<!--                        客户  交付地-->
                        <li class="item item100">
                            <label class="label-term">使用客户</label>
                            <div class="input-text">
                                <el-select v-model="info.custTenantId" @change="changeCustTenant"
                                           :disabled="isOnlySee" filterable clearable placeholder="使用客户">
                                    <el-option v-for="item in customerData" :key="item.tenantId" :label="item.tenantName"
                                               :value="item.tenantId"></el-option>
                                </el-select>
                            </div>
                        </li>
                        <li class="item item100">
                            <label class="label-term"><em>*</em>交付地</label>
                            <div class="input-text">
                                <el-select v-model="info.deliveryWorkId" @change="changeDeliveryWork"
                                           :disabled="isOnlySee"  filterable clearable placeholder="请选择交付地">
                                    <el-option v-for="item in deliveryWorkData" :key="item.workId" :label="item.workName"
                                               :value="item.workId"></el-option>
                                </el-select>
                            </div>
                        </li>
                        <li class="item item100">
                            <label class="label-term">收货地及收货人信息</label>
                            <div class="input-text">
                                <el-input v-model="info.receiptInfo"  :disabled="isOnlySee" ></el-input>
                            </div>
                        </li>
                    </ul>
                    <ul class="content clearfix">
                        <li class="item item100">
                          <label class="label-term">是否预付
                            <el-tooltip effect="light" placement="top-start">
                              <div slot="content">如果选择是，审核人增加黄总、何总以及高总，且此采购单审核通过后，就会直接生成费用清单。</div>
                              <i class="el-icon-question pointer" style="color: red;"></i>
                            </el-tooltip>
                          </label>
                          <div class="input-text">
                            <el-switch v-model="info.isPrepay == 1" @change="changeInfoSwitch()"
                                       :disabled="isOnlySee" active-color="#13ce66" inactive-color="#ff4949"/>
                            <span class="name">{{ info.isPrepay == 1 ? "是" : "否" }}</span>
                          </div>
                        </li>
                        <li class="item item100">
                            <label class="label-term">备注</label>
                            <div class="input-text">
                                <el-input type="textarea" v-model="info.remark" :disabled="isOnlySee" placeholder="请输入备注"></el-input>
                            </div>
                        </li>
                    </ul>
                </div>                
            </div>
            
            <div class="tableDetail">
                <h3 class="common-title">
                    <span class="title-name">采购单明细</span>
                    <el-tooltip v-show="type == 1 || type == 2" effect="dark" content="重新选择采购单明细" placement="top-start" :hide-after='1000'>
                        <img src="@/static/image/edit.png" class="edit_icon" style="position: absolute;top: 0;right: 5px;width: 35px;cursor: pointer;" alt="" @click="back">
                    </el-tooltip>
                </h3>
                <div class="clearfix" style="display: flex;">
                    <table class="tableCommon" id="strechFixTable" border="0" cellspacing="0" cellpadding="0">
                        <thead>
                            <tr>
                                <th width="60">序号</th>
                                <th width="120">费用类型</th>
                                <th width="120">品名/项目</th>
                                <th width="120">规格型号</th>
                                <th width="120">是否资产管理</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in dtlList">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.feeSubTypeName }}</td>
                                <td>{{ item.projectName }}</td>
                                <td>{{ item.specification }}</td>
                                <td>{{ item.isAssetName }}</td>
                            </tr>
                            <tr>
                                <td>合计</td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                    <el-scrollbar class="scrollView" style="flex:1;">
                        <table class="tableCommon" id="strechTable" width="100%" border="0" cellspacing="0" cellpadding="0">
                            <thead>
                                <tr>
                                    <!-- <th width="60">序号</th>
                                    <th width="150">费用类型</th> -->
    <!--                                <th width="150">采购类型</th>-->
                                    <!-- <th width="150">品名/项目</th>
                                    <th width="150">规格型号</th> -->
                                    <th width="80">数量单位</th>
                                    <th width="150">需求部门</th>
                                    <th width="80">需求数量</th>
                                    <th width="80">已采购数量</th>
                                    <th width="80">核销数量</th>
                                    <th width="80"><em>*</em>采购数量</th>
                                    <th width="120">付款类型</th>
                                    <th width="150">租赁/分期/折旧月份数</th>
                                    <th width="180">器具合同</th>
                                    <th width="80"><em>*</em>增值税</th>
                                    <th width="120">参考含税单价</th>
                                    <th width="150"><em>*</em>实际采购含税单价</th>
                                    <th width="120"><em>*</em>含税金额</th>
                                    <th width="150">付款条件</th>
                                    <th width="100">备货周期</th>
                                    <th width="100">期望交期</th>
                                    <th width="100">品名/项目附件</th>
                                    <th width="200">品名/项目备注</th>
                                    <th width="150">费用申请单号</th>
                                    <th width="250">备注</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in dtlList">
                                    <!-- <td>{{ index + 1 }}</td>
                                    <td>{{ item.feeSubTypeName }}</td> -->
    <!--                                <td>{{ item.purchaseTypeName }}</td>-->
                                    <!-- <td>{{ item.projectName }}</td>
                                    <td>{{ item.specification }}</td> -->
                                    <td>{{ item.unit }}</td>
                                    <td>{{ item.applyUserOrgName }}</td>
                                    <td>{{ item.demandNums }}</td>
                                    <td>{{ item.srcPurchaseNums }}</td>
                                    <td>{{ item.writeOffNums }}</td>
                                    <td>
                                        <el-input v-model="item.purchaseNum" v-mydoubleval :disabled="isOnlySee"
                                                @input="calcTotalFee(item)" maxlength="10" placeholder="采购数量"></el-input>
                                    </td>
                                    <td>
                                        <el-select v-model="item.payType" @change="forceUpdate" placeholder="请选择"
                                                    filterable clearable :disabled="isOnlySee" >
                                            <el-option v-for="item in payTypeData" :key="item.codeValue" :label="item.codeName"
                                                    :value="item.codeValue"></el-option>
                                        </el-select>
                                    </td>
                                    <td>
                                        <el-input v-model="item.depreciationMonthCount" v-mynumval :disabled="isOnlySee"
                                                  placeholder="租赁/分期/折旧月份数"></el-input>
                                    </td>
                                  <td>
                                    <el-select v-model="item.devContractDeviceDtlId" @change="changeDevContract(item)" placeholder="请选择"
                                               filterable clearable :disabled="isOnlySee||item.feeType!=26" >
                                      <el-option v-for="subItem in item.contractDeviceData" :key="subItem.devContractDeviceDtlId" :label="subItem.devContractNum"
                                                 :value="subItem.devContractDeviceDtlId">
                                        <span style="float: left">{{subItem.devContractNum }}</span>
                                        <span style="float: right; color: #8492a6; font-size: 13px">{{subItem.businessModeName}}</span>
                                      </el-option>
                                    </el-select>
                                  </td>
                                    <td>
                                        <el-input v-model="item.addValueTax" v-mydoubleval :disabled="isOnlySee" @input="forceUpdate"
                                                maxlength="10" placeholder="增值税"></el-input>
                                    </td>
                                    <td>{{ item.referPrice }}</td>
                                    <td>
                                        <el-input v-model="item.actualPrice" v-mydouble4val :disabled="isOnlySee"
                                                @input="calcTotalFee(item)" maxlength="10" placeholder="实际采购含税单价"></el-input>
                                    </td>
                                    <td>{{ item.totalFee }}</td>
                                    <td>{{ item.payCondition }}</td>
                                    <td><el-input v-model="item.stockingCycle" :disabled="isOnlySee"
                                                  placeholder="备货周期"></el-input>
                                    </td>
                                    <td>{{ item.expectDate }}</td>
                                    <td>
                                        <span v-for="(file, fileIndex) in item.fileArray" @click="showBigImg(file)">
                                            <a href="javascript:void(0);" class="link mr_10">附件{{ fileIndex + 1 }}</a>
                                        </span>
                                    </td>
                                    <td>{{ item.projectRemark }}</td>
                                    <td><a href="javascript:void(0);" class="link mr_10" @click="toDetail(item.applyId)">{{ item.applyNum }}</a></td>
                                    <td>
                                        <el-input v-model="item.remark" type="text" :disabled="isOnlySee"  maxlength="100" placeholder="备注"></el-input>
                                    </td>
                                </tr>
                                <tr>
                                    <!-- <td>合计</td>
                                    <td></td> -->
    <!--                                <td></td>-->
                                    <!-- <td></td>
                                    <td></td> -->
                                    <td></td>
                                    <td></td>
                                    <td class="red fw">{{totalInfo.demandNums}}</td>
                                    <td class="red fw">{{totalInfo.srcPurchaseNums}}</td>
                                    <td class="red fw">{{totalInfo.writeOffNums}}</td>
                                    <td class="red fw">{{totalInfo.purchaseNum}}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td class="red fw">{{totalInfo.totalFee}}</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </el-scrollbar>
                </div>
            </div>

            <div class="fileInfo">
                <h3 class="common-title"><span class="title-name">附件</span></h3>
                <div class="uploadFile clearfix">
                    <div class="fl mr_20"  v-for="(item,index) in fileList">
                        <myFileModel class="fl"
                                     :ref="'file'+index" :componentId="index"
                                     supportFiles="file"
                                     :disabledEdit="disabledEdit" :disabledDel="disabledDel"
                                     @successCallback="successCallback"
                                     @delCallback="delCallback">
                        </myFileModel>
                    </div>
                    <div class="form fr" style="margin-top: 60px;">
                        <em>*</em>部门审核人：
                        <el-select v-model="info.currentApplyUser" placeholder="请选择部门审核人"
                                   :disabled="isOnlySee" filterable clearable>
                            <el-option v-for="item in orgUserData" :key="item.userId" :label="item.userName" :value="item.userId"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>

            <div class="otherInfo" v-show="type == 3">
                <h3 class="common-title"><span class="title-name">审核信息</span></h3>
                <div class="inner mt_20">
                    <ul class="content clearfix">
                        <li class="item item100">
                            <label class="label-term">审核意见</label>
                            <div class="input-text">
                                <el-input v-model="info.verifyRemark" :disabled="isOnlySee && type == 0" placeholder="请输入审核意见"></el-input>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>

          <div class="otherInfo" v-show="type == 0">
            <h3 class="common-title"><span class="title-name">审核信息</span></h3>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
              <thead>
              <tr>
                <th>审核部门</th>
                <th>审核意见</th>
                <th>审核人</th>
                <th>审核日期</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in userList">
                <td>{{item.orgName}}</td>
                <td>{{item.verifyRemark}}</td>
                <td>{{item.verifyUserName}}</td>
                <td>{{item.verifyDate}}</td>
              </tr>
              </tbody>
            </table>
          </div>
            <div class="bot-btn">
                <el-button @click="closePage">关闭</el-button>
                <el-button v-show="type == 1 || type == 2" @click="back">上一步</el-button>
                <el-button v-show="type == 1 || type == 2" type="primary" @click="save">确认</el-button>
                <el-button v-show="type == 3" type="danger" @click="verify(2)">审核不通过</el-button>
                <el-button v-show="type == 3" type="primary" @click="verify(1)">审核通过</el-button>
            </div>
        </div>

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

    </div>
</template>

<script>
import addPurOrder from './addPurOrder.js'
export default addPurOrder
</script>

<style lang="scss" scoped>
#addPurOrder{
    /deep/ .common-info{
        .common-title{
            border-bottom: $border;
        }
        .content{
            padding-right: 20px;
            .item{
                margin-bottom: 5px;
                .label-term{
                    width: 110px!important;
                    height: 35px;
                }
                .input-text{
                    line-height: 35px;
                    .el-input__inner{
                        height: 35px;
                        line-height: 35px;
                    }
                    .el-input__icon{
                        line-height: 35px;
                    }
                    .el-textarea__inner{
                        height: 115px;
                    }
                }
            }
        }
        .baseInfo{
            display: flex;
            .baseItem{
                flex:1;
                border:$border;
            }
        }
        .otherInfo{
            border: $border;
            margin-top: 20px;
            .inner{
                display: flex;
                padding-left: 20px;
                .content{
                    flex: 1;
                }
            }
        }
        .tableDetail{
            margin-top: 20px;
            border:$border;
            .scrollView{
                flex: 1;
                border-left: $border;
                box-sizing: border-box;
                .el-scrollbar__wrap{
                    overflow-x: hidden;
                }
                .el-input__inner{
                    text-align: center;
                }
            }
        }
        .fileInfo{
            margin-top: 20px;
            border:$border;
        }
        .uploadFile{
            padding: 20px;
            p{
                text-align: center;
            }
            .imgList{
                img{
                width:110px;
                height: 110px;
                border-radius: 5px;
                overflow: hidden;
                float: left;
                margin-left: 20px;
                }
            }
        }
    }
}
</style>
