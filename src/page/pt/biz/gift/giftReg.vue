<template>
    <div class="giftReg" id="giftReg">
      <div class="common-info flex">
        <h3 class="common-title mb_20"><span class="title-name">基本信息</span></h3>
        <div class="innerInfo">
            <ul class="content clearfix" style="width:50%;">
                <li class="item item50">
                    <label class="label-term"><em>*</em>礼品方案名称：</label>
                    <div class="input-text">
                        <el-input v-model="info.schemeName" disabled></el-input>
                    </div>
                </li>
                <li class="item item50" style="margin-right:0;width:50%;">
                    <label class="label-term"><em>*</em>截止日期：</label>
                    <div class="input-text">
                        <el-date-picker  v-model="info.deadlineDate" disabled type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                    </div>
                </li>
                <li class="item item100 itemEditor">
                    <label class="label-term"><em>*</em>礼品方案文案：</label>
                    <div class="input-text">
                        <el-input v-model="info.remark" type="textarea" show-word-limit maxlength="50" disabled></el-input>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix" style="flex:1;">
                <li class="item item100 img-upload">
                    <label class="label-term"><em>*</em>方案图片：</label>
                    <div class="input-text">
                        <myFileModel ref="img" :disabledEdit="true" :disabledDel="true"
                                     supportFiles="img"></myFileModel>
                        <p style="color: #999;">支持jpg、png，分辨率:1000*750</p>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix" style="flex:1;">
                <li class="item item100 img-upload">
                    <label class="label-term"><em>*</em>二维码底图：</label>
                    <div class="input-text">
                        <myFileModel ref="bgImg" :disabledEdit="true" :disabledDel="true"
                                     supportFiles="img" componentId="1"></myFileModel>
                    </div>
                </li>
            </ul>
        </div>
        <div class="table-content">
            <div class="table-title" @keyup.enter="doQuery()">
                <h3>
                    <span style="margin-right:20px;">礼品登记明细列表</span>

                  <el-checkbox-group  v-model="query.state" size="mini">
                    <el-checkbox-button label="99" @change="changeState1">所有</el-checkbox-button>
                    <el-checkbox-button label="2" @change="changeState2">已登记</el-checkbox-button>
                    <el-checkbox-button label="3" @change="changeState2">未登记</el-checkbox-button>
                    <el-checkbox-button label="1" @change="changeState3">已发货</el-checkbox-button>
                    <el-checkbox-button label="0" @change="changeState3">未发货</el-checkbox-button>
                  </el-checkbox-group>
                  <el-input v-model="query.searchStr" placeholder="输入关键字回车搜索" ></el-input>

                </h3>
                <div class="table-title-btn">
                    <el-button type="danger" plain size="mini" @click="recordDelivery">发货登记</el-button>
                    <el-button type="success" plain size="mini" @click="showBigImg">查看分享二维码</el-button>
                    <el-button type="success" plain size="mini" @click="downloadQrCode">下载分享二维码</el-button>
                    <el-button type="success" plain size="mini" @click="exportExcel">导出excel</el-button>
                </div>
            </div>
            <tableCommon tableName="giftRegTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="false" :head="head">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" v-if="code=='imgUrl'" class="link" @click.stop="showBigImg(item)"
                       style="margin: 0 10px;">查看</a>
                </template>
            </tableCommon>
        </div>
      </div>

        <el-dialog title="发货登记" :visible.sync="showDialog" width="540px" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="record(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term">礼品方案名称</label>
                        <div class="input-text">
                            {{param.schemeSubName}}
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">公司名称</label>
                        <div class="input-text">
                            {{param.companyName}}
                        </div>
                    </li>

                    <li class="item item100">
                        <label class="label-term">客户姓名</label>
                        <div class="input-text">
                            {{param.customerName}}
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">邮寄地址</label>
                        <div class="input-text">
                            {{param.address}}
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">快递单号</label>
                        <div class="input-text">
                            <el-input v-model="param.expressNum" placeholder="快递单号" type="text"
                                      ></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="record(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="saveRecord()">确认</el-button>
                </div>
            </div>
        </el-dialog>

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

    </div>
  </template>
    
    <script>
    import giftReg from './giftReg.js'
    export default giftReg
  </script>
<style lang="scss" scoped>
  .giftReg {
    /deep/ .common-info{
      height: 100%;
      padding: 30px 20px;
      box-sizing: border-box;
      .innerInfo{
        display: flex;
        .label-term{
            width: 100px;
        }
        .el-textarea__inner{
            width:100%;
            height: 86px;
        }
      }
      .table-title{
        display: flex;
        h3{
          flex: 1;
          .el-checkbox-group{
            display: inline-block;
            vertical-align: middle;
          }
          .el-input{
            width: 200px;
            margin-left: 10px;
            .el-input__inner{
              height: 30px;
            }
          }
        }
      }
    }
    /deep/ .table-content{
        border:none;
        height: calc(100% - 200px)!important;
        .tableCommonComponents{
            border:$border;
        }
    }
  }
  </style>