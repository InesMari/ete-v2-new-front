<template>
    <div id="workInfoManageDetail">
      <select-work v-show="showSelWork"></select-work>
        <div class="search-list clearfix" v-show="!showSelWork">
          <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="workInfoManageDetailSearch"></searchList>
        </div>
        <div class="table-content" v-show="!showSelWork">
            <div class="table-title">
                <h3>
                    <span>卸货点列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="卸货点列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn"  style=" margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="open(true, 1)" v-entity="1005260">新增</el-button>
                    <el-button type="primary" plain size="mini" @click="open(true, 2)" v-entity="1005261">修改</el-button>
                    <el-button type="danger" plain size="mini" @click="deleteWorkDetail" v-entity="1005262">删除</el-button>
                    <el-button type="primary" plain size="mini" @click="gotoLog">查看日志</el-button>
                </div>
            </div>
            <tableCommon tableName="workInfoManageDetailTable" ref="table" :head="head" :showNum="true" :singleSelect="true" :showSetTable="true" @dblclickItem="dblclickItem"></tableCommon>
        </div>

        <!-- 新增 作业点 -->
        <el-dialog :title="title" :visible.sync="showDialog" width="520px" :close-on-click-modal="false" :close-on-press-escape="false" @close="add(false)">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>卸货点名称</label>
                        <div class="input-text">
                            <el-input v-model="workDetail.name" maxlength="100" placeholder="请输入卸货点名称" :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>所属作业点</label>
                        <div class="input-text">
                            <el-select v-model="workDetail.workId" clearable filterable :disabled="isOnlySee" placeholder="请选择所属作业点">
                                <el-option v-for="item in workData" :key="item.workId" :label="item.workName"
                                           :value="item.workId"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">联系人</label>
                        <div class="input-text">
                            <el-input v-model="workDetail.linkman" maxlength="50" placeholder="请输入联系人" :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">联系电话</label>
                        <div class="input-text">
                            <el-input v-model="workDetail.linkPhone" maxlength="50" placeholder="请输入联系电话" :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">备注</label>
                        <div class="input-text">
                            <el-input v-model="workDetail.remark" placeholder="说点什么..." :disabled="isOnlySee"></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="open(false)">关闭</el-button>
                    <el-button type="primary" v-show="!isOnlySee" size="mini" @click="saveOrUpdateWorkDetail()">提交</el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import workInfoManageDetail from './workInfoManageDetail.js'

    export default workInfoManageDetail
</script>
<style lang="scss">

</style>
