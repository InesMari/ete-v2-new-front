<template>
    <div id="addOwnVehicleBillDetail">
        <div class="search-list clearfix">
            <div class="search-form clearfix" style="width:100%;">
                <div class="item">
                    <label class="label">供应商名称</label>
                    <div class="input-text">
                        <div class="inner-text">{{bill.tenantName}}</div>
                    </div>
                </div>
                <div class="item">
                    <label class="label"><em>*</em>银行卡信息</label>
                    <div class="input-text">
                        <el-select v-model="bill.bankId" @change="changeBank(bill)" placeholder="请选择" filterable clearable>
                            <el-option v-for="item in bankData" :key="item.bankId" :label="item.bankCardInfo"
                                       :value="item.bankId"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="item">
                    <label class="label"><em>*</em>账单月份</label>
                    <div class="input-text">
                        <el-date-picker v-model="bill.billMonth" @change="checkTip" type="month" placeholder="请选择账单月份" value-format="yyyy-MM"></el-date-picker>
                    </div>
                </div>
                <div class="item">
                    <label class="label">账单备注</label>
                    <div class="input-text">
                        <el-input v-model="bill.remark" placeholder="账单备注" type="text" autocomplete="new-password"></el-input>
                    </div>
                </div>
                <div class="item">
                    <label class="label">派车单数</label>
                    <div class="input-text">
                        <div class="inner-text">{{bill.waybillNums}}</div>
                    </div>
                </div>
                <div class="item">
                    <label class="label">账单金额</label>
                    <div class="input-text">
                        <div class="inner-text">{{bill.totalFee}}</div>
                    </div>
                </div>
                <div class="item">
                    <label class="label">成本记账</label>
                    <div class="input-text">
                        <div class="inner-text">{{bill.invoiceTotalFee}}</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="table-content">
            <div class="table-title">
                <h3>
                    <span>自有车账单派车单列表(<span style="color: red;font-size: 12px;">--双击序号查看详情--</span>)</span>
                </h3>
                <div class="table-title-btn">
                    <el-button type="primary" plain size="mini" @click="recheck()">重新勾选</el-button>
                </div>
            </div>
            <simpleTable ref="table" :head="head" :data="tableData" @dblclickItem="dblclickItem" :singleSelect="true"></simpleTable>
        </div>
    </div>
</template>

<script>
	import addOwnVehicleBillDetail from './addOwnVehicleBillDetail.js'
	export default addOwnVehicleBillDetail
</script>
<style lang="scss">
  #addOwnVehicleBillDetail{
    .table-content{
      .simpleTableComponents{
        position: relative;
        .table_height{
          overflow: auto;
          min-height: 400px;
          max-height: 660px;
        }
        //表格没有数据
        .noData{
          position: absolute;
          width: 100%;
          font-size: 16px;
          color: #999;
          top: 100px;
          text-align: center;
        }
        .tableCommon .fixed-tbody{
          .el-date-editor.el-input, .el-date-editor.el-input__inner{
            width: 100%;
          }
          margin-bottom:30px;
          .el-input__inner{
            text-align: center;
          }
        }
      }
    }
  }
</style>
