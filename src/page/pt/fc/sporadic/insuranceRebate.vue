<template>
    <div id="insuranceRebate" class="insuranceRebatePage">
        <div class="common-info">
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">结算主体</td>
                    <td class="value">
                        <el-select v-model="info.settleBody" :disabled="isVisible" filterable clearable placeholder="请选择">
                            <el-option v-for="item in settleBodyData" :key="item.codeValue" :label="item.codeName"
                                :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">车牌号码</td>
                    <td class="value">
                        <el-input v-model="info.plateNumber" :disabled="isVisible" maxlength="10" show-word-limit placeholder="请输入"></el-input>
                    </td>
                    <td class="label">险种</td>
                    <td class="value">
                        <el-input v-model="info.insuranceProduct" :disabled="isVisible" maxlength="50" show-word-limit placeholder="请输入"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">保额</td>
                    <td class="value">
                        <el-input v-model="info.sumInsured" :disabled="isVisible" v-mydoubleval placeholder="请输入"></el-input>
                    </td>
                    <td class="label">返点金额</td>
                    <td class="value">
                        <el-input v-model="info.rebateAmount" :disabled="isVisible" v-mydoubleval placeholder="请输入"></el-input>
                    </td>
                    <td class="label">入账金额</td>
                    <td class="value">
                        <el-input v-model="info.postedAmount" :disabled="isVisible" v-mydoubleval placeholder="请输入"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">保险公司</td>
                    <td class="value">
                        <el-input v-model="info.insuranceCompany" :disabled="isVisible" maxlength="100" show-word-limit placeholder="请输入"></el-input>
                    </td>
                    <td class="label">保险起止日期</td>
                    <td class="value" colspan="3">
                        <el-date-picker :disabled="isVisible" v-model="info.insuranceDate" type="daterange"
                            value-format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                    </td>
                </tr>
                <tr>
                    <td class="label">入账日期</td>
                    <td class="value">
                        <el-date-picker :disabled="isVisible" v-model="info.postedDate" type="date"
                                        value-format="yyyy-MM-dd" placeholder="开始日期">
                        </el-date-picker>
                    </td>
                    <td class="label">备注</td>
                    <td class="value" colspan="3">
                        <el-input v-model="info.remark" :disabled="isVisible" maxlength="500" show-word-limit placeholder="请输入"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">附件</td>
                    <td class="value" colspan="5" style="padding: 10px;">
                        <div class="fl mr_20 ml_10"  v-for="(item, index) in fileList">
                            <myFileModel :ref="'file' + index"
                                         @successCallback="successCallback"
                                         @delCallback="deleteCallback"
                                         :componentId="index"
                                         :disabledEdit="isVisible"
                                         :disabledDel="isVisible">
                            </myFileModel>
                        </div>
                    </td>
                </tr>
            </table>
            <div class="tfootInfo" v-show="isVisible">
                <div class="item">创建人：{{info.createUserName}}</div>
                <div class="item">创建时间：{{info.createDate}}</div>
                <div class="item">确认人：{{info.confirmUserName}}</div>
                <div class="item">确认时间：{{info.confirmDate}}</div>
            </div>
          <div class="tfootInfo" v-show="type == 6">
            <div class="item item25">收款日期：
              <el-date-picker v-model="info.receiveFeeDate" type="date" placeholder="收款日期"  format="yyyy-MM-dd" value-format="yyyy-MM-dd" @blur="$forceUpdate();"></el-date-picker>
            </div>
            <div class="item item75">收款备注：
              <el-input v-model="info.confirmRemark" type="text" maxlength="200" placeholder="请输入确认备注信息" @input="$forceUpdate();" ></el-input>
            </div>
          </div>
            <div class="page-bot-btn ">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" @click="save()" v-show="type != 5 && type != 6">提交</el-button>
                <el-button type="primary" @click="confirm()" v-show="type == 6">确认</el-button>
            </div>
        </div>
    </div>
</template>
  
<script>
import insuranceRebate from './insuranceRebate.js'
export default insuranceRebate
</script>
<style lang="scss" scoped>
.insuranceRebatePage {
    .tableTitle {
        font-weight: bold;
        color: #000;
        margin-bottom: 25px;
        font-size: 16px;
        text-align: center;
    }

    /deep/ .fillTbale {
        .value {
            text-align: left;

            .el-date-editor {
                width: 100%;
            }
        }
    }

    .tfootInfo {
        display: flex;

        .item {
            flex: 1;
            line-height: 50px;
            padding-left: 10px;
            text-align: center;
        }
      .item25 {
        flex: 1; /* 占比1份 */
        white-space: nowrap; /* 防止文字换行 */
      }

      .item75 {
        flex: 3; /* 占比3份 */
        white-space: nowrap; /* 防止文字换行 */
      }

    }
}</style>