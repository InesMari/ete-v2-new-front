<template>
    <div id="purchaseOrderManage">
        <searchList :formData="formData" @doQuery="doQuery" :query="loadParam"
                    searchKey="purOrderManageSearch"></searchList>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>采购单列表<em>（--双击序号查看详情--）</em></span>
                    <el-tooltip effect="light" content="采购单列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" v-entity="1014014" @click="inWarehouse">收货入库</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014015" @click="verifyItem">审核</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014015" @click="cancelVerifyItem">取消审核</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014016" @click="print">打印</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014017" @click="purchaseOffLine">线下采购单存档</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014018" @click="updateItem">修改</el-button>
                  <el-button type="danger"  plain size="mini" v-entity="1014019" @click="deleteItem">删除</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1014020" @click="exportExcel">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="purOrderManageTable" ref="table" :head="head" :showNum="true"
                         :showSetTable="true" :single-select="true" @dblclickItem="dblclickItem">
                <template v-slot:default="{item, code}">
                    <a href="javascript:void(0);" class="link" @click.stop="showImg(item)" v-if="code=='offLine'">查看</a>
                    <a href="javascript:void(0);" class="link" v-if="code=='applyNums'"
                       v-for="(data,index) in item.applyNumArray"
                       @click.stop="toApplyDetail(item, index)">{{index>0?','+data:data}}</a>
                    <a href="javascript:void(0);" class="link" v-if="code=='deliveryNums'"
                       v-for="(data,index) in item.deliveryNumArray"
                       @click.stop="toInOrderDetail(item, index)">{{index>0?','+data:data}}</a>
                </template>
            </tableCommon>
        </div>

<!--        &lt;!&ndash; 入库 begin&ndash;&gt;-->
<!--        <el-dialog title="收货入库" class="inWarehouse" :visible.sync="showInWarehouse" width="800px" :close-on-click-modal="false"-->
<!--                   :close-on-press-escape="false" @close="openShowInWarehouse(false)">-->
<!--            <div class="common-info" style="border:none;padding:0;">-->
<!--                <ul class="content clearfix">-->
<!--                    <li class="item item50">-->
<!--                        <label class="label-term">采购单单号</label>-->
<!--                        <div class="input-text">{{ info.purchaseNum }}</div>-->
<!--                    </li>-->
<!--                    <li class="item item50">-->
<!--                        <label class="label-term">采购方</label>-->
<!--                        <div class="input-text">{{ info.settleBodyName }}</div>-->
<!--                    </li>-->
<!--                </ul>-->
<!--                <ul class="content clearfix">-->
<!--                    <li class="item item50">-->
<!--                        <label class="label-term">入库地</label>-->
<!--                        <div class="input-text">{{ info.workName }}</div>-->
<!--                    </li>-->
<!--                    <li class="item item50">-->
<!--                        <label class="label-term"><em>*</em>入库日期</label>-->
<!--                        <div class="input-text">-->
<!--                            <el-date-picker v-model="info.inDate"-->
<!--                                            :picker-options="pickerOptions"-->
<!--                                            value-format="yyyy-MM-dd" format="yyyy-MM-dd"-->
<!--                                            type="date" placeholder="请选择年月日"></el-date-picker>-->
<!--                        </div>-->
<!--                    </li>-->
<!--                </ul>-->
<!--                <ul class="content clearfix">-->
<!--                    <li class="item item50">-->
<!--                        <label class="label-term">交货单：</label>-->
<!--                        <div class="input-text">-->
<!--                            <div class="clearfix">-->
<!--                                <myFileModel class="fl"-->
<!--                                            ref="file"-->
<!--                                            supportFiles="file"-->
<!--                                            :disabledEdit="disabledEdit" :disabledDel="disabledDel"-->
<!--                                            @successCallback="successCallback"-->
<!--                                            @delCallback="delCallback">-->
<!--                                </myFileModel>-->
<!--                            </div>-->
<!--                            <p>只支持.jpg .png .pdf .xls .xlsx格式</p>-->
<!--                        </div>-->
<!--                    </li>-->
<!--                  <li class="item item50">-->
<!--                    <label class="label-term">实物图片：</label>-->
<!--                    <div class="input-text">-->
<!--                      <div class="clearfix">-->
<!--                        <myFileModel class="fl"-->
<!--                                     ref="file"-->
<!--                                     supportFiles="img"-->
<!--                                     :disabledEdit="disabledEdit" :disabledDel="disabledDel"-->
<!--                                     @successCallback="successCallbackReal"-->
<!--                                     @delCallback="delCallbackReal">-->
<!--                        </myFileModel>-->
<!--                      </div>-->
<!--                      <p>只支持.jpg .png格式</p>-->
<!--                    </div>-->
<!--                  </li>-->
<!--                </ul>-->
<!--              <ul class="content clearfix">-->
<!--                <li class="item item100">-->
<!--                  <label class="label-term">备注：</label>-->
<!--                  <div class="input-text">-->
<!--                    <el-input v-model="info.orderRemark" :autosize="{minRows:5}" type="textarea" maxlength="2000" placeholder="说点什么"></el-input>-->
<!--                  </div>-->
<!--                </li>-->
<!--              </ul>-->
<!--                <div style="overflow-x:auto;">-->
<!--                    <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">-->
<!--                        <thead>-->
<!--                            <tr>-->
<!--                                <th width="60"></th>-->
<!--                                <th width="100">序号</th>-->
<!--                                <th width="250">物品种类</th>-->
<!--                                <th width="150">品名</th>-->
<!--                                <th width="150">规格型号</th>-->
<!--                                <th width="150">数量单位</th>-->
<!--                                <th width="150">采购数量</th>-->
<!--                                <th width="150">已入库数量</th>-->
<!--                                <th width="150">入库数量</th>-->
<!--                                <th width="150">付款类型</th>-->
<!--                                <th width="150">开始计费日期</th>-->
<!--                                <th width="150">结束计费日期</th>-->
<!--                            </tr>-->
<!--                        </thead>-->
<!--                        <tbody>-->
<!--                            <tr v-for="(item, index) in info.dtlList">-->
<!--                                <td>-->
<!--                                    <el-tooltip effect="dark" content="删除" placement="top-start" :hide-after='1000'>-->
<!--                                        <span class="del" @click="deleteDtlListItem(index)"></span>-->
<!--                                    </el-tooltip>-->
<!--                                </td>-->
<!--                                <td>{{ index+1 }}</td>-->
<!--                                <td>{{ item.feeSubTypeName }}</td>-->
<!--                                <td>{{ item.projectName }}</td>-->
<!--                                <td>{{ item.specification }}</td>-->
<!--                                <td>{{ item.unit }}</td>-->
<!--                                <td>{{ item.purchaseNum }}</td>-->
<!--                                <td>{{ item.deliveryNums }}</td>-->
<!--                                <td>-->
<!--                                    <el-input v-model="item.nums" @input="changeDeliveryNums"-->
<!--                                              v-mydoubleval maxlength="100" placeholder="入库数量"></el-input>-->
<!--                                </td>-->
<!--                                <td>{{ item.payTypeName }}</td>-->
<!--                                <td>-->
<!--                                    <el-date-picker v-model="item.chargeDate" @input="changeChargeDate"-->
<!--                                                    type="date" class="tl" placeholder=""-->
<!--                                                    value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>-->
<!--                                </td>-->
<!--                                <td>-->
<!--                                    <el-date-picker v-model="item.chargeDateEnd" @input="changeChargeDate"-->
<!--                                                    type="date" class="tl" placeholder=""-->
<!--                                                    value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>-->
<!--                                </td>-->
<!--                            </tr>-->
<!--                            <tr>-->
<!--                                <td>合计</td>-->
<!--                                <td></td>-->
<!--                                <td></td>-->
<!--                                <td></td>-->
<!--                                <td></td>-->
<!--                                <td></td>-->
<!--                                <td>{{ total.purchaseNum }}</td>-->
<!--                                <td>{{ total.deliveryNums }}</td>-->
<!--                                <td>{{ total.nums }}</td>-->
<!--                                <td></td>-->
<!--                                <td></td>-->
<!--                            </tr>-->
<!--                        </tbody>-->
<!--                    </table>-->
<!--                </div>-->
<!--                <div class="page-bot-btn ">-->
<!--                    <el-button size="mini" @click="openShowInWarehouse(false)">关闭</el-button>-->
<!--                    <el-button type="primary" size="mini" @click="confirmInStorage()">确认入库</el-button>-->
<!--                </div>-->
<!--            </div>-->
<!--        </el-dialog>-->
<!--        &lt;!&ndash; 入库 end&ndash;&gt;-->

        <!-- 线下采购单存档 begin-->
        <el-dialog title="线下采购单存档" class="offlinePur" :visible.sync="showOfflinePur" width="500px" :close-on-click-modal="false"
                   :close-on-press-escape="false" @close="openShowOfflinePur(false)">
            <div class="common-info flex" style="border:none;padding:0;">
                <ul class="content clearfix">
                    <li class="item item100">
                        <label class="label-term" style="width:150px;">采购单单号</label>
                        <div class="input-text">{{ info.purchaseNum }}</div>
                    </li>
                    <li class="item item100">
                        <label class="label-term" style="width:150px;">上传已盖章采购单</label>
                        <div class="input-text">
                            <div class="clearfix">
                                <myFileModel class="fl"
                                            ref="file"
                                            supportFiles="file"
                                            :disabledEdit="disabledEdit" :disabledDel="disabledDel"
                                            @successCallback="successCallback"
                                            @delCallback="delCallback">
                                </myFileModel>
                            </div>
                            <p>只支持.jpg .png .pdf .xls .xlsx格式</p>
                        </div>
                    </li>
                </ul>
                <div class="page-bot-btn ">
                    <el-button size="mini" @click="openShowOfflinePur(false)">关闭</el-button>
                    <el-button type="primary" size="mini" @click="confirmOfflinePur()">确认</el-button>
                </div>
            </div>
        </el-dialog>
        <!-- 线下采购单存档 end-->

        <!-- 查看大图 -->
        <fileViewer ref="viewer" :url-list="srcList"></fileViewer>

    </div>
</template>

<script>
import purchaseOrderManage from './purchaseOrderManage.js'
export default purchaseOrderManage
</script>
<style lang="scss" scoped>
#purchaseOrderManage{
    /deep/ .inWarehouse{
        .tableCommon{
            border:$border;
            margin:20px 0;
            .del{
                vertical-align: middle;
                @include del;
            }
        }
    }

}
</style>

