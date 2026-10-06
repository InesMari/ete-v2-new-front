<template>
    <div id="changeRegionOrg" class="changeRegionOrgPage">
        <div class="common-info flex">
            <ul class="content clearfix" v-if="!onlyBind">
                <li class="item item50">
                    <label class="label-term" style="width:100px;"><em>*</em>部门名称</label>
                    <div class="input-text">
                        <el-input v-model="orgInfo.orgName" maxlength="100"></el-input>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term"><em>*</em>是否项目组</label>
                    <div class="input-text">
                        <div class="input-text">
                            <el-switch v-model="orgInfo.projectTeam == 1" @change="changeSwitch()" active-color="#13ce66"
                                inactive-color="#ff4949" active-text="是" inactive-text="否" />
                        </div>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term" style="width:100px;"><em>*</em>所属区域</label>
                    <div class="input-text">
                        <el-select v-model="orgInfo.regionId" placeholder="请选择" filterable @change="changeRegion(orgInfo)">
                            <el-option v-for="item in regionData" :key="item.id" :label="item.regionName" :value="item.id"
                                :disabled="item.disabled"></el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term">上级部门</label>
                    <div class="input-text">
                        <el-select v-model="orgInfo.parentOrgId" placeholder="请选择" filterable clearable>
                            <el-option v-for="item in orgData" :key="item.id" :label="item.orgName" :value="item.id"
                                :disabled="item.disabled"></el-option>
                        </el-select>
                    </div>
                </li>

                <li class="item item98">
                    <label class="label-term" style="width:100px;">企微推送消息URL</label>
                    <div class="input-text" style="width: calc(100% - 108px);">
                        <el-input v-model="orgInfo.weComPushUrl" maxlength="200"></el-input>
                    </div>
                </li>
            </ul>
            <div v-else class="orgNameTitle">项目组名称：{{ orgInfo.orgName }}</div>
            <div class="customer-table-title">
                <h3 class="common-title">
                    <span class="title-name">未关联客户</span>
                    <el-input prefix-icon="el-icon-search" placeholder="请输入关键字进行过滤" v-model="unassociated" @input="queryCustomer(2)" size="small"></el-input>
                </h3>
                <h3 class="common-title">
                    <span class="title-name">已关联客户</span>
                    <el-input prefix-icon="el-icon-search" placeholder="请输入关键字进行过滤" v-model="associated" @input="queryCustomer(1)" size="small"></el-input>
                </h3>
            </div>
            <dbTable tableName="changeRegionOrgDbTable" ref="table" :head="head" onlyId="custId" @scrollBack="scrollBack" @dataChange="dataChange"></dbTable>
            <div class="page-bot-btn">
                <el-button @click="close">关闭</el-button>
                <el-button type="primary" @click="submit">提交</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import changeRegionOrg from "./changeRegionOrg.js"

export default changeRegionOrg
</script>
<style lang="scss" scoped>
.changeRegionOrgPage{
    /deep/ .common-info{
        height:100%;
        box-sizing:border-box;
        display:flex;
        flex-direction: column;
        .dbTable{
            flex:1;
            overflow:hidden;
        }
        .customer-table-title{
            display: flex;
            .common-title{
                flex: 1;
                &:first-child{
                    margin-right: 2%;
                }
                .el-input{
                    width: 200px;
                    float: right;
                }
            }
        }
        .orgNameTitle{
            font-size: 16px;
            margin-bottom: 20px;
            font-weight: bold;
            color: #333;
        }
    }
}
</style>
