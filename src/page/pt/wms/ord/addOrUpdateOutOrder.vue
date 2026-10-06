<template>
    <div id="addOrUpdateOutOrder">
        <div class="common-info">
            <!--            基本信息-->
            <h3 class="common-title"><span class="title-name">基本信息</span></h3>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">出库类型</td>
                    <td class="value">
                      <el-select v-model="info.orderType" @change="changeOrderType" placeholder="请选择出库类型"
                                 filterable :disabled="modifyRemark">
                        <el-option v-for="item in orderTypeData" :key="item.codeValue" :label="item.codeName"
                                   :value="item.codeValue"></el-option>
                      </el-select>
                    </td>
                    <td class="label"><em v-show="showTenant">*</em>货主</td>
                    <td class="value">
                        <el-select v-model="info.srcTenantId" placeholder="请选择所属货主" clearable filterable
                                   @change="chnageSrcTenant" :disabled="modifyRemark||!showTenant">
                            <el-option v-for="item in srcTenantData" :key="item.wId" :label="item.name"
                                       :value="item.wId"></el-option>
                        </el-select>
                    </td>
                    <td class="label"><em>*</em>送货地址</td>
                    <td class="value">
                        <el-select v-model="info.fromWorkId" placeholder="请选择送货地址" clearable filterable
                                   @change="changeFromWork()" :disabled="modifyRemark">
                            <el-option v-for="item in workData" :key="item.workId" :label="item.workName"
                                       :value="item.workId"></el-option>
                        </el-select>
                    </td>
                    <td class="label">要求出库时间</td>
                    <td class="value">
                        <my-el-date-picker @input="$forceUpdate()" v-model="info.requireOutDate" type="datetime"
                                           placeholder="请选择日期时间" align="right" :picker-options="pickerOptions"
                                           format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm:ss" :disabled="modifyRemark">
                        </my-el-date-picker>
                    </td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>是否退货</td>
                    <td class="value">
                        <el-switch v-model="info.rejectedState == 1" @change="changeInfoSwitch('rejectedState')"
                                   active-color="#13ce66" inactive-color="#ff4949" :disabled="modifyRemark"/>
                        <span class="name">{{ info.rejectedState == 1 ? "是" : "否" }}</span>
                    </td>
                    <td class="label"><em>*</em>是否自提</td>
                    <td class="value">
                        <el-switch v-model="info.selfPickup == 1" @change="changeInfoSwitch('selfPickup')"
                                   active-color="#13ce66" inactive-color="#ff4949" :disabled="modifyRemark"/>
                        <span class="name">{{ info.selfPickup == 1 ? "是" : "否" }}</span>
                    </td>
                    <td class="label"><em>*</em>是否紧急</td>
                    <td class="value">
                      <el-switch v-model="info.isEmergency == 1" @change="changeInfoSwitch('isEmergency')"
                                 active-color="#13ce66" inactive-color="#ff4949" :disabled="modifyRemark"/>
                      <span class="name">{{ info.isEmergency == 1 ? "是" : "否" }}</span>
                    </td>
                    <td class="label"><em v-show="timeLimitFlag">*</em>客户单号</td>
                    <td class="value">
                      <el-autocomplete
                          style="width: 100%"
                          v-model="info.custOrderNum"
                          :fetch-suggestions="querySearch"
                          placeholder="请输入客户单号"
                          @input="autocomplete"
                          :disabled="modifyRemark"
                      ></el-autocomplete>

<!--                      <el-input v-model="info.custOrderNum" @input="forceUpdate" placeholder="请输入客户单号" :disabled="modifyRemark"></el-input>-->
                    </td>
                </tr>
                <tr>
                  <td class="label"><em v-show="timeLimitFlag">*</em>要求送达时间</td>
                  <td class="value">
                    <my-el-date-picker @input="changeRequireDoneDate()" v-model="info.requireDoneTime" type="datetime"
                                       placeholder="请选择日期时间" align="right" :picker-options="pickerOptions"
                                       format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm:ss" :disabled="modifyRemark||$route.query.outOrderId">
                    </my-el-date-picker>
                  </td>
                  <td class="label">抛单时间</td>
                  <td class="value">
                    <my-el-date-picker @input="$forceUpdate()" v-model="info.deliverOrderTime" type="datetime"
                                       placeholder="自动生成抛单时间" align="right" :picker-options="pickerOptions"
                                       format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" :disabled="true">
                    </my-el-date-picker>
                  </td>
                  <td class="label" v-show="showTimeoutReason"><em>*</em>超时原因</td>
                  <td class="value" v-show="showTimeoutReason">
                    <el-select v-model="info.timeoutReason" placeholder="请选择超时原因" clearable filterable
                               @change="forceUpdate" :disabled="modifyRemark||$route.query.outOrderId">
                      <el-option v-for="item in timeoutReasonData" :key="item.codeValue" :label="item.codeName"
                                 :value="item.codeValue"></el-option>
                    </el-select>
                  </td>
                  <td class="label">备注</td>
                  <td class="value" :colspan="showTimeoutReason?1:3">
                    <el-input v-model="info.remark" @input="forceUpdate" placeholder="请输入备注"></el-input>
                  </td>
                </tr>
            </table>
            <!--            基本信息-->

            <!--            物料信息-->
            <h3 class="common-title mt_20">
              <span class="title-name">物料信息</span>
              <el-button style="margin:2px 0 0 8px;" class="fr" size="mini" v-show="info.srcTenantId&&info.scanCustQrcode==0&&!modifyRemark" @click="showImportMaterial = true">导入物料</el-button>
              <el-button class="fr" size="mini" style="margin:2px 0 0 8px;" @click="operation()" v-if="!modifyRemark">选择库存信息</el-button>
              <el-button class="fr" size="mini" style="margin:2px 0 0 8px;" @click="toChooseMaterials" v-if="!modifyRemark && info.srcTenantId">按物料选择库存</el-button>
              <el-select v-model="workDetailId" size="small" class="fr"  style="margin-right: 10px;" filterable placeholder="快捷选择卸货地" @change="changeWorkDetail" v-if="!modifyRemark">
                <el-option v-for="i in workDetailData" :key="i.id" :label="i.name" :value="i.id"></el-option>
              </el-select>
            </h3>
            <scrollTable :head="head" ref="table" :doSum="true" :showNum="true" :isShowNum="true">
                <template v-slot:default="{item,code,index}">
                    <div v-if="code == 'workDetailId'">
                        <el-select v-model="item.workDetailId" filterable :disabled="modifyRemark">
                            <el-option v-for="i in workDetailData" :key="i.id" :label="i.name" :value="i.id"></el-option>
                        </el-select>
                    </div>
                    <div v-if="code == 'custQrcodeNum' && item.custQrcodeList">
                        <a v-if="item.custQrcodeNum!=1" href="javascript:;" class="link" @click="selCustQrcode(item,2,index)">{{ item.custQrcodeNum }}个</a>
                        <a v-else href="javascript:;" class="link" @click="selCustQrcode(item,2,index)">{{ item.custQrcodeList[0].codeNum }}</a>
                    </div>
                    <div v-if="code == 'planNums'" style="display: flex;align-items: center;">
                      <el-input v-model="item.planNums" type="text" v-mydoubleval placeholder="" :disabled="modifyRemark"
                                style="width: 100%" @input="calNums(item)" @blur="splitQrcode(item)"></el-input>
                      <el-tooltip effect="dark" content="拆单" placement="top-start" :hide-after='1000' v-if="item.newScanQrcode&&!item.perPalletNums">
                        <img src="@/static/image/list.png" class="list_icon" style="height: 24px;margin-left: 3px;" alt="" @click="splitQrcode(item)">
                      </el-tooltip>
                    </div>
                </template>
            </scrollTable>
            <!--            物料信息-->

            <!--            器具信息-->
            <h3 class="common-title mt_20"><span class="title-name">器具信息</span></h3>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th width="200"><em>*</em>可回收器具</th>
                    <th width="280"><em>*</em>所属人</th>
                    <th width="280"><em>*</em>到货厂商</th>
                    <th width="120"><em>*</em>出库数量</th>
                    <th width="50" v-if="!modifyRemark">
                        <el-tooltip effect="dark" content="添加器具" placement="top-start" :hide-after='1000'>
                            <span @click="addPackMaterial()" class="add"></span>
                        </el-tooltip>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in packMaterialData">
                    <td>
                        <el-select v-model="item.devDeviceId" filterable style="width: 100%" :disabled="modifyRemark">
                            <el-option v-for="item in deviceData" :key="item.id" :label="item.name"
                                       :value="item.id"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-select v-model="item.srcTenantId" filterable style="width: 100%" :disabled="modifyRemark">
                            <el-option v-for="i in fromTenantData2" :key="i.wId" :label="i.name"
                                       :value="i.wId"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-select v-model="item.useTenantId" filterable placeholder="使用客户" style="width: 100%"
                                   @change="forceUpdate"  :disabled="modifyRemark">
                            <el-option v-for="item in fromTenantData2" :key="item.wId" :label="item.name"
                                       :value="item.wId"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-input v-model="item.nums" type="text" v-mynumval placeholder=""
                                  style="width: 100%" :disabled="modifyRemark"></el-input>
                    </td>
                    <td v-if="!modifyRemark">
                        <el-tooltip effect="dark" content="删除器具" placement="top-start" :hide-after='1000'>
                            <span @click="removePackMaterial(index)" class="del"></span>
                        </el-tooltip>
                    </td>
                </tr>
                </tbody>
            </table>
            <!--            器具信息-->

            <div class="bot-btn ">
                <el-button @click="closePage()">关闭</el-button>
                <el-button type="primary" @click="saveOutOrder()">保存</el-button>
            </div>
        </div>

      <el-dialog class="operateDialog" title="操作" :visible.sync="isShowDialog" width="90%"  :close-on-click-modal="false" :close-on-press-escape="false">
        <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td class="label">到货厂商</td>
            <td class="value">
              <el-input v-model="loadParam.fromTenantName" placeholder="到货厂商"></el-input>
            </td>
            <td class="label">物料编码</td>
            <td class="value">
              <el-input v-model="loadParam.materialNum" placeholder="物料编码"></el-input>
            </td>
            <td class="label">关联客户码</td>
            <td class="value">
              <el-input v-model="loadParam.custQrcodeNum" placeholder="关联客户码"></el-input>
            </td>
            <td class="label" v-show="!info.srcTenantId">货主</td>
            <td class="value" v-show="!info.srcTenantId">
              <el-input v-model="loadParam.srcTenantName" placeholder="货主"></el-input>
            </td>
            <td rowspan="3" width="100">
              <el-button size="mini" type="primary" @click="doQuery()">查询</el-button>
              <el-button size="mini" type="danger" @click="clear()" style="margin-left: 5px;">清空</el-button>
            </td>
          </tr>
          <tr>
            <td class="label">批次号</td>
            <td class="value">
              <el-input
                  style="height: 30px;margin-top: -10px;"
                  :class="{ textareaFocus: textareaFocus }"
                  @focus="setTextareaFocus"
                  @blur="setTextareaFocus"
                  v-model="loadParam.batchNum"
                  placeholder="批次号"
                  @keydown.native="textareaKeyup"
                  @input="$forceUpdate()"
              ></el-input>
            </td>
            <td class="label">供应商批次号</td>
            <td class="value">
              <el-input v-model="loadParam.supplierBatchNum" placeholder="供应商批次号"></el-input>
            </td>
            <td class="label">ASN</td>
            <td class="value">
              <el-input v-model="loadParam.asn" placeholder="ASN"></el-input>
            </td>
            <td class="label" v-show="!info.srcTenantId">库位</td>
            <td class="value" v-show="!info.srcTenantId">
              <el-input v-model="loadParam.storageCode" placeholder="库位"></el-input>
            </td>
          </tr>
          <tr>
            <td class="label"></td>
            <td class="value">
            </td>
            <td class="label"></td>
            <td class="value">
            </td>
            <td class="label">是否重复选择</td>
            <td class="value">
              <el-checkbox v-model="noOnly" @change="resetLeftTable"></el-checkbox>
            </td>
            <td class="label" v-show="!info.srcTenantId"></td>
            <td class="value" v-show="!info.srcTenantId">
            </td>
          </tr>
        </table>
        <dbTable tableName="selStock" ref="selStockTable" :head="stockHead" onlyId="dId" :noOnly="noOnly" @dataChange="stockTableDataChange">
            <template v-slot="{item,code,table,index}">
                <div v-if="code=='custQrcodeNum' && item.custQrcodeList">
                    <a v-if="item.custQrcodeNum!=1" href="javascript:;" class="link" @click="selCustQrcode(item,1,index,table)">{{ item.custQrcodeNum }}个</a>
                    <a v-else href="javascript:;" class="link" @click="selCustQrcode(item,1,index,table)">{{ item.custQrcodeList[0].codeNum }}</a>
                </div>
          </template>
        </dbTable>
        <div class="bot-btn">
          <el-button @click="isShowDialog = false">取消</el-button>
          <el-button type="primary" @click="saveChange">确定</el-button>
        </div>
      </el-dialog>

      <!-- 选择客户码 -->
    <el-dialog class="operateDialog" title="选择客户码" :visible.sync="custQrcodeDialog" width="90%"  :close-on-click-modal="false" :close-on-press-escape="false">
        <div slot="title" class="custDialogTitle">
            <span class="title">选择客户码</span>
            <em>批次号：{{ currentItem.batchNum }}</em>
            <em>物料编码：{{ currentItem.materialNum }}</em>
        </div>
        <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
            <td class="label">父标签ID</td>
            <td class="value">
                <el-input v-model="custParam.parentCodeNum" @input="forceUpdate" placeholder="父标签ID"></el-input>
            </td>
            <td class="label">码类型</td>
            <td class="value">
                <el-input v-model="custParam.relCustQrcodeTypeName" @input="forceUpdate" placeholder="码类型"></el-input>
            </td>
            <td class="label">客户箱码</td>
            <td class="value">
                <el-input v-model="custParam.codeNum" @input="forceUpdate" placeholder="客户箱码"></el-input>
            </td>
            <td rowspan="2" width="100">
                <el-button size="mini" type="primary" @click="custQrcodeDialogDoQuery()">查询</el-button>
                <el-button size="mini" type="danger" @click="custQrcodeDialogClear()" style="margin: 0 0 0 5px;">清空</el-button>
            </td>
            </tr>
        </table>
        <dbTable tableName="custCodeTable" ref="custCodeTable" :head="custCodeHead" onlyId="id" @dataChange="custCodeTableDataChange" :style="disabledSelCustQrcode?'pointer-events: none':''"></dbTable>
        <div class="bot-btn" v-show="!disabledSelCustQrcode">
            <el-button @click="custQrcodeDialog = false" style="margin-right: 5px;">取消</el-button>
            <el-button type="primary" @click="saveCustCodeChange">确定</el-button>
        </div>
    </el-dialog>

      <el-dialog class="operateDialog splitDialog" title="手动拆单" :visible.sync="splitDialog" width="30%"  :close-on-click-modal="false" :close-on-press-escape="false">
        <div slot="title" class="custDialogTitle">
          <span class="title">手动拆单</span>
          <em>批次号：{{ splitItem.batchNum }}</em>
          <em>物料编码：{{ splitItem.materialNum }}</em>
        </div>
        <table ref="scrollTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
          <thead>
          <tr>
            <th width="30">序号</th>
            <th width="150">物料标签</th>
            <th width="60">数量</th>
            <th width="80">拆分出库数量</th>
            <th style="background-color: #fff;" width="50" v-if="!modifyRemark"></th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(subItem, index) in splitItem.splitQrcodeList">
            <td>{{index + 1}}</td>
            <td >
              <el-select v-model="subItem.id" @change="changeQrcode(subItem, index)" style="width: 100%;" filterable :disabled="modifyRemark" clearable placeholder="请选择">
                <el-option v-for="v in qrcodeList " :key="v.id" :label="v.codeNum" :value="v.id"></el-option>
              </el-select>
            </td>
            <td>{{subItem.nums}}
            </td>
            <td><el-input v-model="subItem.mantissa" v-mydouble5val maxlength="19" @input="check" :disabled="modifyRemark"></el-input></td>
            <td style="border-bottom:0;text-align: left;" v-if="!modifyRemark">
              <el-tooltip effect="dark" content="新增" v-show="index === splitItem.splitQrcodeList.length - 1"
                          placement="top-start" :hide-after='1000' style="margin-right: 10px">
                <span @click="addItem()" class="add"></span>
              </el-tooltip>
              <el-tooltip effect="dark" content="删除" v-show="splitItem.splitQrcodeList.length > 1"
                          placement="top-start" :hide-after='1000'>
                <span @click="removeItem(index)" class="del"></span>
              </el-tooltip>
            </td>
          </tr>
          </tbody>
        </table>

        <div class="bot-btn">
          <el-button @click="confirm(false)">取消</el-button>
          <el-button type="primary" @click="confirm(true)" v-if="!modifyRemark">确定</el-button>
        </div>
      </el-dialog>

      <!-- 导入物料 -->
        <el-dialog title="导入物料" :visible.sync="showImportMaterial" width="400px">
            <el-upload
                drag
                class="upload-demo"
                :on-change="handleChange"
                action="/"
                :auto-upload="false"
                :show-file-list="false"
                accept=".xls,.xlsx">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传xls/xlsx文件，<a href="/download/outOrderMaterial.xlsx" type="primary" style="font-size:12px;color:red;">下载模板</a></div>
            </el-upload>
       </el-dialog>

        <!--        出库新建成功弹窗-->
        <!--        <el-dialog title="新增订单成功" :visible.sync="showSuccessDialog" width="400px">-->
        <!--            <div style="font-weight:bold;font-size:14px;">订单号：<em>{{ successData.orderNum }}</em></div>-->
        <!--            <div class="page-bot-btn">-->
        <!--                <el-button type="primary" @click="toOrderDetail">查看订单详情</el-button>-->
        <!--                <el-button type="success" @click="changeSuccessDialog(false)">再下一单</el-button>-->
        <!--            </div>-->
        <!--        </el-dialog>-->
        <!--        出库新建成功弹窗-->

        <el-dialog class="operateDialog srcTenantMaterialDialog" title="按物料选择库存" :visible.sync="srcTenantMaterialDialog" width="80%"  :close-on-click-modal="false" :close-on-press-escape="false">
            <div class="searchView">
              <el-select v-model="srcTenantMaterial.materialNum" filterable placeholder="选择物料" @change="filterMaterial">
                <el-option v-for="item in srcTenantMaterials" :key="item.materialNum" :label="item.materialNum" :value="item.materialNum"></el-option>
              </el-select>
              <div class="rightview" v-show="srcTenantMaterial.materialNum">
                <el-input v-model="srcTenantMaterial.nums" placeholder="请输入出库总数量" style="margin-right:10px;" @input="forceUpdate"></el-input>
                <el-button @click="autoSplit">自动拆分</el-button>
              </div>
            </div>
            <div class="table_height"> 
            <table ref="scrollTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
              <thead>
              <tr>
                <th width="30">
                  <el-checkbox v-model="srcTenantMaterial.selectAll" @change="selectAllSrcTenantMaterialCheck()"></el-checkbox>
                </th>
                <th width="30">序号</th>
                <th v-for="hd in srcTenantMateriaHead">{{hd.name}}</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in srcTenantMaterial.materialList">
                <td >
                  <el-checkbox v-model="item.isSelect" @change="changeSrcTenantMaterialCheck"></el-checkbox>
                </td>
                <td>{{index + 1}}</td>
                <td v-for="hd in srcTenantMateriaHead">
                  <el-input v-model="item[hd.code]" v-if="hd.type=='planNums'" placeholder="请输入" @input="srcTenantMaterialInput(item)"></el-input>
                  <span v-else>{{item[hd.code]}}</span>
                </td>
              </tr>
              </tbody>
            </table>
            </div>
    
            <div class="bot-btn">
              <el-button @click="srcTenantMaterialConfirm(false)">取消</el-button>
              <el-button type="primary" @click="srcTenantMaterialConfirm(true)" v-if="!modifyRemark">确定</el-button>
            </div>
          </el-dialog>
    </div>

    

</template>

<script>
import addOrUpdateOutOrder from './addOrUpdateOutOrder.js'

export default addOrUpdateOutOrder
</script>
<style lang="scss" scoped>
#addOrUpdateOutOrder {
    .add {
        vertical-align: middle;
        @include add;
    }

    .del {
        vertical-align: middle;
        @include del;
    }

    .textareaFocus {
        position: relative;
        z-index: 99;

        .el-textarea__inner {
            height: 60px !important;
            border: 1px solid #DCDFE6 !important;
            box-sizing: border-box;
        }
    }
    /deep/ .scrollTableComponents{
        border:$border;
    }
    /deep/ .dbTable {
        .table_height {
            height: 350px;
        }
    }
    .operateDialog{
        .custDialogTitle{
            line-height: 24px;
            .title{
                font-size: 18px;
                color: #333;
                margin-right: 20px;
            }
            em{
                margin-right: 10px;
                font-size: 12px;
            }
        }
    }
    /deep/ .splitDialog{
        .el-input__inner{
          text-align: center;
        }
      
    }
    /deep/ .dbTable{
        .leftTable{
            th{
                // .el-icon-circle-plus{
                //     display: none;
                // }
            }
        }
    }
    /deep/ .srcTenantMaterialDialog{
      .searchView{
        display: flex;
        justify-content: space-between;
        .el-select{
          width: 250px;
        }
        .rightview{
          display: flex;
        }
      }
      .table_height{
        max-height: 400px;
        overflow: auto;
      }
      .tableCommon{
        margin-top: 10px;
        border:$border;
      }
    }
}
</style>

