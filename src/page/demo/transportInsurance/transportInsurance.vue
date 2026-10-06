<template>
  <div id="transportInsurance">
    <div class="search-list clearfix">
      <div class="search-form clearfix">
        <div class="item">
            <label class="label">电话</label>
          <div class="input-text">
            <el-input v-model="inputvalue" v-mynumval placeholder="请输入" type="text" autocomplete="new-password"></el-input>
          </div>
        </div>
        <div class="item">
            <label class="label">电话</label>
          <div class="input-text">
            <el-select v-model="selectValue" placeholder="请选择" @change="changeSel">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
            </el-select>
          </div>
        </div>
        <div class="item">
            <label class="label">电话</label>
          <div class="input-text">
            <el-time-picker v-model="time" placeholder="选择时间"></el-time-picker>
          </div>
        </div>
        <div class="item">
            <label class="label">电话</label>
          <div class="input-text">
            <el-date-picker v-model="datetime" type="datetime" placeholder="选择日期时间"></el-date-picker>
          </div>
        </div>
        <div class="item daterange">
            <label class="label">电话</label>
          <div class="input-text">
            <el-date-picker v-model="daterange" type="datetimerange" :default-time="['00:00:00','23:59:59']" range-separator="-" start-placeholder="开始时间"
              end-placeholder="结束时间" value-format="yyyy-MM-dd" @change="daterangeChange()"></el-date-picker>
          </div>
        </div>
      </div>
      <div class="search-btn clearfix">
        <div class="btn">
          <el-button type="primary" plain size="mini" icon="el-icon-search">搜索</el-button>
        </div>
        <div class="btn">
          <el-button type="danger" plain size="mini" icon="el-icon-close">清空</el-button>
        </div>
      </div>
    </div>
    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>列表</span>
          <el-tooltip effect="light" content="Right Center 提示文字" placement="right">
            <img class="tip" src="@/static/image/tip.png" alt="">
          </el-tooltip>
        </h3>
        <div class="table-title-btn">
          <el-button type="primary" plain size="mini" @click="add()">新增</el-button>
          <el-button type="primary" plain size="mini" @click="modify()">修改</el-button>
          <el-button type="primary" plain size="mini" @click="modifyRecord()">修改记录</el-button>
        </div>
      </div>
      <tableCommon tableName="listTable" ref="table" :head="head"></tableCommon>
    </div>
    <!-- 修改 -->
    <el-dialog title="修改保价" :visible.sync="showModify" width="540px">
      <div class="common-info" style="border:none;padding:0;">        
        <ul class="content clearfix">
            <li class="item">
                <label class="label-term"><em>*</em>起始地</label>  
                <div class="input-text">
                    <mycity ref="beginCity" class="fl"></mycity>
                </div>
            </li>
            <li class="item">
                <label class="label-term"><em>*</em>目的地</label>
                <div class="input-text">
                    <mycity ref="endCity" class="fl"></mycity>
                </div>
            </li>
            <li class="item">
                <label class="label-term"><em>*</em>计算方式</label>
                <div class="input-text">
                    <el-input v-model="inputvalue"></el-input>
                </div>
            </li>
            <li class="item">
                <label class="label-term"><em>*</em>车型</label>
                <div class="input-text">
                    <el-input v-model="inputvalue"></el-input>
                </div>
            </li>
            <li class="item">
                <label class="label-term"><em>*</em>车长</label>
                <div class="input-text">
                    <el-input v-model="inputvalue"></el-input>
                </div>
            </li>
            <li class="item">
                <label class="label-term"><em>*</em>单趟价格</label>
                <div class="input-text">
                    <el-input v-model="inputvalue"></el-input>
                </div>
            </li>
            <li class="item">
                <label class="label-term"><em>*</em>返程价格</label>
                <div class="input-text">
                    <el-input v-model="inputvalue"></el-input>
                </div>
            </li>
            <li class="item">
                <label class="label-term"><em>*</em>是否默认</label>
                <div class="input-text">
                    <el-radio-group v-model="radio">
                        <el-radio :label="1">是</el-radio>
                        <el-radio :label="0">否</el-radio>
                    </el-radio-group>
                </div>
            </li>
        </ul>
        <div class="page-bot-btn ">
            <el-button size="mini">关闭</el-button>
            <el-button type="primary" size="mini">提交</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 修改记录 -->
    
    <el-dialog title="修改记录" :visible.sync="showModifyRecord" width="700px">
        <scrollTable :head="head" height="300"></scrollTable>
    </el-dialog>
  </div>
</template>

<script>
import transportInsurance from './transportInsurance.js'
export default transportInsurance
</script>
<style lang="scss">

</style>