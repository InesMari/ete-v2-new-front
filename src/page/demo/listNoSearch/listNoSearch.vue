<template>
  <div id="listNoSearch">
    <div class="search-list clearfix">
      <div class="search-form clearfix" style="width:100%;">
        <div class="item">
            <label class="label">供应商名称</label>
            <div class="input-text">
              <div class="inner-text">xxxxxxxx</div>
            </div>
        </div>
        <div class="item">
            <label class="label">银行卡信息</label>
            <div class="input-text">
              <el-select v-model="selectValue" placeholder="请选择" @change="changeSel">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
              </el-select>
            </div>
        </div>
        <div class="item">
            <label class="label">账单月份</label>
            <div class="input-text">
              <el-select v-model="selectValue" placeholder="请选择" @change="changeSel">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item"></el-option>
              </el-select>
            </div>
        </div>
        <div class="item">
            <label class="label">账单备注</label>
            <div class="input-text">
              <el-input v-model="inputvalue"></el-input>
            </div>
        </div>
        <div class="item">
            <label class="label">派车单数</label>
            <div class="input-text">
              <div class="inner-text">xxxxxxxx</div>
            </div>
        </div>
        <div class="item">
            <label class="label">账单金额</label>
            <div class="input-text">
              <div class="inner-text">xxxxxxxx</div>
            </div>
        </div>
        <div class="item">
            <label class="label">成本记账</label>
            <div class="input-text">
              <div class="inner-text">xxxxxxxx</div>
            </div>
        </div>
      </div>
    </div>
    <div class="table-content">
      <div class="table-title">
        <h3>
          <span>列表</span>
        </h3>
        <div class="table-title-btn">
          <el-button type="primary" plain size="mini" @click="operateLog()">重新勾选</el-button>
        </div>
      </div>
      <scrollTable tableName="listTable" ref="table" :head="head" :showSetTable="false"></scrollTable>
      <div class="bot-btn">
          <el-button>关闭</el-button>
          <el-button type="primary">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import listNoSearch from './listNoSearch.js'
export default listNoSearch
</script>
<style lang="scss">
#listNoSearch{
  .table-content{
    .scrollTableComponents{
      height: calc(100% - 150px);
      .table_height{
        height: 100%;
        max-height: initial;
      }
    }
  }
}
</style>
