<template>
  <div id="batchGenerateBar" class="batchGenerateBarPage">
    <div class="common-info clearfix">
        <div class="tableItem" style="margin-top: 10px;">
            <h3>
              <span>选择库存明细</span>
            </h3>
          <div style="overflow: auto;height:calc(100% - 40px);">
            <table ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead class="fixed-thead">
                    <tr>
                      <th width="80">序号</th>
                      <th width="120">物料编码</th>
                      <th width="150">物料描述</th>
                      <th width="100">规格名称</th>
                      <th width="180">批次号</th>
                      <th width="120">入库时间</th>
                      <th width="100">库区</th>
                      <th width="100">库位</th>
                      <th width="100">在库数量</th>
                      <th width="100">每张条码数量</th>
                      <th width="100">条码张数</th>
                      <th width="100">生成结果</th>
                    </tr>
                </thead>
              <tbody class="fixed-tbody">
              <tr v-for="(item,idx) in batchList" :key="idx">
                <td width="80">{{idx+1}}</td>
                <td width="120">{{item.materialNum}}</td>
                <td width="150">{{item.materialDesc}}</td>
                <td width="100">{{item.specsName}}</td>
                <td width="180">{{item.batchNum}}</td>
                <td width="120">{{item.inDate}}</td>
                <td width="100">{{item.reservoirName}}</td>
                <td width="100">{{item.storageCode}}</td>
                <td width="100">{{item.stockNums}}</td>
                <td width="100"><el-input v-model="item.nums"  @input="calNums(item)"  v-mydoubleval></el-input></td>
                <td width="100">{{item.sheets}}</td>
                <td width="100">{{item.result}}</td>
              </tr>
              </tbody>
            </table>
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
import batchGenerateBar from "./batchGenerateBar.js";
export default batchGenerateBar;
</script>
<style src="./batchGenerateBar.scss" lang="scss" scoped></style>
