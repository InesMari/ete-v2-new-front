<template>
    <div id="packContractManage" style="height: 100%;">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
              <div class="item">
                <label class="label">客户名称：</label>
                <div class="input-text">
                  <el-input v-model="loadParam.custName" placeholder="客户名称" type="text"></el-input>
                </div>
              </div>
              <div class="item">
                <label class="label">包装名称：</label>
                <div class="input-text">
                  <el-input v-model="loadParam.packName" placeholder="包装名称" type="text"></el-input>
                </div>
              </div>
            </div>
            <div class="search-btn clearfix">
                <div class="btn">
                    <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">查询</el-button>
                </div>
                <div class="btn">
                    <el-button type="danger" plain size="mini" icon="el-icon-close" @click="clear()">清空</el-button>
                </div>
            </div>
          <!-- 操作是否隐藏搜索条件按钮，单行时按钮自动隐藏 -->
          <div class="search-bot">
            <img src="@/static/image/search-bot.png" alt="">
            <i class="icon el-icon-arrow-down"></i>
            <i class="icon el-icon-arrow-up"></i>
          </div>
        </div>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>包装合同列表</span>
                    <el-tooltip effect="light" content="包装合同列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
              <div class="table-title-btn" style="margin-right: 90px;">
                <el-button type="primary" plain size="mini" v-entity="1001059" @click="showDialog(1)">新增</el-button>
                <el-button type="primary" plain size="mini" v-entity="1001060" @click="showDialog(2)">修改</el-button>
                <el-button type="danger" plain size="mini" v-entity="1001061" @click="delContract">删除</el-button>
              </div>
            </div>
            <tableCommon tableName="packContractManageTable" ref="table" :head="head" :showNum="true" :singleSelect="true" :showSetTable="true"></tableCommon>
        </div>


      <el-dialog :title="title" :visible.sync="dialogShow" :close-on-click-modal="false" :close-on-press-escape="false" width="1000px" @close="closeDialog()">
        <div class="common-info" style="border:none;padding:0;">
          <ul class="content clearfix">
            <li class="item">
              <label class="label-term"><em>*</em>客户名称</label>
              <div class="input-text">
                <el-select v-model="info.custTenantId" @click="initCustTenantData" :disabled="type==2" clearable filterable placeholder="请选择">
                  <el-option v-for="item in custTenantData" :key="item.custTenantId" :label="item.custTenantName" :value="item.custTenantId" >
                  </el-option>
                </el-select>
              </div>
            </li>
            <li class="item">
              <label class="label-term"><em>*</em>合同有效期:</label>
              <div class="input-text">
                <el-input v-model="info.validityPeriod" placeholder="请输入月份数"></el-input>
              </div>
            </li>
            <li class="item">
              <label class="label-term"><em>*</em>税点</label>
              <div class="input-text">
                <el-input v-model="info.taxRate" placeholder="请输入税点"></el-input>
              </div>
            </li>
          </ul>
        </div>
        <div style="overflow: auto;max-height: 400px;">
           <scrollTable ref="scrollTable" :head="headDetail">
              <template v-slot="{item,code,index}">
                <div v-if="code=='packId'">
                  <el-select v-model="item.packId" placeholder="包装名字" @change="changePack" clearable filterable>
                    <el-option v-for="j in item.packData" :key="j.id" :label="j.name" :value="j.id"></el-option>
                  </el-select>
                </div>
                <div v-if="code=='freePeriod'">
                  <el-input v-model="item.freePeriod" type="text" placeholder="免租期（天）" v-mynumval></el-input>
                </div>
                <div v-if="code=='recyclePrice'">
                  <el-input v-model="item.recyclePrice" type="text" placeholder="回收单价" v-mydouble4val></el-input>
                </div>
                <div v-if="code=='price'">
                  <el-input v-model="item.price" type="text" placeholder="超期费用/租赁费用" v-mydouble4val></el-input>
                </div>
                <div v-if="code=='maxFee'">
                  <el-input v-model="item.maxFee" type="text" placeholder="费用上限" v-mydouble4val></el-input>
                </div>
                <div v-if="code=='operate'">
                  <a href="javascript:;" class="link red" style="margin-right:5px;" v-if="index!=0" @click="removeItem(index)">删除</a>
                  <a href="javascript:;" class="link" @click="addItem(index)">新增</a>
                </div>
              </template>
            </scrollTable>
        </div>
        <div class="bot-btn">
          <el-button type="primary" plain size="mini" @click="closeDialog">关闭</el-button>
          <el-button type="primary" plain size="mini" @click="saveContract">{{bottonTitle}}</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    import packContractManage from './packContractManage.js'
    export default packContractManage
</script>
<style lang="scss">

</style>
