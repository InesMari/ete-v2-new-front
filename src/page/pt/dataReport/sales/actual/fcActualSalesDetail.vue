<template>
  <div id="fcActualSalesDetail" class="fcActualSalesDetailPage">
    <div class="common-info clearfix">
        <h3>基本信息</h3>
        <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0" v-if="type!=3">
            <tr>
                <td class="label"><em>*</em>实际营收名称</td>
                <td class="value" colspan="2">
                  <el-input v-model="info.baseInfo.name" placeholder="实际营收名称"  :disabled="!baseInfoModifyFlag"></el-input>
                </td>
                <td class="label"><em>*</em>营收年度</td>
                <td class="value" colspan="2">
                  <el-date-picker @input="$forceUpdate()" v-model="info.baseInfo.year" type="year"
                                  placeholder="选择年度" align="right" @change="initName"
                                  format="yyyy" value-format="yyyy"   :disabled="!baseInfoModifyFlag">
                  </el-date-picker>
                </td>
            </tr>
            <tr>
                <td class="label">备注</td>
                <td class="value" colspan="5">
                    <el-input v-model="info.baseInfo.remark" placeholder="备注"   :disabled="!baseInfoModifyFlag"></el-input>
                </td>
            </tr>
        </table>
        <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0" v-else>
          <tr>
            <td class="label">实际营收名称</td>
            <td class="value">
              <el-input v-model="info.baseInfo.name" disabled="true"></el-input>
            </td>
            <td class="label">营收年度</td>
            <td class="value">
              <el-input v-model="viewYear" disabled="true"></el-input>
            </td>
            <td class="label">营收金额合计</td>
            <td class="value">
              <el-input v-model="info.baseInfo.totalFee" disabled="true"></el-input>
            </td>
          </tr>
          <tr>
            <td class="label">备注</td>
            <td class="value">
              <el-input v-model="info.baseInfo.remark" disabled="true"></el-input>
            </td>
            <td class="label">创建人</td>
            <td class="value">
              <el-input v-model="info.baseInfo.createUser" disabled="true"></el-input>
            </td>
            <td class="label">创建时间</td>
            <td class="value">
              <el-input v-model="info.baseInfo.createDate" disabled="true"></el-input>
            </td>
          </tr>
        </table>
        <div class="tableItem" style="margin-top: 10px;">
            <h3>
              <span>实际营收明细</span>
            </h3>
          <div style="overflow: auto;height:calc(100% - 40px); ">
            <table ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                      <th width="80">序号</th>
                      <th width="120">所属区域</th>
                      <th width="150">二级划分</th>
                      <th width="100">客户性质</th>
                      <th width="180">客户名称</th>
                      <th width="120">业务类型</th>
                      <th width="100" v-for="idx of 12 " :key="idx">{{idx}}月</th>
                      <th width="100" >合计</th>
                      <th width="50" v-if="addBtnFlag">
                        <el-tooltip effect="dark" content="添加" placement="top-start" :hide-after='1000'>
                          <span @click="addItem" class="add"></span>
                        </el-tooltip>
                      </th>
                    </tr>
                </thead>
                <vuedraggable element="tbody" v-model="info.dtlList">
                    <tr v-for="(item,idx) in info.dtlList" :key="idx">
                        <td>{{idx+1}}</td>
                        <td>
                          <el-select v-model="item.regionId" placeholder="请选择所属区域" filterable clearable
                                     @change="changeRegionSelect(item)"
                                     v-if="modifyFlag&&item.itemModifyFlag">
                            <el-option v-for="subItem in regionData" :key="subItem.id" :label="subItem.regionName" :value="subItem.id" >
                            </el-option>
                          </el-select>
                          <span v-else>{{item.regionName}}</span>
                        </td>
                        <td>
                          <el-select v-model="item.orgId" placeholder="请选择二级划分" filterable clearable
                                     v-if="modifyFlag&&item.itemModifyFlag">
                            <el-option v-for="subItem in item.orgData" :key="subItem.id"
                                       :label="subItem.orgName"
                                       :value="subItem.id">
                            </el-option>
                          </el-select>
                          <span v-else>{{item.orgName}}</span>
                        </td>
                        <td>
                          <el-select v-model="item.custSource" placeholder="客户性质" v-if="modifyFlag&&item.itemModifyFlag">
                            <el-option v-for="subItem in custSourceData" :key="subItem.codeValue" :label="subItem.codeName" :value="subItem.codeValue"></el-option>
                          </el-select>
                          <span v-else>{{item.custSourceName}}</span>
                        </td>
                        <td>
                          <el-input v-model="item.custName" v-if="modifyFlag&&item.itemModifyFlag&&item.custSource=='1'" @input="$forceUpdate()"></el-input>
                          <el-select v-model="item.custTenantId" @change="changeCustomer(item)" filterable placeholder="选择客户" v-if="modifyFlag&&item.itemModifyFlag&&item.custSource=='2'">
                            <el-option v-for="item in customerData" :key="item.tenantId" :label="item.name" :value="item.tenantId"></el-option>
                          </el-select>
                          <span v-else>{{item.custName}}</span>
                        </td>
                        <td>
                          <el-select v-model="item.businessType" placeholder="业务类型" v-if="modifyFlag&&item.itemModifyFlag" filterable>
                            <el-option v-for="subItem in businessTypeData" :key="subItem.codeValue" :label="subItem.codeName" :value="subItem.codeValue"></el-option>
                          </el-select>
                          <span v-else>{{item.businessTypeName}}</span>
                        </td>
                        <td v-for="idx of 12 " :key="idx">
                          <el-input v-model="item['fee'+idx]"  @input="calFee(item)"  v-if="modifyFlag&&(idx>feeIdx||item.itemModifyFlag)" v-mydoubleval></el-input>
                          <span v-else>{{item['fee'+idx]}}</span>
                        </td>
                      <td>{{item.totalFee}} </td>
                      <td >
                        <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000' v-if="addBtnFlag&&item.itemModifyFlag" >
                          <span @click="delItem(idx)" class="del"></span>
                        </el-tooltip>
                      </td>
                    </tr>
                </vuedraggable>
              <tfoot v-if="!modifyFlag">
                <tr>
                  <td>合计：{{info.dtlList.length}}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td v-for="idx of 12 " :key="idx">{{info.totalInfo['fee'+idx]}}</td>
                  <td>{{info.totalInfo.totalFee}}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        
        <div class="bot-btn" style="margin-top: 20px;">
            <el-button @click="closePage">取消</el-button>
            <el-button type="primary" @click="submit" v-if="saveBthFlag">保存</el-button>
        </div>
    </div>
  </div>
</template>

<script>
import fcActualSalesDetail from "./fcActualSalesDetail.js";
export default fcActualSalesDetail;
</script>
<style src="./fcActualSalesDetail.scss" lang="scss" scoped></style>
