<template>
    <div id="regionOrgManage" class="regionOrgManagePage">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">区域名称：</label>
                    <div class="input-text">
                        <el-input v-model="loadParam.regionName" placeholder="区域名称" type="text"
                                  autocomplete="new-password"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">负责人：</label>
                    <div class="input-text">
                        <el-input v-model="loadParam.linkmanName" placeholder="负责人/联系方式" type="text"
                                  autocomplete="new-password"></el-input>
                    </div>
                </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">搜索
                    </el-button>
                </div>
                <div class="btn">
                    <el-button type="danger" plain size="mini" icon="el-icon-close" @click="clear()">清空</el-button>
                </div>
            </div>
            <!-- 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 -->
            <div class="search-bot">
                <img src="@/static/image/search-bot.png" alt="">
                <i class="icon el-icon-arrow-down"></i>
                <i class="icon el-icon-arrow-up"></i>
            </div>
        </div>
        <div class="table-content " ref="tableContent">
            <div class="table-inner fl">
                <div class="table-title">
                    <h3>
                        <span>区域列表</span>
                        <el-tooltip effect="light" content="区域列表" placement="right">
                            <img class="tip" src="@/static/image/tip.png" alt="">
                        </el-tooltip>
                    </h3>
                    <div class="table-title-btn">
                        <el-button type="primary" plain size="mini" @click="add(true)" v-entity :entityId="[{1008002:1008006}]">新增</el-button>
                        <el-button type="primary" plain size="mini" @click="modify()" v-entity :entityId="[{1008002:1008007}]">修改</el-button>
                        <el-button type="primary" plain size="mini" @click="del(1)" v-entity :entityId="[{1008002:1008008}]">启用</el-button>
                        <el-button type="primary" plain size="mini" @click="del(2)" v-entity :entityId="[{1008002:1008009}]">禁用</el-button>
                    </div>
                </div>
                <tableCommon tableName="regionOrgManageTable" ref="table" :head="head" :showNum="true"
                             :showSetTable="false"
                             @clickItem="clickItem" :singleSelect="true">
                    <template v-slot:diyColorTd="{item}">
                        <span :style="item.sts==0?'color:red!important':''">{{ item.stsName }}</span>
                    </template>
                </tableCommon>
            </div>
            <div class="treeList fr" ref="treeList">
                <tree class="innerTree" ref="tree" :treedata="treeData" label="label" haveTotal="true" total="staffCount"
                      canEditKey="type" v-slot="{item}"
                      @dblclickItem="dblclickItem">
                    <div>
                        <span class="btn" @click.stop="bidCustomer(item)" v-show="item.type==2" v-entity="1008060">绑定客户</span>
                        <span class="btn" @click.stop="bidRelSubsidiary(item)" v-show="item.type==2" v-entity="1008061">绑定公司</span>
                        <span class="btn" @click.stop="addOrg(item)" v-show="item.type==1 || item.type==2" v-entity="1008062">新增部门</span>
                        <span class="btn" @click.stop="addStaff(item)" v-show="item.type==2" v-entity="1008063">新增人员</span>
                        <span class="btn" @click.stop="remove(item)" v-show="item.type==2 || item.type==3" v-entity="1008064">删除</span>
                    </div>
                </tree>
            </div>
        </div>

        <!-- 新增 修改 区域 -->
        <el-dialog title="新增区域" :visible.sync="showModify" width="340px" :close-on-click-modal="false"
                   :close-on-press-escape="false">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item">
                        <label class="label-term"><em>*</em>区域名称</label>
                        <div class="input-text">
                            <el-input v-model="regionInfo.regionName" maxlength="100"
                                      :disabled="regionInfo.id==1"></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term"><em>*</em>详细地址</label>
                        <div class="input-text">
                            <el-input v-model="regionInfo.address" maxlength="200"></el-input>
                        </div>
                    </li>
                    <li class="item">
                        <label class="label-term"><em>*</em>负责人</label>
                        <div class="input-text">
                            <el-select v-model="regionInfo.staffId" placeholder="请选择" filterable>
                                <el-option v-for="item in staffData" :key="item.id" :label="item.staffName"
                                           :value="item.id" :disabled="item.disabled"></el-option>
                            </el-select>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="add(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="addRegion()">提交</el-button>
                </div>
            </div>
        </el-dialog>

        <!-- 新增 部门 -->
        <el-dialog :title="orgTitle" :visible.sync="showAddOrg" width="600px" :close-on-click-modal="false"
                   :close-on-press-escape="false">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>所属区域</label>
                        <div class="input-text">
                            <el-select v-model="orgInfo.regionId" placeholder="请选择" filterable
                                       @change="changeRegion(orgInfo)">
                                <el-option v-for="item in regionData" :key="item.id" :label="item.regionName"
                                           :value="item.id" :disabled="item.disabled"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term">上级部门</label>
                        <div class="input-text">
                            <el-select v-model="orgInfo.parentOrgId" placeholder="请选择" filterable clearable>
                                <el-option v-for="item in orgData" :key="item.id" :label="item.orgName"
                                           :value="item.id" :disabled="item.disabled"></el-option>
                            </el-select>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>部门名称</label>
                        <div class="input-text">
                            <el-input v-model="orgInfo.orgName" maxlength="100"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>是否项目组</label>
                        <div class="input-text">
                            <div class="input-text">
                                <el-switch v-model="orgInfo.projectTeam == 1"
                                           @change="changeSwitch()"
                                           active-color="#13ce66"
                                           inactive-color="#ff4949"
                                           active-text="是"
                                           inactive-text="否"
                                />
                            </div>
                        </div>
                    </li>

                    <li class="item item100">
                        <label class="label-term" style="width: 98px;">企微推送消息URL</label>
                        <div class="input-text" style="width: calc(100% - 108px);">
                            <el-input v-model="orgInfo.weComPushUrl" maxlength="200"></el-input>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button @click="addOrg()">关闭</el-button>
                    <el-button type="primary" @click="saveOrg()">提交</el-button>
                </div>
            </div>
        </el-dialog>

        <!-- 新增 人员 -->
        <el-dialog title="新增人员" :visible.sync="showAddStaff" width="400px" :close-on-click-modal="false"
                   :close-on-press-escape="false">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>所属部门</label>
                        <div class="input-text">
                            <el-input v-model="staffInfo.orgName" maxlength="100" :disabled="true"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>人员名称</label>
                        <div class="input-text">    
                            <el-select v-model="staffInfo.staffIds" placeholder="请选择" filterable multiple>
                                <el-option v-for="item in staffData" :key="item.id" :label="item.staffName"
                                           :value="item.id" :disabled="item.disabled"></el-option>
                            </el-select>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="addStaff()">关闭</el-button>
                    <el-button type="primary" size="mini" @click="saveStaff()">提交</el-button>
                </div>
            </div>
        </el-dialog>

        <!-- 绑定公司 -->
        <el-dialog title="绑定公司" :visible.sync="showBidRelSubsidiary" width="440px" :close-on-click-modal="false"
                   :close-on-press-escape="false">
            <div class="common-info" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term"><em>*</em>所属部门</label>
                        <div class="input-text">
                            <el-input v-model="itemInfo.orgName" maxlength="100" :disabled="true"></el-input>
                        </div>
                    </li>
                    <li class="item item100">
                        <label class="label-term"><em>*</em>绑定公司</label>
                        <div class="input-text">
                            <el-select v-model="itemInfo.relSubsidiary" placeholder="请选择" filterable
                                       @change="$forceUpdate();">
                                <el-option v-for="item in relSubsidiaryData" :key="item.codeValue"
                                           :label="item.codeName"
                                           :value="item.codeValue"></el-option>
                            </el-select>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="bidRelSubsidiary()">关闭</el-button>
                    <el-button type="primary" size="mini" @click="saveRelSubsidiary()">提交</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import regionOrgManage from './regionOrgManage.js'

export default regionOrgManage
</script>
<style lang="scss">
.regionOrgManagePage {
    .table-content {
        border: none;
        background: none;
    }

    .table-inner {
        width: calc(100% - 470px);
        height: 100%;
        border: 1px solid #e8e8e8;
        background: #fff;
    }

    .treeList {
        border: $border;
        width: 450px;
        background: #fff;
        padding: 20px 0;
        box-sizing: border-box;
        overflow: auto;

        .innerTree {
            padding: 0 20px;
            overflow: hidden;
        }
    }
}
</style>
