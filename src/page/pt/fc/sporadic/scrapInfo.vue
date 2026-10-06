<template>
    <div id="scrapInfo" class="scrapInfoPage">
        <div class="common-info">
            <table class="fillTbale" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="label">物流基地</td>
                    <td class="value">
                        <el-select v-model="info.workId" :disabled="isVisible" filterable clearable placeholder="请选择">
                            <el-option v-for="item in workData" :key="item.workId" :label="item.workName" :value="item.workId" :disabled="item.disabled"></el-option>
                        </el-select>
                    </td>
                    <td class="label">废品名称</td>
                    <td class="value">
                        <el-select v-model="info.scrapType" :disabled="isVisible" filterable clearable placeholder="请选择">
                            <el-option v-for="item in scrapTypeData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">计量单位</td>
                    <td class="value">
                        <el-input v-model="info.unit" :disabled="isVisible" maxlength="20" show-word-limit placeholder="请输入"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">售卖方式</td>
                    <td class="value">
                        <el-select v-model="info.salesMethod" :disabled="isVisible" filterable clearable placeholder="请选择">
                            <el-option v-for="item in salesMethodData" :key="item.codeValue" :label="item.codeName"
                                       :value="item.codeValue"></el-option>
                        </el-select>
                    </td>
                    <td class="label">联系人</td>
                    <td class="value">
                        <el-input v-model="info.linkman" :disabled="isVisible"  maxlength="50" show-word-limit placeholder="请输入"></el-input>
                    </td>
                    <td class="label">联系电话</td>
                    <td class="value">
                        <el-input v-model="info.linkPhone" :disabled="isVisible"  maxlength="50" show-word-limit placeholder="请输入"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">回收方</td>
                    <td class="value">
                        <el-input v-model="info.recyclingSubject" :disabled="isVisible" maxlength="100" show-word-limit placeholder="请输入"></el-input>
                    </td>
                    <td class="label">单价(元)</td>
                    <td class="value" >
                        <el-input v-model="info.price" :disabled="isVisible" v-mydoubleval placeholder="请输入"></el-input>
                    </td>
                </tr>
                <tr>
                    <td class="label">备注</td>
                    <td class="value" colspan="5">
                        <el-input v-model="info.remark" :disabled="isVisible" maxlength="500" show-word-limit placeholder="请输入"></el-input>
                    </td>
                </tr>
            </table>
            <div class="tfootInfo" v-show="isVisible">
                <div class="item">创建人：{{info.createUserName}}</div>
                <div class="item">创建时间：{{info.createDate}}</div>
            </div>
            <div class="page-bot-btn ">
                <el-button @click="closePage">关闭</el-button>
                <el-button type="primary" @click="save()" v-show="type != 5 && type != 6">提交</el-button>
            </div>
        </div>
    </div>
</template>
  
<script>
import scrapInfo from './scrapInfo.js'
export default scrapInfo
</script>
<style lang="scss" scoped>
.scrapInfoPage {
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
    }
}</style>