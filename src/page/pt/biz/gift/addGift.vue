<template>
    <div class="addGift" id="addGift">
      <div class="common-info flex">
        <h3 class="common-title mb_20"><span class="title-name">基本信息</span></h3>
        <div class="innerInfo">
            <ul class="content clearfix" style="width:50%;">
                <li class="item item50">
                    <label class="label-term"><em>*</em>礼品方案名称：</label>
                    <div class="input-text">
                        <el-input v-model="info.schemeName" :disabled="disabled"></el-input>
                    </div>
                </li>
                <li class="item item50" style="margin-right:0;width:50%;">
                    <label class="label-term"><em>*</em>截止日期：</label>
                    <div class="input-text">
                        <el-date-picker  v-model="info.deadlineDate" :disabled="disabled" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
                    </div>
                </li>
                <li class="item item100 itemEditor">
                    <label class="label-term">礼品方案文案：</label>
                    <div class="input-text">
                        <el-input v-model="info.remark" type="textarea" show-word-limit maxlength="50" :disabled="disabled"></el-input>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix" style="flex:1;">
                <li class="item item100 img-upload">
                    <label class="label-term"><em>*</em>方案图片：</label>
                    <div class="input-text">
                        <myFileModel ref="img" :disabledEdit="disabledEdit" :disabledDel="disabledDel"
                                     @successCallback="successCallback" @delCallback="delCallback"
                                     supportFiles="img" componentId="0"></myFileModel>
                        <p style="color: #999;">支持jpg、png，分辨率:1000*750</p>
                    </div>
                </li>
            </ul>
            <ul class="content clearfix" style="flex:1;">
                <li class="item item100 img-upload">
                    <label class="label-term"><em>*</em>二维码底图：</label>
                    <div class="input-text">
                        <myFileModel ref="bgImg" :disabledEdit="disabledEdit" :disabledDel="disabledDel"
                                     @successCallback="successCallback" @delCallback="delCallback"
                                     supportFiles="img" componentId="1"></myFileModel>
                    </div>
                </li>
            </ul>
        </div>
        <h3 class="common-title mb_20 mt_20"><span class="title-name">礼品明细</span></h3>
        <div class="tableList">
            <div class="gitfList" v-for="(gift,giftIndex) in info.subList">
                <div class="tableTitle">
                    <el-input :disabled="disabled" v-model="gift.schemeSubName" placeholder="请输入礼品方案名称"></el-input>
                    <el-tooltip v-show="giftIndex === info.subList.length - 1 && !disabled" effect="dark" content="添加方案" placement="top-start" :hide-after='1000'>
                        <span @click="addItem()" class="add"></span>
                    </el-tooltip>
                    <el-tooltip v-show="!disabled" effect="dark" content="删除方案" placement="top-start" :hide-after='1000'>
                        <span @click="removeItem(giftIndex)" class="del"></span>
                    </el-tooltip>
                </div>
                
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                    <tr>
                        <th width="80">序号</th>
                        <th>礼品名称</th>
                        <th>品牌/型号</th>
                        <th>礼品图片</th>
                        <th>备注</th>
                        <th width="80" v-show="!disabled">
                            <el-tooltip effect="dark" content="添加" placement="top-start" :hide-after='1000'>
                                <span @click="addSubItem(gift)" class="add"></span>
                            </el-tooltip>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in gift.subDtlList">
                        <td>{{index + 1}}</td>
                        <td>
                            <el-input :disabled="disabled" v-model="item.giftName" placeholder="请输入礼品名称"></el-input>
                        </td>
                        <td>
                            <el-input :disabled="disabled" v-model="item.model" placeholder="请输入品牌/型号"></el-input>
                        </td>
                        <td>
                            <myFileModel :ref="'file' + giftIndex + '-' + index"
                                         :disabledEdit="disabledEdit" :disabledDel="disabledDel"
                                         @successCallback="successCallback2" @delCallback="delCallback2"
                                         :componentId="giftIndex + '-' + index" clickType="text" ></myFileModel>
                        </td>
                        <td>
                            <el-input :disabled="disabled" v-model="item.remark" placeholder="请输入备注"></el-input>
                        </td>
                        <td v-show="!disabled">
                            <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000'>
                                <span @click="removeSubItem(item,index)" class="del"></span>
                            </el-tooltip>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="bot-btn" v-if="$route.query.type!=0">
          <el-button @click="closePage">关闭</el-button>
          <el-button type="primary" @click="save">确认{{ $route.query.type == 1 ? '新增' : $route.query.type == 3 ? '复制' : '修改' }}</el-button>
        </div>
      </div>
    </div>
  </template>
    
    <script>
    import addGift from './addGift.js'
    export default addGift
  </script>
<style lang="scss" scoped>
  .addGift {
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
    }
    /deep/ .tableList{
        .gitfList{
            padding-bottom: 20px;
            border-bottom:1px dashed $border-color;
            &:last-child{
                border:none;
            }
        }
        .tableTitle{
            margin-top: 20px;
            .add{                
                margin-left: 10px;
            }
            .del{                
                margin-left: 5px;
            }
        }
        .el-input{
            width: 200px;
        }
        .add {
            vertical-align: middle;
            @include add;
        }

        .del {
            vertical-align: middle;
            @include del;
        }
        .tableCommon {
            border: $border;
            margin-top: 10px;
            position: initial;
        }
    }
  }
  </style>