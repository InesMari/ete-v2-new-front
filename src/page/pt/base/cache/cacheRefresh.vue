<template>
  <div id="cacheRefresh">
    <div  class="table_height orderInfo">
      <div class="search-form clearfix" style="margin-bottom:10px;">
          <el-button class="fl" type="primary" plain size="mini" @click="toRefreshAll" style="margin:5px 0 0 10px;">全量刷新</el-button>
          <el-button class="fl" v-show="false" type="primary" plain size="mini" @click="showUpload(true)" style="margin:5px 0 0 10px;">更新省市区数据</el-button>
        </div>
      </div>
      <div style="overflow: auto">
        <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" style="table-layout: fixed">
          <thead>
          <tr>
            <th width="8%">序号</th>
            <th width="30%">缓存</th>
            <th width="30%">说明</th>
            <th width="20%">操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in items">
            <td width="8%">{{index+1}}</td>
            <td width="17%">{{item.cacheName}}</td>
            <td width="30%">{{item.remark}}</td>
            <td width="20%">
              <a class="link" href="javascript:void(0)" @click="toRefresh(item.cacheName)">刷新</a>
            </td>
          </tr>
          </tbody>
        </table>
      </div>


      <el-dialog class="sureReceivedDialog" title="更新市区数据"
                 :visible.sync="showUploadPage" :close-on-click-modal="false" :close-on-press-escape="false"
                 width="700px" @close="showUpload(false)">
          <div class="common-info" style="border:none;padding:0;">
              <em style="font-size:18px;padding-left:22px;">
                  注：前往百度下载《<a target="_blank" href="https://lbsyun.baidu.com/index.php?title=open/dev-res">百度地图行政区划adcode映射表</a>》
              </em>
              <ul class="content clearfix" style="margin-top:10px;">
                  <li class="item item100" style="width: 360px;margin: 0 auto;float: inherit">
                      <my-import ref="myImport" title="更新市区数据" :handle-success="sureReceivedSuccess" :noneDialog="true"
                                 tip="当前模板是22年07月更新的，请前往百度下载最新的《百度地图行政区划adcode映射表》再上传！"
                                 bean="commonTF" method="updateCityData" template="/download/updateBaiduCityForDBTemplate-202207.xlsx">
                      </my-import>
                  </li>
              </ul>
              <div class="page-bot-btn ">
                  <el-button size="mini" @click="showUpload(false)">关闭</el-button>
                  <el-button type="primary" size="mini" @click="updateCityData()">更新</el-button>
              </div>
          </div>
      </el-dialog>

    </div>
</template>

<script>
import cacheRefresh from './cacheRefresh.js'
export default cacheRefresh
</script>

<style lang="scss" scoped>
#cacheRefresh{
    .sureReceivedDialog{
        .el-dialog__body {
            padding: 20px 20px 30px !important;
        }
        .el-select,.el-input{
            width: 100%;
        }
        .el-icon-remove-outline {
            color: red;
            font-size: 18px;
        }

        .el-icon-circle-plus-outline {
            color: $main-color;
            font-size: 18px;
        }
        .common-info .content > .item {
            .el-input__inner {
                width: 78%;
            }
            .label-term {
                width: 100px;
            }
            .label-term2 {
                width: 100%;
                height: 40px;
                padding-left: 23px;
            }
            .input-text {
                width: calc(100% - 110px);
            }
        }
        .common-info .rotate{
            -ms-transform:rotate(90deg); /* IE 9 */
            -moz-transform:rotate(90deg); /* Firefox */
            -webkit-transform:rotate(90deg); /* Safari and Chrome */
            -o-transform:rotate(90deg); /* Opera */
            float: right;
            height: 30px;
        }
    }
}
</style>
