<template>
      <div id="receipts">
        <h3 class="common-title mt_20">
          <span class="title-name">单据管理</span>
          <el-tooltip effect="dark" content="上传单据" placement="top-start" :hide-after='1000'>
            <img src="@/static/image/upload.png" class="upload_icon" alt="" @click="showUploadDialog">
          </el-tooltip>
        </h3>
        <div class="tickManager">
          <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
            <tr>
              <th>序号</th>
              <th>单据类型</th>
              <th>上传时间</th>
              <th>上传人员</th>
              <th>图片</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in ticketList" :key="index">
              <td>{{index+1}}</td>
              <td>{{item.receiptsTypeName}}</td>
              <td>{{item.createDate}}</td>
              <td>{{item.createUserName}}</td>
              <td class="lastTd">
                <a href="javascript:;" class="link" @click="showTickerImg(item.fullPath)">{{item.fileName}}</a>
                <div class="operate" @click="delImg(index)">
                  <el-tooltip effect="dark" content="删除图片" placement="top-start" :hide-after='1000'>
                    <span class="del"></span>
                  </el-tooltip>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <!--
            上传单据
            successCallback     成功回调
            types   上传类型汇总数组，codeName和codeValue为固定key，子组件需拿其匹配
        -->
        <imgsUpload ref="imgsUpload" v-if="isshowUploadDialog" @successCallback="imgCallback"
                    :types="[{codeName:'提货凭证',codeValue:3},{codeName:'货物清单',codeValue:4},{codeName:'其他单据',codeValue:9}]"></imgsUpload>
        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>
      </div>

</template>

<script>
import receipts from './receipts.js'
export default receipts
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>
