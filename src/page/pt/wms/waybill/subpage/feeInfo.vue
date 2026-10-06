<template>
    <div id="feeInfo">
        <h3 class="common-title mt_20">
            <span class="title-name">短驳配送收入</span>
            <el-button class="fr" size="mini" type="primary" style="margin-top:6px;" @click="open()">选择收入</el-button>
        </h3>
        <div class="tickManager" style="overflow: auto;">
            <table class="tableCommon" ref="feeDetail" width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                <tr>
                    <th width="50">序号</th>
                    <th width="250">货主</th>
                    <th width="150">费用项目名称</th>
                    <th width="150">匹配条件</th>
                    <th width="100">单位</th>
                    <th width="100">不含税单价</th>
                    <th width="100">税率</th>
                    <th width="100">含税价</th>
                    <th width="100"><em>*</em>配送数量</th>
                    <th width="100" v-if="isReturn==1&&type==2"><em>*</em>返程数量</th>
                    <th width="100" v-if="isReturn==1&&type==2">合计数量</th>
                    <th width="100">不含税金额</th>
                    <th width="100">含税金额</th>
<!--                    <th width="100" v-show="show">是否下次展示</th>-->
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index)  in feeList">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.srcTenantName }}</td>
                    <td>{{ item.itemName }}</td>
                    <td>{{ item.matchCondition }}</td>
                    <td>{{ item.unit }}</td>
                    <td>{{ item.price }}</td>
                    <td>{{ item.tax }}</td>
                    <td>{{ item.priceWithTax }}</td>
                    <td>
                        <el-input v-model="item.num" type="text" v-mydoubleval placeholder=""
                                  @input="changeItemNum" :disabled="item.disabled"></el-input>
                    </td>
                    <td v-if="isReturn==1&&type==2">
                      <el-input v-model="item.returnNums" @input="changeFeeItemReturnNums"
                                :disabled="item.disabled"></el-input>
                    </td>
                  <td v-if="isReturn==1&&type==2">{{ item.totalNum }}</td>
                  <td>{{ item.totalFee }}</td>
                    <td>{{ item.totalFeeWithTax }}</td>
<!--                    <td v-show="show">-->
<!--                        <el-switch v-model="item.isDefault == 1"-->
<!--                                   @change="changeDefaultSwitch(item, index)"-->
<!--                                   active-color="#13ce66"-->
<!--                                   inactive-color="#ff4949"-->
<!--                                   active-text="是"-->
<!--                                   inactive-text="否">-->
<!--                        </el-switch>-->
<!--                    </td>-->
                </tr>
                </tbody>
                <tfoot>
                <tr>
                    <td>合计：</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td class="red fw">{{ totalInfo.num }}</td>
                    <td class="red fw" v-if="isReturn==1&&type==2">{{ totalInfo.returnNums }}</td>
                    <td class="red fw" v-if="isReturn==1&&type==2">{{ totalInfo.totalNum }}</td>
                    <td class="red fw">{{ totalInfo.totalFee }}</td>
                    <td class="red fw">{{ totalInfo.totalFeeWithTax }}</td>
<!--                    <td v-show="show"></td>-->
                </tr>
                </tfoot>
            </table>
        </div>

        <el-dialog class="operateDialog" title="计费项目操作" :visible.sync="isShowDialog" width="1200px" >
            <div class="title">
                <div>不参与计费项目</div>
                <div>参与计费项目</div>
            </div>
            <dbTable ref="dbTable" :head="feeHead" onlyId="onlyId"></dbTable>
            <div class="bot-btn">
                <el-button size="mini" @click="isShowDialog = false">关闭</el-button>
                <el-button size="mini" type="primary" @click="saveChangeFeeItem">保存</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import feeInfo from './feeInfo.js'

export default feeInfo
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
#feeInfo{
    .operateDialog {
        .title {
            display: flex;

            >div {
                flex: 1;
                font-size: 14px;
                font-weight: bold;
                text-align: center;
                margin-bottom: 10px;
            }
        }
    }
}
</style>
