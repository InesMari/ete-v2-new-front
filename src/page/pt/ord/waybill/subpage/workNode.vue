<template>
      <div id="workNode" style="margin-top: -50px;">
        <h3 class="common-title mt_20">
          <span class="title-name">派车单号:{{workinfo.waybillNum}}&nbsp;&nbsp;&nbsp;司机:{{workinfo.driverName}}&nbsp;&nbsp;车牌号码:{{workinfo.plateNumber}}</span>
        </h3>
        <div class="tickManager" style="overflow: auto;">
          <table class="tableCommon" style="table-layout: fixed;" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
            <tr>
              <th width="30px;">序号</th>
              <th width="120px;">作业点名称</th>
              <th width="260px;">详细地址</th>
              <th width="80px;">节点内容</th>
              <th width="80px;">操作人</th>
              <th width="130px;">操作时间</th>
              <th width="174px;">运作时间</th>
              <th width="80px;">操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in workNodeList" :key="index">
              <td>{{index+1}}</td>
              <td>{{item.workName}}</td>
              <td>{{item.workAddress}}</td>
              <td>{{item.nodeName}}</td>
              <td>{{item.opUserName}}</td>
              <td>{{item.opDate}}</td>
              <td>
                <el-date-picker v-if="item.type==1" @input="$forceUpdate" v-model="item.workDate" type="datetime"
                                placeholder="选择日期时间" align="right"
                                :picker-options='pickerOptions' style="width: 100%"
                                value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
                <span v-else>{{item.workDate}}</span>
              </td>
              <td class="lastTd">
                <a href="javascript:;" class="link" v-show="item.opName" @click="opWorkNode(item,index)">{{item.opName}}</a>
              </td>
            </tr>
            </tbody>
          </table>
        </div>

        <div class="page-bot-btn ">
          <el-button size="mini" @click="close">关闭</el-button>
        </div>
      </div>

</template>

<script>
import workNode from './workNode.js'
export default workNode
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>
