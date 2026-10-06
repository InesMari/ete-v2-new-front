<template>
    <div id="wmsWaybill">
        <div v-show="isShowMain" style="height:100%;">
            <selStock ref="selStock" @next="next"></selStock>
        </div>
        <div v-show="!isShowMain" class="common-info dispatchPage orderPage" style="padding-left: 20px;padding-right: 20px;">
            <orderStock ref="orderStock" :type="type" :modifyFlag="modifyFlag"></orderStock>
            <waybillInfo ref="waybillInfo" :type="type"></waybillInfo>
<!--            <costInfo ref="costInfo"></costInfo>-->
            <feeInfo ref="feeInfo" :type="type" :is-return="isReturn"></feeInfo>
            <costList ref="costList" :type="type" :is-return="isReturn"></costList>

            <div id="costList" class="clearfix infoTable" style="padding-top: 5px">
                <h3 class="common-title mt_20">
                    <span class="title-name">本车次毛利率</span>
                </h3>
                <div class="innerTable" style="width: 100%;">
                    <table class="tableCommon" width="100%" border="0" cellspacing="0" cellpadding="0">
                        <thead>
                        <tr>
                            <th width="100">实际成本</th>
                            <th width="100">含税收入</th>
                            <th width="100">本车次毛利率(%)</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>
                                <el-input v-model="actualCost" type="text" disabled></el-input>
                            </td>
                            <td>
                                <el-input v-model="income" type="text" disabled></el-input>
                            </td>
                            <td>
                                <el-input v-model="profitRate" type="text" disabled></el-input>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="bot-btn">
                <el-button @click="quit()">退出</el-button>
                <el-button type="primary" @click="dispatch()">确定配送</el-button>
            </div>
        </div>

      <!-- 确认配送对话框 -->
      <el-dialog title="确认配送提示" :visible.sync="showDispatchDialog" width="500px" center>
        <div style="text-align: center;">
          <div v-if="isTimeout" style="margin-top: 15px;">
            <span>超时原因：</span>
            <el-select v-model="timeoutReasonSelect" placeholder="请选择超时原因" style="width: 250px; margin-left: 10px;">
              <el-option value="" disabled hidden>请选择超时原因</el-option>
              <el-option v-for="item in timeoutReasonData" :key="item.codeValue"
                         :label="item.codeName" :value="item.codeValue"></el-option>
            </el-select>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="showDispatchDialog = false">关闭</el-button>
          <el-button type="primary" @click="confirmDispatch">确认</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import wmsWaybill from './wmsWaybill.js'

export default wmsWaybill
</script>
<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>