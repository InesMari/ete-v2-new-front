<template>
  <div id="cashOutOrder" class="cashOutOrderPage">
      <table class="infoTable" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td colspan="8">广东易迁易物流科技有限公司</td>
        </tr>
        <tr>
          <td colspan="8">请款单</td>
        </tr>
        <tr>
          <td colspan="2">请款部门</td>
          <td class="red">当前部门，不可修改</td>
          <td>请款人</td>
          <td class="red">当前人员，不可修改</td>
          <td>请款日期</td>
          <td class="red" colspan="2">当前日期，不可修改</td>
        </tr>
        <tr>
          <td rowspan="3" colspan="2">用途</td>
          <td colspan="3">
            <el-select v-model="selectValue" placeholder="请选择报销内容" class="tl">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
            </el-select>
          </td>
          <td colspan="3">账户信息（正确填写）</td>
        </tr>
        <tr>
          <td colspan="3" rowspan="2">
            <el-input v-model="inputvalue" placeholder="请输入备注" type="textarea"></el-input>
          </td>
          <td>
            收款方全称
          </td>
          <td colspan="2">
            <el-input v-model="inputvalue" placeholder="请输入收款方全称" type="text"></el-input>
          </td>
        </tr>
        <tr>
          <td>
            收款方全称
          </td>
          <td colspan="2">
            <el-input v-model="inputvalue" placeholder="请输入开户行" type="text"></el-input>
          </td>
        </tr>
        <tr>
          <td rowspan="2">
            请款金额
          </td>
          <td>
            小写
          </td>
          <td colspan="3">
            <el-input v-model="inputvalue" placeholder="请输入金额" type="text" class="tl"></el-input>
          </td>
          <td>账号</td>
          <td colspan="2">
            <el-input v-model="inputvalue" placeholder="请输入账户" type="text"></el-input>
          </td>
        </tr>
        <tr>
          <td>
            大写
          </td>
          <td colspan="3">
            零拾貮万伍仟陆佰零拾零元零角零分
          </td>
          <td>联系人</td>
          <td colspan="2">
            <el-input v-model="inputvalue" placeholder="非必填，请输入联系人" type="text"></el-input>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            支付方式
          </td>
          <td colspan="3">
            <el-checkbox v-model="inputvalue">现金</el-checkbox>
            <el-checkbox v-model="inputvalue">转账</el-checkbox>
            <el-checkbox v-model="inputvalue">核销</el-checkbox>
          </td>
          <td>
            电话
          </td>
          <td colspan="2">
            <el-input v-model="inputvalue" placeholder="非必填，请输入电话" type="text"></el-input>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            预计核销日期
          </td>
          <td colspan="3">
            <el-date-picker v-model="selectValue" type="date" class="tl" placeholder="默认当前日期" value-format="yyyy-MM-DD"></el-date-picker>
          </td>
          <td>转账跟踪</td>
          <td colspan="2"></td>
        </tr>
        <tr>
          <td colspan="2" rowspan="2">
            审批
          </td>
          <td>部门审核</td>
          <td>财务审核</td>
          <td>总经理</td>
          <td>出纳</td>
          <td>领款人签字</td>
          <td>备注</td>
        </tr>
        <tr>
          <td>xxx</td>
          <td>xxx</td>
          <td>xxx</td>
          <td>xxx</td>
          <td>xxx</td>
          <td>xx</td>
        </tr>
        <tr>
          <td colspan="2">
            说明
          </td>
          <td colspan="6" style="padding:10px 20px;text-align:left;">
            1、正确填写以上信息，如收款方信息错填而导致错转由请款人负责<br>
            2、业务结束或对应发票到后需填写成本费用报销单核销<br>
            3、所有签名必须自动带出审批日期<br>
          </td>
        </tr>
      </table>
      <div class="uploadFile clearfix" style="margin-top:20px;">
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
import cashOutOrder from './cashOutOrder.js'
export default cashOutOrder
</script>
<style lang="scss" src="./cashOutOrder.scss"></style>