<template>
  <div id="addPaymentOrder" class="addPaymentOrderPage">
      <table class="infoTable" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td colspan="6">广东易迁易物流科技有限公司</td>
        </tr>
        <tr>
          <td colspan="6">付款单</td>
        </tr>
        <tr>
          <td colspan="6" class="pd20">
            <div class="fl">报销部门：<span class="red">当前部门，不可修改</span></div>
            <div class="fr">填写日期：<span class="red">当前日期，不可修改</span></div>
          </td>
        </tr>
        <tr>
          <td>注意事项</td>
          <td>报销内容</td>
          <td>归集客户</td>
          <td>业务月份</td>
          <td>支付金额（元）</td>
          <td>备注</td>
        </tr>
        <tr>
          <td rowspan="9" class="pd20" style="text-align:left;">
            1、按税务需求提供正确发票；<br><br>
            2、发票需加盖发票专用章；<br><br>
            3、报销内容与支出用途一致；<br><br>
            4、请附购买申请单、暂借(付)款单等；<br><br>
            5、转账的需提供收款方开户行与账号。
          </td>
          <td>
            <el-select v-model="selectValue" placeholder="请选择报销内容">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
            </el-select>
          </td>
          <td>
            <el-select v-model="selectValue" placeholder="请选择归属客户">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
            </el-select>
          </td>
          <td>
            <el-date-picker v-model="selectValue" type="month" placeholder="请选择业务月份" value-format="yyyy-MM"></el-date-picker>
          </td>
          <td>
            <el-input v-model="inputvalue" placeholder="请选择金额" type="text"></el-input>
          </td>
          <td>
            <el-input v-model="inputvalue" placeholder="备注非必填" type="text"></el-input>
          </td>
        </tr>
        <tr>
          <td>
            <el-select v-model="selectValue" placeholder="请选择报销内容">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
            </el-select>
          </td>
          <td>
            <el-select v-model="selectValue" placeholder="请选择归属客户">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
            </el-select>
          </td>
          <td>
            <el-date-picker v-model="selectValue" type="month" placeholder="请选择业务月份" value-format="yyyy-MM"></el-date-picker>
          </td>
          <td>
            <el-input v-model="inputvalue" placeholder="请选择金额" type="text"></el-input>
          </td>
          <td>
            <el-input v-model="inputvalue" placeholder="备注非必填" type="text"></el-input>
          </td>
        </tr>
        <tr>
          <td>
            <el-select v-model="selectValue" placeholder="请选择报销内容">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
            </el-select>
          </td>
          <td>
            <el-select v-model="selectValue" placeholder="请选择归属客户">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
            </el-select>
          </td>
          <td>
            <el-date-picker v-model="selectValue" type="month" placeholder="请选择业务月份" value-format="yyyy-MM"></el-date-picker>
          </td>
          <td>
            <el-input v-model="inputvalue" placeholder="请选择金额" type="text"></el-input>
          </td>
          <td>
            <el-input v-model="inputvalue" placeholder="备注非必填" type="text"></el-input>
          </td>
        </tr>
        <tr>
          <td colspan="3">合&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;计</td>
          <td colspan="2" class="red">自动计算</td>
        </tr>
        <tr>
          <td colspan="5" class="pd20">
            <div>金额大写：</div>              
          </td>
        </tr>
        <tr>
          <td colspan="5" class="pd20">
            <div class="fl">暂借（付）款：<el-input v-model="inputvalue" placeholder="非必填，暂借（付）款" type="text" style="display:inline-block;width:170px;"></el-input>元</div>
            <div class="fr">应补（退）金额：<span class="red">202266</span>元</div>
          </td>
        </tr>
        <tr>
          <td colspan="5" class="pd20">
            <div class="fl" style="width:37%">
              付款方式：
              <el-checkbox v-model="inputvalue">现金</el-checkbox>
              <el-checkbox v-model="inputvalue">转账</el-checkbox>
              <el-checkbox v-model="inputvalue">核销</el-checkbox>
            </div>
            <div class="fl" style="margin-left:30px;">
              预计支付日期：<el-date-picker v-model="selectValue" type="date" placeholder="默认当前日期" value-format="yyyy-MM-DD"></el-date-picker>
            </div>
            <div class="fr" style="margin-right:9%;">
              出纳盖章处
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="5" class="pd20">
            <div class="fl">收款方全称：<el-input v-model="inputvalue" placeholder="请输入收款方全称" type="text" style="display:inline-block;width:200px;"></el-input></div>
            <div class="fr" style="width:300px;">收款方全称：<el-input v-model="inputvalue" placeholder="请输入开户行" type="text" style="display:inline-block;width:200px;"></el-input></div>
          </td>
        </tr>
        <tr>
          <td colspan="5" class="pd20">
            <div class="fl">账号：<el-input v-model="inputvalue" placeholder="请输入收款方账号" type="text" style="display:inline-block;width:200px;margin-left: 42px;"></el-input></div>
            <div class="fr" style="width:300px;">领款人：<span class="red">东山少爷</span></div>
          </td>
        </tr>
      </table>
      <div class="auditor clearfix">
        <div class="item">总经办核准：高小伟</div>
        <div class="item">财务复核：黄聪丽</div>
        <div class="item">部门审核：杨柳</div>
        <div class="item">部门制成：陈楚涛</div>
      </div>
      <div class="uploadFile clearfix">
        <div class="fl">
          <myFileModel></myFileModel>
          <p>只支持.jpg .png 格式</p>
        </div>
        <div class="imgList fl">
          <img src="@/static/image/hzkb_back.png" alt="">
          <img src="@/static/image/hzkb_back.png" alt="">
          <img src="@/static/image/hzkb_back.png" alt="">
          <img src="@/static/image/hzkb_back.png" alt="">
          <img src="@/static/image/hzkb_back.png" alt="">
        </div>
        <div class="form fr">
          审核人：
          <el-select v-model="selectValue" placeholder="请选择审核人">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
          </el-select>
          <el-button type="primary">提交</el-button>
        </div>
      </div>
  </div>
</template>

<script>
import addPaymentOrder from './addPaymentOrder.js'
export default addPaymentOrder
</script>
<style lang="scss" src="./addPaymentOrder.scss"></style>