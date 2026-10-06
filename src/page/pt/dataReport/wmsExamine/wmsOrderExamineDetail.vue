<template>
  <div id="wmsOrderExamineDetail" class="wmsOrderExamineDetail">
    <div class="common-info clearfix">
        <h3>基本信息</h3>
        <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td class="label">入库类型</td>
                <td class="value" colspan="2">
                  <el-input v-model="info.baseInfo.orderTypeName"  :disabled="true"></el-input>
                </td>
                <td class="label">单号</td>
                <td class="value" colspan="2">
                  <el-input v-model="info.baseInfo.orderNum" :disabled="true"></el-input>
                </td>
                <td class="label">货主名称</td>
                <td class="value" colspan="2">
                  <el-input v-model="info.baseInfo.tenantName" :disabled="true"></el-input>
                </td>
            </tr>
          <tr>
            <td class="label">仓库名称</td>
            <td class="value" colspan="2">
              <el-input v-model="info.baseInfo.workName" :disabled="true"></el-input>
            </td>
            <td class="label">核查状态</td>
            <td class="value" colspan="2">
              <el-input v-model="info.baseInfo.stsName" :disabled="true"></el-input>
            </td>
            <td class="label">总托数</td>
            <td class="value" colspan="2">
              <el-input v-model="info.baseInfo.totalPalletNums" :disabled="true"></el-input>
            </td>
          </tr>
        </table>
        <div class="tableItem" style="margin-top: 10px;">
            <h3>
              <span>核查操作记录</span>
            </h3>
          <div style="overflow: auto;height:calc(100% - 40px); ">
            <table ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                      <th width="50" rowspan="2">序号</th>
                      <th :width="hd.width" v-for="(hd,index) in head" :key="index">
                        {{hd.name}}
                      </th>
                    </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,idx) in info.examineItemList" :key="idx">
                      <td>{{idx+1}}</td>
                      <td :width="hd.width" v-for="(hd,index) in head" :key="index">
                          <div v-if="'imgUrl'==hd.code&&item[hd.code]!=null&&item[hd.code]!=''">
                            <a href="javascript:void(0);" class="link" @click.stop="showBigImg(item)">查看图片</a>
                          </div>
                          <span v-else>{{item[hd.code]}}</span>
                      </td>
                  </tr>
                </tbody>
            </table>
          </div>
        </div>
        
        <div class="bot-btn" style="margin-top: 20px;">
            <el-button @click="closePage">取消</el-button>
        </div>

      <!-- 查看大图 -->
      <fileViewer ref="viewer" :url-list="srcList"></fileViewer>
    </div>
  </div>
</template>

<script>
import wmsOrderExamineDetail from "./wmsOrderExamineDetail.js";
export default wmsOrderExamineDetail;
</script>
<style src="./wmsOrderExamineDetail.scss" lang="scss" scoped></style>
