<template>
  <div id="subCompanyManage" class="subCompanyManagePage">
    <div class="search-list clearfix">
      <div class="search-form clearfix" @keyup.enter="doQuery()">
        <div class="item">
          <label class="label">子公司名称：</label>
          <div class="input-text">
            <el-input v-model="query.custName" placeholder="子公司名称" type="text"></el-input>
          </div>
        </div>
      </div>
      <div class="search-btn clearfix">
        <div class="btn">
          <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询</el-button>
        </div>
        <div class="btn">
          <el-button type="danger" plain size="mini" icon="el-icon-close" @click="clear()">清空</el-button>
        </div>
      </div>
      <!-- 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 -->
      <div class="search-bot">
        <img src="@/static/image/search-bot.png" alt="">
        <i class="icon el-icon-arrow-down"></i>
        <i class="icon el-icon-arrow-up"></i>
      </div>
    </div>
    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>子公司列表</span>
          <el-tooltip effect="light" content="子公司列表" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn">
            <el-button type="primary" plain size="mini" @click="loadEntityTree()" v-entity="2005003">权限配置</el-button>
            <el-button type="primary" plain size="mini" @click="displayDialog()" v-entity="2005004">查看资料</el-button>
            <el-button type="primary" plain size="mini" @click="toDistributionRoutePage()" v-entity="2005005">分配线路</el-button>
<!--          <el-button type="primary" plain size="mini" @click="toDownload()" >下载测试</el-button>-->

        </div>
      </div>
      <tableCommon tableName="subCompanyManageTable" ref="table" :showNum="true" :showSetTable="false" :singleSelect="true" :head="head" v-slot="{item}">
        <div>
          <a href="javascript:void(0);" class="link" @click.stop="showBusinessLicense(item)" style="margin: 0 10px;">营业资料</a>
          <a href="javascript:void(0);" class="link" @click.stop="showInvoiceInfo(item)" style="margin: 0 10px;">开票资料</a>
        </div>
      </tableCommon>
    </div>
    <!-- 权限配置 -->
    <div class="popup" :class="{'show':showEntityPage}">
        <div class="popup_bj" @click="isShowEntityPage(false)"></div>
        <div class="popup_content" style="width:40%">
            <authRoleTree ref="authRoleTree" :showRole="false"></authRoleTree>
        </div>
    </div>
    <!-- 查看大图 -->
    <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

    <!-- 查看资料 -->
    <div class="popup" :class="{'show':showDialog}">
      <!-- 遮罩层 -->
      <div class="popup_bj" @click="closeDialog"></div>
      <!-- 内容 -->
      <div class="popup_content" style="width:700px;">
        <div class="common-info" style="border:none;padding:0;">
          <h3 class="common-title mb_20"><span class="title-name">{{ dialogTitle }}</span></h3>
          <ul class="content clearfix" style="padding:0 12px;margin-bottom:20px;">
            <li class="item item50">
              <label class="label-term">公司名称</label>
              <div class="input-text">
                <el-input v-model="customer.custName" :disabled="true"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">地址</label>
              <div class="input-text">
                <el-input v-model="customer.address" :disabled="true"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">管理员</label>
              <div class="input-text">
                <el-input v-model="customer.linkman" :disabled="true"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">联系电话</label>
              <div class="input-text">
                <el-input v-model="customer.linkPhone" :disabled="true"></el-input>
              </div>
            </li>
          </ul>
          <h3 class="common-title mb_20"><span class="title-name">开票信息</span></h3>
          <ul class="content clearfix" style="padding:0 12px;">
            <li class="item item50">
              <label class="label-term">发票资质类型</label>
              <div class="input-text">
                <el-input v-model="customer.invoiceTypeName" :disabled="true"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">纳税人识别号</label>
              <div class="input-text">
                <el-input v-model="customer.taxNumber" :disabled="true"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">注册地址</label>
              <div class="input-text">
                <el-input v-model="customer.regAddress" :disabled="true"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">注册电话</label>
              <div class="input-text">
                <el-input v-model="customer.regPhone" :disabled="true"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">注册银行</label>
              <div class="input-text">
                <el-input v-model="customer.regBank" :disabled="true"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">卡户名</label>
              <div class="input-text">
                <el-input v-model="customer.accountName" :disabled="true"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term">账号</label>
              <div class="input-text">
                <el-input v-model="customer.regAccount" :disabled="true"></el-input>
              </div>
            </li>
          </ul>
          <ul class="content clearfix" style="padding:0 12px;">
            <li class="item item50 img-upload">
              <label class="label-term">营业执照</label>
              <div class="input-text">
                <myFileModel ref="businessLicense" :disabled="true"></myFileModel>
              </div>
            </li>
            <li class="item item50 img-upload">
              <label class="label-term">开票资料</label>
              <div class="input-text">
                <myFileModel ref="invoiceInfo" :disabled="true"></myFileModel>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 分配线路 -->
    <div class="popup" :class="{'show':showDistributionRoutePage}">
      <div class="popup_bj" @click="isShowDistributionRoutePage(false)"></div>
      <div class="popup_content" style="width:80%">
        <div id="distributionRoute" class="distributionRoute">
          <div class="search-list clearfix">
            <div class="search-form clearfix" style="border-right: 0;" @keyup.enter="loadRouteDataByTenantId(query)">
              <div class="item">
                <label class="label">线路名称：</label>
                <div class="input-text">
                  <el-input v-model="dbTableQuery.routeName" placeholder="线路名称" type="text" autocomplete="new-password"></el-input>
                </div>
              </div>
              <div class="item">
                <label class="label">起点/终点：</label>
                <div class="input-text">
                  <el-input v-model="dbTableQuery.beginWorkNameOrEndWorkName" placeholder="起点/终点" type="text" autocomplete="new-password"></el-input>
                </div>
              </div>
              <div class="item">
                <label class="label">是否启用：</label>
                <div class="input-text">
                  <el-select v-model="dbTableQuery.sts" placeholder="是否启用">
                    <el-option v-for="item in stsData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <div class="search-btn clearfix">
              <div class="btn">
                <el-button type="primary" plain size="mini" icon="el-icon-search"  @click="loadRouteDataByTenantId(query)">查询</el-button>
              </div>
              <div class="btn">
                <el-button type="danger" plain size="mini" icon="el-icon-close" @click="dbTableClear()">清空</el-button>
              </div>
            </div>
          </div>
          <dbTable tableName="distributionRouteTable" ref="dbTable" :head="dbTablehead" onlyId="routeId"></dbTable>
          <div class="page-bot-btn" style="text-align: right;position: relative !important;">
            <el-button size="small" @click="dbTableCancel()">取消</el-button>
            <el-button type="primary" size="small" @click="submit()">提交</el-button>
          </div>
        </div>
      </div>
    </div>
    <!--  分配线路 -->

  </div>
</template>

<script>
import subCompanyManage from './subCompanyManage.js'
export default subCompanyManage
</script>

<style lang="scss">
.subCompanyManagePage{
  .distributionRoute{
    height:100%;
    .table_height{
      border-bottom: $border;
    }
    .search-list{
      padding:20px 0;
      background-color: $bg-color;
    }
    .dbTable{
      height: calc(100% - 160px);
      .leftTable,.rightTable{
        height: 100%;
        .table_height{
          height: 100%;
        }
      }
    }
  }
}
</style>
