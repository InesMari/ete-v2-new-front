<template>
<div id="truckingOrdDetail" class="truckingOrdDetailPage dispatchPage orderPage">
    <innerTab  :tabs="tabs" @selectCallback="selectCallback" ></innerTab>
    <div class="detail" v-show="showType==1">
    <div class="logListCommon">
        <div class="title clearfix">
            <div class="time">
            时间
            </div>
            <div class="operator">
            操作人
            </div>
            <div class="news">
            最新动态
            </div>
        </div>
        <el-scrollbar class="content_height">
            <el-button class="trackBtn" @click="showTrack"><img src="@/static/image/mapTrack.png" alt="">运输轨迹</el-button>
            <div class="content">
                <div class="item clearfix" :class="{'first':index==0}" v-for="(item,index) in list" :key="index">
                    <div class="time">
                        13:10
                    </div>
                    <div class="operator">
                        司机：张师傅
                    </div>
                    <div class="news">
                        收车【广州黄埔】（司机：张三，联系电话：13118837449）
                    </div>
                </div>
            </div>
        </el-scrollbar>
    </div>
    <table class="fillTbale mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
            <td class="label">调度单号</td>
            <td class="value">
                <span class="link">DD0233586891123</span>
            </td>
            <td class="label">派车单号</td>
            <td class="value">
                SC14552088971
            </td>
            <td class="label">调度人</td>
            <td class="value">
                张三
            </td>
            <td class="label">调度时间</td>
            <td class="value">
                2020/02/30 16:22
            </td>
        </tr>
    </table>
    <div class="clearfix infoTable">
        <div class="leftTitle" style="height:366px;">运输成本信息</div>
        <div class="innerTable">
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr> 
                        <th width="16%">供应商</th>
                        <th width="16%">联系人</th>
                        <th width="16%">联系电话</th>
                        <th width="16%">是否开票</th>
                        <th width="16%">回单份数</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <el-select v-model="inputvalue" placeholder="选择供应商">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-input v-model="inputvalue" type="text" placeholder="联系人"></el-input>
                        </td>
                        <td>
                            <el-input v-model="inputvalue" type="text" placeholder="联系电话"></el-input>
                        </td>
                        <td>
                            <el-select v-model="inputvalue" placeholder="是否开票">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                            </el-select>
                        </td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr> 
                        <th width="16%">车牌号码</th>
                        <th width="16%">车型</th>
                        <th width="16%">车长</th>
                        <th width="16%">司机</th>
                        <th width="16%">司机电话</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <el-select v-model="inputvalue" placeholder="车牌号码">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-select v-model="inputvalue" placeholder="车型">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-select v-model="inputvalue" placeholder="车长">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-select v-model="inputvalue" placeholder="司机">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-input v-model="inputvalue" type="text" placeholder="联系电话"></el-input>
                        </td>
                    </tr>
                </tbody>
            </table>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr> 
                        <th>计费方式</th>
                        <th>净重（KG）</th>
                        <th>毛重（KG）</th>
                        <th>单价</th>
                        <th>干线运费</th>
                        <th>整车运费</th>
                        <th>短驳运费</th>
                        <th>提货费</th>
                        <th>装货费</th>
                        <th>卸货费</th>
                        <th>其他费</th>
                        <th>费用合计</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>月结</td>
                        <td>123</td>
                        <td>133</td>
                        <td>32</td>
                        <td>123</td>
                        <td>5212</td>
                        <td>3232</td>
                        <td>3211</td>
                        <td>43</td>
                        <td>533</td>
                        <td>23</td>
                        <td>6300</td>
                    </tr>
                </tbody>
            </table>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                        <tr> 
                            <th width="25%">现付</th>
                            <th width="25%">到付</th>
                            <th width="25%">周期付</th>
                            <th width="25%">周期天数</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                    </tbody>
            </table>
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label" style="width:25%;">订单备注</td>
                    <td class="value">
                        <el-input v-model="inputvalue" type="text" placeholder=""></el-input>
                    </td>
                </tr>
            </table>
        </div>
    </div>
    <table class="tableCommon mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
        <thead>
            <tr> 
                <th width="100">运单号</th>
                <th width="100">起始点</th>
                <th width="120">起始点地址</th>
                <th width="100">目的地</th>
                <th width="120">目的地地址</th>
                <th width="80">货物件数（件）</th>
                <th width="80">货物重量（KG）</th>
                <th width="80">货物体积（m³）</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>DL44192003782942</td>
                <td>广州黄埔</td>
                <td>光谱中路11号2栋2单元1003房</td>
                <td>广州天河</td>
                <td>光谱中路11号2栋2单元1003房</td>
                <td>
                    <el-tooltip effect="dark" content="查看货物明细" placement="top-start" :hide-after='1000'>
                        <img src="@/static/image/list.png" class="list_icon" alt="" @click="showGoodsDetail">
                    </el-tooltip>
                    0
                </td>
                <td>1000</td>
                <td>12</td>
            </tr>
        </tbody>
    </table>    
    <h3 class="common-title mt_20">
        <span class="title-name">作业点信息</span>
    </h3>
    <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
        <thead>
            <tr>
                <th>作业点顺序</th>
                <th>作业点</th>
                <th>作业内容</th>
                <th>要求运作时间</th>
                <th>联系人</th>
                <th>联系手机</th>
                <th>联系电话</th>
                <th>详细地址</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>天河仓</td>
                <td>提货</td>
                <td>2020-11-12<br/>10:59:03</td>
                <td>张四</td>
                <td>13955238740</td>
                <td>020-662586</td>
                <td>广东省广州市越秀区上下九48号</td>
            </tr>
            <tr>
                <td>2</td>
                <td>黄埔仓</td>
                <td>
                    卸货
                    <el-tooltip effect="dark" content="查看合并作业点" placement="top-start" :hide-after='1000'>
                        <img src="@/static/image/list.png" class="list_icon" alt="" @click="showOperateDialog">
                    </el-tooltip>
                </td>
                <td>2020-11-12<br/>10:59:03</td>
                <td>李三</td>
                <td>13955238740</td>
                <td>020-662586</td>
                <td>广东省广州市黄埔区信息大厦603</td>
            </tr>
        </tbody>
    </table>
    <h3 class="common-title mt_20">
        <span class="title-name">单据信息</span>
    </h3>
    <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
        <thead>
            <tr>
                <th>序号</th>
                <th>单据类型</th>
                <th>上传时间</th>
                <th>上传人员</th>
                <th>图片</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>1</td>
                <td>过磅单</td>
                <td>2020/11/7 15:35:41</td>
                <td>张三</td>
                <td>
                    <a href="javascript:;" class="link">xxxx.jpg</a>
                </td>
            </tr>
        </tbody>
    </table>
    </div>
    <!-- 修改记录 -->
    <div v-show="showType==2">
        <tableCommon tableName="truckingOrdDetailTable" ref="table" :showSetTable="false" :head="head"></tableCommon>
    </div>

    <!-- 地图轨迹 -->
    <div v-show="showType==3">
        <map-track ref="mapTrack" v-if="showType==3"></map-track>
    </div>

    <!-- 货物明细 -->
    <el-dialog title="货物明细" :visible.sync="isshowGoodsDetialDialog" width="700px">
        <div class="common-info" style="border:none;padding:0;">
            <ul class="content clearfix">
                <li class="item item50">
                    <label class="label-term">订单号</label>
                    <div class="input-text">
                        <el-input v-model="inputvalue" type="text" placeholder="" :disabled="true"></el-input>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term">客户</label>
                    <div class="input-text">
                        <el-input v-model="inputvalue" type="text" placeholder="" :disabled="true"></el-input>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term">库存仓库</label>
                    <div class="input-text">
                        <el-input v-model="inputvalue" type="text" placeholder="" :disabled="true"></el-input>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term">卸货地</label>
                    <div class="input-text">
                        <el-input v-model="inputvalue" type="text" placeholder="" :disabled="true"></el-input>
                    </div>
                </li>
            </ul>
            <div>
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr>
                            <th>序号</th>
                            <th>货物名称</th>
                            <th>库存件数/件</th>
                            <th>调度件数/件</th>
                            <th>库存重量/kg</th>
                            <th>调度重量/kg</th>
                            <th>库存体积/m³</th>
                            <th>调度体积/m³</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>成品石墨</td>
                            <td>21</td>
                            <td>12</td>
                            <td>423</td>
                            <td>321</td>
                            <td>63</td>
                            <td>56</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>合计：</td>
                            <td></td>
                            <td>21</td>
                            <td>12</td>
                            <td>423</td>
                            <td>321</td>
                            <td>63</td>
                            <td>56</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
        <div class="page-bot-btn">
            <el-button size="mini">关闭</el-button>
            <el-button type="primary" size="mini">修改保存</el-button>
        </div>
    </el-dialog>
    <!-- 查看合并作业点 -->
    <el-dialog title="查看合并作业点" :visible.sync="isshowOperateDialog" width="800px">
        <div>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th width="40">序号</th>
                        <th width="100">订单号</th>
                        <th width="100">作业点名称</th>
                        <th width="200">详细地址</th>
                        <th width="60">联系人</th>
                        <th width="100">联系手机</th>
                        <th width="100">联系电话</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td><a class="link">OD44192003829302</a></td>
                        <td>云升科学圆</td>
                        <td>广州市黄埔区光谱中路云升科学园</td>
                        <td>肖老板</td>
                        <td>13955236933</td>
                        <td>020-6322523</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="page-bot-btn">
            <el-button size="mini">关闭</el-button>
        </div>
    </el-dialog>
</div>
</template>

<script>
import truckingOrdDetail from './truckingOrdDetail.js'
export default truckingOrdDetail
</script>

<style lang="scss">
@import '@/page/pt/ord/order.scss';
.truckingOrdDetailPage{
    background: #fff;
    border:$border;
    box-sizing: border-box;
    padding-right:0;
    .innerTab{
        border:none;
    }
    .logListCommon{
        margin-top:20px;
        border-bottom: $border;
        .content_height{
            height: 150px;
            position: relative;
            .trackBtn{
                position: absolute;
                top: 20px;
                right: 20px;                
                z-index: 99;
                cursor: pointer;
                border-radius: 50px;
                padding: 10px 18px;
                opacity: 0.5;
                &:hover{
                    opacity: 1;
                }
                img{
                    width: 20px;
                    vertical-align: top;
                    margin-top: -5px;
                    margin-right: 3px;
                }
            }
            .el-scrollbar__wrap{
                overflow-x: hidden;
            }
        }
    }
    .tableCommonComponents{
        .tableCommon{
            border:none;
            td,th{
                height: 30px;
            }
        }
    }
}
</style>