<template>
    <div id="allotManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query"
                    searchKey="allotManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>调拨管理列表<em>（--双击序号查看详情--）</em></span>
                    <el-tooltip effect="light" content="调拨管理列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
<!--                  <el-button type="primary" plain size="mini" v-entity="1014034" @click="allotReturn">调拨返回</el-button>-->
                  <el-button type="primary" plain size="mini" v-entity="1014035" @click="updateItem(true)">修改</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014036" @click="deleteItem">删除</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014037" @click="verifyAllot">验收</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014070" @click="showSetUserDialog">设定接收人员</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014071" @click="toPrint">打印</el-button>
                </div>
            </div>
            <tableCommon tableName="allotManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :single-select="true" @dblclickItem="viewItem">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" class="link" @click.stop="toApplyDetail(item)" v-if="code=='applyNum'">{{item[code]}}</a>
                </template>
            </tableCommon>
        </div>

        <!-- 调拨 begin-->
        <el-dialog title="调拨" class="dialogView" :visible.sync="allocateDialogShow" width="800px" :close-on-click-modal="false"
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
                            <el-select v-model="allocateInfo.applyDtlId" placeholder="费用申请单号"
                                       @change="changeApply" filterable clearable :disabled="disable">
                                <el-option v-for="item in feeApplyData" :key="item.applyDtlId" :label="item.applyNum"
                                           :value="item.applyDtlId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>调拨数量</label>
                        <div class="input-text">
                            <el-input v-model="allocateInfo.allocateNum" v-mydoubleval :disabled="disable"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">使用客户</label>
                        <div class="input-text">
                            <el-select v-model="allocateInfo.custTenantId" placeholder="使用客户"
                                       @change="changeCustTenant" filterable clearable :disabled="disable">
                                <el-option v-for="item in customerData" :key="item.tenantId" :label="item.tenantName"
                                           :value="item.tenantId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>库存地</label>
                        <div class="input-text">
                            <el-select v-model="allocateInfo.allocateWorkId"
                                       @change="forceUpdate" filterable clearable placeholder="请选择库存地" :disabled="disable">
                                <el-option v-for="item in deliveryWorkData" :key="item.workId" :label="item.workName"
                                           :value="item.workId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>开始计费日期</label>
                        <div class="input-text">
                            <el-date-picker v-model="allocateInfo.chargeDate" type="date" placeholder="请选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="disable">
                            </el-date-picker>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>调入部门</label>
                        <div class="input-text">
                            <el-select v-model="allocateInfo.orgId" placeholder="调入部门" filterable clearable :disabled="disable">
                                <el-option v-for="item in orgData" :key="item.id" :label="item.orgName" :value="item.id"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term"><em>*</em>结算主体</label>
                        <div class="input-text">
                            <el-select v-model="allocateInfo.settleBody" placeholder="请选择"
                                       filterable clearable  :disabled="disable">
                                <el-option v-for="item in settleBodyData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">备注</label>
                        <div class="input-text">
                            <el-input v-model="allocateInfo.remark" :disabled="disable"></el-input>
                        </div>
                    </li>
                </ul>
              <h3 class="common-title mt_20" v-if="allocateInfo.verifyState>0"><span class="title-name">验收信息</span></h3>
              <ul v-if="allocateInfo.verifyState>0" class="content clearfix">
              <li class="item item50">
                <label class="label-term">验收人/时间：</label>
                <div class="input-text">{{allocateInfo.verifyUserName}} {{allocateInfo.verifyDate}}
                </div>
              </li>
                <li class="item item50">
                  <label class="label-term">验收意见：</label>
                  <div class="input-text">{{allocateInfo.verifyRemark}}
                  </div>
                </li>
              </ul>

              <div class="page-bot-btn ">
                    <el-button size="mini" @click="openAllocateDialogShow(false)" v-if="!disable">取消</el-button>
                    <el-button type="primary" size="mini" @click="savePurAllocate()" v-if="!disable">确认</el-button>
                    <el-button size="mini" @click="openAllocateDialogShow(false)" v-if="disable">关闭</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 调拨 end-->

        <!-- 调拨返回 begin-->
        <el-dialog title="调拨返回" class="dialogView" :visible.sync="allotReturnDialogShow" width="500px" :close-on-click-modal="false"
                   :close-on-press-escape="false">
            <div class="common-info flex" style="border:none;padding:0;">
                <div class="tip"><i class="el-icon-warning"></i> 调拨返回会改变部门之间的物品数量，确定是否调拨返回？</div>
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>调拨返回数量</label>
                        <div class="input-text">
                            <el-input v-model="info.returnNum" type="text" v-mynumval></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>调拨返回日期</label>
                        <div class="input-text">
                            <el-date-picker @input="forceUpdate" v-model="info.returnDate" type="date" placeholder="请选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="openAllotReturnDialogShow(false)">取消</el-button>
                    <el-button type="primary" size="mini" @click="saveAllotReturn()">提交</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 调拨返回 end-->

      <el-dialog :title="title" class="exceptionDialog" :visible.sync="isShowSetUserDialog" width="800px" :close-on-click-modal="false" :close-on-press-escape="false" @close="showSetUserDialog(false)">
        <div class="common-info" style="border:none;padding:0;">
          <div>
            <h3 class="common-title">
              <span class="title-name">资产调拨邮件接收人员</span>
            </h3>
            <div class="innerTable" style="height: 500px; overflow-y: scroll">
              <table class="fillTbale" width="100%"  style="overflow-y: auto;" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td class="label" width="10%">序号</td>
                  <td class="label" width="30%">名称</td>
                  <td class="label" width="25%">账号</td>
                  <td class="label" width="25%">邮箱</td>
                  <td class="label" width="10%">操作</td>
                </tr>
                <tr v-for="(userData,index) in emailUserList" :key="index">
                  <td>{{index+1}}</td>
                  <td>
                    <el-select v-model="userData.userId" placeholder="请选择"  @change="selectUser(userData)" filterable clearable>
                      <el-option v-for="item in staffData" :key="item.userId" :label="item.staffName" :value="item.userId" >
                      </el-option>
                    </el-select>
                  </td>
                  <td>{{userData.billId}}</td>
                  <td>{{userData.email}}</td>
                  <td>
                    <a href="javascript:;" class="link"  @click="addRow">新增</a>
                    <a href="javascript:;" class="link red" @click="delRow(index)" style="margin:0 5px;">删除</a>
                  </td>
                </tr>
              </table>
            </div>
          </div>

          <div class="page-bot-btn ">
            <el-button size="mini" @click="showSetUserDialog(false)">关闭</el-button>
            <el-button type="primary" size="mini" @click="saveEmailUser()" >提交</el-button>
          </div>
        </div>
      </el-dialog>

    <!-- 打印 begin-->
    <el-dialog title="打印调拨详情" class="printDialogView" :visible.sync="allotPrintDialogShow" width="800px" :close-on-click-modal="false"
            :close-on-press-escape="false">
        <div class="common-info flex" style="border:none;padding:0;">
            <div id="printTable">
            <h3 class="common-title">
              <span class="title-name">基本信息</span>
            </h3>
            <ul class="content printBorder clearfix">
                <li class="item item50">
                    <label class="label-term">资产种类：</label>
                    <div class="input-text">{{printData.feeSubTypeName}}</div>
                </li>
                <li class="item item50">
                    <label class="label-term">资产名称：</label>
                    <div class="input-text">{{printData.projectName}}</div>
                </li>
                <li class="item item50">
                    <label class="label-term">规格型号：</label>
                    <div class="input-text">{{printData.specification}}</div>
                </li>
                <li class="item item50">
                    <label class="label-term">所在地：</label>
                    <div class="input-text">{{printData.fromWorkName}}</div>
                </li>
                <li class="item item50">
                    <label class="label-term">库存数量：</label>
                    <div class="input-text">{{printData.stockNum}}</div>
                </li>
                <li class="item item50">
                    <label class="label-term">结算主体：</label>
                    <div class="input-text">{{printData.settleBodyName}}</div>
                </li>
            </ul>
            <h3 class="common-title">
              <span class="title-name">调拨信息</span>
            </h3>
            <ul class="content clearfix">
                <li class="item item50">
                    <label class="label-term">费用申请单号：</label>
                    <div class="input-text">{{printData.applyNum | emptyToStr}}</div>
                </li>
                <li class="item item50">
                    <label class="label-term">调拨数量：</label>
                    <div class="input-text">{{printData.allocateNum}}</div>
                </li>
                <li class="item item50">
                    <label class="label-term">使用客户：</label>
                    <div class="input-text">{{printData.custTenantName}}</div>
                </li>
                <li class="item item50">
                    <label class="label-term">库存地：</label>
                    <div class="input-text">{{printData.allocateWorkName}}</div>
                </li>
                <li class="item item50">
                    <label class="label-term">开始计费日期：</label>
                    <div class="input-text">{{printData.chargeDate}}</div>
                </li>
                <li class="item item50">
                    <label class="label-term">调入部门：</label>
                    <div class="input-text">{{printData.orgName}}</div>
                </li>
                <li class="item item50">
                    <label class="label-term">结算主体：</label>
                    <div class="input-text">{{printData.settleBodyName}}</div>
                </li>
                <li class="item item50">
                    <label class="label-term">备注：</label>
                    <div class="input-text">{{printData.remark}}</div>
                </li>
            </ul>
            </div>
            <div class="page-bot-btn ">
                <el-button size="mini" @click="openAllotPrintDialogShow(false)">取消</el-button>
                <el-button type="primary" size="mini" @click="print">打印</el-button>
            </div>
        </div>
    </el-dialog>
    <!-- 打印 end-->


    </div>
</template>

<script>
import allotManage from './allotManage.js'
export default allotManage
</script>
<style lang="scss" scoped>
#allotManage{
    .dialogView{
        .tip{
            text-align: center;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            .el-icon-warning{
                font-size: 18px;
                margin-right: 10px;
                color: orange;
            }
        }
    }
    .printDialogView{
        .common-info.flex .content > .item .label-term{
            width:100px;
        }
    }
}
</style>

