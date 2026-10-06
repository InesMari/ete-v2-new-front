<template>
    <div id="transportMonthDetail">
        <div class="common-info flex">
            <ul class="content" style="display: flex;">
                <li class="item" style="flex:1;margin:0 10px 0 0;">
                    <div class="label-term">数据年月</div>
                    <div class="input-text">                                
                        <el-select v-model="info.id" clearable filterable placeholder="请选择月份" @change="changeMonth">
                            <el-option v-for="item in months" :key="item.id" :label="item.month"
                                        :value="item.id"></el-option>
                        </el-select>
                    </div>
                </li>
                <li class="item item50">
                    <div style="line-height: 40px;padding-left: 20px;font-weight: bold;">运输中心实际总收入：{{info.code10010004}}</div>
                </li>
            </ul>
            <div class="dataView">
                <div class="leftView">
                    <h3 class="common-title"><span class="title-name">总收入实际</span></h3>
                    <ul class="content">
                        <li class="item item100">
                            <div class="label-term">项目1组</div>
                            <div class="input-text">                                
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code10030001"></el-input>
                            </div>
                        </li>
                        <li class="item item100">
                            <div class="label-term">项目2组</div>
                            <div class="input-text">                                
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code10030002"></el-input>
                            </div>
                        </li>
                        <li class="item item100">
                            <div class="label-term">项目3组</div>
                            <div class="input-text">                                
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code10030003"></el-input>
                            </div>
                        </li>
                        <li class="item item100">
                            <div class="label-term">项目4组</div>
                            <div class="input-text">                                
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code10030004"></el-input>
                            </div>
                        </li>
                        <li class="item item100">
                            <div class="label-term">合计</div>
                            <div class="input-text">                                
                                <el-input @blur="resolveValue" :disabled="true" v-model="info.code10030005"></el-input>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="rightView">
                    <h3 class="common-title"><span class="title-name">总毛利额</span></h3>
                    <ul class="content">
                        <li class="item item100">
                            <div class="label-term">项目1组</div>
                            <div class="input-text">                                
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code10040001"></el-input>
                            </div>
                        </li>
                        <li class="item item100">
                            <div class="label-term">项目2组</div>
                            <div class="input-text">                                
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code10040002"></el-input>
                            </div>
                        </li>
                        <li class="item item100">
                            <div class="label-term">项目3组</div>
                            <div class="input-text">                                
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code10040003"></el-input>
                            </div>
                        </li>
                        <li class="item item100">
                            <div class="label-term">项目4组</div>
                            <div class="input-text">                                
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code10040004"></el-input>
                            </div>
                        </li>
                        <li class="item item100">
                            <div class="label-term">合计</div>
                            <div class="input-text">                                
                                <el-input @blur="resolveValue" :disabled="true" v-model="info.code10040005"></el-input>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="dataView">
                <div class="leftView">
                    <h3 class="common-title"><span class="title-name">总收入</span></h3>
                    <ul class="content">
                        <li class="item item100">
                            <div class="label-term">自有车</div>
                            <div class="input-text">                                
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code10050002"></el-input>
                            </div>
                        </li>
                        <li class="item item100">
                            <div class="label-term">外调车</div>
                            <div class="input-text">                                
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code10050003"></el-input>
                            </div>
                        </li>
                        <li class="item item100">
                            <div class="label-term">中源+自有车内转</div>
                            <div class="input-text">                                
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code10050004"></el-input>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="rightView">
                    <h3 class="common-title"><span class="title-name">总成本</span></h3>
                    <ul class="content">
                        <li class="item item100">
                            <div class="label-term">自有车</div>
                            <div class="input-text">                                
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code10050006"></el-input>
                            </div>
                        </li>
                        <li class="item item100">
                            <div class="label-term">外调车</div>
                            <div class="input-text">                                
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code10050007"></el-input>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="dataView">
                <div class="leftView">
                    <h3 class="common-title"><span class="title-name">总利差额</span></h3>
                    <ul class="content">
                        <li class="item item100">
                            <div class="label-term">自有车</div>
                            <div class="input-text">                                
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code10050010"></el-input>
                            </div>
                        </li>
                        <li class="item item100">
                            <div class="label-term">外调车</div>
                            <div class="input-text">                                
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code10050011"></el-input>
                            </div>
                        </li>
                        <li class="item item100">
                            <div class="label-term">中源+自有车内转</div>
                            <div class="input-text">                                
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code10050012"></el-input>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="rightView">
                    <h3 class="common-title"><span class="title-name">减</span></h3>
                    <ul class="content">
                        <li class="item item100">
                            <div class="label-term">减：部门费用</div>
                            <div class="input-text">                                
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code10050014"></el-input>
                            </div>
                        </li>
                        <li class="item item100">
                            <div class="label-term">减：三费</div>
                            <div class="input-text">                                
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code10050015"></el-input>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <h3 class="common-title" style="margin:0 10px 10px 10px;"><span class="title-name">净利润</span></h3>
            <ul class="content" style="display: flex;margin-bottom: 10px;">
                <li class="item" style="flex:1;margin:0 10px 0 10px;">
                    <div class="label-term">净利润</div>
                    <div class="input-text">                                
                        <el-input @blur="resolveValue" :disabled="true" v-model="info.code10050016"></el-input>
                    </div>
                </li>
                <li class="item" style="flex:1;margin:0 10px 0 10px;">
                    <div class="label-term">净利率(%)</div>
                    <div class="input-text">                                
                        <el-input @blur="resolveValue" :disabled="true" v-model="info.code10050017"></el-input>
                    </div>
                </li>
            </ul>
              <ul class="content" style="display: flex;margin-bottom: 10px;">
              <li class="item" style="flex:1;margin:0 10px 0 10px;">
                  <div class="label-term">往期收入调整</div>
                  <div class="input-text">
                    <el-input @blur="resolveValue" :disabled="true" v-model="info.code10050018"></el-input>
                  </div>
                </li>
                <li class="item" style="flex:1;margin:0 10px 0 10px;">
                  <div class="label-term">往期成本调整</div>
                  <div class="input-text">
                    <el-input @blur="resolveValue" :disabled="true" v-model="info.code10050019"></el-input>
                  </div>
                </li>
              </ul>
          <ul class="content" style="display: flex;margin-bottom: 10px;">
                <li class="item" style="flex:0.5;margin:0 30px 0 10px;">
                  <div class="label-term" >最终财务核算净利润</div>
                  <div class="input-text">
                    <el-input @blur="resolveValue" :disabled="true" v-model="info.code10050020"></el-input>
                  </div>
                </li>
            </ul>
            <h3 class="common-title" style="margin:0 10px 10px 10px;"><span class="title-name">审核</span></h3>
            <div class="review">
                <div class="item" style="flex:0.5;margin:0 10px 0 10px;">
                    <div class="label">审核状态：</div>
                    <div class="value">
                        <el-input :disabled="true" v-model="info.verifyStsName"></el-input>
                    </div>
                </div>
                <div class="item" v-if="info.verifySts != 0" style="margin:0 10px 0 10px;">
                    <div class="label">审核人：</div>
                    <div class="value">
                        <el-input :disabled="true" :value="info.verifyUserName + '   ' + info.verifyDate"></el-input>
                    </div>
                </div>
                <div class="item" style="margin:0 10px 0 10px;">
                    <div class="label">审核意见：</div>
                    <div class="value">
                        <el-input v-if="info.verifySts == 0 && type == 2" :disabled="false" v-model="info.verifyRemark"></el-input>
                        <el-input v-else :disabled="true" v-model="info.verifyRemark"></el-input>
                    </div>
                </div>
            </div>
            <div class="page-bot-btn">
                <el-button @click="close">关闭</el-button>
                <el-button type="primary" @click="changeData" v-if="!disabled" v-entity="1007155">修改</el-button>
                <el-button type="danger" @click="del" v-if="!disabled" v-entity="1007156">删除</el-button>
                <el-button type="primary" @click="verify(1)" v-if="type==2 && info.verifySts==0" v-entity="1007157">审核通过</el-button>
                <el-button type="danger" @click="verify(2)" v-if="type==2 && info.verifySts==0" v-entity="1007157">审核不通过</el-button>
                <el-button type="danger" @click="cancelVerify" v-if="info.verifySts!=0" v-entity="1007158">取消审核</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import transportMonthDetail from './transportMonthDetail.js'
export default transportMonthDetail
</script>
<style lang="scss" scoped>
#transportMonthDetail {
    .common-title{
        margin:10px 0;
    }
    .common-info{
        .content{
            overflow: hidden;
            .label-term{
                width: 110px;
            }
        }
        .dataView{
            display: flex;
            .leftView,.rightView{
                flex: 1;
                margin:0 10px;
            }
        }
    }
    .dataList{
        display: flex;
        margin-bottom: 20px;
        .common-title{
            line-height: 30px;
            padding-right: 10px;
            .total{
                float: right;
            }
            margin-bottom:15px;
        }
        .firstItem{
            display: flex;
            align-items: center;
            justify-content: center;
            &>div{
                font-size: 14px;
                font-weight: bold;
            }
        }
        /deep/ .item{
            flex: 1;
            border: $border;
            border-radius: 8px;
            margin:0 10px;
            overflow: hidden;
            .el-input{
                width: 80%;
                .el-input__inner{
                    text-align: center;
                }
            }
            .innerList{
                display: flex;
                margin-bottom: 15px;
                .innerItem{
                    flex: 1;
                    .label{
                        text-align: center;
                        margin-bottom: 5px;
                    }
                    .value{
                        text-align: center;
                    }
                }
            }
        }
    }
    .review{
        display: flex;
        height: 40px;
        .item{
            display: flex;
            align-items: center;
            flex: 1;
        }
        .label{
            width: 110px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
        }
        .value{
            flex: 1;
        }
    }
}
</style>

