<template>
  <div id="invoiceManager" class="invoiceManagerPage">
    <div class="search-list clearfix">
      <div class="search-form clearfix">
        <div class="item">
            <label class="label">账单编号</label>
          <div class="input-text">
            <el-input v-model="inputvalue" placeholder="账单编号" type="text"></el-input>
          </div>
        </div>
        <div class="item">
            <label class="label">账单月份</label>
          <div class="input-text">
            <el-input v-model="inputvalue" placeholder="账单编号" type="text"></el-input>
          </div>
        </div>
        <div class="item">
            <label class="label">供应商</label>
          <div class="input-text">
            <el-input v-model="inputvalue" placeholder="账单编号" type="text"></el-input>
          </div>
        </div>
      </div>
      <div class="search-btn clearfix">
        <div class="btn">
          <el-button type="primary" plain size="mini" icon="el-icon-search">搜索</el-button>
        </div>
        <div class="btn">
          <el-button type="danger" plain size="mini" icon="el-icon-close">清空</el-button>
        </div>
      </div>
    </div>
    <div class="table-content">
      <div class="table-title">
        <div class="tab-title clearfix">
          <div class="tab active">未审核</div>
          <div class="tab">审核通过</div>
          <div class="tab">审核不通过</div>
        </div>
        <div class="table-title-btn">
          <el-button type="primary" plain size="mini" @click="checkTicket()">查看发票</el-button>
          <el-button type="primary" plain size="mini" @click="checkTicket()">发票审核</el-button>
        </div>
      </div>
      <tableCommon tableName="listTable" ref="table" :head="head" :showSetTable="false"></tableCommon>
    </div>
    <div class="imageViewerOut" v-if="showViewer">
      <!-- 查看大图 -->
      <fileViewer ref="viewer" :url-list="srcList"></fileViewer>
      <div class="imageViewerInfo">
        <div class="content">
          <div class="item">
            <div class="label">账单编号：</div>
            <div class="text">LB217100100019</div>
          </div>
          <div class="item">
            <div class="label">供应商名称：</div>
            <div class="text">特快物流</div>
          </div>
          <div class="item">
            <div class="label">收款人：</div>
            <div class="text">特快物流</div>
          </div>
          <div class="item">
            <div class="label">收款账号：</div>
            <div class="text">91440101304320273G</div>
          </div>
          <div class="item">
            <div class="label">开户行：</div>
            <div class="text">平安银行</div>
          </div>
          <div class="item">
            <div class="label">支行名称：</div>
            <div class="text">平安银行广州越秀支行平安银行广州越秀支行</div>
          </div>
          <div class="item">
            <div class="label">银行卡类型：</div>
            <div class="text">对公账户</div>
          </div>
          <div class="item">
            <div class="label">备注：</div>
            <div class="text">23456</div>
          </div>
          <div class="item">
            <div class="label">提交人：</div>
            <div class="text">三哥</div>
          </div>
          <div class="item">
            <div class="label">提交时间：</div>
            <div class="text">2020-12-14 16:25:19</div>
          </div>          
          <div class="item">
            <div class="label">审核备注：</div>
            <div class="text">没有备注</div>
          </div>
        </div>        
        <div class="page-bot-btn">
            <el-button type="danger" @click="closeViewer">关闭</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import invoiceManager from './invoiceManager.js'
export default invoiceManager
</script>
