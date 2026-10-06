<template>
    <div id="outOrderDetail">
      <div class="common-info flex">
        <h3 class="common-title"><span class="title-name">出库基础信息</span></h3>
        <ul class="content clearfix mt_20">
            <li class="item item50">
                <label class="label-term">出库单号：</label>
                <div class="input-text">{{ info.outNum }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">出库地：</label>
                <div class="input-text">{{ info.workName }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">出库日期：</label>
                <div class="input-text">{{ info.outDate }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">出库人员：</label>
                <div class="input-text">{{ info.createUserName }}</div>
            </li>
            <li class="item item50">
                <label class="label-term">出库操作时间：</label>
                <div class="input-text">{{ info.createDate }}</div>
            </li>
            <li class="item item100">
                <label class="label-term">备注：</label>
                <div class="input-text">{{ info.remark }}</div>
            </li>
        </ul>
        <h3 class="common-title mt_20"><span class="title-name">出库物品信息</span></h3>
        <div style="overflow-x:auto;">
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th>序号</th>
                        <th>物品种类</th>
                        <th>品名</th>
                        <th>规格型号</th>
                        <th>数量单位</th>
                        <th>出库数量</th>
                    </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in dtlList">
                        <td>{{ index+1 }}</td>
                        <td>{{ item.feeSubTypeName }}</td>
                        <td>{{ item.projectNames }}</td>
                        <td>{{ item.specification }}</td>
                        <td>{{ item.units }}</td>
                        <td>{{ item.outNums }}</td>
                    </tr>
                    <tr>
                        <td>合计</td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>{{ total.outNums }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="bot-btn">
          <el-button @click="closePage">关闭</el-button>
        </div>
      </div>

      <fileViewer ref="viewer" :url-list="[bigImageUrl]"></fileViewer>
    </div>
  </template>
    
<script>
import outOrderDetail from './outOrderDetail.js'
export default outOrderDetail
</script>
<style lang="scss" scoped>
#outOrderDetail {
    height: auto!important;;
    /deep/ .common-info{
        height: 100%;
        padding: 30px 20px;
        box-sizing: border-box;
        .tableCommon{
            border:$border;
        }
        .label-term{
            height: 30px;
            width: 120px;
        }
        .input-text{
            line-height: 30px;
        }
    }
    
    .uploadFile{
        img{
          width:110px;
          height: 80px;
          border-radius: 5px;
          overflow: hidden;
          float: left;
          margin-right: 20px;
          float: left;
        }
    }
}
</style>