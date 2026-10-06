<template>
  <div id="wmsExamineItemStatisticsManage" class="wmsExamineItemStatisticsManagePage">
    <div class="common-info clearfix">
        <h3>基本信息</h3>
        <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td class="label"><em>*</em>核查编号</td>
                <td class="value" colspan="2">
                  <el-input v-model="info.baseInfo.examineNum" placeholder="核查编号" :disabled="true"></el-input>
                </td>
                <td class="label"><em>*</em>核查名称</td>
                <td class="value" colspan="2">
                  <el-input v-model="info.baseInfo.examineName" placeholder="核查名称" :disabled="true"></el-input>
                </td>
            </tr>
        </table>
        <div class="tableItem" style="margin-top: 10px;">
            <h3>
              <span>核查详情</span>
            </h3>
          <div style="overflow: auto;height:calc(100% - 40px); ">
            <table ref="simpleTable" class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                      <th width="50" rowspan="2">序号</th>
                      <th :width="hd.width" v-for="(hd,index) in head" :key="index">
                        {{hd.name}}
                      </th>
                    </tr>
                </thead>
                <tbody>
                  <tr v-for="(item,idx) in info.items" :key="idx">
                      <td>{{idx+1}}</td>
                      <td :width="hd.width" v-for="(hd,index) in head" :key="index">
                          <span v-if="hd.type=='text'">{{item[hd.code]}}</span>
                          <div v-else>
                            <a href="javascript:void(0);" class="link" @click.stop="goto(item,hd.code)">{{item[hd.code]}}</a>
                          </div>
                      </td>
                  </tr>
                </tbody>
            </table>
          </div>
        </div>
        
        <div class="bot-btn" style="margin-top: 20px;">
            <el-button @click="closePage">取消</el-button>
        </div>
    </div>
  </div>
</template>

<script>
import wmsExamineItemStatisticsManage from "./wmsExamineItemStatisticsManage.js";
export default wmsExamineItemStatisticsManage;
</script>
<style src="./wmsExamineItemStatisticsManage.scss" lang="scss" scoped></style>
