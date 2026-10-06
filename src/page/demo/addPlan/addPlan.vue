<template>
  <div id="addPlan" class="addPlanPage orderPage">
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
                <td class="label">起始日期</td>
                <td class="value">
                    <el-input v-model="inputvalue" type="text"></el-input>
                </td>
                <td class="label">结束日期</td>
                <td class="value">
                    <el-input v-model="inputvalue" type="text"></el-input>
                </td>
            </tr>
        </table>
        <h3 class="common-title mt_20">
            <span class="title-name">作业点信息</span>            
            <el-tooltip effect="dark" content="编辑顺序" placement="top-start" :hide-after='1000'>
                <img src="@/static/image/edit.png" class="edit" alt="" @click="showEditDialog">
            </el-tooltip>
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
                    <th width="50"></th>
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
                    <td>
                        <el-tooltip effect="dark" content="添加作业点" placement="top-start" :hide-after='1000'>
                            <span class="add"></span>
                        </el-tooltip>
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
                    <th width="50">
                        <el-tooltip effect="dark" content="添加货物" placement="top-start" :hide-after='1000'>
                            <span class="add"></span>
                        </el-tooltip>
                    </th>
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
                    <td>
                        <el-tooltip effect="dark" content="删除货物" placement="top-start" :hide-after='1000'>
                            <span class="del"></span>
                        </el-tooltip>
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
                    <td></td>
                </tr>
            </tfoot>
        </table>
        <div class="bot-btn">
            <el-button>关闭</el-button>
            <el-button type="primary">保存</el-button>
        </div>
    </div>
    <!-- 修改作业点信息顺序 -->
    <el-dialog class="editDialog" title="修改作业点顺序" :visible.sync="showDialog" width="700px">
      <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
          <thead>
                <tr>
                    <th width="100">作业点名称</th>
                    <th width="200">详细地址</th>
                    <th width="100">作业内容</th>
                    <th width="100">作业顺序</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>东莞凯金</td>
                    <td>广东东莞市寮步镇金富二路</td>
                    <td>提货</td>
                    <td>
                        <el-input v-model="inputvalue" type="text" placeholder="顺序" style="text-align:center;"></el-input>
                    </td>
                </tr>
            </tbody>            
      </table>
      <div class="page-bot-btn">
          <el-button size="mini">关闭</el-button>
          <el-button type="primary" size="mini">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import addPlan from './addPlan.js'
export default addPlan
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>