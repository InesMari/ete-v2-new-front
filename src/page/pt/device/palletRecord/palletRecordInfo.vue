<template>
    <div id="palletRecordInfo">
        <div class="common-info flex">
            <ul class="content clearfix">
                <li class="item">
                    <label class="label-term"><em>*</em>基地:</label>
                    <div class="input-text">
                        <el-select v-model="info.workId" placeholder="请选择" filterable clearable
                                   @change="changeWork" :disabled="isDisable">
                            <el-option v-for="item in workData" :key="item.workId" :label="item.workName"
                                       :value="item.workId"></el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term"><em>*</em>月份:</label>
                    <div class="input-text">
                        <el-date-picker
                                v-model="info.month"
                                type="month"
                                placeholder="请选择"
                                value-format="yyyy-MM"
                                @change="changeMonth"
                                :disabled="isDisable">
                        </el-date-picker>
                    </div>
                </li>
                <li class="item item50">
                    <label class="label-term">调拨基地:</label>
                    <div class="input-text">
                        <el-select v-model="info.allocatWorkIds" placeholder="请选择" filterable clearable multiple="true"
                                   :disabled="isDisable">
                            <el-option v-for="item in workData" :key="item.workId" :label="item.workName"
                                       :value="item.workId"></el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">本月新增:</label>
                    <div class="input-text">
                        <el-input v-model="info.purchaseNums" @input="calcMonthNums" v-mydoubleval :disabled="isDisable"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">本月报废:</label>
                    <div class="input-text">
                        <el-input v-model="info.scrapNums" @input="calcMonthNums" v-mydoubleval :disabled="isDisable"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">本月调拨:</label>
                    <div class="input-text">
                        <el-input v-model="info.allocatNums" @input="calcMonthNums" v-mydoubleval :disabled="isDisable"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">回收数量:</label>
                    <div class="input-text">
                        <el-input v-model="info.recoverNums" @input="calcRecoverRate" v-mydoubleval :disabled="isDisable"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">出库数量:</label>
                    <div class="input-text">
                        <el-input v-model="info.outNums" @input="calcRecoverRate" v-mydoubleval :disabled="isDisable"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">回收率(%):</label>
                    <div class="input-text">
                        <el-input v-model="info.recoverRate" v-mydoubleval disabled></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">实际盘点:</label>
                    <div class="input-text">
                        <el-input v-model="info.actualInventoryNums" @input="calcDiffNums" v-mydoubleval :disabled="isDisable"></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">上月结存:</label>
                    <div class="input-text">
                        <el-input v-model="info.lastMonthNums" v-mydoubleval disabled></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">本月结存:</label>
                    <div class="input-text">
                        <el-input v-model="info.monthNums" v-mydoubleval disabled></el-input>
                    </div>
                </li>
                <li class="item">
                    <label class="label-term">差异数:</label>
                    <div class="input-text">
                        <el-input v-model="info.diffNums" v-mydoubleval disabled></el-input>
                    </div>
                </li>
                <li class="item" v-show="type == enumData.OPEN_PAGE_TYPE.DETAIL">
                    <label class="label-term">创建人:</label>
                    <div class="input-text">
                        <el-input v-model="info.createUserName" disabled></el-input>
                    </div>
                </li>
                <li class="item" v-show="type == enumData.OPEN_PAGE_TYPE.DETAIL">
                    <label class="label-term">创建时间:</label>
                    <div class="input-text">
                        <el-input v-model="info.createDate" disabled></el-input>
                    </div>
                </li>
            </ul>
        </div>

        <div class="page-bot-btn ">
            <el-button @click="closePage()">关闭</el-button>
            <el-button type="primary" @click="saveInfo()">提交</el-button>
        </div>

    </div>
</template>

<script>
import palletRecordInfo from './palletRecordInfo.js'
import enumData from "@/page/pt/enum";

export default palletRecordInfo
</script>

<style scoped>

</style>
