<template>
    <div id="questionManage">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">分类目录：</label>
                    <div class="input-text">
                        <el-select v-model="query.type" placeholder="分类目录" filterable clearable @change="doQuery">
                            <el-option v-for="item in typeData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </div>
              <div class="item">
                <label class="label">是否热门：</label>
                <div class="input-text">
                  <el-select v-model="query.isPopular" placeholder="是否热门" filterable clearable @change="doQuery">
                    <el-option v-for="item in whetherData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue"></el-option>
                  </el-select>
                </div>
              </div>
              <div class="item">
                <label class="label">相关内容：</label>
                <div class="input-text">
                  <el-input type="text" v-model="query.content" placeholder="相关内容" @blur="doQuery"></el-input>
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
                    <span>问题列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="问题列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1008026" @click="addQa()">新增问题</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1008027" @click="updateQa">修改问题</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1008028" @click="deleteQa">删除问题</el-button>
                </div>
            </div>
            <tableCommon tableName="questionManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem"></tableCommon>
        </div>
    </div>
</template>

<script>
import questionManage from './questionManage.js'
export default questionManage
</script>
<style lang="scss">

</style>




