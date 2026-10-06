<template>
  <div id="dispatch" class="dispatchPage orderPage">    
      <div class="table_height orderInfo">
        <el-tooltip effect="dark" content="修改订单" placement="top-start" :hide-after='1000'>
            <img src="@/static/image/edit.png" class="edit_icon" alt="">
        </el-tooltip>
        <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
                <tr>
                    <th width="150">订单号</th>
                    <th width="100">下单客户</th>
                    <th width="100">客户单号</th>
                    <th width="100">库存仓库</th>
                    <th width="100">调度件数/件</th>
                    <th width="100">调度重量/kg</th>
                    <th width="100">调度体积/m³</th>
                    <th width="120">干线供应商</th>
                    <th width="120">中转网点</th>
                    <th width="120">交接方式</th>
                    <th width="120">卸货地</th>
                    <th width="200">卸货地详细地址</th>
                    <th width="100">干线运费</th>
                    <th width="100">提货费</th>
                    <th width="100">送货费</th>
                    <th width="100">装货费</th>
                    <th width="100">卸货费</th>
                    <th width="100">其他费</th>
                    <th width="100">合计</th>
                    <th width="100">回单份数</th> 
                    <th width="100">订单备注</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,index) in list" :key="index">
                    <!-- 订单号 -->
                    <td>
                        <a href="javascript:;" class="link">OD86611665886</a>
                    </td>
                    <!-- 下单客户 -->
                    <td>
                        凯金
                    </td>
                    <!-- 客户单号 -->
                    <td>
                        123456
                    </td>
                    <!-- 库存仓库 -->
                    <td>
                        天河仓
                    </td>
                    <!-- 调度件数/件 -->
                    <td>
                        <el-tooltip effect="dark" content="查看编辑货物明细" placement="top-start" :hide-after='1000'>
                            <img src="@/static/image/list.png" class="list_icon" alt="" @click="showGoodsDetail">
                        </el-tooltip>
                        1
                    </td>
                    <!-- 调度重量/kg -->
                    <td>
                        236
                    </td>
                    <!-- 调度体积/m³ -->
                    <td>
                        2
                    </td>
                    <td :rowspan="list.length" v-if="index==0">
                        <el-select v-model="inputvalue" placeholder="干线供应商">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                        </el-select>
                    </td>
                    <td :rowspan="list.length" v-if="index==0">
                        <el-select v-model="inputvalue" placeholder="中转网点">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                        </el-select>
                    </td>
                    <td :rowspan="list.length" v-if="index==0">
                        <el-select v-model="inputvalue" placeholder="交接方式">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                        </el-select>
                    </td>
                    <td :rowspan="list.length" v-if="index==0">
                        <el-select v-model="inputvalue" placeholder="卸货地">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                        </el-select>
                    </td>
                    <!-- 卸货地 -->
                    <td :rowspan="list.length" v-if="index==0">
                        <el-input v-model="inputvalue" type="text" placeholder="卸货地详细地址"></el-input>
                    </td>
                    <td>
                        <el-input v-model="inputvalue" type="text" placeholder="干线运费"></el-input>
                    </td>
                    <td>
                        <el-input v-model="inputvalue" type="text" placeholder="提货费"></el-input>
                    </td>
                    <td>
                        <el-input v-model="inputvalue" type="text" placeholder="送货费"></el-input>
                    </td>
                    <td>
                        <el-input v-model="inputvalue" type="text" placeholder="装货费"></el-input>
                    </td>
                    <td>
                        <el-input v-model="inputvalue" type="text" placeholder="卸货费"></el-input>
                    </td>
                    <td>
                        <el-input v-model="inputvalue" type="text" placeholder="其他费"></el-input>
                    </td>
                    <!-- 合计 -->
                    <td>
                        1315
                    </td>
                    <!-- 回单份数 -->
                    <td>
                        1
                    </td>
                    <!-- 订单备注 -->
                    <td>急送</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td>合计：</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <!-- 调度件数/件 -->
                    <td>3</td>
                    <!-- 调度重量/kg -->
                    <td>3300</td>
                    <!-- 调度体积/m³ -->
                    <td>6</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <!-- 干线运费 -->
                    <td>3945</td>
                    <!-- 提货费 -->
                    <td>0</td>
                    <!-- 送货费 -->
                    <td>0</td>
                    <!-- 装货费 -->
                    <td>0</td>
                    <!-- 卸货费 -->
                    <td></td>
                    <!-- 其他费 -->
                    <td>0</td>
                    <!-- 合计 -->
                    <td>3945</td>
                    <!-- 回单份数 -->
                    <td>3</td>
                    <td></td>
                </tr>
            </tfoot>
        </table>
      </div>
      <div class="clearfix infoTable">
          <div class="leftTitle">中转门到门信息</div>
          <div class="innerTable">
              <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                  <thead>
                        <tr> 
                            <th width="16%">供应商</th>
                            <th width="16%">联系人</th>
                            <th width="16%">联系电话</th>
                            <th width="16%">是否开票</th>
                            <th width="16%">回单份数</th>
                            <th width="16%"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <el-select v-model="inputvalue" placeholder="选择供应商">
                                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
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
                            <td></td>
                        </tr>
                    </tbody>
              </table>
              <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                  <thead>
                        <tr> 
                            <th width="16%">提货车牌号</th>
                            <th width="16%">车型</th>
                            <th width="16%">车长</th>
                            <th width="16%">提货司机</th>
                            <th width="16%">提货司机电话</th>
                            <th width="16%">要求运作时间</th>
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
                            <td>
                                <el-date-picker v-model="inputvalue" type="date" placeholder="选择日期"></el-date-picker>
                            </td>
                        </tr>
                    </tbody>
              </table>
              <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                  <thead>
                        <tr> 
                            <th width="16%">送货车牌号</th>
                            <th width="16%">车型</th>
                            <th width="16%">车长</th>
                            <th width="16%">送货司机</th>
                            <th width="16%">送货司机电话</th>
                            <th width="16%">要求运作时间</th>
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
                            <td>
                                <el-date-picker v-model="inputvalue" type="date" placeholder="选择日期"></el-date-picker>
                            </td>
                        </tr>
                    </tbody>
              </table>
              <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                  <thead>
                        <tr> 
                            <th width="16%">干线车牌号</th>
                            <th width="16%">车型</th>
                            <th width="16%">车长</th>
                            <th width="16%">干线司机</th>
                            <th width="16%">干线司机电话</th>
                            <th width="16%">外发单号</th>
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
                            <td>
                                <el-input v-model="inputvalue" type="text" placeholder="外发单号"></el-input>
                            </td>
                        </tr>
                    </tbody>
              </table>
              <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                  <thead>
                        <tr> 
                            <th>干线费</th>
                            <th>提货费</th>
                            <th>送货费</th>
                            <th>装货费</th>
                            <th>卸货费</th>
                            <th>其他费</th>
                            <th>费用合计</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <el-input v-model="inputvalue" type="text" placeholder="干线费"></el-input>
                            </td>
                            <td>
                                <el-input v-model="inputvalue" type="text" placeholder="提货费"></el-input>
                            </td>
                            <td>
                                <el-input v-model="inputvalue" type="text" placeholder="送货费"></el-input>
                            </td>
                            <td>
                                <el-input v-model="inputvalue" type="text" placeholder="装货费"></el-input>
                            </td>
                            <td>
                                <el-input v-model="inputvalue" type="text" placeholder="卸货费"></el-input>
                            </td>
                            <td>
                                <el-input v-model="inputvalue" type="text" placeholder="费用合计"></el-input>
                            </td>
                            <td>123</td>
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
                            <td>
                                <el-input v-model="inputvalue" type="text" placeholder="现付金额"></el-input>
                            </td>
                            <td>
                                <el-input v-model="inputvalue" type="text" placeholder="到付金额"></el-input>
                            </td>
                            <td>
                                <el-input v-model="inputvalue" type="text" placeholder="周期付金额"></el-input>
                            </td>
                            <td>
                                <el-input v-model="inputvalue" type="text" placeholder="周期天数"></el-input>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <thead>
                        <tr> 
                            <th width="25%">跟踪节点</th>
                            <th width="75%">跟踪内容</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <el-select v-model="inputvalue" placeholder="跟踪节点">
                                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-input v-model="inputvalue" type="text" placeholder="跟踪内容"></el-input>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td class="label" width="16%">订单备注</td>
                        <td class="value">
                            <el-input v-model="inputvalue" type="text" placeholder=""></el-input>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <h3 class="common-title mt_20">
            <span class="title-name">单据管理</span>
            <el-tooltip effect="dark" content="上传单据" placement="top-start" :hide-after='1000'>
                <img src="@/static/image/upload.png" class="upload_icon" alt="" @click="showUploadDialog">
            </el-tooltip>
        </h3>
        <div class="tickManager">
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
                    <tr v-for="(item,index) in ticketList" :key="index">
                        <td>{{index}}</td>
                        <td>{{item.codeName}}</td>
                        <td>{{item.time}}</td>
                        <td>{{item.name}}</td>
                        <td class="lastTd">
                            <a href="javascript:;" class="link" @click="showTickerImg(item.fullPath)">{{item.showName}}</a>
                            <div class="operate">
                                <el-tooltip effect="dark" content="删除图片" placement="top-start" :hide-after='1000'>
                                    <span class="del"></span>
                                </el-tooltip>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="bot-btn">
            <el-button @click="back">退出调度</el-button>
            <el-button type="primary">确定调度</el-button>
        </div>
        <table class="tableCommon mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th width="50">序号</th>
                        <th width="60">操作人</th>
                        <th width="100">操作时间</th>
                        <th width="100">跟踪节点</th>
                        <th width="350">跟踪内容</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>过磅单</td>
                        <td>2020/11/7 15:35:41</td>
                        <td>张三</td>
                        <td>
                            
                        </td>
                    </tr>
                </tbody>
            </table>
        <!-- 货物明细 -->
        <el-dialog title="货物明细" :visible.sync="isshowGoodsDetialDialog" width="700px">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item50">
                        <label class="label-term">订单号</label>
                        <div class="input-text">
                            <el-input v-model="inputvalue" type="text" placeholder=""></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">客户</label>
                        <div class="input-text">
                            <el-input v-model="inputvalue" type="text" placeholder=""></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">库存仓库</label>
                        <div class="input-text">
                            <el-input v-model="inputvalue" type="text" placeholder=""></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">卸货地</label>
                        <div class="input-text">
                            <el-input v-model="inputvalue" type="text" placeholder=""></el-input>
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
        <!-- 
            上传单据 
            successCallback     成功回调
            types   上传类型汇总数组，codeName和codeValue为固定key，子组件需拿其匹配
        -->
        <imgsUpload ref="imgsUpload" v-if="isshowUploadDialog" @successCallback="imgCallback"
         :types="[{codeName:'提货凭证',codeValue:1},{codeName:'货物清单',codeValue:2},{codeName:'其他单据',codeValue:3}]"></imgsUpload>
        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>
  </div>
</template>

<script>
import dispatch from './dispatch.js'
export default dispatch
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>