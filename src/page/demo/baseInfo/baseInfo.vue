<template>
  <div id="baseInfo" class="baseInfoPage">
    <div class="common-info">
        <ul class="content clearfix">
            <li class="item">
                <label class="label-term">供应商</label>
                <div class="input-text">
                    <el-input v-model="inputvalue"></el-input>
                </div>
            </li>
            <li class="item">
                <label class="label-term">指定客户</label>
                <div class="input-text">
                    <el-input v-model="inputvalue"></el-input>
                </div>
            </li>
            <li class="item">
                <label class="label-term">运输时效</label>
                <div class="input-text">
                    <el-input v-model="inputvalue"></el-input>
                </div>
            </li>
        </ul>
        <ul class="content clearfix">
            <li class="item">
                <label class="label-term">起始地：</label>
                <div class="input-text">
                    <el-radio-group v-model="radio1" class="fl" @change="selectRadio(true)">
                        <el-radio-button label="1" >作业点</el-radio-button>
                        <el-radio-button label="2" >省市区</el-radio-button>
                    </el-radio-group>
                    <el-select v-model="form.beginWorkId" filterable v-show="showBeginWorkSelect" placeholder="请选择作业点">
                        <el-option
                                v-for="item in workData"
                                :key="item.workId"
                                :label="item.workName"
                                :value="item.workId">
                        </el-option>
                    </el-select>
                    <mycity ref="beginCity" selectType="3" @selectCallback="selectBeginCallback" class="mycity fl" v-show="showBeginCity" placeholder="请选择省市区"></mycity>
                </div>
            </li>
        </ul>
        <ul class="content clearfix">
            <li class="item">
                <label class="label-term">目的地：</label>
                <div class="input-text">
                    <el-radio-group v-model="radio2" class="fl" @change="selectRadio(false)">
                        <el-radio-button label="1" >作业点</el-radio-button>
                        <el-radio-button label="2" >省市区</el-radio-button>
                    </el-radio-group>
                    <el-select v-model="form.endWorkId" filterable v-show="showEndWorkSelect" placeholder="请选择作业点">
                        <el-option
                                v-for="item in workData"
                                :key="item.workId"
                                :label="item.workName"
                                :value="item.workId">
                        </el-option>
                    </el-select>
                    <mycity ref="endCity" selectType="3" @selectCallback="selectEndCallback" class="mycity fl" v-show="showEndCity" placeholder="请选择省市区"></mycity>
                </div>
            </li>
        </ul>
    </div>
    <div class="common-info">
        <div class="clearfix">
            <div class="fl" style="width:800px">
                <h3 class="myTitle">公司信息：</h3>
                <ul class="content clearfix">
                    <li class="item item50">
                        <label class="label-term">公司名称</label>
                        <div class="input-text">
                            <el-input v-model="inputvalue"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">地址</label>
                        <div class="input-text">
                            <el-input v-model="inputvalue"></el-input>
                        </div>
                    </li>
                </ul>
                <ul class="content clearfix">
                    <li class="item item50">
                        <label class="label-term">管理员</label>
                        <div class="input-text">
                            <el-input v-model="inputvalue"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">联系电话</label>
                        <div class="input-text">
                            <el-input v-model="inputvalue"></el-input>
                        </div>
                    </li>
                </ul>
            </div>
            <ul class="content fl clearfix" style="width:300px;margin:30px 0 0 30px;">
                <li class="item item100 img-upload">
                    <div class="input-text">
                        <img src="https://org.modao.cc/uploads4/images/5267/52674980/v2_qeqmzq.png" alt="">
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
                            <el-input v-model="inputvalue"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">纳税人识别号</label>
                        <div class="input-text">
                            <el-input v-model="inputvalue"></el-input>
                        </div>
                    </li>
                    </ul>
                    <ul class="content clearfix">
                    <li class="item item50">
                        <label class="label-term">注册地址</label>
                        <div class="input-text">
                            <el-input v-model="inputvalue"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">注册电话</label>
                        <div class="input-text">
                            <el-input v-model="inputvalue"></el-input>
                        </div>
                    </li>
                    </ul>
                    <ul class="content clearfix">
                    <li class="item item50">
                        <label class="label-term">注册银行</label>
                        <div class="input-text">
                            <el-input v-model="inputvalue"></el-input>
                        </div>
                    </li>
                    <li class="item item50">
                        <label class="label-term">卡户名</label>
                        <div class="input-text">
                            <el-input v-model="inputvalue"></el-input>
                        </div>
                    </li>
                    </ul>
                    <ul class="content clearfix">
                    <li class="item item50">
                        <label class="label-term">账号</label>
                        <div class="input-text">
                            <el-input v-model="inputvalue"></el-input>
                        </div>
                    </li>
                    </ul>
                </div>
                <ul class="content fl clearfix" style="width:300px;margin:30px 0 0 30px;">
                    <li class="item item100 img-upload">
                        <div class="input-text">
                            <img src="https://org.modao.cc/uploads4/images/5263/52637542/v2_qeoks0.png" alt="">
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