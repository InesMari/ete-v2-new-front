<template>
  <div id="contractDetail" class="contractPage">
    <div id="printTable">
    <h3 class="tableTitle">供应商合同/协议评审记录</h3>
    <table class="contractTable" border="0" cellspacing="0" cellpadding="0">
      <tr>
        <td class="label" width="120">评审日期</td>
        <td colspan="3"></td>
      </tr>
      <tr>
        <td class="label">供应商名称</td>
        <td></td>
        <td class="label" width="120">表单启用</td>
        <td></td>
      </tr>
      <tr>
        <td class="label">合同类型</td>
        <td colspan="3">
          <el-checkbox-group v-model="model">
            <el-checkbox value="0">普通运输</el-checkbox>
            <el-checkbox value="1">危险品运输</el-checkbox>
            <el-checkbox value="2">仓储服务</el-checkbox>
            <el-checkbox value="3">劳务服务</el-checkbox>
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td class="label">合同类别</td>
        <td colspan="3">
          <el-checkbox-group v-model="model">
            <el-checkbox value="0">1</el-checkbox>
            <el-checkbox value="1">2</el-checkbox>
            <el-checkbox value="2">3</el-checkbox>
            <el-checkbox value="3">4</el-checkbox>
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td class="label">评审人员</td>
        <td colspan="3">
            提请中心：
            <el-select v-model="model" placeholder="请选择负责人">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            商务中心：
            <el-select v-model="model" placeholder="请选择负责人">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            财务中心：
            <el-select v-model="model" placeholder="请选择负责人">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            总经办：
            <el-select v-model="model" placeholder="请选择负责人">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
        </td>
      </tr>
      <tr>
        <td class="label">申请人</td>
        <td>xxx</td>
        <td class="label">申请部门</td>
        <td>xxx</td>
      </tr>
      <tr>
        <td class="label">申请事由</td>
        <td colspan="3">
          <el-input v-model="model" placeholder="请填写申请事由"></el-input>
        </td>
      </tr>
      <tr>
        <td class="label" rowspan="7">供应商主体资质审核</td>
        <td colspan="3">
          1.运输区域：
          <el-checkbox-group v-model="model" style="margin-left:20px;">
            <el-checkbox value="0">1</el-checkbox>
            <el-checkbox value="1">2</el-checkbox>
            <el-checkbox value="2">3</el-checkbox>
            <el-checkbox value="3">4</el-checkbox>
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          2.相关证照：
          <el-checkbox-group v-model="model" style="margin-left:20px;">
            <el-checkbox value="1">营业执照</el-checkbox>
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          3.相关资质：
          <el-checkbox-group v-model="model" style="margin-left:20px;">
            <el-checkbox value="1">道路运输许可</el-checkbox>
            <el-checkbox value="2">危险品运输许可</el-checkbox>
            <el-checkbox value="3">其他行业证件</el-checkbox>
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          4.成立日期：
          <el-date-picker v-model="model" type="date" placeholder="选择日期" style="margin-left:10px;">
          </el-date-picker>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          5.注册资本：
          <el-input placeholder="按营业执照填写" style="width:80%;margin-left:20px;"></el-input>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          6.注册地址：
          <el-input placeholder="按营业执照填写" style="width:80%;margin-left:20px;"></el-input>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          7.垫资能力：
          <el-checkbox-group v-model="model" style="margin-left:20px;">
            <el-checkbox value="0">1</el-checkbox>
            <el-checkbox value="1">2</el-checkbox>
            <el-checkbox value="2">3</el-checkbox>
            <el-checkbox value="3">4</el-checkbox>
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td class="label" rowspan="7">服务或资质要求与风险防范</td>
        <td colspan="3">
          <span class="innerT">1. 产品类：生产许可、产品检测报告、质量认证。</span>
          <el-checkbox-group v-model="model">
            <el-checkbox value="1">有</el-checkbox>
            <el-checkbox value="0">无</el-checkbox>
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <span class="innerT">2. 体系认证及安全：ISO 质量认证体系、安全、消防资质。</span>
          <el-checkbox-group v-model="model">
            <el-checkbox value="1">有</el-checkbox>
            <el-checkbox value="0">无</el-checkbox>
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <span class="innerT">3. 场地（厂房）房屋产权证。</span>
          <el-checkbox-group v-model="model">
            <el-checkbox value="1">有</el-checkbox>
            <el-checkbox value="0">无</el-checkbox>
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <span class="innerT">4. 是否相关保险（车辆险、运输险、货物险、财产险）。</span>
          <el-checkbox-group v-model="model">
            <el-checkbox value="1">有</el-checkbox>
            <el-checkbox value="0">无</el-checkbox>
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <span class="innerT">5. 合作风险防范措施/方案：</span>
          <el-checkbox-group v-model="model">
            <el-checkbox value="1">有</el-checkbox>
            <el-checkbox value="0">无</el-checkbox>
          </el-checkbox-group>
          <div>
            请列出：
            <el-input placeholder="请输入合作风险防范措施" style="width:80%;"></el-input>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          6.履约期限：
          <el-date-picker
            v-model="model"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          7. 合同纠纷法院：
          <el-input placeholder="请输入合作纠纷法院名称" style="width:80%;"></el-input>
        </td>
      </tr>
      <tr>
        <td class="label" rowspan="6">结款条件</td>
        <td colspan="3">
          <span class="innerLable">1. 付款方式：</span>
          <el-checkbox-group v-model="model">
            <el-checkbox value="1">转账</el-checkbox>
            <el-checkbox value="2">商业承兑</el-checkbox>
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <span class="innerLable">2. 对账：</span>
          每月<el-input placeholder="请填写" class="innerIpt"></el-input
          >号前对账，每月<el-input placeholder="请填写" class="innerIpt"></el-input>号前交发票
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <span class="innerLable">3.发票：</span>
          <el-checkbox-group v-model="model">
            <el-checkbox value="1">增值税专用票</el-checkbox>
            <el-checkbox value="2">增值税普通发票</el-checkbox>
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <span class="innerLable">4.税率：</span>
          <el-checkbox-group v-model="model">
            <el-checkbox value="1">3%</el-checkbox>
            <el-checkbox value="2">6%</el-checkbox>
            <el-checkbox value="3">9%</el-checkbox>
            <el-checkbox value="4">13%</el-checkbox>
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <span class="innerLable">5.账期见票结：</span>
          <el-checkbox-group v-model="model">
            <el-checkbox value="1">45天</el-checkbox>
            <el-checkbox value="2">60天</el-checkbox>
            <el-checkbox value="3">90天</el-checkbox>
            <el-checkbox value="4">120天</el-checkbox>
          </el-checkbox-group>
        </td>
      </tr>
      <tr>
        <td colspan="3">
          <span class="innerLable">6.押金：</span>
          <el-checkbox-group v-model="model">
            <el-checkbox value="1">有</el-checkbox>
            <el-checkbox value="0">无</el-checkbox>
          </el-checkbox-group>
          <div>支付/退回期限<el-input placeholder="请填写" class="innerIpt"></el-input>天</div>
        </td>
      </tr>
      <tr>
        <td colspan="4" class="fw txt_c">评审记录（注意：当您评审时，应对以上审查事项重点核实，并对您的评审意见负责）</td>
      </tr>
      <tr>
        <td class="label">评审中心</td>
        <td class="label" colspan="2">评审意见</td>
        <td class="label">评审人/日期</td>
      </tr>
      <tr>
        <td class="label">提请中心</td>
        <td class="label blue" colspan="2">统一</td>
        <td class="label blue">xxx/2023-01-22</td>
      </tr>
      <tr>
        <td class="label">商务中心</td>
        <td class="label blue" colspan="2"></td>
        <td class="label blue"></td>
      </tr>
      <tr>
        <td class="label">财务中心</td>
        <td class="label blue" colspan="2"></td>
        <td class="label blue"></td>
      </tr>
      <tr>
        <td class="label">总经办</td>
        <td class="label blue" colspan="2"></td>
        <td class="label blue"></td>
      </tr>
    </table>
    <div class="remarks">
      <div>注：</div>
      <div>
        1. 评审意见应客观填写；<br />
        2. 若属重大（或有特别要求）的合同/协议，合同签订主导部门应附市场背景及相关情况说明；<br />
        3.评审通过后，此记录与合同文件等同存公司；<br />
<!--        <span class="fw">4. 本表单财务编制，如有任何调整或修订由财务发布。</span>-->
      </div>
    </div>
    </div>
    <div class="uploadFile clearfix">
      <div class="imgList fl">
        <myFileModel></myFileModel>
        <p>只支持.jpg .png 格式</p>
      </div>
    </div>

    <div class="bot-btn">      
        <el-button type="primary" @click="print">打印</el-button>
        <el-button type="primary" @click="success">评审通过</el-button>
        <el-button type="danger" @click="fail">评审不通过</el-button>
    </div>
  </div>
      
</template>

<script>
import contractDetail from "./contractDetail.js";
export default contractDetail;
</script>
<style scoped src="./contract.scss" lang="scss" ></style>
