<template>
    <div id="storageEquipmentContract" >

        <searchList :formData="formData" @doQuery="doQuery" @clearFn="initQuery()" :query="query" searchKey="storageEquipmentContractSearch"/>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>仓储运作合同管理列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="仓储运作合同管理列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="addContract" v-entity="1011017">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="updateContract" v-entity="1011018">修改</el-button>
                    <el-button type="primary" plain size="mini" @click="seeContract(null)" v-entity="1011019">查看</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteContract" v-entity="1011020">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="changeShowStyle" v-entity="1011021">{{ text }}</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1011053" @click="showRenewal()">续期</el-button>
                    <el-button type="primary" plain size="mini" @click="download">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="storageEquipmentContractTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="toContractDetail" v-show="showList">
                <template v-slot:default="{item}">
                    <a href="javascript:void(0);" class="link" @click.stop="showImg(item)" style="margin: 0 10px;">查看合同附件</a>
                </template>
            </tableCommon>

            <div class="chartList clearfix" v-show="!showList" style="margin-top: 5px;">
                <div class="item">
                    <div class="chart" id="chart1"></div>
                </div>
                <div class="item">
                    <div class="chart" id="chart2"></div>
                </div>
                <div class="item">
                    <div class="chart" id="chart3"></div>
                </div>

                <div class="item" >
                    <i class="el-icon-s-operation" @click="changeChartView()"></i>
                    <div class="dataView" v-show="!showChart">
                        <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" v-if="!showChart">
                            <thead>
                            <tr>
                                <th>序号</th>
                                <th>已合作未提报供应商名称</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(item2, index) in list">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item2 }}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="chart" id="chart4" v-show="showChart"></div>
                </div>
            </div>
        </div>

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

      <!-- 导出运作状况-开始 -->
      <el-dialog title="续期" :visible.sync="showDlg" width="420px" :close-on-click-modal="false"
                 :close-on-press-escape="false">
        <div style="position: relative;padding-left: 45px;margin-bottom: 15px;">
          <img class="tip" src="@/static/image/tip.png" alt="" style="width:24px;position: absolute;top:50%;margin-top:-12px;left: 10px">
          请选择续期到哪一天
        </div>
        <div class="common-info" style="border:none;padding:20;">
          <ul class="content clearfix">
            <li class="item" style="width: 80%;">
              <label class="label-term"><em>*</em>到期时间</label>
              <div class="input-text">
                <el-date-picker @input="$forceUpdate" v-model="endDate" type="date"
                                placeholder="选择日期时间" align="right"
                                value-format="yyyy-MM-dd">
                </el-date-picker>            </div>
            </li>
          </ul>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="closeDialog()">关闭</el-button>
            <el-button type="primary" size="mini" @click="renewal">提交</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 导出运作状况-结束 -->
    </div>
</template>

<script>
	import storageEquipmentContract from './storageEquipmentContract.js'
	export default storageEquipmentContract
</script>
<style lang="scss">
/deep/ .trRed td{color:red}
@import '@/page/pt/fc/fc_common.scss';
#storageEquipmentContract {
    background: #fff;
    height: auto!important;
    .chartList{
        padding:0 10px;
        height: calc(100% - 60px);
        .item{
            position: relative;
            width:49%;
            height: 48%;
            margin:0 2% 2% 0;
            border: $border;
            box-sizing: border-box;
            border-radius: 10px;
            float: left;
            .chart{
                height: 95%;
            }
            &:nth-child(2n){
                margin-right: 0;
            }
            &.opinion{
                .dataView{
                    max-height: 200px;
                    /deep/ .el-scrollbar__wrap{
                        overflow-x: hidden;
                    }
                }
            }
            .el-icon-s-operation{
                font-size: 20px;
                color: $main-color;
                position: absolute;
                top: 10px;
                right: 20px;
                z-index: 99;
                cursor: pointer;
            }
            .dataView{
                overflow-x: hidden;
                overflow-y: auto;
                margin-top: 25px;
                height: calc(100% - 25px);
            }
            .tableCommon{
                border:$border;
                margin:10px 0;
            }
        }
    }
}
</style>
