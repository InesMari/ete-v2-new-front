<template>
  <div id="mergeGenerateBar" class="mergeGenerateBarPage" ref="mergeGenerateBar">
    <div class="common-info clearfix">
        <div class="tableItem" ref="tableItem" style="margin-top: 10px;">
          <div style="overflow: auto;">
            <table ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead class="fixed-thead">
                    <tr>
                      <th width="100">库区</th>
                      <th width="100">库位</th>
                      <th width="120">条码编号</th>
                      <th width="100">数量</th>
                      <th width="150">批次号</th>
                      <th width="150">供应商批次号</th>
                      <th width="120">物料编码</th>
                      <th width="150">物料描述</th>
                      <th width="100">规格名称</th>
                      <th width="120">入库时间</th>
                    </tr>
                </thead>
              <tbody class="fixed-tbody">
              <tr v-for="(item,idx) in batchList" :key="idx">
                <td width="100">{{item.reservoirName}}</td>
                <td width="100">{{item.storageCode}}</td>
                <td width="120">{{item.codeNum}}</td>
                <td width="100">{{item.nums}}</td>
                <td width="150">{{item.batchNum}}</td>
                <td width="150">{{item.supplierBatchNum}}</td>
                <td width="120">{{item.materialNum}}</td>
                <td width="150">{{item.materialDesc}}</td>
                <td width="100">{{item.specsName}}</td>
                <td width="120">{{item.inDate}}</td>
              </tr>
              <tr>
                <td width="100">合计</td>
                <td width="100"></td>
                <td width="120"></td>
                <td width="100">{{mergeNums}}</td>
                <td width="150"></td>
                <td width="150"></td>
                <td width="120"></td>
                <td width="150"></td>
                <td width="100"></td>
                <td width="120"></td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="common-info clearfix" ref="bottomInfo" style="border:none;padding:0;margin-top: 20px;overflow: auto;height:calc(100% - 160px);" :style="'height:'+bottomInfoH+'px;'">
          <ul class="content clearfix">
            <li class="item">
              <label class="label-term">每张条码数量:</label>
              <div class="input-text">
                <el-input v-model="nums" maxlength="30" v-mydoubleval  placeholder="请输入每张条码数量"></el-input>
              </div>
            </li>
            <li class="item">
              <label class="label-term">条码张数:</label>
              <div class="input-text">
                <el-input v-model="sheets" maxlength="30" placeholder="自动计算" :disabled="true"></el-input>
              </div>
            </li>
            <li class="item">
              <el-button type="primary" @click="calNums">生成</el-button>
            </li>
          </ul>
          <div class="common-info clearfix" style="border:none;padding:0;margin-top: 20px;height:calc(100% - 90px);">
          <div class="tableItem" style="height: 100%;" v-if="codeList.length>0">
            <simpleTable ref="table" :head="head" :data="codeList" singleSelect="true" :no-select="true" :no-index="true">
              <template v-slot="{item,code}">
                <div v-if="code=='codeNum'">
                  <span style="color: #9e9e9e;">{{item.codeNum}}</span>
                </div>
              </template>
            </simpleTable>
          </div>
          </div>
        </div>
        <div class="bot-btn" style="margin-top: 20px;">
            <el-button @click="closePage">取消</el-button>
            <el-button type="primary" @click="submit">生成并保存</el-button>
        </div>
    </div>

  </div>
</template>

<script>
import mergeGenerateBar from "./mergeGenerateBar.js";
export default mergeGenerateBar;
</script>
<style src="./mergeGenerateBar.scss" lang="scss" scoped></style>
