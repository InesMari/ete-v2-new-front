<template>
    <div id="deviceAllocateManage">
      <div class="search-list clearfix">
        <div class="search-form clearfix">
          <div class="item">
            <label class="label">器具名称：</label>
            <div class="input-text">
              <el-input v-model="query.deviceName" placeholder="搜索器具名称" type="text"></el-input>
            </div>
          </div>
          <div class="item">
            <label class="label">审核状态：</label>
            <div class="input-text">
              <el-select v-model="query.verifyState" placeholder="审核状态" @change="doQuery" clearable filterable>
                <el-option v-for="item in verifyStateData" :key="item.codeValue" :label="item.codeName"
                           :value="item.codeValue"></el-option>
              </el-select>
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
      </div>
  
  
      <div class="table-content">
        <div class="table-title">
          <h3>
            <span>调拨管理列表（<span style="color: red; font-size: 12px;">--双击序号查看详情--</span>）</span>
            <el-tooltip effect="light" content="调拨管理列表" placement="right">
             <img class="tip" src="@/static/image/tip.png" alt="">
            </el-tooltip>
          </h3>
          <div class="table-title-btn" style="margin-right: 90px;">
<!--            <el-button type="primary" plain size="mini" @click="returnAllocatDevice" v-entity="1012027">调拨返回</el-button>-->
<!--            <el-button type="primary" plain size="mini" @click="showAddDialog(true)" v-entity="1012020">新增</el-button>-->
<!--            <el-button type="primary" plain size="mini" @click="displayDialog(2)" v-entity="1012021">修改</el-button>-->
<!--            <el-button type="danger" plain size="mini" @click="delAllocatDevice()" v-entity="1012022">删除</el-button>-->
            <el-button type="primary" plain size="mini" @click="verify(true)" v-entity="1012028">审核通过</el-button>
            <el-button type="primary" plain size="mini" @click="verify(false)" v-entity="1012028">审核不通过</el-button>
            <el-button type="primary" plain size="mini" @click="print" v-entity="1012034">打印</el-button>
          </div>
        </div>
        <tableCommon tableName="deviceAllocateManageTable" ref="table" :showNum="true" @dblclickItem="dblclickItem" :showSetTable="true" :head="head" :singleSelect="true">
        </tableCommon>
      </div>
  
      <!-- 新建调拨 开始-->
      <el-dialog :title="title" :visible.sync="isShowAddDialog" width="700px" :close-on-click-modal="false" :close-on-press-escape="false" @close="showAddDialog(false)">
        <div class="common-info" style="border:none;padding:0;">
            <h3 style="line-height:40px;font-size:14px;font-weight:bold;padding-left: 24px;">调出仓库：</h3>
            <ul class="content clearfix">
                <li class="item item50">
                    <label class="label-term"><em>*</em>仓库</label>
                    <div class="input-text">
                    <el-select v-model="deviceInfo.fromWorkId" placeholder="请选择" :disabled="viewFlag" clearable @change="initCustomers(1)">
                        <el-option v-for="item in workList" :key="item.workId" :label="item.workName" :value="item.workId" >
                        </el-option>
                    </el-select>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term"><em>*</em>结算主体</label>
                    <div class="input-text">
                    <el-select v-model="deviceInfo.fromSettleBody" placeholder="请选择" :disabled="viewFlag"  clearable  @change="initDeviceInfoData">
                        <el-option v-for="item in settleBodyData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                        </el-option>
                    </el-select>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term"><em>*</em>使用客户</label>
                    <div class="input-text">
                    <el-select v-model="deviceInfo.fromTenantId" placeholder="请选择" :disabled="viewFlag"  clearable  @change="initDeviceInfoData">
                        <el-option v-for="item in fromCustomerData" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" >
                        </el-option>
                    </el-select>
                    </div>
                </li>
            </ul>
            
            <h3 style="line-height:40px;font-size:14px;font-weight:bold;padding-left: 24px;">调入仓库：</h3>
            <ul class="content clearfix">
                <li class="item item50">
                    <label class="label-term"><em>*</em>仓库</label>
                    <div class="input-text">
                      <el-select v-model="deviceInfo.toWorkId" placeholder="请选择" :disabled="viewFlag"  clearable @change="initDeliveryWork">
                        <el-option v-for="item in workList" :key="item.workId" :label="item.workName" :value="item.workId" >
                        </el-option>
                      </el-select>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term"><em>*</em>结算主体</label>
                    <div class="input-text">
                      <el-select v-model="deviceInfo.toSettleBody"  :disabled="viewFlag" placeholder="请选择" clearable>
                        <el-option v-for="item in settleBodyData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" >
                        </el-option>
                      </el-select>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term"><em>*</em>使用客户</label>
                    <div class="input-text">
                      <el-select v-model="deviceInfo.toTenantId" placeholder="请选择" :disabled="viewFlag"  clearable @change="initDeliveryWork">
                        <el-option v-for="item in toCustomerData" :key="item.tenantId" :label="item.tenantName" :value="item.tenantId" >
                        </el-option>
                      </el-select>
                    </div>
                </li>
            </ul>
          <ul class="content clearfix">
            <li class="item item50">
              <label class="label-term"><em>*</em>器具名称</label>
              <div class="input-text">
                <el-select v-model="deviceInfo.devDeviceId" placeholder="请选择"  :disabled="viewFlag" clearable @change="selDevice">
                  <el-option v-for="item in deviceInfoData" :key="item.devDeviceId" :label="item.deviceName" :value="item.devDeviceId" >
                  </el-option>
                </el-select>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term"><em>*</em>器具规格</label>
              <div class="input-text" style="display:flex;">
                <el-input v-model="deviceInfo.spec" :disabled="true"  placeholder="长宽高"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term"><em>*</em>调拨数量</label>
              <div class="input-text">
                <el-input v-model="deviceInfo.nums"  :disabled="viewFlag" placeholder="请输入调拨数量"></el-input>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term"><em>*</em>交付地</label>
              <div class="input-text">
                <el-select v-model="deviceInfo.deliveryWorkId"  :disabled="viewFlag" placeholder="请选择" clearable>
                  <el-option v-for="item in deliveryWorkData" :key="item.workId" :label="item.workName"
                             :value="item.workId"></el-option>
                </el-select>
              </div>
            </li>
            <li class="item item50">
              <label class="label-term"><em>*</em>开始计费</label>
              <div class="input-text">
                <el-date-picker v-model="deviceInfo.chargeDate"  :disabled="viewFlag" type="date" placeholder="请选择年月日" value-format="yyyy-MM-dd"></el-date-picker>
              </div>
            </li>
          </ul>
  
          <div class="page-bot-btn ">
            <el-button size="mini" @click="showAddDialog(false)">关闭</el-button>
            <el-button type="primary" size="mini" @click="saveDevAllocatDeviceInfo" v-if="!viewFlag">保存</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 新建调拨 结束-->
    </div>
  </template>
  
  <script>
  import deviceAllocateManage from './deviceAllocateManage.js'
  export default deviceAllocateManage
  </script>
  
  
  <style scoped>
  </style>
  