<template>
  <div id="viewCustQrcodeBars" class="viewCustQrcodeBarsPage">
    <div class="common-info clearfix">
        <div class="tableItem" style="margin-top: 10px;">
            <table ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead class="fixed-thead">
                    <tr>
                      <th width="200">标签编号</th>
                      <th width="200">入库单号</th>
                      <th width="100">数量</th>
                      <th width="100">箱数</th>
                    </tr>
                </thead>
              <tbody class="fixed-tbody">
              <tr>
                <td width="200">{{baseInfo.codeNum}}</td>
                <td width="200"><a class="link" @click="toInOrderDetail(baseInfo.inOrderId)">{{baseInfo.inOrderNum}}</a></td>
                <td width="100">{{baseInfo.nums}}</td>
                <td width="100">{{baseInfo.boxNums}}</td>
              </tr>
              </tbody>
            </table>
        </div>
        <div class="common-info clearfix" style="border:none;padding:0;margin-top: 20px;height:calc(100% - 160px);">
          <div class="tableItem" style="height: 100%;" v-if="codeList.length>0">
            <simpleTable ref="table" :head="head" :data="codeList" singleSelect="true" :no-select="true">
            </simpleTable>
          </div>
          </div>
        <div class="bot-btn" style="margin-top: 20px;">
            <el-button @click="toUpdate" v-if="!updateFlg" v-entity="1005241" >修改</el-button>
            <el-button type="success" @click="exportExcel" v-if="!updateFlg">导出</el-button>
            <el-button @click="closePage" v-if="!updateFlg">关闭</el-button>
            <el-button type="success" @click="custQrcodeModify" v-if="updateFlg">保存</el-button>
            <el-button @click="toCancel" v-if="updateFlg">取消</el-button>
        </div>
    </div>
  </div>
</template>

<script>
import viewCustQrcodeBars from "./viewCustQrcodeBars.js";
export default viewCustQrcodeBars;
</script>
<style src="./viewCustQrcodeBars.scss" lang="scss" scoped></style>
