<template>
    <div id="scrapInfo" class="scrapInfoPage">
        <div class="common-info">
            <ul class="content clearfix">
                <li class="item item50">
                    <label class="label-term">单趟成本</label>
                    <div class="input-text ">
                        <el-input v-model="info.cost"
                                  @input="changeCost"
                                  :disabled="isVisible"
                                  v-mydoubleval></el-input>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term">管理成本(%)</label>
                    <div class="input-text ">
                        <el-input v-model="info.manageCost"
                                  @input="changeManageCost"
                                  :disabled="isVisible"
                                  v-mydoubleval></el-input>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term">单趟运输成本(含管理成本)</label>
                    <div class="input-text ">
                        <el-input v-model="info.transportationCost" v-mydoubleval disabled></el-input>
                    </div>
                </li>
                <li class="item item100">
                    <label class="label-term">备注</label>
                    <div class="input-text">
                        <el-input v-model="info.remark"
                                  maxlength="50"
                                  :disabled="isVisible"
                                  placeholder="请输入备注"></el-input>
                    </div>
                </li>
            </ul>
            <div class="page-bot-btn ">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" @click="save()" v-show="type != 5 && type != 6">提交</el-button>
            </div>
        </div>
    </div>
</template>
  
<script>
import transportationCostOutInfo from './transportationCostOutInfo.js'
export default transportationCostOutInfo
</script>
<style lang="scss" scoped>
    .input-text2{
        width: calc(100% - 150px) !important;
    }
</style>