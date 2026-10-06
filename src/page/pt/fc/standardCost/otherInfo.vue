<template>
    <div id="scrapInfo" class="scrapInfoPage">
        <div class="common-info">
            <ul class="content clearfix">
                <li class="item item50">
                    <label class="label-term" style="width: 140px;">每公里保养成本(元/公里)</label>
                    <div class="input-text input-text2">
                        <el-input v-model="info.maintenanceAmount" v-mydoubleval></el-input>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term" style="width: 140px;">每公里修理成本(元/公里)</label>
                    <div class="input-text input-text2">
                        <el-input v-model="info.repairAmount" v-mydoubleval></el-input>
                    </div>
                </li>
            </ul>
            <div class="page-bot-btn ">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" @click="save()">提交</el-button>
            </div>
        </div>
    </div>
</template>
  
<script>
import otherInfo from './otherInfo.js'
export default otherInfo
</script>
<style lang="scss" scoped>
    .input-text2{
        width: calc(100% - 150px) !important;
    }
</style>