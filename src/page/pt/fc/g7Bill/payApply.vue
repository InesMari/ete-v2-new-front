<template>
  <div id="payApply">
    <searchList :formData="formData" @doQuery="doQuery" :query="query" searchKey="g7PayApplySearch"></searchList>

    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>待申请付款列表(<span style="color: red;font-size: 12px;">--勾选可申请金额:{{totalSelFee}}--</span>)</span>
        </h3>
        <div class="table-title-btn" style="margin-right: 90px;">
          <el-button type="primary" plain size="mini" v-entity="1006142" @click="showPayApplyDialog">新增付款申请</el-button>
          <el-button type="primary" plain size="mini" v-entity="1006143" @click="download">导出Excel</el-button>
        </div>
      </div>
      <tableCommon tableName="payApplyTable" ref="table" :showNum="true" :doSelectSum="true" :showSetTable="true" :head="head"  @clickItem="clickItem" >
        <template v-slot:default="{item,index}">
          <a href="javascript:;" class="link" @click="openDetail(item)">{{item.waybillNum}}</a>
        </template>
      </tableCommon>
    </div>


    <!-- 付款申请 -->
    <el-dialog title="新增付款申请" :visible.sync="showDialog" :close-on-click-modal="false" :close-on-press-escape="false"
               :modal-append-to-body="false"
               width="80%" height="80%" @close="showDialog=false">
      <div  class="table_height orderInfo">
          <div class="search-form clearfix" style="margin-bottom:10px;">
            <div class="fr">
              <div class="item fl">
                <label class="label fl" style="line-height: 40px">申请付款金额：</label>
                <div class="input-text fl" style="width:200px;">
                  <el-input v-model="allFee" placeholder="申请付款金额" type="text"></el-input>
                </div>
              </div>
              <el-button class="fl" type="primary" plain size="mini" @click="shareFee" style="margin:5px 0 0 10px;">自动拆分</el-button>
            </div>
          </div>
        <div style="overflow: auto;max-height: 400px;">
          <scrollTable ref="scrollTable" v-if="showDialog" :head="headAdd" :doSum="true">
            <template v-slot="{item,code}">
              <div v-if="code=='receiveBankId'">
                <el-select v-model="item.receiveBankId" placeholder="开户名字" clearable filterable @change="selBank(item)">
                  <el-option v-for="j in item.supplierBankData" :key="j.receiveBankId" :label="j.label" :value="j.receiveBankId"></el-option>
                </el-select>
              </div>
              <div v-if="code=='fee'">
                <el-input v-model="item.fee" type="text" placeholder="" v-mydoubleval @input="inputFee(item)"></el-input>
              </div>
            </template>
          </scrollTable>

        </div>
      </div>
      <div class="bot-btn">
        <el-button size="mini" @click="showDialog=false">取 消</el-button>
        <el-button size="mini" type="primary" @click="applyPay">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import payApply from './payApply.js'
export default payApply
</script>

<style lang="scss">
@import '@/page/pt/ord/order.scss';
</style>
