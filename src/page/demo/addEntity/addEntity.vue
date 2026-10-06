<template>
    <div id="addEntity" class="addPlanPage orderPage">
        <div class="common-info">
            <ul class="content clearfix">
                <li class="item item50">
                    <label class="label-term">数据权限名称：</label>
                    <div class="input-text">
                        <el-input v-model="inputvalue"></el-input>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term">数据权限描述：</label>
                    <div class="input-text">
                        <el-input v-model="inputvalue"></el-input>
                    </div>
                </li>
                <li class="item item100">
                    <label class="label-term">初始权限：</label>
                    <div class="input-text">
                        <el-radio-group v-model="radioValue">
                            <el-radio :label="1">全部的数据</el-radio>
                            <el-radio :label="2">本部及子部</el-radio>
                            <el-radio :label="3">仅本人数据</el-radio>
                        </el-radio-group>
                    </div>
                </li>
            </ul>
            <h3 class="common-title mt_20">
                <span class="title-name">特殊权限</span>
            </h3>
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th width="60" >
                            <el-checkbox v-model="selectAll" @change="selectAllCheck()"></el-checkbox>
                        </th>
                        <th>数据模块</th>
                        <th>数据权限</th>
                        <th width="50">
                            <el-tooltip effect="dark" content="添加" placement="top-start" :hide-after='1000'>
                                <span class="add"></span>
                            </el-tooltip>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <el-checkbox v-model="selectAll" @change="selectAllCheck()"></el-checkbox>
                        </td>
                        <td>
                            <el-select v-model="inputvalue" placeholder="请选择数据模块">
                                <el-option v-for="item in options" :key="item.value" :label="item.label"
                                    :value="item"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-select v-model="inputvalue" placeholder="请选择数据权限">
                                <el-option v-for="item in options" :key="item.value" :label="item.label"
                                    :value="item"></el-option>
                            </el-select>
                        </td>
                        <td>
                            <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000'>
                                <span class="del"></span>
                            </el-tooltip>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="bot-btn">
                <el-button>关闭</el-button>
                <el-button type="primary">保存</el-button>
            </div>
        </div>
        <!-- 修改作业点信息顺序 -->
        <el-dialog class="editDialog" title="修改作业点顺序" :visible.sync="showDialog" width="700px">
            <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                    <tr>
                        <th width="100">作业点名称</th>
                        <th width="200">详细地址</th>
                        <th width="100">作业内容</th>
                        <th width="100">作业顺序</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>东莞凯金</td>
                        <td>广东东莞市寮步镇金富二路</td>
                        <td>提货</td>
                        <td>
                            <el-input v-model="inputvalue" type="text" placeholder="顺序"
                                style="text-align:center;"></el-input>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div class="page-bot-btn">
                <el-button size="mini">关闭</el-button>
                <el-button type="primary" size="mini">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
  
<script>
import addEntity from './addEntity.js'
export default addEntity
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>