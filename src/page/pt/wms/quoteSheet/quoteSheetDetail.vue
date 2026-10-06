<template>
  <div id="quoteSheetDetail" class="quoteSheetPage">
    <div class="innerTab clearfix" v-if="info.rebuildDetails.length>0">
        <div :class="{'active':page==1}" class="innerItem" @click="selTab(1)">报价详情</div>
        <div :class="{'active':page==2}" class="innerItem" @click="selTab(2)">合并报价详情</div>
    </div>
    <div class="common-info clearfix">
        <div class="detailInfo">
        <el-button class="viewBtn" type="primary" size="mini" @click="viewDetail(true)" v-show="!isViewDetail && page==2">查看合并明细</el-button>
        <el-button class="viewBtn" type="primary" size="mini" @click="viewDetail(false)" v-show="isViewDetail && page==2">取消查看合并明细</el-button>
        <div class="detailHeader">
            <img src="@/static/image/logo.png" alt="">
            <p>{{info.baseInfo.settleBodyName}}</p>
            <p>VMI仓储服务报价单 -【{{info.baseInfo.workStoreName}}】</p>
            <div class="quoteNum">报价单号：{{info.baseInfo.quoteNum}}</div>
        </div>
        <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">     
            <tr>
                <td colspan="2" class="fw">客户方信息 Customer Information</td>
                <td colspan="2" class="fw">报价方信息 Supplier Information</td>
            </tr>     
            <tr>
                <td class="label">公司名称 Customer Name：</td>
                <td class="value">
                    {{info.baseInfo.custName}}
                </td>
                <td class="label">公司名称 Customer Name：</td>
                <td class="value">
                  {{info.baseInfo.settleBodyName}}
                </td>
            </tr>
            <tr>
                <td class="label">地址 Address：</td>
                <td class="value">
                    {{info.baseInfo.custAddress}}
                </td>
                <td class="label">地址 Address：</td>
                <td class="value">
                  广州市增城区新塘香山大道南2号云享新经济生态园一号楼301-303室
                </td>
            </tr>
            <tr>
                <td class="label">联系人 Contact：</td>
                <td class="value">
                    {{info.baseInfo.linkman}}
                </td>
                <td class="label">联系人 Contact：</td>
                <td class="value">
                    {{info.baseInfo.ourLinkman}}
                </td>
            </tr>
        </table>
        
        <div class="tableItem">
            <h3>
                <span v-if="firstTableItem.codeId==1" v-show="firstTableItem.display==1">1、{{firstTableItem.title}}<em style="margin-left:10px;">租赁面积数量计算 = 租赁面积/托面积*(1-公摊%）</em></span>
            </h3>
            <table ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" v-for="(item,index) in firstTableItem0" style="margin-bottom:10px;" v-show="item.display==1">
                <thead>
                    <tr>
                        <th width="110">计费类型</th>
                        <th width="110">存放条件</th>
                        <th width="110">计费单位</th>
                        <th width="80">未税单价</th>
                        <th width="80">税率(%)</th>
                        <th width="80">价税合计</th>
                        <th width="80">公摊(%)</th>
                        <th width="80">租赁面积</th>
                        <th width="80">计费面积</th>
                        <th width="220">备注</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{item.itemName}}</td>
                        <td>{{item.storageConditionName}}</td>
                        <td>{{item.unit}}</td>
                        <td>{{item.price}}</td>
                        <td>{{item.tax}}</td>
                        <td>{{item.priceWithTax}}</td>
                        <td>{{item.shareRate}}</td>
                        <td>{{item.leaseArea}}</td>
                        <td>{{item.chargeArea}}</td>
                        <td>{{item.remark}}</td>
                    </tr>
                </tbody>
            </table>
            <table ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom:10px;" v-for="(item,index) in firstTableItem1" v-show="item.display==1">
                <thead>
                    <tr>
                        <th width="110">计费类型</th>
                        <th width="110">存放条件</th>
                        <th width="110">计费单位</th>
                        <th width="110">未税单价</th>
                        <th width="110">税率(%)</th>
                        <th width="110">价税合计</th>
                        <th width="110">取数规则</th>
                        <th width="220">备注</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>{{item.itemName}}</td>
                        <td>{{item.storageConditionName}}</td>
                        <td>{{item.unit}}</td>
                        <td>{{item.price}}</td>
                        <td>{{item.tax}}</td>
                        <td>{{item.priceWithTax}}</td>
                        <td>{{item.countRuleName}}</td>
                        <td>{{item.remark}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-show="page==1">
            <div class="tableItem" v-for="(tableItem,index) in tableList" :key="tableItem.codeId" v-show="tableItem.codeId!=1">
                <h3>{{index+1}}、{{tableItem.title}}
                    <span style="font-size: 12px;font-weight: normal;margin-left: 15px;" v-if="tableItem.codeId == 11 && mergeTotal > 0" class="">合并项共{{mergeTotal}}项：{{tableItem.mergeName}}。
                    <span style="margin-left: 10px;" v-if="tableItem.codeId == 11 && mergeTotal > 0">税价合计：<em>{{tableItem.mergeFee}}</em></span></span>
                </h3>
                <div style="overflow-x: auto;">
                <table ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0" v-show="tableItem.display">
                    <thead>
                        <tr>
                            <th :width="hd.width" v-for="(hd,index) in head" :key="index" v-show="!hd.parent || (hd.parent=='delivery' && tableItem.codeId==104) || (hd.parent=='purchase' && tableItem.codeId==106)">{{hd.name}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,idx) in tableItem.items" :key="idx" :class="item.merge==1?'hover':''">
                            <td :width="hd.width" v-for="(hd,index) in head" :key="index" v-show="!hd.parent || (hd.parent=='delivery' && tableItem.codeId==104) || (hd.parent=='purchase' && tableItem.codeId==106)">
                                {{item[hd.code]}}
                            </td>
                        </tr>
                    </tbody>
                </table>
                </div>
            </div>
        </div>
        <!-- 合并报价详情 -->
        <div v-show="page==2">
            <div v-show="!isViewDetail">
                <div class="mergeView" v-for="(merges,index) in mergeArr">
                    <h3 class="mergeTitle" style="margin:0;">
                        <span>{{index+2}}、{{merges.titleName}}</span>
                    </h3>
                    <div class="tableFlex" v-for="(merge,index) in merges.merge" style="margin-bottom:10px;overflow-x: auto;">
                        <table style="flex:1;border-right:0;" ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                            <thead>
                                <tr>
                                    <th :width="hd.width" v-for="(hd,index) in head2" :key="index">{{hd.name}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,idx) in merge.items" :key="idx" :class="{'item':idx>0&&merges.rebuildType==1}" v-show="merges.rebuildType == '2' || idx==0 ">
                                    <td :width="hd.width" v-for="hd in head2">
                                        <span>{{item[hd.code] | emptyToStr}}</span>
                                    </td>
                                </tr>
                            </tbody> 
                        </table>
                    </div>
                </div>
            </div>
            
            <div v-show="isViewDetail">
                <div class="mergeView" v-for="(merges,index) in mergeArr">
                    <h3 class="mergeTitle" style="margin:0;">
                        <span>{{index+2}}、{{merges.titleName}}</span>
                    </h3>
                    <div class="tableFlex" v-for="(merge,index) in merges.merge" style="margin-bottom:10px;overflow-x: auto;">
                        <table style="flex:1;border-right:0;" ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                            <thead>
                                <tr>
                                    <th :width="hd.width" v-for="(hd,index) in head2" :key="index">{{hd.name}}</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,idx) in merge.items" :key="idx" :class="{'item':idx>0&&merges.rebuildType==1}">
                                    <td :width="hd.width" v-for="hd in head2">
                                        <span>{{item[hd.code] | emptyToStr}}</span>
                                    </td>
                                </tr>
                            </tbody> 
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <div class="remark">
            <p>备注：</p>
            <el-input type="textarea" v-model="info.baseInfo.remark" :readonly="true" autosize></el-input>
        </div>
        </div>
        <div class="quoteTime">
            <p>广东易迁易物流科技有限公司(公章)</p>
            <p>报价时间：{{info.baseInfo.quoteDate.substring(0,10)}}</p>
        </div>
    </div>

    <!-- 版本选择悬浮窗 -->
    <div class="timeline" v-if="info.hisInfo.length>1">
        <div class="item" v-for="item in info.hisInfo" :key="item.hisId" @click="changeHisVer(item.hisId)">
            <div class="circle" :class="item.hisId==currentHisId?'active':''"></div>
            <div class="content">
                <p>{{item.title}}</p>
                <p>{{item.date}}</p>
            </div>
            <div class="line"></div>
        </div>
    </div>
      <!-- 版本选择悬浮窗 -->

  </div>
</template>

<script>
import quoteSheetDetail from "./quoteSheetDetail.js";
export default quoteSheetDetail;
</script>
<style src="./quoteSheet.scss" lang="scss" scoped></style>
<style lang="scss" scoped>
.quoteSheetPage{
    .common-info{
        padding: 30px 30px 50px 20px;
    }
    .fillTbale{
        td:last-child{
            border-right:none;
        }
    }
    .detailInfo{
        border:$border;
        padding-bottom: 10px;
        position: relative;
        .viewBtn{
            position: absolute;
            top: 5px;
            right: 10px;
            z-index: 99;
        }
        .detailHeader{
            position: relative;
            padding:10px 0;
            img{
                position: absolute;
                top: 5px;
                left: 10px;
                height: 50px;
            }
            p{
                font-weight: bold;
                font-size: 14px;
                text-align: center;
                color: #000;
            }
            .quoteNum{
                position: absolute;
                right: 10px;
                bottom: 5px;
                font-weight: bold;
            }
        }
        h3{
            padding-left:10px;
        }
        .tableCommon,.fillTbale{
            border-left: none!important;
            border-right: none!important;
        }
        .remark {
            margin-top: 10px;
            padding-left:10px;
            /deep/ .el-textarea__inner {
                border: none;
                resize: none;
                padding: 0;
                font-size: 12px;
            }
        }
    }
    .quoteTime{
        line-height: 26px;
        margin-top: 40px;
        text-align: right;
    }
    .innerTab{
    background: #fff;
    .innerItem{
        padding:10px 24px 8px;
        box-sizing: border-box;
        float: left;
        cursor: pointer;
        border-bottom: 2px solid #fff;
        &.active,&:hover{
            border-bottom-color: $main-color;
            p{
                color: $main-color;
                span{
                    color: $main-color;
                }
            }
        }
    }
    .inline{
        display: inline-block;
        span{
            font-size: 0.5rem;
        }
    }
}
}
</style>