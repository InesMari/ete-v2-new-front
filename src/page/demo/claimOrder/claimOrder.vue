<template>
  <div id="claimOrder" class="claimOrderPage orderPage">
    <div class="common-info">
        <h3 class="common-title"><span class="title-name">基本信息</span></h3>
        <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td class="label">订单编号</td>
                <td class="value">
                    <el-input v-model="inputvalue" type="text"></el-input>
                </td>
                <td class="label">下单人</td>
                <td class="value">
                    <el-input v-model="inputvalue" type="text"></el-input>
                </td>
                <td class="label">下单时间</td>
                <td class="value">
                    <el-input v-model="inputvalue" type="text"></el-input>
                </td>
                <td class="label">订单类型</td>
                <td class="value">
                    <el-select v-model="inputvalue" placeholder="订单类型">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                    </el-select>
                </td>
            </tr>
            <tr>
                <td class="label">下单客户</td>
                <td class="value">
                    <el-input v-model="inputvalue" type="text"></el-input>
                </td>
                <td class="label">发货联系人</td>
                <td class="value">
                    <el-input v-model="inputvalue" type="text"></el-input>
                </td>
                <td class="label">发货联系电话</td>
                <td class="value">
                    <el-input v-model="inputvalue" type="text"></el-input>
                </td>
                <td class="label">线路名称</td>
                <td class="value">
                    <el-select v-model="inputvalue" placeholder="线路名称">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                    </el-select>
                </td>
            </tr>
            <tr>
                <td class="label">是否加急</td>
                <td class="value">
                    <el-select v-model="inputvalue" placeholder="是否加急">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                    </el-select>
                </td>
                <td class="label">客户单号</td>
                <td class="value">
                    <el-input v-model="inputvalue" type="text"></el-input>
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
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
                    <th>联系人</th>
                    <th>联系手机</th>
                    <th>联系电话</th>
                    <th>详细地址</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                    <td>
                        <el-select v-model="inputvalue" placeholder="请选择作业点">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-select v-model="inputvalue" placeholder="请选择作业内容">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-input v-model="inputvalue" type="text" placeholder="联系人"></el-input>
                    </td>
                    <td>
                        <el-input v-model="inputvalue" type="text" placeholder="联系手机"></el-input>
                    </td>
                    <td>
                        <el-input v-model="inputvalue" type="text" placeholder="联系电话"></el-input>
                    </td>
                    <td>
                        <el-input v-model="inputvalue" type="text" placeholder="详细地址"></el-input>
                    </td>
                </tr>
            </tbody>
        </table>
        <table class="tableCommon mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
                <tr>
                    <th>货物名称</th>
                    <th>货物类别</th>
                    <th>包装类型</th>
                    <th>提货点</th>
                    <th>卸货点</th>
                    <th>货物件数（件）</th>
                    <th>货物重量（KG）</th>
                    <th>货物体积（m³）</th>
                    <th>规格</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <el-select v-model="inputvalue" placeholder="填写或选择货物名称">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-select v-model="inputvalue" placeholder="货物类别">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-select v-model="inputvalue" placeholder="包装类型">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-select v-model="inputvalue" placeholder="提货点">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-select v-model="inputvalue" placeholder="卸货点">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                        </el-select>
                    </td>
                    <td>
                        <el-input v-model="inputvalue" type="text" placeholder="货物件数"></el-input>
                    </td>
                    <td>
                        <el-input v-model="inputvalue" type="text" placeholder="货物重量"></el-input>
                    </td>
                    <td>
                        <el-input v-model="inputvalue" type="text" placeholder="货物体积"></el-input>
                    </td>
                    <td>
                        <el-input v-model="inputvalue" type="text" placeholder="规格"></el-input>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td>合计：</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="red">0</td>
                    <td class="red">88</td>
                    <td class="red">1259</td>
                    <td></td>
                </tr>
            </tfoot>
        </table>
        <table class="fillTbale mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td class="label">计费方式</td>
                <td class="value">
                    <el-select v-model="inputvalue" placeholder="计费方式">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                    </el-select>
                </td>
                <td class="label">车型</td>
                <td class="value">
                    <el-select v-model="inputvalue" placeholder="车型">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                    </el-select>
                </td>
                <td class="label">车长</td>
                <td class="value">
                    <el-select v-model="inputvalue" placeholder="车长">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                    </el-select>
                </td>
                <td class="label">结算方式</td>
                <td class="value">
                    <el-select v-model="inputvalue" placeholder="结算方式">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                    </el-select>
                </td>
            </tr>
        </table>
        <table class="tableCommon mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
                <tr>
                    <th>净重（KG）</th>
                    <th>毛重（KG）</th>
                    <th>中途点数</th>
                    <th>单价</th>
                    <th>
                        运费
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">按重量：单价*重量<br/>按体积：单价*体积</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </th>
                    <th>装货费</th>
                    <th>卸货费</th>
                    <th>其他费</th>
                    <th>
                        点位费                        
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">中途点数*单价</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </th>
                    <th>
                        费用合计                        
                        <el-tooltip class="item" effect="light" placement="top-start">
                            <div slot="content">运费+装卸费+卸货费+其他费+点位费</div>
                            <i class="el-icon-question pointer"></i>
                        </el-tooltip>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>
                        <el-input v-model="inputvalue" type="text" placeholder=""></el-input>
                    </td>
                    <td>
                        <el-input v-model="inputvalue" type="text" placeholder=""></el-input>
                    </td>
                    <td>
                        0
                    </td>
                    <td>
                        <el-input v-model="inputvalue" type="text" placeholder=""></el-input>
                    </td>
                    <td>
                        <el-input v-model="inputvalue" type="text" placeholder=""></el-input>
                    </td>
                    <td>
                        <el-input v-model="inputvalue" type="text" placeholder=""></el-input>
                    </td>
                    <td>
                        <el-input v-model="inputvalue" type="text" placeholder=""></el-input>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>        
        <table class="tableCommon mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
            <thead>
                <tr>
                    <th>提付</th>
                    <th>现付</th>
                    <th>回单付</th>
                    <th>月结</th>
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
        <table class="fillTbale mt_20" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td class="label">订单备注</td>
                <td class="value" colspan="7">
                    <el-input v-model="inputvalue" type="text" placeholder=""></el-input>
                </td>
            </tr>
        </table>
        <div class="bot-btn">
            <el-button>关闭</el-button>
            <el-button type="primary">保存</el-button>
            <el-button type="primary">保存并整车调度</el-button>
        </div>
    </div>
  </div>
</template>

<script>
import claimOrder from './claimOrder.js'
export default claimOrder
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>