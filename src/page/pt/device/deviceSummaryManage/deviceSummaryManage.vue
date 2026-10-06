<template>
    <div id="deviceSummaryManage">
        <div class="search-list clearfix">
            <div class="search-form clearfix">
                <div class="item">
                    <label class="label">器具名称：</label>
                    <div class="input-text">
                        <el-input v-model="query.deviceName" placeholder="器具名称" type="text"></el-input>
                    </div>
                </div>
                <div class="search-btn clearfix">
                    <div class="btn">
                        <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询
                        </el-button>
                    </div>
                    <div class="btn">
                        <el-button type="danger" plain size="mini" icon="el-icon-close" @click="clear()">清空
                        </el-button>
                    </div>
                </div>
                <!-- 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 -->
                <div class="search-bot">
                    <img src="@/static/image/search-bot.png" alt="">
                    <i class="icon el-icon-arrow-down"></i>
                    <i class="icon el-icon-arrow-up"></i>
                </div>
            </div>
        </div>


        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>器具汇总</span>
                    <el-tooltip effect="light" content="器具汇总列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="toShowPkgBizDetail()" v-entity="1012016">
                        库存明细
                    </el-button>
                    <el-button type="primary" plain size="mini" @click="toPackMonitor()" v-entity="1012017">
                        查看库存位置
                    </el-button>
                  <el-button type="primary" plain size="mini" @click="toDeviceStoreDetailHis()" v-entity="1012032">
                    历史库存明细
                  </el-button>
                  <el-button type="primary" plain size="mini" @click="download()" >
                    导出
                  </el-button>
                </div>
            </div>
            <tableCommon tableName="deviceSummaryManageTable" ref="table" :showNum="true" :showSetTable="true"
                         :head="head" :singleSelect="true">
                <template v-slot:default="{item}">
                    <a href="javascript:void(0);" v-show="item.packImgId" class="link" @click.stop="showPkgImg(item)"
                       style="margin: 0 10px;">查看</a>
                </template>
            </tableCommon>
        </div>

    </div>
</template>

<script>
import deviceSummaryManage from './deviceSummaryManage.js'

export default deviceSummaryManage
</script>


<style scoped>
</style>
  