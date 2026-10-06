<template>
  <div id="orderManager" class="orderManagerPage">
    <div class="search-list clearfix">
      <div class="search-form clearfix">
        <div class="item">
            <label class="label">下单客户</label>
          <div class="input-text">
            <el-input v-model="inputvalue" v-mynumval placeholder="下单客户" type="text"></el-input>
          </div>
        </div>
        <div class="item">
            <label class="label">订单号</label>
          <div class="input-text">
            <el-input v-model="inputvalue" v-mynumval placeholder="订单号/客户单号" type="text"></el-input>
          </div>
        </div>
        <div class="item">
            <label class="label">订单类型</label>
          <div class="input-text">
            <el-select v-model="selectValue" placeholder="订单类型">
              <el-option v-for="item in options" :key="item.value" :label="item.label"></el-option>
            </el-select>
          </div>
        </div>
        <div class="item">
            <label class="label">订单状态</label>
          <div class="input-text">
            <el-select v-model="selectValue" placeholder="订单状态">
              <el-option v-for="item in options" :key="item.value" :label="item.label"></el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="search-btn clearfix">
        <div class="btn">
          <el-button type="primary" plain size="mini" icon="el-icon-search">查询</el-button>
        </div>
        <div class="btn">
          <el-button type="danger" plain size="mini" icon="el-icon-close">清空</el-button>
        </div>
      </div>
    </div>
    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>订单列表</span>
        </h3>
        <div class="table-title-btn">
          <el-button type="primary" plain size="mini">拼车调度</el-button>
          <el-button type="primary" plain size="mini">提货中转</el-button>
          <el-button type="primary" plain size="mini">整车门到门</el-button>
          <el-button type="primary" plain size="mini">中转门到门</el-button>
          <el-button type="primary" plain size="mini">查看订单</el-button>
          <el-button type="primary" plain size="mini">修改订单</el-button>
          <el-button type="primary" plain size="mini">取消订单</el-button>
          <el-button type="primary" plain size="mini">复制订单</el-button>
          <div class="switchDiv">
            <el-switch
              v-model="seeOrdRepertory"
              active-color="#13ce66">
            </el-switch>
            <span class="name" @click="changeSwitch">{{seeOrdRepertory?"关闭":"查看"}}订单库存</span> 
          </div>
        </div>
      </div>
      <div class="clearfix" style="height: calc(100% - 60px);">
        <!-- 主体表格 -->
        <div :class="{'trunLeft':seeOrdRepertory}" style="height:100%">
          <tableCommon tableName="listTable" ref="table" :head="head" :showSetTable="false"></tableCommon>
        </div>
        <!-- 右侧库存信息 -->
        <div class="ordRepertoryTable" v-show="seeOrdRepertory">
          <h4 class="title">订单：OD4419200283568 <span>库存<em>（5）</em></span></h4>
          <div class="repertory-search clearfix">            
            <label class="label">库存仓库</label>
            <div class="input-text">
              <el-input v-model="inputvalue" v-mynumval placeholder="请输入" type="text" autocomplete="new-password"></el-input>
            </div>
            <label class="label">库存状态</label>
            <div class="input-text">
              <el-select v-model="selectValue" placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
              </el-select>
            </div>
            <el-button size="mini" type="primary" style="margin-top:3px;">查询</el-button>
          </div>
          <div class="table_height">
             <div class="noData" v-if="false">暂无库存信息</div>
             <table class="tableCommon" ref="js_my_table" width="100%" border="0" cellspacing="0" cellpadding="0">
               <thead>
                 <tr>
                   <th rowspan="2">库存仓库</th>
                   <th colspan="3">库存数量</th>
                   <th rowspan="2">库存状态</th>
                 </tr>
                 <tr>
                   <th>件数（件）</th>
                   <th>重量（KG）</th>
                   <th>体积（m³）</th>             
                 </tr>
               </thead>
               <tbody>
                 <tr>
                   <td>宁德仓</td>
                   <td>0</td>
                   <td>1000</td>
                   <td>0</td>
                   <td>提货中</td>
                 </tr>
               </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import orderManager from './orderManager.js'
export default orderManager
</script>
<style lang="scss">
.orderManagerPage{
  .tableCommonComponents{
    height: 100%!important; 
  }  
  .trunLeft{
    float: left;
    width: calc(100% - 500px);
    .table_height{
      border-right: $border;
    }
  }
  .ordRepertoryTable{
    float:right;
    width: 450px;
    padding-right: 20px;
    box-sizing: border-box;
    height: 100%;
    .title{
      font-weight: bold;
      font-size: 14px;
      margin-bottom: 10px;
    }
    .repertory-search{
      .label{
        line-height: 35px;
        float: left;
        margin-right: 10px;
      }
      .input-text{
        width: 110px;
        float: left;
        margin-right: 15px;
        .el-input__inner{
          height: 35px;
          line-height: 35px;
        }
      }
    }
    .table_height{
      border:$border;
      margin-top: 10px;
      height: calc(100% - 120px);
      position: relative;
      .noData{
        position: absolute;
        width: 100%;
        font-size: 16px;
        color: #999;
        top: 100px;
        text-align: center;
      }
    }
  }
  .switchDiv{    
    padding:2px 8px;
    border:1px solid $main-color;
    border-radius: 3px;
    color: $main-color;
    display: inline-block;  
    margin-left: 10px;
    vertical-align: top;
    cursor: pointer;
    .name{
      vertical-align: middle;
      margin-left:8px;
    }
    // &:hover{
    //   color: #fff;
    //   background: $main-color;
    // }
  }
}
</style>