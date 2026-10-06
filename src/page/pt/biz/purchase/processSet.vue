<template>
    <div id="purchaseProcessSet" class="processSetPage">
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
                        </li>
                        <li class="item">
                            <div class="title">总部/中心</div>
                            <el-tooltip effect="dark" :content="cfg.orgNameStr" placement="top-start">
                                <div class="content">
                                    <el-select v-model="cfg.orgId" filterable clearable multiple collapse-tags @change="changeOrg(cfg, index)" :disabled="cfg.isDefault">
                                        <el-option v-for="item in orgData" :key="item.id"
                                                   :label="item.orgName"
                                                   :value="item.id">
                                        </el-option>
                                    </el-select>
                                </div>
                            </el-tooltip>
                        </li>
                        <li class="item">
                            <div class="title">采购类型对应流程</div>
                            <el-tooltip effect="dark" :content="cfg.branchBizTypeNameStr" placement="top-start">
                                <div class="content">
                                    <el-select v-model="cfg.branchBizType" placeholder="请选择采购类型" filterable clearable multiple collapse-tags :disabled="cfg.isDefault" @change="changeName(4, index)">
                                        <el-option v-for="item in purchaseTypeData" :key="item.codeValue" :label="item.codeName"
                                                   :value="item.codeValue"></el-option>
                                    </el-select>
                                </div>
                            </el-tooltip>
                        </li>
                        <li class="item">
                            <div class="title">
                                <el-input v-model="cfg.orgVerifyName" disabled/>
                            </div>
                            <div class="content">
                                <el-input v-model="tip" disabled/>
                            </div>
                        </li>
                        <li class="item">
                            <div class="title"><el-input v-model="cfg.nextVerifyName" :disabled="cfg.isDefault"/></div>
                            <div class="content">
                                <el-select v-model="cfg.nextVerifyUserId" filterable clearable :disabled="cfg.isDefault">
                                    <el-option v-for="item in userData" :key="item.userId" :label="item.userName" :value="item.userId">
                                        <span style="float: left">{{ item.userName }}</span>
                                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.billId }}</span>
                                    </el-option>
                                </el-select>
                            </div>
                        </li>
                        <li class="item">
                            <div class="title"><el-input v-model="cfg.gmoaVerifyName" disabled/></div>
                            <div class="content">
                                <el-select v-model="cfg.gmoaVerifyUserId" filterable clearable :disabled="cfg.isDefault">
                                    <el-option v-for="item in userData" :key="item.userId" :label="item.userName" :value="item.userId">
                                        <span style="float: left">{{ item.userName }}</span>
                                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.billId }}</span>
                                    </el-option>
                                </el-select>
                            </div>
                        </li>
                        <li class="item">
                            <div class="title"><el-input v-model="cfg.gmoVerifyName" disabled/></div>
                            <div class="content">
                                <el-select v-model="cfg.gmoVerifyUserId" filterable clearable :disabled="cfg.isDefault">
                                    <el-option v-for="item in userData" :key="item.userId" :label="item.userName" :value="item.userId">
                                        <span style="float: left">{{ item.userName }}</span>
                                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.billId }}</span>
                                    </el-option>
                                </el-select>
                            </div>
                        </li>
                        <li class="item">
                            <div class="title">生成请/付款单权限</div>
                            <el-tooltip effect="dark" :content="cfg.applyGeneratePayStr" placement="top-start">
                                <div class="content">
                                    <el-select v-model="cfg.applyGeneratePay" placeholder="" filterable clearable multiple collapse-tags @change="changeName(3, index)">
                                        <el-option v-for="item in userData" :key="item.userId" :label="item.userName" :value="item.userId">
                                            <span style="float: left">{{ item.userName }}</span>
                                            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.billId }}</span>
                                        </el-option>
                                    </el-select>
                                </div>
                            </el-tooltip>
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
                                    <el-select v-model="cfg.ccBill" placeholder="" filterable multiple collapse-tags @change="changeName(1, index)">
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