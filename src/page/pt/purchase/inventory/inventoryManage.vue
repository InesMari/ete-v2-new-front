<template>
    <div id="inventoryManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="inventoryManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>库存列表<em>（--双击序号查看详情--）</em></span>
                    <el-tooltip effect="light" content="库存列表列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
<!--                  <el-button type="primary" plain size="mini" v-entity="1014030" @click="allocate(true)">调拨</el-button>-->
                  <el-button type="primary" plain size="mini" v-entity="1014076" @click="consuming(false)">一键领用所有</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014031" @click="consuming(true)">领用</el-button>
<!--                  <el-button type="primary" plain size="mini" v-entity="1014032" @click="outbound(true)">出库</el-button>-->
                </div>
            </div>
            <tableCommon tableName="purchaseInventoryManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :single-select="false" @dblclickItem="dblclickItem">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" class="link"  v-for="(data,index) in item.fileList" @click.stop="showImg(data)" v-if="code=='baseId'">{{index>0?',图片'+ (index + 1):'图片1'}}</a>
                    <a href="javascript:void(0);" class="link" @click.stop="showImg(item)" v-if="code=='url'">查看</a>
                    <a href="javascript:void(0);" class="link" @click.stop="toPurOrder(item)" v-if="code=='purchaseNum'">{{item[code]}}</a>
                    <a href="javascript:void(0);" class="link" @click.stop="toContract(item)" v-if="code=='contractNum'">{{item[code]}}</a>
                    <a href="javascript:void(0);" class="link" @click.stop="toConsuming(item)" v-if="code=='freezeNums'">{{item[code]}}</a>
                </template>
            </tableCommon>
        </div>
        
        <!-- 调拨 begin-->
        <el-dialog title="调拨" :visible.sync="allocateDialogShow" width="800px" :close-on-click-modal="false"
                   :close-on-press-escape="false">
            <div class="common-info flex" style="border:none;padding:0;">
                <div style="margin-bottom:20px;font-weight:bold;padding-left:20px;"><em>注：调拨之后会更新物品库存</em></div>
                <ul class="content text clearfix">
                    <li class="item item50">
                        <label class="label-term">库存地：</label>
                        <div class="input-text">{{ allocateInfo.workName }}</div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">物品种类：</label>
                        <div class="input-text">{{ allocateInfo.feeSubTypeName }}</div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">品名：</label>
                        <div class="input-text">{{ allocateInfo.projectName }}</div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">规格型号：</label>
                        <div class="input-text">{{ allocateInfo.specification }}</div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">数量单位：</label>
                        <div class="input-text">{{ allocateInfo.unit }}</div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">结算主体：</label>
                        <div class="input-text">{{ allocateInfo.settleBodyName }}</div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">残值：</label>
                        <div class="input-text">{{ allocateInfo.scrapFee }}</div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">使用客户：</label>
                        <div class="input-text">{{ allocateInfo.tenantName }}</div>
                    </li>
                </ul>
                <h3 class="common-title mt_20"><span class="title-name">调入地</span></h3>
                <ul class="content clearfix mt_20">
                    <li class="item item50">
                        <label class="label-term">费用申请单号</label>
                        <div class="input-text">
                            <el-select v-model="allocateInfo.applyDtlId" placeholder="费用申请单单号"
                                       @change="changeApply" filterable clearable>
                                <el-option v-for="item in feeApplyData" :key="item.applyDtlId" :label="item.applyNum"
                                            :value="item.applyDtlId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>调拨数量</label>
                        <div class="input-text">
                            <el-input v-model="allocateInfo.allocateNum" @input="forceUpdate" v-mydoubleval></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">使用客户</label>
                        <div class="input-text">
                            <el-select v-model="allocateInfo.custTenantId" placeholder="使用客户"
                                       @change="changeCustTenant" filterable clearable>
                                <el-option v-for="item in customerData" :key="item.tenantId" :label="item.tenantName"
                                           :value="item.tenantId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>库存地</label>
                        <div class="input-text">
                            <el-select v-model="allocateInfo.allocateWorkId"
                                        @change="changeAllocateWorkId" filterable clearable placeholder="请选择库存地">
                                <el-option v-for="item in deliveryWorkData" :key="item.workId" :label="item.workName"
                                           :value="item.workId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>开始计费日期</label>
                        <div class="input-text">                            
                            <el-date-picker v-model="allocateInfo.chargeDate" type="date" placeholder="请选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>调入部门</label>
                        <div class="input-text">
                            <el-select v-model="allocateInfo.orgId" placeholder="调入部门" filterable clearable>
                                <el-option v-for="item in orgData" :key="item.id" :label="item.orgName" :value="item.id"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>结算主体</label>
                        <div class="input-text">
                            <el-select v-model="allocateInfo.settleBody" placeholder="请选择"
                                        filterable clearable >
                                <el-option v-for="item in settleBodyData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">备注</label>
                        <div class="input-text">
                            <el-input v-model="allocateInfo.remark"></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="openAllocateDialogShow(false)">取消</el-button>
                    <el-button type="primary" size="mini" @click="savePurAllocate()">确认</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 调拨 end-->
        
        <!-- 领用 begin-->
        <el-dialog :title="singleConsuming ? '领用' : '一键领用所有'" :visible.sync="consumingDialogShow" :width="singleConsuming ? '600px' : '80%'" :close-on-click-modal="false"
                   :close-on-press-escape="false">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term">物品种类：</label>
                        <div class="input-text">{{ consumingInfo.feeSubTypeName }}</div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">品名：</label>
                        <div class="input-text">{{ consumingInfo.projectName }}</div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">规格型号：</label>
                        <div class="input-text">{{ consumingInfo.specification }}</div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">库存地：</label>
                        <div class="input-text">{{ consumingInfo.workName }}</div>
                    </li>
                    <li class="item item100">
                      <label class="label-term">库存数量：</label>
                      <div class="input-text">{{ consumingInfo.nums }}</div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">领用数量：</label>
                        <div class="input-text">
                            <el-input v-model="consumingInfo.num" :disabled="!singleConsuming"
                                      @input="forceUpdate" maxlength="30" v-mydoubleval ></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">固定资产编号{{singleConsuming ? '' : '(多个使用,隔开)'}}：</label>
                        <div class="input-text">
                            <el-input v-model="consumingInfo.assetsNum"
                                      @input="forceUpdate" maxlength="100" show-word-limit></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term" style="height:40px;"><em>*</em>领用部门：</label>
                        <div class="input-text">
                            <el-select v-model="consumingInfo.orgId" placeholder="领用部门" @change="changeOrg" filterable clearable>
                                <el-option v-for="item in orgData" :key="item.id" :label="item.orgName" :value="item.id"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term" style="height:40px;"><em>*</em>领用人员：</label>
                        <div class="input-text">
                            <el-select v-model="consumingInfo.userId" placeholder="领用人员" @change="forceUpdate" filterable clearable allow-create="true">
                                <el-option v-for="item in staffData" :key="item.userId" :label="item.staffName"
                                           :value="item.userId" :disabled="item.disabled"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                      <label class="label-term">领用备注：</label>
                      <div class="input-text">
                        <el-input v-model="consumingInfo.useRemark"  @input="forceUpdate" maxlength="200" show-word-limit></el-input>
                      </div>
                    </li>
                    <li class="item item100" v-show="singleConsuming">
                        <label class="label-term">上传固定资产标识卡：</label>
                        <div class="input-text">
                            <myFileModel ref="file" @successCallback="successCallback" @delCallback="delCallback" ></myFileModel>
                            <p>只支持.jpg .png .pdf .xls .xlsx格式</p>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="openConsumingDialogShow(false)">取消</el-button>
                    <el-button type="primary" size="mini" @click="saveConsuming()">确认</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 领用 end-->

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>


    </div>
</template>

<script>
import inventoryManage from './inventoryManage.js'
export default inventoryManage
</script>
<style lang="scss" scoped>
#inventoryManage{
    //.dialogView{
    //    .common-info.flex .content {
    //        .label-term{
    //            width: 90px;
    //        }
    //        &.long{
    //            .label-term{
    //                width: 150px;
    //            }
    //        }
    //        &.text{
    //            & > .item{
    //                .label-term{
    //                    height: 20px;
    //                }
    //                .input-text{
    //                    line-height: 20px;
    //                }
    //            }
    //        }
    //    }
    //}
}
</style>

