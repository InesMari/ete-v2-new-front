<template>
    <div id="dispatchManage">
        <div class="search-list clearfix">
            <div class="search-form clearfix" @keyup.enter="doQuery()">
                <div class="item">
                  <label class="label">调度单号：</label>
                  <div class="input-text">
                    <el-input v-model="loadParam.dispatchNum" placeholder="调度单号" type="text"></el-input>
                  </div>
                </div>
              <div class="item">
                <label class="label">订单号：</label>
                <div class="input-text">
                  <el-input v-model="loadParam.orderNum" placeholder="订单号" type="text"></el-input>
                </div>
              </div>
                <div class="item">
                    <label class="label">下单客户：</label>
                    <div class="input-text">
                        <el-input v-model="loadParam.orderCustName" placeholder="下单客户" type="text"></el-input>
                    </div>
                </div>
                <div class="item">
                  <label class="label">提货地：</label>
                  <div class="input-text">
                    <el-input v-model="loadParam.beginWorkAddress" placeholder="提货地" type="text"></el-input>
                  </div>
                </div>
                <div class="item">
                  <label class="label">卸货地：</label>
                  <div class="input-text">
                    <el-input v-model="loadParam.endWorkAddress" placeholder="卸货地" type="text"></el-input>
                  </div>
                </div>

              <div class="item">
                <label class="label">调度人：</label>
                <div class="input-text">
                  <el-input v-model="loadParam.createUserName" placeholder="调度人" type="text"></el-input>
                </div>
              </div>

              <div class="item daterange">
                <label class="label">调度时间：</label>
                <div class="input-text">
                  <el-date-picker v-model="loadParam.daterange" type="daterange" range-separator="至" start-placeholder="开始日期"
                                  end-placeholder="结束日期" value-format="yyyy-MM-dd"  :picker-options="pickerOptions" unlink-panels></el-date-picker>
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
        </div>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>调度单列表</span>
                    <el-tooltip effect="light" content="调度单列表" placement="right">
                        <img class="tip" src="@/static/image/tip.png" alt="">
                    </el-tooltip>
                </h3>
              <div class="table-title-btn" style="margin-right: 0px;">
                <el-button type="primary" plain size="mini" v-entity="88" @click="dispatch(1)">拼车调度</el-button>
                <el-button type="primary" plain size="mini" v-entity="89" @click="dispatch(2)">提货中转</el-button>
                <el-button type="primary" plain size="mini" v-entity="90" @click="dispatch(3)">整车调度</el-button>
                <el-button type="primary" plain size="mini" v-entity="91" @click="dispatch(4)">中转调度</el-button>
                <el-button type="primary" plain size="mini" v-entity="92">查看调度</el-button>
                <el-button type="primary" plain size="mini" v-entity="93">修改调度</el-button>
                <el-button type="primary" plain size="mini" v-entity="94">取消调度</el-button>
              </div>
            </div>
            <tableCommon tableName="dispatchManageTable" ref="table" :head="head" :showNum="true" :showSetTable="false"></tableCommon>
        </div>

    </div>
</template>

<script>
    import dispatchManage from './dispatchManage.js'

    export default dispatchManage
</script>
<style lang="scss">

</style>
