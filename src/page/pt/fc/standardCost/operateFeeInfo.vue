<template>
    <div id="operateFeeInfo" class="operateFeeInfoPage">
        <div class="common-info">
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">操作费名称</td>
                    <td class="value" colspan="3">
                        <el-input v-model="info.name" :disabled="isVisible" placeholder="请输入"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label"><em>*</em>到货形式</td>
                    <td class="value" colspan="3">
                        <el-select v-model="info.deliveryForm" :disabled="isVisible" filterable clearable placeholder="请选择">
                            <el-option v-for="item in deliveryFormData" :key="item.codeValue" :label="item.codeName" :value="item.codeValue" :disabled="item.disabled"></el-option>
                        </el-select>
                    </td>
                </tr>
                <tr>
                    <td colspan="4">
                        <span class="fl">工序:</span>
                    </td>
                </tr>
                <tr>
                    <td class="label">序号</td>
                    <td class="label">工序名称</td>
                    <td class="label">单价</td>
                    <td class="label" v-show="!isVisible">操作</td>
                </tr>
                <tr v-for="(item, index) in details">
                    <td class="label">{{ index + 1}}</td>
                    <td class="value">
                        <el-select v-model="item.processType" :disabled="isVisible" filterable clearable placeholder="请选择">
                            <el-option v-for="item in processTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="value" >
                        <el-input v-model="item.amount" @input="changeAmount" :disabled="isVisible" v-mydoubleval placeholder="请输入"></el-input>
                    </td>
                    <td v-show="!isVisible">
                        <el-tooltip effect="dark" content="添加" placement="top-start" :hide-after='1000'
                                    v-show="index === 0">
                            <span @click="addItem()" class="add"></span>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000'
                                    v-show="index !== 0 && details.length >= 2">
                            <span @click="removeItem(index)" class="del"></span>
                        </el-tooltip>
                    </td>
                </tr>
                <tr>
                    <td class="label">小计</td>
                    <td class="label"></td>
                    <td class="label">
                        <el-input v-model="info.amount" disabled></el-input>
                    </td>
                    <td class="label" v-show="!isVisible"></td>
                </tr>
            </table>
            <div class="page-bot-btn ">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" @click="save()" v-show="type != 5 && type != 6">提交</el-button>
            </div>
        </div>
    </div>
</template>
  
<script>
import operateFeeInfo from './operateFeeInfo.js'
export default operateFeeInfo
</script>
<style lang="scss" scoped>
.operateFeeInfoPage {
    .add{
        vertical-align: middle;
        @include add;
    }
    .del{
        vertical-align: middle;
        @include del;
    }
}</style>