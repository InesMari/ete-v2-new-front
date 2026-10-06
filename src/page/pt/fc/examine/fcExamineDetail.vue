<template>
  <div id="fcExamineDetail" class="fcExamineDetailPage">
    <div class="common-info clearfix">
        <h3>基本信息</h3>
        <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td class="label"><em>*</em>考核名称</td>
                <td class="value" colspan="2">
                  <el-input v-model="info.baseInfo.name" placeholder="考核名称" :disabled="type==3"></el-input>
                </td>
                <td class="label"><em>*</em>考核年度</td>
                <td class="value" colspan="2">
                  <el-date-picker @input="$forceUpdate()" v-model="info.baseInfo.year" type="year"
                                  placeholder="选择日期" align="right" @change="initName"
                                  format="yyyy" value-format="yyyy"  :disabled="type==3">
                  </el-date-picker>
                </td>
            </tr>
            <tr>
                <td class="label">备注</td>
                <td class="value" colspan="5">
                    <el-input v-model="info.baseInfo.remark" placeholder="备注"  :disabled="type==3"></el-input>
                </td>
            </tr>
        </table>
        <div class="tableItem" style="margin-top: 10px;">
            <h3>
              <span>指标列表</span>
                <el-button class="fr" size="mini" style="margin-top:6px;" @click="operation()" v-if="type!=3">操作</el-button>
            </h3>
          <div style="overflow: auto;height:calc(100% - 40px); ">
            <table ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                      <th width="50" rowspan="2">序号</th>
                      <th :width="hd.width" v-for="(hd,index) in head" :key="index"
                          :rowspan="hd.children&&hd.children.length>0?1:2"
                          :colspan="hd.children&&hd.children.length?hd.children.length:1">
                        {{hd.name}}
                      </th>
                    </tr>
                    <tr>
                      <th :width="hd.width" v-for="(hd,index) in headTr2" :key="index">{{hd.name}}</th>
                    </tr>
                </thead>
                <vuedraggable element="tbody" v-model="info.items">
                    <tr v-for="(item,idx) in info.items" :key="idx">
                        <td>{{idx+1}}</td>
                        <td :width="hd.width" v-for="(hd,index) in headShow" :key="index">
                            <el-input v-model="item[hd.code]" v-if="type!=3&&hd.type == 'inputText'" @input="$forceUpdate()" maxlength="10"></el-input>
                            <span v-else>{{item[hd.code]}}</span>
                        </td>
                    </tr>
                </vuedraggable>
            </table>
          </div>
        </div>
        
        <div class="bot-btn" style="margin-top: 20px;">
            <el-button @click="closePage">取消</el-button>
            <el-button type="primary" @click="submit" v-if="type!=3">保存</el-button>
        </div>
    </div>
    <el-dialog class="operateDialog" title="操作" :visible.sync="isShowDialog" width="1000px" >
        <div class="title">
            <div>不展示项目</div>
            <div>展示项目</div>
        </div>
        <dbTable tableName="addQuoteLDTable" ref="table" :head="operateHead" onlyId="itemId"></dbTable>
        <div class="bot-btn">
            <el-button @click="isShowDialog = false">取消</el-button>
            <el-button type="primary" @click="saveChange">保存</el-button>
        </div>
    </el-dialog>
  </div>
</template>

<script>
import fcExamineDetail from "./fcExamineDetail.js";
export default fcExamineDetail;
</script>
<style src="./fcExamineDetail.scss" lang="scss" scoped></style>
