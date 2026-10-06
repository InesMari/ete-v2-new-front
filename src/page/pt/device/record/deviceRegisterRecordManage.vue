<template>
    <div id="deviceRegisterRecordManage">
        <!-- 列表相关  开始 -->
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">登记单号：</label>
                    <div class="input-text">
                        <el-input v-model="query.recordNum" placeholder="登记单号" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">器具名称：</label>
                    <div class="input-text">
                        <el-input v-model="query.deviceName" placeholder="器具名称" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">所属人：</label>
                    <div class="input-text">
                        <el-input v-model="query.srcTenantName" placeholder="所属人" type="text"></el-input>
                    </div>
                </div>
                <div class="item daterange">
                    <label class="label">登记类型：</label>
                    <div class="input-text">
                        <el-select v-model="query.dealType" filterable clearable placeholder="登记类型"
                                   @change="doQuery">
                            <el-option v-for="item in dealTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item daterange">
                    <label class="label">登记时间：</label>
                    <div class="input-text">
                        <el-date-picker v-model="query.createDate" type="daterange" range-separator="至" start-placeholder="开始日期"
                                        end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"
                                        unlink-panels></el-date-picker>
                    </div>
                </div>
              <div class="item">
                <label class="label">来源地：</label>
                <div class="input-text">
                  <el-input v-model="query.srcWorkName" placeholder="来源地" type="text"></el-input>
                </div>
              </div>
              <div class="item">
                <label class="label">交付地：</label>
                <div class="input-text">
                  <el-input v-model="query.destWorkName" placeholder="交付地" type="text"></el-input>
                </div>
              </div>

                <div class="item daterange">
                    <label class="label">仓库名称：</label>
                    <div class="input-text">
                        <el-select v-model="query.workId" filterable clearable placeholder="仓库名称"
                                   @change="doQuery">
                            <el-option v-for="item in workData" :key="item.workId" :label="item.workName"
                                       :value="item.workId"></el-option>
                        </el-select>
                    </div>
                </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询</el-button>
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
                    <span>器具记录列表</span>
                    <el-tooltip effect="light" content="器具记录列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
				<div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1005162" @click="download">导出</el-button>
				</div>
            </div>
            <tableCommon tableName="deviceRegisterRecordManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :singleSelect="true">
                <template v-slot:default="{item, code}">
                  <div v-if="code=='orderNum'">
                    <a href="javascript:void(0);" class="link" @click.stop="openDetail(item, code)" style="margin: 0 10px;">{{item[code]}}</a>
                  </div>
                  <div v-if="code=='file'">
                    <a class="link" :class="!item.fileUrl?'disabled':'link'" href="javascript:;" @click="showImg(item)">查看</a>
                  </div>
                </template>
            </tableCommon>
        </div>
        <!-- 列表相关  结束 -->
      <!-- 查看大图 -->
      <fileViewer ref="viewer" :url-list="srcList" zIndex="10000"></fileViewer>
    </div>
</template>

<script>
import deviceRegisterRecordManage from './deviceRegisterRecordManage.js'
export default deviceRegisterRecordManage
</script>
<style lang="scss">
</style>
