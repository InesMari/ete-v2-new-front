<template>
  <div id="viewQrcodeBars" class="viewQrcodeBarsPage">
    <div class="common-info clearfix">
        <div class="tableItem" style="margin-top: 10px;">
            <table ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead class="fixed-thead">
                    <tr>
                      <th width="120">物料编码</th>
                      <th width="150">物料描述</th>
                      <th width="100">规格名称</th>
                      <th width="150">批次号</th>
<!--                      <th width="120">入库时间</th>-->
                      <th width="100">库区</th>
                      <th width="100">库位</th>
                      <th width="100">在库数量</th>
                    </tr>
                </thead>
              <tbody class="fixed-tbody">
              <tr v-for="(item,idx) in batchList" :key="idx">
                <td width="120">{{item.materialNum}}</td>
                <td width="150">{{item.materialDesc}}</td>
                <td width="100">{{item.specsName}}</td>
                <td width="150">{{item.batchNum}}</td>
<!--                <td width="120">{{item.inDate}}</td>-->
                <td width="100">{{item.reservoirName}}</td>
                <td width="100">{{item.storageCode}}</td>
                <td width="100">{{item.actualStockNums}}</td>
              </tr>
              </tbody>
            </table>
        </div>
        <div class="common-info clearfix" style="border:none;padding:0;margin-top: 20px;height:calc(100% - 160px);">
          <ul class="content clearfix">
            <li class="item">
              <label class="label-term">每张条码数量:</label>
              <div class="input-text">
                <el-input v-model="nums" maxlength="30" v-mydoubleval  placeholder="请输入每张条码数量" :disabled="true"></el-input>
              </div>
            </li>
            <li class="item">
              <label class="label-term">条码张数:</label>
              <div class="input-text">
                <el-input v-model="sheets" maxlength="30" placeholder="自动计算" :disabled="true"></el-input>
              </div>
            </li>
          </ul>
          <div class="common-info clearfix" style="border:none;padding:0;margin-top: 20px;height:calc(100% - 90px);">
          <div class="tableItem" style="height: 100%;" v-if="codeList.length>0">
            <simpleTable ref="table" :head="head" :data="codeList" singleSelect="true" :no-select="true" :no-index="true" v-if="newScanQrcode==0">
              <template v-slot="{item,code}">
                <div v-if="code=='codeNum'">
                  <a class="link">{{item.codeNum}}</a>
                </div>
                <div v-if="code=='qrcodeUrl'">
                  <img :src="item.qrcodeUrl" alt="" width="100%" height="100%" @click="showQrcodeUrl(item)">
                </div>
                <div v-if="code=='modify'&&!item.isTotal" v-show="showQrcode">
                  <a class="link" @click="qrcodeModify(item)">条码修改</a>
                </div>
              </template>
            </simpleTable>
            
            <simpleTable ref="table" :head="newHead" :data="codeList" singleSelect="true" :no-select="true" :no-index="true" v-if="newScanQrcode==1">
              <template v-slot="{item,code}">
                <div v-if="code=='codeNum'">
                  <a class="link" @click="toTagPrint(item)">{{item.codeNum}}</a>
                </div>
                <div v-if="code=='orderNum'">
                  <a class="link" @click="toInOrderDetail(item.inOrderId)">{{item.inOrderNum}}</a>
                </div>
                <div v-if="code=='custQrcodeNums'">
                  <a class="link" @click="toCustCodeDetail(item.id)">{{item.custQrcodeNums}}</a>
                </div>
              </template>
            </simpleTable>
          </div>
          </div>
        </div>
        <div class="bot-btn" style="margin-top: 20px;">
            <el-button @click="closePage">关闭</el-button>
        </div>
    </div>
    <!-- 查看大图 -->
    <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

    <!-- 条码修改 begin-->
    <el-dialog title="条码修改" :visible.sync="qrcodeModifyShow" width="400px" :close-on-click-modal="false"
               :close-on-press-escape="false" @close="showQrcodeModify(false)">
      <div class="fcCommonPage">
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix;">
            <li class="item item100">
              <label class="label-term">旧条码编号</label>
              <div class="input-text">
                <el-input v-model="info.codeNum" maxlength="200" placeholder="" @input="$forceUpdate();" :disabled="true" ></el-input>
              </div>
            </li>
          </ul>
          <ul class="content clearfix;">
            <li class="item item100">
              <label class="label-term">条码数量</label>
              <div class="input-text">
                <el-input v-model="info.nums" maxlength="200" placeholder="" @input="$forceUpdate();" :disabled="true" ></el-input>
              </div>
            </li>
          </ul>
          <ul class="content clearfix">
            <li class="item item100">
              <label class="label-term">新条码编号</label>
              <div class="input-text">
                <el-input v-model="info.newCodeNum" maxlength="200" placeholder="" @input="$forceUpdate();" ></el-input>
              </div>
            </li>
          </ul>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="showQrcodeModify(false)">关闭</el-button>
            <el-button type="primary" size="mini" @click="sureQrcodeModify()">确定</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 条码修改 end-->
  </div>
</template>

<script>
import viewQrcodeBars from "./viewQrcodeBars.js";
export default viewQrcodeBars;
</script>
<style src="./viewQrcodeBars.scss" lang="scss" scoped></style>
