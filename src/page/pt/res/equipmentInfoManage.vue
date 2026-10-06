<template>
    <div id="equipmentInfoManage" class="equipmentInfoManagePage" @click="unShow">
        <innerTab :tabs="tabs" @selectCallback="selectCallback"></innerTab>
        <keep-alive>
          <component v-if="equipmentType==0" :is="componentName" style="height: calc(100% - 41px)"></component>
        </keep-alive>
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" searchKey="equipmentInfoManageSearch" v-if="equipmentType!=0"></searchList>

        <!--        设备列表        -->
        <div class="table-content" v-show="equipmentType!=0">
            <div class="table-title">
                <h3>
                    <span>设备列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="设备列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <div v-show="equipmentType==1">
                        <el-button type="primary" plain size="mini" @click="uploadOpen = true" v-entity="1002043">设备导入</el-button>
                        <el-button type="primary" plain size="mini" @click="uploadOpenTime = true" v-entity="1002044">更新卡到期日期</el-button>
                        <el-button type="primary" plain size="mini" @click="add(true)" v-entity="1002045">新增</el-button>
                        <el-button type="primary" plain size="mini" @click="modify(1)" v-entity="1002046">修改</el-button>
                        <el-button type="danger" plain size="mini" @click="del()" v-entity="1002047">删除</el-button>
                        <el-button type="primary" plain size="mini" @click="toShowSell(true)" v-entity="1002048">销售</el-button>
                        <el-button type="primary" plain size="mini" @click="toShowBand(true)" v-entity="1002049">绑定车辆</el-button>
                        <el-button type="primary" plain size="mini" @click="cancleBandEquipment()" v-entity="1002050">解绑车辆</el-button>
                        <el-button type="primary" plain size="mini" @click="gotoLog">查看日志</el-button>
                    </div>
                    <div v-show="equipmentType==2">
                        <el-button type="primary" plain size="mini" @click="uploadOpen = true" v-entity="1002051">设备导入</el-button>
                        <el-button type="primary" plain size="mini" @click="toShowSinoiovQuery(true)" v-entity="1002052">入网查询</el-button>
                        <el-button type="primary" plain size="mini" @click="add(true)" v-entity="1002053">新增</el-button>
                        <el-button type="primary" plain size="mini" @click="modify(1)" v-entity="1002054">修改</el-button>
                        <el-button type="danger" plain size="mini" @click="del()" v-entity="1002055">删除</el-button>
                        <el-button type="primary" plain size="mini" @click="gotoLog">查看日志</el-button>
                    </div>
                    <div v-show="equipmentType==3">
                        <el-button type="primary" plain size="mini" @click="uploadOpen = true" v-entity="1002056">设备导入</el-button>
                        <el-button type="primary" plain size="mini" @click="uploadOpenTime = true" v-entity="1002057">更新卡到期日期</el-button>
                        <el-button type="primary" plain size="mini" @click="openLock" v-entity="1002058">远程开锁</el-button>
                        <el-button type="primary" plain size="mini" @click="add(true)" v-entity="1002059">新增</el-button>
                        <el-button type="primary" plain size="mini" @click="modify(1)" v-entity="1002060">修改</el-button>
                        <el-button type="danger" plain size="mini" @click="del()" v-entity="1002061">删除</el-button>
                        <el-button type="primary" plain size="mini" @click="toShowSell(true)" v-entity="1002062">销售</el-button>
                        <el-button type="primary" plain size="mini" @click="toShowBand(true)" v-entity="1002063">绑定车辆</el-button>
                        <el-button type="primary" plain size="mini" @click="cancleBandEquipment()" v-entity="1002064">解绑车辆</el-button>
                        <el-button type="primary" plain size="mini" @click="showRFID = true" v-entity="1002065">RFID卡授权</el-button>
                        <el-button type="primary" plain size="mini" @click="setLockIP" v-entity="1002066">IP设置</el-button>
                        <el-button type="primary" plain size="mini" @click="gotoLog">查看日志</el-button>
                    </div>
                    <div v-show="equipmentType==6">
                        <el-button type="primary" plain size="mini" @click="toShowSinoiovQuery(true, 2)" v-entity="1002210">定位查询</el-button>
                        <el-button type="primary" plain size="mini" @click="add(true)" v-entity="1002098">新增</el-button>
                        <el-button type="primary" plain size="mini" @click="modify(1)" v-entity="1002099">修改</el-button>
                        <el-button type="danger" plain size="mini" @click="del()" v-entity="1002100">删除</el-button>
                        <el-button type="primary" plain size="mini" @click="gotoLog">查看日志</el-button>
                    </div>
                    <div v-show="equipmentType==4 || equipmentType==5 || equipmentType==7 || equipmentType==8 || equipmentType==9 || equipmentType==10 || equipmentType==11">
<!--                        <el-button type="primary" plain size="mini" @click="gotoLog">查看日志</el-button>-->
                    </div>
                </div>
            </div>
            <tableCommon :tableName="'equipmentInfoManageTable' + equipmentType" ref="table" :head="head" :single-select="true" :showNum="true" :showSetTable="true" @dblclickItem="dblclickItem">
              <template v-slot:default="{item}">
<!--                <a href="javascript:void(0);" class="link" @click.stop="modify(2,item)" style="margin: 0 10px;">设备详情</a>-->
                <a href="javascript:void(0);" class="link" @click.stop="toMonitor(item)" style="margin: 0 10px;">查看位置</a>
                <a href="javascript:void(0);" v-if="common.isNotBlank(item.subLockIds)" class="link" @click.stop="showLock(item)" style="margin: 0 10px;">查看子锁</a>
                <el-popover
                    placement="right"
                    width="650"
                    v-model="item.logShow"
                    v-if="equipmentType==3"
                    trigger="manual">
                  <scrollTable :ref="'logTable'+item.id" :head="logHead" :doSum="false"/>
                  <a href="javascript:void(0);" class="link" slot="reference" @click.stop="show(item)">开关锁日志</a>
                </el-popover>
              </template>
            </tableCommon>
        </div>


        <!-- 设备批量导入 -->
        <my-import :open.sync="uploadOpen" :handle-success="doQuery" template="/download/equipment.xlsx" title="设备导入"
                   bean="equipmentTF" method="impAddEquipmentInfo" repeatCheckNums="1" :param="impParam"></my-import>
        <!-- 设备更新时间批量导入 -->
         <my-import :open.sync="uploadOpenTime" :handle-success="doQuery" template="/download/equipmentTime.xlsx" title="更新卡到期日期"
                 bean="equipmentTF" method="impUpEquipmentTime" repeatCheckNums="0" :param="impParam"></my-import>

        <!-- 新增 设备 begin-->
        <el-dialog :title="title" :visible.sync="showModify" width="540px" :close-on-click-modal="false" :close-on-press-escape="false" @close="add">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item">
                        <label class="label-term"><em>*</em>设备型号</label>
                        <div class="input-text">
                          <el-select v-model="equipmentInfo.equipmentModel" clearable placeholder="" :disabled="isLook">
                            <el-option v-for="item in equipmentModelData_" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                          </el-select>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term"><em>*</em>设备类型</label>
                        <div class="input-text">
                            <el-select v-model="equipmentInfo.equipmentType" placeholder="" :disabled="true">
                                <el-option v-for="item in equipmentTypeData_" :key="item.codeValue" :label="item.codeName"
                                           :value="item.codeValue"></el-option>
                            </el-select>
                        </div>
                    </li>
                </ul>
                <ul class="content clearfix">
                    <li class="item">
                        <label class="label-term" v-if="!isMarking"><em>*</em>设备编号</label>
                        <label class="label-term" v-if="isMarking">设备编号</label>
                        <div class="input-text">
                            <el-input v-model="equipmentInfo.equipmentNumber" maxlength="100" placeholder="" :disabled="isLook || isMarking"></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term" v-if="equipmentType!=2">车牌号码</label>
                        <label class="label-term" v-if="equipmentType==2"><em>*</em>车牌号码</label>
                        <div class="input-text">
                            <el-select v-model="equipmentInfo.vehicleId" placeholder="" filterable clearable :disabled="isLook || isUpdate">
                              <el-option v-for="item in vehicleData" :key="item.id" :label="item.plateNumber"
                                         :value="item.id"></el-option>
                            </el-select>
                        </div>
                    </li>
                </ul>
                <ul class="content clearfix" v-if="!isAdd">
                    <li class="item">
                      <label class="label-term">使用开始日期</label>
                      <div class="input-text">
                        <el-date-picker v-model="equipmentInfo.equipmentStartTime" type="date" placeholder="" value-format="yyyy-MM-dd"
                                        :picker-options="pickerOptions" :disabled="isLook" @change="changeStartDate"></el-date-picker>
                      </div>
                    </li>
                    <li class="item">
                      <label class="label-term">使用到期日期</label>
                      <div class="input-text">
                        <el-date-picker v-model="equipmentInfo.equipmentEndTime" type="date" placeholder="" value-format="yyyy-MM-dd"
                                        :picker-options="pickerOptions_" :disabled="isLook"></el-date-picker>
                      </div>
                    </li>
                </ul>
                <ul class="content clearfix">
                    <li class="item">
                      <label class="label-term">SIM卡号</label>
                      <div class="input-text">
                        <el-input v-model="equipmentInfo.SIMCard" maxlength="50" placeholder="" :disabled="isLook"></el-input>
                      </div>
                    </li>
                    <li class="item">
                      <label class="label-term">卡到期日期</label>
                      <div class="input-text">
                        <el-date-picker v-model="equipmentInfo.SIMExpireTime" type="date" placeholder="" value-format="yyyy-MM-dd"
                                        :picker-options="pickerOptions" :disabled="isLook"></el-date-picker>
                      </div>
                    </li>
                </ul>
                <ul class="content clearfix">
                    <li class="item item100">
                      <label class="label-term">备注</label>
                      <div class="input-text">
                        <el-input v-model="equipmentInfo.remark" type="textarea" maxlength="200" placeholder="" :disabled="isLook"></el-input>
                      </div>
                    </li>
                </ul>
                <ul class="content clearfix"  v-if="equipmentInfo.equipmentModel==8">
                  <li class="item item100">
                    <label class="label-term">子锁编号</label>
                    <div class="input-text">
                      <el-input v-model="equipmentInfo.subLockIds" type="textarea" placeholder="逗号隔开" maxlength="200" @input="forceUpdate" :disabled="isLook"></el-input>
                    </div>
                  </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="add(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="saveEquipmentInfo()" v-if="!isLook">提交</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 新增 设备 end-->

        <!-- 子锁清单 -->
      <el-dialog class="lockDialog" title="子锁清单" :visible.sync="isshowLock" width="840px">
        <ul class="lockList">
          <li class="item"  v-for="(item,index) in subLocks">
            <div class="lockIcon" v-show="item.lock==1" @click="unlock(index)">
              <img src="@/static/image/lock1.jpg" alt="">
              <p>点击解锁</p>
            </div>
            <div class="lockIcon" v-show="item.lock==2">
              <img class="rotate" src="@/static/image/lock2.jpg" alt="">
              <p>正在解锁</p>
            </div>
            <div class="lockIcon" v-show="item.lock==3">
              <img src="@/static/image/lock3.jpg" alt="">
              <p>已解锁</p>
            </div>
            <div class="name">
              子锁名称：<el-input v-model="item.subLockName" placeholder="可自定义输入" @blur="saveSubLockName(item.subLockId,item.subLockName)"></el-input>
            </div>
            <div class="num">子锁编号：{{ item.subLockId }}</div>
          </li>
        </ul>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="isshowLock=false">关闭</el-button>
        </div>
      </el-dialog>

        <!-- 绑定 设备 begin-->
        <el-dialog title="绑定设备"  :visible.sync="showBandEquipment" :close-on-click-modal="false" :close-on-press-escape="false"
                   width="820px" @close="toShowBand(false)">
          <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQueryBand">
              <div class="item" style="width: 50%">
                <div class="input-text" style="width: 100%;">
                  <el-input v-model="bandParam.equipmentData" placeholder="输入设备编号查询(多个回车换行查询)" :class="{'equipmentFocus':equipmentFocus}"
                            @focus="setEquipmentFocus" @blur="setEquipmentFocus" @input="forceUpdate" type="textarea"></el-input>
                </div>
              </div>
              <div class="item" style="width: 50%">
                <div class="input-text" style="width: 100%;">
                  <el-select v-model="bandParam.equipmentModel" placeholder="设备型号" filterable clearable>
                    <el-option v-for="item in equipmentModelData_" :key="item.codeValue" :label="item.codeName"
                               :value="item.codeValue"></el-option>
                  </el-select>
                </div>
              </div>
<!--              <div class="item" style="width: 50%">-->
<!--                <div class="input-text" style="width: 100%;">-->
<!--                  <el-select v-model="bandParam.equipmentType" placeholder="设备类型" filterable clearable>-->
<!--                    <el-option v-for="item in equipmentTypeData" :key="item.codeValue" :label="item.codeName"-->
<!--                               :value="item.codeValue"></el-option>-->
<!--                  </el-select>-->
<!--                </div>-->
<!--              </div>-->
            </div>
            <div class="search-btn clearfix">
              <div class="btn">
                <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQueryBand()">查询</el-button>
              </div>
              <div class="btn">
                <el-button type="danger" plain size="mini" icon="el-icon-close" @click="clearBand()">清空</el-button>
              </div>
            </div>
          </div>
          <div class="table-content">
            <tableCommon class="arriveWorkTable" tableName="equipmentBandTable" ref="bandTable"
                         :showNum="true" :showSetTable="false" :head="bandHead" :singleSelect="true" @blurBack="blurBack">
              <template v-slot:default="{item,code}">
                {{item[code]}}<a class="link" v-if="item.bandType==2" @click="cancleBandEquipment_(item['plateNumber'],item['equipmentModel'])">解绑</a>
              </template>
            </tableCommon>
          </div>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="toShowBand(false)">关闭</el-button>
            <el-button type="primary" size="mini" @click="bandEquipment()">确认</el-button>
          </div>
        </el-dialog>
      <!-- 绑定 设备 end-->

        <!-- 销售 设备 begin-->
        <el-dialog title="销售设备"  :visible.sync="showSellEquipment" :close-on-click-modal="false" :close-on-press-escape="false"
                   width="780px" @close="toShowSell(false)">
          <div class="search-list clearfix">
            <div class="search-form clearfix" style="overflow: initial;">
              <div class="item" style="width: 50%">
                <label class="label"><em>*</em>已选设备：</label>
                <div class="input-text" style="line-height: 35px;">
                  {{sellParam.equipmentCount}}
                </div>
              </div>
              <div class="item" style="width: 50%">
                <label class="label"><em>*</em>销售到：</label>
                <div class="input-text">
                  <el-select v-model="sellTenantId" placeholder="" filterable>
                    <el-option v-for="item in tenantData" :key="item.tenantId" :label="item.supplierName"
                               :value="item.tenantId"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="item" style="width: 100%">
                <div class="input-text" style="width: 100%">
                  <el-input v-model="sellParam.equipmentNumberData" placeholder="输入设备编号查询(多个回车换行查询)" :class="{'equipmentFocus':equipmentFocus}" @focus="setEquipmentFocus" @blur="setEquipmentFocus" type="textarea"></el-input>
                </div>
              </div>
            </div>
            <div class="search-btn clearfix">
              <div class="btn">
                <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuerySell(2)">查询</el-button>
              </div>
              <div class="btn">
                <el-button type="danger" plain size="mini" icon="el-icon-close" @click="clearSell()">清空</el-button>
              </div>
            </div>
          </div>
          <div class="table-content">
            <div style="max-height:300px;overflow: auto;">
              <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                  <th width="60%">设备编号</th>
                  <th width="30%">设备类型</th>
                  <th width="10%">操作</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item,index) in sellQuipmentData" :key="index">
                  <td>{{item.equipmentNumber}}</td>
                  <td>{{item.equipmentTypeName}}</td>
                  <td><a class="link" @click="delSellEquipment(index)">删除</a></td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="toShowSell(false)">关闭</el-button>
            <el-button type="primary" size="mini" @click="sellEquipment()">确认</el-button>
          </div>
        </el-dialog>
      <!-- 销售 设备 end-->

      <!-- 部标机查询  begin-->
      <el-dialog :title="title2"  :visible.sync="showSinoiovQuery" :close-on-click-modal="false" :close-on-press-escape="false"
                 width="980px" @close="toShowSinoiovQuery(false)">
        <div class="search-list clearfix">
          <div class="search-form clearfix" style="overflow: initial;">
            <div class="item" style="width: 50%">
              <label class="label"><em>*</em>车牌号码：</label>
              <div class="input-text">
                <el-input v-model="sinoiovPlateNumber" placeholder="请输入车牌号码"></el-input>
              </div>
            </div>
            <div class="item" style="width: 50%">
              <label class="label">地址：</label>
              <div class="input-text">
                <el-input v-model="addressStr" placeholder="输入目的地地址查询"></el-input>
              </div>
            </div>
          </div>
          <div class="search-btn clearfix">
            <div class="btn">
              <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doSinoiovQuery()">查询</el-button>
            </div>
            <div class="btn">
              <el-button type="danger" plain size="mini" icon="el-icon-close" @click="clearSinoiovQuery()">清空</el-button>
            </div>
          </div>
        </div>
        <div class="table-content">
          <div style="max-height:300px;overflow: auto;">
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
              <thead>
              <tr>
                <th width="5%" v-show="equipmentType == 2">入网结果</th>
                <th width="10%">最后定位时间</th>
                <th width="60%">定位位置</th>
                <th width="10%">派车单号</th>
                <th width="10%">预计到达时间</th>
                <th width="5%">剩余公里数</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td  v-show="equipmentType == 2">{{sinoiovVclResult.vExist}}</td>
                <td>{{sinoiovVclResult.gpsTime}}</td>
                <td>{{sinoiovVclResult.gpsLocation}}</td>
                <td>{{sinoiovVclResult.waybillNum}}</td>
                <td>{{sinoiovVclResult.duration}}</td>
                <td>{{sinoiovVclResult.distance}}</td>
              </tr>
              </tbody>
            </table>
          </div>
          <!-- 地图 -->
          <div class="bm-view" v-show="sinoiovVclResult.lng">
            <div id="mapId" style="width:100%;height:400px;"></div>
          </div>
        </div>
        <div class="page-bot-btn ">
          <el-button size="mini" @click="toShowSinoiovQuery(false)">关闭</el-button>
        </div>
      </el-dialog>
      <!-- 部标机查询 设备 end-->

      <!-- RFID卡授权 begin-->
      <el-dialog title="RFID卡授权"  :visible.sync="showRFID" :close-on-click-modal="false" :close-on-press-escape="false"
                 width="550px" @close="toShowRFID(false)" id="rfidDialog">
        <div class="search-list clearfix" style="border:none;">
          <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix">
            <li class="item">
              <label class="label-term"><em>*</em>电子锁号:</label>
              <div class="input-text">
                <el-input v-model="rfidInfo.lockId" maxlength="50" placeholder="请输入电子锁号"></el-input>
              </div>
            </li>
            <li class="item">
              <el-button style="margin-top:6px;width: 100px;border-color: #1990ff;color: #1990ff;background: #fff" size="mini" @click="qryRfidCardDirect">获取授权卡号</el-button>
            </li>
          </ul>
          <ul class="content clearfix">
            <li class="item">
              <label class="label-term"><em>*</em>授权卡号:</label>
              <div class="input-text">
                <el-input v-model="rfidInfo.cardId" maxlength="50" placeholder="请输入授权卡号" ></el-input>
              </div>
            </li>
            <li class="item">
              <el-button style="margin-top:6px;width: 100px;border-color: #1990ff;color: #1990ff;background: #fff" size="mini" @click="addRfidCardDirect">确定新增</el-button>
            </li>
          </ul>
        </div>
        </div>
        <div class="table-content">
          <div style="max-height:250px;overflow: auto;">
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
              <thead>
              <tr>
                <th width="20%">序号</th>
                <th width="60%">授权卡号</th>
                <th width="20%">操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item,index) in rfidDatas" :key="index">
                <td>{{index+1}}</td>
                <td>{{item}}</td>
                <td><a class="link" @click="delRfidCardDirect(item)">删除</a></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </el-dialog>
      <!-- RFID卡授权 end-->


        <el-dialog :title="lockTitle" :visible.sync="showSetLockIp" width="700px" :close-on-click-modal="false" :close-on-press-escape="false" >
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item" style="min-width: 400px;margin-right:0">
                        <label class="label-term" ><em>*</em>IP地址</label>
                        <div class="input-text">
                            <el-input v-model="lock.ip" placeholder="请输入IP或者网址"></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term" ><em>*</em>端口号</label>
                        <div class="input-text">
                            <el-input v-model="lock.port" maxlength="5" v-mynumval placeholder="端口号" ></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="closeDialog(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="saveLockIP()">提交</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import equipmentInfoManage from './equipmentInfoManage.js'

    export default equipmentInfoManage
</script>
<style lang="scss">
.equipmentInfoManagePage{
  .search-form {
    .item {
      .el-textarea__inner {
        height: 30px;
        border:none;
        resize: none;
        line-height: 20px;
        &::placeholder{
          font-size: 12px;
          line-height: 24px;
        }
      }
    }
  }
  .equipmentFocus{
    position: relative;
    z-index: 99;
    .el-textarea__inner {
      height: 60px!important;
      border: 1px solid #DCDFE6!important;
      box-sizing: border-box;
    }
  }
  // 子锁清单
  .lockDialog{
    .lockList{
      text-align: center;
      .item{
        display: inline-block;
        width: 200px;
        margin-bottom: 15px;
        .lockIcon{
          cursor: pointer;
          margin:0 auto;
          width: 95px;
          height: 95px;
          border-radius: 50%;
          border:1px solid #ccc;
          text-align: center;
          box-sizing: border-box;
          padding-top: 12px;
          .rotate{
            animation:rotateAnim 1s linear infinite;
          }
        }
        .name{
          padding-left: 27px;
          text-align: left;
          .el-input{
            display: inline-block;
            width: 100px;
            .el-input__inner{
              border:none;
              line-height: 28px;
              padding:0 3px;
              height: 28px;
            }
          }
        }
        .num{
          padding-left: 27px;
          text-align: left;
        }
      }
    }
  }
  @keyframes rotateAnim{
    0%{-webkit-transform:rotate(0deg);}
    25%{-webkit-transform:rotate(-90deg);}
    50%{-webkit-transform:rotate(-180deg);}
    75%{-webkit-transform:rotate(-270deg);}
    100%{-webkit-transform:rotate(-360deg);}
  }
}
</style>
