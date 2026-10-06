<template>
  <div id="baseInfo" class="baseInfoPage">
    <div class="common-info">
        <div class="clearfix">
            <div class="fl" style="width:800px">
                <h3 class="myTitle">公司信息：</h3>
                <ul class="content clearfix">
                    <li class="item item50">
                        <label class="label-term">公司名称</label>
                        <div class="input-text">
                            <el-input v-model="baseinfo.custName" :disabled="true"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">地址</label>
                        <div class="input-text">
                            <el-input v-model="baseinfo.address" :disabled="true"></el-input>
                        </div>
                    </li>
                </ul>
                <ul class="content clearfix">
                    <li class="item item50">
                        <label class="label-term">管理员</label>
                        <div class="input-text">
                            <el-input v-model="baseinfo.linkman" :disabled="true"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">联系电话</label>
                        <div class="input-text">
                            <el-input v-model="baseinfo.linkPhone" :disabled="true"></el-input>
                        </div>
                    </li>
                </ul>
            </div>
            <ul class="content fl clearfix" style="width:300px;margin:30px 0 0 30px;">
                <li class="item item100 img-upload">
                    <div class="input-text">
                        <img :src="baseinfo.businessLicenseImgUrl" alt="">
                    </div>
                </li>
            </ul>
        </div>
        <div class="clearfix">
            <div class="fl" style="width:800px">
                <h3 class="myTitle">开票信息：</h3>
                    <ul class="content clearfix">
                    <li class="item item50">
                        <label class="label-term">发票资质类型</label>
                        <div class="input-text">
                            <el-input v-model="baseinfo.invoiceTypeName" :disabled="true"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">纳税人识别号</label>
                        <div class="input-text">
                            <el-input v-model="baseinfo.taxNumber" :disabled="true"></el-input>
                        </div>
                    </li>
                    </ul>
                    <ul class="content clearfix">
                    <li class="item item50">
                        <label class="label-term">注册地址</label>
                        <div class="input-text">
                            <el-input v-model="baseinfo.regAddress" :disabled="true"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">注册电话</label>
                        <div class="input-text">
                            <el-input v-model="baseinfo.regPhone" :disabled="true"></el-input>
                        </div>
                    </li>
                    </ul>
                    <ul class="content clearfix">
                    <li class="item item50">
                        <label class="label-term">注册银行</label>
                        <div class="input-text">
                            <el-input v-model="baseinfo.regBank" :disabled="true"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">卡户名</label>
                        <div class="input-text">
                            <el-input v-model="baseinfo.accountName" :disabled="true"></el-input>
                        </div>
                    </li>
                    </ul>
                    <ul class="content clearfix">
                    <li class="item item50">
                        <label class="label-term">账号</label>
                        <div class="input-text">
                            <el-input v-model="baseinfo.regAccount" :disabled="true"></el-input>
                        </div>
                    </li>
                    </ul>
                </div>
                <ul class="content fl clearfix" style="width:300px;margin:30px 0 0 30px;">
                    <li class="item item100 img-upload">
                        <div class="input-text">
                            <img :src="baseinfo.invoiceInfoImgUrl" alt="">
                        </div>
                    </li>
                </ul>
            </div>
    </div>
  </div>
</template>

<script>
import baseInfo from './baseInfo.js'
export default baseInfo
</script>
<style lang="scss">
.baseInfoPage{
    .myTitle{
        font-size: 14px;
        font-weight: bold;
        line-height: 40px;
        margin-bottom: 10px;
        padding-left: 12px;
    }
    .img-upload{
        .input-text{
            img{
                width: 100%;
                border:$border;
            }
        }
    }
}
</style>
