<template>
  <div id="selStock" class="selStockPage" style="height:100%;">
      <div class="search-list clearfix"  @keyup.enter="doQuery()">
        <div class="search-form clearfix">
          <div class="item">
            <label class="label">下单客户</label>
            <div class="input-text">
              <el-input v-model="param.orderCustName" placeholder="下单客户" type="text"></el-input>
            </div>
          </div>
          <div class="item daterange">
            <label class="label">下单时间</label>
            <div class="input-text">
              <el-date-picker v-model="param.daterange" type="daterange" range-separator="至" start-placeholder="开始日期"
                              end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"
                              unlink-panels></el-date-picker>
            </div>
          </div>
          <div class="item">
            <label class="label">订单号</label>
            <div class="input-text">
              <el-input v-model="param.orderNum" placeholder="订单号" type="text"></el-input>
            </div>
          </div>
          <div class="item">
            <label class="label">库存仓库</label>
            <div class="input-text">
              <el-input v-model="param.workNameKeyword" placeholder="库存仓库" type="text"></el-input>
            </div>
          </div>
          <div class="item">
            <label class="label">货物重量</label>
            <div class="input-text sel-ipt">
              <el-select v-model="param.goodsWeightSymbol" clearable placeholder="">
                <el-option v-for="item in symbolOptions" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
              <el-input v-model="param.goodsWeight" v-mydouble4val placeholder="重量" type="text"></el-input>
            </div>
          </div>
          <div class="item">
            <label class="label">货物体积</label>
            <div class="input-text sel-ipt">
              <el-select v-model="param.goodsVolumeSymbol" clearable placeholder="">
                <el-option v-for="item in symbolOptions" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
              <el-input v-model="param.goodsVolume" v-mydouble4val placeholder="体积" type="text"></el-input>
            </div>
          </div>
          <div class="item">
            <label class="label">货物件数</label>
            <div class="input-text sel-ipt">
              <el-select v-model="param.goodsCountSymbol" clearable placeholder="">
                <el-option v-for="item in symbolOptions" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
              <el-input v-model="param.goodsCount" v-mynumval placeholder="件数" type="text"></el-input>
            </div>
          </div>
          <div class="item">
            <label class="label">中途点数</label>
            <div class="input-text sel-ipt">
              <el-select v-model="param.midwayPointNumSymbol" clearable placeholder="">
                <el-option v-for="item in symbolOptions" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
              <el-input v-model="param.midwayPointNum" v-mynumval placeholder="中途点数" type="text"></el-input>
            </div>
          </div>
          <div class="item">
            <label class="label">目的地</label>
            <div class="input-text">
              <el-input v-model="param.destWorkNameKeyword" placeholder="目的地" type="text"></el-input>
            </div>
          </div>
          <div class="item daterange" v-if="dispatchType==3">
            <label class="label">提货时间</label>
            <div class="input-text">
              <el-date-picker v-model="param.pickupDate" type="daterange" range-separator="至" start-placeholder="开始日期"
                              end-placeholder="结束日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"
                              unlink-panels></el-date-picker>
            </div>
          </div>
          <div class="item" v-if="dispatchType==3">
            <label class="label">车型</label>
            <div class="input-text">
              <el-select v-model="param.vehicleType" clearable filterable placeholder="">
                <el-option v-for="item in vehicleTypeOptions" :key="item.codeValue" :label="item.codeName"
                           :value="item.codeValue"></el-option>
              </el-select>
            </div>
          </div>
          <div class="item" v-if="dispatchType==3">
            <label class="label">车长</label>
            <div class="input-text">
              <el-select v-model="param.vehicleLength" clearable filterable placeholder="">
                <el-option v-for="item in vehicleLengthOptions" :key="item.codeValue" :label="item.codeName"
                           :value="item.codeValue"></el-option>
              </el-select>
            </div>
          </div>
          <div class="item" v-if="dispatchType==3">
            <label class="label">线路名称</label>
            <div class="input-text">
              <el-input v-model="param.routeName" placeholder="线路名称" type="text"></el-input>
            </div>
          </div>
        </div>
        <div class="search-btn clearfix">
          <div class="btn">
            <el-button type="primary" plain size="mini" icon="el-icon-search" @click="doQuery()">搜索</el-button>
          </div>
          <div class="btn">
            <el-button type="danger" plain size="mini" icon="el-icon-close" @click="clear()">清空</el-button>
          </div>
        </div>
      </div>
      <div class="table-content">
        <div class="table-title">
          <h3>
            <span>库存单列表</span>
            <el-tooltip effect="light" :content="tips" placement="right">
              <img class="tip" src="@/static/image/tip.png" alt="">
            </el-tooltip>
          </h3>
          <div class="table-title-btn">
            <el-button type="primary" plain size="mini" @click="next()">下一步</el-button>
          </div>
        </div>
        <dbTable tableName="selStockTable" ref="table" :head="head" onlyId="orderStockId" relatedId="orderId" v-if="dispatchType==3"></dbTable>
        <dbTable tableName="selStockTable" ref="table" :head="head" onlyId="orderStockId" v-if="dispatchType!=3"></dbTable>
      </div>
    </div>
</template>

<script>
import selStock from './selStock.js'
export default selStock
</script>
<style lang="scss">
.selStockPage{
  .table-content{
    height: calc(100% - 95px)!important;
    .tableCommonDiv{
      height: calc(100% - 50px);
    }
  }
  .search-list{
    .search-form .item {
      .sel-ipt{
        &>.el-select{
          float: left;
          width: 40%;
        }
        &>.el-input{
          float: left;
          width: 60%;
        }
      }
    }
  }
}
</style>
