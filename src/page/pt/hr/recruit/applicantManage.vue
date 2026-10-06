<template>
    <div id="applicantManage">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">职位名称：</label>
                    <div class="input-text">
                      <el-input v-model="query.positionName" placeholder="职位名称"></el-input>
                    </div>
                </div>
              <div class="item">
                <label class="label">姓名：</label>
                <div class="input-text">
                  <el-input v-model="query.userName" placeholder="姓名"></el-input>
                </div>
              </div>
              <div class="item">
                <label class="label">状态：</label>
                <div class="input-text">
                  <el-select v-model="query.sts" placeholder="状态" filterable clearable @change="doQuery">
                    <el-option v-for="item in stsData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery">查询</el-button>
                </div>
                <div class="btn">
                    <el-button type="danger" plain size="mini" icon="el-icon-close" @click="initQuery()">清空</el-button>
                </div>
            </div>
            <!-- 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 -->
            <div class="search-bot">
                <img src="@/static/image/search-bot.png" alt="">
                <i class="icon el-icon-arrow-down"></i>
                <i class="icon el-icon-arrow-up"></i>
            </div>
        </div>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>应聘信息列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="应聘信息列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="danger" plain size="mini" v-entity="1009051" @click="updateHrApplicantInfoState">处理</el-button>
                </div>
            </div>
            <tableCommon tableName="applicantManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem">
            </tableCommon>
        </div>
    </div>
</template>

<script>
import applicantManage from './applicantManage.js'
export default applicantManage
</script>
<style lang="scss">

</style>




