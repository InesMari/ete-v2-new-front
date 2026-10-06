<template>
    <div id="devicePurchaseManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="devicePurchaseManageSearch"></searchList>
        <!-- 列表相关  开始 -->
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>采购单列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="采购单列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain @click="addPurchase(1)" size="mini" v-entity="1012011">新增采购单
                    </el-button>
                    <el-button type="primary" plain @click="addPurchase(2)" size="mini" v-entity="1012012">修改采购单
                    </el-button>
                    <el-button type="primary" plain @click="deletePurchase" size="mini" v-entity="1012013">取消采购单
                    </el-button>
                    <el-button type="primary" plain @click="showUpload(true)" size="mini" v-entity="1012014">确认收货</el-button>
                    <el-button type="primary" plain @click="download()" size="mini"  v-entity="1012015">导出Excel</el-button>
                    <el-button type="primary" plain @click="print()" size="mini"  v-entity="1012033">打印</el-button>
                   <el-button type="primary" plain @click="showFileUpload()" size="mini"  v-entity="1012029">合同附件</el-button>
                  <el-button type="primary" plain size="mini" @click="uploadOpen = true" v-entity="1012031">导入Excel</el-button>
                </div>
            </div>
            <tableCommon tableName="devicePurchaseManageTable" ref="table" :head="head" :showNum="true" :showSetTable="true" :singleSelect="true" @dblclickItem="dblclickItem">
                <template v-slot="{item,code,name,index}">
                  <div v-if="code=='deliveryDetail'">
                    <a href="javascript:;" class="link" @click="viewDetail(item)">查看明细</a>
                  </div>
                  <div v-if="code=='file'">
                    <a class="link" :class="!item.fileUrl?'disabled':'link'" href="javascript:;" @click="showImg(item)">查看</a>
                  </div>
                  <a href="javascript:void(0);" class="link"
                       v-for="(data,index) in item.applyNumArray"
                       @click.stop="toDetail(item,code,index)"
                       v-if="code=='applyNums'">{{index>0?','+data:data}}</a>

                </template>
            </tableCommon>
        </div>
        <!-- 列表相关  结束 -->

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList" zIndex="10000"></fileViewer>

        <!-- 查看明细 开始 -->
        
        <el-dialog class="sureReceivedDialog" title="查看明细" :visible.sync="showDetail" :close-on-click-modal="false" :close-on-press-escape="false"
                   width="1200px" @close="showDetail=false">
            <div class="common-info" style="border:none;padding:0;">
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th>序号</th>
                            <th>器具名称</th>
                            <th>器具规格</th>
                            <th>使用客户</th>
                            <th>成本计费时间</th>
                            <th>收入计费时间</th>
                            <th>交付地</th>
                            <th>配送数量</th>
                            <th>操作时间</th>
                            <th>客户确认状态</th>
                            <th>客户确认时间</th>
                            <th>交货清单</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in details" :key="index">
                            <td>{{ index+1 }}</td>
                            <td>{{item.name}}</td>
                            <td>{{item.spec}}</td>
                            <td>{{item.custTenantName}}</td>
                            <td>{{item.costChargeDate}}</td>
                            <td>{{item.incomeChargeDate}}</td>
                            <td>{{item.deliveryWorkName}}</td>
                            <td>{{item.deliveryNums}}</td>
                            <td>{{item.createDate}}</td>
                            <td>{{item.confirmStateName}}</td>
                            <td>{{item.confirmDate}}</td>
                          <td><a class="link" :class="item.show?'link': 'disabled'" href="javascript:;" @click="viewImg(item)">查看</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </el-dialog>        
        <!-- 查看明细  结束 -->

        <!-- 确认收货 开始-->
        <el-dialog class="sureReceivedDialog" title="确认收货" :visible.sync="showUploadPage" :close-on-click-modal="false" :close-on-press-escape="false"
                   width="600px" @close="showUpload(false)">
            <div class="common-info" style="border:none;padding:0;">
                <em style="font-size:14px;padding-left:22px;">注：确定收货之后会更新器具库存,且会根据计费日期开始计算费用</em>
                <ul class="content clearfix" style="margin:10px 30px 0 0;">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>器具名称</label>
                        <div class="input-text">
                            <el-select v-model="purchase.devDeviceId" @change="changeDevice" clearable filterable placeholder="器具名称">
                                <el-option v-for="item in purchaseOrderDtls" :key="item.devDeviceId" :label="item.devDeviceName"
                                        :value="item.devDeviceId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">器具规格</label>
                        <div class="input-text">
                            <el-input v-model="purchase.spec" :disabled="true"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">使用客户</label>
                        <div class="input-text">
                          <el-input v-model="purchase.custTenantName" :disabled="true"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                      <label class="label-term">剩余未收货数量</label>
                      <div class="input-text">
                        <el-input v-model="purchase.remainPurchaseNums" :disabled="true"></el-input>
                      </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>成本计费时间</label>
                        <div class="input-text">
                            <el-date-picker v-model="purchase.costChargeDate" type="date" placeholder="请选择年月日" value-format="yyyy-MM-dd"></el-date-picker>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>收入计费时间</label>
                        <div class="input-text">
                            <el-date-picker v-model="purchase.incomeChargeDate" type="date" placeholder="请选择年月日" value-format="yyyy-MM-dd"></el-date-picker>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>配送数量</label>
                        <div class="input-text">
                            <el-input v-model="purchase.deliveryNums" @input="checkDeliveryNums" placeholder="请输入配送数量"></el-input>
                        </div>
                    </li>
                    <li class="item item100 img-upload">
                        <label class="label-term">附件</label>
                        <div class="fl mr_20 ml_10" :style="index == 2 ? 'margin-left: 97px;' : ''"
                             v-for="(item, index) in fileList">
                            <myFileModel :ref="'file' + index" @successCallback="successCallback" @delCallback="delCallback" :componentId="index"></myFileModel>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="showUpload(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="sureReceived()">确认收货</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 确认收货 结束-->

      <!-- 单据 开始-->
      <el-dialog title="上传最终合同" :visible.sync="showFile" width="380px" :close-on-click-modal="false" :close-on-press-escape="false" >
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix">
            <li class="item item100">
              <label class="label-term">客户合同编号</label>
              <div class="input-text">
                <el-input v-model="custOrderNum"></el-input>
              </div>
            </li>
            <li class="item item100">
              <label class="label-term"><em>*</em>最终合同</label>
              <div class="input-text">
                  <myFileModel ref="file" ></myFileModel>
              </div>
            </li>
          </ul>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="showFile=false;">关闭</el-button>
            <el-button type="primary" size="mini" @click="uploadPoOrderFile()">确认</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 单据 结束-->

      <!-- 批量导入 -->
      <my-import :open.sync="uploadOpen" :handle-success="doQuery" template="/download/deviceStockInit.xls" title="器具导入"
                 bean="devPurchaseOrderService" method="impAddStockInfo"></my-import>
    </div>
</template>

<script>
import devicePurchaseManage from './devicePurchaseManage.js'

export default devicePurchaseManage
</script>
<style lang="scss" scoped>
#devicePurchaseManage {
    /deep/ .sureReceivedDialog{
        .tableCommon{
            border:$border;
        }
    }
}
</style>