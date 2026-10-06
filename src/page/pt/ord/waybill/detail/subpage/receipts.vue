<template>
      <div id="receipts">
        <h3 class="common-title mt_20">
          <span class="title-name">单据管理</span>
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
              </td>
            </tr>
            </tbody>
          </table>
        </div>
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
