<template>
    <div id="cmBusinessCooperationManage">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">公司名称：</label>
                    <div class="input-text">
                        <el-input v-model="loadParam.companyName" placeholder="公司名称" type="text" autocomplete="new-password"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">登记姓名：</label>
                    <div class="input-text">
                        <el-input v-model="loadParam.userName" placeholder="登记姓名" type="text" autocomplete="new-password"></el-input>
                    </div>
                </div>
              <div class="item">
                <label class="label">状态：</label>
                <div class="input-text">
                  <el-select v-model="loadParam.sts" placeholder="请选择状态" clearable filterable>
                    <el-option v-for="item in stsData" :key="item.codeValue"
                               :label="item.codeName" :value="item.codeValue"></el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询</el-button>
                </div>
                <div class="btn"><el-button type="danger" plain size="mini" icon="el-icon-close" @click="clear()">清空</el-button>
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
                    <span>商务合作意向列表</span>
                    <el-tooltip effect="light" content="商务合作意向列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain size="mini" @click="toShowCmBusinessCooperationInfo()" v-entity="1001090">回访登记</el-button>
                </div>
            </div>
            <tableCommon tableName="cmBusinessCooperationManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :singleSelect="true" @dblclickItem="dblclickItem">
            </tableCommon>
        </div>

        <el-dialog :title="title" :visible.sync="showFlag" width="520px" :close-on-click-modal="false"
                   :close-on-press-escape="false" >
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term">公司名称</label>
                        <div class="input-text">{{info.companyName}}</div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">登记姓名</label>
                        <div class="input-text">{{info.userName}}</div>
                    </li>
                    <li class="item item100">
                      <label class="label-term">登记手机号</label>
                      <div class="input-text">{{info.billId}}</div>
                    </li>
                  <li class="item item100">
                    <label class="label-term">登记邮箱</label>
                    <div class="input-text">{{info.email}}</div>
                  </li>
                  <li class="item item100">
                    <label class="label-term">登记需求</label>
                    <div class="input-text">{{info.demandDesc}}</div>
                  </li>
                  <li class="item item100">
                    <label class="label-term">登记时间</label>
                    <div class="input-text">{{info.createDate}}</div>
                  </li>
                  <li class="item item100">
                    <label class="label-term"><em>*</em>回访描述</label>
                    <div class="input-text">
                      <el-input type="textarea" v-model="info.visitDesc" placeholder="回访描述"
                                :disabled="isLock"></el-input>
                    </div>
                  </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="showFlag=false">取消</el-button>
                    <el-button type="primary" size="mini" @click="dealCmBusinessCooperationInfo()" v-show="!isLock">确定</el-button>
                </div>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import cmBusinessCooperationManage from './cmBusinessCooperationManage.js'

export default cmBusinessCooperationManage
</script>
<style lang="scss">
#storageInfoManage{
  .label-term{
    width: 120px;
  }
  .input-text{
    width: calc(100% - 130px);
  }
}

</style>

