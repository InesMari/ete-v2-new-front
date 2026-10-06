<template>
        <div id="wmsVehicleManage" class="wmsVehicleManage">
          <select-work v-show="showSelWork"></select-work>
          <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="wmsVehicleManageSearch"  v-show="!showSelWork"></searchList>
        <div class="table-content" v-show="!showSelWork">
            <div class="table-title">
                <h3>
                    <span>车辆二维码列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="车辆二维码列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1005278" @click="addInfo">新增</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1005279" @click="updateInfo">修改</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1005280" @click="deleteInfo">删除</el-button>
                </div>
            </div>
            <tableCommon tableName="wmsVehicleManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem">
              <template v-slot:default="{ item }">
                <a href="javascript:void(0);" :class="!item.qrcodeFileUrl ? 'disabled' : 'link'"
                   @click.stop="visitCode(item)" style="margin: 0 10px;">二维码</a>
              </template>
            </tableCommon>
        </div>

        <!--        新增/修改数据       -->
        <el-dialog :title="title" :visible.sync="showDialog" width="40%" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="openDialog(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100" style="width:98%;">
                        <label class="label-term"><em>*</em>供应商</label>
                        <div class="input-text">
                          <el-select v-model="info.supplierTenantId" placeholder="请选择供应商" filterable clearable
                                     @change="changeSupplier" @click.native="initSupplierData" :disabled="isLock">
                            <el-option v-for="item in supplierData" :key="item.tenantId" :label="item.supplierName"
                                       :value="item.tenantId"></el-option>
                          </el-select>
                        </div>
                    </li>
                  <li class="item item100" style="width:98%;">
                    <label class="label-term"><em>*</em>车牌号</label>
                    <div class="input-text">
                      <el-select v-model="info.vehicleId"
                                 @change="forceUpdate"
                                 filterable clearable
                                 placeholder="车牌号" :disabled="isLock">
                        <el-option v-for="item in vehicleData" :key="item.vehicleId" :label="item.plateNumber"
                                   :value="item.vehicleId"></el-option>
                      </el-select>
                    </div>
                  </li>
                  <li class="item item100" style="width:98%;">
                    <label class="label-term"><em>*</em>司机</label>
                    <div class="input-text">
                      <el-select v-model="info.driverUserId"
                                 @change="forceUpdate"
                                 filterable clearable  :disabled="isLock"
                                 placeholder="司机">
                        <el-option v-for="item in driverData" :key="item.driverUserId" :label="item.driverName"
                                   :value="item.driverUserId"></el-option>
                      </el-select>
                    </div>
                  </li>
                    <li class="item item100" style="width:98%;">
                        <label class="label-term">备注</label>
                        <div class="input-text">
                            <el-input v-model="info.remark" maxlength="50" placeholder="写点什么?"
                                      :disabled="isLock"></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="openDialog(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="saveOrUpdateInfo()" v-if="!isLock">确认
                    </el-button>
                </div>
            </div>
        </el-dialog>
        <!--        新增/修改数据       -->


          <el-dialog title="车辆二维码" :visible.sync="showImgDialog" width="420px" :close-on-click-modal="false"
                     :close-on-press-escape="false" @close="showImgDialog = false">
            <div class="orderView" ref="orderView">
              <div class="orderHeader">
                <img src="@/static/image/logo.png" alt="">
<!--                <div class="oderNumInfo">-->
<!--                  <div class="name">供应商</div>-->
<!--                  <div class="value">{{currentItem.supplierTenantName}}</div>-->
<!--                </div>-->
              </div>
              <div class="oderInfo">
                <div class="item">
                  <div class="label">供应商：</div>
                  <div class="text">
                    <p class="site">{{currentItem.supplierTenantName}}</p>
                  </div>
                </div>
                <div class="item">
                  <div class="label">车牌号：</div>
                  <div class="text">
                    <p class="site">{{currentItem.plateNumber}}</p>
                  </div>
                </div>
                <div class="item">
                  <div class="label">司机：</div>
                  <div class="text">
                    <p class="site">{{currentItem.driverName}}/{{currentItem.driverPhone}}</p>
                  </div>
                </div>
              </div>
              <div class="codeView">
                <div class="title">易迁易仓储中心</div>
                <img :src="currentItem.qrcodeFileUrl" alt="">
                <div class="tip">
                  <p>PDA短驳单扫码读取</p>
                  <p>二维码始终有效</p>
                </div>
              </div>
            </div>
            <div class="downloadBtn">
              <el-button type="success" @click="downloadImg()">下载图片</el-button>
            </div>
          </el-dialog>
    </div>
</template>

<script>
import wmsVehicleManage from './wmsVehicleManage.js'

export default wmsVehicleManage
</script>
<style lang="scss">
.wmsVehicleManage{
  .orderView{
    background: linear-gradient(135deg, #e70b1d 0%, #c41a2e 100%);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 4px 20px rgba(231, 11, 29, 0.3);
    color: white;

    .orderHeader{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);

      img {
        height: 40px;
        filter: brightness(0) invert(1);
      }

      .oderNumInfo {
        text-align: right;

        .name {
          font-size: 14px;
          color: #fff;
          margin-bottom: 5px;
        }

        .value {
          color: #fff;
          font-size: 16px;
          font-weight: 600;
        }
      }
    }

    .oderInfo{
      margin-bottom: 20px;

      .item{
        display: flex;
        margin-bottom: 5px;
        .label{
          width: 80px;
          font-weight: 500;
          color: #fff;
          flex-shrink: 0;
          line-height: 1.5;
          font-size: 14px;
        }

        .text{
          flex: 1;

          .site {
            color: #fff;
            font-weight: 500;
            line-height: 1.5;
            font-size: 14px;
          }

          .tip {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.6);
            line-height: 1.5;
          }
        }
      }
    }

    .codeView{
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      border-radius: 12px;
      padding: 20px;
      text-align: center;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

      .title {
        font-size: 18px;
        font-weight: 600;
        color: #333;
        margin-bottom: 15px;
        padding-bottom: 10px;
        border-bottom: 2px solid #e70b1d;
      }

      img {
        width: 200px;
        height: 200px;
        //margin-bottom: 15px;

      }

      .tip {
        p {
          margin: 5px 0;
          font-size: 13px;
          color: #666;

          &:first-child {
            font-weight: 500;
            color: #333;
          }
        }
      }
    }
  }
  .downloadBtn{
    margin-top: 20px;
    text-align: center;
  }
}
</style>




