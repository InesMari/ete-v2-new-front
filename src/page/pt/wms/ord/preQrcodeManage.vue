<template>
    <div id="preQrcodeManage">
        <select-work v-show="showSelWork"></select-work>
        <div class="search-list clearfix" v-show="!showSelWork">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                    <label class="label">条码编号：</label>
                    <div class="input-text">
                      <el-input v-model="query.codeNum" placeholder="条码编号" type="text"></el-input>
                    </div>
                </div>
              <div class="item">
                <label class="label">入库单号：</label>
                <div class="input-text">
                  <el-input v-model="query.inOrderNum" placeholder="入库单号" type="text"></el-input>
                </div>
              </div>
              <div class="item">
                <label class="label">出库单号：</label>
                <div class="input-text">
                  <el-input v-model="query.outOrderNum" placeholder="出库单号" type="text"></el-input>
                </div>
              </div>
              <div class="item">
                <label class="label">备注：</label>
                <div class="input-text">
                  <el-input v-model="query.remark" placeholder="备注" type="text"></el-input>
                </div>
              </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery">查询</el-button>
                </div>
                <div class="btn">
                    <el-button type="danger" plain size="mini" icon="el-icon-close" @click="initQuery()">清空</el-button>
                </div>
            </div>
            <!-- 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 -->
            <div class="search-bot">
                <img src="@/static/image/search-bot.png" alt="">
                <i class="icon el-icon-arrow-down"></i>
                <i class="icon el-icon-arrow-up"></i>
            </div>
        </div>
        <div class="table-content" v-show="!showSelWork">
            <div class="table-title">
                <h3>
                    <span>条码列表</span>
                    <el-tooltip effect="light" content="条码列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
                <div class="table-title-btn" style="margin-right: 90px;">
                  <el-button type="primary" plain size="mini" v-entity="1005193" @click="addQrcode">生成条码</el-button>
                  <el-button type="danger" plain size="mini" v-entity="1005194" @click="delQrcode">删除条码</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1005195" @click="codePrint">打印条码</el-button>
                  <el-button type="primary" plain size="mini" v-entity="1005196" @click="downloadExcel">导出</el-button>
                    <el-button type="primary" plain size="mini" @click="gotoLog">查看日志</el-button>
                </div>
            </div>
            <tableCommon tableName="preQrcodeManageTable" ref="table" :showNum="true" :singleSelect="false"
                         :showSetTable="true" :head="head">
              <template v-slot="{item,code}">
                <div v-if="code=='qrcodeFileUrl'">
                  <img :src="item.qrcodeFileUrl" alt="" height="56px" style="margin-top: 5px;">
                </div>
                <a href="javascript:void(0);" class="link"  v-for="(data,index) in item.outOrderNumArray" @click.stop="toDetail(item,code,index)" v-if="code=='outOrderNums'">{{index>0?','+data:data}}</a>
                <a href="javascript:void(0);" class="link"  @click.stop="toDetail(item,code)" v-if="code=='inOrderNum'">{{item.inOrderNum}}</a>
              </template>
            </tableCommon>
        </div>

      <!--    生成条码     -->
      <el-dialog title="生成条码" :visible.sync="showDialog" :close-on-click-modal="false" :close-on-press-escape="false" width="480px" @close="closeDialog()">
        <div class="common-info" style="border:none;padding:0;margin-top: -20px;">
          <ul class="content clearfix" style="margin-top: 10px;">
            <li class="item" style="width:396px;">
              <label class="label-term"><em>*</em>数量(托数)</label>
              <div  class="input-text"><el-input v-model="info.size" @input="$forceUpdate();"></el-input></div>
            </li>
          </ul>
          <ul class="content clearfix" >
            <li class="item" style="width:396px;">
              <label class="label-term">备注</label>
              <div class="input-text" >
                <el-input v-model="info.remark" type="textarea" :autosize="{minRows:5}" placeholder="" @input="$forceUpdate();"></el-input>
              </div>
            </li>
          </ul>
          <div class="page-bot-btn ">
            <el-button size="mini" @click="closeDialog()">关闭</el-button>
            <el-button type="primary" size="mini" @click="save()">提交</el-button>
          </div>
        </div>
      </el-dialog>
      <!--    生成条码     -->
    </div>
</template>

<script>
import preQrcodeManage from './preQrcodeManage.js'
export default preQrcodeManage
</script>
<style lang="scss">

</style>




