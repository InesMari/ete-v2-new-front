<template>
    <div id="wasteDisposal" class="wasteDisposalPage">
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
                    <td class="label">物流基地</td>
                    <td class="value">
                        <el-select v-model="info.workId" @change="changeWork" :disabled="isVisible" filterable clearable placeholder="请选择">
                            <el-option v-for="item in workData" :key="item.workId" :label="item.workName" :value="item.workId" :disabled="item.disabled"></el-option>
                        </el-select>
                    </td>
                    <td class="label">月份</td>
                    <td class="value">
                        <el-date-picker :disabled="isVisible" v-model="info.month" type="month"
                                        value-format="yyyy-MM" placeholder="月份">
                        </el-date-picker>
                    </td>
                </tr>
                <tr>
                    <td class="label">废品名称</td>
                    <td class="value">
                        <el-select v-model="info.scrapType" @change="changeScrapType" :disabled="isVisible" filterable clearable placeholder="请选择">
                            <el-option v-for="item in scrapTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">单价(元)</td>
                    <td class="value" >
                        <el-input v-model="info.price" @input="changePrice" :disabled="isVisible" v-mydoubleval placeholder="请输入"></el-input>
                    </td>
                    <td class="label">计量单位</td>
                    <td class="value">
                        <el-input v-model="info.unit" :disabled="isVisible" maxlength="20" show-word-limit placeholder="请输入"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">数量</td>
                    <td class="value">
                        <el-input v-model="info.nums" @input="changeNums" :disabled="isVisible" placeholder="请输入"></el-input>
                    </td>
                    <td class="label">金额</td>
                    <td class="value">
                        <el-input v-model="info.amount" disabled v-mydoubleval placeholder="请输入"></el-input>
                    </td>
                    <td class="label">入账金额</td>
                    <td class="value">
                        <el-input v-model="info.postedAmount" :disabled="isVisible" v-mydoubleval placeholder="请输入"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">备注</td>
                    <td class="value" colspan="5">
                        <el-input v-model="info.remark" :disabled="isVisible" maxlength="500" show-word-limit placeholder="请输入"></el-input>
                    </td>
                </tr>
            </table>
            <div class="innerInfo">
                <ul class="content clearfix" style="flex:1;">
                    <li class="item item100 img-upload">
                        <label class="label-term">处理清单：</label>
                        <div class="input-text">
                            <myFileModel ref="handlingChecklist" :componentId="1"
                                         @successCallback="successCallback"
                                         @delCallback="deleteCallback"
                                         :disabledEdit="isVisible" :disabledDel="isVisible"></myFileModel>
                            <p style="color: #999;">此附件需基地负责人签名</p>
                        </div>
                    </li>
                </ul>
                <ul class="content clearfix" style="flex:1;">
                    <li class="item item100 img-upload">
                        <label class="label-term">结算单据：</label>
                        <div class="input-text">
                            <myFileModel ref="settlementDocument" :componentId="2"
                                         @successCallback="successCallback"
                                         @delCallback="deleteCallback"
                                         :disabledEdit="isVisible" :disabledDel="isVisible"></myFileModel>
                            <p style="color: #999;">此附件需基地负责人签名</p>
                        </div>
                    </li>
                </ul>
                <ul class="content clearfix" style="flex:1;">
                    <li class="item item100 img-upload">
                        <label class="label-term">售卖记录：</label>
                        <div class="input-text">
                            <myFileModel ref="salesRecords" :componentId="3"
                                         @successCallback="successCallback"
                                         @delCallback="deleteCallback"
                                         :disabledEdit="isVisible" :disabledDel="isVisible"></myFileModel>
                            <p v-show="type != 5" style="color: #999;"><a href="/download/OMC-029-01-N废品售卖记录表.xlsx" class="link">下载模板</a></p>
                        </div>
                    </li>
                </ul>
            </div>
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
import wasteDisposal from './wasteDisposal.js'
export default wasteDisposal
</script>
<style lang="scss" scoped>
.wasteDisposalPage {
    .innerInfo{
        display: flex;
        margin-top: 20px;
    }
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