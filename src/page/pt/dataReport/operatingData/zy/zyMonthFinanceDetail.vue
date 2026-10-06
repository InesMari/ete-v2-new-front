<template>
    <div id="zyMonthFinanceDetail">
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
                    <div style="line-height: 40px;padding-left: 20px;font-weight: bold;">实际总收入：{{info.code30030001}}</div>
                </li>
            </ul>
            <h3 class="common-title" style="margin:0 10px 10px 10px;"><span class="title-name">净利润</span></h3>
            <ul class="content" style="display: flex;margin-bottom: 10px;">
                <li class="item" style="flex:1;margin:0 10px 0 10px;">
                    <div class="label-term">净利润</div>
                    <div class="input-text">                                
                        <el-input @blur="resolveValue" :disabled="true" v-model="info.code30030028"></el-input>
                    </div>
                </li>
            </ul>
              <ul class="content" style="display: flex;margin-bottom: 10px;">
              <li class="item" style="flex:1;margin:0 10px 0 10px;">
                  <div class="label-term">往期收入调整</div>
                  <div class="input-text">
                    <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code30030029"></el-input>
                  </div>
                </li>
                <li class="item" style="flex:1;margin:0 10px 0 10px;">
                  <div class="label-term">往期成本调整</div>
                  <div class="input-text">
                    <el-input @blur="resolveValue" :disabled="disabled" v-model="info.code30030030"></el-input>
                  </div>
                </li>
              </ul>
            <ul class="content" style="display: flex;margin-bottom: 10px;">
                <li class="item" style="flex:0.5;margin:0 30px 0 10px;">
                  <div class="label-term" >最终财务核算净利润</div>
                  <div class="input-text">
                    <el-input @blur="resolveValue" :disabled="true" v-model="info.code30030031"></el-input>
                  </div>
                </li>
            </ul>
            <div class="page-bot-btn">
                <el-button @click="close">关闭</el-button>
                <el-button type="primary" @click="changeData(1)">保存</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import zyMonthFinanceDetail from './zyMonthFinanceDetail.js'
export default zyMonthFinanceDetail
</script>
<style lang="scss" scoped>
#zyMonthFinanceDetail {
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

