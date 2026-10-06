<template>
  <div id="billingDetail" class="billingDetailPage">
    <div class="tagList clearfix">
      <div class="tag">
        <div class="tip"><span>客户</span></div>
        <h3 class="title">基本信息</h3>
        <div class="contet">
          <div class="item">
            <div class="label">账单编号：</div>
            <div class="text fw">LB217100100019</div>
          </div>
          <div class="item">
            <div class="label">客户名称：</div>
            <div class="text fw">
              <el-select v-model="selectValue" placeholder="请选择" @change="changeSel">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
              </el-select>
            </div>
          </div>
          <div class="item">
            <div class="label">账单月份：</div>
            <div class="text fw">
              <el-date-picker v-model="datetime" type="datetime" placeholder="选择日期时间"></el-date-picker>
            </div>
          </div>
          <div class="item">
            <div class="label">账单类型：</div>
            <div class="text fw">              
              <el-input v-model="inputvalue" v-mynumval placeholder="请输入" type="text" autocomplete="new-password"></el-input>
            </div>
          </div>
        </div>
      </div>
      <div class="tag">
        <div class="tip"><span>账单</span></div>
        <h3 class="title">账单金额</h3>
        <h5 class="cash">￥1500 元</h5>
        <div class="contet" style="padding-left:80px;">
          <div class="item">
            <div class="label fw">运输金额：</div>
            <div class="text">￥ 1032  元</div>
          </div>
          <div class="item">
            <div class="label fw">仓库金额：</div>
            <div class="text">￥ 84  元</div>
          </div>
          <div class="item">
            <div class="label fw">其他金额：</div>
            <div class="text">￥ 64  元</div>
          </div>
          <div class="item">
            <div class="label fw">补录金额：</div>
            <div class="text">￥ 80  元</div>
          </div>
        </div>
      </div>
      <div class="tag">
        <div class="tip"><span>发票</span></div>
        <h3 class="title">发票金额</h3>
        <div class="contet" style="padding-left:80px;">
          <div class="item">
            <div class="label fw" style="width:84px;">已申请金额：</div>
            <div class="text">￥ 1032  元</div>
          </div>
          <div class="item">
            <div class="label fw" style="width:84px;">未申请金额：</div>
            <div class="text">￥ 84  元</div>
          </div>
          <div class="item">
            <div class="label fw" style="width:84px;">已开具金额：</div>
            <div class="text">￥ 64  元</div>
          </div>
          <div class="item">
            <div class="label fw" style="width:84px;">未开具金额：</div>
            <div class="text">￥ 80  元</div>
          </div>
        </div>
      </div>
      <div class="tag">
        <div class="tip"><span>应收</span></div>
        <h3 class="title">应收金额</h3>
        <h5 class="cash">￥1500 元</h5>
        <div class="definite">
          <div class="label">已收款</div>
          <div class="text">￥ 300,000  元</div>
        </div>
        <div class="definite">
          <div class="label">异常收款</div>
          <div class="text">￥ 300,000  元</div>
        </div>
        <div class="definite">
          <div class="label bg_blue">未收款</div>
          <div class="text">￥ 300,000  元</div>
        </div>
        <div class="txt_c"><a href="javascript:;" class="link">查看收款明细></a></div>
      </div>
    </div>    
    <div class="table-content" style="margin:0;">
      <div class="table-title">
        <div class="tab-title clearfix">
          <div class="tab" :class="{'active':tab.active}" @click="changeTab(tab)" v-for="(tab,index) in tabs" :key="index">{{tab.name}}</div>
        </div>
        <div class="table-title-btn">
          <el-button type="primary" plain size="mini" @click="toDetail()">查看详情</el-button>
          <el-button type="primary" plain size="mini" @click="checkTicket()">导出EXCEL</el-button>
        </div>
      </div>
      <simpleTable ref="table" :head="head" :data="tableData" @clickItem="selectItem" singleSelect="true"></simpleTable>
      <!-- <tableCommon tableName="listTable" ref="table" :head="head" :showSetTable="false"></tableCommon> -->
      
    </div>
  </div>
</template>

<script>
import billingDetail from './billingDetail.js'
export default billingDetail
</script>
<style lang="scss">
.billingDetailPage{
  .table-content{
    border-top:1px dashed $border-color;
    height: calc(100% - 275px)!important;
  }
  .tagList{
    background: #fff;
    border:$border;
    border-bottom: none;
    .tag{
      float: left;
      width: 270px;
      position: relative;
      border-top: 3px solid $main-color;
      border-right: $border;
      height: 270px;
      .tip{
        position: absolute;
        left: 0;
        top: 0;
        color: #fff;
        height: 50px;
        width: 50px;
        overflow: hidden;
        box-sizing: border-box;
        padding:3px 5px;
        span{
          position: relative;
          z-index: 9;
          font-weight: bold;
        }
        &::before,&::after{
          content:"";
          position: absolute;
          top: 0;
          left: 0;
          @include trigon(25px,$main-color,top);
        }
        &::after{
          top: -1px;
          @include trigon(25px,$main-color,left);
        }
      }
      .title{
        text-align: center;
        line-height: 66px;
        font-size: 24px;
        font-weight: bold;
        color: $main-color;
      }
      .cash{
        font-size: 24px;
        color: #bf7100;
        text-align: center;
        margin-bottom:15px;
      }
      .contet{
        padding: 0 15px;
        .item{
          display: flex;
          padding:5px 0;
          .label{
            width: 70px;
            text-align: right;
            font-size: 14px;
            display: flex;
            align-items: center;
          }
          .text{
            flex:1;
            -webkit-flex:1;
            font-size: 14px;
            word-break: break-all;
            .el-select,.el-input{
              width: 100%!important;
            }
          }
        }
      }
      .definite{
        padding-left: 50px;
        margin-bottom: 15px;
        overflow: hidden;
        .label{
          float: left;
          width: 95px;
          height: 26px;
          line-height: 26px;
          text-align: center;
          background: $tip-color;
          border-top-right-radius: 10px;
          border-bottom-left-radius: 10px;
          color: #fff;
          font-size: 14px;
          &.bg_blue{
            background: $main-color;
          }
        }
        .text{
          float: left;
          margin-left: 20px;
          line-height: 26px;
        }
      }
      .link{
        text-align: center;
      }
    }
  }
}
</style>
