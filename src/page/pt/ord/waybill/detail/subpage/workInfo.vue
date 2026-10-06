<template>
      <div id="workInfo"  class="clearfix infoTable">
        <div class="leftTitle" :style="'height:'+((workInfo.length+1)*35.2)+'px;'">作业点信息</div>
        <div class="innerTable" style="position: relative;">
          <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
            <tr>
              <th width="50">作业顺序</th>
              <th width="100">作业点</th>
              <th width="50">作业内容</th>
              <th width="120">要求运作时间</th>
              <th width="100">联系人</th>
              <th width="100">联系手机</th>
              <th width="100">联系电话</th>
              <th width="200">详细地址</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) in workInfo">
              <!-- 作业顺序 -->
              <td>
                {{ index+1 }}
              </td>
              <!-- 作业点 -->
              <td @click="showMergeWorkDialog(item.mergeWorkList)">
                <el-tooltip effect="dark" content="查看合并作业点" placement="top-start" :hide-after='1000' v-if="item.mergeWorkList&&item.mergeWorkList.length>0">
                  <img src="@/static/image/list.png" class="list_icon" alt="">
                </el-tooltip>
                {{item.workName}}
              </td>
              <!-- 作业内容 -->
              <td>{{item.workTypeName}}</td>
              <!-- 要求运作时间 -->
              <td>{{item.workDate}}</td>
              <td>{{item.linkmanName}}</td>
              <td>{{item.bill}}</td>
              <td>{{item.phone}}</td>
              <!-- 详细地址 -->
              <td>{{item.workAddress}}</td>
            </tr>
            </tbody>
          </table>
        </div>

        <el-dialog title="查看合并作业点"  :visible.sync="mergeWorkDialogShow" :close-on-click-modal="false" :close-on-press-escape="false"
                   width="780px" @close="mergeWorkDialogShow=false">
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
              <thead>
              <tr>
                <th width="50">序号</th>
                <th width="100">订单号</th>
                <th width="100">作业点</th>
                <th width="200">详细地址</th>
                <th width="100">联系人</th>
                <th width="100">联系手机</th>
                <th width="100">联系电话</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item,index) in mergeWorkList">
                <!-- 作业顺序 -->
                <td>
                  {{ index+1 }}
                </td>
                <!-- 作业点 -->
                <td>
                  {{item.orderNum}}
                </td>
                <!-- 作业点 -->
                <td>{{item.workName}}</td>
                <!-- 详细地址 -->
                <td>{{item.workAddress}}</td>
                <td>{{item.linkmanName}}</td>
                <td>{{item.bill}}</td>
                <td>{{item.phone}}</td>
              </tr>
              </tbody>
            </table>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="mergeWorkDialogShow=false">关闭</el-button>
          </div>
        </el-dialog>

      </div>
</template>

<script>
import workInfo from './workInfo.js'
export default workInfo
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>
