<template>
  <div id="inventoryOrdMerge" class="inventoryOrdMergePage">
    <div v-show="isShowMain">
      <div class="search-list clearfix">
        <div class="search-form clearfix">
          <div class="item">
              <label class="label">下单客户</label>
              <div class="input-text">
                <el-input v-model="inputvalue" v-mynumval placeholder="下单客户" type="text"></el-input>
              </div>
          </div>
          <div class="item">
              <label class="label">下单时间</label>
              <div class="input-text">
                <el-input v-model="inputvalue" v-mynumval placeholder="下单时间" type="text"></el-input>
              </div>
          </div>
          <div class="item">
              <label class="label">订单号</label>
              <div class="input-text">
                <el-input v-model="inputvalue" v-mynumval placeholder="订单号" type="text"></el-input>
              </div>
          </div>
          <div class="item">
              <label class="label">库存仓库</label>
              <div class="input-text">
                <el-input v-model="inputvalue" v-mynumval placeholder="库存仓库" type="text"></el-input>
              </div>
          </div>
          <div class="item">
              <label class="label">货物重量</label>
              <div class="input-text sel-ipt">
                <el-select v-model="selectValue" placeholder="" >
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                </el-select>
                <el-input v-model="inputvalue" v-mynumval placeholder="重量" type="text"></el-input>
              </div>
          </div>
          <div class="item">
              <label class="label">货物体积</label>
              <div class="input-text sel-ipt">
                <el-select v-model="selectValue" placeholder="" >
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                </el-select>
                <el-input v-model="inputvalue" v-mynumval placeholder="体积" type="text"></el-input>
              </div>
          </div>
          <div class="item">
              <label class="label">货物件数</label>
              <div class="input-text sel-ipt">
                <el-select v-model="selectValue" placeholder="" >
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                </el-select>
                <el-input v-model="inputvalue" v-mynumval placeholder="件数" type="text"></el-input>
              </div>
          </div>
          <div class="item">
              <label class="label">中途点数</label>
              <div class="input-text sel-ipt">
                <el-select v-model="selectValue" placeholder="" >
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
                </el-select>
                <el-input v-model="inputvalue" v-mynumval placeholder="中途点数" type="text"></el-input>
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
          <h3>
            <span>列表</span>
            <el-tooltip effect="light" content="Right Center 提示文字" placement="right">
              <img class="tip" src="@/static/image/tip.png" alt="">
            </el-tooltip>
          </h3>
          <div class="table-title-btn">
            <el-button type="primary" plain size="mini" @click="next">下一步</el-button>
          </div>
        </div>
        <dbTable tableName="addQuoteManageLDTable" ref="table" :head="head" onlyId="workId"></dbTable>
      </div>
    </div>
    <!-- 
      data：传递数据
      hideComponent：子组件关闭回调方法，子组件写法：this.$emit("hide");需传参则this.$emit("hide",data);
     -->
    <div v-show="!isShowMain">
      <dispatch :data="data" @hide="hideComponent"></dispatch>
    </div>
    <!-- 多个子页面时候为了避免全部渲染，建议组件加上v-if，按需渲染，如下注释 -->
    <!-- <div v-show="!isShowMain">
      <dispatch :data="data" @hide="hideComponent" v-if="isShow1"></dispatch>
      <dispatch :data="data" @hide="hideComponent" v-if="isShow2"></dispatch>
      <dispatch :data="data" @hide="hideComponent" v-if="isShow3"></dispatch>
    </div> -->
  </div>
</template>

<script>
import inventoryOrdMerge from './inventoryOrdMerge.js'
export default inventoryOrdMerge
</script>
<style lang="scss">
.inventoryOrdMergePage{
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