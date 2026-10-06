<template>
    <div id="claimprocessSet" class="processSetPage">
        <div class="mainFlex">
            <div class="main">
                <div class="theme">
                    <div class="title">申请人</div>
                    <div class="name">{{ userName }}</div>
                    <el-button class="add" size="mini" icon="el-icon-circle-plus-outline" @click="addCfg">添加分支</el-button>
                </div>
                <div class="clearfix">
                    <ul v-for="(cfg, index) in list">
                        <li class="item">
                            <div class="title specTitle">
                                <el-input v-model="cfg.branchName" placeholder="请输入流程名称" :disabled="cfg.isDefault"/>
                                <el-icon class="el-icon-error" @click.native="removeCfg(cfg, index)"></el-icon>
                            </div>
                            <div class="content">
                                <h3>物品申请类型对应流程：</h3>
                                <el-select v-model="cfg.branchBizType" placeholder="请选择物品申请类型对应流程" filterable clearable :disabled="cfg.isDefault">
                                    <el-option v-for="item in applyItemTypeData" :key="item.codeValue" :label="item.codeName"
                                            :value="item.codeValue"></el-option>
                                </el-select>
                            </div>
                        </li>
                        <li class="item">
                            <div class="title">{{cfg.orgVerifyName}}</div>
                            <div class="content">
                                <el-input v-model="tip" placeholder="" disabled/>
                            </div>
                        </li>
                        <li class="item">
                            <div class="title">{{cfg.nextVerifyName}}</div>
                            <div class="content">
                                <el-select v-model="cfg.nextVerifyUserId" placeholder="" filterable clearable >
                                    <el-option v-for="item in userData" :key="item.userId" :label="item.userName" :value="item.userId">
                                        <span style="float: left">{{ item.userName }}</span>
                                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.billId }}</span>
                                    </el-option>
                                </el-select>
                            </div>
                        </li>
                        <li class="item">
                            <div class="title">{{cfg.gmoVerifyName}}</div>
                            <div class="content">
                                <el-select v-model="cfg.gmoVerifyUserId" placeholder="" filterable clearable >
                                    <el-option v-for="item in userData" :key="item.userId" :label="item.userName" :value="item.userId">
                                        <span style="float: left">{{ item.userName }}</span>
                                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.billId }}</span>
                                    </el-option>
                                </el-select>
                            </div>
                        </li>
                        <li class="item">
                            <div class="title">额外授权查看人(平台)</div>
                            <el-tooltip effect="dark" :content="cfg.authSeeUserIdStr" placement="top-start">
                                <div class="content">
                                    <el-select v-model="cfg.authSeeUserId" placeholder="" filterable clearable multiple collapse-tags @change="changeName(2, index)">
                                        <el-option v-for="item in userData" :key="item.userId" :label="item.userName" :value="item.userId">
                                            <span style="float: left">{{ item.userName }}</span>
                                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.billId }}</span>
                                        </el-option>
                                    </el-select>
                                </div>
                            </el-tooltip>
                        </li>
                        <li class="item">
                            <div class="title">抄送人(推送企业微信&微信)</div>
                            <el-tooltip effect="dark" :content="cfg.ccBillStr" placement="top-start">
                                <div class="content">
                                    <el-select v-model="cfg.ccBill" placeholder="" filterable clearable multiple collapse-tags @change="changeName(1, index)">
                                        <el-option v-for="item in qywxUserData" :key="item.qywxBillId" :label="item.userName"
                                                :value="item.qywxBillId">
                                            <span style="float: left">{{ item.userName }}</span>
                                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.qywxBillId }}</span>
                                        </el-option>
                                    </el-select>
                                </div>
                            </el-tooltip>
                        </li>
                    </ul>
                </div>
                <div class="bot">流程结束</div>
            </div>
        </div>

        <div class="bot-btn">
            <el-button @click="closePage">关闭</el-button>
            <el-button type="primary" @click="saveOrUpdate">提交</el-button>
        </div>

    </div>
</template>

<script>
import processSet from './processSet.js'
export default processSet
</script>
<style lang="scss" src="../commonProcessSet.scss"></style>