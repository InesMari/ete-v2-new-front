<template>
    <div id="zyMonthDetail">
        <div class="common-info flex">
            <div class="dateTitle">
                数据年月：                
                <div class="value">
                    <el-select v-model="info.id" clearable filterable placeholder="请选择月份" size="mini"
                        style="width: 120px;" @change="changeMonth">
                        <el-option v-for="item in months" :key="item.id" :label="item.month"
                            :value="item.id"></el-option>
                    </el-select>
                </div>
            </div>
            <h3 class="common-title"><span class="title-name">分项数据合计</span></h3>
            <ul class="content clearfix" style="margin-top:10px;">
                <li class="item">
                    <div class="label-term">自有车收入：</div>
                    <div class="input-text">
                        <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code30010005" placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item">
                    <div class="label-term">外请车收入：</div>
                    <div class="input-text">
                        <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code30010006" placeholder="请输入"></el-input>
                    </div>
                </li>
                <li class="item">
                    <div class="label-term">总收入合计：</div>
                    <div class="input-text">
                        <el-input :disabled="true" v-model="info.code30030001" placeholder="自动计算"></el-input>
                    </div>
                </li>
            </ul>
            <h3 class="common-title">
                <span class="title-name">分项数据 - 中源车</span>
                <div class="total">
                    <div class="item">
                      <el-tooltip effect="light" content="自有车毛利 + 外请车毛利" placement="top">
                        <i class="el-icon-warning-outline" style="color:#E6A23C;"></i>
                      </el-tooltip>
                      总毛利：{{info.code30030023}}
                    </div>
                    <div class="item">
                        <el-tooltip effect="light" content="总毛利 - 车队间接费用 - 2个车厢贷利息 - 公司三费分摊" placement="top">
                            <i class="el-icon-warning-outline" style="color:#E6A23C;"></i>
                        </el-tooltip>
                        总净利：{{info.code30030028}}
                    </div>
                  <div class="item">
                    <el-tooltip effect="light" content="往期收入调整" placement="top">
                      <i class="el-icon-warning-outline" style="color:#E6A23C;"></i>
                    </el-tooltip>
                    往期收入调整：{{info.code30030029}}
                  </div>
                  <div class="item">
                    <el-tooltip effect="light" content="往期成本调整" placement="top">
                      <i class="el-icon-warning-outline" style="color:#E6A23C;"></i>
                    </el-tooltip>
                    往期成本调整：{{info.code30030030}}
                  </div>
                  <div class="item">
                    <el-tooltip effect="light" content="总净利+往期收入调整-往期成本调整" placement="top">
                      <i class="el-icon-warning-outline" style="color:#E6A23C;"></i>
                    </el-tooltip>
                    最终财务核算净利润：{{info.code30030031}}
                  </div>
                </div>
            </h3>
            <div class="dataView">
                <div class="dataItem">
                    <div class="editList">
                        <div class="item">
                            <div class="label">折旧+挂+车厢</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code30030005" placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">保险</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code30030006" placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">GPS+检测</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code30030007" placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">车辆租金</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code30030008" placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">司机工资</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code30030009" placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">押运工资</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code30030010" placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">社保及福利</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code30030011" placeholder="请输入"></el-input>
                            </div>
                        </div>
                    </div>
                    <div class="totalData">
                        <div class="label">自有车固定成本合计</div>
                        <div class="value">
                            <el-input :disabled="true" v-model="info.code30030012" placeholder="请输入"></el-input>
                        </div>
                    </div>
                </div>
                <div class="dataItem">
                    <div class="editList">
                        <div class="item">
                            <div class="label">燃气</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code30030014" placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">油费</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code30030015" placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">ETC</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code30030016" placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">修理费</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code30030017" placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">其他(耗费备品备件)</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code30030018" placeholder="请输入"></el-input>
                            </div>
                        </div>
                    </div>
                    <div class="totalData">
                        <div class="label">自有车变动成本合计</div>
                        <div class="value">
                            <el-input :disabled="true" v-model="info.code30030019" placeholder="请输入"></el-input>
                        </div>
                    </div>
                </div>
                <div class="dataItem">
                    <div class="editList">
                        <div class="item">
                            <div class="label">车队间隔费用</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code30030024" placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">车厢贷利息-5厢5挂</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code30030025" placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">车厢贷利息-15厢</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code30030026" placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">三费分摊</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code30030027" placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">外请车成本</div>
                            <div class="value">
                                <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code30030021" placeholder="请输入"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">外请车毛利</div>
                            <div class="value">
                                <el-input :disabled="true" v-model="info.code30030022" placeholder="自动计算"></el-input>
                            </div>
                        </div>
                        <div class="item">
                            <div class="label">自有车毛利</div>
                            <div class="value">
                                <el-input :disabled="true" v-model="info.code30030020" placeholder="自动计算"></el-input>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <h3 class="common-title" v-if="type != 1 || info.verifySts != 0">
                <span class="title-name">审核信息</span>
            </h3>
            <div class="review" v-if="type != 1 || info.verifySts != 0">
                <div class="item" style="flex:0.5;">
                    <div class="label">审核状态：</div>
                    <div class="value">
                        <el-input :disabled="true" v-model="info.verifyStsName"></el-input>
                    </div>
                </div>
                <div class="item" v-if="info.verifySts != 0">
                    <div class="label">审核人：</div>
                    <div class="value">
                        <el-input :disabled="true" :value="info.verifyUserName + '   ' + info.verifyDate"></el-input>
                    </div>
                </div>
                <div class="item">
                    <div class="label">审核意见：</div>
                    <div class="value">
                        <el-input v-if="info.verifySts == 0 && type == 2" :disabled="false" v-model="info.verifyRemark"></el-input>
                        <el-input v-else :disabled="true" v-model="info.verifyRemark"></el-input>
                    </div>
                </div>
            </div>
            <div class="page-bot-btn">
                <el-button @click="close">关闭</el-button>
                <el-button type="primary" @click="changeData" v-if="!disabled" v-entity="1007171">修改</el-button>
                <el-button type="danger" @click="del" v-if="!disabled" v-entity="1007172">删除</el-button>
                <el-button type="primary" @click="verify(1)" v-if="type==2 && info.verifySts==0" v-entity="1007173">审核通过</el-button>
                <el-button type="danger" @click="verify(2)" v-if="type==2 && info.verifySts==0" v-entity="1007173">审核不通过</el-button>
                <el-button type="danger" @click="cancelVerify" v-if="info.verifySts!=0" v-entity="1007174">取消审核</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import zyMonthDetail from './zyMonthDetail.js'
export default zyMonthDetail
</script>
<style lang="scss" scoped>
#zyMonthDetail {
    .common-title{
        .total{
            float:right;
            .item{
                float:left;
                margin-right: 20px;
                line-height:30px;
                font-weight: bold;
            }
        }
    }
    .dateTitle{
        display: flex;
        height: 40px;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
        font-weight: bold;
        font-size: 16px;
        color: #333;
    }
    .common-info{
        .content{
            display: flex;
            .item{
                min-width: initial;
                flex:1;
                .label-term{
                    width:88px;
                }
                &:last-child{
                    margin-right:0;
                }
            }
        }
    }
    /deep/ .dataView{
        .dataItem{
            overflow: hidden;
            .editList{
                padding:10px 0;
                float: left;
                display: flex;
                flex-wrap: nowrap;
                width: calc(100% - 230px);
                overflow-x: auto;
                overflow-y: hidden;
                .item{
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                    flex-direction: column;
                    width: 120px;
                    margin-right: 20px;
                    min-height: 10px;
                    .label{
                        margin-bottom:5px;
                    }
                    .value{
                        .el-input__inner{
                            text-align: center;
                        }
                    }
                }
            }
            .totalData{
                float: right;
                width: 200px;
                text-align: center;
                padding:10px 0;
                .label{
                    margin-bottom:5px;
                }
                .value{
                    .el-input__inner{
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
            width: 100px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .value{
            flex: 1;
        }
    }
}
</style>

