<template>
    <div id="addTemporaryCustomer" class="addCustomerPage">
        <div class="common-info">
            <div class="clearfix">
                <div class="ipt-info fl">
                    <ul class="content clearfix">
                        <li class="item">
                            <label class="label-term"><em>*</em>客户名称</label>
                            <div class="input-text">
                                <el-input v-model="customer.custName" :disabled="isLock"></el-input>
                            </div>
                        </li>
                        <li class="item">
                            <label class="label-term"><em>*</em>客户联系人</label>
                            <div class="input-text">
                                <el-input v-model="customer.linkman" :disabled="isLock"></el-input>
                            </div>
                        </li>
                        <li class="item">
                            <label class="label-term"><em>*</em>联系电话</label>
                            <div class="input-text">
                                <el-input v-model="customer.linkPhone" v-mynumval @change="checkBillId()"
                                          placeholder="手机号码" :disabled="isLock"></el-input>
                            </div>
                        </li>
                        <li class="item">
                            <label class="label-term">客户地址</label>
                            <div class="input-text">
                                <el-input v-model="customer.address" :disabled="isLock"></el-input>
                            </div>
                        </li>
                        <li class="item item100">
                            <label class="label-term">备注</label>
                            <div class="input-text">
                                <el-input type="textarea" v-model="customer.remark" :disabled="isLock"></el-input>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="upload-info fr">
                    <div class="label-term">营业执照</div>
                    <div class="input-text" :class="isLock?'fileModelLock':''">
                        <myFileModel ref="businessLicense" @successCallback="successCallback" :disabled-del="isLock"
                                     :disabled-edit="isLock"></myFileModel>
                    </div>
                </div>
            </div>
            <div class="bot-btn">
                <el-button @click="closeAddCustomer()">关闭</el-button>
                <el-button type="primary" @click="addCustomer()" v-if="!isLock && !isUpdate">确定新增</el-button>
                <el-button type="primary" @click="addCustomer()" v-if="!isLock && isUpdate">确定修改</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import addTemporaryCustomer from './addTemporaryCustomer.js'

export default addTemporaryCustomer
</script>
<style lang="scss" scoped>
.addCustomerPage {
    /deep/ .common-info {
        .content > .item .label-term {
            float: left;
            width: 120px;
            height: 40px;
            padding-right: 10px;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            display: -webkit-flex;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: end;
            -ms-flex-pack: end;
            justify-content: flex-end;
            text-align: right;
        }

        .content > .item .input-text {
            float: left;
            width: calc(100% - 130px);
            line-height: 40px;
            position: relative;
        }
    }

    /deep/ .ipt-info {
        width: calc(100% - 270px);

        .item {
            width: 48%;
        }

        .item100 {
            width: 98%;
        }

        .el-textarea__inner {
            width: 100%;
        }
    }

    /deep/ .upload-info {
        width: 250px;

        .label-term {
            line-height: 40px;
        }

        .myFileModel .avatar-uploader {
            .el-upload {
                width: 250px;
                height: 200px;
            }

            .avatar-uploader-icon {
                width: 250px;
                height: 200px;
                line-height: 200px;
                font-size: 70px;
            }
        }

        .fileModelLock {
            .el-upload-dragger {
                background: #F5F7FA;
            }
        }
    }

    /deep/ .tableCommon {
        .add {
            vertical-align: middle;
            @include add;
        }

        .del {
            vertical-align: middle;
            @include del;
        }

        .el-select {
            width: 100%;
        }
    }
}
</style>
