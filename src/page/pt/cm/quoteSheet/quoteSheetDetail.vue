<template>
  <div id="quoteSheetDetail" class="quoteSheetPage">
    <div class="common-info clearfix">
        <div class="detailInfo">
        <div class="detailHeader">
            <img src="@/static/image/logo.png" alt="">
            <p>{{info.baseInfo.settleBodyName}}</p>
            <p>运输服务报价单</p>
            <div class="quoteNum fl">报价单号：{{info.baseInfo.quoteNum}}</div>
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
            <tr>
                <td class="label">联系电话 Mobile No.：</td>
                <td class="value">
                    {{info.baseInfo.billId}}
                </td>
                <td class="label">联系电话 Mobile No.：</td>
                <td class="value">
                    {{info.baseInfo.ourBillId}}
                </td>
            </tr>
            <tr>
                <td class="label">电子邮箱 E-mail：</td>
                <td class="value">
                    {{info.baseInfo.email}}
                </td>
                <td class="label">电子邮箱 E-mail：</td>
                <td class="value">
                    {{info.baseInfo.ourEmail}}
                </td>
            </tr>
        </table>
        <h2>尊敬的客户，您好!感谢您的信任，我们很高兴为您提供运输服务，具体报价如下：</h2>
        <div class="tableItem" v-for="(tableItem,index) in tableList" :key="tableItem.codeId">
            <h3>{{index+1}}、{{tableItem.itemTypeName}}</h3>
            <div v-for="(routeItem,routeIndex) in tableItem.routes" :key="routeIndex" style="margin-bottom:20px;">
                <h5 class="routeTitle">线路名称：{{ routeItem.routeName }}</h5>
                <table ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th width="80">序号</th>
                            <th :width="hd.width" v-for="(hd,index) in tableItem.itemType==1?head:head2" :key="index">{{hd.name}}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,idx) in routeItem.details" :key="idx">
                            <td>{{ idx+1 }}</td>
                            <td :width="hd.width" v-for="hd in tableItem.itemType==1?head:head2" :key="hd.code">
                                <span v-if="hd.type == 'range'">{{item[hd.code]}} - {{item[hd.code2]}}</span>
                                <span v-else>{{item[hd.code]}}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
        h2{
            padding: 10px;
            font-size: 14px;
            border-bottom: $border;
        }
        h3{
            border-bottom: 1px dashed $border-color;
            margin-bottom: 12px;
        }
        .tableItem .routeTitle{
            line-height: initial;
            font-size: 14px;
            padding: 0 0 10px 10px;
        }
    }
    .fillTbale{
        td:last-child{
            border-right:none;
        }
    }
    .detailInfo{
        border:$border;
        padding-bottom: 10px;
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
}
</style>