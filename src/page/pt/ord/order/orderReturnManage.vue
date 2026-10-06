<template>
    <div id="orderReturnManage" class="orderManagePage">
      <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="orderReturnManageSearch"></searchList>

        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>自有车回程单管理列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                    <el-tooltip effect="light" content="自有车回程单管理列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                    <el-button type="primary" plain @click="toOrderDetail(1)" size="mini" v-entity="1003085">接单</el-button>
                    <el-button type="primary" plain @click="toOrderDetail(2)" size="mini" v-entity="1003086">拒单</el-button>
                    <el-button type="primary" plain @click="showReceive(true)" size="mini" v-entity="1003089">收款登记</el-button>
                    <el-button type="primary" plain @click="showReceiveRecord" size="mini" v-entity="1003090">收款记录</el-button>
                    <el-button type="primary" plain @click="downloadExcel" size="mini" v-entity="1003093">导出</el-button>
                </div>
            </div>
            <tableCommon tableName="orderReturnManageTable" ref="table" :head="head" :showNum="true" :showSetTable="true"
                         :singleSelect="false" @dblclickItem="dblclickItem">
                <template v-slot:default="{item, code}">
                  <a href="javascript:void(0);" class="link" v-for="(data,index) in item.waybillNumArray"
                     @click.stop="toDetail(item, code,index)"
                     v-if="code=='waybillNum'">{{ index > 0 ? ',' + data : data }}</a>
                    <a href="javascript:void(0);" class="link"  @click.stop="toDetail(item, code)" v-if="code=='orderNum'">{{item[code]}}</a>
<!--                    <a href="javascript:void(0);" class="link"  @click.stop="toDetail(item, code)" v-if="code=='waybillNum'">{{item[code]}}</a>-->
                </template>
            </tableCommon>
        </div>

      <!-- 收款登记 begin-->
      <el-dialog title="收款登记" :visible.sync="receiveShow" width="500px" :close-on-click-modal="false"
                 :close-on-press-escape="false" @close="showReceive(false)">
        <div class="fcCommonPage">
          <div class="common-info" style="border:none;padding:0;">
            <p style="text-align:center;margin: -15px 0 10px;">确认需要进行收款登记操作？</p>
            <ul class="content clearfix">
              <li class="item item100">
                <label class="label-term">收款金额</label>
                <div class="input-text">
                  <el-input v-model="info.receiveFee" type="textarea" maxlength="200" placeholder="请输入收款金额，多个单一起时，只能全部登记" :disabled="info.ids.length>1"  @input="$forceUpdate();" ></el-input>
                </div>
              </li>
            </ul>
            <ul class="content clearfix;">
              <li class="item item100">
                <label class="label-term"><em>*</em>收款日期</label>
                <div class="input-text">
                  <el-date-picker v-model="info.receiveDate" type="date" placeholder="收款日期"  format="yyyy-MM-dd" value-format="yyyy-MM-dd" @blur="$forceUpdate();"></el-date-picker>
                </div>
              </li>
            </ul>
            <ul class="content clearfix">
              <li class="item item100">
                <label class="label-term">收款登记备注</label>
                <div class="input-text">
                  <el-input v-model="info.remark" type="textarea" maxlength="200" placeholder="请输入收款登记备注信息" @input="$forceUpdate();" ></el-input>
                </div>
              </li>
            </ul>
            <div class="page-bot-btn ">
              <el-button size="mini" @click="showReceive(false)">关闭</el-button>
              <el-button type="primary" size="mini" @click="receive()">确定</el-button>
            </div>
          </div>
        </div>
      </el-dialog>
      <!-- 收款登记 end-->

      <!--   列表  开始-->
      <el-dialog title="收款记录" :visible.sync="receiveRecord" width="80%" :close-on-click-modal="false" :close-on-press-escape="false" >
        <h3 style="margin-bottom: 10px;margin-top: -20px;">
          <span style="color: red;font-size: 18px;">回程单号: {{bill.orderReturnNum}}客户名称: {{bill.tenantName}}</span>
        </h3>

        <tableCommon tableName="receiveRecordTable" v-if="receiveRecord" ref="receiveRecordTable" :showNum="true"
                     :showSetTable="false" :singleSelect="true" :head="receiveRecordHead">
          <template v-slot:default="{item}">
            <el-button type="primary" size="mini" @click="cancleReceiveFee(item)">撤销收款</el-button>
          </template>
        </tableCommon>
        <div class="bot-btn" style="margin-top: 20px;">
          <el-button @click="showReceiveRecord(false)">关闭</el-button>
        </div>
      </el-dialog>
      <!--  列表  结束-->


    </div>
</template>

<script>
	import orderReturnManage from './orderReturnManage.js'
	export default orderReturnManage
</script>
<style lang="scss">

</style>





