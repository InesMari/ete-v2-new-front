<template>
    <div id="wmsExamineDTLStatisticsManage">
      <searchList :formData="formData" @doQuery="doQuery" :query="loadParam" @clearFn="clearFn" searchKey="wmsExamineDTLStatisticsManageSearch"></searchList>

      <div class="table-content">
            <div class="table-title" style="overflow: hidden">
                <h3>
                    <span>核查明细列表 <span style="color: red;font-size: 12px;">{{tips}}</span></span>
                    <el-tooltip effect="light" content="核查明细列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" @click="changeShowChart">{{btnTitle}}</el-button>
                </div>
            </div>
            <tableCommon tableName="wmsExamineStatisticsManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem" v-show="!showChart">
              <template v-slot="{item,code}">
                <div v-if="'imgUrl'==code&&item[code]!=null&&item[code]!=''">
                  <a href="javascript:void(0);" class="link" @click.stop="showBigImg(item)">查看图片</a>
                </div>
                <div v-if="'orderNum'==code">
                  <a href="javascript:void(0);" class="link" @click.stop="gotoOrder(item)">{{item[code]}}</a>
                </div>
              </template>
            </tableCommon>
          <div class="chartList clearfix" v-show="showChart">
            <div class="item" v-for="(item, index) in list">
              <div class="chart" :id="'chart' + index"></div>
              <div class="info" style="margin-top: -10px;">
                <span>{{item.itemName}}：{{item.stsAll}}</span>
              </div>
              <div class="info" style="margin-top: -20px;">
                <span>正常：{{item.sts1}}</span>
                <span>异常：{{item.sts2}}</span>
                <span>未操作：{{item.sts0}}</span>
              </div>
            </div>
          </div>
        </div>

      <!-- 查看大图 -->
      <fileViewer ref="viewer" :url-list="srcList"></fileViewer>
    </div>
</template>

<script>
import wmsExamineDTLStatisticsManage from './wmsExamineDTLStatisticsManage.js'
export default wmsExamineDTLStatisticsManage
</script>
<style lang="scss">
#wmsExamineDTLStatisticsManage{
  .chartList{
    padding:0 10px;
    .item{
      width: 24%;
      border:$border;
      padding: 10px 10px;
      box-sizing: border-box;
      position: relative;
      margin:10px 0.5% 0 0;
      border-radius: 5px;
      float: left;
      &:nth-child(4n){
        margin-right: 0;
      }
      .chart{
        width:100%;
        height: 200px;
      }
    }
    .info{
      text-align: center;
      line-height: 40px;
      span{
        margin:0 10px;
      }
    }
  }
}
</style>




