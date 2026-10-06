<template>
  <div id="hrManagementCostDetail" class="hrManagementCostDetailPage">
    <div class="common-info clearfix">
        <h3>基本信息</h3>
        <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0" v-if="type!=3">
            <tr>
                <td class="label"><em>*</em>成本月份</td>
                <td class="value" colspan="5">
                  <el-date-picker @input="$forceUpdate()" v-model="info.billMonth" type="month"
                                  placeholder="选择成本月份" align="left"
                                  format="yyyy-MM" value-format="yyyy-MM">
                  </el-date-picker>
                </td>
            </tr>
        </table>
        <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0" v-else>
          <tr>
            <td class="label">预算年度</td>
            <td class="value">
              <el-input v-model="info.billMonth" disabled="true"></el-input>
            </td>
            <td class="label">管理成本合计</td>
            <td class="value">
              <el-input v-model="info.totalFee" disabled="true"></el-input>
            </td>
          </tr>
          <tr>
            <td class="label">创建人</td>
            <td class="value">
              <el-input v-model="info.createUserName" disabled="true"></el-input>
            </td>
            <td class="label">创建时间</td>
            <td class="value">
              <el-input v-model="info.createDate" disabled="true"></el-input>
            </td>
          </tr>
        </table>
        <div class="tableItem" style="margin-top: 10px;">
            <h3>
              <span>成本明细</span>
            </h3>
          <div style="overflow: auto;height:calc(100% - 100px); ">
            <table ref="simpleTable" class="tableCommon" width="100%" >
                <thead>
                    <tr>
                      <th width="80">序号</th>
                      <th width="200">部门</th>
                      <th width="150">工资</th>
                      <th width="150">社保</th>
                      <th width="150">公积金</th>
                      <th width="150">福利</th>
                    </tr>
                </thead>
              <tbody>
                    <tr v-for="(item,idx) in info.detailList" :key="idx">
                        <td>{{idx+1}}</td>
                        <td>
                          <span>{{item.orgName}}</span>
                        </td>
                        <td>
                          <el-input v-model="item.wages"  @input="calFee(item,'wages')"  v-if="type!=3" v-mydoubleval></el-input>
                          <span v-else>{{item.wages}}</span>
                        </td>
                        <td>
                          <el-input v-model="item.socialInsurance"  @input="calFee(item,'socialInsurance')"  v-if="type!=3" v-mydoubleval></el-input>
                          <span v-else>{{item.socialInsurance}}</span>
                        </td>
                      <td>
                        <el-input v-model="item.accumulationFund"  @input="calFee(item,'accumulationFund')"  v-if="type!=3" v-mydoubleval></el-input>
                        <span v-else>{{item.accumulationFund}}</span>
                      </td>
                      <td>
                        <el-input v-model="item.welfareCosts"  @input="calFee(item,'welfareCosts')"  v-if="type!=3" v-mydoubleval></el-input>
                        <span v-else>{{item.welfareCosts}}</span>
                      </td>
                    </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td>合计：{{info.detailList.length}}</td>
                  <td></td>
                  <td>{{info.totalInfo.wages}}</td>
                  <td>{{info.totalInfo.socialInsurance}}</td>
                  <td>{{info.totalInfo.accumulationFund}}</td>
                  <td>{{info.totalInfo.welfareCosts}}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        <div class="bot-btn" style="margin-top: 20px;">
            <el-button @click="closePage">关闭</el-button>
            <el-button type="primary" @click="submit" v-if="type!=3">保存</el-button>
        </div>
    </div>
  </div>
</template>

<script>
import hrManagementCostDetail from "./hrManagementCostDetail.js";
export default hrManagementCostDetail;
</script>
<style src="./hrManagementCostDetail.scss" lang="scss" scoped></style>
