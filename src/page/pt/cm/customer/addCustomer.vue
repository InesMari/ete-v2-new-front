<template>
    <div id="addCustomer" class="addCustomerPage">
      <div class="common-info">
        <div class="clearfix">
        <div class="ipt-info fl">
          <ul class="content clearfix">
            <li class="item">
              <label class="label-term"><em>*</em>公司名称</label>
              <div class="input-text">
                <el-input v-model="customer.custName" :disabled="isLock"></el-input>
              </div>
            </li>
            <li class="item">
              <label class="label-term"><em>*</em>公司简称</label>
              <div class="input-text">
                <el-input v-model="customer.abbreviationName" maxlength="5" :disabled="isLock"></el-input>
              </div>
            </li>
            <li class="item">
              <label class="label-term"><em>*</em>物流模式</label>
              <div class="input-text">
                <el-select v-model="customer.logisticsMode" clearable filterable placeholder="请选择" :disabled="isLock">
                  <el-option v-for="item in logisticsModeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                  </el-option>
                </el-select>
              </div>
            </li>
            <li class="item">
              <label class="label-term"><em>*</em>客户联系人</label>
              <div class="input-text">
                <el-input v-model="customer.linkman" :disabled="isLock"></el-input>
              </div>
            </li>
            <li class="item">
              <label class="label-term">登录账号</label>
              <div class="input-text">
                <el-input v-model="customer.linkPhone" @change="checkBillId()" placeholder="手机号码或者邮箱" :disabled="isLock"></el-input>
              </div>
            </li>
            <li class="item">
              <label class="label-term"><em>*</em>公司地址</label>
              <div class="input-text">
                <el-input v-model="customer.address" :disabled="isLock"></el-input>
              </div>
            </li>
            <li class="item">
              <label class="label-term"><em>*</em>所属行业</label>
              <div class="input-text">
                <el-select v-model="customer.belongingIndustry" clearable filterable placeholder="请选择" :disabled="isLock">
                  <el-option v-for="item in belongingIndustryData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                  </el-option>
                </el-select>
              </div>
            </li>
            <li class="item">
              <label class="label-term"><em>*</em>账期(天)</label>
              <div class="input-text">
                <el-input v-model="customer.accountPeriod" v-mynumval :disabled="isLock"></el-input>
              </div>
            </li>
            <li class="item">
              <label class="label-term">发票资质类型</label>
              <div class="input-text">
                <el-select v-model="customer.invoiceType" clearable filterable placeholder="请选择" :disabled="isLock">
                  <el-option v-for="item in invoiceTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                  </el-option>
                </el-select>
              </div>
            </li>
            <li class="item">
              <label class="label-term">卡户名</label>
              <div class="input-text">
                <el-input v-model="customer.accountName" :disabled="isLock"></el-input>
              </div>
            </li>
            <li class="item">
              <label class="label-term">纳税人识别号</label>
              <div class="input-text">
                <el-input v-model="customer.taxNumber" :disabled="isLock"></el-input>
              </div>
            </li>
            <li class="item">
              <label class="label-term">注册银行</label>
              <div class="input-text">
                <el-input v-model="customer.regBank" :disabled="isLock"></el-input>
              </div>
            </li>
            <li class="item">
              <label class="label-term">账号</label>
              <div class="input-text">
                <el-input v-model="customer.regAccount" :disabled="isLock"></el-input>
              </div>
            </li>
            <li class="item">
              <label class="label-term">注册地址</label>
              <div class="input-text">
                <el-input v-model="customer.regAddress" :disabled="isLock"></el-input>
              </div>
            </li>
            <li class="item">
              <label class="label-term">注册电话</label>
              <div class="input-text">
                <el-input v-model="customer.regPhone" :disabled="isLock"></el-input>
              </div>
            </li>
            <li class="item">
              <label class="label-term">运输票面税点(%)</label>
              <div class="input-text">
                <el-input v-model="customer.taxRate" v-mypmdouble4val :disabled="isLock"></el-input>
              </div>
            </li>
            <li class="item">
              <label class="label-term">装卸票面税点(%)</label>
              <div class="input-text">
                <el-input v-model="customer.loadTaxRate" v-mypmdouble4val :disabled="isLock"></el-input>
              </div>
            </li>

            <li class="item">
              <label class="label-term">所属区域</label>
              <div class="input-text">
                <el-select v-model="customer.regionIds" clearable filterable multiple placeholder="请选择" :disabled="isLock">
                  <el-option
                      v-for="item in regionData"
                      :key="item.id"
                      :label="item.regionName"
                      :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </li>

            <li class="item">
              <label class="label-term">所属部门</label>
              <div class="input-text">
                <el-select v-model="customer.orgIds" clearable filterable multiple placeholder="请选择" @change="orgChange" :disabled="isLock">
                  <el-option
                      v-for="item in orgData"
                      :key="item.id"
                      :label="item.orgName"
                      :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </li>
            <li class="item">
              <label class="label-term"><em>*</em>客户代表</label>
              <div class="input-text">
                <el-select v-model="customer.custManage" clearable filterable placeholder="请选择" :disabled="isLock">
                  <el-option
                      v-for="item in orgStaffData"
                      :key="item.userId"
                      :label="item.staffName"
                      :value="item.userId">
                  </el-option>
                </el-select>
              </div>
            </li>
            <li class="item">
              <label class="label-term">
                <em>*</em>是否购买方
                <el-tooltip effect="dark" content="默认为【否】，如果选择【是】，新建订单的客户选择中，不会显示此客户，只在客户对账中的【购买方名称】可见！" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </label>
              <div class="input-text">
                <el-switch v-model="customer.isAcct == 1" @change="changeInfoSwitch()" active-color="#13ce66" inactive-color="#ff4949" :disabled="isLock"/>
                <span class="name">{{ customer.isAcct == 1 ? "是" : "否" }}</span>
              </div>
            </li>
            <li class="item">
              <label class="label-term">
                关联购买方名称
                <el-tooltip effect="dark" content="此关联的客户，在客户账单中的【购买方名称】中可供选择！" placement="top">
                  <i class="el-icon-question"></i>
                </el-tooltip>
              </label>
              <div class="input-text">
                <el-select v-model="customer.acctCustIds" clearable filterable multiple placeholder="请选择" :disabled="isLock">
                  <el-option
                      v-for="item in customerData"
                      :key="item.tenantId"
                      :label="item.abbreviationName"
                      :value="item.tenantId">
                  </el-option>
                </el-select>
              </div>
            </li>
            <li class="item">
              <label class="label-term">
                <em>*</em>短信提醒司机送达
              </label>
              <div class="input-text">
                <el-switch v-model="customer.smsRemindDriverDeliver" active-color="#13ce66" inactive-color="#ff4949" :disabled="isLock"/>
                <span class="name">{{ customer.smsRemindDriverDeliver ? "是" : "否" }}</span>
              </div>
            </li>

            <!--部门提成相关  开始-->
            <li class="item item100">
            <div class="bot-table clearfix">
              <div class="fr table" ref="table">
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                  <thead>
                  <tr>
                    <th width="250">提成部门</th>
                    <th width="150">客户分级
                      <el-tooltip effect="dark" placement="top">
                          <div slot="content" class="box" style="background: #303133;color: #FFF;">
                              总经办导入大型客户(30%)<br/>
                              战略客户(80%)<br/>
                              续约客户(100%)<br/>
                              新开发客户(150%)<br/>
                              特优新客户(200%)<br/>
                          </div>
                          <i class="el-icon-question"></i>
                      </el-tooltip>
                    </th>
                    <th width="200">客户信息提供人员
                      <el-tooltip effect="dark" content="分配比例(25%)" placement="top">
                        <i class="el-icon-question"></i>
                      </el-tooltip>
                    </th>
                    <th width="200">直接开发人员
                      <el-tooltip effect="dark" content="分配比例(75%)" placement="top">
                          <i class="el-icon-question"></i>
                      </el-tooltip>
                    </th>
                    <th width="80" v-show="!isLock&&commissionModifyFlag">
                      <el-tooltip effect="dark" content="添加提成人员" placement="top-start" :hide-after='1000'>
                        <span @click="addItem()" class="add"></span>
                      </el-tooltip>
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(data,index) in customer.commissionRelList" :key="index">
                    <td>
                      <el-select v-model="data.orgId" clearable filterable placeholder="请选择" :disabled="isLock||!commissionModifyFlag">
                        <el-option v-for="item in orgData" :key="item.id" :label="item.orgName" :value="item.id">
                        </el-option>
                      </el-select>
                    </td>
                    <td>
                      <el-select v-model="data.custType" clearable filterable placeholder="请选择" :disabled="isLock||!commissionModifyFlag">
                        <el-option v-for="item in custTypeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                        </el-option>
                      </el-select>
                    </td>
                    <td>
                      <el-select v-model="data.offerUser" clearable filterable placeholder="请选择" :disabled="isLock||!commissionModifyFlag">
                          <el-option v-for="item in orgStaffData" :key="item.userId" :label="item.staffName" :value="item.userId">
                          </el-option>
                      </el-select>
                    </td>
                    <td>
                      <el-select v-model="data.findUser" clearable filterable placeholder="请选择" :disabled="isLock||!commissionModifyFlag">
                          <el-option v-for="item in orgStaffData" :key="item.userId" :label="item.staffName" :value="item.userId">
                          </el-option>
                      </el-select>
                    </td>
                    <td v-show="!isLock&&commissionModifyFlag">
                      <el-tooltip effect="dark" content="删除提成人员" placement="top-start" :hide-after='1000'>
                        <span @click="removeItem(index)" class="del"></span>
                      </el-tooltip>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <!--部门提成相关  结束-->
            </li>
          </ul>

        </div>
        <div class="upload-info fr">
          <div class="label-term">营业执照</div>
          <div class="input-text" :class="isLock?'fileModelLock':''">
            <myFileModel ref="businessLicense" @successCallback="successCallback" :disabled-del="isLock" :disabled-edit="isLock"></myFileModel>
          </div>
          <div class="label-term"><em>*</em>开票资料</div>
          <div class="input-text" :class="isLock?'fileModelLock':''">
            <myFileModel ref="invoiceInfo" :disabled-del="isLock" :disabled-edit="isLock"></myFileModel>
          </div>
        </div>
        </div>
      <div class="bot-btn">
        <el-button @click="closeAddCustomer()">关闭</el-button>
        <el-button type="primary" @click="addCustomer()" v-if="!isLock && !isUpdate">确定新增</el-button>
        <el-button type="primary" @click="addCustomer()" v-if="!isLock && isUpdate">确定修改</el-button>
      </div>
    </div>
  </div>
</template>

<script>
    import addCustomer from './addCustomer.js'

    export default addCustomer
</script>
<style lang="scss" scoped>
.addCustomerPage{
    /deep/ .common-info{
        .content > .item .label-term {
            float: left;
            width: 120px;
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
            width: calc(100% - 130px);
            line-height: 40px;
            position: relative;
        }
    }
    /deep/ .ipt-info{
        width: calc(100% - 270px);
        .item{
            width: 48%;
        }
        .item100{
            width:98%;
        }
        .el-textarea__inner{
            width:100%;
        }
    }
    /deep/ .upload-info{
        width: 250px;
        .label-term{
            line-height: 40px;
        }
        .myFileModel .avatar-uploader{
            .el-upload{
                width: 250px;
                height: 200px;
            }
            .avatar-uploader-icon{
                width: 250px;
                height: 200px;
                line-height: 200px;
                font-size: 70px;
            }
        }
        .fileModelLock{
          .el-upload-dragger{
            background: #F5F7FA;
          }
        }
    }
  /deep/ .tableCommon{
    .add{
      vertical-align: middle;
      @include add;
    }
    .del{
      vertical-align: middle;
      @include del;
    }
    .el-select{
      width: 100%;
    }
  }
}
</style>
