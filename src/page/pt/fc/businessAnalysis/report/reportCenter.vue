<template>
  <div id="reportCenter" class="reportCenterPage">
      <div class="reportList clearfix">

        <el-popover
            placement="bottom"
            width="400" v-for="item in info" class="item" v-entity="item.entityId"
            v-model="item.visible" @hide="clear">
            <div class="common-info" style="border:none;padding:0;">
              <ul class="content clearfix">
                  <li class="item item100" v-show="item.entityId==1007122 || item.entityId==1007126 || item.entityId==1007127">
                      <label class="label-term" style="width: 65px;">基地:</label>
                      <div class="input-text">
                          <el-select v-model="param.orgId" placeholder="请选择基地" filterable clearable>
                              <el-option v-for="item in orgData" :key="item.id" :label="item.orgName"
                                         :value="item.id"></el-option>
                          </el-select>
                      </div>
                  </li>
                  <li class="item item100" v-show="item.entityId==1007126 || item.entityId==1007127">
                      <label class="label-term" style="width: 65px;">数据来源:</label>
                      <div class="input-text">
                          <el-select v-model="param.type" placeholder="请选择数据来源" filterable clearable>
                              <el-option v-for="item in typeData" :key="item.value" :label="item.name"
                                         :value="item.value"></el-option>
                          </el-select>
                      </div>
                  </li>
                  <li class="item item100" v-if="item.entityId==1007121 || item.entityId==1007122 || item.entityId==1007123 || item.entityId==1007124 || item.entityId==1007125 || item.entityId==1007127">
                      <label class="label-term" style="width: 65px;">月份范围:</label>
                      <div class="input-text">
                          <el-date-picker v-model="param.monthRange" type="monthrange" placeholder="月份范围"
                                          value-format="yyyy-MM"></el-date-picker>
                      </div>
                  </li>

                <li class="item item100" v-if="item.entityId==1007126">
                  <label class="label-term" style="width: 65px;">对比月份:</label>
                  <div class="input-text">
                    <el-date-picker v-model="param.beginMonth" type="month" placeholder="对比月份"
                                    value-format="yyyy-MM"></el-date-picker>
                  </div>
                </li>
                <li class="item item100" v-if="item.entityId==1007126">
                  <label class="label-term" style="width: 65px;">基础月份:</label>
                  <div class="input-text">
                    <el-date-picker v-model="param.endMonth" type="month" placeholder="基础月份"
                                    value-format="yyyy-MM"></el-date-picker>
                  </div>
                </li>

              </ul>
            </div>
            <div class="page-bot-btn ">
              <el-button size="mini" @click="item.visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="go(item)">确定</el-button>
            </div>
            <div  slot="reference">
              <div class="time"></div>
              <div class="con">
                <div class="name">{{item.name}}</div>
                <div class="introduce">{{item.introduce}}</div>
              </div>
            </div>
        </el-popover>
      </div>
  </div>
</template>

<script>
  import reportCenter from "./reportCenter.js"
  export default reportCenter
</script>
<style lang="scss" src="./reportCenter.scss"></style>
