<template>
      <div id="workInfo"  class="clearfix infoTable">
        <h3 class="common-title">
          <span class="title-name">作业点信息</span>
        </h3>
        <div style="position: relative;">
          <el-tooltip effect="dark" content="调整作业点" placement="top-start" :hide-after='1000' style="right: -30px;">
            <img src="@/static/image/edit.png" class="edit_icon" alt="" @click="showWorkDialog">
          </el-tooltip>
          <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
            <tr>
              <th width="50">作业顺序</th>
              <th width="100">作业点</th>
              <th width="50">作业内容</th>
              <th width="120">要求运作时间</th>
              <th width="120" v-if="dispatchType==4">预计到达时间</th>
              <th width="80">联系人</th>
              <th width="90">联系手机</th>
              <th width="90">联系电话</th>
              <th width="180">详细地址</th>
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
              <td>
                <el-date-picker @input="$forceUpdate" v-model="item.workDate" type="datetime"
                                placeholder="选择日期时间" align="right" :picker-options="pickerOptions"
                                value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </td>
              <td v-if="dispatchType==4">
                <el-date-picker @input="$forceUpdate" v-model="item.expectArriveDate" type="datetime"
                                placeholder="选择日期时间" align="right" :picker-options="pickerOptions"
                                value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
              </td>
              <td>
                <el-input v-model="item.linkmanName" type="text" placeholder="联系人"></el-input>
              </td>
              <td>
                <el-input v-model="item.bill" type="text" placeholder="联系手机"></el-input>
              </td>
              <td>
                <el-input v-model="item.phone" type="text" placeholder="联系电话"></el-input>
              </td>
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


        <el-dialog title="修改作业点顺序"  :visible.sync="workDialogShow" :close-on-click-modal="false" :close-on-press-escape="false"
                   width="780px" @close="workDialogShow=false">
          <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
            <tr>
              <th width="100">作业点</th>
              <th width="200">详细地址</th>
              <th width="100">作业内容</th>
              <th width="100">顺序</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in tmpWorkInfo">
              <!-- 作业点 -->
              <td>{{item.workName}}</td>
              <!-- 详细地址 -->
              <td>{{item.workAddress}}</td>
              <td>{{item.workTypeName}}</td>
              <td>
                <el-input v-model="item.sort" type="text" placeholder="顺序"></el-input>
              </td>
            </tr>
            </tbody>
          </table>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="workDialogShow=false">关闭</el-button>
            <el-button type="primary" size="mini" @click="sortWorkInfo">提交</el-button>
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
