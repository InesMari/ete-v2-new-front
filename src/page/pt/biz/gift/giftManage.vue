<template>
    <div id="giftManage">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">礼品方案编码</label>
                    <div class="input-text">
                        <el-input v-model="query.schemeNum" placeholder="礼品方案编码" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">礼品方案名称</label>
                    <div class="input-text">
                            <el-input v-model="query.schemeName" placeholder="礼品方案名称" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">备注</label>
                    <div class="input-text">
                        <el-input v-model="query.remark" placeholder="备注" type="text"></el-input>
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
                    <span>礼品方案列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="礼品方案列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" v-entity="1015003" @click="addGift">新增</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1015004" @click="updateGift">修改</el-button>
                    <el-button type="danger" plain size="mini" v-entity="1015005" @click="deleteGift">删除</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1015006" @click="copyGift">复制</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1015007" @click="shareGift">分享</el-button>
                    <el-button type="primary" plain size="mini" v-entity="1015008" @click="recordGiftDetail">登记详情</el-button>
                </div>
            </div>
            <tableCommon tableName="giftManageTable" ref="table" :showNum="true" :singleSelect="true"
                         :showSetTable="true" :head="head" @dblclickItem="dblclickItem">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" v-if="code=='imgUrl'" class="link" @click.stop="showBigImg(item)"
                       style="margin: 0 10px;">查看方案图片</a>
                </template>
            </tableCommon>
        </div>

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

    </div>
</template>

<script>
import giftManage from './giftManage.js'
export default giftManage
</script>
<style lang="scss">

</style>




